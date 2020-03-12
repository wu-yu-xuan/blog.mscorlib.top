import React from 'react';
import RegJSXMap, { IRegJSXMap } from '../../RegJSXMap';
import style from '../style.scss';
import { languageRegMapItem } from './interface';

const map: IRegJSXMap = new Map<RegExp, (reg: RegExpMatchArray) => JSX.Element>(
  [
    [
      /(\/\*[\w\W]*?\*\/)/,
      mutilCommentMatch => (
          <>
            {RegJSXMap(
              mutilCommentMatch.input.slice(0, mutilCommentMatch.index),
              map
            )}
            <span className={style.comment}>{mutilCommentMatch[0]}</span>
            {RegJSXMap(
              mutilCommentMatch.input.slice(
                mutilCommentMatch.index + mutilCommentMatch[0].length
              ),
              map
            )}
          </>
        )
    ],
    [
      /(\/\/.*)$/m,
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
    [/[\w\W]*/, ({ input }) => input && <span>{input}</span>]
  ]
);

export default [() => true, map] as languageRegMapItem;
