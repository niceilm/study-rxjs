import { Observable, Subscription } from 'rxjs';

describe('RxJS - create', function () {
  this.timeout(10000);
  afterEach(() => console.log('\n'));
  context('Observable.create', () => {
    it('create', () => {
      const hello = Observable.create((observer) => {
        observer.next('Hello');
        observer.next('World');
      });

      const subscribe: Subscription = hello.subscribe(value => console.log(value));
      subscribe.unsubscribe();
    });

    it('create 2', done => {
      const evenNumbers = Observable.create((observer) => {
        let value = 0;
        const interval = setInterval(() => {
          if (value % 2 === 0) {
            observer.next(value);
          }
          value++;
        }, 500);

        return () => clearInterval(interval);
      });
      const subscribe = evenNumbers.subscribe(val => console.log(val));

      setTimeout(() => {
        subscribe.unsubscribe();
        done();
      }, 5000);
    });
  });

  context('Observable.empty', () => {
    it('empty', () => {
      const example = Observable.empty();
      const subscribe = example.subscribe({
        next: () => console.log('Next'),
        complete: () => console.log('Complete!')
      });
      subscribe.unsubscribe();
    });
  });

  context('Observable.from', () => {
    it('from', () => {
      const arraySource = Observable.from([1, 2, 3, 4, 5]);
      const subscribe = arraySource.subscribe(val => console.log(val));
      subscribe.unsubscribe();
    });

    it('from promise', done => {
      const promiseSource = Observable.from(new Promise(resolve => resolve('Hello World!')));
      const subscribe = promiseSource.subscribe(val => {
        console.log(val);
        subscribe.unsubscribe();
        done();
      });
    });

    it('from collection', () => {
      const map = new Map<number, string>();
      map.set(1, 'Hi');
      map.set(2, 'Bye');

      const mapSource = Observable.from(map as any as ArrayLike<any>);
      const subscribe = mapSource.subscribe(val => console.log(val));
    });

    it('from String', () => {
      const source = Observable.from('Hello World');
      const subscribe = source.subscribe(val => console.log(val));
    });
  });

  context('fromPromise', () => {
    it('promise', done => {
      //example promise that will resolve or reject based on input
      const myPromise = (willReject) => {
        return new Promise((resolve, reject) => {
          if (willReject) {
            reject('Rejected!');
          }
          resolve('Resolved!');
        })
      };
      //emit true, then false
      const source = Observable.of(true, false);
      const example = source
        .mergeMap(val => Observable
        //turn promise into observable
          .fromPromise(myPromise(val))
          //catch and gracefully handle rejections
          .catch(error => Observable.of(`Error: ${error}`)));
      //output: 'Error: Rejected!', 'Resolved!'
      const subscribe = example.subscribe(val => {
        console.log(val);
      }, error => console.error(error), () => done());
    });
  });

  context('interval', () => {
    it('interval', done => {
      const source = Observable.interval(1000);
      const subscribe = source.subscribe(val => console.log(val));

      setTimeout(() => {
        subscribe.unsubscribe();
        done();
      }, 5000);
    });
  });

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

  context('range', () => {
    it('Emit range 1-10', () => {
      const source = Observable.range(1, 10);
      const subscribe = source.subscribe(val => console.log(val), error => console.error(error), () => console.log('complete'));
    });
  });

  context('throw', () => {
    it('Throw error on subscription', () => {
      const source = Observable.throw('This is an error!');
      const subscribe = source.subscribe(val => console.log(val), error => console.error(error), () => console.log('complete'));
      const subscribe2 = source.subscribe({
        next: val => console.log(val),
        complete: () => console.log('complete'),
        error: error => console.error(`Error ${error}`)
      });
    });
  });

  context('timer', () => {
    it('timer emits 1 value then completes', done => {
      const source = Observable.timer(1000);
      const subscribe = source.subscribe({
        next: val => console.log(val),
        complete: () => {
          console.log('complete');
          done();
        },
        error: error => console.error(`Error ${error}`)
      });
    });

    it('timer emits after 1 second, then every 2 seconds', done => {
      const source = Observable.timer(1000, 2000);
      const subscribe = source.subscribe(val => console.log(val));

      setTimeout(() => {
        subscribe.unsubscribe();
        done();
      }, 9000)
    });
  });

});