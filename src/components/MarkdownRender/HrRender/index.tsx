import * as React from 'react';
import * as style from './style.scss';

export default class HrRender extends React.PureComponent{
  public render() {
    return <hr className={style.hr} />
  }
}