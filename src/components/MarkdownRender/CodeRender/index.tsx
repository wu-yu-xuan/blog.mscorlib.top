import * as React from 'react';
import { Tokens } from 'marked';
import BlockWrapper from '../BlockWrapper';
import * as style from './style.scss';
import keyWords from './keyWords';

export default class CodeRender extends React.PureComponent<Tokens.Code>{
  private renderCode = (code: string): React.ReactNode => {
    const mutilCommentMatch = code.match(/(\/\*[\w\W]*\*\/)/);
    if (mutilCommentMatch) {
      return (
        <>
          {this.renderCode(code.slice(0, mutilCommentMatch.index))}
          <span className={style.comment}>{mutilCommentMatch[0]}</span>
          {this.renderCode(code.slice(mutilCommentMatch.index + mutilCommentMatch[0].length))}
        </>
      )
    }
    const commentMatch = code.match(/(\/\/.*)$/m);
    if (commentMatch) {
      return (
        <>
          {this.renderCode(code.slice(0, commentMatch.index))}
          <span className={style.comment}>{commentMatch[0]}</span>
          {this.renderCode(code.slice(commentMatch.index + commentMatch[0].length))}
        </>
      )
    }
    const wordMatch = code.match(/\w+/);
    if (!wordMatch) {
      return code;
    }
    const [match] = wordMatch;
    const { index } = wordMatch;
    if (keyWords.includes(match)) {
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