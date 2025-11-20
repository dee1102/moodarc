import dayjs from 'dayjs';
import * as React from 'react';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
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
];

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

export default function TaskComponent({selectedDate, tasksState}) {
  const [selected, setSelected] = React.useState<readonly number[]>([]);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [rows, setRows] = React.useState(() => {
    // load from localStorage based on selectedDate
    const datesAndTasks = localStorage.getItem('datesAndTasks') ? JSON.parse(localStorage.getItem('datesAndTasks')!) : [];
    const existingEntry = datesAndTasks.find((obj: any) => obj.date === selectedDate.format('YYYY-MM-DD'));
    return existingEntry ? existingEntry.tasks : initialRows;
  });

  // dialog state for the add form
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const handleDialogOpen = () => setDialogOpen(true);
  const handleDialogClose = () => setDialogOpen(false);

  React.useEffect(() => {
      var datesAndTasks = localStorage.getItem('datesAndTasks') ? JSON.parse(localStorage.getItem('datesAndTasks')!) : [];
      const existingEntryIndex = datesAndTasks.findIndex((obj: any) => obj.date === selectedDate.format('YYYY-MM-DD'));
      if (existingEntryIndex !== -1) {
          // Update existing entry
          datesAndTasks[existingEntryIndex].tasks = rows;
      } else {
          // Add new entry
          datesAndTasks.push({ date: selectedDate.format('YYYY-MM-DD'), tasks: rows });
      }
      localStorage.setItem('datesAndTasks', JSON.stringify(datesAndTasks));
  }, [rows]);

  React.useEffect(() => {
      // load tasks for the new selectedDate
      var datesAndTasks = localStorage.getItem('datesAndTasks') ? JSON.parse(localStorage.getItem('datesAndTasks')!) : [];
      const existingEntry = datesAndTasks.find((obj: any) => obj.date === selectedDate.format('YYYY-MM-DD'));
      setRows(existingEntry ? existingEntry.tasks : initialRows);
  }, [selectedDate]);

  const addNewRow = (payload?: { title?: string; stress?: number | string; relief?: number | string; mood?: number | string; }) => {
    const newId = rows.length + 1;
    const title = payload?.title ?? `New Task ${newId}`;
    const stress = Number(payload?.stress ?? 0);
    const relief = Number(payload?.relief ?? 0);
    const mood = Number(payload?.mood ?? 0);
    const newRow = createData(newId, title, stress, relief, mood);
    const updatedRows = [...rows, newRow];
    setRows(updatedRows);
    tasksState(rows); // update parent state
  };

  const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked);
  };

  return (
    <Box>
      <Paper>
        <EnhancedTableToolbar numSelected={selected.length} selectedDate={selectedDate} onAddClick={handleDialogOpen} />

        {/* Replaced table with editable DataGrid */}
        <div>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={rowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
            onPageSizeChange={(newSize) => setRowsPerPage(newSize)}
            checkboxSelection
            disableSelectionOnClick
            density={dense ? 'compact' : 'standard'}
            // onSelectionModelChange={(sel) => setSelected(sel as number[])}
            processRowUpdate={async (newRow, oldRow) => {
              console.log(newRow);
              rows.find((r) => r.id === newRow.id)!.title = newRow.title;
              rows.find((r) => r.id === newRow.id)!.stress = newRow.stress;
              rows.find((r) => r.id === newRow.id)!.relief = newRow.relief;
              rows.find((r) => r.id === newRow.id)!.mood = newRow.mood;
              setRows([...rows]);
              tasksState(rows);
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