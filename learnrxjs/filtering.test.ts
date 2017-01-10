import { Observable } from 'rxjs';

describe('RxJS - Filtering', function () {
  this.timeout(30000);
  afterEach(() => console.log('\n'));
  /**
   * signature: debounce(durationSelector: function): Observable
   * Discard emitted values that take less than the specified time, based on selector function, between output.
   */
  context('debounce', () => {
    it('Debounce on timer', done => {
      const example = Observable.of('WAIT', 'ONE', 'SECOND', 'Last will display');
      const debouncedExample = example.debounce(() => Observable.timer(100));
      const subscribe = debouncedExample.subscribe(console.log, console.error, done);
    });
    it('Debounce at increasing interval', done => {
      const interval = Observable.interval(100);
      const debouncedInterval = interval.debounce(val => Observable.timer(val * 20));
      const subscribe = debouncedInterval.subscribe(val => console.log(`Example Two: ${val}`));

      setTimeout(() => {
        subscribe.unsubscribe();
        done();
      }, 1000);
    });
  });

  /**
   * signature: debounceTime(dueTime: number, scheduler: Scheduler): Observable
   * Discard emitted values that take less than the specified time between output
   */
  context('debounceTime', () => {
    it('Debouncing based on time between input', done => {
      const example = Observable.range(1, 5).do(val => console.log(val)).map(val => Observable.timer(100 * val)).concatAll();

      const debouncedInput = example.debounceTime(300);

      //log values
      const subscribe = debouncedInput.subscribe(val => {
        console.log(`Debounced Input: ${val}`);
      }, console.error, done);
    });
  });

  /**
   * signature: distinctUntilChanged(compare: function): Observable
   * Only emit when the current value is different than the last.
   */
  context('distinctUntilChanged', () => {
    it('distinctUntilChanged with basic values', () => {
      //only output distinct values, based on the last emitted value
      const myArrayWithDuplicatesInARow = Observable.from([1, 1, 2, 2, 3, 1, 2, 3]);

      const distinctSub = myArrayWithDuplicatesInARow
        .distinctUntilChanged()
        //output: 1,2,3,1,2,3
        .subscribe(val => console.log('DISTINCT SUB:', val));

      const nonDistinctSub = myArrayWithDuplicatesInARow
      //output: 1,1,2,2,3,1,2,3
        .subscribe(val => console.log('NON DISTINCT SUB:', val));
    });
    it('distinctUntilChanged with objects', () => {
      const sampleObject = { name: 'Test' };
      //Objects must be same reference
      const myArrayWithDuplicateObjects = Observable.from([sampleObject, sampleObject, sampleObject]);
      //only out distinct objects, based on last emitted value
      const nonDistinctObjects = myArrayWithDuplicateObjects
        .distinctUntilChanged()
        //output: 'DISTINCT OBJECTS: {name: 'Test'}
        .subscribe(val => console.log('DISTINCT OBJECTS:', val));
    });
  });

  /**
   * signature: filter(select: Function, thisArg: any): Observable
   * Emit values that pass the provided condition.
   */
  context('filter', () => {
    it('filter for even numbers', () => {
      //emit (1,2,3,4,5)
      const source = Observable.from([1, 2, 3, 4, 5]);
      //filter out non-even numbers
      const example = source.filter(num => num % 2 === 0);
      //output: "Even number: 2", "Even number: 4"
      const subscribe = example.subscribe(val => console.log(`Even number: ${val}`));
    });

    it('filter objects based on property', () => {
      //emit ({name: 'Joe', age: 31}, {name: 'Bob', age:25})
      const source = Observable.from([{ name: 'Joe', age: 31 }, { name: 'Bob', age: 25 }]);
      //filter out people with age under 30
      const example = source.filter(person => person.age >= 30);
      //output: "Over 30: Joe"
      const subscribe = example.subscribe(val => console.log(`Over 30: ${val.name}`));
    });

    it('filter for number greater than specified value', done => {
      //emit every second
      const source = Observable.interval(1000);
      //filter out all values until interval is greater than 5
      const example = source.filter(num => num > 5);
      /*
       "Number greater than 5: 6"
       "Number greater than 5: 7"
       "Number greater than 5: 8"
       "Number greater than 5: 9"
       */
      const subscribe = example.subscribe(val => console.log(`Number greater than 5: ${val}`), console.error);

      setTimeout(() => {
        subscribe.unsubscribe();
        done();
      }, 10000);
    });
  });

  /**
   * signature: first(predicate: function, select: function)
   * Emit the first value or first to pass provided expression.
   */
  context('first', () => {
    it('First value from sequence', () => {
      const source = Observable.from([1, 2, 3, 4, 5]);
      //no arguments, emit first value
      const example = source.first();
      //output: "First value: 1"
      const subscribe = example.subscribe(val => console.log(`First value: ${val}`), console.error, () => console.log('complete'));
    });
    it('First value to pass predicate', () => {
      const source = Observable.from([1, 2, 3, 4, 5]);
      //emit first item to pass test
      const example = source.first(num => num === 5);
      //output: "First to pass test: 5"
      const subscribe = example.subscribe(val => console.log(`First to pass test: ${val}`));
    });
    it('Using optional projection function', () => {
      const source = Observable.from([1, 2, 3, 4, 5]);
      //using optional projection function
      const example = source.first(num => num % 2 === 0,
        (result, index) => `First even: ${result} is at index: ${index}`);
      //output: "First even: 2 at index: 1"
      const subscribe = example.subscribe(val => console.log(val));
    });
    it('Utilizing default value', () => {
      const source = Observable.from([1, 2, 3, 4, 5]);
      //no value will pass, emit default
      const example = source.first(val => val > 5, val => `Value: ${val}`, 'Nothing');
      //output: 'Nothing'
      const subscribe = example.subscribe(val => console.log(val));
    });
  });

  /**
   * signature: ignoreElements(): Observable
   * Ignore everything but complete and error.
   */
  context('ignoreElements', () => {
    it('Ignore all elements from source', done => {
      //emit value every 100ms
      const source = Observable.interval(100);
      //ignore everything but complete
      const example = source
        .take(5)
        .ignoreElements();
      //output: "COMPLETE!"
      const subscribe = example.subscribe(
        val => console.log(`NEXT: ${val}`),
        val => console.log(`ERROR: ${val}`),
        () => {
          console.log('COMPLETE!');
          done();
        }
      );
    });
    it('Only displaying error', done => {
      //emit value every 100ms
      const source = Observable.interval(100);
      //ignore everything but error
      const error = source
        .flatMap(val => {
          if (val === 4) {
            return Observable.throw(`ERROR AT ${val}`);
          }
          return Observable.of(val);
        })
        .ignoreElements();
      //output: "ERROR: ERROR AT 4"
      const subscribe = error.subscribe(
        val => console.log(`NEXT: ${val}`),
        val => {
          console.log(`ERROR: ${val}`);
          done();
        },
        () => {
          console.log('SECOND COMPLETE!');
          done();
        }
      );
    });
  });

  /**
   * signature: last(predicate: function): Observable
   * Emit the last value emitted from source on completion, based on provided expression.
   */
  context('last', () => {
    it('Last value in sequence', () => {
      const source = Observable.from([1, 2, 3, 4, 5]);
      //no arguments, emit last value
      const example = source.last();
      //output: "Last value: 5"
      const subscribe = example.subscribe(val => console.log(`Last value: ${val}`));
    });
    it('Last value to pass predicate', () => {
      const source = Observable.from([1, 2, 3, 4, 5]);
      //emit last even number
      const exampleTwo = source.last(num => num % 2 === 0);
      //output: "Last to pass test: 4"
      const subscribeTwo = exampleTwo.subscribe(val => console.log(`Last to pass test: ${val}`));
    });
    it('Last with result selector', () => {
      const source = Observable.from([1, 2, 3, 4, 5]);
      //supply an option projection function for the second parameter
      const exampleTwo = source.last(v => v > 4, v => `The highest emitted number was ${v}`);
      //output: 'The highest emitted number was 5'
      const subscribeTwo = exampleTwo.subscribe(val => console.log(val));
    });
    it('Last with default value', () => {
      const source = Observable.from([1, 2, 3, 4, 5]);
      //no values will pass given predicate, emit default
      const exampleTwo = source.last<number, string>(v => v > 5, v => `${v}`, 'Nothing!');
      //output: 'Nothing!'
      const subscribeTwo = exampleTwo.subscribe(val => console.log(val));
    });
  });

  /**
   * signature: sample(sampler: Observable): Observable
   * Sample from source when provided observable emits.
   */
  context('sample', () => {
    it('Sample source every 2 seconds', done => {
      //emit value every 1s
      const source = Observable.interval(1000);
      //sample last emitted value from source every 2s
      const example = source.sample(Observable.interval(2000));
      //output: 2..4..6..8..
      const subscribe = example.subscribe(val => console.log(val));

      setTimeout(() => {
        subscribe.unsubscribe();
        done();
      }, 10000);
    });
    it('Sample source when interval emits', done => {
      const source = Observable.zip(
        //emit 'Joe', 'Frank' and 'Bob' in sequence
        Observable.from(['Joe', 'Frank', 'Bob']),
        //emit value every 2s
        Observable.interval(2000)
      );
      //sample last emitted value from source every 2.5s
      const example = source.sample(Observable.interval(2500));
      //output: ["Joe", 0]...["Frank", 1]...........
      const subscribe = example.subscribe(val => console.log(val));
      setTimeout(() => {
        subscribe.unsubscribe();
        done();
      }, 10000);
    });
  });

  /**
   * signature: single(a: Function): Observable
   * Emit single item that passes expression.
   */
  context('single', () => {
    it('Emit first number passing predicate', () => {
      //emit (1,2,3,4,5)
      const source = Observable.from([1, 2, 3, 4, 5]);
      //emit one item that matches predicate
      const example = source.single(val => val === 4);
      //output: 4
      const subscribe = example.subscribe(val => console.log(val));
    });
  });

  /**
   * signature: skip(the: Number): Observable
   * Skip the provided number of emitted values.
   */
  context('skip', () => {
    it('Skipping values before emission', done => {
      //emit every 1s
      const source = Observable.interval(500);
      //skip the first 5 emitted values
      const example = source.skip(5);
      //output: 5...6...7...8........
      const subscribe = example.subscribe(val => console.log(val));

      setTimeout(() => {
        subscribe.unsubscribe();
        done();
      }, 5000);
    });
  });

  /**
   * signature: skipUntil(the: Observable): Observable
   * Skip emitted values from source until provided observable emits.
   */
  context('skipUntil', () => {
    it('Skip until observable emits', done => {
      //emit every 1s
      const source = Observable.interval(500);
      //skip emitted values from source until inner observable emits (6s)
      const example = source.skipUntil(Observable.timer(3000));
      //output: 5...6...7...8........
      const subscribe = example.subscribe(val => console.log(val));

      setTimeout(() => {
        subscribe.unsubscribe();
        done();
      }, 5000);
    });
  });

  /**
   * signature: skipWhile(predicate: Function): Observable
   * Skip emitted values from source until provided expression is false.
   */
  context('skipWhile', () => {
    it('Skip while values below threshold', done => {
      //emit every 100ms
      const source = Observable.interval(100);
      //skip emitted values from source while value is less than 5
      const example = source.skipWhile(val => val < 5);
      //output: 5...6...7...8........
      const subscribe = example.subscribe(val => console.log(val));

      setTimeout(() => {
        subscribe.unsubscribe();
        done();
      }, 1000);
    });
  });

  /**
   * signature: take(count: number): Observable
   * Emit provided number of values before completing.
   */
  context('take', () => {
    it('Take 1 value from source', () => {
      //emit 1,2,3,4,5
      const source = Observable.of(1, 2, 3, 4, 5);
      //take the first emitted value then complete
      const example = source.take(1);
      //output: 1
      const subscribe = example.subscribe(val => console.log(val));
    });
    it('Take the first 5 values from source', done => {
      //emit value every 1s
      const interval = Observable.interval(1000);
      //take the first 5 emitted values
      const example = interval.take(5);
      //output: 0,1,2,3,4
      const subscribe = example.subscribe(val => console.log(val), console.error, done);
    });
  });

  /**
   * signature: takeUntil(notifier: Observable): Observable
   * Emit values until provided observable emits.
   */
  context('takeUntil', () => {
    it('Take values until timer emits', done => {
      const source = Observable.interval(100);
      const timer = Observable.timer(500);
      const example = source.takeUntil(timer);
      const subscribe = example.subscribe(val => console.log(val), console.error, done);
    });
    it('Take the first 5 even numbers', done => {
      const source = Observable.interval(100);
      const isEven = val => val % 2 === 0;
      const evenSource = source.filter(isEven);
      const evenNumberCount = evenSource.scan((acc, _) => acc + 1, 0);
      const fiveEvenNumbers = evenNumberCount.filter(val => val > 5);

      const example = evenSource
        .withLatestFrom(evenNumberCount)
        .map(([val, count]) => `Even number (${count}) : ${val}`)
        .takeUntil(fiveEvenNumbers);
      const subscribe = example.subscribe(val => console.log(val), console.error, done);
    });
  });

  /**
   * signature: takeWhile(predicate: function(value, index): boolean): Observable
   * Emit values until provided expression is false.
   */
  context('takeWhile', () => {
    it('Take values under limit', () => {
      const source = Observable.of(1, 2, 3, 4, 5);
      const example = source.takeWhile(val => val <= 4);
      const subscribe = example.subscribe(val => console.log(val));
    });
  });

  /**
   * signature: throttle(durationSelector: function(value): Observable | Promise): Observable
   * Emit value only when duration, determined by provided function, has passed.
   */
  context('throttle', () => {
    it('Throttle for 2 seconds, based on second observable', done => {
      const source = Observable.interval(1000);
      const example = source.throttle(val => Observable.interval(3000));
      const subscribe = example.subscribe(val => console.log(val));
      setTimeout(() => {
        subscribe.unsubscribe();
        done();
      }, 10000);
    });
    it('Throttle with promise', done => {
      const source = Observable.interval(1000);
      const promise = val => new Promise(resolve => setTimeout(() => resolve(`Resolved: ${val}`), val * 100));
      const example = source.throttle(promise).map(val => `Throttled off Promise: ${val}`);
      const subscribe = example.subscribe(val => console.log(val));
      setTimeout(() => {
        subscribe.unsubscribe();
        done();
      }, 10000);
    });
  });

  /**
   * signature: throttleTime(duration: number, scheduler: Scheduler): Observable
   * Emit latest value when specified duration has passed.
   */
  context('throttleTime', () => {
    it('Receive latest value every 5 seconds', done => {
      const source = Observable.interval(1000);
      const example = source.throttleTime(5000);
      const subscribe = example.subscribe(val => console.log(val));
      setTimeout(() => {
        subscribe.unsubscribe();
        done();
      }, 15000);
    });
    it('Throttle merged observable', done => {
      const source = Observable
        .merge(
          Observable.interval(225),
          Observable.interval(300)
        );
      const example = source.throttleTime(150);
      const subscribe = example.subscribe(val => console.log(val));
      setTimeout(() => {
        subscribe.unsubscribe();
        done();
      }, 5000);
    });
  });

});