import * as React from 'react';
import * as style from './style.scss';
import HtmlRender from '../HtmlRender';
import RegJSXMap, { IRegJSXMap } from '../RegJSXMap';
import Image from 'react-zmage';
import Emoji from './Emoji';

const map: IRegJSXMap = new Map<RegExp, (reg: RegExpMatchArray) => JSX.Element>(
  [
    [
      /^(.+) {2,}$/m,
      Br => {
        const [match, value] = Br;
        const { index, input } = Br;
        return (
          <>
            {RegJSXMap(value, map)}
            <br />
            {RegJSXMap(input.slice(index + match.length), map)}
          </>
        );
      }
    ],
    [
      /(.+)\n/,
      newLine => {
        const [match, value] = newLine;
        const { index, input } = newLine;
        return (
          <>
            {RegJSXMap(value, map)}{' '}
            {RegJSXMap(input.slice(index + match.length), map)}
          </>
        );
      }
    ],
    [
      /~~(.+?)~~/,
      strikethrough => {
        const [match, value] = strikethrough;
        const { index, input } = strikethrough;
        /**
         * 这个del的写法是致敬萌娘百科的
         * @see https://zh.moegirl.org/
         */
        return (
          <>
            {RegJSXMap(input.slice(0, index), map)}
            <del title="你知道的太多了" className={style.del}>
              {RegJSXMap(value, map)}
            </del>
            {RegJSXMap(input.slice(index + match.length), map)}
          </>
        );
      }
    ],
    [
      /\[!\[(.+?)\]\((.+?)\)\]\((.+?)\)/,
      titleImgLink => {
        const [match, alt, imgSrc, target] = titleImgLink;
        const { index, input } = titleImgLink;
        return (
          <>
            {RegJSXMap(input.slice(0, index), map)}
            <a className={style.link} href={target}>
              <Image className={style.img} src={imgSrc} title={alt} alt={alt} />
            </a>
            {RegJSXMap(input.slice(index + match.length), map)}
          </>
        );
      }
    ],
    [
      /!\[(.+?)\]\((.+?) +"(.*?)"\)/,
      titleImg => {
        const [match, alt, target, title] = titleImg;
        const { index, input } = titleImg;
        return (
          <>
            {RegJSXMap(input.slice(0, index), map)}
            <Image className={style.img} src={target} title={title} alt={alt} />
            {RegJSXMap(input.slice(index + match.length), map)}
          </>
        );
      }
    ],
    [
      /!\[(.+?)?\]\((.+?)\)/,
      img => {
        const [match, alt, target] = img;
        const { index, input } = img;
        return (
          <>
            {RegJSXMap(input.slice(0, index), map)}
            <Image
              className={style.img}
              src={target}
              title={alt || target}
              alt={alt || target}
            />
            {RegJSXMap(input.slice(index + match.length), map)}
          </>
        );
      }
    ],
    [
      /\[(.+?)\]\((.+?) +"(.*?)"\)/,
      titleLink => {
        const [match, value, target, title] = titleLink;
        const { index, input } = titleLink;
        return (
          <>
            {RegJSXMap(input.slice(0, index), map)}
            <a className={style.link} href={target} title={title}>
              {RegJSXMap(value, map)}
            </a>
            {RegJSXMap(input.slice(index + match.length), map)}
          </>
        );
      }
    ],
    [
      /\[(.+?)\]\((.+?)\)/,
      link => {
        const [match, value, target] = link;
        const { index, input } = link;
        return (
          <>
            {RegJSXMap(input.slice(0, index), map)}
            <a className={style.link} href={target} title={target}>
              {RegJSXMap(value, map)}
            </a>
            {RegJSXMap(input.slice(index + match.length), map)}
          </>
        );
      }
    ],
    [
      /`(.+?)`/,
      code => {
        const [match, value] = code;
        const { index, input } = code;
        return (
          <>
            {RegJSXMap(input.slice(0, index), map)}
            <code className={style.code}>{value}</code>
            {RegJSXMap(input.slice(index + match.length), map)}
          </>
        );
      }
    ],
    [
      /(<(.+?)>.*?<\/\2>)/,
      complexHtml => {
        const [match] = complexHtml;
        const { index, input } = complexHtml;
        return (
          <>
            {RegJSXMap(input.slice(0, index), map)}
            <HtmlRender text={match} type="html" pre={false} />
            {RegJSXMap(input.slice(index + match.length), map)}
          </>
        );
      }
    ],
    [
      /<(.+?\..+?)>/,
      url => {
        const [match, value] = url;
        const { index, input } = url;
        return (
          <>
            {RegJSXMap(input.slice(0, index), map)}
            <a className={style.link} title={value} href={value}>
              {value}
            </a>
            {RegJSXMap(input.slice(index + match.length), map)}
          </>
        );
      }
    ],
    [
      /(<.+?\/?>)/,
      simpleHtml => {
        const [match] = simpleHtml;
        const { index, input } = simpleHtml;
        return (
          <>
            {RegJSXMap(input.slice(0, index), map)}
            <HtmlRender text={match} type="html" pre={false} />
            {RegJSXMap(input.slice(index + match.length), map)}
          </>
        );
      }
    ],
    [
      /:([\d\w_+-]+?):/,
      emoji => {
        const [match, value] = emoji;
        const { index, input } = emoji;
        return (
          <>
            {RegJSXMap(input.slice(0, index), map)}
            <Emoji type={value} />
            {RegJSXMap(input.slice(index + match.length), map)}
          </>
        );
      }
    ],
    [
      /([*_])([*_])([*_])(.+?)\3\2\1/,
      strongAndEm => {
        const [match, , , , value] = strongAndEm;
        const { index, input } = strongAndEm;
        return (
          <>
            {RegJSXMap(input.slice(0, index), map)}
            <strong className={style.strong}>
              <em className={style.em}>{RegJSXMap(value, map)}</em>
            </strong>
            {RegJSXMap(input.slice(index + match.length), map)}
          </>
        );
      }
    ],
    [
      /([*_])([*_])(.+?)\2\1/,
      strong => {
        const [match, , , value] = strong;
        const { index, input } = strong;
        return (
          <>
            {RegJSXMap(input.slice(0, index), map)}
            <strong className={style.strong}>{RegJSXMap(value, map)}</strong>
            {RegJSXMap(input.slice(index + match.length), map)}
          </>
        );
      }
    ],
    [
      /([*_])(.+?)\1/,
      em => {
        const [match, , value] = em;
        const { index, input } = em;
        return (
          <>
            {RegJSXMap(input.slice(0, index), map)}
            <em className={style.em}>{RegJSXMap(value, map)}</em>
            {RegJSXMap(input.slice(index + match.length), map)}
          </>
        );
      }
    ],

    [/[\w\W]*/, ({ input }) => input && <span>{input}</span>]
  ]
);

interface IText {
  text: string;
}

export default function TextRender({ text }: IText) {
  return RegJSXMap(text, map);
}
