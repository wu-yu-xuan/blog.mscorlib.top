# ts实现节流

> talk is cheap, show me your code

```typescript
interface IOption {
  leading: boolean;
  trailing: boolean;
}

function now() {
  return new Date().getTime();
}

/**
 * underscore 节流函数，返回函数连续调用时，func 执行频率限定为 次 / wait
 *
 * @param  {function}   func      回调函数
 * @param  {number}     wait      表示时间窗口的间隔
 * @param  {object}     options   如果想忽略开始函数的的调用，传入{leading: false}。
 *                                如果想忽略结尾函数的调用，传入{trailing: false}
 *                                两者不能共存，否则函数不能执行
 * @return {function}             返回客户调用函数
 */
function throttle<T extends any[]>(func: (...args: T) => void, wait: number, {
  leading = true, trailing = true
}: IOption): (...args: T) => void {
  let context: any;
  let args: T;
  let timeout: NodeJS.Timer = null;
  // 之前的时间戳
  let previous = 0;
  // 定时器回调函数
  const later = function () {
    // 如果设置了 leading，就将 previous 设为 now()
    // 用于下面函数的第一个 if 判断
    previous = leading ? now() : 0;
    timeout = null;
    func.apply(context, args);
    context = args = null;
  };
  return function (this: any, ...argument: T) {
    // 获得当前时间戳
    const n = now();
    // 首次进入前者肯定为 true
    // 如果需要第一次不执行函数
    // 就将上次时间戳设为当前的
    // 这样在接下来计算 remaining 的值时会大于0
    if (!previous && leading === false) {
      previous = n;
    }
    // 计算剩余时间
    const remaining = wait - (n - previous);
    context = this;
    args = argument;
    // 判断当前调用是否已经大于上次调用时间 + wait
    // 如果设置了 trailing，只会进入这个条件
    // 如果没有设置 leading，那么第一次会进入这个条件
    if (remaining <= 0) {
      // 如果存在定时器就清理掉
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = n;
      func.apply(context, args);
      context = args = null;
    } else if (!timeout && trailing !== false) {
      // 判断是否设置了定时器和 trailing
      // 没有的话就开启一个定时器
      // 并且不能同时设置 leading 和 trailing
      timeout = setTimeout(later, remaining);
    }
  };
};

const log = throttle(console.log, 400, { leading: true, trailing: true });

for (let i = 0; i < 600; i += 50) {
  setTimeout(() => {
    log(i);
  }, i);
}
```

result:

```
0
400
550
```