import React, {
  useState,
  useCallback,
  useDeferredValue,
  useMemo,
  useEffect
} from 'react';
import style from './style.scss';
import BlogItem from '../BlogItem';
import { Radio, Input, Empty } from 'antd';
import { RadioChangeEvent } from 'antd/lib/radio';
import Types, { ALL_TEXT } from '../Types';
import shouldHide from '../shouldHide';
import usePromise from 'src/usePromise';
import getRecommend from './getRecommend';
import { Blog, BlogSearchResult } from '../interface';

const { Group, Button } = Radio;

enum Sort {
  birthTime,
  modifyTime
}

export default function BlogList() {
  const blogSummarys = useBlogSummarys();
  const [sortBy, handleRadioChange] = useSortBy();
  const [selections, setSelections] = React.useState<string[]>(['']);
  const [rawSearchWords, setSearchWords] = useState('');
  const recommend = getRecommend(blogSummarys);
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setSearchWords(e.target.value),
    []
  );
  const deferSearchWords = useDeferredValue(rawSearchWords);
  const searchWords = useMemo(
    () =>
      deferSearchWords
        .split(' ')
        .filter(v => v)
        .map(v => v.toLowerCase()),
    [deferSearchWords]
  );
  const filterBlogSummarys = useMemo<BlogSearchResult[]>(() => {
    if (!searchWords.length) {
      // 没有搜索关键词时则无需搜索
      return blogSummarys.map(blog => ({ ...blog, matchLength: 0 }));
    }
    return blogSummarys
      .map(blog => {
        // 计算关键词匹配数
        const matchLength = [blog.title, ...blog.types].reduce(
          (prev, cur, index) => {
            const lowerCase = cur.toLowerCase();
            return (
              prev +
              searchWords.reduce(
                (searchResult, searchWord) =>
                  searchResult +
                  // 标题中直接出现关键字, 具有更高的优先级, 标题的 index 为 0
                  Number(lowerCase.includes(searchWord)) *
                    (index === 0 ? 2 : 1),
                0
              )
            );
          },
          0
        );
        return { ...blog, matchLength };
      })
      .filter(({ matchLength }) => matchLength);
  }, [blogSummarys, JSON.stringify(searchWords)]);


  useEffect(() => {

    const offsets = parseInt(sessionStorage.getItem("offsets")) ;

    if(offsets){
      window.scrollTo(0, offsets)
    }


    let flag = false;
    const scrollHnadler = () => {
      if (!flag) {
        // 使用requestAnimationFrame进行节流
        requestAnimationFrame(() => {
          sessionStorage.setItem("offsets", window.scrollY.toString())

          flag = false;
        });
      }

      flag = true;
    };

    window.addEventListener('scroll', scrollHnadler, false);

    return () => {
      window.removeEventListener('scroll', scrollHnadler, false);
      flag = null;
    };
  }, [selections]);

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
              .reduce<BlogSearchResult[]>(
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
              .sort((a, b) => {
                const diff = b.matchLength - a.matchLength;
                if (diff) {
                  // 优先按照关键词匹配数排序
                  return diff;
                }
                // 匹配数一致则按照时间排序
                return sortBy === Sort.modifyTime
                  ? b.modifyTime - a.modifyTime
                  : b.birthTime - a.birthTime;
              })
              .map(blogSummary => (
                <BlogItem
                  {...blogSummary}
                  key={blogSummary.hash}
                  searchWords={searchWords}
                />
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

async function getBlogSummarys(): Promise<Blog[]> {
  const response = await fetch('/markdown/list.json');
  if (!response.ok) {
    throw new Error();
  }
  return response.json();
}

function useBlogSummarys() {
  return usePromise(getBlogSummarys);
}

function useSortBy(): [Sort, (e: RadioChangeEvent) => void] {
  const [sortBy, setSortBy] = React.useState<Sort>(Sort.modifyTime);
  const handleRadioChange = React.useCallback(
    (e: RadioChangeEvent) => setSortBy(e.target.value),
    []
  );
  return [sortBy, handleRadioChange];
}
