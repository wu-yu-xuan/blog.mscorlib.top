import React, { useDeferredValue } from 'react';
import style from './style.scss';
import MarkdownRender from '../../components/MarkdownRender';
import classNames from 'classnames';
import 'codemirror/mode/markdown/markdown';
import CodeRender from './CodeRender';

export default React.memo(function MarkdownView() {
  const [code, setCode] = useLocalStorage('markdown', '# type markdown here');
  const markdownSource = useDeferredValue(code);

  return (
    <section className={style.flex}>
      <CodeRender
        className={classNames(style.frame, style.text)}
        defaultValue={code}
        onChange={setCode}
        options={{ mode: 'markdown', lineWrapping: true, autofocus: true }}
      />
      <section className={style.frame}>
        <MarkdownRender source={markdownSource} />
      </section>
    </section>
  );
});

function useLocalStorage(
  key: string,
  defaultValue = ''
): [string, (value: string) => void] {
  const [localState, setLocalState] = React.useState(
    () => localStorage.getItem(key) || defaultValue
  );
  const updateLocalState = React.useCallback((value: string) => {
    setLocalState(value);
    localStorage.setItem(key, value);
  }, []);
  React.useEffect(() => {
    function syncStorage(e: StorageEvent) {
      if (e.key === key) {
        // 在同一个页面内发生的改变不会起作用——在相同域名下的其他页面（如一个新标签或 iframe）发生的改变才会起作用
        // 所以,这里并不会递归
        setLocalState(e.newValue);
      }
    }
    window.addEventListener('storage', syncStorage);
    return () => window.removeEventListener('storage', syncStorage);
  }, []);
  return [localState, updateLocalState];
}
