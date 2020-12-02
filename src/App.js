import React, { Suspense } from 'react';

import { Route, Router, Switch} from 'react-router-dom';
import { makeStyles, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';

import { SnackbarProvider } from 'notistack';
import theme from './shared/theme';
import history from './history';
import { AppStateProvider } from './AppContext';
import GlobalHttpInterceptors from './shared/http/GlobalHttpInterceptors';

import MenuAppBar from './layout/menu/MenuAppBar';
import Backdrop from './components/backdrop/Backdrop';
import DraftSearch from './pages/DraftSearch';
import smalllogo from './smalllogo.jpg';

const useStyles = makeStyles(th => ({
  content: {
    paddingTop: th.spacing(3),
    paddingBottom: th.spacing(2),
  },
}));

export default function App() {
  const classes = useStyles(theme);
  return (
    <AppStateProvider>
      <div className={classes.root}>
        <ThemeProvider theme={theme}>
          <Suspense fallback={<Backdrop blocking={true} />}>
            <SnackbarProvider maxSnack={3}>
              <CssBaseline />
              <Router history={history}>
                <GlobalHttpInterceptors>
                  <Backdrop />
                  <MenuAppBar />
                  <CssBaseline />
                  <Container maxWidth="lg" className={classes.content}>
                    <Switch>
                      <Route path="/" strict component={DraftSearch} />
                    </Switch>
                  </Container>
                </GlobalHttpInterceptors>
              </Router>
            </SnackbarProvider>
          </Suspense>
        </ThemeProvider>
      </div>
      <footer>
      <img src={smalllogo} alt="Logo" className={classes.logo} /> Powered by the European Patent Office
      </footer>
    </AppStateProvider>
  );
}
