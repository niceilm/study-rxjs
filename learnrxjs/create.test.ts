import { Observable } from 'rxjs';

describe('RxJS - Creation Operators', function () {
  this.timeout(20000);
  afterEach(() => console.log('\n'));

  /**
   * signature: create(subscribe: function)
   * Create an observable with given subscription function.
   */
  context('create', () => {
    it(' Observable that emits multiple values', () => {
      const hello = Observable.create((observer) => {
        observer.next('Hello');
        observer.next('World');
      });

      const subscribe = hello.subscribe(console.log);
    });

    it('Observable that emits even numbers on timer', done => {
      const evenNumbers = Observable.create((observer) => {
        let value = 0;
        const interval = setInterval(() => {
          if (value % 2 === 0) {
            observer.next(value);
          }
          value++;
        }, 50);

        return () => clearInterval(interval);
      });
      const subscribe = evenNumbers.subscribe(console.log);

      setTimeout(() => {
        subscribe.unsubscribe();
        done();
      }, 1000);
    });
  });

  /**
   * signature: empty(scheduler: Scheduler): Observable
   * Observable that immediately completes.
   */
  context('empty', () => {
    it('empty immediately completes', () => {
      const example = Observable.empty();
      const subscribe = example.subscribe(() => console.log('Next'), null, () => console.log('Complete!'));
    });
  });

  /**
   * signature: from(ish: ObservableInput, mapFn: function, thisArg: any, scheduler: Scheduler): Observable
   * Turn an array, promise, or iterable into an observable.
   */
  context('from', () => {
    it('Observable from array', () => {
      const arraySource = Observable.from([1, 2, 3, 4, 5]);
      const subscribe = arraySource.subscribe(console.log);
    });

    it('Observable from promise', () => {
      const promiseSource = Observable.from(new Promise(resolve => resolve('Hello World!')));
      const subscribe = promiseSource.subscribe(console.log);
    });

    it('Observable from collection', () => {
      const map = new Map<number, string>();
      map.set(1, 'Hi');
      map.set(2, 'Bye');

      const mapSource = Observable.from(map as any as ArrayLike<any>);
      const subscribe = mapSource.subscribe(console.log);
    });

    it('Observable from string', () => {
      const source = Observable.from('Hello World');
      const subscribe = source.subscribe(console.log);
    });
  });

  /**
   * signature: fromPromise(promise: Promise, scheduler: Scheduler): Observable
   * Create observable from promise, emitting result.
   */
  context('fromPromise', () => {
    it('Converting promise to observable and catching errors', () => {
      const myPromise = (willReject) => {
        return new Promise((resolve, reject) => {
          if (willReject) {
            reject('Rejected!');
          }
          resolve('Resolved!');
        })
      };
      const source = Observable.of(true, false);
      const example = source
        .mergeMap(val => Observable
          .fromPromise(myPromise(val))
          .catch(error => Observable.of(`Error: ${error}`)));
      const subscribe = example.subscribe(console.log);
    });
  });

  /**
   * signature: interval(period: number, scheduler: Scheduler): Observable
   * Emit numbers in sequence based on provided timeframe.
   */
  context('interval', () => {
    it('interval', done => {
      const source = Observable.interval(100);
      const subscribe = source.subscribe(console.log);

      setTimeout(() => {
        subscribe.unsubscribe();
        done();
      }, 1000);
    });
  });

  /**
   * signature: of(...values, scheduler: Scheduler): Observable
   * Emit variable amount of values in a sequence.
   */
  context('of', () => {
    it('Emitting a sequence of numbers', () => {
      const source = Observable.of(1, 2, 3, 4, 5);
      const subscribe = source.subscribe(val => console.log(val), error => console.error(error), () => console.log('complete'));
    });

    it('Emitting an object, array, and function', () => {
      //emits values of any type
      const source = Observable.of<any>({ name: 'Brian' }, [1, 2, 3], function hello() {
        return 'Hello'
      });

      const subscribe = source.subscribe(val => console.log(val), error => console.error(error), () => console.log('complete'));
    });
  });

  /**
   * signature: range(start: number, count: number, scheduler: Scheduler): Observable
   * Emit numbers in provided range in sequence.
   */
  context('range', () => {
    it('Emit range 1-10', () => {
      const source = Observable.range(1, 10);
      const subscribe = source.subscribe(val => console.log(val), error => console.error(error), () => console.log('complete'));
    });
  });

  /**
   * signature: throw(error: any, scheduler: Scheduler): Observable
   * Emit error on subscription.
   */
  context('throw', () => {
    it('Throw error on subscription', () => {
      const source = Observable.throw('This is an error!');
      const subscribe = source.subscribe(val => console.log(val), error => console.error(error), () => console.log('complete'));
    });
  });

  /**
   * signature: timer(initialDelay: number | Date, period: number, scheduler: Scheduler): Observable
   * After given duration, emit numbers in sequence every specified duration.
   */
  context('timer', () => {
    it('timer emits 1 value then completes', done => {
      const source = Observable.timer(100);
      const subscribe = source.subscribe(console.log, null, () => {
        console.log('complete');
        done();
      });
    });

    it('timer emits after 1 second, then every 2 seconds', done => {
      const source = Observable.timer(1000, 2000);
      const subscribe = source.subscribe(val => console.log(val));

      setTimeout(() => {
        subscribe.unsubscribe();
        done();
      }, 5000)
    });
  });
});