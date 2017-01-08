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
      //emit value every 1 second
      const source = Observable.interval(1000);
      const example = source
      //side effects will be executed once
        .do(() => console.log('Do Something!'))
        //do nothing until connect() is called
        .publish();

      /*
       source will not emit values until connect() is called
       output: (after 5s)
       "Do Something!"
       "Subscriber One: 0"
       "Subscriber Two: 0"
       "Do Something!"
       "Subscriber One: 1"
       "Subscriber Two: 1"
       */
      const subscribe = example.subscribe(val => console.log(`Subscriber One: ${val}`));
      const subscribeTwo = example.subscribe(val => console.log(`Subscriber Two: ${val}`));

      //call connect after 5 seconds, causing source to begin emitting items
      setTimeout(() => {
        example.connect();
        setTimeout(() => {
          subscribe.unsubscribe();
          subscribeTwo.unsubscribe();
          done();
        }, 10000)
      }, 5000)
    });
  });

  /**
   * signature: multicast(selector: Function): Observable
   * Share source utilizing the provided Subject.
   */
  context('multicast', () => {
    it('multicast with standard Subject', done => {
      //emit every 2 seconds, take 5
      const source = Observable.interval(2000).take(5);

      const example = source
      //since we are multicasting below, side effects will be executed once
        .do(() => console.log('Side Effect #1'))
        .mapTo('Result!');

      //subscribe subject to source upon connect()
      const multi: ConnectableObservable<any> = example.multicast(() => new Subject());

      /*
       subscribers will share source
       output:
       "Side Effect #1"
       "Result!"
       "Result!"
       ...
       */
      const subscriberOne = multi.subscribe(val => console.log(val));
      const subscriberTwo = multi.subscribe(val => console.log(val));
      //subscribe subject to source
      multi.connect();
      setTimeout(() => {
        subscriberOne.unsubscribe();
        subscriberTwo.unsubscribe();
        done();
      }, 10000);
    });

    it('multicast with ReplaySubject', done => {
      //emit every 2 seconds, take 5
      const source = Observable.interval(2000).take(5);

      //example with ReplaySubject
      const example = source
      //since we are multicasting below, side effects will be executed once
        .do(() => console.log('Side Effect #2'))
        .mapTo('Result Two!');
      //can use any type of subject
      const multi: ConnectableObservable<any> = example.multicast(() => new ReplaySubject(5));

      //subscribe subject to source
      multi.connect();

      setTimeout(() => {
        /*
         subscriber will receieve all previous values on subscription because
         of ReplaySubject
         */
        const subscriber = multi.subscribe(val => console.log(val));
        setTimeout(done, 10000)
      }, 5000);
    });
  });

  /**
   * signature: share(): Observable
   * Share source among multiple subscribers.
   */
  context('share', () => {
    it('Multiple subscribers sharing source', done => {
      //emit value in 1s
      const source = Observable.timer(1000);
      //log side effect, emit result
      const example = source
        .do(() => console.log('***SIDE EFFECT***'))
        .mapTo('***RESULT***');
      /*
       ***NOT SHARED, SIDE EFFECT WILL BE EXECUTED TWICE***
       output:
       "***SIDE EFFECT***"
       "***RESULT***"
       "***SIDE EFFECT***"
       "***RESULT***"
       */
      const subscribe = example.subscribe(val => console.log(val));
      const subscribeTwo = example.subscribe(val => console.log(val));

      //share observable among subscribers
      const sharedExample = example.share();

      /*
       ***SHARED, SIDE EFFECT EXECUTED ONCE***
       output:
       "***SIDE EFFECT***"
       "***RESULT***"
       "***RESULT***"
       */
      const subscribeThree = sharedExample.subscribe(val => console.log(val));
      const subscribeFour = sharedExample.subscribe(val => console.log(val));

      setTimeout(() => {
        subscribe.unsubscribe();
        subscribeTwo.unsubscribe();
        subscribeThree.unsubscribe();
        subscribeFour.unsubscribe();
        done();
      }, 2000);
    });
  });
});