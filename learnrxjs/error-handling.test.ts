import { Observable } from 'rxjs';

describe('RxJS - Error Handling', function () {
  this.timeout(30000);
  afterEach(() => console.log('\n'));

  /**
   * signature: catch(project : function): Observable
   * Gracefully handle errors in an observable sequence.
   */
  context('catch', () => {
    it('Catching error from observable', () => {
      const source = Observable.throw('This is an error');
      const example = source.catch(value => Observable.of(`I caught: ${value}`));
      const subscribe = example.subscribe(val => console.log(val));
    });

    it('Catching rejected promise', done => {
      const myBadPromise = () => new Promise((resolve, reject) => setTimeout(() => reject('Rejected!'), 200));
      const source = Observable.timer(100);
      const example = source.mergeMap(() => Observable
        .fromPromise(myBadPromise())
        .catch(error => Observable.of(`Bad Promise: ${error}`))
      );
      const subscribe = example.subscribe(console.log, console.error, done);
    });
  });

  /**
   * signature: retry(number: number): Observable
   * Retry an observable sequence a specific number of times should an error occur.
   */
  context('retry', () => {
    it('Retry 2 times on error', done => {
      const source = Observable.interval(500);
      const example = source
        .flatMap(val => {
          if (val > 5) {
            return Observable.throw('Error!');
          }
          return Observable.of(val);
        })
        .retry(2);

      const subscribe = example
        .subscribe(console.log, val => {
          console.log(`${val}: Retried 2 times then quit!`);
          done();
        });
    });
  });

  /**
   * signature: retryWhen(receives: (errors: Observable) => Observable, the: scheduler): Observable
   * Retry an observable sequence on error based on custom criteria.
   */
  context('retryWhen', () => {
    it('Trigger retry after specified duration', done => {
      const source = Observable.interval(50);
      const example = source.map(val => {
        if (val > 5) {
          throw val;
        }
        return val;
      }).retryWhen(errors => errors
        .do(val => console.log(`Value ${val} was too high!`))
        .delayWhen(val => Observable.timer(val * 50))
      );
      const subscribe = example.subscribe(val => console.log(val));

      setTimeout(() => {
        subscribe.unsubscribe();
        done();
      }, 3000)
    });
  });
});