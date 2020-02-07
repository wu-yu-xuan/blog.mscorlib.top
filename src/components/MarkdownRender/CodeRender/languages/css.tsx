import * as React from 'react';
import RegJSXMap, { IRegJSXMap } from '../../RegJSXMap';
import * as style from '../style.scss';
import { languageRegMapItem } from './interface';

const languages = ['css', 'less', 'scss', 'sass'];

const map: IRegJSXMap = new Map<RegExp, (reg: RegExpMatchArray) => JSX.Element>(
  [
    [
      /^(\s*)(.+?)\s*:\s*(.+?);$/m,
      rowMatch => (
          <>
            {RegJSXMap(rowMatch.input.slice(0, rowMatch.index), map)}
            {rowMatch[1]}
            <span className={style.string}>{rowMatch[2]}</span>
            <span>: </span>
            <span className={style.keyword}>{rowMatch[3]}</span>;
            {RegJSXMap(
              rowMatch.input.slice(rowMatch.index + rowMatch[0].length),
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
