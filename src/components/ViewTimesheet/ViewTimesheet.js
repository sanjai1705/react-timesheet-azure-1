import {
  Button,
  ButtonGroup,
  Menu,
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

const ViewTimesheet = () => {
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


  const handleSelectionChange = (selectionModel) => {
    // Update the state with the selected rows
    setSelectedRows(selectionModel);
    console.log(selectionModel)
  };
  console.log(selectedRows)


  
  const getDATA = async (startDate, endDate) => {
    try {
      const fetchData = fetchManEmpInfo?.map(async (item) => {
        const response = await axios.get(`https://springboot-timesheet-azure.azurewebsites.net/Timesheet/EmployeeTimeentries/submitted/user/${item.user1.userId}`);
        return response.data;
      });
      const responseData = await Promise.all(fetchData);
      console.log(responseData)
      const combinedData = responseData.flat(); // Flatten the array
      console.log(combinedData);
  
      // Update the state with the combined data
      const combinedDataWithIds = combinedData.map((data, index) => ({ ...data, id: index + 1 }));

    console.log(combinedDataWithIds);

    // Update the state with the combined data including ids
    setfetchEmpTimeEntries1(combinedDataWithIds);
    } catch (error) {
      console.error('Error fetching data from backend:', error);
    }
  };
  

  useEffect(() => {
    getDATA(selectedstartDate, selectedendDate)
  }, [fetchManEmpInfo])

  
  const columns = [
    { field: 'userId', headerName: 'UserID', width: 50, valueGetter: (params) =>
        `${params.row.user.userId || ''}`, },
    {
      field: 'fullName',
      headerName: 'Full name',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      width: 100,
      valueGetter: (params) =>
        `${params.row.user.firstname || ''} ${params.row.user.lastname || ''}`,
    },
    { field: 'date', headerName: 'Date',type: 'text', width: 100},
    { field: 'minutes', headerName: 'Hours Worked',type: 'number', width: 60, valueGetter: (params) =>
    `${params.row.minutes/60 || ''}`  },
    { field: 'status', headerName: 'Status', width: 60 },
    { field: 'task', headerName: 'Task', width:180 },
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
        rows={fetchEmpTimeEntries1}
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
   </div>
  );
}

export default ViewTimesheet
