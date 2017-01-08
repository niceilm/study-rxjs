import { Observable } from 'rxjs';

describe('RxJS - Filtering', function () {
  this.timeout(30000);
  afterEach(() => console.log('\n'));
  /**
   * signature: debounce(durationSelector: function): Observable
   * Discard emitted values that take less than the specified time, based on selector function, between output.
   */
  context('debounce', () => {
    it('Debounce on timer', done => {
      //emit four strings
      const example = Observable.of('WAIT', 'ONE', 'SECOND', 'Last will display');
      /*
       Only emit values after a second has passed between the last emission,
       throw away all other values
       */
      const debouncedExample = example.debounce(() => Observable.timer(1000));
      /*
       In this example, all values but the last will be omitted
       output: 'Last will display'
       */
      const subscribe = debouncedExample.subscribe(val => console.log(val), console.error, done);
    });
    it('Debounce at increasing interval', done => {
      //emit value every 1 second, ex. 0...1...2
      const interval = Observable.interval(1000);
      //raise the debounce time by 200ms each second
      const debouncedInterval = interval.debounce(val => Observable.timer(val * 200))
      /*
       After 5 seconds, debounce time will be greater than interval time,
       all future values will be thrown away
       output: 0...1...2...3...4......(debounce time over 1s, no values emitted)
       */
      const subscribe = debouncedInterval.subscribe(val => console.log(`Example Two: ${val}`));

      setTimeout(() => {
        subscribe.unsubscribe();
        done();
      }, 6000);
    });
  });

  /**
   * signature: debounceTime(dueTime: number, scheduler: Scheduler): Observable
   * Discard emitted values that take less than the specified time between output
   */
  context('debounceTime', () => {
    it('Debouncing based on time between input', done => {
      const example = Observable.range(1, 5).do(val => console.log(val)).map(val => Observable.timer(100 * val)).concatAll();

      //wait .5s between keyups to emit current value
      //throw away all other values
      const debouncedInput = example.debounceTime(300);

      //log values
      const subscribe = debouncedInput.subscribe(val => {
        console.log(`Debounced Input: ${val}`);
      }, console.error, done);

    });
  });

  /**
   * signature: distinctUntilChanged(compare: function): Observable
   * Only emit when the current value is different than the last.
   */
  context('distinctUntilChanged', () => {
    it('distinctUntilChanged with basic values', () => {
      //only output distinct values, based on the last emitted value
      const myArrayWithDuplicatesInARow = Observable.from([1, 1, 2, 2, 3, 1, 2, 3]);

      const distinctSub = myArrayWithDuplicatesInARow
        .distinctUntilChanged()
        //output: 1,2,3,1,2,3
        .subscribe(val => console.log('DISTINCT SUB:', val));

      const nonDistinctSub = myArrayWithDuplicatesInARow
      //output: 1,1,2,2,3,1,2,3
        .subscribe(val => console.log('NON DISTINCT SUB:', val));
    });
    it('distinctUntilChanged with objects', () => {
      const sampleObject = { name: 'Test' };
      //Objects must be same reference
      const myArrayWithDuplicateObjects = Observable.from([sampleObject, sampleObject, sampleObject]);
      //only out distinct objects, based on last emitted value
      const nonDistinctObjects = myArrayWithDuplicateObjects
        .distinctUntilChanged()
        //output: 'DISTINCT OBJECTS: {name: 'Test'}
        .subscribe(val => console.log('DISTINCT OBJECTS:', val));
    });
  });

  /**
   * signature: filter(select: Function, thisArg: any): Observable
   * Emit values that pass the provided condition.
   */
  context('filter', () => {
    it('filter for even numbers', () => {
      //emit (1,2,3,4,5)
      const source = Observable.from([1, 2, 3, 4, 5]);
      //filter out non-even numbers
      const example = source.filter(num => num % 2 === 0);
      //output: "Even number: 2", "Even number: 4"
      const subscribe = example.subscribe(val => console.log(`Even number: ${val}`));
    });

    it('filter objects based on property', () => {
      //emit ({name: 'Joe', age: 31}, {name: 'Bob', age:25})
      const source = Observable.from([{ name: 'Joe', age: 31 }, { name: 'Bob', age: 25 }]);
      //filter out people with age under 30
      const example = source.filter(person => person.age >= 30);
      //output: "Over 30: Joe"
      const subscribe = example.subscribe(val => console.log(`Over 30: ${val.name}`));
    });

    it('filter for number greater than specified value', done => {
      //emit every second
      const source = Observable.interval(1000);
      //filter out all values until interval is greater than 5
      const example = source.filter(num => num > 5);
      /*
       "Number greater than 5: 6"
       "Number greater than 5: 7"
       "Number greater than 5: 8"
       "Number greater than 5: 9"
       */
      const subscribe = example.subscribe(val => console.log(`Number greater than 5: ${val}`), console.error);

      setTimeout(() => {
        subscribe.unsubscribe();
        done();
      }, 10000);
    });
  });
});