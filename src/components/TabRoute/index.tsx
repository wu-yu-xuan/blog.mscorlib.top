import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { Tabs } from 'antd';
import { NavLink } from 'react-router-dom';
import * as style from './style.scss';
import { CSSTransition } from 'react-transition-group';

const { TabPane } = Tabs;

export interface TabRouteElement {
  path: string;
  tabName: string;
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
  public render() {
    const { components } = this.props;
    const matchIndex = this.findMatchIndex();
    return (
      <div className={style.tabContainer}>
        <Tabs activeKey={matchIndex.toString()} className={style.tabs}>
          {components.map(({ tabName, path }, index) => tabName && (
            <TabPane tab={<NavLink to={path} className={style.tab}>{tabName}</NavLink>} key={index.toString()} />
          ))}
        </Tabs>
        <div className={style.tabRouteContentWrapper}>
          {components.map(({ Component }, index) => Component && (
            <CSSTransition in={index === matchIndex} timeout={300} key={index} mountOnEnter={true} classNames={{
              enterActive: style.enterActive,
              enter: style.enter,
              exitActive: style.exitActive,
              exitDone: style.exitDone
            }}>
              <div className={style.tabRouteContent}>
                <Component />
              </div>
            </CSSTransition>
          ))}
        </div>
      </div>
    )
  }
})