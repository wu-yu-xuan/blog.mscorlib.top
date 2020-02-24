# github action 踩坑

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
