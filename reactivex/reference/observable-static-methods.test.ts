import { Observable } from 'rxjs';
import * as fs from 'fs';

describe('Observable static method', function () {
  this.timeout(30000);
  context('bindCallback', () => {
    it('Convert callback to Observable API', done => {
      function someCallback(message, callback) {
        setTimeout(() => callback(message), 100);
      }

      const someCallbackAsObservable = Observable.bindCallback(someCallback);
      const result = someCallbackAsObservable('Hello world');
      result.subscribe(x => console.log(x), e => console.error(e), done);
    });
  });

  context('bindNodeCallback', () => {
    it('Convert filesystem', () => {
      const readFileAsObservable: Function = Observable.bindNodeCallback(fs.readFile);
      const result = readFileAsObservable('./observable-static-methods.test.ts', 'utf8');
      result.subscribe(x => console.log(x), e => console.error(e));
    });
  });

  /**
   * public static defer(observableFactory: function(): Observable | Promise): Observable
   */
  context('defer', () => {
    it('random observable', done => {
      const clicksOrInterval = Observable.defer(function () {
        if (Math.random() > 0.5) {
          return Observable.of(1, 2, 3, 4).map(val => `of : ${val}`);
        } else {
          return Observable.interval(100).take(6).map(val => `interval : ${val}`);
        }
      });
      const subscribe = clicksOrInterval.subscribe(x => console.log(x));
      const subscribe2 = clicksOrInterval.subscribe(x => console.log(x));
      const subscribe3 = clicksOrInterval.subscribe(x => console.log(x));
      setTimeout(() => {
        done();
      }, 1000);
    });
  });

  /**
   * public static fromEventPattern(addHandler: function(handler: Function): any, removeHandler: function(handler: Function): void, selector: function(...args: any): T): Observable<T>
   * Creates an Observable by using the addHandler and removeHandler functions to add and remove the handlers,
   * with an optional selector function to project the event arguments to a result.
   * The addHandler is called when the output Observable is subscribed, and removeHandler is called when the Subscription is unsubscribed.
   */
  context('fromEventPattern', () => {
    xit('Emits clicks happening on the DOM document', () => {
      function addClickHandler(handler) {
        document.addEventListener('click', handler);
      }

      function removeClickHandler(handler) {
        document.removeEventListener('click', handler);
      }

      const clicks = Observable.fromEventPattern(
        addClickHandler,
        removeClickHandler
      );
      clicks.subscribe(x => console.log(x));
    });
  });

  context('never', () => {
    it('Emit the number 7, then never emit anything else (not even complete).', () => {
      function info() {
        console.log('Will not be called');
      }

      const result = Observable.never().startWith(7);
      result.subscribe(x => console.log(x), info, info);
    });
  });
});