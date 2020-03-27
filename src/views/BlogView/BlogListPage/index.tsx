import React from 'react';
import ErrorBoundary from 'src/ErrorBoundary';
import BlogItem from './BlogItem';
import BlogList from './BlogList';
import { BlogItemProps } from './interface';

const errorBlogItemProps: BlogItemProps = {
  title: 'unable to connect to the server',
  birthTime: 0,
  modifyTime: 0,
  hash: '',
  types: [],
  searchWords: []
};

const errorBlogItem = <BlogItem {...errorBlogItemProps} />;



export default function BlogListPage() {
  return (
    <ErrorBoundary fallback={errorBlogItem}>
        <BlogList />
    </ErrorBoundary>
  );
}
