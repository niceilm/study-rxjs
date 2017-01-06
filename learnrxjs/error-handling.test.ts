import { Observable } from 'rxjs';

describe('RxJS - Error Handling', function () {
  this.timeout(60000);
  afterEach(() => console.log('\n'));
  context('Observable.catch', () => {
    it('Catching error from observable', () => {
      const source = Observable.throw('This is an error');
      const example = source.catch(value => Observable.of(`I caught: ${value}`));
      const subscribe = example.subscribe(val => console.log(val));
    });

    it('Catching rejected promise', done => {
      //create promise that immediately rejects
      const myBadPromise = () => new Promise((resolve, reject) => reject('Rejected!'));
      //emit single value after 1 second
      const source = Observable.timer(1000);
      //catch rejected promise, returning observable containing error message
      const example = source.flatMap(() => Observable
        .fromPromise(myBadPromise())
        .catch(error => Observable.of(`Bad Promise: ${error}`))
      );
      //output: 'Bad Promise: Rejected'
      const subscribe = example.subscribe(val => console.log(val), error => console.error(error), () => done());
    });
  });
  context('Observable.retry', () => {
    it('Retry 2 times on error', done => {
      //emit value every 1s
      const source = Observable.interval(500);
      const example = source
        .flatMap(val => {
          //throw error for demonstration
          if (val > 5) {
            return Observable.throw('Error!');
          }
          return Observable.of(val);
        })
        //retry 2 times on error
        .retry(2);
      /*
       output:
       0..1..2..3..4..5..
       0..1..2..3..4..5..
       0..1..2..3..4..5..
       "Error!: Retried 2 times then quit!"
       */
      const subscribe = example
        .subscribe({
          next: val => console.log(val),
          error: val => {
            console.log(`${val}: Retried 2 times then quit!`);
            done();
          }
        });
    });
  });
  context('Observable.retryWhen', () => {
    it('Trigger retry after specified duration', done => {
      //emit value every 1s
      const source = Observable.interval(500);
      const example = source.map(val => {
        if (val > 5) {
          //error will be picked up by retryWhen
          throw val;
        }
        return val;
      }).retryWhen(errors => errors
        //log error message
          .do(val => console.log(`Value ${val} was too high!`))
          //restart in 5 seconds
          .delayWhen(val => Observable.timer(val * 500))
      );
      const subscribe = example.subscribe(val => console.log(val));

      setTimeout(() => {
        subscribe.unsubscribe();
        done();
      }, 20000)
    });
  });
});