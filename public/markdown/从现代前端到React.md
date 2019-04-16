# 从现代前端到 React

## 何为前端？

首先，什么是前端？

从广义上来说，用户可以直接看见的都是前端，一般包括网页端和 App 端，它们通常是由 HTML,CSS,JS 亦或是其他语言，如 Dart 等，和一些静态文件，如图片，json 等

这就决定了前端具有如下两个根本性质，也是前端的终极目标：

1. **注重用户的交互体验**
2. **注重前端工程师的开发体验**

现代前端无时无刻不在进步，为的就是这两个终极目标。

站在历史的长河中，从经典前端往现代前端看，可以明显的感受到，用户的交互体验变得更优秀了，前端工程师的开发体验也变得更舒服了。

下文也将多次提到这两点，因为这是我们一直以来努力的方向

## 现代前端

### 路由

我们考虑一个非常简单而常见的场景，就是前端控制页面跳转，比如说从主页跳到帮助页

有人说，这不简单，然后随手写出了如下代码：

```html
<a href="/about">go to about</a>
```

a 标签对于每个前端来说，是熟悉的不能再熟悉了，但是，这样写，就真的没有改进的空间了吗？

我们来考虑一下，当用户点击了这个 a 标签，发生了哪些事？

其实这时候和[输入URL后...](/blog/面经)这个问题差不多,像什么废弃当前dom树啊,解析dns啊,发起HTTP请求啊,解析响应啊,重构dom树之类的

可以看见，本质上我们做的事情还是 dom 树 ->dom 树，都是 dom 树，为什么要把原来的废弃呢？

原来的 dom 树上其实还是有很多东西能复用的，比如每个界面都有的侧边栏上的导航，如果复用这些，是不是能加快速度呢？是不是能降低用户等待时间，提高用户交互体验呢？

答案是肯定的，因为 HTML 作为一种 xml 文件，具有复杂的树状结构，解析是非常耗时的，如果能复用之前的解析结果，那自然再好不过了。

当我们明白这个道理后，前端就由整体刷新时代变为了局部刷新时代

但还是无法解决一个问题，即当 URL 改变，界面一定会全部刷新，而我们打算不同的 URL 对应不同的界面，同时又不想全部刷新，这时候改怎么办呢？

聪明的前端工程师想出了个办法，就是根据 W3C 规范，当 hash, 即 URL 中#后面的部分改变时，界面不会全部刷新，于是就有了大名鼎鼎的`hash router`思想。

通过`hash router`, 使 URL 形如*example.com/#/*（主页）,*example.com/#/about/*（帮助页）.

监听路由跳转的代码如下：

```javascript
window.onhashchange = () => {
  if(location.hash === '#/'){
    loadIndex();
  }
  if(location.hash === '#/about/'){
    loadAbout();
  }
}
```

这样的确能解决绝大多数路由问题，但是这样同时也引发了一个新的问题：

当我要用到 hash 本来的意思，咋办？

首先，hash 本来的意思是什么？

- 跳转到页内锚点。
- 一个 URL 中 # 后的值 (hash tag) 不影响所访问网页的内容，所以搜索引擎在处理仅仅 hash tag 不同的多个 URL 时会当做相同内容从而忽略 hash tag。

比如说我们做了一个博客系统，需要使用 hash 跳转到文章的小标题，

又比如我们要求我们的网站要对搜索引擎友好。

最终，经过组委会的讨论，HTML5 history API 成为了正式标准，
我们可以使用这个 API 既能实现局部刷新，又能避免了`hash router`的一些缺陷

从此，前端从`hash router`进入了`history router`时代

在`history router`时代下，URL 的形式与一开始并无多大不同，仍然是*example.com/*（主页）,*example.com/about/*（帮助页）.

实现一个简单的`history router`代码如下：

```javascript
class Route {
  constructor (routeMap) {
    this.routeMap = routeMap;
    window.addEventListener('popstate', (e) => {
      const path = e.state && e.state.path;
      this.routeMap[path] && this.routeMap[path]();
    });
  }
  init () {
    path = location.pathname;
    history.replaceState({path: path}, '', path);
    this.routeMap[path] && this.routeMap[path]();
  }
  go (path) {
    history.pushState({path: path}, '', path);
    this.routeMap[path] && this.routeMap[path]();
  }
}
const routeMap = {
  '/': loadIndex,
  '/about': loadAbout
};
const router = new Route(routeMap);
router.init(location.pathname);
Array.prototype.forEach.call(document.querySelectorAll('a'), a => a.addEventListener('click', e => {
  e.preventDefault();
  router.go(e.target.getAttribute('href'));
}));
```

至此，我们就基本解决了现代前端路由的问题。

但是提出了如下三个基本原则，
当一条执行失败时，自动执行下一条规则，
然而根据这三个原则配置下服务器并不是什么难事

1. 当`path`以`/api`开头时，使用后端路由，一般可以使用反向代理
2. 尝试返回`path`所对应的静态资源文件
3. 返回`index.html`

### 图标

现在，我们再来考虑一个用户的需求，就是每个网站几乎都有图标，那么图标如何实现？

有人说，这不简单，然后随手写出了如下代码：

```html
<link rel="shortcut icon" href="/favicon.ico">
```

但是真的把用户的需求考虑完整了吗？这个代码真的没有任何改进空间了吗？

这时候请切换回桌面，以 windows 为例，右键 ->查看

看到有这么几个选项：小图标，中等图标，大图标

你都提供对应的图标了吗？

更别说 windows 磁贴及背景，iOS 桌面图标及顶部颜色等

想用一个图标一劳永逸明显是不负责任的做法，因为众所周知，小图标放大会失真，至于大图标缩小？去问问设计师吧

下面给一个参考做法：

```html
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<!--[if IE]><link rel="icon" href="/favicon.ico"><![endif]-->
<link href="/app.js" rel="preload" as="script">
<link rel="icon" type="image/png" sizes="32x32" href="/img/icons/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/img/icons/favicon-16x16.png">
<link rel="manifest" href="/manifest.json">
<meta name="theme-color" content="#4DBA87">
<meta name="apple-mobile-web-app-capable" content="no">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta name="apple-mobile-web-app-title" content="demo">
<link rel="apple-touch-icon" href="/img/icons/apple-touch-icon-152x152.png">
<link rel="mask-icon" href="/img/icons/safari-pinned-tab.svg" color="#4DBA87">
<meta name="msapplication-TileImage" content="/img/icons/msapplication-icon-144x144.png">
<meta name="msapplication-TileColor" content="#FFFFFF">
```

## 总结

本篇文章从路由和图标两个方面着重强调了用户体验

有人就问了，这样麻烦的做法，用户是舒服了，可是开发人员不舒服啊，
别急，下篇文章就会提到，这些麻烦的做法就交给工程化的现代前端吧

## 声明

这篇文章为原创文章

作者才疏学浅，如有不足之处，欢迎斧正
