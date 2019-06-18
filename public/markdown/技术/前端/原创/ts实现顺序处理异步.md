# ts实现顺序处理异步

> talk is cheap, show me your code

```typescript
async function each(promises: Array<Promise<any> | PromiseLike<any>>) {
  console.time();
  for await (const promise of promises) {
    console.log(promise);
  }
  console.timeEnd();
}

// 一个耗时的异步
function p(value: any, wait: number) {
  return new Promise((resolve) => setTimeout(() => resolve(value), wait));
}

each([p(1, 1000), p(2, 500)]);
each([p(1, 1000), p(2, 3000)]);
```

result:

```
1
2
default: 1010.684ms
1
// after 2 seconds
2
default: 3001.969ms
```

好吧,这会不会太简单了.  
如果不用ES7的骚气语法,该怎么实现呢?

```typescript
async function each(promises: Array<Promise<any> | PromiseLike<any>>) {
  console.time();

  const results: any[] = [];
  let current = 0;

  const check = () => {
    while (results[current]) {
      console.log(results[current]);
      current++;
      if (current === promises.length) {
        console.timeEnd();
      }
    }
  }

  promises.forEach((promise: Promise<any>, index: number) => {
    promise.then((v) => {
      results[index] = v;
      check();
    });
  });
}

// 模拟一个耗时的异步
function p(value: any, wait: number) {
  return new Promise((resolve) => setTimeout(() => resolve(value), wait));
}

each([p(1, 1000), p(2, 500)]);
each([p(1, 1000), p(2, 3000)]);
```

results:

```
1
2
default: 1010.129ms
1
// after 2 seconds
2
default: 3001.989ms
```

注意,上述代码可能会有个小warning,怎么解决warning这里就不赘述了