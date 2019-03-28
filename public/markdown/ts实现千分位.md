# ts实现千分位

> talk is cheap, show me your code

## 方法一: 正则

```typescript
function format(num: number) {
  return num.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
}
```

## 方法二: 不用正则

```typescript
function format(num: number) {
  const str = num.toString();
  let length = str.length;
  const arr = [];
  while (length > 0) {
    arr.unshift(str.slice(Math.max(length - 3, 0), length));
    length -= 3;
  }
  return arr.join(',');
}
```

## 方法三: 终极解法

```typescript
function format(num: number) {
  return num.toLocaleString('en-US');
}
```