import React from 'react';
import RegJSXMap, { IRegJSXMap } from '../../../RegJSXMap';
import keyWords from './keyWords';
import style from '../../style.scss';
import { languageRegMapItem } from '../interface';

const languages = ['bash'];

const map: IRegJSXMap = new Map<RegExp, (reg: RegExpMatchArray) => JSX.Element>(
  [
    [
      /(#.*)$/m,
      commentMatch => (
          <>
            {RegJSXMap(commentMatch.input.slice(0, commentMatch.index), map)}
            <span className={style.comment}>{commentMatch[0]}</span>
            {RegJSXMap(
              commentMatch.input.slice(
                commentMatch.index + commentMatch[0].length
              ),
              map
            )}
          </>
        )
    ],
    [
      /(['"]).*?\1/m,
      stringMatch => (
          <>
            {RegJSXMap(stringMatch.input.slice(0, stringMatch.index), map)}
            <span className={style.string}>{stringMatch[0]}</span>
            {RegJSXMap(
              stringMatch.input.slice(
                stringMatch.index + stringMatch[0].length
              ),
              map
            )}
          </>
        )
    ],
    [
      /\w+/,
      wordMatch => {
        const { index, input } = wordMatch;
        const [match] = wordMatch;
        if (keyWords.includes(wordMatch[0])) {
          return (
            <>
              {input.slice(0, index)}
              <span className={style.keyword}>{match}</span>
              {RegJSXMap(input.slice(index + match.length), map)}
            </>
          );
        }
        return (
          <>
            {input.slice(0, index + match.length)}
            {RegJSXMap(input.slice(index + match.length), map)}
          </>
        );
      }
    ],
    [/[\w\W]*/, ({ input }) => input && <span>{input}</span>]
  ]
);

export default [
  (lang: string) => languages.includes(lang.toLowerCase()),
  map
] as languageRegMapItem;
