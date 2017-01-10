import { Observable } from 'rxjs';
describe('RxJS - Conditional', function () {
  this.timeout(30000);
  afterEach(() => console.log('\n'));

  /**
   * signature: defaultIfEmpty(defaultValue: any): Observable
   * Emit given value if nothing is emitted before completion.
   */
  context('defaultIfEmpty', () => {
    it('Default for empty value', () => {
      const empty = Observable.of();
      const exampleOne = empty.defaultIfEmpty('Observable.of() Empty!');
      const subscribe = exampleOne.subscribe(console.log);
    });

    it('Default for Observable.empty', () => {
      const empty = Observable.empty();
      const example = empty.defaultIfEmpty('Observable.empty()!');
      const subscribe = example.subscribe(console.log);
    });
  });

  /**
   * every(predicate: function, thisArg: any): Observable
   * If all values pass predicate before completion emit true, else false.
   */
  context('every', () => {
    it('Some values false', () => {
      const source = Observable.of(1, 2, 3, 4, 5);
      const example = source
        .every(val => val % 2 === 0);
      const subscribe = example.subscribe(val => console.log(val));
    });

    it('All values true', () => {
      const allEvens = Observable.of(2, 4, 6, 8, 10);
      const example = allEvens
        .every(val => val % 2 === 0);
      const subscribe = example.subscribe(val => console.log(val));
    });
  });
});