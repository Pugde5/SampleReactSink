import { createBrowserHistory } from 'history';
import { contextPath } from './settings';

export default createBrowserHistory({ basename: contextPath });
