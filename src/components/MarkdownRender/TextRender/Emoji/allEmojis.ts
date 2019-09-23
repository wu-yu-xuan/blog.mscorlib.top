import { message } from "antd";

interface Emojis {
  [key: string]: string;
}

async function getAllEmojis(): Promise<Emojis> {
  const response = await fetch("https://api.github.com/emojis");
  if (!response.ok) {
    message.error("无法连接至 github emoji 服务");
    return {};
  }
  return response.json();
}

export default getAllEmojis();
