import * as React from 'react';

export interface ListRenderProps {
  ordered: boolean;
  start?: number | string;
  type: string;
}

export default class ListRender extends React.PureComponent<ListRenderProps>{
  public render() {
    const { ordered, start, children } = this.props;
    if (ordered) {
      return <ol start={Number(start)}>{children}</ol>
    }
    return <ul>{children}</ul>
  }
}