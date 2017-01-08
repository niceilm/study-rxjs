import { Observable } from 'rxjs';

describe('bindCallback', function () {
  this.timeout(10000);
  it('bindCallback test', done => {
    const rxUpdateCallback = Observable.bindCallback(updateCallback);

    function updateCallback(categoryId, callback) {
      setTimeout(() => {
        console.log(`callback : ${categoryId}`);
        callback(categoryId);
      }, 1000);
    }

    Observable.from(["342", "343", "344", "339", "353", "345", "347", "337", "2034", "2529"])
      .map(val => parseInt(val, 10))
      .map(val => rxUpdateCallback(val))
      .concatAll()
      .subscribe(categoryId => console.log(`completed : ${categoryId}`), console.error, done);
  });
});

