import React from 'react';
import style from './style.scss';
import useEmoji from './useEmoji';

interface EmojiImgProps {
  type: string;
}

export default function EmojiImg({ type }: EmojiImgProps) {
  const src = useEmoji(type);
  return (
    <img
      ref={adjustSize}
      title={type}
      alt={type}
      height={20}
      width={20}
      src={src}
      className={style.emoji}
    />
  );
}

function adjustSize(element: HTMLImageElement | null) {
  if (!element) {
    return;
  }
  const { fontSize } = getComputedStyle(element);
  const size = parseInt(fontSize);
  element.width = size;
  element.height = size;
}
