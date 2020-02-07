import * as React from 'react';
import RegJSXMap, { IRegJSXMap } from '../../RegJSXMap';
import * as style from '../style.scss';
import { languageRegMapItem } from './interface';

const languages = ['shell', 'sh', 'zsh'];

const map: IRegJSXMap = new Map<RegExp, (reg: RegExpMatchArray) => JSX.Element>(
  [
    [
      /^(\$|#|>)(\s.*)?$/m,
      dollar => (
          <>
            {RegJSXMap(dollar.input.slice(0, dollar.index), map)}
            <span className={style.keyword}>{dollar[1]}</span>
            {dollar[2] && <span>{dollar[2]}</span>}
            {RegJSXMap(
              dollar.input.slice(dollar.index + dollar[0].length),
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
    [/[\w\W]*/, ({ input }) => input && <span>{input}</span>]
  ]
);

export default [
  (lang: string) => languages.includes(lang.toLowerCase()),
  map
] as languageRegMapItem;
