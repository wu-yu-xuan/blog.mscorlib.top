import * as React from 'react';
import * as style from './style.scss';
import { Tokens } from 'marked';
import HtmlRender from '../HtmlRender';

export const renderText = (text: string): React.ReactNode => {
  if (text.includes('\n')) {
    return renderText(text.replace(/\n/g, ' '));
  }
  const breakEnd = text.match(/^(.+) {2,}$/);
  if (breakEnd) {
    const [, textLeft] = breakEnd;
    return (
      <>
        {renderText(textLeft)}
        <br />
      </>
    )
  }
  const strongAndEm = text.match(/([*_])([*_])([*_])(.+?)\3\2\1/);
  if (strongAndEm) {
    const [match, , , , value] = strongAndEm;
    const { index } = strongAndEm;
    return (
      <>
        {renderText(text.slice(0, index))}
        <strong className={style.strong}>
          <em className={style.em}>{renderText(value)}</em>
        </strong>
        {renderText(text.slice(index + match.length))}
      </>
    )
  }
  const strong = text.match(/([*_])([*_])(.+?)\2\1/);
  if (strong) {
    const [match, , , value] = strong;
    const { index } = strong;
    return (
      <>
        {renderText(text.slice(0, index))}
        <strong className={style.strong}>{renderText(value)}</strong>
        {renderText(text.slice(index + match.length))}
      </>
    )
  }
  const em = text.match(/([*_])(.+?)\1/);
  if (em) {
    const [match, , value] = em;
    const { index } = em;
    return (
      <>
        {renderText(text.slice(0, index))}
        <em className={style.em}>{renderText(value)}</em>
        {renderText(text.slice(index + match.length))}
      </>
    )
  }
  const titleImgLink = text.match(/\[!\[(.+?)\]\((.+?)\)\]\((.+?)\)/);
  if (titleImgLink) {
    const [match, alt, imgSrc, target] = titleImgLink;
    const { index } = titleImgLink;
    return (
      <>
        {renderText(text.slice(0, index))}
        <a className={style.link} href={target}>
          <img className={style.img} src={imgSrc} title={alt} alt={alt} />
        </a>
        {renderText(text.slice(index + match.length))}
      </>
    )
  }
  const titleImg = text.match(/!\[(.+?)\]\((.+?) +"(.*?)"\)/)
  if (titleImg) {
    const [match, alt, target, title] = titleImg;
    const { index } = titleImg;
    return (
      <>
        {renderText(text.slice(0, index))}
        <img className={style.img} src={target} title={title} alt={alt} />
        {renderText(text.slice(index + match.length))}
      </>
    )
  }
  const img = text.match(/!\[(.+?)\]\((.+?)\)/)
  if (img) {
    const [match, alt, target] = img;
    const { index } = img;
    return (
      <>
        {renderText(text.slice(0, index))}
        <img className={style.img} src={target} title={alt} alt={alt} />
        {renderText(text.slice(index + match.length))}
      </>
    )
  }
  const titleLink = text.match(/\[(.+?)\]\((.+?) +"(.*?)"\)/);
  if (titleLink) {
    const [match, value, target, title] = titleLink;
    const { index } = titleLink;
    return (
      <>
        {renderText(text.slice(0, index))}
        <a className={style.link} href={target} title={title}>{renderText(value)}</a>
        {renderText(text.slice(index + match.length))}
      </>
    )
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
  const complexHtml = text.match(/(<(.+?)>.*?<\/\2>)/);
  if (complexHtml) {
    const [match] = complexHtml;
    const { index } = complexHtml;
    return (
      <>
        {renderText(text.slice(0, index))}
        <HtmlRender text={match} type="html" pre={false} />
        {renderText(text.slice(index + match.length))}
      </>
    )
  }
  const url = text.match(/<(.+?\..+?)>/);
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
  const simpleHtml = text.match(/(<.+?\/?>)/);
  if (simpleHtml) {
    const [match] = simpleHtml;
    const { index } = simpleHtml;
    return (
      <>
        {renderText(text.slice(0, index))}
        <HtmlRender text={match} type="html" pre={false} />
        {renderText(text.slice(index + match.length))}
      </>
    )
  }
  const strikethrough = text.match(/~~(.+?)~~/);
  if (strikethrough) {
    const [match, value] = strikethrough;
    const { index } = strikethrough;
    return (
      <>
        {renderText(text.slice(0, index))}
        <del className={style.del}>{value}</del>
        {renderText(text.slice(index + match.length))}
      </>
    )
  }
  return text;
}

export default class TextRender extends React.PureComponent<Tokens.Text>{
  public render() {
    return (
      <>{renderText(this.props.text)} </>
    );
  }
}