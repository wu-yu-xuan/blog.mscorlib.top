import React from 'react';
import style from './style.scss';

export default React.memo(function BlockWrapper({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className={style.blockWrapper}>
      {children}
    </div>
  )
})