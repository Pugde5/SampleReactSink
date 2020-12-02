import React, { useEffect, useReducer } from 'react';
import axios from 'axios';
import { userManager, securityEnabled, contextPath, jsonSchemaEnabled, jsonSchema } from './settings';
import { Roles } from './shared/authorization/Roles';

export const hasCodeInUrl = (location) => {
  const searchParams = new URLSearchParams(location.search);
  return Boolean(searchParams.get('code') || searchParams.get('id_token') || searchParams.get('session_state'));
};

const INITIAL_APP_STATE = {
  user: securityEnabled
    ? null
    : {
        given_name: 'John',
        username: 'john',
        name: 'John Mocks',
        roles: [Roles.SUBMISSION_DRAFTER],
      },
  signingIn: true,
  signingOut: false,
  lockedDraft: {
    status: null,
    id: null,
  },
};

const reducer = (state, { type, value }) => {
  switch (type) {
    case 'signIn':
      return { ...state, signingIn: true };
    case 'signInSuccess':
      return { ...state, signingIn: false, user: value };
    case 'signOut':
      return { ...state, signingOut: true };
    case 'signOutSuccess':
      return { ...state, signingOut: false, user: null };
    case 'signOutError':
      return { ...state, signingOut: false };
    case 'validationSchemaSuccess':
      return { ...state, validationSchema: value };
    case 'blockStart':
      return { ...state, blocking: true };
    case 'blockStop':
      return { ...state, blocking: false };
    default: {
      // eslint-disable-next-line no-console
      console.warn('AppContext No action registered for ', type);
      return state;
    }
  }
};

function useSignIn(state, dispatch) {
  function initUser(user) {
    const { roles } = JSON.parse(atob(user.access_token.split('.')[1])).realm_access;
    const action = { type: 'signInSuccess', value: { ...user.profile, roles } };
    dispatch(action);
  }

  useEffect(() => {
    (async () => {
      if (state.signingIn && securityEnabled) {
        if (hasCodeInUrl(window.location)) {
          await userManager.signinCallback(window.location.href);
          const url = window.location.origin + window.location.pathname;
          window.history.pushState({}, document.title, url);

          const user = await userManager.getUser();
          initUser(user);
          userManager.clearStaleState();
          return;
        }
        const user = await userManager.getUser();
        if (!user || user.expired) {
          await userManager.signinRedirect({ useReplaceToNavigate: window.location.href });
        } else {
          initUser(user);
        }
      }
    })();
  }, [state.signingIn, dispatch]);
}

function useSignOut(state, dispatch) {
  useEffect(() => {
    (async () => {
      if (state.signingOut && securityEnabled) {
        try {
          await userManager.signoutRedirect({ post_logout_redirect_uri: window.location.href });
          dispatch({ type: 'signOutSuccess' });
        } catch {
          dispatch({ type: 'signOutError' });
        }
      }
    })();
  }, [state.signingOut, dispatch]);
}

function useValidationSchema(state, dispatch) {
  useEffect(() => {
    (async () => {
      if (jsonSchemaEnabled && state.validation == null) {
        try {
          const { data: resp } = await axios.get(`${contextPath}/${jsonSchema}`, {
            method: 'GET',
          });
          dispatch({ type: 'validationSchemaSuccess', value: resp });
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error(err);
          dispatch({ type: 'validationSchemaError' });
        }
      }
    })();
  }, [state.signingOut, dispatch]);
}

const AppContext = React.createContext(INITIAL_APP_STATE);

function AppStateProvider(props) {
  const [state, dispatch] = useReducer(reducer, INITIAL_APP_STATE);
  useValidationSchema(state, dispatch);
  useSignIn(state, dispatch);
  useSignOut(state, dispatch);

  let renderCondition = state.user;
  if (jsonSchemaEnabled) {
    renderCondition = state.user && state.validationSchema;
  }
  return <AppContext.Provider value={{ state, dispatch }}>{renderCondition && props.children}</AppContext.Provider>;
}

export { AppContext, AppStateProvider };
