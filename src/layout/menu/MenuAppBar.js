import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Container from '@material-ui/core/Container';
import { Link } from 'react-router-dom';
import LanguageIcon from '@material-ui/icons/Language';
import logo from './logo.jpg';
import line from './header-line.png';
import { AppContext } from '../../AppContext';
import { Roles } from '../../shared/authorization/Roles';
import { securityEnabled } from '../../settings';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  toolBar: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    backgroundColor: 'transparent',
    color: 'black',
  },
  logo: {
    height: '4em',
    marginRight: '1.5em',
  },
  spacer: {
    marginRight: theme.spacing(1),
  },
  strong: {
    fontWeight: 'bold',
  },
}));

export default function MenuAppBar() {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const { state, dispatch } = useContext(AppContext);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = () => {
    handleClose();
    dispatch({ type: 'signOut' });
  };

  const handleJsonSchemaValidation = (schemaName) => {
    handleClose();
    localStorage.setItem('jsonSchemaEnabled', true);
    localStorage.setItem('jsonSchema', schemaName);
    window.location.reload();
  };

  const handleStandardValidation = () => {
    handleClose();
    localStorage.removeItem('jsonSchemaEnabled');
    localStorage.setItem('jsonSchema', 'schema2.json');
    window.location.reload();
  };

  const handleMockSignIn = (role) => {
    const user = {
      given_name: 'John',
      username: 'john',
      name: 'John Mocks',
      roles: [role],
    };
    const action = { type: 'signInSuccess', value: user };
    dispatch(action);
    handleClose();
  };

  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className={classes.root}>
      <AppBar elevation={0} className={classes.toolBar} position="static">
        <Container maxWidth="lg">
          <Toolbar className={classes.toolBar}>
            <Link to="/">
              <img src={logo} alt="Logo" className={classes.logo} />
            </Link>
            <img src={line} alt="Logo" className={classes.logo} />
            <Typography variant="h6" className={classes.title}>
              Patent e-filing
            </Typography>
            {state.user && (
              <div>
                <Button
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                  size="small"
                  className={classes.spacer}
                  startIcon={<AccountCircle />}
                >
                  {state.user.name}
                </Button>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={open}
                  onClose={handleClose}
                >
                  {!securityEnabled && (
                    <MenuItem onClick={() => handleMockSignIn(Roles.SUBMISSION_DRAFTER)}>Drafter</MenuItem>
                  )}
                  {!securityEnabled && (
                    <MenuItem onClick={() => handleMockSignIn(Roles.SUBMISSION_SENDER)}>Sender</MenuItem>
                  )}
                  {!securityEnabled && (
                    <MenuItem onClick={() => handleMockSignIn(Roles.SUBMISSION_SIGNER)}>Signer</MenuItem>
                  )}
                  {!securityEnabled && (
                    <MenuItem onClick={() => handleMockSignIn(Roles.ADMINISTRATOR)}>Administrator</MenuItem>
                  )}
                  <MenuItem
                    onClick={() => handleStandardValidation()}
                    className={!localStorage.getItem('jsonSchemaEnabled') ? classes.strong : null}
                  >
                    Default validation
                  </MenuItem>
                  <MenuItem
                    onClick={() => handleJsonSchemaValidation('schema.json')}
                    className={
                      localStorage.getItem('jsonSchemaEnabled') && localStorage.getItem('jsonSchema') === 'schema.json'
                        ? classes.strong
                        : null
                    }
                  >
                    Schema 1 validation
                  </MenuItem>
                  <MenuItem
                    onClick={() => handleJsonSchemaValidation('schema2.json')}
                    className={
                      localStorage.getItem('jsonSchemaEnabled') && localStorage.getItem('jsonSchema') === 'schema2.json'
                        ? classes.strong
                        : null
                    }
                  >
                    Schema 2 validation
                  </MenuItem>
                  <MenuItem onClick={handleSignOut}>Sign out</MenuItem>
                </Menu>
              </div>
            )}
            <Grid>
              <Button
                variant="outlined"
                size="small"
                color="inherit"
                onClick={() => changeLanguage('nl')}
                className={classes.spacer}
              >
                <LanguageIcon />
                {' '}
                NL
              </Button>
              <Button variant="outlined" size="small" color="inherit" onClick={() => changeLanguage('en')}>
                <LanguageIcon />
                EN
              </Button>
            </Grid>
          </Toolbar>
        </Container>
      </AppBar>
    </div>
  );
}
