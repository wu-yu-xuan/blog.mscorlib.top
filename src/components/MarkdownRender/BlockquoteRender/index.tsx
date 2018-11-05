import * as React from 'react';
import { Tokens } from 'marked';
import * as style from './style.scss';

export default class BlockquoteRender extends React.PureComponent<Tokens.BlockquoteStart>{
  public render() {
    return <blockquote className={style.blockquote}>{this.props.children}</blockquote>
  }
}