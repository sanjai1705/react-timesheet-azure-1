/*import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../App";
import {
  AddCircle,
  DeleteTwoTone,
  Done,
  EditTwoTone,
} from "@mui/icons-material";
import { mockprojectData } from "../../data/mockData";
import SimpleSnackbar from "../Snackbar";
import { useNavigate } from "react-router-dom";

const Approval = () => {
  const { user, logout } = useContext(AuthContext);
  const [Entry, setEntry] = useState([
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
  ]);
  const [fetchProjects, setfetchProjects] = useState([]);
  const [fetchTimeEntries, setfetchTimeEntries] = useState();
  const [editableIndex, seteditableIndex] = useState(null);
  const [editableArray, seteditableArray] = useState();

  const handleEditClick = (index) => {
    getPrevTimeEntries()
    seteditableIndex(index);
    const array = fetchTimeEntries[index];
    array.minutes = array.minutes / 60;
    seteditableArray(array);
  };
  console.log(editableArray);

  const handleDoneClick =  async() => {
    editableArray.minutes=editableArray.minutes*60
    try {
      const response = await axios.put(`${API_BASE_URL}/EmployeeTimeentries/Update/${editableArray.timesheetId}`, editableArray)
      console.log(response)
    } catch (error) {
      console.log("Error while updating", error);
    }
    seteditableArray()
    seteditableIndex()
    getPrevTimeEntries()
  };

  const navigate = useNavigate();
  useEffect(() => {
    const getProjects = async () => {
      try {
        // First API call
        const response1 = await axios.get(
          `${API_BASE_URL}/ProjectEmployee/user/${user.userId}`
        );
        console.log(response1);
        const projects1 = response1.data.map((item) => ({
          empID: item.empID,
          projectName: item.project.projectName,
        }));

        // Second API call
        ///*
        const response2 = await axios.get(
          `${API_BASE_URL}/Project/applicable?applicable=true`
        );
        console.log(response2);
        const projects2 = response2.data.map((item) => ({
          empID: item.projectId,
          projectName: item.projectName,
        }));

        const uniqueProjects = Array.from(
          new Set([...projects1, ...projects2]),
          (project) => JSON.stringify(project)
        );
        setfetchProjects(uniqueProjects.map((project) => JSON.parse(project)));
        //
        setfetchProjects(projects1)
      } catch (error) {
        console.log("Error fetching Project data:", error);
      }
    };

    getProjects();
  }, [user.userId]);

  useEffect(() => {
    getPrevTimeEntries();
  }, []);

  const getPrevTimeEntries = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/EmployeeTimeentries/empty-status/user/${user.userId}`
      );
      console.log(response);
      setfetchTimeEntries(response.data);
    } catch (error) {
      console.log("Error while fetching:", error);
    }
  };
  

  const handleEntryArrayChange = (action, index) => {
    if (action == "add") {
      const newEntry = {
        user: {
          userId: user.userId,
        },
        date: "",
        projectEmployee: {
          empID: "",
        },
        minutes: "",
        task: "",
      };

      setEntry([...Entry, newEntry]);
    } else if (action == "remove") {
      if (Entry.length > 1) {
        const newArray = [...Entry];
        newArray.splice(index, 1);
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
      }
    }
  };
  console.log(Entry);

  const handleFieldChange = (index, field, value) => {
    setEntry((prevEntry) => {
      const newEntry = [...prevEntry];
      newEntry[index][field] = value;
      return newEntry;
    });
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

  const handleDelete = async(timesheetId) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/EmployeeTimeentries/Delete/${timesheetId}`)
      console.log(response)
    } catch(error) {
      console.log('Error while changing status:', error)
    }
  }

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

  return (
    <div>
      <div className="w-4/5 mx-auto p-2 flex justify-end gap-2">
        <button
          className="bg-stone-300 p-1 hover:bg-stone-400 focus:outline-none"
          onClick={() => navigate("/employee/viewsubmitted")}
        >
          View Submitted
        </button>
      </div>
      <form onSubmit={handleValidate}>
        <div className="overflow-x-auto">
          <table className="w-4/5 mx-auto my-0 rounded-lg shadow-md overflow-hidden text-gray-500 dark:text-gray-400">
            <thead>
              <tr className="text-xs text-left text-gray-700 bg-gray-300 border-b uppercase dark:bg-gray-700 dark:text-gray-400">
                <th className="p-4">Date</th>
                <th className="p-4">Project</th>
                <th className="p-4">Hours</th>
                <th className="p-4">Task</th>
                <th className="p-2"></th>
              </tr>
            </thead>
            <tbody>
              {fetchTimeEntries?.sort((a, b) => new Date(a.date) - new Date(b.date)).map((item, index) => (
                <tr className={editableIndex !== index ? "p-1 border-b bg-white" : "p-1 border-b bg-blue-200"}>
                  <td>
                    <input
                      readOnly={editableIndex !== index}
                      type="date"
                      required
                      value={
                        editableIndex !== index ? item.date : editableArray.date
                      }
                      max={new Date().toISOString().split("T")[0]}
                      onChange={(e) =>
                        seteditableArray({
                          ...editableArray,
                          date: e.target.value,
                        })
                      }
                      className="w-full p-1.5 bg-slate-100 border border-transparent rounded-md focus:outline-none focus:border-gray-200 focus:bg-slate-200"
                    ></input>
                  </td>
                  <td>
                    <select
                      disabled={editableIndex !== index}
                      required
                      className="w-full p-2 bg-slate-100 border border-transparent rounded-md focus:outline-none focus:border-gray-200 focus:bg-slate-200"
                      value={
                        editableIndex !== index
                          ? item.projectEmployee.empID
                          : editableArray.projectEmployee.empID
                      }
                      onChange={(e) =>
                        seteditableArray({
                          ...editableArray,
                          projectEmployee: {
                            ...editableArray.projectEmployee,
                            empID: e.target.value,
                          },
                        })
                      }
                    >
                      <option value="">Select a Project</option>
                      {fetchProjects?.map((emp) => (
                        <option key={emp.empID} value={emp.empID}>
                          {emp.empID + " - " + emp.projectName}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <input
                      readOnly={editableIndex !== index}
                      required
                      type="text"
                      placeholder="Enter hours"
                      className="w-full p-2 bg-slate-100 border border-transparent rounded-md focus:outline-none focus:border-gray-200 focus:bg-slate-200"
                      value={
                        editableIndex !== index
                          ? item.minutes / 60
                          : editableArray.minutes
                      }
                      onChange={(e) =>
                        seteditableArray({
                          ...editableArray,
                          minutes: e.target.value,
                        })
                      }
                    ></input>
                  </td>
                  <td>
                    <input
                      readOnly={editableIndex !== index}
                      required
                      placeholder="Task"
                      value={
                        editableIndex !== index ? item.task : editableArray.task
                      }
                      onChange={(e) =>
                        seteditableArray({
                          ...editableArray,
                          task: e.target.value,
                        })
                      }
                      size={60}
                      className="w-full p-2 bg-slate-100 border border-transparent rounded-md focus:outline-none focus:border-gray-200 focus:bg-slate-200"
                    ></input>
                  </td>
                  <td>
                    <div className="flex justify-center gap-3">
                      {editableIndex === index ? (
                        <button onClick={handleDoneClick}>
                          <Done />
                        </button>
                      ) : (
                        <button onClick={() => handleEditClick(index)}>
                          <EditTwoTone />
                        </button>
                      )}
                      {editableIndex === index && (
                      <button
                        type="button"
                        className="bg-transparent p-1 rounded-full hover:bg-slate-100"
                        onClick={()=>handleDelete(item.timesheetId)}
                      >
                        <DeleteTwoTone color="error" />
                      </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {Entry?.map((item, index) => (
                <tr key={index}>
                  <td className="p-1 border-b bg-white">
                    <input
                      type="date"
                      required
                      max={new Date().toISOString().split("T")[0]}
                      value={item.date}
                      className="w-full p-1.5 bg-slate-100 border border-transparent rounded-md focus:outline-none focus:border-gray-200 focus:bg-slate-200"
                      onChange={(e) =>
                        handleFieldChange(index, "date", e.target.value)
                      }
                    ></input>
                  </td>
                  <td className="p-1 border-b bg-white">
                    <select
                      required
                      className="w-full p-2 bg-slate-100 border border-transparent rounded-md focus:outline-none focus:border-gray-200 focus:bg-slate-200"
                      value={item.projectEmployee.empID}
                      onChange={(e) =>
                        handleFieldChange(index, "projectEmployee", {
                          empID: e.target.value,
                        })
                      }
                    >
                      <option value="">Select a Project</option>
                      {fetchProjects?.map((emp) => (
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
                        handleFieldChange(index, "minutes", e.target.value)
                      }
                    ></input>
                  </td>
                  <td className="p-1 border-b bg-white">
                    <input
                      required
                      placeholder="Task"
                      value={item.task}
                      onChange={(e) =>
                        handleFieldChange(index, "task", e.target.value)
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
                        onClick={() => handleEntryArrayChange("remove", index)}
                      >
                        <DeleteTwoTone color="error" />
                      </button>
                      {item == Entry[Entry.length - 1] && (
                        <button
                          type="submit"
                          className="bg-transparent p-1 rounded-full hover:bg-slate-100"
                        >
                          <AddCircle color="info" />
                        </button>
                      )}
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
        <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none"
                onClick={()=>handleStatusSubmit()}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default Approval;*/


/* -------   The Above contains task wise time entry page   -------------- */




import axios from "axios";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../App";
import { PlaylistRemove } from "@mui/icons-material";
import { Typography } from "@mui/material";
import Close from "@mui/icons-material/Close";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import API_BASE_URL from "../../apiConfig";

const Approval = () => {
  const { user } = useContext(AuthContext);
  const [fetchManEmpInfo, setfetchManEmpInfo] = useState(null);
  const [fetchEmpTimeEntries, setfetchEmpTimeEntries] = useState([]);
  const [projectNames, setProjectNames] = useState([]);
  const [userNames, setUserNames] = useState([]);
  const [dates, setDates] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [rejectionReasons, setRejectionReasons] = useState([]);
  const [selectedReason, setSelectedReason] = useState("");
  const [selectedReasonOption, setSelectedReasonOption] = useState("new");

  const [filters, setFilters] = useState({
    date: "",
    minutes: "",
    status: "",
    projectName: "",
    fullName: "",
  });

  const [openDialog, setOpenDialog] = useState(false);
  const [sameReason, setSameReason] = useState("");

  useEffect(() => {
    getManEmpInfo();
  }, []);

  useEffect(() => {
    getDATA();
  }, [fetchManEmpInfo]);

  useEffect(() => {
    // Initialize sets to store unique values
    const uniqueProjectNames = new Set();
    const uniqueUserNames = new Set();
    const uniqueDates = new Set();

    // Iterate over fetchEmpTimeEntries to extract unique values
    fetchEmpTimeEntries.forEach((row) => {
      uniqueProjectNames.add(row.projectEmployee.project.projectName);
      uniqueUserNames.add(row.user.firstname + " " + row.user.lastname);
      uniqueDates.add(row.date);
    });

    // Convert sets to arrays and update state
    setProjectNames(Array.from(uniqueProjectNames));
    setUserNames(Array.from(uniqueUserNames));
    // Convert set of dates to array, sort in ascending order, and update state
    setDates(Array.from(uniqueDates).sort((a, b) => new Date(a) - new Date(b)));
  }, [fetchEmpTimeEntries]);

  const getManEmpInfo = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/EmployeeManager/Manager/${user.userId}`
      );
      setfetchManEmpInfo(response.data);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getDATA = async () => {
    try {
      const fetchData = fetchManEmpInfo?.map(async (item) => {
        const response = await axios.get(
          `${API_BASE_URL}/EmployeeTimeentries/submitted/user/${item.user1.userId}`
        );
        return response.data;
      });
      const responseData = await Promise.all(fetchData);
      console.log(responseData);
      const combinedData = responseData.flat(); // Flatten the array
      console.log(combinedData);

      // Update the state with the combined data
      const combinedDataWithIds = combinedData.map((data, index) => ({
        ...data,
        id: index + 1,
      }));

      console.log(combinedDataWithIds);

      // Update the state with the combined data including ids
      setfetchEmpTimeEntries(combinedDataWithIds);
    } catch (error) {
      console.error("Error fetching data from backend:", error);
    }
  };

  const handleFilterChange = (column, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [column]: value,
    }));
  };

  const getFullName = (user) => `${user.firstname} ${user.lastname}`;

  const filteredData = fetchEmpTimeEntries?.filter((row) => {
    return Object.keys(filters).every((column) => {
      const filterValue = filters[column];

      // Handle nested properties and concatenated values
      let propertyValue;

      if (column === "fullName") {
        propertyValue = getFullName(row.user);
      } else if (column === "projectName") {
        propertyValue = row.projectEmployee.project.projectName;
      } else {
        const nestedProperties = column.split(".");
        propertyValue = nestedProperties.reduce((obj, prop) => obj[prop], row);
      }

      return String(propertyValue)
        .toLowerCase()
        .includes(filterValue.toLowerCase());
    });
  });

  // Function to handle checkbox click in the table header
  const handleHeaderCheckboxChange = (isChecked) => {
    if (isChecked) {
      // Select all rows
      setSelectedRows(filteredData.map((row) => row.timesheetId));
    } else {
      // Deselect all rows
      setSelectedRows([]);
    }
  };

  // Function to handle checkbox click in each row
  const handleRowCheckboxChange = (timesheetId, isChecked) => {
    if (isChecked) {
      // Add the row to the selectedRows array
      setSelectedRows((prevSelectedRows) => [...prevSelectedRows, timesheetId]);
    } else {
      // Remove the row from the selectedRows array
      setSelectedRows((prevSelectedRows) =>
        prevSelectedRows.filter((id) => id !== timesheetId)
      );
    }
  };

  const handleRemoveFilters = () => {
    setFilters({
      date: "",
      minutes: "",
      status: "",
      projectName: "",
      fullName: "",
    });
  };

  const handleRejectionReasonChange = (timesheetId, reason) => {
    setRejectionReasons((prevReasons) => {
      const updatedReasons = [...prevReasons];
      const existingReason = updatedReasons.find(
        (r) => r.timesheetId === timesheetId
      );

      if (existingReason) {
        existingReason.reason = reason;
      } else {
        updatedReasons.push({ timesheetId, reason });
      }

      return updatedReasons;
    });
  };

  const handleClearRejectionReason = (timesheetId) => {
    setRejectionReasons((prevReasons) =>
      prevReasons.filter((r) => r.timesheetId !== timesheetId)
    );
  };

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleUseSameReasonForAllChange = () => {
    if (selectedRows.length > 0) {
      handleDialogOpen();
    }
  };

  const handleDialogSubmit = () => {
    if (selectedReasonOption === "new") {
      // Set a new rejection reason for all selected rows
      setRejectionReasons((prevReasons) => {
        const updatedReasons = [...prevReasons];
        selectedRows.forEach((timesheetId) => {
          const existingReason = updatedReasons.find(
            (r) => r.timesheetId === timesheetId
          );
  
          if (existingReason) {
            existingReason.reason = sameReason;
          } else {
            updatedReasons.push({ timesheetId, reason: sameReason });
          }
        });
  
        handleDialogClose();
        return updatedReasons;
      });
    } else if (selectedReasonOption === "select") {
      // Set a previous rejection reason for all selected rows
      if (selectedReason) {
        setRejectionReasons((prevReasons) => {
          const updatedReasons = [...prevReasons];
          selectedRows.forEach((timesheetId) => {
            const existingReason = updatedReasons.find(
              (r) => r.timesheetId === timesheetId
            );
  
            if (existingReason) {
              existingReason.reason = selectedReason;
            } else {
              updatedReasons.push({ timesheetId, reason: selectedReason });
            }
          });
  
          handleDialogClose();
          return updatedReasons;
        });
      } else {
        // Handle the case where no reason is selected
        console.error("Please select a reason from the previous reasons.");
      }
    }
  };

  const mockRows = [9870, 9871];

  const handleApprove = async () => {
    try {
      mockRows.map(async (item) => {
        console.log(item);
        const response = await axios.post(
          `${API_BASE_URL}/EmployeeTimeentries/approved?timesheetId=${item}`
        );
        console.log(response);
      });
    } catch (error) {
      console.log("Error while approving", error);
    }
  }

  const handleReject = async () => {
    try {
      rejectionReasons.map(async (item, index) => {
        if(selectedRows.includes(item.timesheetId)) {
          const response = await axios.post(
            `https://springboot-timesheet-azure.azurewebsites.net/Timesheet/EmployeeTimeentries/rejected?timesheetId=${item.timesheetId}&rejectionDescription=${item.reason}`)
          console.log(response)
          }
      })
    } catch(error) {
      console.log('Error while Rejecting', error)
    }
  }

  console.log(selectedRows);
  console.log(rejectionReasons);
  return (
    <div className="container px-10 flex flex-col items-right gap-5 justify-center">
      {/* Add filter inputs */}
      <Typography variant="h2">Approve Timesheet</Typography>
      <div className="mb-4 flex items-center space-x-4">
        {/*<select
          className="p-2 bg-slate-200 border border-transparent rounded-md focus:outline-none focus:border-gray-900 focus:bg-white"
          value={filters.date}
          onChange={(e) => handleFilterChange("date", e.target.value)}
        >
          <option value="">Filter by Date</option>
          {dates.map((date, index) => (
            <option key={index} value={date}>
              {date}
            </option>
          ))}
          </select>*/}

        <select
          className="p-2 bg-slate-200 border border-transparent rounded-md focus:outline-none focus:border-gray-900 focus:bg-white"
          value={filters.projectName}
          onChange={(e) => handleFilterChange("projectName", e.target.value)}
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
          value={filters.fullName}
          onChange={(e) => handleFilterChange("fullName", e.target.value)}
        >
          <option value="">Filter by Name</option>
          {userNames.map((name, index) => (
            <option key={index} value={name}>
              {name}
            </option>
          ))}
        </select>
        <p
          className="text-red-500 cursor-pointer hover:underline"
          onClick={handleRemoveFilters}
        >
          <PlaylistRemove color="warning" />
          remove filters
        </p>
      </div>

      {/* Table */}
      <table className="w-full border">
        <thead>
          <tr className="bg-slate-500 text-white">
            <th className="border pl-1">
              <input
                type="checkbox"
                checked={selectedRows.length === filteredData.length}
                onChange={(e) => handleHeaderCheckboxChange(e.target.checked)}
              />
              <span className="ml-1">S.No</span>
            </th>
            <th className="border p-1">Name</th>
            <th className="border p-1">Date</th>
            <th className="border p-1">Project</th>
            <th className="border p-1">Login Time</th>
            <th className="border p-1">Logout Time</th>
            <th className="border p-1">Hours</th>
            <th className="border p-1 w-5/12">Rejection Reason</th>
          </tr>
        </thead>
        <tbody>
          {filteredData?.map((row, index) => (
            <tr key={index}>
              <td className="border pl-1">
                <input
                  type="checkbox"
                  checked={selectedRows.includes(row.timesheetId)}
                  onChange={(e) =>
                    handleRowCheckboxChange(row.timesheetId, e.target.checked)
                  }
                ></input>
                <span className="ml-1">{row.id}</span>
              </td>
              <td className="border p-1">
                {row.user.firstname + " " + row.user.lastname}
              </td>
              <td className="border p-1">{row.date}</td>
              <td className="border p-1">
                {row.projectEmployee.project.projectName}
              </td>
              <td className="border p-1">{row.login}</td>
              <td className="border p-1">{row.logout}</td>
              <td className="border p-1">{row.minutes / 60}</td>
              <td className="border p-1 w-5/12">
                {/* Input field for rejection reason */}
                <input
                  type="text"
                  value={
                    (rejectionReasons.find((r) => r.timesheetId === row.timesheetId) || {}).reason || ""
                  }
                  className={`w-11/12 ${
                    (rejectionReasons.find((r) => r.timesheetId === row.timesheetId) || {})
                      .reason
                      ? 'bg-slate-100'  // Background color when rejection reason is present
                      : ''
                  }`}
                  onChange={(e) =>
                    handleRejectionReasonChange(row.timesheetId, e.target.value)
                  }
                  placeholder="Enter Rejection Reason"
                />
                <span
                  className="bg-slate-100 rounded-lg hover:bg-slate-200"
                  onClick={() => handleClearRejectionReason(row.timesheetId)}
                >
                  <Close fontSize="sm" color="error" />
                </span>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="7" className="p-2 border text-left">
              {selectedRows.length > 0
                ? `${selectedRows.length} row${
                    selectedRows.length > 1 ? "s" : ""
                  } selected`
                : ""}
            </td>

            <td colSpan="1">
              {/*}
              <input
                type="checkbox"
                onChange={handleUseSameReasonForAllChange}
              />
                Enter same rejection reason for the selected rows*/}
              <button
                onClick={handleUseSameReasonForAllChange}
                className= "bg-red-200 p-2 rounded-sm hover:bg-red-300"
              >
                Enter same rejection reason for the selected rows
              </button>
            </td>

            <Dialog open={openDialog} onClose={handleDialogClose} fullWidth>
              <DialogTitle>Enter Rejection Reason</DialogTitle>
              <DialogContent>
                <div>
                  <label>
                    <input
                      type="radio"
                      name="reasonOption"
                      value="new"
                      checked={selectedReasonOption === "new"}
                      onChange={() => setSelectedReasonOption("new")}
                    />
                    Enter a new rejection reason
                  </label>
                  <TextField
                    autoFocus
                    margin="dense"
                    label="Rejection Reason"
                    fullWidth
                    value={sameReason}
                    onChange={(e) => setSameReason(e.target.value)}
                    disabled={selectedReasonOption !== "new"}
                  />
                </div>
                <p className="py-2 text-center text-lg">(or)</p>
                <div>
                  <label>
                    <input
                      type="radio"
                      name="reasonOption"
                      value="select"
                      checked={selectedReasonOption === "select"}
                      onChange={() => setSelectedReasonOption("select")}
                    />
                    Select from previous reasons
                  </label>
                  {selectedReasonOption === "select" && (
                    <div>
                      {rejectionReasons
                        .filter(
                          (reason, index, self) =>
                            index ===
                            self.findIndex((r) => r.reason === reason.reason)
                        )
                        .map((reasonObj) => (
                          <>
                            <div
                              key={reasonObj.id}
                              className={`cursor-pointer p-2 mb-1 ${
                                selectedReason === reasonObj.reason
                                  ? "bg-green-300"
                                  : "bg-slate-100 hover:bg-slate-200"
                              }`}
                              onClick={() =>
                                setSelectedReason(reasonObj.reason)
                              }
                            >
                              {reasonObj.reason}
                            </div>
                          </>
                        ))}
                    </div>
                  )}
                </div>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleDialogClose} color="primary">
                  Cancel
                </Button>
                <Button onClick={handleDialogSubmit}>Submit</Button>
              </DialogActions>
            </Dialog>
          </tr>
        </tfoot>
      </table>

      <div className="mt-4 flex space-x-4">
        <button
          className="p-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:border-green-700 focus:ring focus:ring-green-200"
          onClick={handleApprove}
        >
          Approve
        </button>

        <button 
        className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:border-red-700 focus:ring focus:ring-red-200"
        onClick={handleReject}
        >
          Reject
        </button>
      </div>
    </div>
  );
};

export default Approval;