# js实现继承

> talk is cheap, show me your code

```javascript
/**
 * 继承
 * 这里不用 `Child.prototype = new Parent()` 是因为
 * `Child.prototype` 里会出现基类的实例属性, 而非出现在 `this` 实例上
 * 但是如果不用这种写法, 基类的构造函数就必须手动调用
 * 这就要求在派生类中手动出现如下代码来调用基类的构造函数:
 * `Parent.call(this, ...args)`
 * @param {constructor} Child 派生类
 * @param {constructor} Parent 基类
 */
function extend(Child, Parent) {
  /**
   * 下面一行相当于
   * function F() { }
   * F.prototype = Parent.prototype;
   * Child.prototype = new F();
   */
  Child.prototype = Object.create(Parent.prototype);
  Child.prototype.constructor = Child;
}
```

## 引用

- [ts实现Object.create和new](./ts实现Object.create和new)
- [Object​.create() - MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/create#%E7%94%A8_Object.create%E5%AE%9E%E7%8E%B0%E7%B1%BB%E5%BC%8F%E7%BB%A7%E6%89%BF)