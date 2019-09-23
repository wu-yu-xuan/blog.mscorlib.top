import allEmojisPromise from "./allEmojis";

interface EmojisCache {
  [key: string]: Promise<string>;
}

const emojisCache: EmojisCache = {};

/**
 * 获取 type 对应 emoji 的 blob url, 没有则返回空字符串
 * @param type
 */
export default async function getEmoji(type: string) {
  const allEmojis = await allEmojisPromise;
  if (!(type in allEmojis)) {
    return "";
  }
  if (!(type in emojisCache)) {
    emojisCache[type] = fetchEmoji(allEmojis[type]);
  }
  return emojisCache[type];
}

async function fetchEmoji(url: string) {
  const response = await fetch(url);
  return URL.createObjectURL(await response.blob());
}
