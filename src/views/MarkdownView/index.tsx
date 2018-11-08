import * as React from 'react';
import * as style from './style.scss';
import MarkdownRender from '../../components/MarkdownRender';
import { EditorState, Editor } from 'draft-js';

export default class MarkdownView extends React.PureComponent<{}, { editorState: EditorState }> {
  constructor(props: {}) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty()
    };
  }
  private handleChange = (editorState: EditorState) => {
    this.setState({ editorState });
  }
  public componentDidMount() {
    document.title = `wyx's markdown playground`;
  }
  public render() {
    return (
      <section className={style.flex}>
        <section className={style.frame} >
          <Editor editorState={this.state.editorState} onChange={this.handleChange} stripPastedStyles={true} />
        </section>
        <section className={style.frame}>
          <MarkdownRender source={this.state.editorState.getCurrentContent().getPlainText()} />
        </section>
      </section>
    )
  }
}