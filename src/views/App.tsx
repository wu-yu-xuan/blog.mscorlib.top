import * as React from 'react';
import * as style from './style.scss';
import { LocaleProvider, Tabs } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import { BrowserRouter, NavLink, Switch, Route } from 'react-router-dom';
import MarkdownView from './MarkdownView';

const { TabPane } = Tabs;

export default class App extends React.Component {
    public render() {
        return (
            <LocaleProvider locale={zhCN}>
                <BrowserRouter>
                    <>
                        <Tabs>
                            <TabPane tab={<NavLink to="richtext" className={style.tab}>RichText</NavLink>} key="1" />
                            <TabPane tab={<NavLink to="markdown" className={style.tab}>Markdown</NavLink>} key="2" />
                        </Tabs>
                        <Switch>
                            <Route path="/markdown" component={MarkdownView} />
                            <Route path="/" component={MarkdownView} />
                        </Switch>
                    </>
                </BrowserRouter>
            </LocaleProvider>
        )
    }
}