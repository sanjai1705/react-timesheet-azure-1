import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  ButtonGroup,
  Menu,
  Typography,
  IconButton,
} from "@mui/material";
import { tokens } from "../../themes";
import { useTheme } from "@emotion/react";
import { CalendarIcon } from "@mui/x-date-pickers";
import {
  AddCircle,
  ArrowBackIosSharp,
  ArrowDropDown,
  ArrowForwardIosTwoTone,
  DeleteTwoTone,
} from "@mui/icons-material";
import WeekPicker from "../WeekPicker";
import { AuthContext } from "../../App";
import axios from "axios";
import SimpleSnackbar from "../Snackbar";
import { mockprojectData } from "../../data/mockData";

const WeekWiseTimeentries = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { user } = useContext(AuthContext);
  const [selectedValue, setSelectedValue] = useState();
  const [anchorEl, setAnchorEl] = useState(null);
  const [CurrentStartDate, setCurrentStartDate] = useState();
  const [CurrentEndDate, setCurrentEndDate] = useState();
  const [fetchTimeEntries, setfetchTimeEntries] = useState(null);
  const [fetchProjects, setfetchProjects] = useState([]);
  const [dateRange, setdateRange] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedEmpIDs, setSelectedEmpIDs] = useState([]);
  const [alerttrigger, setalerttrigger] = useState("");

  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

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
    setProjects([]);
    setdateRange([]);
    const newProjects = [];
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const formattedDate = currentDate.toISOString().split("T")[0]; // Format as 'YYYY-MM-DD'
      const todatestring = currentDate.toDateString();
      setdateRange((prevdata) => [...prevdata, todatestring]);
      console.log(currentDate.toDateString());
      newProjects.push({
        projectEmployee: {
          empID: "",
        },
        user: {
          userId: user.userId,
        },
        date: formattedDate,
        minutes: "",
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }
    setProjects([newProjects]);
  };

  console.log(projects);
 

  const addProjectArray = () => {
    const updatedProjects = [...projects]; // Create a copy of the projects array
    if (updatedProjects[projects.length - 1][0].projectEmployee.empID === "") {
      setalerttrigger("Project");
      return;
    }

    let isAnyHourEntered = false;
    updatedProjects[projects.length - 1].map((item) => {
      if (item.minutes != "") {
        isAnyHourEntered = true;
      }
    });
    if (!isAnyHourEntered) {
      setalerttrigger("Time");
      return;
    }
    const newProjects = [];
    const currentDate = new Date(CurrentStartDate);
    while (currentDate <= CurrentEndDate) {
      const formattedDate = currentDate.toISOString().split("T")[0]; // Format as 'YYYY-MM-DD'
      console.log(currentDate.toDateString());
      newProjects.push({
        projectEmployee: {
          empID: "",
        },
        user: {
          userId: user.userId,
        },
        date: formattedDate,
        minutes: "",
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }
    updatedProjects.push(newProjects); // Add a new empty array to projects

    setProjects(updatedProjects);
    setSelectedEmpIDs([...selectedEmpIDs, ""]);
  };

  const deleteProjectArray = (index) => {
    if(projects.length >1) {
      const updatedProjects = [...projects];
      const updatedEmpIDs = [...selectedEmpIDs];
    
      // Remove the selected project and its corresponding empID
      updatedProjects.splice(index, 1);
      updatedEmpIDs.splice(index, 1);
    
      // Update the state with the modified arrays
      setProjects([...updatedProjects]);  // Spread the array to trigger a re-render
      setSelectedEmpIDs([...updatedEmpIDs]);
    }
  };
  
  
  
  
  

  const handleChange = async (projectIndex, subindex, value) => {
    setalerttrigger("");
    // Create a deep copy of the projects array
    const updatedProjects = [...projects];

    // Create a deep copy of the specific project object
    const updatedProject = { ...updatedProjects[projectIndex][subindex] };

    // Update the minutes property of the project object
    updatedProject.minutes = value;

    // Update the projects array with the modified project object
    updatedProjects[projectIndex][subindex] = updatedProject;

    // Set the state with the new array reference
    setProjects(updatedProjects);
  };

  const updateEmpIDForArray = (index, value) => {
    const updatedProjects = [...projects];
    const innerArray = updatedProjects[index];
    const newInnerArray = innerArray.map((project) => ({
      ...project,
      projectEmployee: {
        ...project.projectEmployee,
        empID: value, // Update the empID within the projectEmployee object
      },
    }));
    updatedProjects[index] = newInnerArray;

    // Update the projects state
    setProjects(updatedProjects);
    console.log(updatedProjects);
  };

  console.log(dateRange);
  console.log(projects);

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
            /*const response2 = await axios.get(`https://springboot-timesheet-azure.azurewebsites.net/Timesheet/Project/applicable?applicable=true`);
            console.log(response2);
            const projects2 = response2.data.map((item) => ({
                empID: item.projectId,
                projectName: item.projectName,
            }));
            
            const uniqueProjects = Array.from(new Set([...projects1, ...projects2]), project => JSON.stringify(project));
            setfetchProjects(uniqueProjects.map(project => JSON.parse(project)));*/
            setfetchProjects(projects1)
            
        } catch (error) {
            console.log("Error fetching Project data:", error);
        }
    };

    getProjects();
}, [user.userId]);

  
  useEffect(() => {
    const getData = async () => {
      const queryString = `?userId=${user.userId}&startdate=${CurrentStartDate}&enddate=${CurrentEndDate}`;
      try {
        const response = await axios.get(`https://springboot-timesheet-azure.azurewebsites.net/Timesheet/EmployeeTimeentries/Customdate${queryString}`);
        console.log(response)
        setfetchTimeEntries(response.data)
      } catch(error) {
        console.log('Error while fetching:', error)
      }
  }
  getData();
}, [CurrentStartDate])
  

  console.log(fetchProjects);

  const handleSubmit = async () => {
    const updatedProjects = [...projects]; // Create a copy of the projects array
    if (updatedProjects[projects.length - 1][0].projectEmployee.empID === "") {
      setalerttrigger("Project");
      return;
    }

    let isAnyHourEntered = false;
    updatedProjects[projects.length - 1].map((item) => {
      if (item.minutes != "") {
        isAnyHourEntered = true;
      }
    });
    if (!isAnyHourEntered) {
      setalerttrigger("Time");
      return;
    }

    try {
      const response = await axios.post(
        "https://springboot-timesheet-azure.azurewebsites.net/Timesheet/EmployeeTimeentries/EmployeeUserProjectCreate",
        projects
      );
      console.log(response);
    } catch (error) {
      console.log("Error while fetching:", error);
    }
  };

  return (
    <div>
      <div className="m-5">
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

      <div className="w-11/12 m-auto">
        {projects.length != 0 ? (
          <>
            <table className="">
              <thead>
                <tr>
                  <th className="border border-gray-300 p-2">
                    Select a Project
                  </th>
                  {dateRange?.map((day, index) => (
                    <th key={day} className="border border-gray-300 p-2">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
              {fetchTimeEntries?.map((project, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 p-2">
                      <select
                        value={selectedEmpIDs[index]}
                        onChange={(e) => {
                          const updatedEmpIDs = [...selectedEmpIDs];
                          updatedEmpIDs[index] = e.target.value;
                          setalerttrigger("");
                          // Update the selectedEmpIDs state
                          setSelectedEmpIDs(updatedEmpIDs);
                          updateEmpIDForArray(index, e.target.value);
                        }}
                      >
                        <option value=''>--Select a Project--</option>
                        {fetchProjects?.map((projectOption) => (
                          <option
                            key={projectOption.empID}
                            value={projectOption.empID}
                          >
                            {projectOption.empID +
                              " - " +
                              projectOption.projectName}
                          </option>
                        ))}
                      </select>
                    </td>
                    {projects[index]?.map((day, subindex) => (
                      <td key={`${index}-${subindex}`} className="border border-gray-300 p-2">
                        <input
                          type="text"
                          placeholder="Enter Hours"
                          value={day.minutes}
                          min={0}
                          onChange={(e) =>
                            handleChange(index, subindex, e.target.value)
                          }
                          className="border rounded p-2 w-11/12"
                        />
                      </td>
                    ))}
                    <td className="flex justify-center">
                      <IconButton onClick={() => deleteProjectArray(index)}><DeleteTwoTone color="error"/></IconButton>
                      {project == projects[projects.length-1] && <IconButton onClick={addProjectArray}><AddCircle color="info"/></IconButton>}
                    </td>
                  </tr>
                ))}

                {projects?.map((project, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 p-2">
                      <select
                        value={selectedEmpIDs[index]}
                        onChange={(e) => {
                          const updatedEmpIDs = [...selectedEmpIDs];
                          updatedEmpIDs[index] = e.target.value;
                          setalerttrigger("");
                          // Update the selectedEmpIDs state
                          setSelectedEmpIDs(updatedEmpIDs);
                          updateEmpIDForArray(index, e.target.value);
                        }}
                      >
                        <option value=''>--Select a Project--</option>
                        {mockprojectData?.map((projectOption) => (
                          <option
                            key={projectOption.empID}
                            value={projectOption.empID}
                          >
                            {projectOption.empID +
                              " - " +
                              projectOption.projectName}
                          </option>
                        ))}
                      </select>
                    </td>
                    {projects[index]?.map((day, subindex) => (
                      <td key={`${index}-${subindex}`} className="border border-gray-300 p-2">
                        <input
                          type="text"
                          placeholder="Enter Hours"
                          value={day.minutes}
                          min={0}
                          onChange={(e) =>
                            handleChange(index, subindex, e.target.value)
                          }
                          className="border rounded p-2 w-11/12"
                        />
                      </td>
                    ))}
                    <td className="flex justify-center">
                      <IconButton onClick={() => deleteProjectArray(index)}><DeleteTwoTone color="error"/></IconButton>
                      {project == projects[projects.length-1] && <IconButton onClick={addProjectArray}><AddCircle color="info"/></IconButton>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              className="mt-4 bg-green-500 float-right text-white p-2 rounded"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </>
        ) : (
          <Typography variant="h3">(Select the Week)</Typography>
        )}
      </div>
      {alerttrigger == "Project" && (
        <SimpleSnackbar
          message="Please Select a project"
          setalerttrigger={setalerttrigger}
        />
      )}
      {alerttrigger == "Time" && (
        <SimpleSnackbar
          message="Please enter a time"
          setalerttrigger={setalerttrigger}
        />
      )}
    </div>
  );
};

export default WeekWiseTimeentries;