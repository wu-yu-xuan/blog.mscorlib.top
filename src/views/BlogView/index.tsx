import React from 'react';
import { Route, TransitionSwitch } from 'web-router';
import Article from './ArticlePage';
import BlogListPage from './BlogListPage';
import { Skeleton } from 'antd';

const loading = (
  <Skeleton
    loading={true}
    active={true}
    title={false}
    paragraph={{ rows: 6 }}
  />
);

export default function BlogView() {
  return (
    <TransitionSwitch timeoutMs={10000} fallback={loading}>
      <Route path="/blog/:title(.+)">
        <Article />
      </Route>
      <Route path="/">
        <BlogListPage />
      </Route>
    </TransitionSwitch>
  );
}
