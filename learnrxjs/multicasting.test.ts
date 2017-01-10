import { Observable, Subject, ConnectableObservable, ReplaySubject } from 'rxjs';

describe('RxJS - Multicasting', function () {
  this.timeout(30000);
  afterEach(() => console.log('\n'));
  /**
   * signature: publish() : ConnectableObservable
   * Share source and make hot by calling connect.
   */
  context('publish', () => {
    it('Connect observable after subscribers', done => {
      const source = Observable.interval(100);
      const example = source
        .do(() => console.log('Do Something!'))
        .publish();

      const subscribe = example.subscribe(val => console.log(`Subscriber One: ${val}`));
      const subscribeTwo = example.subscribe(val => console.log(`Subscriber Two: ${val}`));

      setTimeout(() => {
        example.connect();
        setTimeout(() => {
          subscribe.unsubscribe();
          subscribeTwo.unsubscribe();
          done();
        }, 2000)
      }, 1000)
    });
  });

  /**
   * signature: multicast(selector: Function): Observable
   * Share source utilizing the provided Subject.
   */
  context('multicast', () => {
    it('multicast with standard Subject', done => {
      const source = Observable.interval(200).take(5);

      const example = source
        .do(() => console.log('Side Effect #1'))
        .mapTo('Result!');

      const multi: ConnectableObservable<any> = example.multicast(() => new Subject());

      const subscriberOne = multi.subscribe(console.log);
      const subscriberTwo = multi.subscribe(console.log);
      multi.connect();
      setTimeout(() => {
        subscriberOne.unsubscribe();
        subscriberTwo.unsubscribe();
        done();
      }, 1000);
    });

    it('multicast with ReplaySubject', done => {
      const source = Observable.interval(200).take(5);

      const example = source
        .do(() => console.log('Side Effect #2'))
        .mapTo('Result Two!');
      const multi: ConnectableObservable<any> = example.multicast(() => new ReplaySubject(5));
      multi.connect();
      // const subscriberOne = multi.subscribe(console.log);

      setTimeout(() => {
        const subscriber = multi.subscribe(console.log);
        setTimeout(() => {
          // subscriberOne.unsubscribe();
          subscriber.unsubscribe();
          done();
        }, 2000);
      }, 500);
    });
  });

  /**
   * signature: share(): Observable
   * Share source among multiple subscribers.
   */
  context('share', () => {
    it('Multiple subscribers sharing source', done => {
      const source = Observable.timer(100);
      const example = source
        .do(() => console.log('***SIDE EFFECT***'))
        .mapTo('***RESULT***');
      const subscribe = example.subscribe(val => console.log(val));
      const subscribeTwo = example.subscribe(val => console.log(val));

      const sharedExample = example.share();

      const subscribeThree = sharedExample.subscribe(val => console.log(val));
      const subscribeFour = sharedExample.subscribe(val => console.log(val));

      setTimeout(() => {
        subscribe.unsubscribe();
        subscribeTwo.unsubscribe();
        subscribeThree.unsubscribe();
        subscribeFour.unsubscribe();
        done();
      }, 1000);
    });
  });
});