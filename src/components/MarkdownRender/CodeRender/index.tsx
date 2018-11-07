import * as React from 'react';
import { Tokens } from 'marked';
import BlockWrapper from '../BlockWrapper';
import * as style from './style.scss';

export default class CodeRender extends React.PureComponent<Tokens.Code>{
  private keyWords = ["abstract", "arguments", "as", "async", "await", "boolean", "break", "byte", "case", "catch", "char", "class", "const", "continue", "debugger", "default", "delete", "do", "double", "else", "enum", "eval", "export", "extends", "false", "final", "finally", "float", "for", "from", "function", "goto", "if", "implements", "import", "in", "instanceof", "int", "interface", "let", "long", "native", "new", "null", "package", "private", "protected", "public", "return", "short", "static", "super", "switch", "synchronized", "this", "throw", "throws", "transient", "true", "try", "typeof", "undefined", "var", "void", "volatile", "while", "with", "yield"];
  private renderCode = (code: string): React.ReactNode => {
    const wordMatch = code.match(/\w+/);
    if (!wordMatch) {
      return code;
    }
    const [match] = wordMatch;
    const { index } = wordMatch;
    if (this.keyWords.includes(match)) {
      return (
        <>
          {code.slice(0, index)}
          <span className={style.keyword}>{match}</span>
          {this.renderCode(code.slice(index + match.length))}
        </>
      )
    }
    return (
      <>
        {code.slice(0, index + match.length)}
        {this.renderCode(code.slice(index + match.length))}
      </>
    );
  }
  public render() {
    return (
      <BlockWrapper>
        <pre className={style.pre}>
          <code>{this.renderCode(this.props.text)}</code>
        </pre>
      </BlockWrapper>
    )
  }
}