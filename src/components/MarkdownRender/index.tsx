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

interface MarkdownRenderProps {
  source: string;
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
  onDidUpdate?(): void;
}

export default class MarkdownRender extends React.PureComponent<MarkdownRenderProps>{
  public static defaultProps: MarkdownRenderProps = {
    source: '',
    heading: HeadingRender,
    hr: HrRender,
    paragraph: ParagraphRender,
    text: TextRender,
    html: HtmlRender,
    code: CodeRender,
    list_item: ListItemRender,
    list: ListRender,
    blockquote: BlockquoteRender,
    table: TableRender
  }
  private renderComponents = (lexList: marked.TokensList | marked.Token[]): React.ReactNode => {
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
        const Component: React.ComponentType = this.props[token.type.replace('_start', '')];
        return Component && (
          <Component {...token} key={key}>
            {this.renderComponents(lexList.slice(key + 1, endIndex))}
          </Component>
        )
      }
      if (depth) {
        return null;
      }
      const SimpleComponent: React.ComponentType = this.props[token.type];
      return SimpleComponent && <SimpleComponent {...token} key={key} />;
    });
  };
  public componentDidUpdate() {
    this.props.onDidUpdate && this.props.onDidUpdate();
  }
  public render() {
    const { source } = this.props;
    const lexList = lexer(source);
    return <div className={style.markdownContainer}>{this.renderComponents(lexList)}</div>
  }
}