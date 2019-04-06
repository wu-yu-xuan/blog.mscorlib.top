import * as React from 'react';
import * as style from './style.scss';
import MarkdownRender from '../../components/MarkdownRender';
import * as classNames from 'classnames';
import 'codemirror/mode/markdown/markdown';
import CodeRender from './CodeRender';

export default React.memo(function MarkdownView() {
  const [code, setCode] = React.useState('');

  // prevent console warning
  const setCodeMirror = React.useCallback((newCodeMirror) => setCode(newCodeMirror), []);

  return (
    <section className={style.flex}>
      <CodeRender
        className={classNames(style.frame, style.text)}
        value={code}
        onChange={setCodeMirror}
        options={{ mode: 'markdown', lineWrapping: true, autofocus: true }}
      />
      <section className={style.frame}>
        <MarkdownRender source={code} />
      </section>
    </section>
  )
})