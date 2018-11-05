import * as React from 'react';
import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import { BrowserRouter } from 'react-router-dom';
import MarkdownView from './MarkdownView';
import RichtextView from './RichtextView';
import TabRoute, { TabRouteElement } from '../components/TabRoute';
import Corner from './Corner';
import MyMarkdownView from './MyMarkdownView';
import './style.scss';

export default class App extends React.Component {
  private tabRouteComponents: TabRouteElement[] = [
    { path: '/mymarkdown', tabName: 'MyMarkdown', Component: MyMarkdownView },
    { path: '/richtext', tabName: 'Richtext', Component: RichtextView },
    { path: '/markdown', tabName: 'Markdown', Component: MarkdownView },
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