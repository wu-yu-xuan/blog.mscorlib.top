import * as React from 'react';
import { message } from 'antd';
import { emoji } from './style.scss';

export interface EmojiProps {
  type: string;
}

let allEmojis: { [key: string]: string } = {};
const subscribtions: Array<() => void> = [];

(async function getAllEmojis() {
  const response = await fetch('https://api.github.com/emojis');
  if (!response.ok) {
    message.error('无法连接至 github emoji 服务');
    return;
  }
  allEmojis = JSON.parse(await response.text());
  subscribtions.forEach(s => s());
})();

/**
 * github 支持的 emoji
 * 找不到支持的或网不好就会返回原文字
 * 随手实现一个简单的发布订阅 233
 * 大小会和周围元素相同
 * @see https://github.com/ikatyang/emoji-cheat-sheet/blob/master/README.md
 */
export default function Emoji({ type }: EmojiProps) {
  const [flag, setRefresh] = React.useState(!!Object.keys(allEmojis).length);
  const imgRef = React.useRef<HTMLImageElement>(null);
  React.useEffect(() => {
    if (!flag) {
      const refresh = () => setRefresh(true);
      subscribtions.push(refresh);
      return () => {
        const index = subscribtions.findIndex(v => v === refresh);
        if (index > -1) {
          subscribtions.splice(index, 1);
        }
      };
    } else {
      if (imgRef.current) {
        const { fontSize } = getComputedStyle(imgRef.current);
        const size = parseInt(fontSize);
        imgRef.current.width = size;
        imgRef.current.height = size;
      }
    }
    return undefined;
  }, [flag]);
  if (type in allEmojis) {
    return (
      <img
        ref={imgRef}
        title={type}
        alt={type}
        height={20}
        width={20}
        src={allEmojis[type]}
        className={emoji}
      />
    );
  }
  return <>:{type}:</>;
}
