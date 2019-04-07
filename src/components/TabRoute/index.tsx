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

export default withRouter(function TabRoute({ location, components }: TabRouteProps & RouteComponentProps) {
  const [activeKey, setActiveKey] = React.useState(() => (
    Math.max(0, components.findIndex(({ path }) => !!location.pathname.match(new RegExp(`^${path}`, 'i')))).toString()
  ));
  React.useEffect(() => {
    document.title = components[activeKey].title;
  }, [activeKey]);
  return (
    <div className={style.tabContainer}>
      <Tabs activeKey={activeKey} className={style.tabs} onChange={setActiveKey}>
        {components.map(({ tabName, Component, path }, index) => tabName && (
          <TabPane tab={<NavLink to={path} className={style.tab}>{tabName}</NavLink>} key={index.toString()}>
            <Component />
          </TabPane>
        ))}
      </Tabs>
    </div>
  )
})