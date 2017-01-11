# Study RxJS

## LearnRxJS
- https://www.learnrxjs.io

### Test
**This test is only typescript version**

#### settings
```
npm i
```
#### npm
```
npm test -- learnrxjs/**
```
#### intellij / webstorm
extra mocha options
```
--require ts-node/register
```
![](http://d.pr/i/krCk+)

## Link

### Official
- [RxJS Manual](http://reactivex.io/rxjs/manual)
- [https://github.com/ReactiveX/rxjs/](https://github.com/ReactiveX/rxjs/)

### Study
- [https://www.learnrxjs.io](https://www.learnrxjs.io)
- [RxJS Workshop exercises](https://github.com/staltz/rxjs-training)

### Documents
- [Functional Programming in Javascript](http://reactivex.io/learnrx/)
- [Subject](https://github.com/ReactiveX/rxjs/blob/master/doc/subject.md)
- [Migrating from RxJS 4 to 5](https://github.com/ReactiveX/rxjs/blob/master/MIGRATION.md)
- [RxJS for Async.js Users](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/mapping/async/comparing.md)
- [The introduction to Reactive Programming you've been missing](https://gist.github.com/staltz/868e7e9bc2a7b8c1f754)
- [Reactive Programming](https://sculove.github.io/blog/2016/06/22/Reactive-Programming/)[한글]
- [Hot vs Cold Observables](https://medium.com/@benlesh/hot-vs-cold-observables-f8094ed53339#.ijpocs1ev)
- [2 minute introduction to Rx](https://medium.com/@andrestaltz/2-minute-introduction-to-rx-24c8ca793877#.hp7wgq7k0)
- [REACTIVE PROGRAMMING AND MVC](http://aaronstacy.com/writings/reactive-programming-and-mvc/)


### Useful
- [Interactive diagrams of Rx Observables](http://rxmarbles.com)
- [Awesome RxJS](https://github.com/ichpuchtli/awesome-rxjs)

### Slides
- [Everything is a stream.](http://slides.com/robwormald/everything-is-a-stream/)
- [Desugar Angular 2, Meteor, RxJS 5, and ngrx](https://docs.google.com/presentation/d/1hjhVfz4PF11L65kaNFU5ZG40yEsQSMqsmNM6O2zeJiQ/edit)
- [ReactiveX + Meteor 종단간 암호화 구현 사례](http://slides.com/acidsound/rxmeteor_e2e#/)[한글]
- [웹 프론트엔드 개발자의 얕고 넓은 Rx 이야기](http://www.slideshare.net/jeokrang/rx-70197043)[한글]
- [Compose Async with RxJS](http://www.slideshare.net/kyungyeolkim39/compose-async-with-rxjs-69421413)[한글]

## Video
- [Egghead RxJS](https://egghead.io/technologies/rx)

## Blog
- [MS는 ReactiveX를 왜 만들었을까? (feat. RxJS)](http://huns.me/development/2051)
- [[번역] 반응형 프로그래밍과 RxJS 이해하기](https://hyunseob.github.io/2016/10/09/understanding-reactive-programming-and-rxjs/index.html)
- [RxJS는 쓸 만한가?](http://sculove.github.io/blog/2016/08/22/RxJS%EB%8A%94-%EC%93%B8-%EB%A7%8C%ED%95%9C%EA%B0%80/)
- [Rxjs 활용기1](http://sculove.github.io/blog/2016/11/04/rxjs-%ED%99%9C%EC%9A%A9%EA%B8%B01/)
- [Rxjs-활용기2](http://sculove.github.io/blog/2016/11/19/rxjs-%ED%99%9C%EC%9A%A9%EA%B8%B02/)
- [RxJS와 함께하는 함수형 리액티브(반응형) 프로그래밍](https://github.com/nhnent/fe.javascript/wiki/December-26-December-30,-2016)

## Hot Topic
### Function vs Observable
### Pull vs Push
### Cold vs Hot
### Observable
> Promise / Function Call and synchronous / asynchronous return infinitely values 
### Observer

### Subscription
- unsubscribe
- add
- remove

### Subject
> A Subject is like an Observable, but can multicast to many Observers.
 Subjects are like EventEmitters: they maintain a registry of many listeners.
 
### Multicasted Observables
> A multicasted Observable uses a Subject under the hood to make multiple Observers see the same Observable execution.

### BehaviorSubject
### ReplaySubject
### AsyncSubject
### Operators
