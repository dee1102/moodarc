import dayjs from 'dayjs';
import * as React from 'react';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { visuallyHidden } from '@mui/utils';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef } from '@mui/x-data-grid';

interface Data {
  id: number;
  title: string;
  stress: number;
  relief: number;
  mood: number;
}

function createData(
  id: number,
  title: string,
  stress: number,
  relief: number,
  mood: number
): Data {
  return {
    id, title, stress, relief, mood
  };
}

// replace the top-level `rows` and `addNewRow` with a stateful version:
const initialRows: Data[] = [
  createData(1, 'task 1', 305, 3.7, 67),
  createData(2, 'ask 1', 452, 25.0, 51),
  createData(3, 'ask 1', 262, 16.0, 24),
  createData(4, 'ask 1', 159, 6.0, 24),
  createData(5, 'ask ask 1', 356, 16.0, 49),
  createData(6, 'ask 1', 408, 3.2, 87),
  createData(7, 'ask 1', 237, 9.0, 37)
];

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string },
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: 'title',
    numeric: false,
    disablePadding: true,
    label: 'Task',
  },
  {
    id: 'stress',
    numeric: true,
    disablePadding: false,
    label: 'Stress Level',
  },
  {
    id: 'relief',
    numeric: true,
    disablePadding: false,
    label: 'Relief Level',
  },
  {
    id: 'mood',
    numeric: true,
    disablePadding: false,
    label: 'Mood',
  }
];

interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
    props;
  const createSortHandler =
    (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
interface EnhancedTableToolbarProps {
  numSelected: number;
  selectedDate: dayjs.Dayjs;
  onAddClick?: () => void; // added prop
}
function EnhancedTableToolbar(props: EnhancedTableToolbarProps) { // This is the top bar under the date
  const { numSelected, selectedDate, onAddClick } = props;
  return (
    <Toolbar
      sx={[
        {
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
        },
        numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        },
      ]}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          {dayjs(selectedDate).format('YYYY-MM-DD')}
        </Typography>
      )}
      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Add new task">
          <IconButton onClick={onAddClick}>
            <AddIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}
export default function TaskComponent({selectedDate}) {
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof Data>('stress');
  const [selected, setSelected] = React.useState<readonly number[]>([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  // dialog state for the add form
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const handleDialogOpen = () => setDialogOpen(true);
  const handleDialogClose = () => setDialogOpen(false);
  const [rows, setRows] = React.useState(initialRows);

  const addNewRow = (payload?: { title?: string; stress?: number | string; relief?: number | string; mood?: number | string; }) => {
    const newId = rows.length + 1;
    const title = payload?.title ?? `New Task ${newId}`;
    const stress = Number(payload?.stress ?? 0);
    const relief = Number(payload?.relief ?? 0);
    const mood = Number(payload?.mood ?? 0);
    const newRow = createData(newId, title, stress, relief, mood);
    setRows(prev => [...prev, newRow]);
  };

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: readonly number[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
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

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      [...rows]
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, rows],
  );

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar numSelected={selected.length} selectedDate={selectedDate} onAddClick={handleDialogOpen} />

        {/* Replaced table with editable DataGrid */}
        <div style={{ height: 420, width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={rowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
            onPageSizeChange={(newSize) => setRowsPerPage(newSize)}
            checkboxSelection
            disableSelectionOnClick
            density={dense ? 'compact' : 'standard'}
            onSelectionModelChange={(sel) => setSelected(sel as number[])}
            onCellEditCommit={(params: any) => {
               const id = Number(params.id);
               const field = params.field;
               const value = params.value;
               setRows((prev) =>
                 prev.map((r) =>
                   r.id === id
                     ? {
                         ...r,
                         [field]:
                           field === 'title' ? String(value) : Number(value ?? 0),
                       }
                     : r,
                 ),
               );
             }}
            components={{ Toolbar: undefined }}
          />
        </div>
        {/* DataGrid has built-in pagination handled above */}
      </Paper>

      {/* controlled FormDialog rendered here */}
      <FormDialog open={dialogOpen} onClose={handleDialogClose} onAdd={addNewRow} />

      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      />
    </Box>
  );
}

// Controlled FormDialog (accepts open & onClose)
function FormDialog({ open, onClose, onAdd }: { open: boolean; onClose: () => void; onAdd: (payload: any) => void }) {

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries((formData as any).entries());
    // pass parsed values to add function
    onAdd({
       title: formJson.title as string,
       stress: formJson.stress ? Number(formJson.stress) : 0,
       relief: formJson.relief ? Number(formJson.relief) : 0,
       mood: formJson.mood ? Number(formJson.mood) : 0,
     });
     onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Task</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Enter task details.
        </DialogContentText>
        <form onSubmit={handleSubmit} id="task-form">
          <TextField
            autoFocus
            required
            margin="dense"
            id="title"
            name="title"
            label="Task Title"
            type="text"
            fullWidth
            variant="standard"
          />
          <TextField
            margin="dense"
            id="stress"
            name="stress"
            label="Stress Level"
            type="number"
            fullWidth
            variant="standard"
          />
          <TextField
            margin="dense"
            id="relief"
            name="relief"
            label="Relief Level"
            type="number"
            fullWidth
            variant="standard"
          />
          <TextField
            margin="dense"
            id="mood"
            name="mood"
            label="Mood"
            type="number"
            fullWidth
            variant="standard"
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        {/* submit the form; handleSubmit will call onAdd */}
        <Button type="submit" form="task-form">Add</Button>
      </DialogActions>
    </Dialog>
  );
}

// add columns definition (place close to the component or above return)
const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 70, editable: false },
  { field: 'title', headerName: 'Task', flex: 1, minWidth: 150, editable: true },
  { field: 'stress', headerName: 'Stress Level', type: 'number', width: 140, editable: true },
  { field: 'relief', headerName: 'Relief Level', type: 'number', width: 140, editable: true },
  { field: 'mood', headerName: 'Mood', type: 'number', width: 110, editable: true },
];