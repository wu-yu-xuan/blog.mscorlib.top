import * as React from 'react';
import { Tokens } from 'marked';
import * as style from './style.scss';
import TextRender from '../TextRender';
import BlockWrapper from '../BlockWrapper';

export default React.memo(function ParagraphRender({ text }: Tokens.Paragraph) {
  return (
    <BlockWrapper>
      <p className={style.p}>
        <TextRender text={text} />
      </p>
    </BlockWrapper>
  )
});