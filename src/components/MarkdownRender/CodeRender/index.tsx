import * as React from 'react';
import { Tokens } from 'marked';
import BlockWrapper from '../BlockWrapper';
import * as style from './style.scss';
import keyWords from './keyWords';
import RegJSXMap, { IRegJSXMap } from '../RegJSXMap';

const map: IRegJSXMap = new Map<RegExp, (reg: RegExpMatchArray) => JSX.Element>([
  [/(\/\*[\w\W]*?\*\/)/, mutilCommentMatch => {
    return (
      <>
        {RegJSXMap(mutilCommentMatch.input.slice(0, mutilCommentMatch.index), map)}
        <span className={style.comment}>{mutilCommentMatch[0]}</span>
        {RegJSXMap(mutilCommentMatch.input.slice(mutilCommentMatch.index + mutilCommentMatch[0].length), map)}
      </>
    )
  }], [/(\/\/.*)$/m, commentMatch => {
    return (
      <>
        {RegJSXMap(commentMatch.input.slice(0, commentMatch.index), map)}
        <span className={style.comment}>{commentMatch[0]}</span>
        {RegJSXMap(commentMatch.input.slice(commentMatch.index + commentMatch[0].length), map)}
      </>
    )
  }], [/(['"]).*?\1/m, stringMatch => {
    return (
      <>
        {RegJSXMap(stringMatch.input.slice(0, stringMatch.index), map)}
        <span className={style.string}>{stringMatch[0]}</span>
        {RegJSXMap(stringMatch.input.slice(stringMatch.index + stringMatch[0].length), map)}
      </>
    )
  }], [/\w+/, wordMatch => {
    const { index, input } = wordMatch;
    const [match] = wordMatch;
    if (keyWords.includes(wordMatch[0])) {
      return (
        <>
          {input.slice(0, index)}
          <span className={style.keyword}>{match}</span>
          {RegJSXMap(input.slice(index + match.length), map)}
        </>
      )
    }
    return (
      <>
        {input.slice(0, index + match.length)}
        {RegJSXMap(input.slice(index + match.length), map)}
      </>
    );
  }], [/[\w\W]*/, ({ input }) => input && <span>{input}</span>]
])

export default React.memo(function CodeRender({ text }: Tokens.Code) {
  return (
    <BlockWrapper>
      <pre className={style.pre}>
        <code>{RegJSXMap(text, map)}</code>
      </pre>
    </BlockWrapper>
  )
})