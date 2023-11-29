import { Button, Card, Container, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow, Typography } from '@mui/material'
import { useContext, useState } from "react";
import dayjs from 'dayjs';
import { styled } from '@mui/material/styles';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import axios from 'axios';
import { AuthContext } from '../../App';
import { useTheme } from '@emotion/react';
import { tokens } from '../../themes';
import emailjs from '@emailjs/browser';

  const CustomPickersDay = styled(PickersDay, {
    shouldForwardProp: (prop) => prop !== 'isSelected' && prop !== 'isHovered',
  })(({ theme, isSelected, isHovered, day }) => ({
    borderRadius: 0,
    ...(isSelected && {
      backgroundColor: theme.palette.secondary.main,
      color: theme.palette.primary.contrastText,
      '&:hover, &:focus': {
        backgroundColor: theme.palette.secondary.main,
      },
    }),
    ...(isHovered && {
      backgroundColor: theme.palette.primary[theme.palette.mode],
      '&:hover, &:focus': {
        backgroundColor: theme.palette.primary[theme.palette.mode],
      },
    }),
    ...(day.day() === 0 && {
      borderTopLeftRadius: '50%',
      borderBottomLeftRadius: '50%',
    }),
    ...(day.day() === 6 && {
      borderTopRightRadius: '50%',
      borderBottomRightRadius: '50%',
    }),
  }));
  
  const isInSameWeek = (dayA, dayB) => {
    if (dayB == null) {
      return false;
    }
  
    return dayA.isSame(dayB, 'week');
  };
  
  function Day(props) {
    const { day, selectedDay, hoveredDay, ...other } = props;
    return (
      <CustomPickersDay
        {...other}
        day={day}
        sx={{ px: 2.5 }}
        disableMargin
        selected={false}
        isSelected={isInSameWeek(day, selectedDay)}
        isHovered={isInSameWeek(day, hoveredDay)}
      />
    );
  }
  
  function getStartAndEndDateOfWeek(date) {
    const currentDate = new Date(date);
    const startDate = new Date(currentDate);
    startDate.setDate(startDate.getDate() - startDate.getDay()); // Start of the week (Sunday)
    
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 6); // End of the week (Saturday)
    
    const startDateFormatted = startDate.toISOString().split('T')[0];
    const endDateFormatted = endDate.toISOString().split('T')[0];

    return { startDate: startDateFormatted, endDate: endDateFormatted };
  }
  

const ViewTimesheet = () => {
  const {user} = useContext(AuthContext)
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [hoveredDay, setHoveredDay] = useState(null);
  const [value, setValue] = useState(dayjs(new Date()));
  const [fetchDayWiseData, setfetchDayWiseData] = useState(null)
  const [selectedstartDate, setselectedstartDate] = useState();
  const [selectedendDate, setselectedendDate] = useState();
  let totalWorkingHours = 0

  const handleclick= async (value, userId)=> {
    const { startDate, endDate } = getStartAndEndDateOfWeek(value);
    setselectedstartDate(startDate);
    setselectedendDate(endDate);
    console.log(`Start date of the week: ${startDate}`);
    console.log(`End date of the week: ${endDate}`);
    const queryString = `?userId=${userId}&startdate=${startDate}&enddate=${endDate}`;

      try{
        await axios.get(`http://localhost:8080/Timesheet/DaywiseTimesheet/Customdate${queryString}`)
          .then((response) => {
            console.log('Response from backend:', response.data);
            setfetchDayWiseData(response.data)
            
          })
         } catch(error) {
            console.error('Error sending data to backend:', error);
          };
  }

  console.log(fetchDayWiseData)

  const hasPending = fetchDayWiseData?.some((item) => item.status === null);

  const handleSubmit = async(value) => {
    const { startDate, endDate } = getStartAndEndDateOfWeek(value);
    console.log(`Start date of the week: ${startDate}`);
    console.log(`End date of the week: ${endDate}`);
    const queryString = `?userId=${user.userId}&startdate=${startDate}&enddate=${endDate}`;
    try {
      const response = await axios.post(`http://localhost:8080/Timesheet/DaywiseTimesheet/submit${queryString}`)
      console.log(response)
      let message = {
        username: user.username,
        startDate: selectedstartDate,
        endDate: selectedendDate,
      }
        emailjs.send('service_mp5a3np', 'template_fd2ks9b', message, 'wbNaL4zlK2L-31W4-')
        .then((result) => {
            console.log(result.text);
        }, (error) => {
            console.log(error.text);
        });
    } catch(error) {
      console.error('Error fetching data to backend:', error);
    };
  }

  return (
    <>
      <div>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateCalendar
          sx={{
            backgroundColor:  colors.grey[900]
          }}
            value={value}
            onChange={(newValue) => {
              setValue(newValue);
              handleclick(newValue, user.userId);
            }}
            showDaysOutsideCurrentMonth
            displayWeekNumber
            slots={{ day: Day }}
            slotProps={{
              day: (ownerState) => ({
                selectedDay: value,
                hoveredDay,
                onPointerEnter: () => setHoveredDay(ownerState.day),
                onPointerLeave: () => setHoveredDay(null),
              }),
            }}
          />
        </LocalizationProvider>
      </div>
      <div>
        <Container className='my-4'>
          <Typography variant="h4" className="my-4">
            Day-wise Time Entries
          </Typography>
          <TableContainer
            className="relative my-0 mx-auto"
            sx={{ width: "95%" }}
            component={Paper}
          >
            <Table>
              <TableHead sx={{ backgroundColor: colors.grey[700] }}>
                <TableRow>
                  <TableCell>User Id</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Working Hours</TableCell>
                  <TableCell>Overtime</TableCell>
                  <TableCell>Total Working Hours</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {fetchDayWiseData?.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.user.userId}</TableCell>
                    <TableCell>{item.date}</TableCell>
                    <TableCell>{item.workingHours}</TableCell>
                    <TableCell>{item.overtime}</TableCell>
                    <TableCell>{item.totalWorkingHours}</TableCell>
                    <TableCell>{item.status}</TableCell>
                  </TableRow>
                ))}
                
              </TableBody>
              <TableFooter>
                {fetchDayWiseData != null ? (
                  hasPending ? (
                    <Button sx={{ color: "red" }} onClick={()=>{handleSubmit(value)}}>Submit For Approval</Button>
                  ) : (
                    <Button sx={{ color: "green", pointerEvents: "none" }}>
                      Submitted
                    </Button>
                  )
                ) : null}
                {fetchDayWiseData?.map((item) => {
                  totalWorkingHours += item.totalWorkingHours
                })}
                {totalWorkingHours!=0 &&<Typography variant='h5'>Total Working Hours for the Week: {totalWorkingHours}</Typography>}
              </TableFooter>
            </Table>
          </TableContainer>
          
        </Container>
      </div>
    </>
  );
}

export default ViewTimesheet
