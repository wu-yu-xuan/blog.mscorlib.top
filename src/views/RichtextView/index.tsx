import * as React from 'react';
import { Editor, EditorState, RichUtils, DraftHandleValue } from 'draft-js';
import * as style from './style.scss';
import 'draft-js/dist/Draft.css';

export default class RichtextView extends React.PureComponent<{}, { editorState: EditorState }>{
  constructor(props: {}) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty()
    }
  }
  private handleChange = (editorState: EditorState) => {
    this.setState({ editorState });
  }
  private handleKeyCommand = (command: string, editorState: EditorState): DraftHandleValue => {
    const newEditorState = RichUtils.handleKeyCommand(editorState, command);
    if (newEditorState && newEditorState !== editorState) {
      this.setState({
        editorState: newEditorState
      });
      return "handled";
    }
    return 'not-handled';
  }
  public render() {
    return (
      <section className={style.editor}>
        <Editor editorState={this.state.editorState} onChange={this.handleChange} handleKeyCommand={this.handleKeyCommand} />
      </section>
    )
  }
}