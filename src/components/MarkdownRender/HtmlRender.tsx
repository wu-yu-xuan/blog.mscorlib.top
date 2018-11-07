import * as React from 'react';
import { Tokens } from 'marked';

export default class HtmlRender extends React.PureComponent<Tokens.HTML>{
  public render() {
    return <span dangerouslySetInnerHTML={{ __html: this.props.text }} />
  }
}