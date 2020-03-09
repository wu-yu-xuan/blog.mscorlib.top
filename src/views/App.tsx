import * as React from 'react';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import { Router } from 'web-router';
import TabRoute, { TabRouteElement } from '../components/TabRoute';
import Corner from './Corner';
import BlogView from './BlogView';
import MarkdownView from './MarkdownView';

const tabRouteComponents: TabRouteElement[] = [
  { path: '/blog', tabName: 'Blog', title: "wyx's blog", Component: BlogView },
  {
    path: '/markdown',
    tabName: 'Markdown',
    title: "wyx's markdown playground",
    Component: MarkdownView
  }
];

export default function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <Router>
        <Corner />
        <TabRoute components={tabRouteComponents} />
      </Router>
    </ConfigProvider>
  );
}
