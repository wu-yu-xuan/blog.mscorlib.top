import * as React from 'react';
import { emoji } from './style.scss';
import getEmoji from './getEmoji';
import useFetch from 'src/useFetch';

export interface EmojiProps {
  type: string;
}

/**
 * github 支持的 emoji
 * 找不到支持的或网不好就会返回原文字
 * 大小会和周围元素相同
 * @see https://github.com/ikatyang/emoji-cheat-sheet/blob/master/README.md
 */
export default function Emoji({ type }: EmojiProps) {
  return (
    <React.Suspense fallback={<>:{type}:</>}>
      <Img type={type} />
    </React.Suspense>
  );
}

function Img({ type }: EmojiProps) {
  const [src] = useFetch(getEmoji, type);
  const imgRef = React.useRef<HTMLImageElement>(null);
  React.useLayoutEffect(() => {
    if (imgRef.current) {
      const { fontSize } = getComputedStyle(imgRef.current);
      const size = parseInt(fontSize);
      imgRef.current.width = size;
      imgRef.current.height = size;
    }
  }, [src]);
  if (src) {
    return (
      <img
        ref={imgRef}
        title={type}
        alt={type}
        height={20}
        width={20}
        src={src}
        className={emoji}
      />
    );
  } else {
    return <>:{type}:</>;
  }
}
