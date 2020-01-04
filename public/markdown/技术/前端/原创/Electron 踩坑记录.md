# Electron 踩坑记录

## 前言

这篇文章是怎么来的呢?

[瘟疫公司](https://store.steampowered.com/app/246620/Plague_Inc_Evolved/) 冬季大促  
-> 买买买  
-> 手残党不会玩  
-> 使用 [Cheat Engine](https://github.com/cheat-engine/cheat-engine) 修改内存  
-> ce 不好用, 想自己做一个  
-> 做为前端当然选择 [Electron](https://electronjs.org/) 啦

## commit in a fork is not contribution

一开始想寻找一个优秀的 template 作为我的 template 的 template :joy:

经给一番查找比对后, 我看中了 [electron-react-typescript](https://github.com/Robinfr/electron-react-typescript)

太好了, fork -> clone -> modify -> commit -> push

咦, 我今天的 contribution 怎么没有变绿?

猜想: 邮箱不对

以前遇到多次邮箱不对的情况, 比如从垃圾 qq 邮箱迁移到 gmail 的时候

然后详细比对信息, 发现邮箱没有问题, 那是为什么呢?

查阅 [Why are my contributions not showing up on my profile?](https://help.github.com/en/github/setting-up-and-managing-your-github-profile/why-are-my-contributions-not-showing-up-on-my-profile#commit-was-made-in-a-fork) 后得知:

> Commits made in a fork will not count toward your contributions.  
> To make them count, you must do one of the following:
>
> - Open a pull request to have your changes merged into the parent repository.
> - To detach the fork and turn it into a standalone repository on GitHub, contact GitHub Support or GitHub Premium Support.

emmmm, 看来我给这个项目的 commit 都不能算在我的荣誉墙上, 好坑啊

## 使用国内镜像

其实我在 [react-template](https://github.com/wu-yu-xuan/react-template) 就已经使用了依赖 [node-gyp](https://github.com/nodejs/node-gyp) 的 [node-sass](https://github.com/sass/node-sass)

在安装依赖性时特别容易在它那儿卡上好久, 甚至会报 python2.7 error, 不过大不了多试几次总是能成功

然而, Electron 里存在大量使用 node-gyp 的库, 我装了好久也没有装上

首先我尝试使用如下命令:

```shell
yarn config set proxy http://127.0.0.1:1080
yarn config set https-proxy http://127.0.0.1:1080
```

期间我把 http 写成了 https, 不知为何就没网了, 说不定可以深入研究

不过并没有解决问题

1. 现在境外流量就会随机断流
2. 期间有若干网络请求似乎仍然没有走代理

最终我的解决方案是, 建立如下的 .npmrc 文件

```txt
registry=https://registry.npm.taobao.org
disturl=https://npm.taobao.org/mirrors/node
electron_mirror=https://npm.taobao.org/mirrors/electron/
electron_builder_binaries_mirror=http://npm.taobao.org/mirrors/electron-builder-binaries/
sass_binary_site=https://npm.taobao.org/mirrors/node-sass/
```

至少解决了安装依赖项时卡顿的问题, 但是其中 `electron_builder_binaries_mirror` 似乎并没有生效, 使用了虚拟网卡全局代理才把其下载下来
