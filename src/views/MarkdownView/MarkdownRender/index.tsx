import * as React from 'react';
import CodeRender from './CodeRender';
import * as ReactMarkdown from 'react-markdown';
import InlineCodeRender from './InlineCodeRender';

interface MarkdownRenderProps {
  source: string;
}

export default class MarkdownRender extends React.PureComponent<MarkdownRenderProps>{
  public render() {
    return <ReactMarkdown source={this.props.source} renderers={{ code: CodeRender, inlineCode: InlineCodeRender }} />
  }
}