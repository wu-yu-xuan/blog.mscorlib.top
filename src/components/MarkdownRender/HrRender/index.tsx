import * as React from 'react';
import { Tokens } from 'marked';
import * as style from './style.scss';

export default class HrRender extends React.PureComponent<Tokens.Hr>{
  public render() {
    return <hr className={style.hr} />
  }
}