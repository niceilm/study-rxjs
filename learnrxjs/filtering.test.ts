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
      const myArrayWithDuplicatesInARow = Observable.from([1, 1, 2, 2, 3, 1, 2, 3]);

      const distinctSub = myArrayWithDuplicatesInARow
        .distinctUntilChanged()
        .subscribe(val => console.log('DISTINCT SUB:', val));

      const nonDistinctSub = myArrayWithDuplicatesInARow
        .subscribe(val => console.log('NON DISTINCT SUB:', val));
    });
    it('distinctUntilChanged with objects', () => {
      const sampleObject = { name: 'Test' };
      const myArrayWithDuplicateObjects = Observable.from([sampleObject, sampleObject, sampleObject]);
      const nonDistinctObjects = myArrayWithDuplicateObjects
        .distinctUntilChanged()
        .subscribe(val => console.log('DISTINCT OBJECTS:', val));
    });
  });

  /**
   * signature: filter(select: Function, thisArg: any): Observable
   * Emit values that pass the provided condition.
   */
  context('filter', () => {
    it('filter for even numbers', () => {
      const source = Observable.from([1, 2, 3, 4, 5]);
      const example = source.filter(num => num % 2 === 0);
      const subscribe = example.subscribe(val => console.log(`Even number: ${val}`));
    });

    it('filter objects based on property', () => {
      const source = Observable.from([{ name: 'Joe', age: 31 }, { name: 'Bob', age: 25 }]);
      const example = source.filter(person => person.age >= 30);
      const subscribe = example.subscribe(val => console.log(`Over 30: ${val.name}`));
    });

    it('filter for number greater than specified value', done => {
      const source = Observable.interval(100);
      const example = source.filter(num => num > 5);
      const subscribe = example.subscribe(val => console.log(`Number greater than 5: ${val}`), console.error);

      setTimeout(() => {
        subscribe.unsubscribe();
        done();
      }, 1000);
    });
  });

  /**
   * signature: first(predicate: function, select: function)
   * Emit the first value or first to pass provided expression.
   */
  context('first', () => {
    it('First value from sequence', () => {
      const source = Observable.from([1, 2, 3, 4, 5]);
      const example = source.first();
      const subscribe = example.subscribe(val => console.log(`First value: ${val}`), console.error, () => console.log('complete'));
    });
    it('First value to pass predicate', () => {
      const source = Observable.from([1, 2, 3, 4, 5]);
      const example = source.first(num => num === 5);
      const subscribe = example.subscribe(val => console.log(`First to pass test: ${val}`));
    });
    it('Using optional projection function', () => {
      const source = Observable.from([1, 2, 3, 4, 5]);
      const example = source.first(num => num % 2 === 0,
        (result, index) => `First even: ${result} is at index: ${index}`);
      const subscribe = example.subscribe(val => console.log(val));
    });
    it('Utilizing default value', () => {
      const source = Observable.from([1, 2, 3, 4, 5]);
      const example = source.first(val => val > 5, val => `Value: ${val}`, 'Nothing');
      const subscribe = example.subscribe(val => console.log(val));
    });
  });

  /**
   * signature: ignoreElements(): Observable
   * Ignore everything but complete and error.
   */
  context('ignoreElements', () => {
    it('Ignore all elements from source', done => {
      const source = Observable.interval(100);
      const example = source.take(5).ignoreElements();
      const subscribe = example.subscribe(val => console.log(`NEXT: ${val}`), val => console.log(`ERROR: ${val}`), () => {
          console.log('COMPLETE!');
          done();
        }
      );
    });
    it('Only displaying error', done => {
      const source = Observable.interval(100);
      const error = source
        .flatMap(val => {
          if (val === 4) {
            return Observable.throw(`ERROR AT ${val}`);
          }
          return Observable.of(val);
        })
        .ignoreElements();
      const subscribe = error.subscribe(val => console.log(`NEXT: ${val}`), val => {
          console.log(`ERROR: ${val}`);
          done();
        }, () => {
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
      const example = source.last();
      const subscribe = example.subscribe(val => console.log(`Last value: ${val}`));
    });
    it('Last value to pass predicate', () => {
      const source = Observable.from([1, 2, 3, 4, 5]);
      const exampleTwo = source.last(num => num % 2 === 0);
      const subscribeTwo = exampleTwo.subscribe(val => console.log(`Last to pass test: ${val}`));
    });
    it('Last with result selector', () => {
      const source = Observable.from([1, 2, 3, 4, 5]);
      const exampleTwo = source.last(v => v > 4, v => `The highest emitted number was ${v}`);
      const subscribeTwo = exampleTwo.subscribe(val => console.log(val));
    });
    it('Last with default value', () => {
      const source = Observable.from([1, 2, 3, 4, 5]);
      const exampleTwo = source.last<number, string>(v => v > 5, v => `${v}`, 'Nothing!');
      const subscribeTwo = exampleTwo.subscribe(val => console.log(val));
    });
  });

  /**
   * signature: sample(sampler: Observable): Observable
   * Sample from source when provided observable emits.
   */
  context('sample', () => {
    it('Sample source every 200ms', done => {
      const source = Observable.interval(100);
      const example = source.sample(Observable.interval(200));
      const subscribe = example.subscribe(console.log);

      setTimeout(() => {
        subscribe.unsubscribe();
        done();
      }, 1000);
    });
    it('Sample source when interval emits', done => {
      const source = Observable.zip(
        Observable.from(['Joe', 'Frank', 'Bob']),
        Observable.interval(200)
      );
      const example = source.sample(Observable.interval(250));
      const subscribe = example.subscribe(console.log);
      setTimeout(() => {
        subscribe.unsubscribe();
        done();
      }, 1000);
    });
  });

  /**
   * signature: single(a: Function): Observable
   * Emit single item that passes expression.
   */
  context('single', () => {
    it('Emit first number passing predicate', () => {
      const source = Observable.from([1, 2, 3, 4, 5]);
      const example = source.single(val => val === 4);
      const subscribe = example.subscribe(console.log);
    });
  });

  /**
   * signature: skip(the: Number): Observable
   * Skip the provided number of emitted values.
   */
  context('skip', () => {
    it('Skipping values before emission', done => {
      const source = Observable.interval(100);
      const example = source.skip(5);
      const subscribe = example.subscribe(console.log);

      setTimeout(() => {
        subscribe.unsubscribe();
        done();
      }, 1000);
    });
  });

  /**
   * signature: skipUntil(the: Observable): Observable
   * Skip emitted values from source until provided observable emits.
   */
  context('skipUntil', () => {
    it('Skip until observable emits', done => {
      const source = Observable.interval(100);
      const example = source.skipUntil(Observable.timer(500));
      const subscribe = example.subscribe(console.log);

      setTimeout(() => {
        subscribe.unsubscribe();
        done();
      }, 1000);
    });
  });

  /**
   * signature: skipWhile(predicate: Function): Observable
   * Skip emitted values from source until provided expression is false.
   */
  context('skipWhile', () => {
    it('Skip while values below threshold', done => {
      const source = Observable.interval(100);
      const example = source.skipWhile(val => val < 5);
      const subscribe = example.subscribe(console.log);

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
      const source = Observable.of(1, 2, 3, 4, 5);
      const example = source.take(1);
      const subscribe = example.subscribe(console.log);
    });
    it('Take the first 5 values from source', done => {
      const interval = Observable.interval(100);
      const example = interval.take(5);
      const subscribe = example.subscribe(console.log, console.error, done);
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
      const subscribe = example.subscribe(console.log, console.error, done);
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
      const subscribe = example.subscribe(console.log, console.error, done);
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
      const subscribe = example.subscribe(console.log);
    });
  });

  /**
   * signature: throttle(durationSelector: function(value): Observable | Promise): Observable
   * Emit value only when duration, determined by provided function, has passed.
   */
  context('throttle', () => {
    it('Throttle for 2 seconds, based on second observable', done => {
      const source = Observable.interval(100);
      const example = source.throttle(val => Observable.interval(300));
      const subscribe = example.subscribe(val => console.log(val));
      setTimeout(() => {
        subscribe.unsubscribe();
        done();
      }, 1000);
    });
    it('Throttle with promise', done => {
      const source = Observable.interval(100);
      const promise = val => new Promise(resolve => setTimeout(() => resolve(`Resolved: ${val}`), val * 10));
      const example = source.throttle(promise).map(val => `Throttled off Promise: ${val}`);
      const subscribe = example.subscribe(val => console.log(val));
      setTimeout(() => {
        subscribe.unsubscribe();
        done();
      }, 1000);
    });
  });

  /**
   * signature: throttleTime(duration: number, scheduler: Scheduler): Observable
   * Emit latest value when specified duration has passed.
   */
  context('throttleTime', () => {
    it('Receive latest value every 500ms', done => {
      const source = Observable.interval(100);
      const example = source.throttleTime(500);
      const subscribe = example.subscribe(val => console.log(val));
      setTimeout(() => {
        subscribe.unsubscribe();
        done();
      }, 1500);
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
      }, 2000);
    });
  });

});