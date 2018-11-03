import * as React from 'react';
import * as style from './style.scss';

export default class BlockWrapper extends React.Component {
  public render() {
    return (
      <div className={style.blockWrapper}>
        {this.props.children}
      </div>
    )
  }
}