import * as React from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atelierHeathLight } from 'react-syntax-highlighter/styles/hljs';

interface CodeRenderProps {
  language?: string;
  value?: string;
}

export default class CodeRender extends React.PureComponent<CodeRenderProps> {
  public static defaultProps = {
    language: '',
    value: ''
  }
  public render() {
    const { language, value } = this.props;
    return <SyntaxHighlighter language={language} style={atelierHeathLight}>{value}</SyntaxHighlighter>;
  }
}