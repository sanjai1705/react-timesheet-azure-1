import React from 'react';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const dateRanges = [
  { startDate: '01/01/2023', endDate: '10/01/2023' },
  { startDate: '11/01/2023', endDate: '20/01/2023' },
  { startDate: '21/01/2023', endDate: '30/01/2023' },
  { startDate: '31/01/2023', endDate: '09/02/2023' },
  { startDate: '10/02/2023', endDate: '19/02/2023' },
  { startDate: '20/02/2023', endDate: '01/03/2023' },
  { startDate: '02/03/2023', endDate: '11/03/2023' },
  { startDate: '12/03/2023', endDate: '21/03/2023' },
  { startDate: '22/03/2023', endDate: '31/03/2023' },
  { startDate: '01/04/2023', endDate: '10/04/2023' },
  { startDate: '11/04/2023', endDate: '20/04/2023' },
  { startDate: '21/04/2023', endDate: '30/04/2023' },
  { startDate: '01/05/2023', endDate: '10/05/2023' },
  { startDate: '11/05/2023', endDate: '20/05/2023' },
  { startDate: '21/05/2023', endDate: '30/05/2023' },
  { startDate: '31/05/2023', endDate: '09/06/2023' },
  { startDate: '10/06/2023', endDate: '19/06/2023' },
  { startDate: '20/06/2023', endDate: '30/06/2023' },
  { startDate: '01/07/2023', endDate: '10/07/2023' },
  { startDate: '11/07/2023', endDate: '20/07/2023' },
  { startDate: '21/07/2023', endDate: '30/07/2023' },
  { startDate: '31/07/2023', endDate: '09/08/2023' },
  { startDate: '10/08/2023', endDate: '19/08/2023' },
  { startDate: '20/08/2023', endDate: '29/08/2023' },
  { startDate: '30/08/2023', endDate: '08/09/2023' },
  { startDate: '09/09/2023', endDate: '18/09/2023' },
  { startDate: '19/09/2023', endDate: '28/09/2023' },
  { startDate: '29/09/2023', endDate: '08/10/2023' },
  { startDate: '09/10/2023', endDate: '18/10/2023' },
  { startDate: '19/10/2023', endDate: '28/10/2023' },
  { startDate: '29/10/2023', endDate: '07/11/2023' },
  { startDate: '08/11/2023', endDate: '17/11/2023' },
  { startDate: '18/11/2023', endDate: '27/11/2023' },
  { startDate: '28/11/2023', endDate: '07/12/2023' },
  { startDate: '08/12/2023', endDate: '17/12/2023' },
  { startDate: '18/12/2023', endDate: '27/12/2023' },
  { startDate: '28/12/2023', endDate: '31/12/2023' }
]


function isDateInRange(date, range) {
  const startDate = dayjs(range.startDate, 'DD/MM/YYYY');
  const endDate = dayjs(range.endDate, 'DD/MM/YYYY');
  return date.isSame(startDate) || (date.isAfter(startDate) && date.isBefore(endDate));
}


function MyCalendar() {
  const [selectedDate, setSelectedDate] = React.useState(null);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const isDateDisabled = (date) => {
    return !dateRanges.some((range) => isDateInRange(date, range));
  };
  
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        value={selectedDate}
        onChange={handleDateChange}
        renderInput={(params) => <TextField {...params} label="Select Date" />}
        shouldDisableDate={(date) => isDateDisabled(dayjs(date))}
      />
    </LocalizationProvider>
  );
}

export default MyCalendar;
