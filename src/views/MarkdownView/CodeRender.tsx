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

/**
 * 为了解决输入过快而无限rerender的bug
 */
const MAX_RENDER_COUNT = 5;

/**
 * @param value value可以强制更新此组件, 但可能引发无限rerender, 加入最大更新次数可以解决这个问题, prefer defaultValue
 */
export default function CodeRender({ className, options, value = '', defaultValue = '', onChange }: ICodeRender) {
  const renderCountRef = React.useRef(0);
  const textareaRef = React.useRef<HTMLTextAreaElement>();
  const codemirrorRef = React.useRef<CodeMirror.EditorFromTextArea>();
  React.useEffect(() => {
    codemirrorRef.current = CodeMirror.fromTextArea(textareaRef.current, options);
    codemirrorRef.current.setValue(defaultValue);
    codemirrorRef.current.on('change', (e) => onChange(e.getValue()));
    return () => {
      codemirrorRef.current.toTextArea();
    }
  }, []);
  React.useEffect(() => {
    // prevent cursor or focus lost
    if (codemirrorRef.current && renderCountRef.current < MAX_RENDER_COUNT && codemirrorRef.current.getValue() !== value) {
      codemirrorRef.current.setValue(value);
      renderCountRef.current++;
    } else {
      renderCountRef.current = 0;
    }
  }, [value]);
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
  )
}