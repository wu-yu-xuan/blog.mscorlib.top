import * as React from 'react';
import * as style from './style.scss';

interface IBlockquoteRender {
  children?: React.ReactNode;
  type: string;
}

export default function BlockquoteRender({ children }: IBlockquoteRender) {
  return <blockquote className={style.blockquote}>{children}</blockquote>
}