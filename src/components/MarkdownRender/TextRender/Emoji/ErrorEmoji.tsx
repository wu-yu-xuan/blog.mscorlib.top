import React from 'react';
import style from './style.scss';

interface ErrorEmojiProps {
  type: string;
  status: 'loading' | 'error';
}

export default function ErrorEmoji({ type, status }: ErrorEmojiProps) {
  return (
    <span
      title={status === 'loading' ? '加载中...' : '加载失败'}
      className={style[status]}
    >
      :{type}:
    </span>
  );
}
