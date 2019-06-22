import * as React from 'react';
import * as style from './style.scss';
import { Tag } from 'antd';
import * as classNames from 'classnames';
import shouldHide from '../shouldHide';

const { CheckableTag } = Tag;

interface ITypes {
  types: string[][];
  onChange(types: string[]): void;
}

export default React.memo(function Types({ types, onChange }: ITypes) {
  const [tags, selections, onSelect] = useTypes({ types, onChange });

  return (
    <div className={style.outerContainer}>
      {tags.map((arr, row) => (
        <div className={style.tagContainer} key={row}>
          {arr.length > 1 &&
            arr.map((v, column) => (
              <CheckableTag
                checked={v === selections[row]}
                key={column}
                onChange={() => onSelect(row, column)}
                className={classNames({
                  [style.hidden]: shouldHide(v) && v !== selections[row]
                })}
              >
                {v || '全部'}
              </CheckableTag>
            ))}
        </div>
      ))}
    </div>
  );
});

function useTypes({
  types,
  onChange
}: ITypes): [string[][], string[], (row: number, column: number) => void] {
  const [selections, setSelections] = React.useState<string[]>(['']);
  const [tags, setTags] = React.useState<string[][]>(() =>
    getTags(types, selections)
  );
  const onSelect = (row: number, column: number) => {
    const newSelections = [...selections];
    newSelections[row] = tags[row][column];
    newSelections.splice(row + 1);
    if (newSelections[row] !== '') {
      newSelections.push('');
    }
    setSelections(newSelections);
    setTags(getTags(types, newSelections));
  };
  React.useEffect(() => {
    onChange(selections);
  }, [selections]);
  React.useEffect(() => {
    const newSelections = [''];
    setSelections(newSelections);
    setTags(getTags(types, newSelections));
  }, [types.length]);
  return [tags, selections, onSelect];
}

function getTags(types: string[][], selections: string[]) {
  return selections.reduce<string[][]>((prev, cur, index) => {
    const tmpArr = Array.from(
      new Set([
        ...types
          .filter(
            v =>
              index === 0 ||
              (v[index - 1] &&
                selections[index - 1] &&
                v[index - 1] === selections[index - 1])
          )
          .map(v => v[index] || ''),
        ''
      ])
    );
    prev.push([
      ...tmpArr.filter(v => !shouldHide(v)).sort(),
      ...tmpArr.filter(v => shouldHide(v)).sort()
    ]);
    return prev;
  }, []);
}
