# Reactive

面试时,经常问到,如何实现像Vue一样的响应式呢?

核心是`Object.defineProperty`(Vue 2)或是`Proxy`(Vue 3)

我个人的实现位于[wu-yu-xuan/reactive](https://github.com/wu-yu-xuan/reactive)

接下来就是嘴巴笨,贴代码时间

代码注释量比较大,应该比较易懂

## Code

```typescript
isObject.ts:
/**
 * 判断目标对象是否为`Object`
 * 因为`typeof null === 'object'`, 所以使用`!!obj`来排除`null`
 */
export default function isObject(obj: any): obj is {} {
  return !!obj && typeof obj === 'object';
}
```

思考: 这个实现与 `obj === Object(obj)` 相比有何优劣

```typescript
def.ts:
/**
 * 在目标对象上定义不可枚举的值, 使用`Object.defineProperty`
 * @param obj 目标对象
 * @param key 要定义的键
 * @param value 要定义的值
 */
export default function def(obj: {}, key: string, value: any) {
  Object.defineProperty(obj, key, {
    value,
    enumerable: false,
    writable: true,
    configurable: true
  });
}
```

思考: 我们为什么要让附加到数组上的方法不可枚举呢?

```typescript
Observer.ts:
import def from "./def";
import isObject from "./isObject";

type IGetCallback = (value: any) => any;
type ISetCallback = (newValue: any, oldValue: any) => any;

interface ICallback {
  getCallback?: IGetCallback;
  setCallback?: ISetCallback;
}

export default class Observer {
  private getCallback?: IGetCallback = null;
  private setCallback?: ISetCallback = null;
  private data: any;
  public constructor(data: any, { getCallback, setCallback }: ICallback) {
    this.data = data;
    this.getCallback = getCallback;
    this.setCallback = setCallback;
    this.observe(this.data);
  }
  /**
   * 当`data`为`Array`或`Object`时, 使其具有响应式
   */
  private observe(data: any) {
    if (Array.isArray(data)) {
      this.observeArray(data);
    } else if (isObject(data)) {
      this.observeObject(data);
    }
  }
  /**
   * 1. 使数组上的每个对象具有响应式
   * 2. 修改原型方法
   */
  private observeArray(arr: any[]) {
    this.observeArrayItems(arr);
    this.observeArrayMethods(arr);
  }
  /**
   * 遍历目标数组,使数组上的每个对象具有响应式
   */
  private observeArrayItems(arr: any[]) {
    for (const iterator of arr) {
      this.observeObject(iterator);
    }
  }
  private observeArrayMethods(arr: any[]) {
    const arrayMethods = this.getArrayMethods();
    const protoStr = '__proto__';
    // 为了兼容性
    // 最好是优雅的扔在原型链上
    if (protoStr in {}) {
      arr[protoStr] = arrayMethods;
    } else {
      for (const key of Object.getOwnPropertyNames(arrayMethods)) {
        def(arr, key, arrayMethods[key]);
      }
    }
  }
  /**
   * 获得具有响应式的数组函数
   */
  private getArrayMethods() {
    const targetMethods = [
      'push',
      'pop',
      'shift',
      'unshift',
      'splice',
      'sort',
      'reverse'
    ];
    const arrayMethods = Object.create(Array.prototype);
    const self = this;
    targetMethods.forEach(methodName => {
      const original: Function = arrayMethods[methodName];
      def(arrayMethods, methodName, function (this: any[], ...args: any[]) {
        const oldValue = [...this];
        const result = original.apply(this, args);
        let inserted = [];
        switch (methodName) {
          case 'push':
          case 'unshift':
            inserted = args;
            break;
          case 'splice':
            inserted = args.slice(2);
            break;
        }
        // 使数组中新添加的元素具有响应式
        self.observeArrayItems(inserted);
        self.setCallback && self.setCallback(this, oldValue);
        return result;
      });
    });
    return arrayMethods;
  }
  /**
   * 遍历目标对象,使每个键具有响应式
   */
  private observeObject(obj: {}) {
    if (!isObject(obj)) {
      return;
    }
    for (const key of Object.keys(obj)) {
      this.defineReactive(obj, key);
      this.observe(obj[key]);
    }
  }
  /**
   * 使目标对象上特定的键具有响应式
   */
  private defineReactive(obj: {}, key: string) {
    // 使用闭包记录当前obj的值
    // 如果把下文所有value替换成obj[key], 会引发get函数的无限递归
    let value = obj[key];
    Object.defineProperty(obj, key, {
      get: () => {
        this.getCallback && this.getCallback(value);
        return value;
      },
      set: (newValue: any) => {
        if (newValue !== value) {
          this.setCallback && this.setCallback(newValue, value);
          value = newValue;
        }
      }
    });
  }
}
```

## 测试

```typescript
import Observer from "./Observer";

/**
 * 因为`value`上添加`get`函数后, 解释器就不会去尝试自动执行, 以免有副作用, 所以打印结果就可能是`[Object Object]`
 * 使用`JSON.stringify`可以执行`value`的`get`函数, 并把`value`打印出来
 */
function getCallback(value: any) {
  console.log(`get value: ${JSON.stringify(value)}`);
}

function setCallback(newValue: any, value: any) {
  console.log(`set value: ${JSON.stringify(value)} -> ${JSON.stringify(newValue)}`);
}

const obj = { a: { b: [{ c: 1 }] } };

new Observer(obj, { getCallback, setCallback });

obj.a.b[0].c = 2;
obj.a.b.push({ c: 3 });
obj.a.b[1].c = 4;
```

## 结果

> get value: {"b":[{"c":1}]}  
> get value: [{"c":1}]  
> get value: 1  
> get value: 1  
> get value: [{"c":1}]  
> get value: 1  
> get value: {"b":[{"c":1}]}  
> get value: 1  
> get value: [{"c":1}]  
> set value: 1 -> 2  
> get value: 2  
> get value: [{"c":2}]  
> get value: 2  
> get value: {"b":[{"c":2}]}  
> get value: 2  
> get value: [{"c":2}]  
> get value: 3  
> get value: 2  
> get value: 2  
> get value: 3  
> set value: [{"c":2}] -> [{"c":2},{"c":3}]  
> get value: 2  
> get value: 3  
> get value: [{"c":2},{"c":3}]  
> get value: 2  
> get value: 3  
> get value: {"b":[{"c":2},{"c":3}]}  
> get value: 2  
> get value: 3  
> get value: [{"c":2},{"c":3}]  
> set value: 3 -> 4  

思考一下,这个输出和自己意料之中的一样吗?

## Acknowledgement

* [Vue](https://github.com/vuejs/vue)
* [easy-to-understand-Vue.js-examples](https://github.com/berwin/easy-to-understand-Vue.js-examples)
* [深入浅出Vue.js](https://book.douban.com/subject/32581281/)