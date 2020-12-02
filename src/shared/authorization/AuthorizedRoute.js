import React, { useCallback, useContext } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { AppContext } from '../../AppContext';
import { isIncluded } from './IsInRole';

export default function AuthorizedRoute({ children, roles, ...rest }) {
  const { state } = useContext(AppContext);

  const authCallback = useCallback(
    ({ location }) => {
      if (state.user && state.user.roles) {
        const authorized = isIncluded(roles, state.user.roles);
        return authorized ? children : <Redirect to={{ pathname: '/', state: { from: location } }} />;
      }
      return <></>;
    },
    [roles, state.user, children],
  );

  return <Route {...rest} render={authCallback} />;
}
