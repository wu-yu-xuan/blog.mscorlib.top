import * as React from 'react';
import * as style from './style.scss';
import { Tokens } from 'marked';

export const renderText = (text: string): React.ReactNode => {
  if (text.includes('\n')) {
    return text.split('\n').map((value, index) => {
      return (
        <React.Fragment key={index}>
          {renderText(value)}
          {index !== text.length - 1 && value.match(/.+ {2,}$/) && <br />}
        </React.Fragment>
      )
    });
  }
  const link = text.match(/\[(.+?)\]\((.+?)\)/);
  if (link) {
    const [match, value, target] = link;
    const { index } = link;
    return (
      <>
        {renderText(text.slice(0, index))}
        <a className={style.link} href={target} title={target}>{renderText(value)}</a>
        {renderText(text.slice(index + match.length))}
      </>
    )
  }
  const strongAndEm = text.match(/[*_]{3}(.+?)[*_]{3}/);
  if (strongAndEm) {
    const [match, value] = strongAndEm;
    const { index } = strongAndEm;
    return (
      <>
        {renderText(text.slice(0, index))}
        <strong className={style.strong}>
          <em className={style.em}>{value}</em>
        </strong>
        {renderText(text.slice(index + match.length))}
      </>
    )
  }
  const strong = text.match(/[*_]{2}(.+?)[*_]{2}/);
  if (strong) {
    const [match, value] = strong;
    const { index } = strong;
    return (
      <>
        {renderText(text.slice(0, index))}
        <strong className={style.strong}>{value}</strong>
        {renderText(text.slice(index + match.length))}
      </>
    )
  }
  const em = text.match(/[*_](.+?)[*_]/);
  if (em) {
    const [match, value] = em;
    const { index } = em;
    return (
      <>
        {renderText(text.slice(0, index))}
        <em className={style.em}>{value}</em>
        {renderText(text.slice(index + match.length))}
      </>
    )
  }
  const code = text.match(/`(.+?)`/);
  if (code) {
    const [match, value] = code;
    const { index } = code;
    return (
      <>
        {renderText(text.slice(0, index))}
        <code className={style.code}>{value}</code>
        {renderText(text.slice(index + match.length))}
      </>
    )
  }
  const url = text.match(/<(.+?)>/);
  if (url) {
    const [match, value] = url;
    const { index } = url;
    return (
      <>
        {renderText(text.slice(0, index))}
        <a className={style.link} title={value} href={value}>{value}</a>
        {renderText(text.slice(index + match.length))}
      </>
    )
  }
  return text;
}

export default class TextRender extends React.PureComponent<Tokens.Text>{
  public render() {
    return renderText(this.props.text);
  }
}