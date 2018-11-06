import * as React from 'react';
import { RouteComponentProps, Redirect } from 'react-router';
import MarkdownRender from 'src/components/MarkdownRender';
import { Skeleton } from 'antd';

interface ArticleState {
  error: boolean;
  markdown: string;
  loading: boolean;
}

export default class Article extends React.Component<RouteComponentProps<{ title: string }>, ArticleState>{
  constructor(props: RouteComponentProps<{ title: string }>) {
    super(props);
    this.state = {
      error: false,
      markdown: '',
      loading: true
    };
  }
  private handleMarkdownRenderUpdate = () => this.setState({ loading: false });
  public async componentDidMount() {
    const response = await fetch(`/markdown/${this.props.match.params.title}.md`);
    if (!response.ok) {
      this.setState({
        markdown: '# error, request timed out'
      });
      return;
    }
    if (!response.headers.get('Content-Type').includes('text/markdown')) {
      this.setState({
        error: true
      });
      return;
    }
    const markdown = await response.text();
    this.setState({ markdown });
  }
  public render() {
    const { error, markdown, loading } = this.state;
    if (error) {
      return <Redirect to='/blog' />;
    }
    return (
      <>
        <Skeleton loading={loading} active={true} children={false} title={false} paragraph={{ rows: 6 }} />
        <div hidden={loading}>
          <MarkdownRender source={markdown} onDidUpdate={this.handleMarkdownRenderUpdate} />
        </div>
      </>
    )
  }
}