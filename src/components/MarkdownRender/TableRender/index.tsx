import * as React from 'react';
import { Tokens } from 'marked';
import * as style from './style.scss';
import BlockWrapper from '../BlockWrapper';
import * as classNames from 'classnames';
import TextRender from '../TextRender';

export default function TableRender({ header, align, cells }: Tokens.Table) {
  return (
    <BlockWrapper>
      <table className={style.table}>
        <thead>
          <tr>
            {header.map((head, key) => <th key={key} className={classNames(style.th, style.td, style[align[key] || 'left'])}><TextRender text={head} /></th>)}
          </tr>
        </thead>
        <tbody>
          {cells.map((row, rowKey) => (
            <tr key={rowKey} className={style.tr}>
              {row.map((col, colKey) => <td key={colKey} className={classNames(style.td, style[align[colKey] || 'left'])}><TextRender text={col} /></td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </BlockWrapper>
  )
}