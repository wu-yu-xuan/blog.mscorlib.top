import * as React from 'react';
import * as style from './style.scss';
import MarkdownRender from '../../components/MarkdownRender';
import { EditorState, Editor } from 'draft-js';
import * as classNames from 'classnames';

export default React.memo(function MarkdownView() {
  const editorRef = React.useRef<Editor>(null);
  const [editorState, setEditorState] = React.useState(EditorState.createEmpty());
  const handleClick = React.useCallback((e: React.MouseEvent) => editorRef.current.focus(), [editorRef.current]);

  return (
    <section className={style.flex}>
      <section className={classNames(style.frame, style.text)} onClick={handleClick} >
        <Editor editorState={editorState} onChange={setEditorState} stripPastedStyles={true} ref={editorRef} />
      </section>
      <section className={style.frame}>
        <MarkdownRender source={editorState.getCurrentContent().getPlainText()} />
      </section>
    </section>
  )
})