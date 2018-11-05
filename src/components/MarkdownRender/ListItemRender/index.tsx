import * as React from 'react';
import { Checkbox } from 'antd';
import * as style from './style.scss';

export interface ListItemRenderProps {
  checked?: boolean;
  task: boolean;
  type: string;
}

export default class ListItemRender extends React.PureComponent<ListItemRenderProps>{
  public render() {
    const { checked, task } = this.props;
    return (
      <li>
        {task ? <Checkbox checked={checked} className={style.checkbox}>{this.props.children}</Checkbox> : this.props.children}
      </li>
    )
  }
}