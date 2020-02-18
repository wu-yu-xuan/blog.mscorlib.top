import * as React from 'react';
import * as style from './style.scss';
import { Icon } from 'antd';

export default React.memo(function Corner() {
  return (
    <div className={style.fixContainer}>
      <a
        className={style.iconContainer}
        title="star me on github!"
        href="//github.com/wu-yu-xuan/blog.mscorlib.top"
      >
        <Icon type="github" className={style.icon} />
      </a>
      <div className={style.triangle} style={useSupressMountTransition()} />
    </div>
  );
});

/**
 * 抑制挂载时由 default 样式变为当前样式的动画
 */
function useSupressMountTransition() {
  const [transition, setTransition] = React.useState<React.CSSProperties>({
    transition: 'none'
  });
  React.useEffect(() => {
    setTimeout(() => setTransition({}), 50);
  }, []);
  return transition;
}
