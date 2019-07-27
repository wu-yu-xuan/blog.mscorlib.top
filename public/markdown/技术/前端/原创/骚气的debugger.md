# 骚气的 debugger

今天在看[片](https://www.bimibimi.cc/bangumi/1141/play/1/1/)的时候, 犯了职业病, 按了 `F12`, 然后网站就被无限暂停了

于是我稍微研究了下, 写出了如下代码:

```javascript
const debugFn = new Function('debugger');
setInterval(debugFn, 1000);
```

想看效果的读者按下 `F12` 就行了, 233

感觉还是挺有意思的

<iframe style="display: none;" srcDoc="<script>const debugFn = new Function('\'是不是很好玩啊 233\';\ndebugger;');setInterval(debugFn, 1000);</script>" />
