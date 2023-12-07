import React, { useContext, useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Typography,
  useTheme,
  MenuItem,
  IconButton,
  ButtonGroup,
  Menu,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { tokens } from '../../themes'
import axios from 'axios';
import { ArrowBackIosSharp, ArrowDropDown, ArrowForwardIosTwoTone, DeleteForeverOutlined } from '@mui/icons-material';
import { AuthContext } from '../../App';
import { CalendarIcon, DateCalendar } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import { mockprojectData } from '../../data/mockData';


const DayWiseTimeentries = () => {
    
  const { user, logout } = useContext(AuthContext);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [value, setValue] = React.useState(dayjs(new Date()));
  const [fetchTimeEntries, setfetchTimeEntries] = useState(null);
  const [fetchProjects, setfetchProjects] = useState([]);
  const [newEntry, setNewEntry] = useState({
        user: {
          userId: user.userId
        },
        date: '',
        projectEmployee: {
            empID: '',
        },
        login: '',
        logout: '',
  });

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const addEntries = async (event) => {
    event.preventDefault();
    console.log(newEntry)
    if (newEntry.login < newEntry.logout) {
      if (newEntry.date && newEntry.login && newEntry.logout) {
        try {
          const response = await axios.post("https://springboot-timesheet-azure.azurewebsites.net/Timesheet/EmployeeTimeentries/Create",newEntry);
          if (response.data !== "Not Saved") {
            console.log("Entry added successfully:", response.data);
            console.log(response);
            alert("Entry added successfully");
            setfetchTimeEntries((prevData) => {
              const newData = [newEntry, ...prevData];
              return newData;
            });
          } else {
            console.log("Entry Not Saved", response.data);
            console.log(response);
            alert("Time for that specific date is overlapping");
          }
        } catch (error) {
          // Handle errors, e.g., show an error message, log the error, etc.
          console.error("Error adding entry:", error);
        }
        setNewEntry({
          user: {
            userId: user.userId,
          },
          date: '',
          projectEmployee: {
            empID: '',
          },
          login: '',
          logout: '', 
        });
      } else {
        alert("no minutes");
      }
    } else {
      alert(
        "Logout time is less than or equal to login time. Please check the time"
      );
    }
  };

   useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(`https://springboot-timesheet-azure.azurewebsites.net/Timesheet/EmployeeTimeentries/user/${user.userId}`);
        console.log(response)
        setfetchTimeEntries(response.data)
    } catch (error) {
        console.log("Error fetching User data:", error);
      }
    }
    getData();
  }, [user.userId]);
  
  useEffect(() => {
    const getProjects = async () => {
        try {
            // First API call
            const response1 = await axios.get(`https://springboot-timesheet-azure.azurewebsites.net/Timesheet/ProjectEmployee/user/${user.userId}`);
            console.log(response1);
            const projects1 = response1.data.map((item) => ({
                empID: item.empID,
                projectName: item.project.projectName,
            }))

            // Second API call
            const response2 = await axios.get(`https://springboot-timesheet-azure.azurewebsites.net/Timesheet/Project/applicable?applicable=true`);
            console.log(response2);
            const projects2 = response2.data.map((item) => ({
                empID: item.projectId,
                projectName: item.projectName,
            }));
            
            const uniqueProjects = Array.from(new Set([...projects1, ...projects2]), project => JSON.stringify(project));
            setfetchProjects(uniqueProjects.map(project => JSON.parse(project)));

        } catch (error) {
            console.log("Error fetching Project data:", error);
        }
    };

    getProjects();
}, [user.userId]);

  
  console.log(fetchTimeEntries)
  console.log(fetchProjects)

  const handleDelete = async (timesheetId) => {
    try {
      const response = await axios.delete(`https://springboot-timesheet-azure.azurewebsites.net/Timesheet/EmployeeTimeentries/Delete/${timesheetId}`);
      setfetchTimeEntries((prevData) => {
        const newData = prevData.filter((item) => item.timesheetId !== timesheetId); // Remove the deleted entry from the array
        return newData;
      });
      if(response) {
        alert('Deleted Successfully')
      }
  } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  
  return (
    <div>
      <ButtonGroup size="medium" aria-label="large button group" sx={{backgroundColor: colors.blueAccent[300]}}>
        <Button key="one"><ArrowBackIosSharp/></Button>
        <Button key="two" onClick={handleClick}><CalendarIcon/><ArrowDropDown/>
        </Button>
        <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateCalendar displayWeekNumber
          label="Controlled picker"
          value={value}
          onChange={(newValue) => setValue(newValue)}
          sx={{fontSize: '300px'}}
        />
        <Button variant="contained" onClick={()=>setValue(dayjs(new Date()))}>Today</Button>
      </LocalizationProvider>
      </Menu>
      {console.log(value)}
        <Button key="three"><ArrowForwardIosTwoTone/></Button>
      </ButtonGroup>
      <Typography variant='h2'>{value.$d.toDateString()}</Typography>

      <form className="flex justify-around items-center py-10 mb-10" style={{ backgroundColor: colors.primary[900] }} onSubmit={addEntries}>
        <div>
          <h1>Employee Id</h1>
          <TextField
            disabled
            required
            variant="filled"
            placeholder="Employee ID"
            value={user.userId}
            onChange={(e) => setNewEntry({ ...newEntry, userId: e.target.value })}
          />
        </div>

        <div>
          <h1>ProjectEmp Id</h1>
          <TextField
            required
            variant="filled"
            select
            value={newEntry.projectEmployee.empID}
            helperText={!newEntry.projectEmployee.empID && 'Select a Project'}
            onChange={(e) =>
              setNewEntry({
                ...newEntry,
                projectEmployee: {
                  ...newEntry.projectEmployee,
                  empID: e.target.value,
                },
              })}
              >
            {mockprojectData?.map((option) => (
              <MenuItem key={option.empID} value={option.empID}>
                {option.empID + " - " + option.projectName}
              </MenuItem>
            ))}
          </TextField>
        </div>

        

        <div>
          <h1>Login Time</h1>
          <TextField
            required
            variant="filled"
            type="time"
            value={newEntry.login}
            onChange={(e) =>
              setNewEntry({ ...newEntry, login: e.target.value })
            }
          />
        </div>

        <div>
          <h1>Logout Time</h1>
          <TextField
            required
            variant="filled"
            type="time"
            value={newEntry.logout}
            onChange={(e) =>
              setNewEntry({ ...newEntry, logout: e.target.value })
            }
          />
        </div>

        <button
        type='submit'
        style={{
          position: 'relative',
          width: '8rem',
          height: '3rem',
          border: 'none',
          background: "#292929",
          color: 'white',
          padding: '1em',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          transition: '0.2s',
          borderRadius: '5px',
          opacity: '0.8',
          letterSpacing: '1px',
          boxShadow: `${colors.primary[200]} 0px 7px 2px, #000 0px 8px 5px`,
        }}
        onMouseEnter={(e) => {
          e.target.style.opacity = '1';
        }}
        onMouseLeave={(e) => {
          e.target.style.opacity = '0.8';
        }}
        onMouseDown={(e) => {
          e.target.style.top = '4px';
          e.target.style.boxShadow = `${colors.primary[200]} 0px 3px 2px, #000 0px 3px 5px`;
        }}
        onMouseUp={(e) => {
          e.target.style.top = '0';
          e.target.style.boxShadow = `${colors.primary[200]} 0px 7px 2px, #000 0px 8px 5px`;
        }}
    >
      Add Entry
    </button>
      </form>
      <TableContainer
        className="relative my-0 mx-auto"
        sx={{ width: "95%" }}
        component={Paper}
      >
        <Table>
          <TableHead sx={{ backgroundColor: colors.grey[700] }}>
            <TableRow>
              <TableCell>Project Employee Id</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Login Time</TableCell>
              <TableCell>Logout Time</TableCell>
              <TableCell>Minutes</TableCell>
              <TableCell>Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody >
          {fetchTimeEntries &&
            (fetchTimeEntries.slice().reverse().map((item) => (
              <TableRow key={item.timesheetId}>
                <TableCell>{item.projectEmployee.empID}</TableCell>
                <TableCell>{item.date}</TableCell>
                <TableCell>{item.login}</TableCell>
                <TableCell>{item.logout}</TableCell>
                <TableCell>{item.minutes}</TableCell> 
                <TableCell>
                {item.status == 'null' &&

                  <IconButton sx={{color: colors.redAccent[400], padding: '3px'}} onClick={()=>handleDelete(item.timesheetId)}>
                    <DeleteForeverOutlined/>
                    </IconButton>
                  }
                </TableCell>
              </TableRow>
            )))
          }
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default DayWiseTimeentries
