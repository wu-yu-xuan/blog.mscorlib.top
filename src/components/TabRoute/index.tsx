import * as React from 'react';
import { Tabs } from 'antd';
import { NavLink } from 'react-router-dom';
import * as style from './style.scss';
import { useRouter } from './useRouter';

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

export default function TabRoute({ components }: TabRouteProps) {
  const [activeKey, setActiveKey] = useActiveKey(components);
  const setTitle = (key: number) => () => document.title = components[key].title;
  return (
    <div className={style.tabContainer}>
      <Tabs activeKey={activeKey} className={style.tabs} onChange={setActiveKey}>
        {components.map(({ tabName, Component, path }, index) => tabName && (
          <TabPane tab={<NavLink to={path} onClick={setTitle(index)} className={style.tab}>{tabName}</NavLink>} key={index.toString()}>
            <Component />
          </TabPane>
        ))}
      </Tabs>
    </div>
  )
}

function useActiveKey(components: TabRouteElement[]): [
  string,
  React.Dispatch<React.SetStateAction<string>>
] {
  const { location } = useRouter();
  const [activeKey, setActiveKey] = React.useState(() => (
    Math.max(0, components.findIndex(({ path }) => !!location.pathname.match(new RegExp(`^${path}`, 'i')))).toString()
  ));
  React.useEffect(() => {
    document.title = components[activeKey].title;
  }, [activeKey]);
  return [activeKey, setActiveKey];
}