import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { Tabs } from 'antd';
import { NavLink } from 'react-router-dom';
import * as style from './style.scss';

const { TabPane } = Tabs;

export interface TabRouteElement {
  path: string;
  tabName: string;
  title: string;
  Component: React.ComponentType
}

export interface TabRouteProps {
  components: TabRouteElement[];
}

export default withRouter(class TabRoute extends React.Component<RouteComponentProps<{}> & TabRouteProps>{
  private findMatchIndex = () => {
    const { components, location } = this.props;
    const result = components.findIndex(({ path }) => !!location.pathname.match(new RegExp(`^${path}`, 'i')));
    if (result === -1) {
      return 0;
    }
    return result;
  }
  private handleTabsChange = (activeKey: string) => {
    const { title } = this.props.components[parseInt(activeKey, 10)];
    document.title = title;
  }
  public componentDidMount() {
    document.title = this.props.components[this.findMatchIndex()].title;
  }
  public render() {
    const { components } = this.props;
    const matchIndex = this.findMatchIndex();
    return (
      <div className={style.tabContainer}>
        <Tabs activeKey={matchIndex.toString()} className={style.tabs} onChange={this.handleTabsChange}>
          {components.map(({ tabName, Component, path }, index) => tabName && (
            <TabPane tab={<NavLink to={path} className={style.tab}>{tabName}</NavLink>} key={index.toString()} >
              <Component />
            </TabPane>
          ))}
        </Tabs>
      </div>
    )
  }
})