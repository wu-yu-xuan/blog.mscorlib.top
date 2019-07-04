import * as React from 'react';
import * as style from './style.scss';
import BlogItem, { IBlogItem } from './BlogItem';
import { Radio } from 'antd';
import { RadioChangeEvent } from 'antd/lib/radio';
import Types, { ALL_TEXT } from './Types';
import shouldHide from './shouldHide';

const { Group, Button } = Radio;

enum Sort {
  birthTime,
  modifyTime
}

export default function BlogList() {
  const blogSummarys = useBlogSummarys();
  const [sortBy, handleRadioChange] = useSortBy();
  const [selections, setSelections] = React.useState<string[]>(['']);

  return (
    <>
      <div>
        <span className={style.radioText}>sort by:</span>
        <Group value={sortBy} onChange={handleRadioChange}>
          <Button value={Sort.modifyTime}>修改时间</Button>
          <Button value={Sort.birthTime}>发布时间</Button>
        </Group>
      </div>
      <Types types={blogSummarys.map(v => v.types)} onChange={setSelections} />
      <div className={style.blogListContainer}>
        {selections
          .reduce<IBlogItem[]>(
            (prev, cur, index) =>
              prev.filter(({ types }) => {
                // 当前选中项为‘全部’
                if (cur === ALL_TEXT) {
                  // 只要当前项不应该隐藏则全部显示
                  return types[index] ? !shouldHide(types[index]) : true;
                } else {
                  // 否则显示与当前选中项相同的
                  return types[index] && types[index] === cur;
                }
              }),
            blogSummarys
          )
          .sort((a, b) =>
            sortBy === Sort.modifyTime
              ? b.modifyTime - a.modifyTime
              : b.birthTime - a.birthTime
          )
          .map(blogSummary => (
            <BlogItem {...blogSummary} key={blogSummary.hash} />
          ))}
      </div>
    </>
  );
}

function useBlogSummarys() {
  const [blogSummarys, setBlogSummarys] = React.useState<IBlogItem[]>([]);
  React.useEffect(() => {
    (async () => {
      const response = await fetch('/markdown/list.json');
      if (!response.ok) {
        setBlogSummarys([
          {
            title: 'unable to connect to the server',
            birthTime: 0,
            modifyTime: 0,
            hash: '',
            types: []
          }
        ]);
        return;
      }
      setBlogSummarys(await response.json());
    })();
  }, []);
  return blogSummarys;
}

function useSortBy(): [Sort, (e: RadioChangeEvent) => void] {
  const [sortBy, setSortBy] = React.useState<Sort>(Sort.modifyTime);
  const handleRadioChange = React.useCallback(
    (e: RadioChangeEvent) => setSortBy(e.target.value),
    []
  );
  return [sortBy, handleRadioChange];
}
