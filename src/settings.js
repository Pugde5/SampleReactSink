import { UserManager, WebStorageStateStore } from 'oidc-client';

export const contextPath = process.env.REACT_APP_API_CONTEXT_PATH || '';
export const apiPath = `${contextPath}/sp-ui-npefiling`;
export const securityEnabled =
  localStorage.getItem('securityEnabled') == null || localStorage.getItem('securityEnabled') === 'true';

export const jsonSchema = localStorage.getItem('jsonSchema');
export const jsonSchemaEnabled =
  process.env.REACT_APP_JSON_SCHEMA_ENABLED ||
  (localStorage.getItem('jsonSchemaEnabled') != null && localStorage.getItem('jsonSchemaEnabled') === 'true');

const oidcTokenKey = process.env.REACT_APP_OIDC_TOKEN_NAME || 'oidc.user:/auth:frontend';
const oidcRealm = process.env.REACT_APP_OIDC_REALM_ENDPOINT || '/auth';
const defaultRedirectUri = window.location.origin + window.location.pathname + contextPath;
export const userManager = new UserManager({
  authority: oidcRealm,
  client_id: 'frontend',
  redirect_uri: defaultRedirectUri,
  silent_redirect_uri: defaultRedirectUri,
  post_logout_redirect_uri: defaultRedirectUri,
  response_type: 'code',
  scope: 'openid email roles',
  loadUserInfo: true,
  userStore: new WebStorageStateStore({ store: window.localStorage }),
  automaticSilentRenew: true,
  accessTokenExpiringNotificationTime: 30,
});

export const getToken = () => {
  return localStorage.getItem(oidcTokenKey);
};
