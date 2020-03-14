import React, { useState, useEffect } from 'react';
import shouldHide from '../shouldHide';
import style from './style.scss';
import { Tag as antdTag } from 'antd';
import { Blog } from '../interface';

const { CheckableTag } = antdTag;

export const ALL_TEXT = '全部';

interface TypesProps {
  /**
   * 已被筛选过的
   */
  blogSummarys: Blog[];
  onChange: (selections: string[]) => void;
  /**
   * 仅用于高亮
   */
  searchWords: string[];
}

interface Tag {
  name: string;
  length: number;
  children: Tag[];
}

function getTags(blogSummarys: Blog[], index = 0): Tag[] {
  const results: Tag[] = [];
  let tmpBlogs = [...blogSummarys];
  while (tmpBlogs.length) {
    const type = tmpBlogs.find(blog => blog.types?.[index])?.types?.[index];
    if (!type) {
      // 没有子类型了
      break;
    }
    const typedBlogs = tmpBlogs.filter(blog => blog.types?.[index] === type);
    results.push({
      name: type,
      length: typedBlogs.length,
      children: getTags(typedBlogs, index + 1)
    });
    // 剔除已经计算过的 Tag, 继续循环
    tmpBlogs = tmpBlogs.filter(blog => blog.types?.[index] !== type);
  }
  if (results.length) {
    /**
     * 按照
     * 1. 隐藏的在后
     * 2. 数量多的在前
     * 3. '全部'位于第一位
     * 的原则排序
     */
    return [
      { name: ALL_TEXT, length: blogSummarys.length, children: [] },
      ...results
        .filter(tag => !shouldHide(tag.name))
        .sort((a, b) => b.length - a.length),
      ...results
        .filter(tag => shouldHide(tag.name))
        .sort((a, b) => b.length - a.length)
    ];
  }
  return results;
}

function getSelectedTag(
  tags: Tag[],
  selections: string[],
  index = 0
): string[][] {
  if (tags.length === 0 || index >= selections.length) {
    return [tags.map(tag => tag.name)];
  }
  return [
    tags.map(tag => tag.name),
    ...getSelectedTag(
      tags.find(tag => tag.name === selections[index])?.children ?? [],
      selections,
      index + 1
    )
  ];
}

export default function Types({
  blogSummarys,
  onChange,
  searchWords
}: TypesProps) {
  const [selections, setSelections] = useState<string[]>([ALL_TEXT]);
  const [tags, setTags] = useState(() =>
    getSelectedTag(getTags(blogSummarys), selections)
  );
  useEffect(() => {
    /**
     * 当搜索字符改变时, 将 selections 置为初始值
     * 我考虑过了其他方案, 这个方案最大的优势是 bug-free
     */
    setSelections([ALL_TEXT]);
  }, [JSON.stringify(searchWords)]);
  useEffect(() => {
    onChange(selections);
  }, [JSON.stringify(selections)]);
  useEffect(() => {
    setTags(getSelectedTag(getTags(blogSummarys), selections));
  }, [blogSummarys, JSON.stringify(selections)]);
  const onSelect = (row: number, column: number) => {
    const selected = tags[row][column];
    setSelections([
      ...selections.slice(0, row),
      ...(selected === ALL_TEXT ? [ALL_TEXT] : [selected, ALL_TEXT])
    ]);
  };
  return (
    <div className={style.outerContainer}>
      {tags.map((arr, row) => (
        <div className={style.tagContainer} key={row}>
          {arr.map((v, column) => (
            <CheckableTag
              checked={v === selections[row]}
              key={column}
              onChange={() => onSelect(row, column)}
              className={
                shouldHide(v) && v !== selections[row]
                  ? style.hidden
                  : style.tag
              }
            >
              {v}
            </CheckableTag>
          ))}
        </div>
      ))}
    </div>
  );
}
