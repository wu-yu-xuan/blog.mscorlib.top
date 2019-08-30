import * as React from 'react';
import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import { BrowserRouter } from 'react-router-dom';
import TabRoute, { TabRouteElement } from '../components/TabRoute';
import Corner from './Corner';
import BlogView from './BlogView';
import MarkdownView from './MarkdownView';

const tabRouteComponents: TabRouteElement[] = [
  { path: '/blog', tabName: 'Blog', title: 'wyx\'s blog', Component: BlogView },
  { path: '/markdown', tabName: 'Markdown', title: 'wyx\'s markdown playground', Component: MarkdownView }
];

export default function App() {
  return (
    <LocaleProvider locale={zhCN}>
      <BrowserRouter>
        <>
          <Corner />
          <TabRoute components={tabRouteComponents} />
        </>
      </BrowserRouter>
    </LocaleProvider>
  )
}