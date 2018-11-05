import * as React from 'react';
import { Tokens } from 'marked';
import * as style from './style.scss';
import { renderText } from '../TextRender';
import BlockWrapper from '../BlockWrapper';

export default class ParagraphRender extends React.PureComponent<Tokens.Paragraph>{
  public render() {
    return (
      <BlockWrapper>
        <p className={style.p}>{renderText(this.props.text)}</p>
      </BlockWrapper>
    )
  }
}