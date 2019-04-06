import * as React from 'react';
import * as CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';

interface ICodeRender {
  className: string;
  autoFocus: boolean;
  options: CodeMirror.EditorConfiguration;
  value: string;
  onChange: (value: string) => void;
}

export default function CodeRender({ className, autoFocus, options, value, onChange }: ICodeRender) {
  const textareaRef = React.useRef<HTMLTextAreaElement>();
  const codemirrorRef = React.useRef<CodeMirror.EditorFromTextArea>();
  React.useEffect(() => {
    codemirrorRef.current = CodeMirror.fromTextArea(textareaRef.current, options);
    codemirrorRef.current.setValue(value);
    codemirrorRef.current.on('change', (e) => onChange(e.getValue()));
    return () => {
      codemirrorRef.current.toTextArea();
    }
  }, [textareaRef.current]);
  React.useEffect(() => {
    // prevent cursor or focus lost
    if (codemirrorRef.current && codemirrorRef.current.getValue() !== value) {
      codemirrorRef.current.setValue(value);
    }
  }, [value]);
  return (
    <div className={className}>
      <textarea
        ref={textareaRef}
        autoComplete="off"
        autoCapitalize="off"
        autoCorrect="off"
        autoFocus={autoFocus}
      />
    </div>
  )
}