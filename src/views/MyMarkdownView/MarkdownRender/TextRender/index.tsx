import * as React from 'react';
import * as style from './style.scss';
import { Tokens } from 'marked';

export const renderText = (text: string): React.ReactNode => {
  if (text.includes('\n')) {
    return text.split('\n').map((value, index) => {
      return (
        <React.Fragment key={index}>
          {renderText(value)}
          {index !== text.length - 1 && value.match(new RegExp('.+ {2,}$')) && <br />}
        </React.Fragment>
      )
    });
  }
  const strongAndEm = text.match(new RegExp('[*_]{3}(.+?)[*_]{3}'));
  if (strongAndEm) {
    const [match, value] = strongAndEm;
    const { index } = strongAndEm;
    return (
      <>
        <strong className={style.strong}>
          <em className={style.em}>{value}</em>
        </strong>
        {renderText(text.slice(index + match.length))}
      </>
    )
  }
  const strong = text.match(new RegExp('[*_]{2}(.+?)[*_]{2}'));
  if (strong) {
    const [match, value] = strong;
    const { index } = strong;
    return (
      <>
        <strong className={style.strong}>{value}</strong>
        {renderText(text.slice(index + match.length))}
      </>
    )
  }
  const em = text.match(new RegExp('[*_]{1}(.+?)[*_]{1}'));
  if (em) {
    const [match, value] = em;
    const { index } = em;
    return (
      <>
        <em className={style.em}>{value}</em>
        {renderText(text.slice(index + match.length))}
      </>
    )
  }
  return text.trim();
}

export default class TextRender extends React.PureComponent<Tokens.Text>{
  public render() {
    return renderText(this.props.text);
  }
}