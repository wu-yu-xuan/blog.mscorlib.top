import React from 'react';
import style from './style.scss';

interface IBlockquoteRender {
  type: string;
}

export default function BlockquoteRender({
  children
}: React.PropsWithChildren<IBlockquoteRender>) {
  return <blockquote className={style.blockquote}>{children}</blockquote>;
}
