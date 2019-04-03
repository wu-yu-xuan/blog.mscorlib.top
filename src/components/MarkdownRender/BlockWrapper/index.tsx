import * as React from 'react';
import * as style from './style.scss';

interface IBlockWrapper {
  children: React.ReactNode;
}

export default React.memo(function BlockWrapper({ children }: IBlockWrapper) {
  return (
    <div className={style.blockWrapper}>
      {children}
    </div>
  )
})