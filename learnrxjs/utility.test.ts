import { Observable, Notification } from 'rxjs';
describe('RxJS - Utility', function () {
  this.timeout(30000);
  afterEach(() => console.log('\n'));

  /**
   * signature: do(nextOrObserver: function, error: function, complete: function): Observable
   * Transparently perform actions or side-effects, such as logging.
   */
  context('do', () => {
    it('Logging with do', () => {
      const source = Observable.of(1, 2, 3, 4, 5);
      const example = source
        .do(val => console.log(`BEFORE MAP: ${val}`))
        .map(val => val + 10)
        .do(val => console.log(`AFTER MAP: ${val}`));
      const subscribe = example.subscribe(val => console.log(val));
    });
  });

  /**
   * signature: delay(delay: number | Date, scheduler: Scheduler): Observable
   * Delay emitted values by given time.
   */
  context('delay', () => {
    it('Delay for increasing durations', done => {
      const example = Observable.of(null);
      const message = Observable.merge(
        example.mapTo('Hello'),
        example.mapTo('World!').delay(100),
        example.mapTo('Goodbye').delay(200),
        example.mapTo('World!').delay(300)
      );
      const subscribe = message.subscribe(val => console.log(val), null, done);
    });
  });
  /**
   * signature: delayWhen(selector: Function, sequence: Observable): Observable
   * Delay emitted values determined by provided function.
   */
  context('delayWhen', () => {
    it('Delay based on observable', done => {
      const message = Observable.interval(100);
      const delayForFiveSeconds = () => Observable.timer(1000);
      const delayWhenExample = message.delayWhen(delayForFiveSeconds);
      const subscribe = delayWhenExample.subscribe(val => console.log(val));
      setTimeout(() => {
        subscribe.unsubscribe();
        done();
      }, 2000);
    });
  });
  /**
   * signature: dematerialize(): Observable
   * Turn notification objects into notification values.
   */
  context('dematerialize', () => {
    it('Converting notifications to values', () => {
      const source = Observable
        .from([
          Notification.createNext('SUCCESS!'),
          Notification.createError('ERROR!')
        ])
        .dematerialize();

      const subscription = source.subscribe({
        next: val => console.log(`NEXT VALUE: ${val}`),
        error: val => console.log(`ERROR VALUE: ${val}`)
      });
    });
  });

  /**
   * signature: let(function): Observable
   * Let me have the whole observable.
   */
  context('let', () => {
    it('Applying map with let', () => {
      const source = Observable.from([1, 2, 3, 4, 5]);
      const test = source
        .map(val => val + 1)
        .subscribe(val => console.log('VALUE FROM ARRAY: ', val));

      const subscribe = source
        .map(val => val + 1)
        .let(obs => obs.map(val => val + 2))
        .subscribe(val => console.log('VALUE FROM ARRAY WITH let: ', val));
    });

    it('Applying multiple operators with let', () => {
      const source = Observable.from([1, 2, 3, 4, 5]);

      const subscribeTwo = source
        .map(val => val + 1)
        .let(obs => obs
          .map(val => val + 2)
          .filter(val => val % 2 === 0)
        )
        .subscribe(val => console.log('let WITH MULTIPLE OPERATORS: ', val));
    });

    it('Applying operators through function', () => {
      const source = Observable.from([1, 2, 3, 4, 5]);

      const obsArrayPlusYourOperators = (yourAppliedOperators) => {
        return source
          .map(val => val + 1)
          .let(yourAppliedOperators)
      };
      const addTenThenTwenty = obs => obs.map(val => val + 10).map(val => val + 20);
      const subscribe = obsArrayPlusYourOperators(addTenThenTwenty)
        .subscribe(val => console.log('let FROM FUNCTION:', val));
    });
  });
  /**
   * signature: toPromise() : Promise
   * Convert observable to promise.
   */
  context('toPromise', () => {
    it('Basic Promise', done => {
      const sample = val => Observable.of(val).delay(500);
      const example = sample('First Example')
        .toPromise()
        .then(result => {
          console.log('From Promise:', result);
          done();
        });
    });

    it('Using Promise.all', done => {
      const sample = val => Observable.of(val).delay(500);
      const example = () => {
        return Promise.all([
          sample('Promise 1').toPromise(),
          sample('Promise 2').toPromise()
        ]);
      };

      example().then(val => {
        console.log('Promise.all Result:', val);
        done();
      });
    });
  });
});