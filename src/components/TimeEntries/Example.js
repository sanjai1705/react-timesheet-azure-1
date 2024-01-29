import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../App';
import { tokens } from '../../themes';
import axios from 'axios';
import { useTheme } from '@emotion/react';
import { Button, ButtonGroup, Divider, Menu, Typography } from '@mui/material';
import {  AddCircle, ArrowBackIosSharp, ArrowDropDown, ArrowForwardIosTwoTone, DeleteTwoTone, Done, EditTwoTone } from '@mui/icons-material';
import { CalendarIcon } from '@mui/x-date-pickers';
import WeekPicker from '../WeekPicker';
import { mockTimeEntries, mockprojectData } from '../../data/mockData';
import NameMenuButton from '../../scenes/global/NameMenuButton';
import API_BASE_URL from '../../apiConfig';
import './Example.css'
import Loader from '../Loader';

const Example = () => {
  const { user } = useContext(AuthContext);
  const [selectedValue, setSelectedValue] = useState();

  const [CurrentStartDate, setCurrentStartDate] = useState();
  const [CurrentEndDate, setCurrentEndDate] = useState();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [loading, setLoading] = useState(true);

  const [fetchTimeEntries, setfetchTimeEntries] = useState(null);
  const [fetchProjectTimeEntries, setfetchProjectTimeEntries] = useState(null)
  const [fetchProjects, setfetchProjects] = useState();
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
    if((CurrentStartDate != undefined) && (selectedProject != undefined)) {
      setLoading(true)
      getPrevTimeEntries(new Date(CurrentStartDate).toLocaleDateString('en-CA'), new Date(CurrentEndDate).toLocaleDateString('en-CA'))
      getPrevProjectTimeEntries(selectedProject, new Date(CurrentStartDate).toLocaleDateString('en-CA'), new Date(CurrentEndDate).toLocaleDateString('en-CA'))
    }
  }, [CurrentStartDate])

  console.log(selectedProject) 

  const handleWeekPickerChange = (newValue) => {
    setSelectedValue(newValue);
    const currentDate = new Date(newValue);
    const startdate = new Date(currentDate);
    startdate.setDate(startdate.getDate() - startdate.getDay()); // Start of the week (Sunday)

    const enddate = new Date(startdate);
    enddate.setDate(enddate.getDate() + 6); // End of the week (Saturday)

    setCurrentStartDate(startdate);
    setCurrentEndDate(enddate);
  };


  const getPrevProjectTimeEntries = async (empId, startDate, endDate) => {
    seteditableIndex(null)
    setdateRange([]);
    const queryString = `?projectEmployeeId=${empId}&userId=${user.userId}&startDate=${startDate}&endDate=${endDate}`
    console.log(queryString)
    try {
      const response = await axios.get(`${API_BASE_URL}/getEmployeeTimeentries${queryString}`);
      console.log(response)
      let newArray = []
      console.log(response.data.Timesheetstatus)
      if(response.data.Timesheetstatus === undefined) {
        while (startDate <= endDate) {
          const existingEntries = response.data.employeetimeentries?.filter(entry => entry.date === startDate);
          if (existingEntries && existingEntries.length > 0) {
            // Use all existing entries
            newArray.push(...existingEntries);
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
          startDate = dateObject.toLocaleDateString('en-CA');
        }
      } else {
        newArray = response.data.Timesheetstatus
        console.log(newArray)
      }
      setfetchProjectTimeEntries(newArray)

    } catch (error) {
      console.log("Error fetching User data:", error);
    }
    setLoading(false)
  }

  const getPrevTimeEntries = async (startDate, endDate) => {
    const queryString = `?userId=${user.userId}&startdate=${startDate}&enddate=${endDate}`;
    console.log(queryString)
    try {
      const response = await axios.get(`${API_BASE_URL}/EmployeeTimeentries/Customdate${queryString}`);
      console.log(response)
      response.data.sort((a, b) => {
        return new Date(a.date) - new Date(b.date);
      });
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
      const response1 = await axios.get(
        `${API_BASE_URL}/ProjectEmployee/user/${user.userId}`
      );
      console.log(response1);
      if (response1.data.length > 0) {
        const projects1 = response1.data.map((item) => ({
          empID: item.empID,
          projectName: item.project.projectName,
        }));
        console.log(projects1);

        setselectedProject(projects1[0].empID);
        setfetchProjects(projects1);
        
        handleWeekPickerChange(new Date().toString())
        // Second API call
        /*const response2 = await axios.get(`${API_BASE_URL}/Project/applicable?applicable=true`);
      console.log(response2);
      const projects2 = response2.data.map((item) => ({
          empID: item.projectId,
          projectName: item.projectName,
      }));
      
      const uniqueProjects = Array.from(new Set([...projects1, ...projects2]), project => JSON.stringify(project));
      setfetchProjects(uniqueProjects.map(project => JSON.parse(project)));
      */
      }
    } catch (error) {
      console.log("Error fetching Project data:", error);
    }
    finally {
      setLoading(false);
    }
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
     // Check if the field is 'minutes' and if the value is numeric
     if (field === 'minutes' && !/^\d*$/.test(value)) {
      // If the field is 'minutes' and the value is not numeric, return without updating
      return;
  }
    setfetchProjectTimeEntries((prevEntry) => {
      const newEntry = [...prevEntry];
      newEntry[index][field] = value;
      return newEntry;
    });
  };

  console.log(errorMessages)

  const handleEntryArrayChange = (action, index) => {
    const newArray = [...fetchProjectTimeEntries];
    if (action === "remove") {
      if (newArray[index].timesheetId) {
        return handleDelete(newArray[index].timesheetId)   // Condition to delete it in backend database if it exists there
      }
      if ((index > 0 && newArray[index - 1].date === newArray[index].date) ||
        (index < newArray.length - 1 && newArray[index + 1].date === newArray[index].date)) 
      {
        newArray.splice(index, 1);
      } 
      else {
      newArray.splice(index, 1, {
        user: { userId: user.userId },
        date: newArray[index].date,
        projectEmployee: { empID: selectedProject },
        minutes: "",
        task: "",
      });
      }
      setfetchProjectTimeEntries(newArray);
    }

    else if(action === "add") {
      newArray.splice(index+1, 0, {
        user: { userId: user.userId },
        date: newArray[index].date,
        projectEmployee: { empID: selectedProject },
        minutes: "",
        task: "",
      });
      setfetchProjectTimeEntries(newArray);
    }
  };

  const handleStatusSubmit = async () => {
    setLoading(true)
    const queryString = `?userId=${user.userId}&startdate=${CurrentStartDate.toLocaleDateString('en-CA')}&enddate=${CurrentEndDate.toLocaleDateString('en-CA')}`;
    console.log(queryString)
    try {
      const response = await axios.post(`${API_BASE_URL}/EmployeeTimeentries/submit1${queryString}`)
      console.log(response)
      getPrevProjectTimeEntries(selectedProject, CurrentStartDate.toLocaleDateString('en-CA'), CurrentEndDate.toLocaleDateString('en-CA'))
    } catch (error) {
      console.log('Error while changing status:', error)
    }
    setLoading(false)
  }

  const handleSave = async () => {
    setLoading(true)
    const newEntry = fetchProjectTimeEntries.filter(item => !item.timesheetId && item.minutes != "")
    console.log(newEntry)
    try {
      const response = await axios.post(
        `${API_BASE_URL}/EmployeeTimeentries/EmployeeUserProjectCreate1`,
        newEntry
      );
      console.log(response);
    } catch (error) {
      console.log("Error while adding:", error);
    }
    getPrevTimeEntries(CurrentStartDate.toLocaleDateString('en-CA'), CurrentEndDate.toLocaleDateString('en-CA'))
    getPrevProjectTimeEntries(selectedProject, CurrentStartDate.toLocaleDateString('en-CA'), CurrentEndDate.toLocaleDateString('en-CA'))
    setLoading(false)
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
      const response = await axios.put(`${API_BASE_URL}/EmployeeTimeentries/Update/${editableArray.timesheetId}`, editableArray)
      console.log(response)
    } catch (error) {
      console.log("Error while updating", error);
    }
    seteditableArray()
    seteditableIndex()

    getPrevTimeEntries(CurrentStartDate.toLocaleDateString('en-CA'), CurrentEndDate.toLocaleDateString('en-CA'))
  };

  const handleDelete = async (timesheetId) => {
    setLoading(true)
    try {
      const response = await axios.delete(`${API_BASE_URL}/EmployeeTimeentries/Delete/${timesheetId}`);
      setfetchTimeEntries((prevData) => {
        const newData = prevData.filter((item) => item.timesheetId !== timesheetId); // Remove the deleted entry from the array
        return newData;
      });
      getPrevTimeEntries(CurrentStartDate.toLocaleDateString('en-CA'), CurrentEndDate.toLocaleDateString('en-CA'))
      getPrevProjectTimeEntries(selectedProject, CurrentStartDate.toLocaleDateString('en-CA'), CurrentEndDate.toLocaleDateString('en-CA'))
  } catch (error) {
      console.log("Error fetching data:", error);
    }
    setLoading(false)
  };

  console.log(fetchTimeEntries)
  console.log(fetchProjectTimeEntries)

  return (
    <div className="w-11/12 mx-auto mt-5 flex flex-col gap-4">
      <div className='flex justify-between align-top'>
      <Typography variant='h2'>Timesheet</Typography>
      <NameMenuButton/>
      </div>
      {fetchProjects == null ? 
        <div className='text-lg text-center mt-10'>
          <h1>(No Project is Assigned for you)</h1>
        </div>: (
        <div>
        <div className='w-10/12 mx-auto flex flex-col gap-2 mb-5'>
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
                  {CurrentStartDate.toLocaleDateString('en-IN') + " - " + CurrentEndDate.toLocaleDateString('en-IN')}
                </Typography>
              ) : null}
            </div>
            <div>
              <label>Select Project:  </label>
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
  
  
          {(fetchProjectTimeEntries === 'Approved' || fetchProjectTimeEntries === 'Submitted') ? (
            <p>The Time Entries has already been <b>{fetchProjectTimeEntries}</b> for this week</p>
          ) : (
            <form>
            <div className="overflow-x-auto">
              <table className="w-full mx-auto my-0 rounded-lg shadow-md overflow-hidden">
                <thead>
                  <tr className="text-xs text-left text-gray-300 bg-gray-700 border-b uppercase">
                    <th className="w-1/12 p-2">Date</th>
                    <th className="w-1/12 p-2">Hours</th>
                    <th className="w-9/12 p-2">Task</th>
                    <th className="w-1/12 p-1">Actions</th>
                  </tr>
                </thead>
  
                <tbody>
                  {fetchProjectTimeEntries?.map((item, index) => (
                    <tr key={index} className={editableIndex !== index ? "p-2 border-b bg-white" : "p-2 border-b bg-blue-300"}>
                      <td className="w-1/12">
                        <input
                          readOnly
                          disabled={item.timesheetId}
                          type="date"
                          max={new Date().toISOString().split("T")[0]}
                          value={item.date}
                          className="w-full  bg-slate-100 border border-transparent rounded-md focus:outline-none focus:border-gray-200 focus:bg-slate-200"
                        ></input>
                      </td>
                      <td className="w-1/12">
                        <input
                          disabled={item.timesheetId && editableIndex != index}
                          type="text"
                          placeholder="Hours"
                          className="w-full bg-slate-100 border border-transparent rounded-md focus:outline-none focus:border-gray-200 focus:bg-slate-200"
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
                          required
                          disabled={item.timesheetId && editableIndex != index}
                          placeholder="Task"
                          value={
                            editableIndex !== index ? item.task : editableArray.task
                          }
                          onChange={(e) =>
                            handleFieldChange(index, "task", e.target.value)
                          }
                          className="w-full bg-slate-100 border border-transparent rounded-md focus:outline-none focus:border-gray-200 focus:bg-slate-200"
                        ></input>
                      </td>
                      <td className="w-1/12">
                        <div className="flex justify-center gap-3">
                          {!item.timesheetId ? (
                            <div>
                                <button
                              type="button"
                              className="bg-transparent rounded-full hover:bg-slate-100"
                              onClick={() => handleEntryArrayChange("remove", index)}
                            >
                              <DeleteTwoTone color="error" />
                            </button>
  
                            {(item.minutes && item.task) && 
                            <button
                            type="button"
                            className="bg-transparent rounded-full hover:bg-slate-100"
                            onClick={() => handleEntryArrayChange("add", index)}
                          >
                            <AddCircle color="info" />
                          </button>
                            }
                            </div>
                            
                          ) : (
                            editableIndex === index ? (
                              <button type="button" onClick={handleDoneClick}>
                                <Done />
                              </button>
                            ) : (
                              <div className='flex'>
                              
                              <button type="button" className="bg-transparent rounded-full hover:bg-slate-100"
                               onClick={() => handleEditClick(index)}>
                                <EditTwoTone />
                              </button>
                              <button
                              type="button"
                              className="bg-transparent rounded-full hover:bg-slate-100"
                              onClick={() => handleEntryArrayChange("remove", index)}
                            >
                              <DeleteTwoTone color="error" />
                            </button>
                            <button
                            type="button"
                            className="bg-transparent rounded-full hover:bg-slate-100"
                            onClick={() => handleEntryArrayChange("add", index)}
                          >
                            <AddCircle color="info" />
                          </button>
                              </div>
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
          )}
          
  
        
          {!(fetchProjectTimeEntries === 'Approved' || fetchProjectTimeEntries === 'Submitted') && (
            <div className="p-2 flex justify-end items-center gap-2">
          <p>Make sure you save before leaving</p>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none"
            onClick={() => handleSave()}
          >
            Save
          </button>
        </div>
          )}
        
        
        
      </div>
  
  
  
      <Divider/>
  
  
  
        <div className="flex flex-col gap-3">
          <Typography variant='h2'>View Timesheet</Typography>
          {fetchTimeEntries?.length <= 0 ? (
            <p>No Time Entries Saved</p>
          ):(
            <div className="block w-10/12 mx-auto my-0 max-h-[400px] overflow-y-auto">
          <table className="w-full rounded-lg border shadow-md" >
            <thead>
              <tr className="text-xs text-left text-gray-300 bg-gray-700 border-b sticky top-0 uppercase">
                <th className="p-2">Date</th>
                <th className="p-2">Project</th>
                <th className="p-2">Hours</th>
                <th className="w-7/12 p-2">Task</th>
              </tr>
            </thead>
            <tbody className="overflow-y-auto">
              {fetchTimeEntries?.map((dayTasks, dayIndex) => (
                <React.Fragment key={dayIndex}>
                  {dayTasks.map((task, taskIndex) => (
                    <React.Fragment key={taskIndex}>
                      {taskIndex === 0 || task.date !== dayTasks[taskIndex - 1].date ? (
                        <tr className="bg-blue-100">
                          <td colSpan="4" className="border-b font-bold text-blue-700">
                            {task.date}
                          </td>
                        </tr>
                      ) : null}
                      <tr className={taskIndex % 2 === 0 ? 'bg-gray-100' : 'bg-gray-100'}>
                        <td className="py-1 px-2 border-b">{task.date}</td>
                        <td className="py-1 px-2 border-b">{task.projectEmployee.empID + ' - ' + task.projectEmployee.project.projectName}</td>
                        <td className="py-1 px-2 border-b">{task.minutes/60}</td>
                        <td className="py-1 px-2 border-b">{task.task}</td>
                      </tr>
                    </React.Fragment>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
            <tfoot className="bottom-0 sticky border bg-gray-300">
              <tr>
                <td colSpan={2} className='p-2 border text-right'>Total Hours Worked: </td>
                <td colSpan={1} className='p-2 text-left'>{fetchTimeEntries?.flat().reduce((accumulator, currentValue) => accumulator + currentValue.minutes/60, 0)}</td>
                <td colSpan={1}></td>
              </tr>
            </tfoot>
          </table>
          </div>
          )}
          
          {fetchTimeEntries?.length > 0 && 
          <div className="w-10/12 mx-auto flex justify-end">
            <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none"
              onClick={() => handleStatusSubmit()}
              disabled={(fetchProjectTimeEntries === 'Approved' || fetchProjectTimeEntries === 'Submitted')}>
              Submit Timesheet
            </button>
          </div>
         }
          
        </div>
        </div>
      )}
      {loading && <Loader value={'true'} />}
    </div>
  )
}

export default Example