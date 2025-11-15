import CalendarComponent from "./CalendarComponent";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import TaskComponent from "./TaskComponent";


import { useState } from 'react';
import dayjs from "dayjs";


function App() {
  const [selectedDate, setSelectedDate] = useState(dayjs());

  return (
    // <div className="rowC">
    //   <CalendarComponent selectedDateState={(newValue) => setSelectedDate(newValue)} />
    //   <TaskComponent selectedDate={selectedDate}/>
    // </div>
    <div style={{ display: 'flex', flexDirection: 'row', gap: 16, alignItems: 'flex-start' }}>
      <div style={{ width: 360 /* or desired calendar width */ }}>
        <CalendarComponent selectedDateState={(newValue) => setSelectedDate(newValue)} />
      </div>
      <div style={{ flex: 1 }}>
        <TaskComponent selectedDate={selectedDate}/>
      </div>
    </div>
  )
}

export default App;