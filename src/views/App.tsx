import * as React from 'react';
import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import { BrowserRouter } from 'react-router-dom';
import TabRoute, { TabRouteElement } from '../components/TabRoute';
import Corner from './Corner';
import BlogView from './BlogView';
import MarkdownView from './MarkdownView';

export default class App extends React.Component {
  private tabRouteComponents: TabRouteElement[] = [
    { path: '/blog', tabName: 'Blog', documentTitle: `wyx's blog`, Component: BlogView },
    { path: '/markdonwn', tabName: 'Markdown', documentTitle: `wyx's markdown playground`, Component: MarkdownView }
  ];
  public render() {
    return (
      <LocaleProvider locale={zhCN}>
        <BrowserRouter>
          <>
            <Corner />
            <TabRoute components={this.tabRouteComponents} />
          </>
        </BrowserRouter>
      </LocaleProvider>
    )
  }
}