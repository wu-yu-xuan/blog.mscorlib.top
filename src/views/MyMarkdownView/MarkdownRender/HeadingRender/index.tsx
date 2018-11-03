import * as React from 'react';
import { Tokens } from 'marked';
import { renderText } from '../TextRender';
import BlockWrapper from '../BlockWrapper';
import * as style from './style.scss';

export default class HeadingRender extends React.PureComponent<Tokens.Heading>{
  public render() {
    const { depth, text } = this.props;
    const Tag = `h${depth}`
    return (
      <BlockWrapper>
        <Tag className={style[Tag]}>{renderText(text)}</Tag>
      </BlockWrapper>
    )
  }
}