# CSS实现高度是宽度的一半

> talk is cheap, show me your code

```html
<!DOCTYPE html>
<html lang="zh-cn">

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <meta name="renderer" content="webkit">
  <meta name="theme-color" content="#000000">
  <title>高度是宽度的一半</title>
  <!-- 一个元素的 padding，如果值是一个百分比，那这个百分比是相对于其父元素的宽度而言的，padding-bottom 也是如此。 -->
  <style>
    #inner {
      padding: 25% 0;
      background: #ccc;
    }
  </style>
</head>

<body>
  <div id="root">
    <div id="inner"></div>
  </div>
</body>

</html>
```

效果如下:

<div style="padding: 25% 0;background: #ccc;"></div>