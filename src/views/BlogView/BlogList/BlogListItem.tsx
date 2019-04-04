import { BlogSummary } from '.';
import * as React from 'react';
import * as style from './style.scss';
import { Link } from 'react-router-dom';

function formatTime(time: number) {
  const date = new Date(time);
  return [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('-');
}

export default React.memo(function BlogListItem({ title, birthTime, modifyTime }: BlogSummary) {
  return (
    <div className={style.blogListItemContainer}>
      <Link to={`/blog/${title.replace(/ /g, '-')}`} className={style.title} title={title}>
        {title}
      </Link>
      <div className={style.footer}>
        <span className={style.text}>发布于 {formatTime(birthTime)}</span>
        <span className={style.text}>修改于 {formatTime(modifyTime)}</span>
      </div>
    </div>
  )
})