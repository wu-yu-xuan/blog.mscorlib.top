import * as React from 'react';
import * as style from './style.scss';

export default React.memo(function HrRender() {
  return <hr className={style.hr} />
})