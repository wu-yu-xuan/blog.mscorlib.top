import * as React from 'react';
import { Checkbox } from 'antd';
import * as style from './style.scss';

export interface ListItemRenderProps {
  checked?: boolean;
  task: boolean;
  type: string;
  children: React.ReactNode;
}

export default React.memo(function ListItemRender({ checked, task, children }: ListItemRenderProps) {
  return (
    <li>
      {task ? <Checkbox checked={checked} className={style.checkbox}>{children}</Checkbox> : children}
    </li>
  )
});