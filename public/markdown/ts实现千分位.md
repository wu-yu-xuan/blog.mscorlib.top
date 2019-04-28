# ts实现千分位

> talk is cheap, show me your code

## 方法一: 正则

```typescript
function format(num: number) {
  return num.toString().replace(/(\d)(?=(?:\d{3})+(\.\d*)?$)/g, '$1,');
}
```

## 方法二: 不用正则

```typescript
function format(num: number) {
  const [str, decimal] = num.toString().split('.');
  let length = str.length;
  const arr = [];
  while (length > 0) {
    arr.unshift(str.slice(Math.max(length - 3, 0), length));
    length -= 3;
  }
  return decimal ? arr.join(',') + '.' + decimal : arr.join(',');
}
```

## 方法三: 懒人解法

```typescript
function format(num: number) {
  return num.toLocaleString('en-US');
}
```

这个解法有个缺点,就是只会四舍五入保留三位小数,比如 2.3326 -> 2.333