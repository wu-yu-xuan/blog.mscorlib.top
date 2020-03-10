import React from 'react';
import { Skeleton } from 'antd';
import { useParams } from 'web-router';
import Article from './Article';
import NotFoundArticle from './NotFoundArticle';
import ErrorBoundary from 'src/ErrorBoundary';

const error = <NotFoundArticle />;

const loading = (
  <Skeleton
    loading={true}
    active={true}
    title={false}
    paragraph={{ rows: 6 }}
  />
);

export default function ArticlePage() {
  const { title } = useParams<{ title: string }>();
  return (
    <ErrorBoundary fallback={error}>
      <React.Suspense fallback={loading}>
        <Article title={title} />
      </React.Suspense>
    </ErrorBoundary>
  );
}
