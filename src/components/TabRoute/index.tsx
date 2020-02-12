import * as React from 'react';
import { Tabs } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import * as style from './style.scss';

const { TabPane } = Tabs;

export interface TabRouteElement {
  path: string;
  tabName: string;
  title: string;
  Component: React.ComponentType;
}

export interface TabRouteProps {
  components: TabRouteElement[];
}

export default function TabRoute({ components }: TabRouteProps) {
  const [activeKey, setActiveKey] = useActiveKey(components);
  return (
    <div className={style.tabContainer}>
      <Tabs
        activeKey={activeKey}
        className={style.tabs}
        onChange={setActiveKey}
      >
        {components.map(
          ({ tabName, Component, path }, index) =>
            tabName && (
              <TabPane
                tab={
                  <Link to={path} className={style.tab}>
                    {tabName}
                  </Link>
                }
                key={index.toString()}
              >
                <Component />
              </TabPane>
            )
        )}
      </Tabs>
    </div>
  );
}

function useActiveKey(
  components: TabRouteElement[]
): [string, React.Dispatch<React.SetStateAction<string>>] {
  const { pathname } = useLocation();
  const [activeKey, setActiveKey] = React.useState(() =>
    Math.max(
      0,
      components.findIndex(
        ({ path }) => !!pathname.match(new RegExp(`^${path}`, 'i'))
      )
    ).toString()
  );
  React.useEffect(() => {
    document.title = components[activeKey].title;
  }, [activeKey]);
  return [activeKey, setActiveKey];
}
