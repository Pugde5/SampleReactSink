import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Backdrop as MuiBackdrop, CircularProgress } from '@material-ui/core';
import { AppContext } from '../../AppContext';

const useStyles = makeStyles(theme => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

export default function Backdrop({ blocking }) {
  const classes = useStyles();
  const { state } = useContext(AppContext);
  return (
    <MuiBackdrop className={classes.backdrop} open={blocking || state.blocking || false} aria-label="backdrop">
      <CircularProgress color="inherit" />
    </MuiBackdrop>
  );
}
