import { useContext } from 'react';
import { RouteComponentProps, StaticContext } from 'react-router';
import * as H from 'history';
// @ts-ignore
import { __RouterContext as RouterContext } from 'react-router';

/**
 * @see https://github.com/ReactTraining/react-router/pull/6453
 * @see https://github.com/ReactTraining/react-router/issues/6430
 */
export function useRouter<
  Params extends { [K in keyof Params]?: string } = {},
  C extends StaticContext = StaticContext,
  S = H.LocationState
>() {
  return useContext(RouterContext) as RouteComponentProps<Params, C, S>;
}
