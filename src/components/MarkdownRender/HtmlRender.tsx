import * as React from 'react';
import { Tokens } from 'marked';
import BlockWrapper from './BlockWrapper';

export default class HtmlRender extends React.PureComponent<Tokens.HTML>{
  private blockTags = ['div', 'iframe'];
  public render() {
    const { text } = this.props;
    const isBlockMatch = text.match(/^<(.+?)\s/);
    if (isBlockMatch) {
      const [, tagName] = isBlockMatch;
      if (this.blockTags.includes(tagName)) {
        return (
          <BlockWrapper>
            <div dangerouslySetInnerHTML={{ __html: text }} />
          </BlockWrapper>
        );
      }
    }
    return <span dangerouslySetInnerHTML={{ __html: text }} />
  }
}