# Jest 踩坑指南

根据软件工程, 一个成熟的软件必须要做测试, 而 Jest 可以用来方便的做测试, 所以近期我选择去学习下Jest

这是 [Jest 的官方文档](https://jestjs.io)

## 前期准备

首先要有一个像模像样的node工程文件夹, 包括`package.json`, `tslint.json` 和 `tsconfig.json` 等文件

然后新建一个文件为`isObject.ts`文件, 在其中写入以下代码:

```typescript
/**
 * 判断目标对象是否为`Object`
 * 因为`typeof null === 'object'`, 所以使用`!!obj`来排除`null`
 */
export default function isObject(obj: any): obj is {} {
  return !!obj && typeof obj === 'object';
}
```

这样前期准备就完成了, 现在我们准备安装Jest

## 安装

安装使用`yarn`:

```shell
yarn add jest @types/jest
```

然后修改`package.json`:

```javascript
...
"scripts": {
  ...
  "test": "jest"
}
...
```

这样我们在运行 `yarn test` 的时候, 就相当于运行了 `jest`

那为什么我们不能直接运行 `jest` 呢? 是因为 `jest` 或 `jest.cmd` 位于 `./node_modules/.bin/` 目录下,
而这个目录不属于环境变量`PATH`, 在Windows环境下查看此变量可以运行`$env:Path`,
而通过上文介绍的方法时, 它会去本地和全局的 `./node_modules/.bin/` 目录下查找

## 编写测试用例

在`isObject.ts`同级目录下新建一个文件, 为`isObject.test.ts`, 写入如下代码:

```typescript
import isObject from './isObject';

describe('something is object or not', () => {
  test('object is object', () => {
    expect(isObject({})).toBeTruthy();
    expect(isObject(Object.prototype)).toBeTruthy();
  });
  test('array is object', (...args) => {
    expect(isObject([])).toBeTruthy();
    expect(isObject(args)).toBeTruthy();
    expect(isObject(Array.prototype)).toBeTruthy();
  });
  test('null is not object', () => {
    expect(isObject(null)).toBeFalsy();
  });
  test('undefined is not object', () => {
    expect(isObject(undefined)).toBeFalsy();
  });
  test('number is not object', () => {
    expect(isObject(Math.random())).toBeFalsy();
    expect(isObject(Math.PI)).toBeFalsy();
    expect(isObject(Math.max())).toBeFalsy();
    expect(isObject(NaN)).toBeFalsy();
  });
  test('string is not object', () => {
    expect(isObject('')).toBeFalsy();
    expect(isObject(Math.random().toString())).toBeFalsy();
  });
  test('symbol is not object', () => {
    expect(isObject(Symbol())).toBeFalsy();
  });
  test('boolen is not object', () => {
    expect(isObject(true)).toBeFalsy();
    expect(isObject(false)).toBeFalsy();
  });
  test('function is not object', () => {
    expect(isObject(Object.keys)).toBeFalsy();
    expect(isObject(Array.prototype.map)).toBeFalsy();
  });
});
```

`describe`, `test` 和 `expect` 等测试函数不需要手动`import`

## 测试和踩坑

运行 `yarn test`, 输出如下:

```shell
yarn run v1.7.0
$ jest
 FAIL  ./isObject.test.ts
  ● Test suite failed to run

    ./isObject.test.ts:1
    ({"Object.<anonymous>":function(module,exports,require,__dirname,__filename,global,jest){import isObject from './isObject';
                                                                                                    ^^^^^^^^

    SyntaxError: Unexpected identifier

      at ScriptTransformer._transformAndBuildScript (node_modules/@jest/transform/build/ScriptTransformer.js:471:17)
      at ScriptTransformer.transform (node_modules/@jest/transform/build/ScriptTransformer.js:513:25)

Test Suites: 1 failed, 1 total
Tests:       0 total
Snapshots:   0 total
Time:        1.116s
Ran all test suites.
error Command failed with exit code 1.
info Visit https://yarnpkg.com/en/docs/cli/run for documentation about this command.
```

查询后得知, `jest` 默认不支持 `typescript`, 需要配合 `ts-jest` 或 `@babel/preset-typescript` 来使用

两者区别可以参考[这篇文章](https://kulshekhar.github.io/ts-jest/user/babel7-or-ts)

所以我选择了 `ts-jest`

首先是安装:

```shell
yarn add ts-jest
```

然后按照教程修改`package.json`:

```javascript
...
  "jest": {
    "moduleFileExtensions": [
      "ts",
      "tsx",
      "js"
    ],
    "transform": {
      "\\.(ts|tsx)$": "<rootDir>/node_modules/ts-jest/preprocessor.js"
    }
  }
```

然后运行 `yarn test`, 输出如下:

```shell
yarn run v1.7.0
$ jest
ts-jest[main] (WARN) Replace any occurrences of "ts-jest/dist/preprocessor.js" or  "<rootDir>/node_modules/ts-jest/preprocessor.js" in the
'transform' section of your Jest config with just "ts-jest".
```

听取其建议, 继续修改 `package.json`:

```javascript
...
"jest": {
  ...
  "transform": {
    "\\.(ts|tsx)$": "ts-jest"
  }
}
```

然后运行 `yarn test`, 输出如下:

```shell
yarn run v1.7.0
$ jest
 PASS  ./isObject.test.ts
  something is object or not
    √ object is object (4ms)
    √ array is object (1ms)
    √ null is not object
    √ undefined is not object (1ms)
    √ number is not object
    √ string is not object (1ms)
    √ symbol is not object
    √ boolen is not object
    √ function is not object (1ms)

Test Suites: 1 passed, 1 total
Tests:       9 passed, 9 total
Snapshots:   0 total
Time:        3.402s
Ran all test suites.
Done in 4.75s.
```

终于成功了, 欧耶!