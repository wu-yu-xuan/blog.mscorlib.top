import * as React from 'react';
import * as style from './style.scss';
import BlogListItem from './BlogListItem';
import { Radio } from 'antd';
import { RadioChangeEvent } from 'antd/lib/radio';

const { Group, Button } = Radio;

enum Sort {
  birthTime,
  modifyTime
}

export interface BlogSummary {
  title: string;
  path: string;
  modifyTime: number;
  birthTime: number;
}

interface BlogListState {
  blogSummarys: BlogSummary[];
  sortBy: Sort
}

export default class BlogList extends React.Component<{}, BlogListState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      blogSummarys: [],
      sortBy: Sort.modifyTime
    };
  }
  private handleRadioChange = (e: RadioChangeEvent) => this.setState({ sortBy: e.target.value })
  public async componentDidMount() {
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
    const { blogSummarys, sortBy } = this.state;
    return (
      <>
        <div>
          <span className={style.radioText}>sort by:</span>
          <Group value={sortBy} onChange={this.handleRadioChange}>
            <Button value={Sort.modifyTime}>修改时间</Button>
            <Button value={Sort.birthTime}>发布时间</Button>
          </Group>
        </div>
        <div className={style.blogListContainer} >
          {
            blogSummarys
              .sort((a, b) => sortBy === Sort.modifyTime ? b.modifyTime - a.modifyTime : b.birthTime - a.birthTime)
              .map((blogSummary, key) => <BlogListItem {...blogSummary} key={key} />)
          }
        </div>
      </>
    )
  }
}