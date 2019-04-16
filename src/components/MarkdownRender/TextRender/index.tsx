import * as React from 'react';
import * as style from './style.scss';
import HtmlRender from '../HtmlRender';
import RegJSXMap, { IRegJSXMap } from '../RegJSXMap';

const map: IRegJSXMap = new Map<RegExp, (reg: RegExpMatchArray) => JSX.Element>([
  [/^(.+) {2,}$/, ([, textLeft]) => {
    return (
      <>
        {RegJSXMap(textLeft, map)}
        <br />
      </>
    )
  }], [/\*{3}(.+?)\*{3}/, strongAndEm => {
    const [match, value] = strongAndEm;
    const { index, input } = strongAndEm;
    return (
      <>
        {RegJSXMap(input.slice(0, index), map)}
        <strong className={style.strong}>
          <em className={style.em}>{RegJSXMap(value, map)}</em>
        </strong>
        {RegJSXMap(input.slice(index + match.length), map)}
      </>
    )
  }], [/\*{2}(.+?)\*{2}/, strong => {
    const [match, value] = strong;
    const { index, input } = strong;
    return (
      <>
        {RegJSXMap(input.slice(0, index), map)}
        <strong className={style.strong}>{RegJSXMap(value, map)}</strong>
        {RegJSXMap(input.slice(index + match.length), map)}
      </>
    )
  }], [/\*(.+?)\*/, em => {
    const [match, value] = em;
    const { index, input } = em;
    return (
      <>
        {RegJSXMap(input.slice(0, index), map)}
        <em className={style.em}>{RegJSXMap(value, map)}</em>
        {RegJSXMap(input.slice(index + match.length), map)}
      </>
    )
  }], [/\[!\[(.+?)\]\((.+?)\)\]\((.+?)\)/, titleImgLink => {
    const [match, alt, imgSrc, target] = titleImgLink;
    const { index, input } = titleImgLink;
    return (
      <>
        {RegJSXMap(input.slice(0, index), map)}
        <a className={style.link} href={target}>
          <img className={style.img} src={imgSrc} title={alt} alt={alt} />
        </a>
        {RegJSXMap(input.slice(index + match.length), map)}
      </>
    )
  }], [/!\[(.+?)\]\((.+?) +"(.*?)"\)/, titleImg => {
    const [match, alt, target, title] = titleImg;
    const { index, input } = titleImg;
    return (
      <>
        {RegJSXMap(input.slice(0, index), map)}
        <img className={style.img} src={target} title={title} alt={alt} />
        {RegJSXMap(input.slice(index + match.length), map)}
      </>
    )
  }], [/!\[(.+?)?\]\((.+?)\)/, img => {
    const [match, alt, target] = img;
    const { index, input } = img;
    return (
      <>
        {RegJSXMap(input.slice(0, index), map)}
        <img className={style.img} src={target} title={alt || target} alt={alt || target} />
        {RegJSXMap(input.slice(index + match.length), map)}
      </>
    )
  }], [/\[(.+?)\]\((.+?) +"(.*?)"\)/, titleLink => {
    const [match, value, target, title] = titleLink;
    const { index, input } = titleLink;
    return (
      <>
        {RegJSXMap(input.slice(0, index), map)}
        <a className={style.link} href={target} title={title}>{RegJSXMap(value, map)}</a>
        {RegJSXMap(input.slice(index + match.length), map)}
      </>
    )
  }], [/\[(.+?)\]\((.+?)\)/, link => {
    const [match, value, target] = link;
    const { index, input } = link;
    return (
      <>
        {RegJSXMap(input.slice(0, index), map)}
        <a className={style.link} href={target} title={target}>{RegJSXMap(value, map)}</a>
        {RegJSXMap(input.slice(index + match.length), map)}
      </>
    )
  }], [/`(.+?)`/, code => {
    const [match, value] = code;
    const { index, input } = code;
    return (
      <>
        {RegJSXMap(input.slice(0, index), map)}
        <code className={style.code}>{value}</code>
        {RegJSXMap(input.slice(index + match.length), map)}
      </>
    )
  }], [/(<(.+?)>.*?<\/\2>)/, complexHtml => {
    const [match] = complexHtml;
    const { index, input } = complexHtml;
    return (
      <>
        {RegJSXMap(input.slice(0, index), map)}
        <HtmlRender text={match} type="html" pre={false} />
        {RegJSXMap(input.slice(index + match.length), map)}
      </>
    )
  }], [/<(.+?\..+?)>/, url => {
    const [match, value] = url;
    const { index, input } = url;
    return (
      <>
        {RegJSXMap(input.slice(0, index), map)}
        <a className={style.link} title={value} href={value}>{value}</a>
        {RegJSXMap(input.slice(index + match.length), map)}
      </>
    )
  }], [/(<.+?\/?>)/, simpleHtml => {
    const [match] = simpleHtml;
    const { index, input } = simpleHtml;
    return (
      <>
        {RegJSXMap(input.slice(0, index), map)}
        <HtmlRender text={match} type="html" pre={false} />
        {RegJSXMap(input.slice(index + match.length), map)}
      </>
    )
  }], [/~~(.+?)~~/, strikethrough => {
    const [match, value] = strikethrough;
    const { index, input } = strikethrough;
    return (
      <>
        {RegJSXMap(input.slice(0, index), map)}
        <del className={style.del}>{value}</del>
        {RegJSXMap(input.slice(index + match.length), map)}
      </>
    )
  }], [/[\w\W]*/, ({ input }) => <span>{input}</span>]
]);

interface IText {
  text: string;
}

export default function TextRender({ text }: IText) {
  return RegJSXMap(text.replace(/\n/g, ' '), map);
}