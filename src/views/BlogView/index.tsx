import * as React from 'react';
import { Switch, Route } from 'react-router';
import Article from './Article';
import BlogList from './BlogList';

export default class BlogView extends React.Component {
  public render() {
    return (
      <Switch>
        <Route path='/blog/:title' component={Article} />
        <Route component={BlogList} />
      </Switch>
    )
  }
}