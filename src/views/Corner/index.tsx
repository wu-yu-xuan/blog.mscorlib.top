import * as React from 'react';
import * as style from './style.scss';
import { Icon } from 'antd';

export default React.memo(function Corner() {
  return (
    <div className={style.fixContainer}>
      <a className={style.iconContainer} title="star me on github!" href="//github.com/wu-yu-xuan/wu-yu-xuan.github.io">
        <Icon type="github" className={style.icon} />
      </a>
      <div className={style.mask}>
        <div className={style.triangle} />
      </div>
    </div>
  )
})