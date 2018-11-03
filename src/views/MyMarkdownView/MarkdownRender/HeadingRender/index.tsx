import * as React from 'react';
import { Tokens } from 'marked';
import { renderText } from '../TextRender';
import BlockWrapper from '../BlockWrapper';
import * as style from './style.scss';
import { Icon } from 'antd';

export default class HeadingRender extends React.PureComponent<Tokens.Heading>{
  public render() {
    const { depth, text } = this.props;
    const Tag = `h${depth}`
    return (
      <BlockWrapper>
        <Tag className={style[Tag]} id={text}>
          {renderText(text)}
          <a href={`#${text}`} className={style.link}>
            <Icon type="link" />
          </a>
        </Tag>
      </BlockWrapper>
    )
  }
}