/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/camelcase */
import * as React from 'react';
import { lexer, Tokens } from 'marked';
import * as style from './style.scss';
import HeadingRender from './HeadingRender';
import HrRender from './HrRender';
import ParagraphRender from './ParagraphRender';
import TextRender from './TextRender';
import HtmlRender from './HtmlRender';
import CodeRender from './CodeRender';
import ListItemRender, { ListItemRenderProps } from './ListItemRender';
import ListRender, { ListRenderProps } from './ListRender';
import BlockquoteRender from './BlockquoteRender';
import TableRender from './TableRender';

interface MarkdownRenders {
  heading?: React.ComponentType<Tokens.Heading>;
  hr?: React.ComponentType;
  paragraph?: React.ComponentType<Tokens.Paragraph>;
  text?: React.ComponentType<Tokens.Text>;
  html?: React.ComponentType<Tokens.HTML>;
  code?: React.ComponentType<Tokens.Code>;
  list_item?: React.ComponentType<ListItemRenderProps>;
  list?: React.ComponentType<ListRenderProps>;
  blockquote?: React.ComponentType<Tokens.BlockquoteStart>;
  table?: React.ComponentType<Tokens.Table>;
}

interface MarkdownRenderProps extends MarkdownRenders {
  source: string;
  onDidUpdate?(): void;
}

export default function MarkdownRender({
  source = '',
  heading = HeadingRender,
  hr = HrRender,
  paragraph = ParagraphRender,
  text = TextRender,
  html = HtmlRender,
  code = CodeRender,
  list_item = ListItemRender,
  list = ListRender,
  blockquote = BlockquoteRender,
  table = TableRender,
  onDidUpdate
}: MarkdownRenderProps) {
  const [result, setResult] = React.useState<React.ReactNode>([]);
  React.useEffect(() => {
    const lexList = lexer(source);
    setResult(renderComponents(lexList, {
      heading,
      hr,
      paragraph,
      text,
      html,
      code,
      list_item,
      list,
      blockquote,
      table
    }));
  }, [source]);
  React.useEffect(() => {
    if ((result as React.ReactNode[]).length && onDidUpdate) {
      onDidUpdate();
    }
  }, [result]);
  return <div className={style.markdownContainer}>{result}</div>
}

function renderComponents(lexList: marked.TokensList | marked.Token[], props: MarkdownRenders): React.ReactNode {
  let depth = 0;
  return lexList.map((token, key) => {
    if (token.type.endsWith('_end')) {
      depth--;
    }
    if (token.type.endsWith('_start')) {
      depth++;
    }
    if (depth === 1 && token.type.endsWith('_start')) {
      const startName = token.type;
      const endName = token.type.replace('start', 'end');
      let deep = 1;
      const endIndex = key + 1 + lexList.slice(key + 1).findIndex(val => {
        if (val.type === startName) {
          deep++;
        }
        if (val.type === endName) {
          deep--;
        }
        return !deep;
      });
      const Component: React.ComponentType = props[token.type.replace('_start', '')];
      return Component && (
        <Component {...token} key={key}>
          {renderComponents(lexList.slice(key + 1, endIndex), props)}
        </Component>
      )
    }
    if (depth) {
      return null;
    }
    const SimpleComponent: React.ComponentType = props[token.type];
    return SimpleComponent && <SimpleComponent {...token} key={key} />;
  });
}