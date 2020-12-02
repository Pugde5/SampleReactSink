import React, { useContext, useEffect } from 'react';
import { AppContext } from '../../AppContext';

export const isIncluded = (subArray, arr) => {
  return subArray.every((subArrayItem) => {
    return arr.includes(subArrayItem);
  });
};

export function IsInRole({ children, roles = [] }) {
  const { state } = useContext(AppContext);
  const [authorized, setAuthorized] = React.useState(false);

  useEffect(() => {
    if (state.user && state.user.roles) {
      const isAuthorized = isIncluded(roles, state.user.roles);
      setAuthorized(isAuthorized);
    }
  }, [roles, setAuthorized, state.user]);

  return <>{authorized && children}</>;
}
