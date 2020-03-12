# Learn React Concurrent Mode

## ErrorBoundary

错误处理不是 _Concurrent Mode_ 才引入的新功能, 但是此处还是得提一下

得益于 `static getDerivedStateFromError` 或是 `ComponentDidCatch` API, 我们可以捕获并处理渲染时错误

学习[官方文档](https://reactjs.org/docs/concurrent-mode-suspense.html#handling-errors)或是阅读我[博客的源码](https://github.com/wu-yu-xuan/blog.mscorlib.top/blob/master/src/ErrorBoundary.tsx), 容易写出如下的 `ErrorBoundary`:

```typescript
import React from 'react';

export interface ErrorBoundaryProps extends React.PropsWithChildren<{}> {
  fallback: React.ReactNode;
}

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps> {
  state = { error: false };
  static getDerivedStateFromError(error, info) {
    navigator.sendBeacon('/error-logger', { error, info });
    return { error: true };
  }
  render() {
    const { fallback, children } = this.props;
    return this.state.error ? fallback : children;
  }
}
```

用伪代码来简单表达这个思想就是:

```typescript
function ErrorBoundary() {
  try {
    return render(children);
  } catch (e) {
    if (e instanceof Error) {
      return render(fallback);
    }
    throw e;
  }
}
```

## Suspense

其实 `Suspense` 也不是 _Concurrent Mode_ 才引入的新功能, 只不过之前绝大多数玩家都把它和 `React.Lazy` 组合来为懒加载服务,
只有少数喜欢阅读源码的大佬才发现了其中的奥秘~~, 没错, 我就是其中之一~~

后来官方发现这个谜语没多少人猜的出来, 就干脆把这个思想公开了~~, 早点说不行么, 猜谜很好玩?~~

用伪代码来表达 `Suspense` 的原理:

```typescript
function Suspense() {
  try {
    return render(children);
  } catch (e) {
    if (e instanceof Promise) {
      e.then(rerender);
      return render(fallback);
    }
    throw e;
  }
}
```

于是盲生发现了华点: 如果我一直抛出 `Promise`, 不就可以卡死页面了吗?

不好意思, 别人 React 团队早就考虑到了, 你可以自己试试 :)

## 组合以上两者

细心的读者已经发现了, `ErrorBoundary` 和 `Suspense` 的伪代码十分类似, 似乎能很好的协同工作

没错, 这就是 React 团队的骚想法 ---- **异步改变了前端, 我想把它改回去!**

来看看以前我们是怎么写组件的:

```typescript
function Component() {
  const { data, loading, error } = useData();
  if(error) {
    return <div>error: {error.message}</div>;
  }
  if(loading) {
    // 致敬 bilibili.com
    return <div>刷呀刷呀好累呀喵</div>;
  }
  return <div>{data}</div>;
}

function useData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    fetch(...)
      .then(data => setData(data))
      .catch(error => setError(error))
      .finally(() => setLoading(false))
  },[]);
  return { data, error, loading };
}
```

我觉得挺好的呀

React 团队眉头一皱: 我不要你觉得, 我要我觉得, 我讨厌分支和异步

为什么 React 团队会讨厌分支和异步呢? 看看 React issue 区就行了

全都是 React 团队气急败坏的怒吼:

- 说了多少次了, 禁止把 hook 写在分支里 ~~vue3 悄悄路过并看了一眼 issue~~
- 说了多少次了, 禁止 `useEffect()` 里的函数返回 `Promise`

于是灵机一动: 只要设计一种思想, 避免了分支和异步, 不就没有这些 issue 了? 我真是个天才(请脑补 warma)

~~以上纯属娱乐, motivation 请参考[官方文档](https://reactjs.org/docs/concurrent-mode-intro.html)~~

于是, 按照新的 _Concurrent Mode_ 理念, 组件应该这么写:

```typescript
function ComponentPage() {
  return (
    <ErrorBoundary fallback={<div>error</div>}>
      <Suspense fallback={<div>刷呀刷呀好累呀喵</div>}>
        <Component />
      </Suspense>
    </ErrorBoundary>
  );
}

function Component() {
  const data = useData();
  return <div>{data}</div>;
}
```

没有分支, 没有异步真是太棒了耶( •̀ ω •́ )y!

那么 `useData` 如何编写呢?

这时候需要再看一下 `ErrorBoundary` 与 `Suspense` 的原理, 一个能 catch `Error`, 另一个能 catch `Promise`,
于是仅需要做好判断并 throw 就行

可以参考我[博客中的代码](https://github.com/wu-yu-xuan/blog.mscorlib.top/blob/master/src/useFetch.ts), 写出如下代码:

```typescript
interface Cache<T = any> {
  data: T;
  error: Error | typeof initError;
  promise: Promise<T>;
}

const cache: { [key: string]: Cache } = {};

/**
 * 以前初始值是 `undefined`, 当 `promise` 返回 `undefined` 时会引起递归
 */
const initData = Symbol('init data');
const initError = Symbol('no error');

/**
 * 说白了就是配合 `React.Suspence` 可以 "异步转同步"
 * `error` 将由 `ErrorBoundary` 处理
 * @param fn
 * @param args
 */
export default function usePromise<T extends any[], Data = any>(
  fn: (...args: T) => Promise<Data>,
  ...args: T
): Data {
  const key = fn.name + args.toString();
  if (!cache[key]) {
    cache[key] = {
      data: initData,
      error: initError,
      promise: fn(...args)
        .then(data => (cache[key].data = data))
        .catch(error => (cache[key].error = error))
    };
  }
  if (cache[key].data === initData && cache[key].error === initError) {
    throw cache[key].promise;
  }
  if (cache[key].error !== initError) {
    // 异步错误转同步错误抛出, 真蛋疼
    throw cache[key].error;
  }
  return cache[key].data;
}
```

如何使用这个 `usePromise` 写出 `useData` 呢?

```typescript
function getData() {
  return fetch(...);
}

function useData() {
  return usePromise(getData);
}
```

## useTransition

有同学指出, 明明非常简单的代码, 却要拆成多个组件, 我就是喜欢单个组件解决一切, 怎么办?

另一方面, 上面这种写法似乎对非 get-like 或非 cache-first 的请求不友好, 怎么办?

`useTransition` 就是来解决这个问题的

先来看 `useTransition` 的伪代码版:

```typescript
function useTransition() {
  const [isPending, setPending] = useState(false);
  const startTransition = useCallback((callback: () => void) => {
    setPending(true);
    try {
      callback();
      // 支持 callback 不抛出 Promise 的情况
      setPending(false);
    } catch (e) {
      if (e instanceof Promise) {
        e.then(() => setPending(false));
      } else {
        throw e;
      }
    }
  }, []);
  return [startTransition, isPending];
}
```

如何使用呢?

```typescript
function Component() {
  const [data, setData] = useState(null);
  const [startTransition, isPending] = useTransition();
  const handleClick = useCallback(
    () =>
      startTransition(() => {
        // 其实 `usePromise` 并不算严格意义的 hook, 仅仅起到 React 喜欢的异步转同步效果, 起个名字真难
        setData(usePromise(getData));
      }),
    []
  );

  return isPending ? <div>刷呀刷呀好累呀喵</div> : <div>{data}</div>;
}
```

感觉是不是又回到了最一开始 React 批判的那种写法(逃

React 团队: 才...才不一样呢, `useTransition` 可以走我的调度系统, 什么 **Hydration**, 什么 **Reconciliation**, 一些半懂不懂的专业名词, 店内外充满了快活的空气

## 思考题

剩下的 `SuspenseList` 与 `useDeferredValue` 因为太懒所以不想分析了

伪代码怎么写就留给各位分析吧
