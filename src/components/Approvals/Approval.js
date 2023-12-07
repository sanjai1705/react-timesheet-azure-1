import {
  Button,
  ButtonGroup,
  Menu,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useContext, useState, useEffect } from "react";
import dayjs from "dayjs";
import axios from "axios";
import { AuthContext } from "../../App";
import { useTheme } from "@emotion/react";
import { tokens } from "../../themes";
import { ArrowBackIosSharp, ArrowDropDown, ArrowForwardIosTwoTone } from "@mui/icons-material";
import { CalendarIcon } from "@mui/x-date-pickers";
import WeekPicker from "../WeekPicker";
import FormDialog from "../Dialog";
import { DataGrid } from "@mui/x-data-grid";

const Approval = () => {
  const { user } = useContext(AuthContext);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [value, setValue] = useState(dayjs(new Date()));
  const [fetchManEmpInfo, setfetchManEmpInfo] = useState(null);
  const [fetchEmpTimeEntries, setfetchEmpTimeEntries] = useState([]);
  const [fetchEmpTimeEntries1, setfetchEmpTimeEntries1] = useState([]);
  const [totalWorkingHours, settotalWorkingHours] = useState([])
  const [combinedRow, setcombinedRow] = useState([])
  const [selectedstartDate, setselectedstartDate] = useState();
  const [selectedendDate, setselectedendDate] = useState();
  const [selectedRows, setSelectedRows] = useState([]);

  const handleSelectionChange = (selectionModel) => {
    // Update the state with the selected rows
    setSelectedRows(selectionModel);
    console.log(selectionModel)
  };
  console.log(selectedRows)
  
  useEffect(() => {
    const fetchData = async () => {
      handleWeekPickerChange(new Date().toString());
    };
    fetchData();
  }, []);

  const getManEmpInfo = async () => {
    try {
      const response = await axios.get(
        `https://springboot-timesheet-azure.azurewebsites.net/Timesheet/EmployeeManager/Manager/${user.userId}`
      );
      setfetchManEmpInfo(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleWeekPickerChange = async (newValue) => {
    setValue(newValue)
    const currentDate = new Date(newValue);
    const startDate = new Date(currentDate);
    startDate.setDate(startDate.getDate() - startDate.getDay()); // Start of the week (Sunday)
  
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 6); // End of the week (Saturday)
  
    const startDateFormatted = startDate.toISOString().split("T")[0];
    const endDateFormatted = endDate.toISOString().split("T")[0];
    console.log('Updating startDate and endDate states');
    setselectedstartDate(() => startDateFormatted);
    setselectedendDate(() => endDateFormatted);
     // Run getManEmpInfo only once
     await getManEmpInfo();

  console.log('End handleWeekPickerChange');
  };

  useEffect(() => {
    getDATA(selectedstartDate, selectedendDate)
    handleclick(selectedstartDate, selectedendDate)
  }, [fetchManEmpInfo])
  
  const changeWeek = (direction) => {
    if(direction == 'prevWeek') {
      let tempDate = new Date(selectedstartDate);
      tempDate.setDate(tempDate.getDate() - 1);
      console.log(tempDate)
      handleWeekPickerChange(tempDate)
    }
    else if(direction == 'nextWeek') {
      let tempDate = new Date(selectedendDate);
      tempDate.setDate(tempDate.getDate() + 1);
      console.log(tempDate)
      handleWeekPickerChange(tempDate)
    }
  }

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };


  const getDATA=async(startDate, endDate)=>{
    console.log(`Start date of the week: ${startDate}`);    
    console.log(`End date of the week: ${endDate}`);
    try {
      const fetchData = fetchManEmpInfo?.map(async (item) => {
        const queryString = `${item.user1.userId}?startDate=${startDate}&endDate=${endDate}`;
        const response = await axios.get(`https://springboot-timesheet-azure.azurewebsites.net/Timesheet/DaywiseTimesheet/notempty-status/user/${queryString}`)
        console.log(response.data);
        return [response.data];
      })
      const responseData = await Promise.all(fetchData);
  
      // Combine the response data arrays into a single array
      const combinedData = responseData.reduce((acc, data) => acc.concat(data), []);
      const sortedCombinedData = combinedData.map(innerArray => {
        return innerArray.sort((a, b) => new Date(a.date) - new Date(b.date));
      });
      console.log(sortedCombinedData)
      // Update the state with the sorted data
      setfetchEmpTimeEntries1(sortedCombinedData);
    } catch (error) {
      // Handle any errors that occur during the process
      console.error('Error fetching data from backend:', error);
    }
  }

  const handleclick = async(startDate, endDate)=> {
    console.log(`Start date of the week: ${startDate}`);
    console.log(`End date of the week: ${endDate}`);
    settotalWorkingHours([])
    try {
      console.log(fetchManEmpInfo)
      // Use map to create an array of promises for making async requests
      const fetchData = fetchManEmpInfo?.map(async (item) => {
        const queryString = `?userId=${item.user1.userId}&startdate=${startDate}&enddate=${endDate}`;
        
        // Make an asynchronous axios GET request to fetch data
        const response = await axios.get(`https://springboot-timesheet-azure.azurewebsites.net/Timesheet/DaywiseTimesheet/Customdate${queryString}`);
        console.log(response.data);
        
        //const response1 = await axios.get(`https://springboot-timesheet-azure.azurewebsites.net/Timesheet/DaywiseTimesheet/CustomdateTotalworkinghours${queryString}`)
        //console.log(response1)
       //settotalWorkingHours((prevData) => [...prevData, response1.data]);
        // Return the data from each axios request as an array
        return [response.data];
      });
  
      // Wait for all promises (requests) to resolve using Promise.all
      const responseData = await Promise.all(fetchData);
      console.log(responseData)
  
      // Combine the response data arrays into a single array
      const combinedData = responseData.reduce((acc, data) => acc.concat(data), []);
      // Iterate through each inner array and sort the objects based on the date property
      const sortedCombinedData = combinedData.map(innerArray => {
        return innerArray.sort((a, b) => new Date(a.date) - new Date(b.date));
      });

      // Update the state with the sorted data
      setfetchEmpTimeEntries(sortedCombinedData);
    } catch (error) {
      // Handle any errors that occur during the process
      console.error('Error fetching data from backend:', error);
    }
  };


  const combineRows = async() => {
    if (fetchManEmpInfo && fetchEmpTimeEntries1 && fetchEmpTimeEntries1.length > 0) {
      const rows = fetchManEmpInfo.map((dataItem, index) => {
        let totWorkHours = 0;
  
        if (fetchEmpTimeEntries1[index] && fetchEmpTimeEntries1[index].length > 0) {
          fetchEmpTimeEntries1[index].forEach(item => {
            totWorkHours += item.totalWorkingHours;
          });
  
          // Determine the overall status based on the 'status' field in fetchEmpTimeEntries1
          const statuses = fetchEmpTimeEntries1[index].map(item => item.status && item.status.toLowerCase());
  
          let overallStatus = '';
          if (statuses && statuses.includes('submitted')) {
            overallStatus = 'Submitted';
          } else if (statuses && statuses.every(status => status === 'approved')) {
            overallStatus = 'Approved';
          } else if (statuses && statuses.every(status => status === 'rejected')) {
            overallStatus = 'Rejected';
          } else {
            overallStatus = 'NA';
          }
  
          return {
            id: dataItem.id,
            userId: dataItem.user1.userId,
            firstName: dataItem.user1.firstname,
            lastName: dataItem.user1.lastname,
            totalWorkHours: totWorkHours,
            desc: '',
            status: overallStatus,
            dialog: fetchEmpTimeEntries1[index],
          };
        } else {
          // Handle the case when fetchEmpTimeEntries1[index] is empty
          return {
            id: dataItem.id,
            userId: dataItem.user1.userId,
            firstName: dataItem.user1.firstname,
            lastName: dataItem.user1.lastname,
            totalWorkHours: 0, // or whatever default value you want
            desc: '',
            status: 'NA',
            dialog: [],
          };
        }
      });
  
      // Set the combined rows in the state
      setcombinedRow(rows);
    }
  }

  const handleApprove = async() => {
    try {
      selectedRows.map(async(item, index) => {
        if(item == combinedRow[index].id) {
          const queryString = `?userId=${combinedRow[index].userId}&startdate=${selectedstartDate}&enddate=${selectedendDate}`;
          const response = await axios.post(`https://springboot-timesheet-azure.azurewebsites.net/Timesheet/DaywiseTimesheet/approved${queryString}`)
          console.log(response)
        }
    })
    } catch(error) {
      console.log("Error while approving",error)
    }
  }

  const handleRejected = async() => {
    console.log(combinedRow[1])
    try {
      selectedRows.map(async(item, index) => {
        if(item == combinedRow[index].id) {
          const queryString = `?userId=${combinedRow[index].userId}&startDate=${selectedstartDate}&endDate=${selectedendDate}&description=${combinedRow[index].desc}`;
          const response = await axios.post(`https://springboot-timesheet-azure.azurewebsites.net/Timesheet/DaywiseTimesheet/rejected${queryString}`)
          console.log(response)
        }
    })
    } catch(error) {
      console.log("Error while rejecting", error)
    }
  }


  useEffect(() => {
    combineRows()
  }, [fetchEmpTimeEntries])


  console.log(fetchEmpTimeEntries1)
  console.log(fetchEmpTimeEntries);
  console.log(fetchManEmpInfo)
  console.log(totalWorkingHours)
  console.log(combinedRow)


  const columns = [
    { field: 'userId', headerName: 'UserID', width: 50 },
    {
      field: 'fullName',
      headerName: 'Full name',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      width: 100,
      valueGetter: (params) =>
        `${params.row.firstName || ''} ${params.row.lastName || ''}`,
    },
    { field: 'totalWorkHours', headerName: 'Total Working Hours',type: 'number', width: 60 },
    { field: 'status', headerName: 'Status', width: 60 },
    {
      field: 'dialog',
      headerName: 'Detailed View',
      width: 160,
      renderCell: (params) => (
        <FormDialog dayWiseTimeEntries={params}></FormDialog>
      ),
    },
    { field: 'desc', headerName: 'Desc', width:180, editable: true },
  ];

  
    return (
    <div className="w-8/12 mx-auto">
       <div>
      <ButtonGroup
          variant="text"
          size="medium"
          sx={{ backgroundColor: colors.blueAccent[400] }}
        >
          <Button onClick={()=>changeWeek('prevWeek')}>
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
          <Button onClick={()=>changeWeek('nextWeek')}>
            <ArrowForwardIosTwoTone />
          </Button>
        </ButtonGroup>
    </div>
    {selectedstartDate && selectedendDate ? (
          <Typography variant="h4">
            {new Date(selectedstartDate).toDateString() + " - " + new Date(selectedendDate).toDateString()}
          </Typography>
        ) : null}


    <DataGrid
        rows={combinedRow}
        columns={columns}
        disableRowSelectionOnClick
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 7 },
          },
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        onRowSelectionModelChange={handleSelectionChange}
      />
      
      <button 
        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none"
        onClick={()=>handleApprove()}
      >
          Approve
        </button>
      <button 
      className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none"
      onClick={()=>handleRejected()}
      >
        Reject
        </button>
    </div>
  );
};

export default Approval;

/* import React, { useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function AccordionComponent() {
  const [isTableVisible, setIsTableVisible] = useState(false);

  const handleAccordionClick = () => {
    setIsTableVisible(!isTableVisible);
  };

  return (
    <Accordion onClick={handleAccordionClick}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Date 1 - Date 2 | Total Working Hours</Typography>
        <Button variant="contained" color="primary">
          Accept
        </Button>
        <Button variant="contained" color="secondary">
          Reject
        </Button>
      </AccordionSummary>
      <AccordionDetails>
        {isTableVisible && <TableComponent />}
      </AccordionDetails>
    </Accordion>
  );
}

function TableComponent() {
  // Replace this with your table data
  const tableData = [
    { id: 1, name: 'John Doe', hours: 40 },
    { id: 2, name: 'Jane Smith', hours: 32 },
    // Add more rows as needed
  ];

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Total Hours</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tableData.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.id}</TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.hours}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default AccordionComponent;
*/
