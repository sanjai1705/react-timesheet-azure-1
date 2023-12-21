import { Button, ButtonGroup, Divider, IconButton, Menu, Typography } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import WeekPicker from "../WeekPicker";
import { ArrowBackIosSharp, ArrowDropDown, ArrowForwardIosTwoTone, Close, Remove } from "@mui/icons-material";
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
        `${API_BASE_URL}/EmployeeManager/Manager/${user.userId}`
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
              `${API_BASE_URL}/ProjectEmployee/user/${item.user1.userId}`
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
      const response = await axios.get(`${API_BASE_URL}/customdate${queryString}`);
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
                `${API_BASE_URL}/EmployeeTimeentries/Customdate${queryString}`
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

  useEffect(() => {
    if(fetchEmpTimeEntries.length > 0) {
      filterTimeEntriesByProject()
    }
  }, [fetchEmpTimeEntries, selectedProject])

  const filterTimeEntriesByProject = () => {
    if (selectedProject !== "") {
      setfetchProjectTimeEntries(
        fetchEmpTimeEntries.map((weekEntries) =>
          weekEntries.map((emp) => 
            emp.filter(
              (entry) => ((entry.projectEmployee.project.projectName === selectedProject) && (entry.status == 'Approved'))
            )
          )
        )
      );
    } else {
      setfetchProjectTimeEntries(fetchEmpTimeEntries);
    }
  };
  
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
  console.log(selectedProject)
  console.log(fetchEmpTimeEntries)
  console.log(fetchProjectTimeEntries)
  
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
    navigate('/generatereport', { state: {timeentries: fetchProjectTimeEntries, selectedWeeks: selectedWeeks, userNames: userNames} })
  };

  return (
    <div className="w-11/12 mx-auto space-y-5">
      <Typography variant="h2">Timesheet Reports</Typography>
      <div className="flex flex-col">
        <div className="flex flex-wrap gap-1">
          <div>
            <Typography variant="h4">Select Project:</Typography>
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
          </div>

          <div>
            <Typography variant="h4">Select Project:</Typography>
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
          </div>
        </div>

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

        <div>
          <Button
            onClick={handleGenerateReport}
            variant="contained"
            color="primary"
          >
            Generate Report
          </Button>
          <Button onClick={getPrevProjectTimeEntries1}>fetch</Button>
        </div>
      </div>

      <div>
        <div className="w-11/12 mx-auto mb-16">
          {fetchProjectTimeEntries?.map((week, weekIndex) => (
            <div className="mb-8">
              <Typography variant="h3" sx={{ textDecoration: "underline" }}>
                {new Date(selectedWeeks[weekIndex].start).toDateString() +
                  " - " +
                  new Date(selectedWeeks[weekIndex].end).toDateString()}
              </Typography>
              {week.map((user, userIndex) => (
                <div className="mt-4 mb-10">
                  <Typography variant="h4">{userNames[userIndex]}</Typography>
                  {user.length != 0 ? (
                    <table className="w-11/12 mx-auto border border-gray-300 text-center">
                      <thead>
                        <tr className="bg-slate-500">
                          <th className="border border-gray-300">UserId</th>
                          <th className="border border-gray-300">Date</th>
                          <th className="border border-gray-300"> Project Name</th>
                          <th className="border border-gray-300">Login Time</th>
                          <th className="border border-gray-300">Logout Time</th>
                          <th className="border border-gray-300">Hours</th>
                          <th className="border border-gray-300">Status</th>
                        </tr>
                      </thead>

                      <tbody>
                        {user.map((item) => (
                          <tr>
                            <td className="border border-gray-300">
                              {item.user.userId}
                            </td>
                            <td className="border border-gray-300">
                              {item.date}
                            </td>
                            <td className="border border-gray-300">
                              {item.projectEmployee.project.projectName}
                            </td>
                            <td className="border border-gray-300">
                              {item.login}
                            </td> <td className="border border-gray-300">
                              {item.logout}
                            </td>
                            <td className="border border-gray-300">
                              {item.minutes / 60}
                            </td>
                            <td className="border border-gray-300">
                              {item.status}
                            </td>
                          </tr>
                        ))}
                      </tbody>

                      <tfoot>
                      <tr className="bg-slate-300">
                        <td colSpan="5" className="p-2 border text-right">Total working hours:</td>
                        <td colSpan="2" className="p-2 border text-left">{user.reduce((acc, obj) => acc + obj.minutes/60, 0)}</td>
                        </tr>
                      </tfoot>
                    </table>
                  ) : (
                    <Typography variant="h5">-- No records --</Typography>
                  )}
                </div>
              ))}
              <Divider />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimesheetReports;
