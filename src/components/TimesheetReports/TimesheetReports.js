import ReactDOM from 'react-dom';
import { Button, ButtonGroup, Menu, Typography } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import WeekPicker from "../WeekPicker";
import { ArrowBackIosSharp, ArrowDropDown, ArrowForwardIosTwoTone } from "@mui/icons-material";
import { CalendarIcon } from "@mui/x-date-pickers";
import axios from "axios";
import { AuthContext } from "../../App";
import { useTheme } from "@emotion/react";
import { tokens } from "../../themes";
import dayjs from "dayjs";
import PdfGeneration from "./PdfGeneration";
import './PdfGeneration.css'
import { useNavigate } from 'react-router-dom';

const TimesheetReports = () => {
    const { user } = useContext(AuthContext);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate()
  const [value, setValue] = useState(dayjs(new Date()));
  const [fetchManEmpInfo, setfetchManEmpInfo] = useState(null);
  const [fetchEmpTimeEntries, setfetchEmpTimeEntries] = useState([]);
  const [fetchProjectEmpInfo, setfetchProjectEmpInfo] = useState([]);
  const [fetchProjectTimeEntries, setfetchProjectTimeEntries] = useState(null)
  const [selectedstartDate, setselectedstartDate] = useState();
  const [selectedendDate, setselectedendDate] = useState();
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedWeeks, setSelectedWeeks] = useState([]);
  const [selectedProject, setSelectedProject] = useState();
  const [projectNames, setProjectNames] = useState([]);
  const [userNames, setUserNames] = useState([]);
  
  const getManEmpInfo = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/Timesheet/EmployeeManager/Manager/${user.userId}`
      );
      console.log(response.data)
      setfetchManEmpInfo(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  
  useEffect(() => {
    getManEmpInfo();
  }, []);

  {/*useEffect(() => {
    const fetchData = async () => {
      handleWeekPickerChange(new Date().toString());
    };
    fetchData();
  }, []);
*/}


useEffect(() => {
  getProjectInfo();
}, [fetchManEmpInfo]);

useEffect(() => {
  // Initialize sets to store unique values
  const uniqueProjectNames = new Set();
  const uniqueUserNames = new Set();

  fetchProjectEmpInfo?.forEach((row) => {
    uniqueProjectNames.add(row.project.projectName);
  });

  fetchManEmpInfo?.forEach((row) => {
      uniqueUserNames.add(row.user1.firstname + " " + row.user1.lastname);
  })

  // Convert sets to arrays and update state
  setProjectNames(Array.from(uniqueProjectNames));
  setUserNames(Array.from(uniqueUserNames));
}, [fetchProjectEmpInfo]);



  const getProjectInfo = async () => {
    try {
        const fetchData = fetchManEmpInfo?.map(async (item) => {
            const response = await axios.get(
              `http://localhost:8080/Timesheet/ProjectEmployee/user/${item.user1.userId}`
            );
            return response.data;
          });

          const responseData = await Promise.all(fetchData);
          const combinedData = responseData.flat(); // Flatten the array
          console.log(combinedData);
          setfetchProjectEmpInfo(combinedData);
    } catch(error) {
        console.log(error)
    }
  }

  const getPrevProjectTimeEntries = async (empId, startDate, endDate) => {
    const queryString = `?projectEmployeeId=${empId}&userId=${user.userId}&startDate=${startDate}&endDate=${endDate}`
    console.log(queryString)
    try {
      const response = await axios.get(`http://localhost:8080/Timesheet/customdate${queryString}`);
      console.log(response)
      const newArray = []
      while (startDate <= endDate) {
        const existingEntry = response.data?.find(entry => entry.date === startDate);
        if (existingEntry) {
          // Use the existing entry
          newArray.push(existingEntry);
        } else {
          // Create a new entry
          newArray.push({
            projectEmployee: {
              empID: empId,
            },
            user: {
              userId: user.userId,
            },
            date: startDate,
            minutes: "",
            task: ""
          });
        }
        let dateObject = new Date(startDate);
        dateObject.setDate(dateObject.getDate() + 1);

        // Use toLocaleDateString to get the updated date in "yyyy-mm-dd" format
        let updatedDate = dateObject.toLocaleDateString('en-CA');
        startDate = updatedDate
        console.log(startDate)
      }
      setfetchProjectTimeEntries(newArray)

    } catch (error) {
      console.log("Error fetching User data:", error);
    }
  }

  const getPrevProjectTimeEntries1 = async () => {
    try {
      const entries = await Promise.all(
        selectedWeeks.map(async (week) => {
          const weekEntries = await Promise.all(
            fetchManEmpInfo.map(async (users) => {
              const queryString = `?userId=${users.user1.userId}&startdate=${week.start}&enddate=${week.end}`;
              const response = await axios.get(
                `http://localhost:8080/Timesheet/EmployeeTimeentries/Customdate${queryString}`
              );
              return response.data; // Assuming the response data is what you want to save
            })
          );
  
          return weekEntries;
        })
      );
        console.log(entries)
      setfetchEmpTimeEntries(entries);
    } catch (error) {
      console.log("Error in getPrevProjectTimeEntries", error);
    }
  };
  

  const handleWeekPickerChange = async (newValue) => {
    setValue(newValue);
    const currentDate = new Date(newValue);
    const startDate = new Date(currentDate);
    startDate.setDate(startDate.getDate() - startDate.getDay()); // Start of the week (Sunday)

    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 6); // End of the week (Saturday)

    const startDateFormatted = startDate.toISOString().split("T")[0];
    const endDateFormatted = endDate.toISOString().split("T")[0];
    console.log("Updating startDate and endDate states");
    setselectedstartDate(() => startDateFormatted);
    setselectedendDate(() => endDateFormatted);
    handleSelectWeeks(startDateFormatted, endDateFormatted)
    // Run getManEmpInfo only once
    await getManEmpInfo();

    console.log("End handleWeekPickerChange");
  }

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleRemoveWeek = (index) => {
    setSelectedWeeks((prevSelectedWeeks) =>
      prevSelectedWeeks.filter((week, i) => i !== index)
    );
  };

  console.log(selectedWeeks)
  const handleSelectWeeks = (start, end) => {
    const newWeek = { start, end };

    // Check if the week already exists
    const isWeekExists = selectedWeeks.some(
      (week) => week.start === start && week.end === end
    );

    if (!isWeekExists) {
      setSelectedWeeks((prevSelectedWeeks) => {
        // Add the new week and sort the weeks in ascending order based on start date
        const updatedWeeks = [...prevSelectedWeeks, newWeek].sort(
          (a, b) => new Date(a.start) - new Date(b.start)
        );

        return updatedWeeks;
      });
    }
  };

  const handleGenerateReport = () => {
    navigate('/generateReport', { state: {
      data:  fetchManEmpInfo 
    }})
  };

  return (
    <div>
      <Typography variant="h2">Timesheet Reports</Typography>
      <p>Select week</p>
      <ButtonGroup
        variant="text"
        size="medium"
        sx={{ backgroundColor: colors.blueAccent[400] }}
      >
        <Button>
          <ArrowBackIosSharp />
        </Button>
        <Button onClick={handleClick}>
          <CalendarIcon />
          <ArrowDropDown />
        </Button>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          <WeekPicker onValueChange={handleWeekPickerChange}/>
        </Menu>
        <Button>
          <ArrowForwardIosTwoTone />
        </Button>
      </ButtonGroup>


      <div>
        <Typography variant="h4">Selected Weeks:</Typography>
        <ul>
          {selectedWeeks.map((week, index) => (
            <li key={index}>
              {`Week ${index + 1}: ${week.start} to ${week.end}`}
              <Button variant="outlined" color="error" onClick={() => handleRemoveWeek(index)}>
                Remove Week
              </Button>
            </li>
          ))}
        </ul>
      </div>

      <select
          className="p-2 bg-slate-200 border border-transparent rounded-md focus:outline-none focus:border-gray-900 focus:bg-white"
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
        >
          <option value="">Filter by Project</option>
          {projectNames.map((name, index) => (
            <option key={index} value={name}>
              {name}
            </option>
          ))}
        </select>

        <select
          className="p-2 bg-slate-200 border border-transparent rounded-md focus:outline-none focus:border-gray-900 focus:bg-white"
          //value={filters.fullName}
          //onChange={(e) => handleFilterChange("fullName", e.target.value)}
        >
          <option value="">Filter by Name</option>
          {userNames.map((name, index) => (
            <option key={index} value={name}>
              {name}
            </option>
          ))}
        </select>

        <Button onClick={handleGenerateReport} variant="contained" color="primary">
        Generate Report
      </Button>
      <Button onClick={getPrevProjectTimeEntries1}>fetch</Button>
      
    </div>
  );
};

export default TimesheetReports;
