import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../App';
import { tokens } from '../../themes';
import axios from 'axios';
import { useTheme } from '@emotion/react';
import { Button, ButtonGroup, Menu, Typography } from '@mui/material';
import {  ArrowBackIosSharp, ArrowDropDown, ArrowForwardIosTwoTone, DeleteTwoTone, Done, EditTwoTone } from '@mui/icons-material';
import { CalendarIcon } from '@mui/x-date-pickers';
import WeekPicker from '../WeekPicker';
import { mockTimeEntries, mockprojectData } from '../../data/mockData';

const Example = () => {
  const { user } = useContext(AuthContext);
  const [selectedValue, setSelectedValue] = useState();

  const [CurrentStartDate, setCurrentStartDate] = useState();
  const [CurrentEndDate, setCurrentEndDate] = useState();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [fetchTimeEntries, setfetchTimeEntries] = useState(null);
  const [fetchProjectTimeEntries, setfetchProjectTimeEntries] = useState(null)
  const [fetchProjects, setfetchProjects] = useState([]);
  const [selectedProject, setselectedProject] = useState()
  const [dateRange, setdateRange] = useState([]);
  const [Entry, setEntry] = useState([]);
  const [editableIndex, seteditableIndex] = useState(null);
  const [editableArray, seteditableArray] = useState();
  const [errorMessages, setErrorMessages] = useState([]);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    const fetchData = async () => {
      await getProjects();;
    };
    fetchData();
  }, [])

  useEffect(() => {
    if(CurrentStartDate != undefined) {
      getPrevProjectTimeEntries(selectedProject, new Date(CurrentStartDate).toLocaleDateString('en-CA'), new Date(CurrentEndDate).toLocaleDateString('en-CA'))
    }
  }, [CurrentStartDate])

  console.log(selectedProject)

  const getPrevProjectTimeEntries = async (empId, startDate, endDate) => {
    seteditableIndex(null)
    setdateRange([]);
    const queryString = `?projectEmployeeId=${empId}&userId=${user.userId}&startDate=${startDate}&endDate=${endDate}`
    console.log(queryString)
    try {
      const response = await axios.get(`https://springboot-timesheet-azure.azurewebsites.net/Timesheet/customdate${queryString}`);
      console.log(response)
      const newArray = []
      while (startDate <= endDate) {
        setdateRange(prevdata => [...prevdata, startDate]);
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

  const getPrevTimeEntries = async (startDate, endDate) => {
    const queryString = `?userId=${user.userId}&startdate=${startDate}&enddate=${endDate}`;
    console.log(queryString)
    try {
      const response = await axios.get(`https://springboot-timesheet-azure.azurewebsites.net/Timesheet/EmployeeTimeentries/Customdate${queryString}`);
      console.log(response)
      const groupedByDate = response.data.reduce((acc, entry) => {
        const date = entry.date;
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(entry);
        return acc;
      }, {});

      // Converting the grouped object to an array
      const groupedArray = Object.values(groupedByDate);
      console.log(groupedArray)
      setfetchTimeEntries(groupedArray)
    } catch (error) {
      console.log("Error fetching User data:", error);
    }
  }

  const getProjects = async () => {
    try {
      // First API call
      const response1 = await axios.get(`https://springboot-timesheet-azure.azurewebsites.net/Timesheet/ProjectEmployee/user/${user.userId}`);
      console.log(response1);
      const projects1 = response1.data.map((item) => ({
        empID: item.empID,
        projectName: item.project.projectName,
      }))
      console.log(projects1)

      setselectedProject(projects1[0].empID)
      setfetchProjects(projects1)

      const currentDate = new Date();
      const startdate = new Date(currentDate);
      startdate.setDate(startdate.getDate() - startdate.getDay()); // Start of the week (Sunday)
      const enddate = new Date(startdate);
      enddate.setDate(enddate.getDate() + 6); // End of the week (Saturday)
      setCurrentStartDate(startdate);
      setCurrentEndDate(enddate);

      handleWeekPickerChange(new Date().toString())
      await getPrevProjectTimeEntries(projects1[0].empID, startdate.toLocaleDateString('en-CA'), enddate.toLocaleDateString('en-CA'))
      // Second API call
      /*const response2 = await axios.get(`https://springboot-timesheet-azure.azurewebsites.net/Timesheet/Project/applicable?applicable=true`);
      console.log(response2);
      const projects2 = response2.data.map((item) => ({
          empID: item.projectId,
          projectName: item.projectName,
      }));
      
      const uniqueProjects = Array.from(new Set([...projects1, ...projects2]), project => JSON.stringify(project));
      setfetchProjects(uniqueProjects.map(project => JSON.parse(project)));
      */
    } catch (error) {
      console.log("Error fetching Project data:", error);
    }
  };



  const handleWeekPickerChange = (newValue) => {
    setSelectedValue(newValue);
    const currentDate = new Date(newValue);
    const startdate = new Date(currentDate);
    startdate.setDate(startdate.getDate() - startdate.getDay()); // Start of the week (Sunday)

    const enddate = new Date(startdate);
    enddate.setDate(enddate.getDate() + 6); // End of the week (Saturday)

    setCurrentStartDate(startdate);
    setCurrentEndDate(enddate);
    getPrevTimeEntries(startdate.toLocaleDateString('en-CA'), enddate.toLocaleDateString('en-CA'))
  };


  const changeWeek = (direction) => {
    if (direction == 'prevWeek') {
      let tempDate = new Date(CurrentStartDate);
      tempDate.setDate(tempDate.getDate() - 1);
      console.log(tempDate)
      handleWeekPickerChange(tempDate)
    }
    else if (direction == 'nextWeek') {
      let tempDate = new Date(CurrentEndDate);
      tempDate.setDate(tempDate.getDate() + 1);
      console.log(tempDate)
      handleWeekPickerChange(tempDate)
    }
  }

  const handleProjectChange = (empId) => {
    setselectedProject(empId)
    getPrevProjectTimeEntries(empId, CurrentStartDate.toLocaleDateString('en-CA'), CurrentEndDate.toLocaleDateString('en-CA'))
  }

  const handleFieldChange = (index, field, value) => {
    setfetchProjectTimeEntries((prevEntry) => {
      const newEntry = [...prevEntry];
      newEntry[index][field] = value;
      return newEntry;
    });
  };

  console.log(errorMessages)

  const handleEntryArrayChange = (action, index) => {
    if (action === "remove") {
      const newArray = [...fetchProjectTimeEntries];
      newArray.splice(index, 1, {
        user: { userId: user.userId },
        date: new Date(CurrentStartDate).toLocaleDateString('en-CA'),
        projectEmployee: { empID: selectedProject },
        minutes: "",
        task: "",
      });
      setfetchProjectTimeEntries(newArray);
    }
  };

  const handleStatusSubmit = async () => {
    const queryString = `?userId=${user.userId}&startdate=${CurrentStartDate.toLocaleDateString('en-CA')}&enddate=${CurrentEndDate.toLocaleDateString('en-CA')}`;
    console.log(queryString)
    try {
      const response = await axios.post(`https://springboot-timesheet-azure.azurewebsites.net/Timesheet/DaywiseTimesheet/submit${queryString}`)
      console.log(response)
    } catch (error) {
      console.log('Error while changing status:', error)
    }
  }

  const handleSave = async () => {
    
    
    const newEntry = fetchProjectTimeEntries.filter(item => !item.timesheetId && item.minutes != "")
    console.log(newEntry)
    try {
      const response = await axios.post(
        "https://springboot-timesheet-azure.azurewebsites.net/Timesheet/EmployeeTimeentries/EmployeeUserProjectCreate1",
        newEntry
      );
      console.log(response);
    } catch (error) {
      console.log("Error while adding:", error);
    }
    getPrevTimeEntries(CurrentStartDate.toLocaleDateString('en-CA'), CurrentEndDate.toLocaleDateString('en-CA'))
    getPrevProjectTimeEntries(selectedProject, CurrentStartDate.toLocaleDateString('en-CA'), CurrentEndDate.toLocaleDateString('en-CA'))
  };

  const handleEditClick = (index) => {
    seteditableIndex(index);
    const array = fetchProjectTimeEntries[index];
    array.minutes = array.minutes / 60;
    seteditableArray(array);
  };
  console.log(editableArray);

  const handleDoneClick = async () => {
    editableArray.minutes = editableArray.minutes * 60
    try {
      const response = await axios.put(`https://springboot-timesheet-azure.azurewebsites.net/Timesheet/EmployeeTimeentries/Update/${editableArray.timesheetId}`, editableArray)
      console.log(response)
    } catch (error) {
      console.log("Error while updating", error);
    }
    seteditableArray()
    seteditableIndex()

    getPrevTimeEntries(CurrentStartDate.toLocaleDateString('en-CA'), CurrentEndDate.toLocaleDateString('en-CA'))
    getPrevProjectTimeEntries(selectedProject, CurrentStartDate.toLocaleDateString('en-CA'), CurrentEndDate.toLocaleDateString('en-CA'))
  };

  console.log(fetchTimeEntries)

  return (
    <div className="w-10/12 mx-auto mt-5 flex flex-col gap-4">
      <Typography variant='h2'>Timesheet</Typography>
      <div className='flex flex-col gap-2'>
        <div className='flex justify-between items-center'>
          <div className='flex flex-row gap-1'>
            <ButtonGroup
              variant="text"
              size='small'
              sx={{ backgroundColor: colors.blueAccent[400], height: '25px' }}
            >
              <Button onClick={() => changeWeek('prevWeek')}>
                <ArrowBackIosSharp fontSize='small' />
              </Button>
              <Button onClick={handleClick}>
                <CalendarIcon fontSize='small' />
                <ArrowDropDown fontSize='small' />
              </Button>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
              >
                <WeekPicker onValueChange={handleWeekPickerChange} />
              </Menu>
              <Button onClick={() => changeWeek('nextWeek')}>
                <ArrowForwardIosTwoTone fontSize='small' />
              </Button>
            </ButtonGroup>
            {CurrentStartDate && CurrentEndDate ? (
              <Typography variant="h4">
                {CurrentStartDate.toLocaleDateString('en-DE') + " - " + CurrentEndDate.toLocaleDateString('en-DE')}
              </Typography>
            ) : null}
          </div>
          <div>
            <select
              className="p-2 bg-slate-200 border border-transparent rounded-md focus:outline-none focus:border-gray-900 focus:bg-slate-300"
              onChange={(e) => handleProjectChange(e.target.value)}
              value={selectedProject}>
              {fetchProjects?.map((emp) => (
                <option key={emp.empID} value={emp.empID}>
                  {emp.empID + " - " + emp.projectName}
                </option>
              ))}
            </select>
          </div>

        </div>



        <form>
          <div className="overflow-x-auto">
            <table className="w-11/12 mx-auto my-0 rounded-lg shadow-md overflow-hidden">
              <thead>
                <tr className="text-xs text-left text-gray-300 bg-gray-700 border-b uppercase">
                  <th className="p-3">Date</th>
                  <th className="p-3">Hours</th>
                  <th className="p-3">Task</th>
                  <th className="p-1"></th>
                </tr>
              </thead>

              <tbody>
                {fetchProjectTimeEntries?.map((item, index) => (
                  <tr key={index} className={editableIndex !== index ? "p-1 border-b bg-white" : "p-1 border-b bg-blue-300"}>
                    <td className="w-1/12">
                      <input
                        readOnly
                        disabled={item.timesheetId}
                        type="date"
                        max={new Date().toISOString().split("T")[0]}
                        value={item.date}
                        className="w-full p-1.5 bg-slate-100 border border-transparent rounded-md focus:outline-none focus:border-gray-200 focus:bg-slate-200"
                      ></input>
                    </td>
                    <td className="w-2/12">
                      <input
                        disabled={item.timesheetId && editableIndex != index}
                        type="text"
                        placeholder="Enter hours"
                        className="w-full p-2 bg-slate-100 border border-transparent rounded-md focus:outline-none focus:border-gray-200 focus:bg-slate-200"
                        value={
                          editableIndex !== index
                            ? (item.timesheetId ? item.minutes / 60 : item.minutes)
                            : editableArray.minutes
                        }
                        onChange={(e) =>
                          handleFieldChange(index, "minutes", e.target.value)
                        }
                      ></input>
                      {/*<div className="text-red-500 text-xs">{errorMessages[index]}</div>*/}
                    </td>
                    <td className="w-9/12">
                      <input
                        disabled={item.timesheetId && editableIndex != index}
                        placeholder="Task"
                        value={
                          editableIndex !== index ? item.task : editableArray.task
                        }
                        onChange={(e) =>
                          handleFieldChange(index, "task", e.target.value)
                        }
                        className="w-full p-2 bg-slate-100 border border-transparent rounded-md focus:outline-none focus:border-gray-200 focus:bg-slate-200"
                      ></input>
                    </td>
                    <td className="w-1/12">
                      <div className="flex justify-center gap-3">
                        {!item.timesheetId ? (
                          <button
                            type="button"
                            className="bg-transparent p-1 rounded-full hover:bg-slate-100"
                            onClick={() => handleEntryArrayChange("remove", index)}
                          >
                            <DeleteTwoTone color="error" />
                          </button>
                        ) : (
                          editableIndex === index ? (
                            <button type="button" onClick={handleDoneClick}>
                              <Done />
                            </button>
                          ) : (
                            <button type="button" onClick={() => handleEditClick(index)}>
                              <EditTwoTone />
                            </button>
                          )
                        )
                        }
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </form>

      

      <div className="w-4/5 mx-auto p-2 flex justify-end gap-2">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none"
          onClick={() => handleSave()}
        >
          Save
        </button>
      </div>
      
      
    </div>







      <div className="container mx-auto">
      <Typography variant='h2'>View Saved</Typography>
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b text-left">Date</th>
              <th className="py-2 px-4 border-b text-left">Project</th>
              <th className="py-2 px-4 border-b text-left">Hours</th>
              <th className="py-2 px-4 border-b text-left w-1/2">Task</th>
            </tr>
          </thead>
          <tbody>
            {fetchTimeEntries?.map((dayTasks, dayIndex) => (
              <React.Fragment key={dayIndex}>
                {dayTasks.map((task, taskIndex) => (
                  <React.Fragment key={taskIndex}>
                    {taskIndex === 0 || task.date !== dayTasks[taskIndex - 1].date ? (
                      <tr className="bg-blue-100">
                        <td colSpan="4" className="py-2 px-4 border-b font-bold text-blue-700">
                          {task.date}
                        </td>
                      </tr>
                    ) : null}
                    <tr className={taskIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="py-2 px-4 border-b">{task.date}</td>
                      <td className="py-2 px-4 border-b">{task.projectEmployee.empID + ' - ' + task.projectEmployee.project.projectName}</td>
                      <td className="py-2 px-4 border-b">{task.minutes/60}</td>
                      <td className="py-2 px-4 border-b">{task.task}</td>
                    </tr>
                  </React.Fragment>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
        <button className="bg-green-500 float-right mt-5 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none"
          onClick={() => handleStatusSubmit()}>
          Submit Timesheet
        </button>
      </div>

    </div>
  )
}

export default Example