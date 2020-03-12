import React from 'react';
import { Tokens } from 'marked';
import TextRender from '../TextRender';
import BlockWrapper from '../BlockWrapper';
import style from './style.scss';
import classNames from 'classnames';
import HrRender from '../HrRender';
import { LinkOutlined } from '@ant-design/icons';

export default React.memo(function HeadingRender({
  depth,
  text
}: Tokens.Heading) {
  const Tag = `h${depth}` as keyof JSX.IntrinsicElements;
  const idMatch = text.match(/(.+) +{#(.+)}/);
  const id = (idMatch ? idMatch[2] : text).replace(/ /g, '-').toLowerCase();
  const txt = idMatch ? idMatch[1] : text;
  return (
    <BlockWrapper>
      <Tag className={classNames(style.h, style[Tag])} id={id}>
        <TextRender text={txt} />
        <a href={`#${id}`} className={style.link}>
          <LinkOutlined />
        </a>
      </Tag>
      {depth === 1 && <HrRender />}
    </BlockWrapper>
  );
});
