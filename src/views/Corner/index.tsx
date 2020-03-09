import * as React from 'react';
import * as style from './style.scss';
import { GithubOutlined } from '@ant-design/icons';

export default React.memo(function Corner() {
  return (
    <div className={style.fixContainer}>
      <a
        className={style.iconContainer}
        title="star me on github!"
        href="//github.com/wu-yu-xuan/blog.mscorlib.top"
      >
        <GithubOutlined className={style.icon} />
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
