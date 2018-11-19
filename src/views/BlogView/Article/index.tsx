import * as React from 'react';
import { RouteComponentProps, Redirect } from 'react-router';
import MarkdownRender from 'src/components/MarkdownRender';
import { Skeleton, Anchor } from 'antd';
import * as classNames from 'classnames';
import * as style from './style.scss';

const { Link } = Anchor;

interface Heading {
  id: string;
  text: string;
  children: Heading[]
}

interface ArticleState {
  error: boolean;
  markdown: string;
  loading: boolean;
  headings: Heading[];
}

export default class Article extends React.Component<RouteComponentProps<{ title: string }>, ArticleState>{
  constructor(props: RouteComponentProps<{ title: string }>) {
    super(props);
    this.state = {
      error: false,
      markdown: '',
      loading: true,
      headings: []
    };
  }
  private handleMarkdownRenderUpdate = () => {
    this.setState({ loading: false }, async () => {
      const target = this.props.location.hash && document.querySelector(decodeURI(this.props.location.hash));
      target && target.scrollIntoView({ block: 'center' });
      const headings = await this.getHeadings();
      this.setState({ headings });
    });
  };
  private getHeadings = async () => {
    const result: Heading[] = [];
    const headings: HTMLHeadingElement[] = Array.from(document.querySelectorAll('h1,h2,h3,h4,h5,h6'));
    for (const heading of headings) {
      ((heading.tagName.toLowerCase() === 'h1' || heading.tagName.toLowerCase() === 'h2') ? result : result[result.length - 1].children).push({
        id: heading.id,
        text: heading.textContent,
        children: []
      });
    }
    return result;
  }
  public async componentDidMount() {
    const { title } = this.props.match.params;
    document.title = `${title} - wyx's blog`;
    const response = await fetch(`/markdown/${title.replace(/-/g, ' ')}.md`);
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
    const { error, markdown, loading, headings } = this.state;
    if (error) {
      return <Redirect to='/blog' />;
    }
    return (
      <div className={style.articleContainer}>
        <Skeleton loading={loading} active={true} children={false} title={false} paragraph={{ rows: 6 }} />
        <article hidden={loading} className={classNames({ [style.article]: !loading })}>
          <MarkdownRender source={markdown} onDidUpdate={this.handleMarkdownRenderUpdate} />
        </article>
        <div className={style.anchor}>
          <Anchor offsetTop={90}>
            {headings.map((value, key) => (
              <Link href={`#${value.id}`} title={value.text} key={key} >
                {!!value.children.length && value.children.map((smallHeading, index) => <Link href={`#${smallHeading.id}`} title={smallHeading.text} key={index} />)}
              </Link>
            ))}
          </Anchor>
        </div>
      </div>
    )
  }
}