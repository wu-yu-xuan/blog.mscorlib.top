import React from 'react';
import style from './style.scss';

export default React.memo(function HrRender() {
  return <hr className={style.hr} />
})