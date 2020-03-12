import React from 'react';
import MarkdownRender from 'src/components/MarkdownRender';
import classNames from 'classnames';
import style from './style.scss';
import Catalog, { Heading } from './Catalog';
import useFetch from 'src/useFetch';

const isDev = process.env.NODE_ENV === 'development';

function containDotFile(path: string) {
  return path.startsWith('.') || path.includes('/.');
}

export default function Article({ title }: { title: string }) {
  const articleRef = React.useRef<HTMLElement>();
  const markdown = useMarkdown(title);
  const [headings, loading, handleMarkdownRenderUpdate] = useHeadings(
    articleRef.current
  );
  return (
    <div className={style.articleContainer}>
      <article
        ref={articleRef}
        hidden={loading}
        className={classNames({ [style.article]: !loading })}
      >
        <MarkdownRender
          source={markdown}
          onDidUpdate={handleMarkdownRenderUpdate}
        />
      </article>
      <Catalog headings={headings} />
    </div>
  );
}

async function getMarkdown(title: string) {
  const realTitle = title.replace(/-/g, ' ');
  // 沙雕 GitHub page, 不支持 dotFile
  const response = await fetch(
    !isDev && containDotFile(realTitle)
      ? `https://raw.githubusercontent.com/${process.env.GIT_USER}/${process.env.GIT_REPO}/gh-pages/markdown/${realTitle}.md`
      : `/markdown/${realTitle}.md`
  );
  if (
    response.ok &&
    ['text/markdown', 'text/plain'].some(v =>
      response.headers.get('Content-Type').includes(v)
    )
  ) {
    document.title = `${decodeURI(
      realTitle.replace(/(^.*\/)/g, '')
    )} - wyx's blog`;
    return response.text();
  }
  throw new Error();
}

function useMarkdown(title: string): string {
  return useFetch(getMarkdown, title);
}

function getHeadings(el: HTMLElement) {
  return Array.from(el.querySelectorAll('h1,h2,h3,h4,h5,h6')).reduce<Heading[]>(
    (re, v) => {
      const tag = v.tagName.toLowerCase();
      (['h1', 'h2'].includes(tag) ? re : re[re.length - 1].children).push({
        id: v.id,
        text: v.textContent,
        children: []
      });
      return re;
    },
    []
  );
}

function useHeadings(el: HTMLElement): [Heading[], boolean, () => void] {
  const [headings, setHeadings] = React.useState<Heading[]>([]);
  const [loading, setLoading] = React.useState(true);
  const handleMarkdownRenderUpdate = React.useCallback(() => {
    setLoading(false);
  }, []);
  React.useEffect(() => {
    if (!loading) {
      const target =
        location.hash &&
        document.getElementById(decodeURI(location.hash.slice(1)));
      target && target.scrollIntoView({ block: 'center' });
      setHeadings(getHeadings(el));
    }
  }, [loading]);
  return [headings, loading, handleMarkdownRenderUpdate];
}
