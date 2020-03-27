import React from 'react';
// import { Skeleton } from 'antd';
import { useParams } from 'web-router';
import Article from './Article';
import NotFoundArticle from './NotFoundArticle';
import ErrorBoundary from 'src/ErrorBoundary';

const error = <NotFoundArticle />;

export default function ArticlePage() {
  const { title } = useParams<{ title: string }>();
  return (
    <ErrorBoundary fallback={error}>
        <Article title={title} />
    </ErrorBoundary>
  );
}
