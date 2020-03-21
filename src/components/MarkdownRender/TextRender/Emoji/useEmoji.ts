import { message } from 'antd';
import usePromise from 'src/usePromise';

export default function useEmoji(type: string) {
  const emojis = usePromise(getAllEmojis);
  if (!(type in emojis)) {
    throw new Error();
  }
  return usePromise(fetchEmoji, emojis[type]);
}

interface Emojis {
  [key: string]: string;
}

async function getAllEmojis(): Promise<Emojis> {
  const response = await fetch('https://api.github.com/emojis');
  if (!response.ok) {
    message.error('无法连接至 github emoji 服务');
    throw new Error();
  }
  return response.json();
}

async function fetchEmoji(url: string) {
  const response = await fetch(url);
  return URL.createObjectURL(await response.blob());
}
