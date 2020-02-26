# github action rollup 踩坑

## 内存溢出

![out of memory](/static/images/github-action踩坑/out-of-memory.png)

github 提供的虚拟机是 3.75g 内存, 所以应该不是到达内存上限

查阅资料发现低版本 node 的内存上限是 1.3g , 与图中吻合

所以解决办法是, 更新 node 至最新版 v12.x

解决后如图所示:

![build success](/static/images/github-action踩坑/build-success.png)

## rollup

报错配置如图:

![rollup-error-config](/static/images/github-action踩坑/rollup-error-config.jpg)

错误如图:

![rollup-error](/static/images/github-action踩坑/rollup-error.png)

原因是 rollup 十分依赖静态分析, 对于一些非常**动态**的库就会分析失败

解决方法是添加 `namedExport` 配置, 可以手写配置, 但是老爹说:

> 要用魔法打败魔法

所以你也可以这样:

```typescript
import typescript from 'rollup-plugin-typescript2';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import * as fs from 'fs-extra';
import * as prettier from 'prettier';

module.exports = {
  input: './src/index.ts',
  output: {
    file: 'lib/index.js',
    format: 'cjs'
  },
  plugins: [
    typescript(),
    nodeResolve({ preferBuiltins: true }),
    commonjs({
      namedExports: {
        'fs-extra': Object.keys(fs),
        prettier: Object.keys(prettier)
      }
    })
  ]
};
```

结果如图, 编译成功

![rollup-success](/static/images/github-action踩坑/rollup-success.png)

## ignore package

在运行时, 抛出了这样的错误:

```
cannot resolve module '@microsoft/typescript-etw'
```

原因是 `@microsoft/typescript-etw` 是仅运行在 Windows 平台上的 log lib

为了全平台兼容性~~强迫症~~, 自然要 ignore 了

于是我找到了 [proteriax/rollup-plugin-ignore](https://github.com/proteriax/rollup-plugin-ignore)

距离我的预期还有点差距, 于是我稍作改动:

```typescript
function ignore(name) {
  return {
    resolveId(id) {
      return id === name ? 'shit' : null;
    },
    load(id) {
      return id === 'shit' ? emptyFile : null;
    }
  };
}
```

结果报错:

```
[!] Error: 'shit' is imported as an external by  shit?commonjs-proxy, but is already an existing non-external module id.
```

那咋办哪, 后来我意外发现了 `@rollup/plugin-commonjs` 自带 ignore option, 凡是 ignore 的, 就会保留 `require`, 而非置顶

达到目的, 完美

## prettier flow

先看报错

```javascript
!function(r,t){t(exports);}(commonjsGlobal,(function(r){var t=function(r,t){var e=new SyntaxError(r+" ("+t.start.line+":"+t.start.column+")");return e.loc=t,e};var
e=function(r,t){if(r.startsWith("#!")){var e=r.indexOf("\n"),n={type:"Line",value:r.slice(2,e),range:[0,e],loc:{source:null,start:{line:1,column:0},end:{line:1,column:e}}};t.comments=[n].concat(t.comments);}};function n(r,t){return r(t={exports:{}},t.exports),t.exports}function u(r){return r&&r.default||r}var a,i=Object.freeze({__proto__:null,default:{EOL:"\n"}}),f=n((function(r){r.exports=function(r){if("string"!=typeof r)throw new TypeError("Expected a string");var t=r.match(/(?:\r?\n)/g)||[];if(0===t.length)return null;var e=t.filter((function(r){return "\r\n"===r})).length;return e>t.length-e?"\r\n":"\n"},r.exports.graceful=function(t){return r.exports(t)||"\n"};})),c=(f.graceful,u(i)),s=n((function(r,t){function e(){var r=c;return e=function(){return r},r}function n(){var r,t=(r=f)&&r.

TypeError: Cannot read property 'process' of undefined
```

原因是 _prettier_ 的 _flow-parser_ 中有 `r.process`, 其实 r 可能为 `undefined`, 导致运行时错误

解法如上, 把 './parser-flow' 给 ignore 了就解决了

## rollup freeze namespace

报错:

```javascript
registeredExtensions.async = function (tbi, conf) {
                           ^
TypeError: Cannot add property async, object is not extensible
```

这段代码上面就是

```typescript
var registeredExtensions = Object.freeze({});
```

emmmm, 原因是 _rollup_ 会把 namespace 默认都 freeze 了, 把 `output.freeze` 改为 `false` 就解决了

## 总结

两天时间配的 rollup 没有跑起来, 半小时配的 webpack 却轻松跑起来了

人生苦短, 我用 webpack

为什么呢?

因为 [rollup 官网](https://rollupjs.org/guide/en/) 标榜它是 **Next-generation ES module bundler**

由于面向 **es** 与 **module**, 所以以下三个方面支持的不太好:

- **js**: 很多库喜欢玩 js 的**动态性**, 比如说我喜欢的 [fs-extra](https://www.npmjs.com/package/fs-extra), 然而 rollup 作为静态分析工具对此类动态性支持的不好
- **ts**: 官方对 typescript 的支持并不优秀, 编译失败也没有提示信息, 不过 [社区产品](https://www.npmjs.com/package/rollup-plugin-typescript2) 可以勉强解决这个问题
- **commonjs**: [官方的 commonjs plugin](https://www.npmjs.com/package/@rollup/plugin-commonjs) 不但没有解决问题, 还引入了更多的问题, 详情参考上文

webpack 真香, 附上最终成功的 webpack 配置:

```JavaScript
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');

const cwd = process.cwd();

module.exports = {
  entry: path.resolve(cwd, './src/index.ts'),
  mode: 'production',
  output: {
    path: path.resolve(cwd, './lib'),
    filename: 'index.js'
  },
  resolve: { extensions: ['.ts', '.js'] },
  target: 'node',
  // do not need node polyfill or other handle
  node: false,
  module: {
    rules: [
      {
        test: /.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
              configFile: path.resolve(cwd, './tsconfig.json')
            }
          }
        ]
      }
    ]
  }
};
```
