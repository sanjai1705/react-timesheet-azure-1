import { Button, Divider, IconButton, Menu, Typography } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import WeekPicker from "../WeekPicker";
import { ArrowDropDown, Close } from "@mui/icons-material";
import { CalendarIcon } from "@mui/x-date-pickers";
import axios from "axios";
import { AuthContext } from "../../App";
import { useTheme } from "@emotion/react";
import { tokens } from "../../themes";
import dayjs from "dayjs";
import PdfGeneration from "./PdfGeneration";
import './PdfGeneration.css'
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../../apiConfig';
import NameMenuButton from "../../scenes/global/NameMenuButton";

const TimesheetReports = () => {
    const { user } = useContext(AuthContext);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate()
  const [value, setValue] = useState(dayjs(new Date()));
  const [fetchClientInfo, setfetchClientInfo] = useState(null);
  const [fetchClientTimeEntries, setfetchClientTimeEntries] = useState(null)
  const [selectedstartDate, setselectedstartDate] = useState();
  const [selectedendDate, setselectedendDate] = useState();
  const [selectedWeeks, setSelectedWeeks] = useState([]);
  const [selectedProject, setSelectedProject] = useState();
  const [selectedName, setselectedName] = useState()
  const [selectedClient, setselectedClient] = useState()
  const [projectNames, setProjectNames] = useState([]);
  const [userNames, setUserNames] = useState([]);
  const [timeEntries, settimeEntries] = useState([]);

  {/*useEffect(() => {
    const fetchData = async () => {
      handleWeekPickerChange(new Date().toString());
    };
    fetchData();
  }, []);
*/}

{/*
useEffect(() => {
  if (fetchProjectEmpInfo?.length > 0 && fetchManEmpInfo?.length > 0) {
    // Initialize sets to store unique values
    const uniqueProjectNames = new Set();
    const uniqueUserNames = new Set();
    //const uniqueDates = new Set();

    // Iterate over fetchManEmpInfo to extract unique values
    fetchManEmpInfo?.forEach((row) => {
      //uniqueProjectNames.add(row.projectEmployee.project.projectName);
      if (row.role.roleName === "Employee") {
        uniqueUserNames.add(row.firstname + " " + row.lastname);
      }

      //uniqueDates.add(row.date);
    });

    fetchProjectEmpInfo?.forEach((row) => {
      uniqueProjectNames.add(row.projectName);
    });

    // Convert sets to arrays and update state
    setProjectNames(Array.from(uniqueProjectNames));
    setUserNames(Array.from(uniqueUserNames));
    // Convert set of dates to array, sort in ascending order, and update state
    //setDates(Array.from(uniqueDates).sort((a, b) => new Date(a) - new Date(b)));
  }
}, [fetchProjectEmpInfo, fetchManEmpInfo]);
*/}


useEffect(() => {
  getClientInfo();
}, []);

useEffect(() => {
  if(selectedClient) getTimeentriesClient()
}, [selectedClient])

const getClientInfo = async() => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/ClientTable`
    );
    setfetchClientInfo(response.data);
    //console.log(response.data);
  } catch (error) {
    console.log(error);
  }
}

const getTimeentriesClient = async() => {
  settimeEntries([])
  try {
   const entries = await Promise.all(
    selectedWeeks.map(async(week) => {
      const queryString = `project-employee-timeentries?startDate=${week.start}&endDate=${week.end}`
      const response = await axios.get(`${API_BASE_URL}/client/${selectedClient}/${queryString}`)
      console.log(response.data)
      const filteredAndSortedTimeEntries = response.data.employeeTimeentries
          .filter(entry => entry.status === 'Approved')
          .sort((a, b) => new Date(a.date) - new Date(b.date));

        // Return the modified object
        return {
          ...response.data,
          employeeTimeentries: filteredAndSortedTimeEntries
        };
      })
    );
    console.log(entries)
    
    setfetchClientTimeEntries(entries)
  } catch(error) {
    console.log(error)
  }
}


useEffect(()=> {
  if(fetchClientTimeEntries != null) {
    setProjectNames(fetchClientTimeEntries[0]?.projects)            //Since all the rows return the same projects and usernames
    setUserNames(fetchClientTimeEntries[0]?.projectEmployees)
    const filteredEntries = []
    fetchClientTimeEntries?.forEach(item => {
      filteredEntries.push(item.employeeTimeentries);
  });
  settimeEntries(filteredEntries)
  }
}, [fetchClientTimeEntries])

  useEffect(() => {
    if(timeEntries?.length > 0) {
      filterTimeEntriesByProject()
    }
  }, [selectedProject])

  useEffect(() => {
    if(timeEntries?.length > 0) {
      filterTimeEntriesByName()
    }
  }, [selectedName])
  
  const filterTimeEntriesByProject = () => {
    if (selectedProject !== "") {
    const filteredEntries = []
    fetchClientTimeEntries?.forEach(item => {
      const isTimeEntryApproved = item.employeeTimeentries.filter((entry) => ((entry.projectEmployee.project.projectId == selectedProject) && (entry.status == 'Approved')));
      filteredEntries.push(isTimeEntryApproved);
    
  });
    settimeEntries(filteredEntries);

    setUserNames(
      fetchClientTimeEntries[0]?.projectEmployees.filter((item) => (item.project.projectId == selectedProject))
      )
  }
};

const filterTimeEntriesByName = () => {
  if ((selectedProject !== "") && (selectedName !== "")) {
    const filteredEntries = []
    fetchClientTimeEntries?.forEach(item => {
      const isTimeEntryApproved = item.employeeTimeentries.filter((entry) => ((entry.projectEmployee.project.projectId == selectedProject) && (entry.user.userId == selectedName) && (entry.status == 'Approved')));
      filteredEntries.push(isTimeEntryApproved);
    
  });
  settimeEntries(filteredEntries);
}
}


  const handleWeekPickerChange = async (newValue) => {
    setValue(newValue);
    const currentDate = new Date(newValue);
    const startDate = new Date(currentDate);
    startDate.setDate(startDate.getDate() - startDate.getDay()); // Start of the week (Sunday)

    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 6); // End of the week (Saturday)

    const startDateFormatted = startDate.toLocaleDateString('en-CA');
    const endDateFormatted = endDate.toLocaleDateString('en-CA');
    console.log("Updating startDate and endDate states");
    setselectedstartDate(() => startDateFormatted);
    setselectedendDate(() => endDateFormatted);
    handleSelectWeeks(startDateFormatted, endDateFormatted)
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
    settimeEntries((prevTimeentries) =>  prevTimeentries.filter((week,i) => i !== index))
  };

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
    navigate('/generatereport', { state: {timeentries: timeEntries, selectedWeeks: selectedWeeks, userNames: userNames} })
  };
  console.log(fetchClientTimeEntries)
  console.log(timeEntries)

  return (
    <div className="container px-10 flex flex-col mt-5 items-right gap-5 justify-center">
      <div className="flex justify-between align-top">
        <Typography variant="h2">Timesheet Reports</Typography>
        <NameMenuButton />
      </div>
      <div className="flex flex-col">
        <div className="flex flex-wrap gap-1">
          <div>
            <Typography variant="h4">Select Week</Typography>
            <div className="flex items-center gap-2">
              <Button
                sx={{ backgroundColor: colors.blueAccent[600] }}
                onClick={handleClick}
              >
                <CalendarIcon />
                <ArrowDropDown />
              </Button>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
              >
                <WeekPicker onValueChange={handleWeekPickerChange} />
              </Menu>
              <ul className="flex flex-wrap gap-1">
                {selectedWeeks.map((week, index) => (
                  <li key={index} className="bg-red-100 rounded-md text-center">
                    {`Week ${index + 1}: ${week.start} to ${week.end}`}
                    <IconButton
                      color="error"
                      onClick={() => handleRemoveWeek(index)}
                    >
                      <Close />
                    </IconButton>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="flex gap-2 items-end">
          <div>
            <Typography variant="h4">Select Client:</Typography>
            <select
              className="p-2 bg-slate-200 border border-transparent rounded-md focus:outline-none focus:border-gray-900 focus:bg-white"
              value={selectedClient}
              onChange={(e) => setselectedClient(e.target.value)}
            >
              <option value="">Filter by Client</option>
              {fetchClientInfo?.map((name) => (
                <option key={name.clientId} value={name.clientId}>
                  {name.clientName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Typography variant="h4">Select Project:</Typography>
            <select
              disabled={!selectedClient}
              className="p-2 bg-slate-200 border border-transparent rounded-md focus:outline-none focus:border-gray-900 focus:bg-white"
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
            >
              <option value="">Filter by Project</option>
              {projectNames?.map((name, index) => (
                <option key={index} value={name.projectId}>
                  {name.projectName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Typography variant="h4">Select User:</Typography>
            <select
              disabled={!selectedProject}
              className="p-2 bg-slate-200 border border-transparent rounded-md focus:outline-none focus:border-gray-900 focus:bg-white"
              value={selectedName}
              onChange={(e) => setselectedName(e.target.value)}
            >
              <option value="">Filter by Name</option>
              {userNames?.map((item, index) => (
                <option key={index} value={item.user.userId}>
                  {item.user.firstname + " " + item.user.lastname}
                </option>
              ))}
            </select>
          </div>

          <div>
          <button
            className="p-2 bg-slate-700 text-white rounded-md hover:bg-slate-900"
            onClick={handleGenerateReport}
          >
            Generate Report
          </button>
        </div>
        </div>
       
      </div>

      <div>
        <div className="w-11/12 mx-auto mb-16">
          {selectedWeeks?.map((week, weekIndex) => (
            <>
            <Typography variant="h3" sx={{ textDecoration: "underline" }}>
              {new Date(selectedWeeks[weekIndex].start).toDateString() +
                " - " +
                new Date(selectedWeeks[weekIndex].end).toDateString()}
            </Typography>

            <div className="mb-8">
              <div className="mt-4 mb-10">
                <table className="w-11/12 mx-auto border border-gray-300 text-center">
                  <thead>
                    <tr className="bg-slate-500">
                      <th className="border border-gray-300">Name</th>
                      <th className="border border-gray-300">Date</th>
                      <th className="border border-gray-300">Project Name</th>
                      <th className="border border-gray-300">Hours</th>
                      <th className="border border-gray-300">Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {timeEntries[weekIndex]?.map((item, index) => (
                      <tr>
                        <td className="border border-gray-300">
                          {item.user.firstname+ ' '+item.user.lastname}
                        </td>
                        <td className="border border-gray-300">{item.date}</td>
                        <td className="border border-gray-300">
                          {item.projectEmployee.project.projectName}
                        </td>
                        <td className="border border-gray-300">
                          {item.minutes / 60}
                        </td>
                        <td className="border border-gray-300">{item.status}</td>
                      </tr>
                    ))}
                  </tbody>

                  <tfoot>
                    <tr className="bg-slate-300">
                      <td colSpan="3" className="p-2 border text-right">
                        Total working hours:
                      </td>
                      <td colSpan="2" className="p-2 border text-left">{timeEntries[weekIndex]?.reduce((acc, obj) => acc + obj.minutes/60, 0)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              <Divider />
            </div>
          </>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimesheetReports;