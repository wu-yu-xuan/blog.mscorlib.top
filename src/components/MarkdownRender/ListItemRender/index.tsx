import * as React from 'react';
import { Checkbox } from 'antd';
import * as style from './style.scss';

export interface ListItemRenderProps {
  checked?: boolean;
  task: boolean;
  type: string;
  children: React.ReactNode;
}

export default React.memo(function ListItemRender({
  checked,
  task,
  children
}: ListItemRenderProps) {
  const isArray = Array.isArray(children);
  return (
    <li>
      {task ? (
        <>
          {/** 不这样判断的话, li 的小圆点会沉底, 很丑 */}
          <Checkbox checked={checked} className={style.checkbox}>
            {isArray
              ? (children as React.ReactNodeArray).slice(0, 1)
              : children}
          </Checkbox>
          {isArray && (children as React.ReactNodeArray).slice(1)}
        </>
      ) : (
        children
      )}
    </li>
  );
});
