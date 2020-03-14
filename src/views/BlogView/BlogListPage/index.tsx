import React, { Suspense } from 'react';
import ErrorBoundary from 'src/ErrorBoundary';
import BlogItem from './BlogItem';
import { Skeleton } from 'antd';
import BlogList from './BlogList';
import { Blog } from './interface';

const errorBlogItemProps: Blog = {
  title: 'unable to connect to the server',
  birthTime: 0,
  modifyTime: 0,
  hash: '',
  types: []
};

const errorBlogItem = <BlogItem {...errorBlogItemProps} />;

const loading = (
  <Skeleton
    loading={true}
    active={true}
    title={false}
    paragraph={{ rows: 6 }}
  />
);

export default function BlogListPage() {
  return (
    <ErrorBoundary fallback={errorBlogItem}>
      <Suspense fallback={loading}>
        <BlogList />
      </Suspense>
    </ErrorBoundary>
  );
}
