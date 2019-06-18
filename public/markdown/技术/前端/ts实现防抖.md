# ts实现防抖

> talk is cheap, show me your code

```typescript
function debounce<T extends any[]>(func: (...args: T) => void, wait: number, immediate: boolean) {
  let timer: NodeJS.Timer;
  let context: any;
  let args: T;

  // 延迟执行函数
  const later = () => setTimeout(() => {
    // 延迟函数执行完毕，清空缓存的定时器序号
    timer = null;
    // 延迟执行的情况下，函数会在延迟函数中执行
    // 使用到之前缓存的参数和上下文
    if (!immediate) {
      func.apply(context, args);
      context = args = null;
    }
  }, wait);

  // 这里返回的函数是每次实际调用的函数
  return function (this: any, ...params: T) {
    context = this;
    args = params;
    // 如果没有创建延迟执行函数（later），就创建一个
    if (!timer) {
      timer = later();
      // 如果是立即执行，调用函数
      // 否则缓存参数和调用上下文
      if (immediate) {
        func.apply(this, params)
      }
    } else {
      // 如果已有延迟执行函数（later），调用的时候清除原来的并重新设定一个
      // 这样做延迟函数会重新计时
      clearTimeout(timer);
      timer = later();
    }
  }
}

const log1 = debounce(console.log, 500, true);
const log2 = debounce(console.log, 500, false);

for (let i = 0; i < 2000; i += 300) {
  setTimeout(() => {
    log1(i);
    log2(i);
  }, i);
}
```

result:

```
0
1800
```

从开始运行到第一个结果输出  和 这两个输出之间 的时间间隔是多少,留给读者思考吧