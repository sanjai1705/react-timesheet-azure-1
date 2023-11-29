import axios from "axios";
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

const Samplepage = () => {
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
      const response = await axios.put(`http://localhost:8080/Timesheet/EmployeeTimeentries/Update/${editableArray.timesheetId}`, editableArray)
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
          `http://localhost:8080/Timesheet/ProjectEmployee/user/${user.userId}`
        );
        console.log(response1);
        const projects1 = response1.data.map((item) => ({
          empID: item.empID,
          projectName: item.project.projectName,
        }));

        // Second API call
        /*const response2 = await axios.get(
          `http://localhost:8080/Timesheet/Project/applicable?applicable=true`
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
        setfetchProjects(uniqueProjects.map((project) => JSON.parse(project)));*/
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
        `http://localhost:8080/Timesheet/EmployeeTimeentries/empty-status/user/${user.userId}`
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
        "http://localhost:8080/Timesheet/EmployeeTimeentries/EmployeeUserProjectCreate1",
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
      const response = await axios.delete(`http://localhost:8080/Timesheet/EmployeeTimeentries/Delete/${timesheetId}`)
      console.log(response)
    } catch(error) {
      console.log('Error while changing status:', error)
    }
  }

  const handleStatusSubmit = async() => {
    const queryString = `?userId=${user.userId}&startId=${fetchTimeEntries[0].timesheetId}&endId=${fetchTimeEntries[fetchTimeEntries.length-1].timesheetId}`;
    try {
      const response = await axios.post(`http://localhost:8080/Timesheet/EmployeeTimeentries/submit${queryString}`)
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

export default Samplepage;