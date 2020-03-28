# 关于 `useTransition` 的小想法

仅仅是一些不成熟的小想法

> When we click the “Next” button to switch the active profile, the existing page data immediately disappears, and we see the loading indicator for the whole page again. We can call this an “undesirable” loading state. It would be nice if we could “skip” it and wait for some content to load before transitioning to the new screen.

所以, `useTransition` 的目的在于, 用户可以在上个页面多停留一会, 而非看到下个页面的加载界面

这个思想初见有点奇怪, 但仔细一想就明白了:

你是愿意看到上个页面, 还是看到下个页面的加载界面?

你是愿意看到内容, 还是看到白屏?

结果显而易见

如果还是想象不出来, 怎么办, 不如来看看先进的实例: <https://youtube.com>

尝试在不同页面之间切换, 你会发现, 会在上个页面停留一段时间, 并在顶部展示加载条, 在进入下个页面时, 内容已经几乎完全加载完毕了

这就是优秀的用户体验

这就是我想实现的玩意

## 问题: 如果加载速度过快, 是否会存在闪屏现象

从 js 的角度来说, 就必然要做节流防抖, 是做在哪一层?

其实, 换个角度, 问题就迎刃而解了, 可以使用 css 解决

[react 官方](https://reactjs.org/docs/concurrent-mode-patterns.html#delaying-a-pending-indicator)已经给出了答案:

```css
.DelayedSpinner {
  animation: 0s linear 0.5s forwards makeVisible;
  visibility: hidden;
}

@keyframes makeVisible {
  to {
    visibility: visible;
  }
}
```

## 问题: 下个界面的数据存在哪

一般而言, 下个界面的数据当然存在下个界面的组件里

可是, 上个页面就需要抛出请求的 `Promise` 来让 `useTransition` 工作, 如果仅仅是

```typescript
startTransition(() => {
  history.push(`/url/path/`);
});
```

由于并没有抛出 `Promise`, 所以并没有触发 `useTransition` 的机制

所以, 很有可能就需要提升状态, 可是, 如果所有状态都提升了, 那么*全局*状态必然又臭又长

我和[伊撒尔](https://github.com/yisar)大佬都不喜欢这种, 所以我的博客里也没有使用 `context`

这个问题应该如何解决呢?

啊啊啊啊啊啊啊, 我知道了问题, 知道了解法, 就是不知道 `useTransition` 是什么, 有没有大佬能给个 user land 的实现看看啊啊啊啊

## 问题: 瀑布问题

我认为 react 这样写并没有解决瀑布问题:

```typescript
function User({ resource }) {
  const user = resource.user.read();
  return <div>user</div>;
}
```

一旦我场景复杂一点, 要求再加个数据

当然可以拆成两个组件来解决瀑布问题, 但是出于某种原因不能拆, 怎么办?

```typescript
function User({ resource }) {
  const user = resource.user.read();
  const lucky = resource.lucky.read();
  return <div>{lucky === user.id ? 'lucky!' : 'welcome'}</div>;
}
```

ok, 第一行抛出 promise, 等待...

resolve 后第二行抛出 promise, 等待...

resolve 后渲染

本来两个数据应该同时获取, 这里却形成了先后依赖?

我仔细想了想, 现有 API 好像没法解决这个问题

抑或是我理解错误?

啊啊啊, 学不会啦

## 问题: 什么时候发请求

ok, 你说上个问题简单, 因为 [**Render-as-You-Fetch**](https://reactjs.org/docs/concurrent-mode-suspense.html#approach-3-render-as-you-fetch-using-suspense)或是[**Start Fetching Early**](https://reactjs.org/docs/concurrent-mode-suspense.html#start-fetching-early)

导致请求早就发出去了, 所以只是 render 时可能没 response 而已

那么, 请求有轻重缓急, 我应该先发送首屏请求, 那些不怎么急的可以缓缓

如何控制这种优先级来保证优先渲染首屏? 又什么时候发出不那么急的请求?

## 原理分析及问题

根据[官方的说法](https://reactjs.org/docs/concurrent-mode-intro.html#blocking-vs-interruptible-rendering), `useTransition` 就类似于 git, 当 `startTransition` 时, 会 fork 一个分支出来, 当次分支不存在 `Suspense` 时, merge 进主分支

那么问题来了: 它其实仅 fork 了 vdom, 不可能也没必要复制整个环境

那么我新旧两个分支读写外部变量时会不会引入潜在的 bug? 比如路由, 比如 dom

如何解决? 即将到来的 `useMutableSource` 是否就可以解决这个问题?

~~我早说过, react 最近的骚操作反而引入了更多的问题~~

好消息是, 我这个博客已经迁移到了 `useTransition`, 虽然旧代码中有很多读写外部变量的操作, 但是目前没有发现 bug

## 问题: 是否应该全局唯一化

个人觉得, `useTransition` 和其他 hook 不同, 不具备原语性(Primitive), 导致难以随意排列组合, 必须配合特定的库或是理念来使用

按照 YouTube 的实现, 加载时停留在上个页面, 顶部显示加载条

如果不唯一化, 加载条会不会引入潜在的 bug? 会不会显示多个加载条? 或进度突然抽风?

如果唯一化, 当然问题更多
