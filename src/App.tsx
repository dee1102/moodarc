import CalendarComponent from "./CalendarComponent";
import TaskComponent from "./TaskComponent";
import ChartComponent from "./ChartComponent";

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { useState } from 'react';
import dayjs from "dayjs";
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';

// MUI layout primitives
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';

function App() {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [tasks, setTasks] = useState();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* full-screen center + responsive container */}
      <Box
        sx={{
          minHeight: '100vh',         // full viewport height
          display: 'flex',
          alignItems: 'center',       // vertical center
          justifyContent: 'center',   // horizontal center
          bgcolor: 'background.default',
          px: 2,                      // small horizontal padding on very small screens
          py: 6,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={3} justifyContent="center" alignItems="flex-start">
            {/* calendar column - full width on xs, ~1/3 on md+ */}
            <Grid item xs={12} md={4} lg={3}>
              <CalendarComponent selectedDateState={(newValue) => setSelectedDate(newValue)} />
            </Grid>

            {/* main content column - full width on xs, takes rest on md+ */}
            <Grid item xs={12} md={8} lg={9}>
              <TaskComponent selectedDate={selectedDate} tasksState={(newValue) => setTasks(newValue)} />
            </Grid>
          </Grid>
          {/* chart row - full width */}
            <Grid item xs={12}>
              <ChartComponent selectedDate={selectedDate} tasks={tasks} />
            </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  )
}

export default App;