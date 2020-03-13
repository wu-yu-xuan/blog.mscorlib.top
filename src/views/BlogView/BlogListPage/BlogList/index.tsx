import React, {
  useState,
  useCallback,
  useDeferredValue,
  useEffect
} from 'react';
import style from './style.scss';
import BlogItem, { BlogItemProps } from '../BlogItem';
import { Radio, Input, Empty } from 'antd';
import { RadioChangeEvent } from 'antd/lib/radio';
import Types, { ALL_TEXT } from '../Types';
import shouldHide from '../shouldHide';
import useFetch from 'src/useFetch';
import getRecommend from './getRecommend';

const { Group, Button } = Radio;

enum Sort {
  birthTime,
  modifyTime
}

export default function BlogList() {
  const blogSummarys = useBlogSummarys();
  const [filterBlogSummarys, setFilterBlogSumarys] = useState(blogSummarys);
  const [sortBy, handleRadioChange] = useSortBy();
  const [selections, setSelections] = React.useState<string[]>(['']);
  const [rawSearchWords, setSearchWords] = useState('');
  const recommend = getRecommend(blogSummarys);
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setSearchWords(e.target.value),
    []
  );
  const searchWords = useDeferredValue(rawSearchWords)
    .split(' ')
    .filter(v => v)
    .map(v => v.toLowerCase());
  useEffect(() => {
    setFilterBlogSumarys(
      blogSummarys.filter(({ title, types }) =>
        [title, ...types].some(
          value =>
            !searchWords.length ||
            searchWords.some(searchWord =>
              value.toLowerCase().includes(searchWord)
            )
        )
      )
    );
  }, [blogSummarys, searchWords]);

  return (
    <>
      <div className={style.searchContainer}>
        <Input
          type="search"
          value={rawSearchWords}
          onChange={handleSearchChange}
          placeholder={`今日推荐: "${recommend}"`}
          autoFocus={true}
        />
      </div>
      {filterBlogSummarys.length ? (
        <>
          <div>
            <span className={style.radioText}>sort by:</span>
            <Group value={sortBy} onChange={handleRadioChange}>
              <Button value={Sort.modifyTime}>修改时间</Button>
              <Button value={Sort.birthTime}>发布时间</Button>
            </Group>
          </div>
          <Types
            blogSummarys={filterBlogSummarys}
            onChange={setSelections}
            searchWords={searchWords}
          />
          <div className={style.blogListContainer}>
            {selections
              .reduce<BlogItemProps[]>(
                (prev, cur, index) =>
                  prev.filter(({ types }) => {
                    // 当前选中项为‘全部’
                    if (cur === ALL_TEXT) {
                      // 只要当前项不应该隐藏则全部显示
                      return types[index] ? !shouldHide(types[index]) : true;
                    } else {
                      // 否则显示与当前选中项相同的
                      return types?.[index] === cur;
                    }
                  }),
                filterBlogSummarys
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
      ) : (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <>
              404 NOT FOUND
              <br />
              试试 <b>{recommend}</b> ?
            </>
          }
        />
      )}
    </>
  );
}

async function getBlogSummarys(): Promise<BlogItemProps[]> {
  const response = await fetch('/markdown/list.json');
  if (!response.ok) {
    throw new Error();
  }
  return response.json();
}

function useBlogSummarys() {
  return useFetch(getBlogSummarys);
}

function useSortBy(): [Sort, (e: RadioChangeEvent) => void] {
  const [sortBy, setSortBy] = React.useState<Sort>(Sort.modifyTime);
  const handleRadioChange = React.useCallback(
    (e: RadioChangeEvent) => setSortBy(e.target.value),
    []
  );
  return [sortBy, handleRadioChange];
}
