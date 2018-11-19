import { BlogSummary } from '.';
import * as React from 'react';
import * as style from './style.scss';
import { Link } from 'react-router-dom';

export default class BlogListItem extends React.PureComponent<BlogSummary>{
  private formatTime = (time: number) => {
    const date = new Date(time);
    return [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('-');
  }
  public render() {
    const { title, birthTime, modifyTime } = this.props;
    return (
      <div className={style.blogListItemContainer}>
        <Link to={`/blog/${title.replace(/ /g, '-')}`} className={style.title} title={title}>
          {title}
        </Link>
        <div className={style.footer}>
          <span className={style.text}>发布于 {this.formatTime(birthTime)}</span>
          <span className={style.text}>修改于 {this.formatTime(modifyTime)}</span>
        </div>
      </div>
    )
  }
}