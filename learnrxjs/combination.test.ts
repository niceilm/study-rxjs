import { Observable } from 'rxjs';

describe('RxJS - combination', function () {
  this.timeout(30000);
  afterEach(() => console.log('\n'));
  context('Observable.combineAll', () => {
    it('Mapping to inner interval observable', done => {
      //emit every 1s, take 2
      const source = Observable.interval(1000).take(2);
      //map first value to 500ms interval and second to 1s, take two values
      const example = source.map(val => Observable.interval(val + 500).take(2));
      /*
       2 values from source will map to 2 (inner) interval observables that emit every .5s
       and 1s. combineAll uses combineLatest strategy, emitting the last value from each
       whenever either observable emits a value
       */
      const combined = example.combineAll();

      const subscribe = combined.subscribe({
        next: val => console.log(val),
        complete: () => done()
      });
    });
    it('Mapping to inner interval observable with projection', done => {
      //emit every 1s, take 2
      const source = Observable.interval(1000).take(2);

      //map first value to 500ms interval and second to 1s, take two values
      const example = source.map(val => Observable.interval(val + 500).take(2));
      /*
       2 values from source will map to 2 (inner) interval observables that emit every .5s
       and 1s. combineAll uses combineLatest strategy, emitting the last value from each
       whenever either observable emits a value
       */
      const combined = example.combineAll((one, two) => `one: ${one} two: ${two}`);

      const subscribe = combined.subscribe({
        next: val => console.log(val),
        complete: () => done()
      });
    });
  });
  context('Observable.combineLatest', () => {
    it('Combining observables emitting at 3 intervals', done => {
      //timerOne emits first value at 1s, then once every 4s
      const timerOne = Observable.timer(1000, 4000);
      //timerTwo emits first value at 2s, then once every 4s
      const timerTwo = Observable.timer(2000, 4000);
      //timerThree emits first value at 3s, then once every 4s
      const timerThree = Observable.timer(3000, 4000);

      //when one timer emits, emit the latest values from each timer as an array
      const combined = Observable.combineLatest(timerOne, timerTwo, timerThree);

      const subscribe = combined.subscribe(latestValues => {
        //grab latest emitted values for timers one, two, and three
        const [timerValOne, timerValTwo, timerValThree] = latestValues;
        console.log(`Timer One Latest: ${timerValOne}, 
Timer Two Latest: ${timerValTwo}, 
Timer Three Latest: ${timerValThree}`);
      });

      setTimeout(done, 20000)
    });
    it('combineLatest with projection function', done => {
      //timerOne emits first value at 1s, then once every 4s
      const timerOne = Observable.timer(1000, 4000);
      //timerTwo emits first value at 2s, then once every 4s
      const timerTwo = Observable.timer(2000, 4000);
      //timerThree emits first value at 3s, then once every 4s
      const timerThree = Observable.timer(3000, 4000);

      //combineLatest also takes an optional projection function
      const combinedProject = Observable
        .combineLatest(timerOne, timerTwo, timerThree, (one, two, three) => {
          return `
            Timer One (Proj) Latest: ${one},
            Timer Two (Proj) Latest: ${two}, 
            Timer Three (Proj) Latest: ${three}`
        });
      //log values
      const subscribe = combinedProject.subscribe(latestValuesProject => console.log(latestValuesProject));
      setTimeout(done, 20000);
    });
  });
  context('Observable.concat', () => {
    it('concat 2 basic observables', () => {
      //emits 1,2,3
      const sourceOne = Observable.of(1, 2, 3);
      //emits 4,5,6
      const sourceTwo = Observable.of(4, 5, 6);
      //emit values from sourceOne, when complete, subscribe to sourceTwo
      const example = sourceOne.concat(sourceTwo);
      //output: 1,2,3,4,5,6
      const subscribe = example.subscribe(val => console.log('Example: Basic concat:', val));
    });
    it('concat as static method', () => {
      //emits 1,2,3
      const sourceOne = Observable.of(1, 2, 3);
      //emits 4,5,6
      const sourceTwo = Observable.of(4, 5, 6);

      //used as static
      const example = Observable.concat(sourceOne, sourceTwo);
      //output: 1,2,3,4,5,6
      const subscribe = example.subscribe(val => console.log('Example: static', val));
    });
    it('concat with delayed source', done => {
      //emits 1,2,3
      const sourceOne = Observable.of(1, 2, 3);
      //emits 4,5,6
      const sourceTwo = Observable.of(4, 5, 6);

      //delay 3 seconds then emit
      const sourceThree = sourceOne.delay(3000);
      //sourceTwo waits on sourceOne to complete before subscribing
      const example = sourceThree.concat(sourceTwo);
      //output: 1,2,3,4,5,6
      const subscribe = example.subscribe({
        next: val => console.log('Example: Delayed source one:', val),
        complete: done
      });
    });
    it('concat with source that does not complete', done => {
      //when source never completes, the subsequent observables never runs
      const source = Observable.concat(Observable.interval(1000), Observable.of('This', 'Never', 'Runs'));
      //outputs: 1,2,3,4....
      const subscribe = source.subscribe(val => console.log('Example: Source never completes, second observable never runs:', val));
      setTimeout(done, 10000);
    });
  });
  context('Observable.concatAll', () => {
    it('concatAll with observable', done => {
      //emit a value every 2 seconds
      const source = Observable.interval(2000);
      const example = source
      //for demonstration, add 10 to and return as observable
        .map(val => Observable.of(val + 10))
        //merge values from inner observable
        .concatAll();
      //output: 'Example with Basic Observable 10', 'Example with Basic Observable 11'...
      const subscribe = example.subscribe(val => console.log('Example with Basic Observable:', val));
      setTimeout(() => {
        subscribe.unsubscribe();
        done();
      }, 10000);
    });
    it('concatAll with promise', done => {
      //create and resolve basic promise
      const samplePromise = val => new Promise(resolve => resolve(val));
      //emit a value every 2 seconds
      const source = Observable.interval(2000);

      const example = source
        .map<any, any>(val => samplePromise(val))
        //merge values from resolved promise
        .concatAll();
      //output: 'Example with Promise 0', 'Example with Promise 1'...
      const subscribe = example.subscribe(val => console.log('Example with Promise:', val));

      setTimeout(() => {
        subscribe.unsubscribe();
        done();
      }, 10000);
    });
    it('Delay while inner observables complete', done => {
      const obs1 = Observable.interval(1000).take(5).map(val => `obs1: ${val}`);
      const obs2 = Observable.interval(500).take(2).map(val => `obs2: ${val}`);
      const obs3 = Observable.interval(2000).take(1).map(val => `obs3: ${val}`);
      //emit three observables
      const source = Observable.of(obs1, obs2, obs3);
      //subscribe to each inner observable in order when previous completes
      const example = source.concatAll();
      /*
       output: 0,1,2,3,4,0,1,0
       How it works...
       Subscribes to each inner observable and emit values, when complete subscribe to next
       obs1: 0,1,2,3,4 (complete)
       obs2: 0,1 (complete)
       obs3: 0 (complete)
       */

      const subscribe = example.subscribe({
        next: val => console.log(val),
        complete: done
      });
    });
  });
  context('Observable.forkJoin', () => {
    it('Making variable number of requests', done => {
      const myPromise = val => new Promise(resolve => setTimeout(() => resolve(`Promise Resolved: ${val}`), 5000));

      /*
       when all observables complete, give the last
       emitted value from each as an array
       */
      const example = Observable.forkJoin(
        //emit 'Hello' immediately
        Observable.of('Hello'),
        //emit 'World' after 1 second
        Observable.of('World').delay(1000),
        //emit 0 after 1 second
        Observable.interval(1000).take(1),
        //emit 0...1 in 1 second interval
        Observable.interval(1000).take(2),
        //promise that resolves to 'Promise Resolved' after 5 seconds
        myPromise('RESULT')
      );
      //output: ["Hello", "World", 0, 1, "Promise Resolved: RESULT"]
      const subscribe = example.subscribe(val => console.log(val));

      //make 5 requests
      const queue = Observable.of([1, 2, 3, 4, 5]);
      //emit array of all 5 results
      const exampleTwo = queue
        .mergeMap(q => Observable.forkJoin(...q.map(myPromise)));
      const subscribeTwo = exampleTwo.subscribe(val => console.log(val));

      setTimeout(done, 6000);
    });
  });
  context('Observable.merge', () => {
    it('merging multiple observables, static method', done => {
      //emit every 2.5 seconds
      const first = Observable.interval(2500);
      //emit every 2 seconds
      const second = Observable.interval(2000);
      //emit every 1.5 seconds
      const third = Observable.interval(1500);
      //emit every 1 second
      const fourth = Observable.interval(1000);

      //emit outputs from one observable
      const example = Observable.merge(
        first.mapTo('FIRST!'),
        second.mapTo('SECOND!'),
        third.mapTo('THIRD'),
        fourth.mapTo('FOURTH')
      );
      //output: "FOURTH", "THIRD", "SECOND!", "FOURTH", "FIRST!", "THIRD", "FOURTH"
      const subscribe = example.subscribe(val => console.log(val));

      setTimeout(() => {
        subscribe.unsubscribe();
        done();
      }, 10000);
    });
    it('merge 2 observables, instance method', done => {
      //emit every 2.5 seconds
      const first = Observable.interval(2500).mapTo('FIRST');
      //emit every 1 second
      const second = Observable.interval(1000).mapTo('SECOND');
      //used as instance method
      const example = first.merge(second);
      //output: 0,1,0,2....
      const subscribe = example.subscribe(val => console.log(val));

      setTimeout(() => {
        subscribe.unsubscribe();
        done();
      }, 5000);
    });
  });
  context('Observable.mergeAll', () => {
    it('mergeAll with promises', done => {
      const myPromise = val => new Promise(resolve => setTimeout(() => resolve(`Result: ${val}`), 2000));
      const source = Observable.of(1, 2, 3);
      const example = source
      //map each value to promise
        .map<any, any>(val => myPromise(val))
        //emit result from source
        .mergeAll();

      const subscribe = example.subscribe({
        next: val => console.log(val),
        complete: done
      });
    });
    it('mergeAll with concurrent parameter', done => {
      const interval = Observable.interval(500).take(5);

      /*
       interval is emitting a value every 0.5s.  This value is then being mapped to interval that
       is delayed for 1.0s.  The mergeAll operator takes an optional argument that determines how
       many inner observables to subscribe to at a time.  The rest of the observables are stored
       in a backlog waiting to be subscribe.
       */
      const example = interval
        .map(val => interval.delay(1000).take(3).map(ival => `interval : ${val} ${ival}`))
        .mergeAll()
        .subscribe({
          next: val => console.log(val),
          complete: done
        });
    });
    it('mergeAll with concurrent parameter 2', done => {
      const interval = Observable.interval(500);

      /*
       interval is emitting a value every 0.5s.  This value is then being mapped to interval that
       is delayed for 1.0s.  The mergeAll operator takes an optional argument that determines how
       many inner observables to subscribe to at a time.  The rest of the observables are stored
       in a backlog waiting to be subscribe.
       */
      console.time('time');
      const example = Observable.range(1, 10).map(val => interval.take(10).map(ival => `interval : ${val} ${ival}`))
        .mergeAll(5)
        .subscribe({
          next: val => console.log(val),
          complete: () => {
            console.timeEnd('time')
            done();
          }
        });
    });
  });
  context('Observable.race', () => {
    it('create', () => {
    });
  });
  context('Observable.startWith', () => {
    it('create', () => {
    });
  });
  context('Observable.withLatestFrom', () => {
    it('create', () => {
    });
  });
  context('Observable.zip', () => {
    it('create', () => {
    });
  });
})
;