import { Observable } from 'rxjs';
describe('RxJS - Conditional', function () {
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
      //emit 5 values
      const source = Observable.of(1, 2, 3, 4, 5);
      const example = source
      //is every value even?
        .every(val => val % 2 === 0);
      //output: false
      const subscribe = example.subscribe(val => console.log(val));
    });
    it('All values true', () => {
      //emit 5 values
      const allEvens = Observable.of(2, 4, 6, 8, 10);
      const example = allEvens
      //is every value even?
        .every(val => val % 2 === 0);
      //output: true
      const subscribe = example.subscribe(val => console.log(val));
    });
  });
});