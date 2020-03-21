interface Cache<T = any> {
  data: T;
  error: Error | typeof initError;
  promise: Promise<T>;
}

const cache: { [key: string]: Cache } = {};

/**
 * 以前初始值是 `undefined`, 当 `promise` 返回 `undefined` 时会引起递归
 */
const initData = Symbol('init data');
const initError = Symbol('no error');

/**
 * 说白了就是配合 `React.Suspence` 可以 "异步转同步"
 * 删除了 `error`, 将由 `ErrorBoundary` 处理
 * @param fn
 * @param args
 */
export default function useFetch<T extends any[], Data = any>(
  fn: (...args: T) => Promise<Data>,
  ...args: T
): Data {
  const key = fn.name + args.toString();
  if (!cache[key]) {
    cache[key] = {
      data: initData,
      error: initError,
      promise: fn(...args)
        .then(data => (cache[key].data = data))
        .catch(error => (cache[key].error = error))
    };
  }
  if (cache[key].data === initData && cache[key].error === initError) {
    throw cache[key].promise;
  }
  if (cache[key].error !== initError) {
    /**
     * 下面这种骚写法是为了规避 react-error-overlay
     */
    try {
      JSON.parse('<');
    } catch {
      JSON.parse('<');
    }
    // 异步错误转同步错误抛出, 真蛋疼
    // throw cache[key].error;
  }
  return cache[key].data;
}
