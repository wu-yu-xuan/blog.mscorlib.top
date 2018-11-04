import * as React from 'react';
import BlockWrapper from './BlockWrapper';

export interface ListRenderProps {
  ordered: boolean;
  start?: number | string;
  type: string;
}

export default class ListRender extends React.PureComponent<ListRenderProps>{
  public render() {
    const { ordered, start, children } = this.props;
    if (ordered) {
      return (
        <BlockWrapper>
          <ol start={Number(start)}>{children}</ol>
        </BlockWrapper>
      )
    }
    return (
      <BlockWrapper>
        <ul>{children}</ul>
      </BlockWrapper>
    )
  }
}