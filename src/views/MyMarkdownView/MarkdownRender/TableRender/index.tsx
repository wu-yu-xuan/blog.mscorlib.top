import * as React from 'react';
import { Tokens } from 'marked';
import * as style from './style.scss';
import BlockWrapper from '../BlockWrapper';

export default class TableRender extends React.Component<Tokens.Table>{
  public render() {
    console.log(this.props);
    const { header, align, cells } = this.props;
    return (
      <BlockWrapper>
        <table className={style.table}>
          <thead>
            <tr>
              {header.map((head, key) => <th key={key} className={style[align[key] || 'left']}>{head}</th>)}
            </tr>
          </thead>
          <tbody>
            {cells.map((row, rowKey) => (
              <tr key={rowKey}>
                {row.map((col, colKey) => <td key={colKey} className={style[align[colKey] || 'left']}>{col}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </BlockWrapper>
    )
  }
}