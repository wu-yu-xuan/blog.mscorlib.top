import React from 'react';
import ErrorEmoji from './ErrorEmoji';
import ErrorBoundary from 'src/ErrorBoundary';
import EmojiImg from './EmojiImg';

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
    <ErrorBoundary fallback={<ErrorEmoji type={type} status="error" />}>
      <React.Suspense fallback={<ErrorEmoji type={type} status="loading" />}>
        <EmojiImg type={type} />
      </React.Suspense>
    </ErrorBoundary>
  );
}
