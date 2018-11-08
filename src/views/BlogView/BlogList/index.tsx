import * as React from 'react';
import * as style from './style.scss';
import BlogListItem from './BlogListItem';

export interface BlogSummary {
  title: string;
  path: string;
  modifyTime: number;
  birthTime: number;
}

interface BlogListState {
  blogSummarys: BlogSummary[];
}

export default class BlogList extends React.Component<{}, BlogListState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      blogSummarys: []
    };
  }
  public async componentDidMount() {
    document.title = `wyx's blog`;
    const response = await fetch('/markdown/list.json');
    if (!response.ok) {
      this.setState({
        blogSummarys: [{
          title: 'unable to connect to the server',
          path: '/blog/',
          birthTime: 0,
          modifyTime: 0
        }]
      });
      return;
    }
    const blogSummarys = await response.json();
    this.setState({ blogSummarys });
  }
  public render() {
    return (
      <div className={style.blogListContainer} >
        {this.state.blogSummarys.sort((a, b) => b.modifyTime - a.modifyTime).map((blogSummary, key) => <BlogListItem {...blogSummary} key={key} />)}
      </div>
    )
  }
}