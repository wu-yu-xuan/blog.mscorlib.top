import * as React from 'react';
import * as style from './style.scss';

export default class InlineCodeRender extends React.PureComponent {
  public render() {
    return <code className={style.inlineCode}>{this.props.children}</code>
  }
}