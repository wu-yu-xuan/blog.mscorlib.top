import { useCallback } from 'react';

interface Cache<T = any, E = Error> {
  data: T;
  error: E;
  promise: Promise<T>;
}

const cache: { [key: string]: Cache } = {};

export default function useFetch<T extends any[], Data = any, E = Error>(
  fn: (...args: T) => Promise<Data>,
  ...args: T
): [Data, E] {
  const key = fn.name + args.toString();
  const refresh = useCallback(async () => {
    cache[key] = {
      data: undefined,
      error: undefined,
      promise: fn(...args)
        .then(data => (cache[key].data = data))
        .catch(error => (cache[key].error = error))
    };
  }, args);
  if (!cache[key]) {
    refresh();
  }
  if (
    typeof cache[key].data === 'undefined' &&
    typeof cache[key].error === 'undefined'
  ) {
    throw cache[key].promise;
  }
  return [cache[key].data, (cache[key].error as any) as E];
}
