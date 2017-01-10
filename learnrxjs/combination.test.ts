import { Observable } from 'rxjs';

describe('RxJS - Combination', function () {
  this.timeout(30000);
  afterEach(() => console.log('\n'));

  /**
   * signature: combineAll(project: function): Observable
   * When source observable completes use combineLatest with collected observables.
   */
  context('combineAll', () => {
    it('Mapping to inner interval observable', done => {
      const source = Observable.interval(100).take(2);
      const example = source.map(val => Observable.interval(val + 50).take(2));
      const combined = example.combineAll();
      const subscribe = combined.subscribe(console.log, null, done);
    });

    it('Mapping to inner interval observable with projection', done => {
      const source = Observable.interval(100).take(2);
      const example = source.map(val => Observable.interval(val + 50).take(2));
      const combined = example.combineAll((one, two) => `one: ${one} two: ${two}`);

      const subscribe = combined.subscribe(console.log, null, done);
    });
  });

  /**
   * signature: combineLatest(observables: ...Observable, project: function): Observable
   * When any observable emits a value, emit the latest value from each.
   */
  context('combineLatest', () => {
    it('Combining observables emitting at 3 intervals', done => {
      const timerOne = Observable.timer(100, 400);
      const timerTwo = Observable.timer(200, 400);
      const timerThree = Observable.timer(300, 400);

      const combined = Observable.combineLatest(timerOne, timerTwo, timerThree);

      const subscribe = combined.subscribe(latestValues => {
        const [timerValOne, timerValTwo, timerValThree] = latestValues;
        console.log(`Timer One Latest: ${timerValOne}, 
Timer Two Latest: ${timerValTwo}, 
Timer Three Latest: ${timerValThree}`);
      });

      setTimeout(() => {
        subscribe.unsubscribe();
        done();
      }, 2000);
    });
    it('combineLatest with projection function', done => {
      const timerOne = Observable.timer(100, 400);
      const timerTwo = Observable.timer(200, 400);
      const timerThree = Observable.timer(300, 400);

      const combinedProject = Observable
        .combineLatest(timerOne, timerTwo, timerThree, (one, two, three) => {
          return `Timer One (Proj) Latest: ${one},
Timer Two (Proj) Latest: ${two}, 
Timer Three (Proj) Latest: ${three}`
        });
      const subscribe = combinedProject.subscribe(latestValuesProject => console.log(latestValuesProject));
      setTimeout(() => {
        subscribe.unsubscribe();
        done();
      }, 2000);
    });
  });

  /**
   * signature: concat(observables: ...*): Observable
   * Subscribe to observables in order as previous completes, emit values.
   */
  context('concat', () => {
    it('concat 2 basic observables', () => {
      const sourceOne = Observable.of(1, 2, 3);
      const sourceTwo = Observable.of(4, 5, 6);
      const example = sourceOne.concat(sourceTwo);
      const subscribe = example.subscribe(val => console.log('Example: Basic concat:', val));
    });
    it('concat as static method', () => {
      const sourceOne = Observable.of(1, 2, 3);
      const sourceTwo = Observable.of(4, 5, 6);

      const example = Observable.concat(sourceOne, sourceTwo);
      const subscribe = example.subscribe(val => console.log('Example: static', val));
    });
    it('concat with delayed source', done => {
      const sourceOne = Observable.of(1, 2, 3);
      const sourceTwo = Observable.of(4, 5, 6);
      const sourceThree = sourceOne.delay(300);
      const example = sourceThree.concat(sourceTwo);
      const subscribe = example.subscribe(val => console.log('Example: Delayed source one:', val), null, done);
    });
    it('concat with source that does not complete', done => {
      const source = Observable.concat(Observable.interval(100), Observable.of('This', 'Never', 'Runs'));
      const subscribe = source.subscribe(val => console.log('Example: Source never completes, second observable never runs:', val));
      setTimeout(done, 1000);
    });
  });

  /**
   * signature: concatAll(): Observable
   * Collect observables and subscribe to next when previous completes.
   */
  context('concatAll', () => {
    it('concatAll with observable', done => {
      const source = Observable.interval(200);
      const example = source.map(val => Observable.of(val + 10)).concatAll();
      const subscribe = example.subscribe(val => console.log('Example with Basic Observable:', val));

      setTimeout(() => {
        subscribe.unsubscribe();
        done();
      }, 1000);
    });
    it('concatAll with promise', done => {
      const samplePromise = val => new Promise(resolve => resolve(val));
      const source = Observable.interval(200);

      const example = source
        .map<any, any>(val => samplePromise(val))
        .concatAll();
      const subscribe = example.subscribe(val => console.log('Example with Promise:', val));

      setTimeout(() => {
        subscribe.unsubscribe();
        done();
      }, 1000);
    });
    it('Delay while inner observables complete', done => {
      const obs1 = Observable.interval(100).take(5).map(val => `obs1: ${val}`);
      const obs2 = Observable.interval(50).take(2).map(val => `obs2: ${val}`);
      const obs3 = Observable.interval(200).take(1).map(val => `obs3: ${val}`);

      const source = Observable.of(obs1, obs2, obs3);
      const example = source.concatAll();

      const subscribe = example.subscribe(console.log, null, done);
    });
  });

  /**
   * signature: forkJoin(...args, selector : function): Observable
   * When all observables complete emit the last value from each.
   */
  context('forkJoin', () => {
    it('Making variable number of requests', done => {
      const myPromise = val => new Promise(resolve => setTimeout(() => resolve(`Promise Resolved: ${val}`), 500));

      const example = Observable.forkJoin(
        Observable.of('Hello'),
        Observable.of('World').delay(100),
        Observable.interval(100).take(1),
        Observable.interval(100).take(2),
        myPromise('RESULT')
      );
      const subscribe = example.subscribe(console.log);

      const queue = Observable.of([1, 2, 3, 4, 5]);
      const exampleTwo = queue.mergeMap(q => Observable.forkJoin(...q.map(myPromise)));
      const subscribeTwo = exampleTwo.subscribe(console.log, null, done);
    });
  });

  /**
   * signature: merge(input: Observable): Observable
   * Turn multiple observables into a single observable.
   */
  context('merge', () => {
    it('merging multiple observables, static method', done => {
      const first = Observable.interval(250);
      const second = Observable.interval(200);
      const third = Observable.interval(150);
      const fourth = Observable.interval(100);

      const example = Observable.merge(
        first.mapTo('FIRST!'),
        second.mapTo('SECOND!'),
        third.mapTo('THIRD'),
        fourth.mapTo('FOURTH')
      );
      const subscribe = example.subscribe(console.log);

      setTimeout(() => {
        subscribe.unsubscribe();
        done();
      }, 2000);
    });
    it('merge 2 observables, instance method', done => {
      const first = Observable.interval(250).mapTo('FIRST');
      const second = Observable.interval(100).mapTo('SECOND');
      const example = first.merge(second);
      const subscribe = example.subscribe(console.log);

      setTimeout(() => {
        subscribe.unsubscribe();
        done();
      }, 2000);
    });
  });

  /**
   * signature: mergeAll(concurrent: number): Observable
   * Collect and subscribe to all observables.
   */
  context('mergeAll', () => {
    it('mergeAll with promises', done => {
      const myPromise = val => new Promise(resolve => setTimeout(() => resolve(`Result: ${val}`), 200));
      const source = Observable.of(1, 2, 3);
      const example = source
        .map<any, any>(val => myPromise(val))
        .mergeAll();

      const subscribe = example.subscribe(console.log, null, done);
    });
    it('mergeAll with concurrent parameter', done => {
      const interval = Observable.interval(50).take(5);
      const example = interval
        .map(val => interval.delay(100).take(3).map(ival => `interval : ${val} ${ival}`))
        .mergeAll()
        .subscribe(console.log, null, done);
    });
    it('mergeAll with concurrent parameter 2', done => {
      const interval = Observable.interval(50);
      const example = Observable.range(1, 10).map(val => interval.take(10).map(ival => `interval : ${val} ${ival}`))
        .mergeAll(5)
        .subscribe(console.log, null, done);
    });
  });

  /**
   * signature: race(): Observable
   * The observable to emit first is used.
   */
  context('race', () => {
    it('race with 4 observables', done => {
      const example = Observable.race(
        Observable.interval(150),
        Observable.interval(100).mapTo('1s won!'),
        Observable.interval(200),
        Observable.interval(250)
      );
      const subscribe = example.subscribe(console.log, console.error);
      setTimeout(() => {
        subscribe.unsubscribe();
        done();
      }, 1000);
    });

    it('race with an error', done => {
      const first = Observable.of('first').delay(100).map(() => {
        throw 'error!!'
      });
      const second = Observable.of('second').delay(200);
      const third = Observable.of('third').delay(300);

      const race = Observable.race(first, second, third).subscribe(console.log, error => {
        console.error(error);
        done();
      });
    })
  });

  /**
   * signature: startWith(an: Values): Observable
   * Emit given value first.
   */
  context('startWith', () => {
    it('startWith on number sequence', () => {
      const source = Observable.of(1, 2, 3);
      const example = source.startWith(0);
      const subscribe = example.subscribe(console.log);
    });

    it('startWith for initial scan value', () => {
      const source = Observable.of('World!', 'Goodbye', 'World!');
      const example = source
        .startWith('Hello')
        .scan((acc, curr) => `${acc} - ${curr}`, 'Real first');

      const subscribe = example.subscribe(console.log);
    });

    it('startWith multiple values', done => {
      const source = Observable.interval(100);
      const example = source.startWith(-3, -2, -1);
      const subscribe = example.subscribe(console.log);

      setTimeout(() => {
        subscribe.unsubscribe();
        done();
      }, 1000);
    });
  });

  /**
   * signature: withLatestFrom(other: Observable, project: Function): Observable
   * Also provide the last value from another observable.
   */
  context('withLatestFrom', () => {
    it('Latest value from quicker second source', done => {
      const source = Observable.interval(500);
      const secondSource = Observable.interval(100);
      const example = source
        .withLatestFrom(secondSource)
        .map(([first, second]) => {
          return `First Source (500ms): ${first} Second Source (100ms): ${second}`;
        });
      const subscribe = example.subscribe(console.log);

      setTimeout(() => {
        subscribe.unsubscribe();
        done();
      }, 2000);
    });

    it('Slower second source', done => {
      const source = Observable.interval(500);
      const secondSource = Observable.interval(100);

      const example = secondSource
        .withLatestFrom(source)
        .map(([first, second]) => {
          return `Source (100ms): ${first} Latest From (500ms): ${second}`;
        });
      const subscribe = example.subscribe(console.log);

      setTimeout(() => {
        subscribe.unsubscribe();
        done();
      }, 2000);
    });
  });

  /**
   * signature: zip(observables: *): Observable
   * Description
   * TL;DR: After all observables emit, emit values as an array
   * The zip operator will subscribe to all inner observables, waiting for each to emit a value.
   * Once this occurs, all values with the corresponding index will be emitted.
   * This will continue until at least one inner observable completes.
   */
  context('zip', () => {
    it('zip multiple observables emitting at alternate intervals', done => {
      const sourceOne = Observable.of('Hello');
      const sourceTwo = Observable.of('World!');
      const sourceThree = Observable.of('Goodbye');
      const sourceFour = Observable.of('World!');

      const example = Observable
        .zip(
          sourceOne,
          sourceTwo.delay(100),
          sourceThree.delay(200),
          sourceFour.delay(300)
        );

      const subscribe = example.subscribe(console.log, console.error, done);
    });

    it('zip when 1 observable completes', done => {
      const interval = Observable.interval(100);
      const example = Observable
        .zip(
          interval,
          interval.take(2)
        );
      const subscribe = example.subscribe(console.log, console.error, done);
    });
  });
});