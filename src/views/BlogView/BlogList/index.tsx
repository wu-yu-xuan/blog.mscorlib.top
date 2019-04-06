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

export default function BlogList() {
  const blogSummarys = useBlogSummarys();
  const [sortBy, handleRadioChange] = useSortBy();

  return (
    <>
      <div>
        <span className={style.radioText}>sort by:</span>
        <Group value={sortBy} onChange={handleRadioChange}>
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

function useBlogSummarys() {
  const [blogSummarys, setBlogSummarys] = React.useState<BlogSummary[]>([]);
  React.useEffect(() => {
    (async () => {
      const response = await fetch('/markdown/list.json');
      if (!response.ok) {
        setBlogSummarys([{
          title: 'unable to connect to the server',
          path: '/blog/',
          birthTime: 0,
          modifyTime: 0
        }]);
        return;
      }
      setBlogSummarys(await response.json());
    })();
  }, []);
  return blogSummarys;
}

function useSortBy(): [Sort, (e: RadioChangeEvent) => void] {
  const [sortBy, setSortBy] = React.useState<Sort>(Sort.modifyTime);
  const handleRadioChange = React.useCallback((e: RadioChangeEvent) => setSortBy(e.target.value), []);
  return [sortBy, handleRadioChange];
}