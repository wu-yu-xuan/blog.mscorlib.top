# ts实现Object.create和new

> talk is cheap, show me your code

```typescript
interface ObjectConstructor {
  myCreate(o: {}): any;
}

interface IProto {
  __proto__?: {};
}

interface Person {
  name: string;
  getName(): void;
}

interface PersonConstructor {
  new(name: string): Person;
}

Object.myCreate = function (o: {}) {
  const r: IProto = {};
  r.__proto__ = o;
  return r;
}

function myNew<A extends any[], R>(constructor: (...args: A) => R, ...args: A): (R extends {} ? R : {}) {
  const context = Object.myCreate(constructor.prototype);
  const result = constructor.apply(context, args);
  // 需要判断返回的值是不是一个对象，如果是一个对象，我们就返回这个对象，如果没有，我们该返回什么就返回什么
  return (typeof result === 'object' && result) ? result : context;
}

function Person(this: Person, name: string) {
  this.name = name;
}

Person.prototype.getName = function (this: Person) {
  console.log(this.name);
}

const person: Person = myNew(Person, 'wyx') as Person;
// todo: 使用更优雅的类型
const p: Person = new (Person as any as PersonConstructor)('wyx');
person.getName();
console.log(Object.myCreate(Person.prototype));
p.getName();

console.log({});
console.log(Object.myCreate(null));
```