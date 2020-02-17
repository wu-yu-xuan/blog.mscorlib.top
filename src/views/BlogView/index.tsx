import * as React from 'react';
import { Switch, Route } from 'web-router';
import Article from './Article';
import BlogList from './BlogList';

export default function BlogView() {
  return (
    <Switch>
      <Route path="/blog/:title(.+)">
        <Article />
      </Route>
      <Route path="/">
        <BlogList />
      </Route>
    </Switch>
  );
}
