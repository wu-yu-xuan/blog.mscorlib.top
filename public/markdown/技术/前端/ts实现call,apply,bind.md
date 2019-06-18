# ts实现call,apply,bind

> talk is cheap, show me your code

```typescript
interface Function {
  myCall<T, A extends any[], R>(this: (this: IContext<T, A, R>, ...args: A) => R, thisArg: T, ...args: A): R;
  myApply<T, A extends any[], R>(this: (this: IContext<T, A, R>, ...args: A) => R, thisArg: T, args: A): R;
  // C equals [A, B]
  myBind<T, A extends any[], B extends any[], C extends any[], R>(this: (this: IContext<T, C, R>, ...args: C) => R, thisArg: T, ...args: A): (...otherArgs: B) => R;
}

interface IContext<T, A extends any[], R> {
  fn(this: IContext<T, A, R>, ...args: A): R
}

function getGlobalThis() {
  if (typeof self !== 'undefined') { return self; }
  if (typeof window !== 'undefined') { return window; }
  if (typeof global !== 'undefined') { return global; }
  throw new Error('unable to locate global object');
}

Function.prototype.myCall = function <T, A extends any[], R>(this: (this: IContext<T, A, R>, ...args: A) => R, thisArg: T, ...args: A) {
  // 1.参数为null或是undefined时,取值为globalThis
  // 2.当参数为简单类型时,需要进行包装,否则调用时会报错
  const context: IContext<T, A, R> = (thisArg === null || thisArg === undefined) ? getGlobalThis() : Object(thisArg);
  context.fn = this;

  const result: R = context.fn(...args);
  delete context.fn;
  return result;
}

Function.prototype.myApply = function <T, A extends any[], R>(this: (this: IContext<T, A, R>, ...args: A) => R, thisArg: T, args: A) {
  const context: IContext<T, A, R> = (thisArg === null || thisArg === undefined) ? getGlobalThis() : Object(thisArg);
  context.fn = this;

  const result: R = context.fn(...args);
  delete context.fn;
  return result;
}

Function.prototype.myBind = function <T, A extends any[], B extends any[], C extends any[], R>(this: (this: IContext<T, C, R>, ...args: C) => R, thisArg: T, ...args: A) {
  // this instanceof fBound === true时,说明返回的fBound被当做new的构造函数调用
  const fBound = (...otherArgs: B) => this.myApply(this instanceof fBound ? this : thisArg, [...args, ...otherArgs]);
  // 维护原型关系
  fBound.prototype = Object.create(this.prototype);
  return fBound;
}

console.log(Number.prototype.toString.myCall(15, 16));
console.log(Number.prototype.toString.myApply(15, [16]));

function add(a: number, b: number) {
  return a + b;
}

console.log(add.myBind(null, 1)(2));
```