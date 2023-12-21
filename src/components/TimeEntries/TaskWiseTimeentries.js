// TaskWiseTimeentries.js
import './Example.css'
import { AddCircle, ArrowBackIosSharp, ArrowDropDown, ArrowForwardIosTwoTone, DeleteTwoTone } from '@mui/icons-material';
import { Button, ButtonGroup, Input, Menu, MenuItem, Paper, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography, useTheme } from '@mui/material';
import { CalendarIcon, DateCalendar } from '@mui/x-date-pickers';
import React, { useContext, useEffect, useState } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import axios from 'axios';
import { AuthContext } from '../../App';
import WeekPicker from '../WeekPicker';
import { tokens } from '../../themes';
import { mockprojectData } from '../../data/mockData';
import API_BASE_URL from '../../apiConfig';

const TaskWiseTimeentries = () => {
  const { user, logout } = useContext(AuthContext);
  const [selectedValue, setSelectedValue] = useState();

  const [CurrentStartDate, setCurrentStartDate] = useState();
  const [CurrentEndDate, setCurrentEndDate] = useState();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [value, setValue] = useState(dayjs(new Date()));

  const [fetchTimeEntries, setfetchTimeEntries] = useState(null);
  const [fetchProjects, setfetchProjects] = useState([]);
  const [dateRange, setdateRange] = useState([]);
  const [Entry, setEntry] = useState([]);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

 useEffect(() => {
    getPrevTimeEntries();
  }, [CurrentStartDate, fetchTimeEntries]);

  const getPrevTimeEntries = async () => {
    const queryString = `?userId=${user.userId}&startdate=${CurrentStartDate}&enddate=${CurrentEndDate}`;
    try {
      const response = await axios.get(`${API_BASE_URL}/EmployeeTimeentries/Customdate${queryString}`);
      console.log(response)
      setfetchTimeEntries(response.data)
  } catch (error) {
      console.log("Error fetching User data:", error);
    }
  }

  useEffect(() => {
    const getProjects = async () => {
        try {
            // First API call
            const response1 = await axios.get(`${API_BASE_URL}/ProjectEmployee/user/${user.userId}`);
            console.log(response1);
            const projects1 = response1.data.map((item) => ({
                empID: item.empID,
                projectName: item.project.projectName,
            }))

            // Second API call
            const response2 = await axios.get(`${API_BASE_URL}/Project/applicable?applicable=true`);
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

useEffect(()=>{
  handleWeekPickerChange(new Date().toString())
}, [])

const handleWeekPickerChange = (newValue) => {
  setSelectedValue(newValue);
  const currentDate = new Date(newValue);
  const startdate = new Date(currentDate);
  startdate.setDate(startdate.getDate() - startdate.getDay()); // Start of the week (Sunday)

  const enddate = new Date(startdate);
  enddate.setDate(enddate.getDate() + 6); // End of the week (Saturday)

  setCurrentStartDate(startdate);
  setCurrentEndDate(enddate);

  getDateRange(startdate, enddate);
};

const getDateRange = (startDate, endDate) => {
  setEntry([]);
  setdateRange([]);
  const newEntry = [];
  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const formattedDate = currentDate.toISOString().split("T")[0]; // Format as 'YYYY-MM-DD'
    const todatestring = currentDate.toDateString();
    setdateRange((prevdata) => [...prevdata, todatestring]);
    console.log(currentDate.toDateString());
    newEntry.push([{
      projectEmployee: {
        empID: "",
      },
      user: {
        userId: user.userId,
      },
      date: formattedDate,
      minutes: "",
      task: ""
    }]);
    currentDate.setDate(currentDate.getDate() + 1);
  }
  setEntry([newEntry]);
};


console.log(Entry[0])

const handleFieldChange = (mainIndex, index, field, value,  subField) => {
  // Update the state or perform any other actions based on the input change
  // For example, you might want to update the state of your component

  // Assuming you have a state like this:
  // const [entries, setEntries] = useState([...]);

  // You can update the state like this:
  const updatedEntries = Entry[0]; // Copy the array to avoid mutating state directly
  if(field == 'projectEmployee') {
    updatedEntries[mainIndex][index][field][subField] = value
    updatedEntries[mainIndex][index].minutes = '8'
  }
  else {
    updatedEntries[mainIndex][index][field] = value
  }
  console.log(updatedEntries)
  setEntry([updatedEntries]);
};


const handleEntryArrayChange = (action, mainIndex, index) => {
  if (action == "add") {
    const newArray = Entry[0]
    const addArray = newArray[mainIndex]
    console.log(newArray)
    console.log(addArray)
    const date = new Date(dateRange[mainIndex])
    const newEntry = {
      user: {
        userId: user.userId,
      },
      date: date.toLocaleDateString('en-CA'), // Adjust the locale as needed
      projectEmployee: {
        empID: "",
      },
      minutes: "",
      task: "",
    };
    addArray.push(newEntry);
    newArray[mainIndex] = addArray
    setEntry([newArray])

  } else if (action == "remove") {
    console.log(Entry[0][mainIndex])
    /*if (Entry[0][mainIndex].length > 1) {
      const newArray = Entry[0];
      newArray[mainIndex].splice(index, 1);
      setEntry([...newArray]);
    }
    else {
      setEntry([{
        user: {
          userId: user.userId,
        },
        date: "",
        projectEmployee: {
          empID: "",
        },
        minutes: "",
        task: "",
      }])
    }*/
  }
};
console.log(Entry)

const handleStatusSubmit = async() => {
  const queryString = `?userId=${user.userId}&startId=${fetchTimeEntries[0].timesheetId}&endId=${fetchTimeEntries[fetchTimeEntries.length-1].timesheetId}`;
  try {
    const response = await axios.post(`${API_BASE_URL}/EmployeeTimeentries/submit${queryString}`)
    console.log(response)
  } catch(error) {
    console.log('Error while changing status:', error)
  }
  getPrevTimeEntries()
}

const handleValidate = (event) => {
  // Prevent the default form submission behavior
  event.preventDefault();
  handleEntryArrayChange("add");
};

const handleSave = async () => {
  try {
    const response = await axios.post(
      "${API_BASE_URL}/EmployeeTimeentries/EmployeeUserProjectCreate1",
      Entry
    );
    console.log(response);
    setEntry([
      {
        user: {
          userId: user.userId,
        },
        date: "",
        projectEmployee: {
          empID: "",
        },
        minutes: "",
        task: "",
      },
    ])
  } catch (error) {
    console.log("Error while adding:", error);
  }
  getPrevTimeEntries()  
};

const arrayOfArraysOfObjects = [
  [
    { date: '2023-09-01', minutes: 20, subjects: ['Math', 'History'] },
    { date: '2023-09-02', minutes: 22, subjects: ['English', 'Physics'] }
  ],
  [
    { name: 'Charlie', age: 21, subjects: ['Chemistry', 'Biology'] },
    { name: 'David', age: 23, subjects: ['Geography', 'Computer Science'] }
  ]
];

  return (
    
    <>
    <div className='w-11/12 mx-auto mb-10'>
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
            <WeekPicker onValueChange={handleWeekPickerChange} />
          </Menu>
          <Button>
            <ArrowForwardIosTwoTone />
          </Button>
        </ButtonGroup>
        {dateRange[0] && dateRange[6] ? (
          <Typography variant="h4">
            {dateRange[0] + " - " + dateRange[6]}
          </Typography>
        ) : null}
    </div>

    <div>
    <form>
        <div className="overflow-x-auto">
          <table className="w-4/5 mx-auto my-0 rounded-lg shadow-md overflow-hidden">
            <thead>
              <tr className="text-xs text-left text-gray-300 bg-gray-700 border-b uppercase">
                <th className="p-4">Date</th>
                <th className="p-4">Project</th>
                <th className="p-4">Hours</th>
                <th className="p-4">Task</th>
                <th className="p-2"></th>
              </tr>
            </thead>
            <tbody>
              {Entry[0]?.map((mainArray, mainIndex) => (
                  mainArray?.map((item, index) => (
                    <>
                    <tr key={`${mainIndex}-${index}`}>
                        <td className={index==item.length-1 ? "p-1 border-b bg-white" : "p-1 bg-white"}>
                          {index == 0 &&
                    <input
                      type="date"
                      disabled
                      max={new Date().toISOString().split("T")[0]}
                      value={item.date}
                      className="w-full p-1.5 bg-slate-100 border border-transparent rounded-md focus:outline-none focus:border-gray-200 focus:bg-slate-200"
                      onChange={(e) =>
                        handleFieldChange(mainIndex, index, "date", e.target.value)
                      }
                    ></input>}
                  </td>
                  <td className="p-1 border-b bg-white">
                    <select
                      required
                      className="w-full p-2 bg-slate-100 border border-transparent rounded-md focus:outline-none focus:border-gray-200 focus:bg-slate-200"
                      onChange={(e) =>
                        handleFieldChange(mainIndex, index, "projectEmployee", e.target.value, "empID")
                      }
                    >
                      <option value="">Select a Project</option>
                      {mockprojectData?.map((emp) => (
                        <option key={emp.empID} value={emp.empID}>
                          {emp.empID + " - " + emp.projectName}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-1 border-b bg-white">
                    <input
                      required
                      type="text"
                      placeholder="Enter hours"
                      className="w-full p-2 bg-slate-100 border border-transparent rounded-md focus:outline-none focus:border-gray-200 focus:bg-slate-200"
                      value={item.minutes}
                      onChange={(e) =>
                        handleFieldChange(mainIndex, index, "minutes", e.target.value)
                      }
                    ></input>
                  </td>
                  <td className="p-1 border-b bg-white">
                    <input
                      required
                      placeholder="Task"
                      value={item.task}
                      onChange={(e) =>
                        handleFieldChange(mainIndex, index, "task", e.target.value)
                      }
                      size={60}
                      className="w-full p-2 bg-slate-100 border border-transparent rounded-md focus:outline-none focus:border-gray-200 focus:bg-slate-200"
                    ></input>
                  </td>
                  <td className="p-1 border-b bg-white">
                    <div className="flex justify-center gap-3">
                      <button
                        type="button"
                        className="bg-transparent p-1 rounded-full hover:bg-slate-100"
                        onClick={() => handleEntryArrayChange("remove", mainIndex, index)}
                      >
                        <DeleteTwoTone color="error" />
                      </button>
                      {index == mainArray.length - 1 && (
                        <button
                          type="submit"
                          className="bg-transparent p-1 rounded-full hover:bg-slate-100"
                          onClick={() => handleEntryArrayChange('add', mainIndex)}
                        >
                          <AddCircle color="info" />
                        </button>
                      )}
                    </div>
                  </td>
                  </tr>
                  {index == mainArray.length - 1 && (
                       <tr className='h-4 bg-neutral-100'>
                       <td colSpan={5}></td>
                     </tr>
                  )}
          
                  </>
                  ))
              ))}

              {}
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
        <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none"
                onClick={()=>handleStatusSubmit()}>
          Submit
        </button>
      </div>
    </div>
    
     {/*} <div>

        <div className='w-10/12 my-10 mx-auto bg-white border border-gray-200 focus-within:border-gray-500 rounded-lg shadow-md'>
  <div className='py-3 px-2 flex justify-between gap-5'>
    <select
      className='p-2 bg-slate-50 border border-transparent rounded-md focus:outline-none focus:border-gray-200'
      value={newEntry.projectEmployee.empID}
      onChange={(e) =>
      setNewEntry({
        ...newEntry,
          projectEmployee: {
            ...newEntry.projectEmployee,
                empID: e.target.value,
              },
            })}
      >
        <option value=''>Select a Project</option>
        {fetchProjects?.map((item) => (
          <option key={item.empID} value={item.empID}>
            {item.empID + " - " + item.projectName}
          </option>
        ))}
    </select>
     
    <input
      type='text'
      placeholder='Enter hours'
      className='p-2 bg-slate-50 border border-transparent rounded-md focus:outline-none focus:border-gray-200'
      value={newEntry.minutes}
      onChange={(e) =>
        setNewEntry({ ...newEntry, minutes: e.target.value })
      }
    ></input>
     
    <textarea
      id="taskDescription"
      name="taskDescription"
      placeholder='Task'
      value={newEntry.task}
      onChange={(e) =>
        setNewEntry({ ...newEntry, task: e.target.value })
      }
      rows="1"
      className='flex-1 p-2 bg-slate-50 border border-transparent rounded-md focus:outline-none focus:border-gray-200'
    ></textarea>
     <div className='border-r-2 border-gray-400'></div>
    <button className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none' onClick={()=>handleSubmit()}>
      Add Entry
    </button>
  </div>
</div>


<table className="w-4/5 mx-auto mb-10 divide-y bg-slate-100 divide-gray-200">
      <thead  className='bg-slate-400 p-2'>
        <tr>
          <th className="px-6 py-3 text-left text-xs leading-4 font-medium text-black uppercase tracking-wider">
            Date
          </th>
          <th className="px-6 py-3 text-left text-xs leading-4 font-medium text-black uppercase tracking-wider">
            Project
          </th>
          <th className="px-6 py-3 text-left text-xs leading-4 font-medium text-black uppercase tracking-wider">
            Login Time
          </th>
          <th className="px-6 py-3 text-left text-xs leading-4 font-medium text-black uppercase tracking-wider">
            Logout Time
          </th>
          <th className="px-6 py-3 text-left text-xs leading-4 font-medium text-black uppercase tracking-wider">
            Hours
          </th>
          <th className="px-6 py-3 text-left text-xs leading-4 font-medium text-black uppercase tracking-wider">
            Task Description
          </th>
        </tr>
      </thead>
      <tbody>
        {fetchTimeEntries?.map((entry) => (
          <tr key={entry.id}>
            <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 font-medium text-gray-900">
              {entry.date}
            </td>
            <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 font-medium text-gray-900">
              {entry.projectEmployee.empID+' - '+entry.projectEmployee.project.projectName}
            </td>
            <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-500">
              {entry.login}
            </td>
            <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-500">
              {entry.logout}
            </td>
            <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-500">
              {(entry.minutes)/60}
            </td>
            <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-500">
              {entry.task == null ? 'Nil' : entry.task}
            </td>
          </tr>
        ))}
      </tbody>
    </table>

        </div>*/}
    </>
  );
};

export default TaskWiseTimeentries;