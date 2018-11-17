import * as React from 'react';
import * as style from './style.scss';
import MarkdownRender from '../../components/MarkdownRender';
import { EditorState, Editor } from 'draft-js';
import * as classNames from 'classnames';

export default class MarkdownView extends React.PureComponent<{}, { editorState: EditorState }> {
  private editorRef = React.createRef<Editor>();
  constructor(props: {}) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty()
    };
  }
  private handleChange = (editorState: EditorState) => {
    this.setState({ editorState });
  }
  private handleClick = (e: React.MouseEvent) => this.editorRef.current.focus()
  public render() {
    return (
      <section className={style.flex}>
        <section className={classNames(style.frame, style.text)} onClick={this.handleClick} >
          <Editor editorState={this.state.editorState} onChange={this.handleChange} stripPastedStyles={true} ref={this.editorRef} />
        </section>
        <section className={style.frame}>
          <MarkdownRender source={this.state.editorState.getCurrentContent().getPlainText()} />
        </section>
      </section>
    )
  }
}