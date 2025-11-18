// PascalCase - react
import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';

export default function CalendarComponent({ selectedDateState }) {
  const [selectedDate, _] = React.useState<Dayjs | null>(dayjs());

  return (
    <div>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateCalendar showDaysOutsideCurrentMonth value={selectedDate} onChange={(newValue) => { selectedDateState(newValue)}} />
        </LocalizationProvider>
    </div>
  );
}