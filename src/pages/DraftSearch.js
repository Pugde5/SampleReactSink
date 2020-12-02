import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import { useHistory } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    TextField,
  } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import VisibilityIcon from '@material-ui/icons/Visibility';
import EditIcon from '@material-ui/icons/EditRounded';
import AdjustIcon from '@material-ui/icons/AdjustRounded';
import FilterListIcon from '@material-ui/icons/FilterList';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import { IsInRole } from '../shared/authorization/IsInRole';
import { Roles } from '../shared/authorization/Roles';

function createData(name, type, country, status, id, draftkey) {
  return { name, type, country, status, id, draftkey };
}

const rows = [
  createData('Wally14', 'EPCT101', 'Greece', 'Draft', 'f689d331-7e97-425a-b83a-4581a32346c9', 'ae20783f-4857-4b8e-8b53-470cccc096f0'),
  createData('Wally17', 'EPCT101', 'EPO', 'Draft', '84dc7109-720f-4371-b78a-143f4b0bf8e2', 'f6682c30-3467-4005-9014-6a86ebe7159e'),
  createData('ONE', 'EP', 'Lithuania', 'Draft', '', ''),
  createData('Test', 'EP', 'EPO', 'Draft', '', ''),
  createData('Gingerbread', 'FO', 'EPO', 'Draft', '49f4a7e5-62ec-43b8-82eb-587c32848568', ''),
  createData('Honeycomb', 'FO', 'Spain', 'Draft', '513ba5b9-d0ae-4d9c-accb-0d9adf398f5f', ''),
];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  { id: 'name', numeric: false, disablePadding: false, label: 'Submission' },
  { id: 'country', numeric: true, disablePadding: false, label: 'Country/EPO' },
  { id: 'type', numeric: true, disablePadding: false, label: 'Type' },
  { id: 'status', numeric: true, disablePadding: false, label: 'Status' },
  { id: 'edit', numeric: true, disablePadding: false, label: 'Edit View Valid Sign' },
];

function EnhancedTableHead(props) {
  const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>

        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: '1 1 100%',
  },
}));


const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    backgroundColor: 'transparent',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
    margin: '10px',
    backgroundColor: 'transparent',
  },
  table: {
    minWidth: 750,
    backgroundColor: 'white',
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
}));

export default function DraftSearch() {
  const classes = useStyles();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [ isEPCTDialogOpen, setIsEPCTDialogOpen ] = React.useState(false);

  const history = useHistory();

  const [epct, setEPCT] = React.useState({
    authToken: '',
    folderId: 4,
    proceduralLanguage: 'en',
    fileReference: '',
    addressId: null,
    procedureId: 5,
    wipoPaymentMode: 'AUTO',
    submissionType: 'SUBMISSION',
    applicationNumber: '',
  });

  const createEPCT = () => {
    setIsEPCTDialogOpen(true);
  };

  const closeEPCTDialog = () => {
    setIsEPCTDialogOpen(false);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const addEPCT = () => {
    setIsEPCTDialogOpen(false);
    history.push(`/epct`, {
      goBackText: 'Overview page',
      goBackPath: '/',
      epct: { ...epct },
    });
  }

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const changeEPCT = (event) => {
    setEPCT({...epct, [event.target.name]: event.target.value});
  }

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    <div className={classes.root}>
      <Paper elevation={0} className={classes.paper}>
        <Box display="flex" p={1}>
          <Box p={1} flexGrow={1}>
            <Typography variant="h1"> My Submissions
            </Typography>
            <Typography variant="body1" gutterBottom>
              On this page you can create and manage patent application drafts.
            </Typography>
          </Box>
          <Box p={1} flexShrink={0}>
            <IsInRole roles={[Roles.SUBMISSION_DRAFTER]}>
              <Button
                style={{ marginRight: '10px' }}
                id="submissionDrafter"
                variant="contained"
                color="primary"
                onClick={createEPCT}
              >
                + New Submission
              </Button>
            </IsInRole>
          </Box>
        </Box>
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size= 'medium'
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.name);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.name)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.name}
                      selected={isItemSelected}
                    >
                      <TableCell component="th" id={labelId} scope="row" padding="20px">
                        {row.name}
                      </TableCell>
                      <TableCell align="right">{row.country}</TableCell>
                      <TableCell align="right">{row.type}</TableCell>
                      <TableCell align="right">{row.status}</TableCell>
                      <TableCell align="right"><EditIcon/>&nbsp;&nbsp;&nbsp;<VisibilityIcon/>&nbsp;&nbsp;&nbsp;<AdjustIcon/>&nbsp;&nbsp;&nbsp;<CheckCircleOutlineIcon/></TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
             <Dialog
        open={isEPCTDialogOpen}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="epct-add-title">EPCT</DialogTitle>
        <DialogContent>
          <DialogContentText id="priority-alert-description">
            <Grid container>
            <Grid container item  xs={12} spacing={2}>
                <Grid item xs={12}>
                  <FormControl variant="outlined" fullWidth >
                    <InputLabel id="roleInProceedings-label">Country</InputLabel>
                    <Select
                      id="country"
                      labelId="country-label"
                      label="Country"
                      onChange={changeEPCT}
                      name="country"
                    >
                      <MenuItem key="EPO" value="EPO">
                        EPO
                      </MenuItem>
                      <MenuItem key="Greece" value="Greece">
                        Greece
                      </MenuItem>
                      <MenuItem key="Lithuania" value="Lithuania">
                        Lithuania
                      </MenuItem>
                      <MenuItem key="Spain" value="Spain">
                        Spain
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl variant="outlined" fullWidth >
                    <InputLabel id="type-label">Role In Proceedings</InputLabel>
                    <Select
                      id="type"
                      labelId="type-label"
                      label="Type of Submission"
                      onChange={changeEPCT}
                      name="type"
                    >
                      <MenuItem key="Front Office" value="FO">
                        Front Office
                      </MenuItem>
                      <MenuItem key="HFS" value="HFS">
                        HFS
                      </MenuItem>
                      <MenuItem key="101" value="101">
                        EP/EPT/101
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    id="fileReference"
                    name="fileReference"
                    label="User File Reference"
                    defaultValue=""
                    fullWidth
                    variant="outlined" 
                    onChange={changeEPCT}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl variant="outlined" fullWidth >
                    <InputLabel id="roleInProceedings-label">Role In Proceedings</InputLabel>
                    <Select
                      id="roleInProceedings"
                      labelId="roleInProceedings-label"
                      label="Role In Proceedings"
                      onChange={changeEPCT}
                      name="roleInProceedings"
                    >
                      <MenuItem key="APPLICANT" value="AUTO">
                        Applicant
                      </MenuItem>
                      <MenuItem key="AGENT" value="AGENT">
                        International Agent
                      </MenuItem>
                      <MenuItem key="PROPRIETOR" value="PROPRIETOR">
                        Proprietor
                      </MenuItem>
                      <MenuItem key="REPRESENTATIVE" value="REPRESENTATIVE">
                        Representative
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl variant="outlined" fullWidth >
                    <InputLabel id="paymentMethod-label">Payment Method</InputLabel>
                    <Select
                      id="wipoPaymentMode"
                      labelId="paymentMethod-label"
                      label="Payment Mathod"
                      name="wipoPaymentMode"
                      onChange={changeEPCT}
                    >
                      <MenuItem key="AUTO" value="AUTO">
                        Automatic Debit Order
                      </MenuItem>
                      <MenuItem key="debitFromDepositAccount" value="BANK">
                        Debit from deposit account
                      </MenuItem>
                      <MenuItem key="bankTransfer" value="DBIT">
                        Bank transfer
                      </MenuItem>
                      <MenuItem key="creditCard" value="CCARD">
                        Credit card
                      </MenuItem>
                      <MenuItem key="notSpecified" value="NONE">
                        Not specified
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl variant="outlined" fullWidth >
                    <InputLabel id="language-label">Language of the Proceedings</InputLabel>
                    <Select
                      id="language"
                      labelId="language-label"
                      label="Language of the Proceedings"
                      onChange={changeEPCT}
                      name="proceduralLanguage"
                    >
                      <MenuItem key="en" value="en">
                        English
                      </MenuItem>
                      <MenuItem key="fr" value="fr">
                        French
                      </MenuItem>
                      <MenuItem key="de" value="de">
                        German
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={closeEPCTDialog}
            color="secondary"
            autoFocus
            id="cancelAddEPCT"
            className={classes.actionButton}
          >
            Cancel
          </Button>
          <Button
            onClick={addEPCT}
            color="secondary"
            autoFocus
            id="addEPTC"
            variant="contained"
            className={classes.actionButton}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
      </Paper>
    </div>
  );
}
