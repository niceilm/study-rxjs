import { Observable, Subject } from 'rxjs';
describe('RxJS - Transformation', function () {
  this.timeout(30000);
  afterEach(() => console.log('\n'));

  /**
   * signature: buffer(closingNotifier: Observable): Observable
   * Collect output values until provided observable emits, emit as array.
   */
  context('buffer', () => {
    it('Buffer until document click', done => {
      const myInterval = Observable.interval(100);
      const bufferBy = Observable.interval(300);
      const myBufferedInterval = myInterval.buffer(bufferBy);
      const subscribe = myBufferedInterval.subscribe(val => console.log(' Buffered Values:', val));

      setTimeout(() => {
        subscribe.unsubscribe();
        done();
      }, 1000);
    });
  });

  /**
   * signature: bufferCount(bufferSize: number, startBufferEvery: number = null): Observable
   * Collect emitted values until provided number is fulfilled, emit as array.
   */
  context('bufferCount', () => {
    it('Collect buffer and emit after specified number of values', done => {
      const source = Observable.interval(100);
      const bufferThree = source.bufferCount(3);
      const subscribe = bufferThree.subscribe(val => console.log('Buffered Values:', val));
      setTimeout(() => {
        subscribe.unsubscribe();
        done();
      }, 1000);
    });
    it('Overlapping buffers', done => {
      const source = Observable.interval(100);
      const bufferEveryOne = source.bufferCount(3, 1);
      const subscribe = bufferEveryOne.subscribe(val => console.log('Start Buffer Every 1:', val));
      setTimeout(() => {
        subscribe.unsubscribe();
        done();
      }, 1000);
    });
  });

  /**
   * signature: bufferTime(bufferTimeSpan: number, bufferCreationInterval: number, scheduler: Scheduler): Observable
   * Collect emitted values until provided time has passed, emit as array.
   */
  context('bufferTime', () => {
    it('Buffer for 2 seconds', done => {
      const source = Observable.interval(50);
      const example = source.bufferTime(200);
      const subscribe = example.subscribe(val => console.log('Buffered with Time:', val));
      setTimeout(() => {
        subscribe.unsubscribe();
        done();
      }, 1000);
    });
    it('Multiple active buffers', done => {
      const source = Observable.interval(50);
      const example = source.bufferTime(200, 100);
      const subscribe = example.subscribe(val => console.log('Start Buffer Every 100ms:', val));
      setTimeout(() => {
        subscribe.unsubscribe();
        done();
      }, 1000);
    });
  });

  /**
   * signature: bufferToggle(openings: Observable, closingSelector: Function): Observable
   * Toggle on to catch emitted values from source, toggle off to emit buffered values as array.
   */
  context('bufferToggle', () => {
    it('Toggle buffer on and off at interval', done => {
      const sourceInterval = Observable.interval(100);
      const startInterval = Observable.interval(500);
      const closingInterval = val => {
        console.log(`Value ${val} emitted, starting buffer! Closing in 300ms!`);
        return Observable.interval(300);
      };
      const bufferToggleInterval = sourceInterval.bufferToggle(startInterval, closingInterval);
      const subscribe = bufferToggleInterval.subscribe(val => console.log('Emitted Buffer:', val));
      setTimeout(() => {
        subscribe.unsubscribe();
        done();
      }, 1500);
    });
  });

  /**
   * signature: bufferWhen(closingSelector: function): Observable
   * Collect all values until closing selector emits, emit buffered values.
   */
  context('bufferWhen', () => {
    it('Emit buffer based on interval', done => {
      const oneSecondInterval = Observable.interval(100);
      const fiveSecondInterval = () => Observable.interval(500);
      const bufferWhenExample = oneSecondInterval.bufferWhen(fiveSecondInterval);
      const subscribe = bufferWhenExample.subscribe(val => console.log('Emitted Buffer: ', val));

      setTimeout(() => {
        subscribe.unsubscribe();
        done();
      }, 3000);
    });
  });

  /**
   * signature: concatMap(project: function, resultSelector: function): Observable
   * Map values to inner observable, subscribe and emit in order.
   */
  context('concatMap', () => {
    it('Map to inner observable', () => {
      const source = Observable.of('Hello', 'Goodbye');
      const example = source.concatMap(val => Observable.of(`${val} World!`));
      const subscribe = example.subscribe(val => console.log('Example One:', val));
    });
    it('Map to promise', () => {
      const source = Observable.of('Hello', 'Goodbye');
      const examplePromise = val => new Promise(resolve => resolve(`${val} World!`));
      const example = source.concatMap(val => examplePromise(val));
      const subscribe = example.subscribe(val => console.log('Example w/ Promise:', val));
    });
    it('Supplying a projection function', () => {
      const source = Observable.of('Hello', 'Goodbye');
      const examplePromise = val => new Promise(resolve => resolve(`${val} World!`));
      const example = source.concatMap(val => examplePromise(val), (outerValue, innerValue) => `${innerValue} w/ selector!`);
      const subscribe = example.subscribe(val => console.log('Example w/ Selector:', val));
    });
  });

  /**
   * signature: concatMapTo(observable: Observable, resultSelector: function): Observable
   * Subscribe to provided observable when previous completes, emit values.
   */
  context('concatMapTo', () => {
    it('Map to basic observable', done => {
      const interval = Observable.interval(200);
      const message = Observable.of('Millisecond(ms) elapsed!');
      const example = interval.concatMapTo(message, (time, msg) => `${time * 100} ${msg}`);

      const subscribe = example.subscribe(val => console.log(val));

      setTimeout(() => {
        subscribe.unsubscribe();
        done();
      }, 1000)
    });
    it('Map to observable that emits at slower pace', done => {
      const interval = Observable.interval(200);
      const source = Observable.interval(100).take(5);
      const example = interval
        .concatMapTo(source,
          (firstInterval, secondInterval) => `${firstInterval} ${secondInterval}`
        );
      const subscribe = example.subscribe(val => console.log(val));

      setTimeout(() => {
        subscribe.unsubscribe();
        done();
      }, 1000)
    });
  });

  /**
   * signature: expand(project: function, concurrent: number, scheduler: Scheduler): Observable
   * Recursively call provided function.
   */
  context('expand', () => {
    it('Add one for each invocation', () => {
      const source = Observable.of(2);
      const example = source
        .expand(val => {
          console.log(`Passed value: ${val}`);
          return Observable.of(1 + val);
        })
        .take(5);
      const subscribe = example.subscribe(val => console.log(`RESULT: ${val}`));
    });
  });

  /**
   * signature: groupBy(keySelector: Function, elementSelector: Function): Observable
   * Group into observables based on provided value.
   */
  context('groupBy', () => {
    it('Group by property', () => {
      const people = [{ name: 'Sue', age: 25 }, { name: 'Joe', age: 30 }, { name: 'Frank', age: 25 }, { name: 'Sarah', age: 35 }];
      const source = Observable.from(people);

      const example = source
        .groupBy(person => person.age)
        .flatMap<any, any[]>(group => group.reduce((acc, curr) => [...acc, ...curr], []));
      const subscribe = example.subscribe(val => console.log(val));
    });
  });

  /**
   * signature: map(project: Function, thisArg: any): Observable
   * Apply projection with each value from source.
   */
  context('map', () => {
    it('Add 10 to each number', () => {
      const source = Observable.from([1, 2, 3, 4, 5]);
      const example = source.map(val => val + 10);
      const subscribe = example.subscribe(val => console.log(val));
    });
    it('Map to single property', () => {
      const source = Observable.from([{ name: 'Joe', age: 30 }, { name: 'Frank', age: 20 }, { name: 'Ryan', age: 50 }]);
      const example = source.map(person => person.name);
      const subscribe = example.subscribe(val => console.log(val));
    });
  });

  /**
   * signature: mapTo(value: any): Observable
   * Map emissions to constant value.
   */
  context('mapTo', () => {
    it('Map every emission to string', done => {
      const source = Observable.interval(200);
      const example = source.mapTo('HELLO WORLD!');
      const subscribe = example.subscribe(val => console.log(val));

      setTimeout(() => {
        subscribe.unsubscribe();
        done();
      }, 1000);
    });

    it('Mapping clicks to string', done => {
      const generateRandom = () => Observable.timer(parseInt((Math.random() * 500) + '', 10) + 100);
      const source = generateRandom().expand(val => generateRandom());
      const example = source.mapTo('GOODBYE WORLD!');
      const subscribe = example.subscribe(val => console.log(val));

      setTimeout(() => {
        subscribe.unsubscribe();
        done();
      }, 2000);
    });
  });

  /**
   * signature: mergeMap(project: function: Observable, resultSelector: function: any, concurrent: number): Observable
   * Map to observable, emit values.
   */
  context('mergeMap', () => {
    it('mergeMap with observable', () => {
      const source = Observable.of('Hello');
      const example = source.mergeMap(val => Observable.of(`${val} World!`));
      const subscribe = example.subscribe(val => console.log(val));
    });
    it('mergeMap with promise', () => {
      const source = Observable.of('Hello');
      const myPromise = val => new Promise(resolve => resolve(`${val} World From Promise!`));
      const example = source.mergeMap(val => myPromise(val));
      const subscribe = example.subscribe(val => console.log(val));
    });

    it('mergeMap with resultSelector', () => {
      const source = Observable.of('Hello');
      const myPromise = val => new Promise(resolve => resolve(`${val} World From Promise!`));
      const example = source
        .mergeMap(val => myPromise(val),
          (valueFromSource, valueFromPromise) => {
            return `Source: ${valueFromSource}, Promise: ${valueFromPromise}`;
          });
      const subscribe = example.subscribe(val => console.log(val));
    });

    it('mergeMap with concurrent value', done => {
      const source = Observable.interval(100);
      const example = source.mergeMap(
        val => Observable.interval(500).take(2),
        (oVal, iVal, oIndex, iIndex) => [oIndex, oVal, iIndex, iVal],
        1
      );
      const subscribe = example.subscribe(val => console.log(val));

      setTimeout(() => {
        subscribe.unsubscribe();
        done();
      }, 5000);
    });
  });

  /**
   * signature: partition(predicate: function: boolean, thisArg: any): [Observable, Observable]
   * Split one observable into two based on provided predicate.
   */
  context('partition', () => {
    it('Split even and odd numbers', () => {
      const source = Observable.from([1, 2, 3, 4, 5, 6]);
      const [evens, odds] = source.partition(val => val % 2 === 0);
      const subscribe = Observable.merge(
        evens
          .map(val => `Even: ${val}`),
        odds
          .map(val => `Odd: ${val}`)
      ).subscribe(val => console.log(val));
    });
    it('Split success and errors', () => {
      const source = Observable.from([1, 2, 3, 4, 5, 6]);
      const example = source
        .map(val => {
          if (val > 3) {
            throw `${val} greater than 3!`
          }
          return { success: val };
        })
        .catch(val => Observable.of({ error: val }));
      const [success, error] = example.partition<any>(res => res.success);

      const subscribe = Observable.merge(
        success.map(val => `Success! ${val.success}`),
        error.map(val => `Error! ${val.error}`)
      ).subscribe(val => console.log(val));
    });
  });

  /**
   * signature: pluck(properties: ...args): Observable
   * Select properties to emit.
   */
  context('pluck', () => {
    it('Pluck object property', () => {
      const source = Observable.from([
        { name: 'Joe', age: 30 },
        { name: 'Sarah', age: 35 }
      ]);
      const example = source.pluck('name');
      const subscribe = example.subscribe(val => console.log(val));
    });
    it('Pluck nested properties', () => {
      const source = Observable.from([
        { name: 'Joe', age: 30, job: { title: 'Developer', language: 'JavaScript' } },
        { name: 'Sarah', age: 35 }
      ]);
      const example = source.pluck('job', 'title');
      const subscribe = example.subscribe(val => console.log(val));
    });
  });

  /**
   * signature: scan(accumulator: function, seed: any): Observable
   * Reduce over time.
   */
  context('scan', () => {
    it('Sum over time', () => {
      const subject = new Subject();
      const example = subject
        .startWith(0)
        .scan<number>((acc, curr) => acc + curr);
      const subscribe = example.subscribe(val => console.log('Accumulated total:', val));
      subject.next(1); //1
      subject.next(2); //3
      subject.next(3); //6
    });
    it('Accumulating an object', () => {
      const subject = new Subject();
      const example = subject.scan((acc, curr) => Object.assign({}, acc, curr), {});
      const subscribe = example.subscribe(val => console.log('Accumulated object:', val));
      subject.next({ name: 'Joe' }); // {name: 'Joe'}
      subject.next({ age: 30 }); // {name: 'Joe', age: 30}
      subject.next({ favoriteLanguage: 'JavaScript' }); // {name: 'Joe', age: 30, favoriteLanguage: 'JavaScript'}
    });
  });

  /**
   * signature: switchMap(project: function: Observable, resultSelector: function(outerValue, innerValue, outerIndex, innerIndex): any): Observable
   * Map to observable, complete previous inner observable, emit values.
   */
  context('switchMap', () => {
    it('Restart interval every 5 seconds', done => {
      const source = Observable.timer(0, 500);
      const example = source.switchMap(() => Observable.interval(50));
      const subscribe = example.subscribe(val => console.log(val));
      setTimeout(() => {
        subscribe.unsubscribe();
        done();
      }, 3000);
    });
    it('Reset on every click', done => {
      const generateRandom = () => Observable.timer(parseInt((Math.random() * 500) + '', 10) + 100);
      const source = generateRandom().expand(val => generateRandom());
      const example = source.switchMap(val => Observable.interval(500).mapTo('Hello, I made it!'));
      const subscribe = example.subscribe(val => console.log(val));
      setTimeout(() => {
        subscribe.unsubscribe();
        done();
      }, 3000);
    });
    it('Using a resultSelector function', done => {
      const source = Observable.timer(0, 500);
      const example = source.switchMap(() => Observable.interval(200), (outerValue, innerValue, outerIndex, innerIndex) => ({ outerValue, innerValue, outerIndex, innerIndex }));
      const subscribe = example.subscribe(val => console.log(val));
      setTimeout(() => {
        subscribe.unsubscribe();
        done();
      }, 3000);
    });
  });

  /**
   * signature: window(windowBoundaries: Observable): Observable
   * Observable of values for window of time.
   */
  context('window', () => {
    it('Open window specified by inner observable', done => {
      const source = Observable.timer(0, 100);
      const example = source.window(Observable.interval(300)).do(val => console.log(`New Window`));
      const count = example.scan((acc, curr) => acc + 1, 0);
      const subscribe = count.subscribe(val => console.log(`Window ${val}:`));
      const subscribeTwo = example.mergeAll().subscribe(val => console.log(val));
      setTimeout(() => {
        subscribe.unsubscribe();
        subscribeTwo.unsubscribe();
        done();
      }, 3000);
    });
  });

  /**
   * signature: windowCount(windowSize: number, startWindowEvery: number): Observable
   * Observable of values from source, emitted each time provided count is fulfilled.
   */
  context('windowCount', () => {
    it('Start new window every x items emitted', done => {
      const source = Observable.interval(100);
      const example = source.windowCount(4).do(() => console.log('NEW WINDOW!'));
      const subscribeTwo = example.mergeAll().subscribe(val => console.log(val));

      setTimeout(() => {
        subscribeTwo.unsubscribe();
        done();
      }, 3000);
    });
  });

  /**
   * signature: windowTime(windowTimeSpan: number, windowCreationInterval: number, scheduler: Scheduler): Observable
   * Observable of values collected from source for each provided time span.
   */
  context('windowTime', () => {
    it('Open new window every specified duration', done => {
      const source = Observable.timer(0, 100);
      const example = source
        .windowTime(300)
        .do(() => console.log('NEW WINDOW!'));

      const subscribeTwo = example
        .mergeAll()
        .subscribe(val => console.log(val));

      setTimeout(() => {
        subscribeTwo.unsubscribe();
        done();
      }, 3000);
    });
  });

  /**
   * signature: windowToggle(openings: Observable, closingSelector: function(value): Observable): Observable
   * Collect and emit observable of values from source between opening and closing emission.
   */
  context('windowToggle', () => {
    it('Toggle window at increasing interval', done => {
      const source = Observable.timer(0, 100);
      const toggle = Observable.interval(500);
      const example = source
        .windowToggle(toggle, (val) => Observable.interval(val * 100))
        .do(() => console.log('NEW WINDOW!'));

      const subscribeTwo = example
        .mergeAll()
        .subscribe(val => console.log(val));
      setTimeout(() => {
        subscribeTwo.unsubscribe();
        done();
      }, 3000);
    });
  });

  /**
   * signature: windowWhen(closingSelector: function(): Observable): Observable
   * Close window at provided time frame emitting observable of collected values from source.
   */
  context('windowWhen', () => {
    it('Open and close window at interval', done => {
      const source = Observable.timer(0, 100);
      const example = source.windowWhen(() => Observable.interval(500))
        .do(() => console.log('NEW WINDOW!'));

      const subscribeTwo = example
        .mergeAll()
        .subscribe(val => console.log(val));

      setTimeout(() => {
        subscribeTwo.unsubscribe();
        done();
      }, 3000);
    });
  });
});