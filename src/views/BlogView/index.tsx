import * as React from 'react';
import { Switch, Route } from 'web-router';
import Article from './Article';
import BlogListPage from './BlogListPage';

export default function BlogView() {
  return (
    <Switch>
      <Route path="/blog/:title(.+)">
        <Article />
      </Route>
      <Route path="/">
        <BlogListPage />
      </Route>
    </Switch>
  );
}
