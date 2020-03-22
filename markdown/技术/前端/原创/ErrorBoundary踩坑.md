# ErrorBoundary 踩坑

## ErrorBoundary

先放上 `ErrorBoundary` 的代码:

```typescript
import React from 'react';

export interface ErrorBoundaryProps extends React.PropsWithChildren<{}> {
  fallback: React.ReactNode;
}

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps> {
  state = { error: false };
  static getDerivedStateFromError() {
    return { error: true };
  }
  render() {
    const { fallback, children } = this.props;
    return this.state.error ? fallback : children;
  }
}
```

原则上, `ErrorBoundary` 能 `catch` 住子组件的渲染时错误, 并能在发生错误时渲染 `fallback`

首先有一个注意点: 这里的渲染时错误是指同步错误, 异步错误就无能为力了

## 问题

我在本博客中多处使用了这种写法, 却意外的发现, 有些正常工作了, 有些却产生了 bug

我这里有一处逻辑: 当文章找不到时, 弹个 warning 框, 然后返回首页, 相关代码如下:

```typescript
const error = <NotFoundArticle />;

const loading = (
  <Skeleton
    loading={true}
    active={true}
    title={false}
    paragraph={{ rows: 6 }}
  />
);

function ArticlePage() {
  const { title } = useParams<{ title: string }>();
  return (
    <ErrorBoundary fallback={error}>
      <React.Suspense fallback={loading}>
        <Article title={title} />
      </React.Suspense>
    </ErrorBoundary>
  );
}

function NotFoundArticle() {
  message.warn('未找到目标文章');
  return <Redirect to="/blog" />;
}
```

获取文章的代码为:

```typescript
async function getMarkdown(title: string) {
  const response = await fetch(`/markdown/${title}.md`);
  if (
    response.ok &&
    ['text/markdown', 'text/plain'].some(v =>
      response.headers.get('Content-Type').includes(v)
    )
  ) {
    document.title = `${decodeURI(
      realTitle.replace(/(^.*\/)/g, '')
    )} - wyx's blog`;
    return response.text();
  }
  throw new Error();
}
```

在线上环境中, 却弹出了一堆 warning 框, 造成浏览器卡死

为什么呢?

## 复现问题

我建立了这个 [codesandbox 环境](https://codesandbox.io/s/lucid-cloud-0bjyf) 来最小复现

代码是:

```typescript
function ThrowError() {
  if (Math.random() < 1) {
    throw new Error('啦啦啦啦');
  }
  return <div />;
}

console.log(React.version);

function App() {
  return (
    <ErrorBoundary fallback={<div>shit</div>}>
      <ThrowError />
    </ErrorBoundary>
  );
}

const rootElement = document.getElementById('root');
ReactDOM.createRoot(rootElement).render(<App />);
```

结果发现, 在多个 react 版本中均能稳定复现

讲道理, 结果应该是 `<div>shit</div>`, 而实际情况是整个页面崩溃, 显示错误信息

在[伊撒尔](https://github.com/yisar)大佬与[月迷津渡](https://github.com/CodeDaraW)大佬的帮助下, 我发现这是由两个子问题组成的

## react-error-overlay

我使用伪代码来说明一下逻辑

在 react 中:

```typescript
try {
  render(errorBoundary.children);
} catch (e) {
  render(errorBoundary.fallback);
  // 为了在控制台中留下警告
  if (isDev) {
    throw e;
  }
}
```

在 _react-error-overlay_ (只有 dev 才会 enable)中:

```typescript
window.onerror = function(message, source, lineno, colno, error) {
  if (userCodeError(source, lineno, colno, error)) {
    window.document.querySelector(
      'body'
    )[0].innerHtml = `<pre>${message}</pre>`;
  }
  throw error;
};
```

在浏览器中:

```typescript
try {
  evalJavaScriptCode();
} catch (e) {
  console.error(e);
}
```

_react-error-overlay_ 会尝试判断错误是不是来自用户代码, 是则把整个页面销毁显示错误信息

为了避免 _react-error-overlay_ 将页面销毁, 有两个办法, 第一个就是更改脚手架

这里讲讲第二个办法, 就是让 _react-error-overlay_ 认为这个错误不是由写这个代码的程序员引发的

经过玄学一般的测试, 试出了以下代码:

```typescript
if (isDev) {
  /**
   * 下面这种骚写法是为了规避 react-error-overlay
   */
  try {
    JSON.parse('<');
  } catch {
    JSON.parse('<');
  }
} else {
  throw error;
}
```

太玄学了 23333

## react

那么如果是这样, 讲道理应该不会影响到线上, 为什么线上还是卡死呢?

原因是 react 会假定你所有组件均为纯函数, 它会在很多情况下多次 rerender, 但是不触发 `useEffect` 等函数

在编写 `NotFoundArticle` 组件时, 我 assert `message.warn()` 调用完则一定会发生重定向, 所以当时没有用 `useEffect` 包裹

然而, 重定向的函数被 `useEffect` 包裹了, 否则, react 会报错, 说不允许在 `render` 时 `setState`

当它多次 rerender 时, 没执行跳转函数, 却执行了多次 `message.warn()`, 导致页面卡死

解决方法是遵循 react 的原则, 老老实实加一层`useEffect` 就能解决问题

```typescript
import React, { useEffect } from 'react';
import { message } from 'antd';
import { Redirect } from 'web-router';

export default function NotFoundArticle() {
  useEffect(() => {
    message.warn('未找到目标文章');
  }, []);
  return <Redirect to="/blog" />;
}
```
