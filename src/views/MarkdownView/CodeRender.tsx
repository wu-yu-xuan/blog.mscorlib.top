import * as React from 'react';
import * as CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';

interface ICodeRender {
  className: string;
  options: CodeMirror.EditorConfiguration;
  value?: string;
  defaultValue?: string;
  onChange: (value: string) => void;
}

export default function CodeRender({
  className,
  options,
  defaultValue = '',
  onChange
}: ICodeRender) {
  const textareaRef = React.useRef<HTMLTextAreaElement>();
  const codemirrorRef = React.useRef<CodeMirror.EditorFromTextArea>();
  React.useEffect(() => {
    codemirrorRef.current = CodeMirror.fromTextArea(textareaRef.current, {
      value: defaultValue,
      ...options
    });
    codemirrorRef.current.setValue(defaultValue);
    codemirrorRef.current.on('change', e => {
      onChange(e.getValue());
    });
    return codemirrorRef.current.toTextArea;
  }, []);
  return (
    <div className={className}>
      <textarea
        ref={textareaRef}
        autoComplete="off"
        autoCapitalize="off"
        autoCorrect="off"
        autoFocus={!!options.autofocus}
      />
    </div>
  );
}
