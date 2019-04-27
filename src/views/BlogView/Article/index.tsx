import * as React from 'react';
import { RouteComponentProps, Redirect } from 'react-router';
import MarkdownRender from 'src/components/MarkdownRender';
import { Skeleton } from 'antd';
import * as classNames from 'classnames';
import * as style from './style.scss';
import Catalog, { Heading } from './Catalog';

export default function Article({ match }: RouteComponentProps<{ title: string }>) {
  const articleRef = React.useRef<HTMLElement>();
  const [markdown, error] = useMarkdown(match.params.title);
  const [headings, loading, handleMarkdownRenderUpdate] = useHeadings(articleRef.current);
  if (error) {
    return <Redirect to='/blog' />; 
  }
  return (
    <div className={style.articleContainer}>
      <Skeleton loading={loading} active={true} children={false} title={false} paragraph={{ rows: 6 }} />
      <article ref={articleRef} hidden={loading} className={classNames({ [style.article]: !loading })}>
        <MarkdownRender source={markdown} onDidUpdate={handleMarkdownRenderUpdate} />
      </article>
      <Catalog headings={headings} />
    </div>
  )

}

function useMarkdown(title: string): [string, boolean] {
  const [error, setError] = React.useState(false);
  const [markdown, setMarkdown] = React.useState('');
  React.useEffect(() => {
    document.title = `${title} - wyx's blog`;
    (async () => {
      const response = await fetch(`/markdown/${title.replace(/-/g, ' ')}.md`);
      if (!response.ok) {
        setMarkdown('# error, request timed out');
        return;
      }
      if (!response.headers.get('Content-Type').includes('text/markdown')) {
        setError(true);
        return;
      }
      setMarkdown(await response.text());
    })();
  }, [title]);
  return [markdown, error];
}

function getHeadings(el: HTMLElement) {
  return Array.from(el.querySelectorAll('h1,h2,h3,h4,h5,h6')).reduce<Heading[]>((re, v) => {
    const tag = v.tagName.toLowerCase();
    ((tag === 'h1' || tag === 'h2') ? re : re[re.length - 1].children).push({
      id: v.id,
      text: v.textContent,
      children: []
    });
    return re;
  }, []);
}

function useHeadings(el: HTMLElement): [
  Heading[],
  boolean,
  () => void
] {
  const [headings, setHeadings] = React.useState<Heading[]>([]);
  const [loading, setLoading] = React.useState(true);
  const handleMarkdownRenderUpdate = React.useCallback(() => {
    setLoading(false);
  }, []);
  React.useEffect(() => {
    if (!loading) {
      const target = location.hash && document.getElementById(decodeURI(location.hash.slice(1)));
      target && target.scrollIntoView({ block: 'center' });
      setHeadings(getHeadings(el));
    }
  }, [loading]);
  return [headings, loading, handleMarkdownRenderUpdate];
}