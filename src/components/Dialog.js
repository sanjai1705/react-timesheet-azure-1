import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useEffect } from 'react';
import axios from 'axios';
import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, colors } from '@mui/material';


export default function FormDialog({ dayWiseTimeEntries }) {
  const [expandedRows, setExpandedRows] = useState([]);

  const handleRowClick = (date) => {
    setExpandedRows((prevExpandedRows) =>
      prevExpandedRows.includes(date)
        ? prevExpandedRows.filter((d) => d !== date)
        : [...prevExpandedRows, date]
    );
  };

  const [fetchTimeEntry, setfetchTimeEntry] = useState([])
  const [fetchDateTimeEntry, setfetchDateTimeEntry] = useState([])
  const [open, setOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(()=>{
    try{
      console.log(dayWiseTimeEntries)
      const sentData = dayWiseTimeEntries.value
      setfetchTimeEntry(sentData)
      const startDate = sentData[0].date
      const endDate = sentData[sentData.length - 1].date
      console.log(startDate, endDate)
      const queryString = `?userId=${sentData[0].user.userId}&startdate=${startDate}&enddate=${endDate}`;
      
      const fetchData = async() => {
        const response = await axios.get(`https://springboot-timesheet-azure.azurewebsites.net/Timesheet/EmployeeTimeentries/Customdate${queryString}`);
        console.log(response)
        const groupedByDate = {};

        // Group objects by date
        response.data.forEach(obj => {
          const date = obj.date;
          if (!groupedByDate[date]) {
            groupedByDate[date] = [];
          }
          groupedByDate[date].push(obj);
        });

        // Get an array of arrays from the grouped object
        const arrayOfArrays = Object.values(groupedByDate);

        // Sort the arrays based on the date
        arrayOfArrays.sort((a, b) => new Date(a[0].date) - new Date(b[0].date));

        console.log(arrayOfArrays)
        setfetchDateTimeEntry(arrayOfArrays)
      }
      fetchData()
    } catch (error){
      console.log('Error:', error)
    }
  }, [dayWiseTimeEntries])
  console.log(fetchTimeEntry)

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        Open Time Entries
      </Button>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth={'md'}>
        <DialogContent>
          <Table>
            <TableHead sx={{backgroundColor: colors.blueGrey[400]}}>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Working Hours</TableCell>
                <TableCell>Overtime</TableCell>
                <TableCell>Total Hours Worked</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
            {fetchTimeEntry?.map((item, index) => (
          <React.Fragment key={index}>
            <TableRow onClick={() => handleRowClick(item.date)} sx={{ cursor: 'pointer' }}>
              <TableCell>{item.date}</TableCell>
              <TableCell>{item.workingHours}</TableCell>
              <TableCell>{item.overtime}</TableCell>
              <TableCell>{item.totalWorkingHours}</TableCell>
              <TableCell>{item.status}</TableCell>
            </TableRow>
            {expandedRows.includes(item.date) && (
              <TableRow>
                <TableCell colSpan={5}>
                  {/* Render additional details based on the date */}
                  <Table sx={{backgroundColor: 'lightgrey'}}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Project Name</TableCell>
                        <TableCell>Login Time</TableCell>
                        <TableCell>Logout Time</TableCell>
                        <TableCell>Worked Hours</TableCell>
                        <TableCell>Task</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {fetchDateTimeEntry[index].map((detail, detailIndex) => (
                        <TableRow key={detailIndex}>
                          <TableCell>{detail.date}</TableCell>
                          <TableCell>{detail.projectEmployee.project.projectName}</TableCell>
                          <TableCell>{detail.login}</TableCell>
                          <TableCell>{detail.logout}</TableCell>
                          <TableCell>{detail.minutes/60}</TableCell>
                          <TableCell>{detail.task ? detail.task : '(No Task Filled)'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableCell>
              </TableRow>
            )}
          </React.Fragment>
        ))}
            </TableBody>
          </Table>



          
        </DialogContent>
      </Dialog>
    </div>
  );
}