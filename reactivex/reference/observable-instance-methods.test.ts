import { Observable } from 'rxjs';
describe('Observable instance methods', function () {
  this.timeout(30000);

  /**
   * public audit(durationSelector: function(value: T): Observable | Promise): Observable<T>
   */
  context('audit', () => {
    xit('Emit clicks at a rate of at most one click per second', done => {
      const clicks = Observable.fromEvent(document, 'click');
      const result = clicks.audit(ev => Observable.interval(1000));
      const subscribe = result.subscribe(x => console.log(x));

      setTimeout(() => {
        subscribe.unsubscribe();
        done();
      }, 3000);
    });
  });
  context('auditTime', () => {
    xit('Emit clicks at a rate of at most one click per second', done => {
      const clicks = Observable.fromEvent(document, 'click');
      const result = clicks.auditTime(1000);
      const subscribe = result.subscribe(x => console.log(x));
      setTimeout(() => {
        subscribe.unsubscribe();
        done();
      }, 3000);
    });
  });

  /**
   * public count(predicate: function(value: T, i: number, source: Observable<T>): boolean): Observable
   */
  context('count', () => {
    it('Counts how many odd numbers are there between 1 and 7', () => {
      const numbers = Observable.range(1, 7);
      const result = numbers.count(i => i % 2 === 1);
      result.subscribe(x => console.log(x));
    });
  });

  /**
   * public distinct(keySelector: function, flushes: Observable): Observable
   */
  context('distinct', () => {
    it('A simple example with numbers', () => {
      Observable.of(1, 1, 2, 2, 2, 1, 2, 3, 4, 3, 2, 1)
        .distinct()
        .subscribe(x => console.log(x));
    });

    it('An example using a keySelector function', () => {
      interface Person {
        age: number,
        name: string
      }
      Observable.of<Person>(
        { age: 4, name: 'Foo' },
        { age: 7, name: 'Bar' },
        { age: 5, name: 'Foo' })
        .distinct((p: Person) => p.name)
        .subscribe(x => console.log(x));
    });
  });

  /**
   * public distinctUntilKeyChanged(key: string, compare: function): Observable
   */
  context('distinctUntilKeyChanged', () => {
    it('An example comparing the name of persons', () => {
      interface Person {
        age: number,
        name: string
      }

      Observable.of<Person>(
        { age: 4, name: 'Foo' },
        { age: 7, name: 'Bar' },
        { age: 5, name: 'Foo' },
        { age: 6, name: 'Foo' })
        .distinctUntilKeyChanged('name')
        .subscribe(x => console.log(x));
    });
    it('An example comparing the first letters of the name', () => {
      interface Person {
        age: number,
        name: string
      }

      Observable.of<Person>(
        { age: 4, name: 'Foo1' },
        { age: 7, name: 'Bar' },
        { age: 5, name: 'Foo2' },
        { age: 6, name: 'Foo3' })
        .distinctUntilKeyChanged('name', (x: string, y: string) => x.substring(0, 3) === y.substring(0, 3))
        .subscribe(x => console.log(x));
    });
  });

  /**
   * public elementAt(index: number, defaultValue: T): Observable
   * Emits the single value at the specified index in a sequence of emissions from the source Observable.
   */
  context('elementAt', () => {
    it('Emit only third', () => {
      const items = Observable.of(1, 2, 3, 4, 5);
      const result = items.elementAt(2);
      result.subscribe(x => console.log(x));
    });
  });

  /**
   * public exhaust(): Observable
   * Converts a higher-order Observable into a first-order Observable by dropping inner Observables while the previous inner Observable has not yet completed.
   */
  context('exhaust', () => {
    xit('Run a finite timer for each click, only if there is no currently active timer', done => {
      const clicks = Observable.fromEvent(document, 'click');
      const higherOrder = clicks.map((ev) => Observable.interval(1000));
      const result = higherOrder.exhaust();
      const subscribe = result.subscribe(x => console.log(x));

      setTimeout(() => {
        subscribe.unsubscribe();
        done();
      }, 3000);
    });
  });
  context('exhaustMap', () => {
    it('', () => {
    });
  });

  /**
   * public find(predicate: function(value: T, index: number, source: Observable<T>): boolean, thisArg: any): Observable<T>
   * Emits only the first value emitted by the source Observable that meets some condition.
   */
  context('find', () => {
    it('Find and emit', () => {
      const source = Observable.of('a', 'b', 'c');
      const example = source.find(val => val === 'b');
      example.subscribe(console.log);
    });
  });

  /**
   * public findIndex(predicate: function(value: T, index: number, source: Observable<T>): boolean, thisArg: any): Observable
   * Emits only the index of the first value emitted by the source Observable that meets some condition.
   */
  context('findIndex', () => {
    it('Find and emit', () => {
      const source = Observable.of('a', 'b', 'c');
      const example = source.findIndex(val => val === 'b');
      example.subscribe(console.log);
    });
  });
  context('forEach', () => {
    it('', () => {
      const source = Observable.of('a', 'b', 'c');
      const example = source.forEach(val => console.log(val));
    });
  });

  /**
   * public isEmpty(): Observable
   * If the source Observable is empty it returns an Observable that emits true, otherwise it emits false.
   */
  context('isEmpty', () => {
    it('', () => {
      const source = Observable.of('a', 'b', 'c');
      source.isEmpty().subscribe(console.log);
      const source2 = Observable.empty();
      source2.isEmpty().subscribe(console.log);
    });
  });

  context('letProto', () => {
    it('', () => {
    });
  });
  context('lift', () => {
    it('', () => {
    });
  });

  /**
   * public materialize(): Observable<Notification<T>>
   * Represents all of the notifications from the source Observable as next emissions marked with their original types within Notification objects.
   */
  context('materialize', () => {
    it('Convert a faulty Observable to an Observable of Notifications', () => {
      const letters = Observable.of<any>('a', 'b', 13, 'd');
      const upperCase = letters.map(x => x.toUpperCase());
      const materialized = upperCase.materialize();
      materialized.subscribe(x => console.log(x));
    });
  });

  /**
   * public max(optional: Function): Observable
   * The Max operator operates on an Observable that emits numbers (or items that can be compared with a provided function), and when source Observable completes it emits a single item: the item with the largest value.
   */
  context('max', () => {
    it('Get the maximal value of a series of numbers', () => {
      Observable.of(5, 4, 7, 2, 8)
        .max()
        .subscribe(x => console.log(x));
    });
    it('Use a comparer function to get the maximal item', () => {
      interface Person {
        age: number,
        name: string
      }
      Observable.of<Person>({ age: 7, name: 'Foo' },
        { age: 5, name: 'Bar' },
        { age: 9, name: 'Beer' })
        .max<Person>((a: Person, b: Person) => a.age < b.age ? -1 : 1)
        .subscribe((x: Person) => console.log(x.name));
    });
  });
  context('mergeScan', () => {
    it('', () => {
    });
  });

  /**
   * public min(optional: Function): Observable<R>
   *   The Min operator operates on an Observable that emits numbers (or items that can be compared with a provided function),
   *   and when source Observable completes it emits a single item: the item with the smallest value.
   */
  context('min', () => {
    it('Get the minimal value of a series of numbers', () => {
      Observable.of(5, 4, 7, 2, 8)
        .min()
        .subscribe(x => console.log(x));
    });
    it('Use a comparer function to get the minimal item', () => {
      interface Person {
        age: number,
        name: string
      }
      Observable.of<Person>({ age: 7, name: 'Foo' },
        { age: 5, name: 'Bar' },
        { age: 9, name: 'Beer' })
        .min<Person>((a: Person, b: Person) => a.age < b.age ? -1 : 1)
        .subscribe((x: Person) => console.log(x.name));
    });
  });

  context('observeOn', () => {
    it('', () => {
    });
  });

  /**
   * public pairwise(): Observable<Array<T>>
   *   Groups pairs of consecutive emissions together and emits them as an array of two values.
   */
  context('pairwise', () => {
    it('Emit pairwise', () => {
      const source = Observable.range(1, 10);
      source.pairwise().subscribe(console.log);
    });
  });
  context('publishBehavior', () => {
    it('', () => {
    });
  });
  context('publishReplay', () => {
    it('', () => {
    });
  });
  context('repeat', () => {
    it('', () => {
    });
  });
  context('repeatWhen', () => {
    it('', () => {
    });
  });
  context('sampleTime', () => {
    it('', () => {
    });
  });
  context('sequenceEqual', () => {
    it('', () => {
    });
  });
  context('subscribeOn', () => {
    it('', () => {
    });
  });
  context('switch', () => {
    it('', () => {
    });
  });
  context('takeLast', () => {
    it('', () => {
    });
  });
  context('timeInterval', () => {
    it('', () => {
    });
  });
  context('timeout', () => {
    it('', () => {
    });
  });
  context('timeoutWith', () => {
    it('', () => {
    });
  });
  context('timestamp', () => {
    it('', () => {
    });
  });

  /**
   * public toArray(): Observable<any[]> | WebSocketSubject<T> | Observable<T>
   */
  context('toArray', () => {
    it('', () => {
      Observable.range(1, 10).toArray().subscribe(console.log);
    });
  });
  context('zipAll', () => {
    it('', () => {
    });
  });
  context('zipProto', () => {
    it('', () => {
    });
  });
  context('reduce vs scan', () => {
    it('reduce vs scan', () => {
      const source = Observable.range(1, 10);
      const scanSource = source.scan((acc, val) => acc + val, 0);
      const reduceSource = source.reduce((acc, val) => acc + val, 0);
      scanSource.subscribe(console.log);
      reduceSource.subscribe(console.log);
    });
  });
});