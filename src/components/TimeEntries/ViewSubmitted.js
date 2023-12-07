import { ExpandMore } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, Box, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

const ViewSubmitted = () => {
  const history = useNavigate();
  const [fetchSubEntries, setfetchSubEntries] = useState(null)           //fetching submitted time entries

  useEffect(()=>{
    const getGroupedData = async() => {
      try{
        const response = await axios.get(`https://springboot-timesheet-azure.azurewebsites.net/Timesheet/DaywiseTimesheet/grouped`)
        console.log(response)
        const data = response.data
        data.map((timeStamps) => {
          timeStamps.sort((a, b) => new Date(a.date) - new Date(b.date))
        })
        setfetchSubEntries(data)
      } catch(error) {
        console.log('Error while fetching', error)
      }
    }
    getGroupedData()
  }, [])

  const workLog = [
    [
      { date: '2023-10-16', workingHours: 6, totalWorkingHours: 8, overtime: 2, status: 'Submitted' },
      { date: '2023-10-17', workingHours: 6, totalWorkingHours: 7, overtime: 1, status: 'Submitted' },
      { date: '2023-10-15', workingHours: 6, totalWorkingHours: 9, overtime: 3, status: 'Submitted' },
    ],
    [
      { date: '2023-10-16', workingHours: 4, totalWorkingHours: 6, overtime: 1, status: 'Submitted' },
      { date: '2023-10-17', workingHours: 4, totalWorkingHours: 8, overtime: 2, status: 'Submitted' },
      { date: '2023-10-08', workingHours: 4, totalWorkingHours: 7, overtime: 1, status: 'Submitted' },
    ],
  ];

  workLog.map((timeStamps, index) => {
    timeStamps.sort((a, b) => new Date(a.date) - new Date(b.date))
  })
  

  return (
    <div>
      <Typography variant='h3'>Submitted Timesheet</Typography>
      <button className='bg-slate-700 text-white p-2 rounded-md' onClick={()=>history(-1)}>Go Back</button>
      {fetchSubEntries != null ? (
        <div className="w-full my-5 max-w-2xl mx-auto">
        {fetchSubEntries?.map((timeStamps, index) => (
          <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls="panel2a-content"
            id="panel2a-header"
          >
            <Box sx={{display: 'flex', gap: '2rem'}}>
            <Typography variant='h5'>{timeStamps[0].date+' to '+timeStamps[timeStamps.length-1].date}</Typography>
            <Typography variant='h5' sx={{color: 'green'}}>{(timeStamps[0].status == 'Approved' || timeStamps[0].status == 'Submitted') && 'Submitted'}</Typography>
            <Typography variant='h5' sx={{color: 'red'}}>{timeStamps[0].status == 'Approved' ? 'Approved' : 'Not Yet Approved'}</Typography>
            </Box>
            
          </AccordionSummary>
              <AccordionDetails>
                <Table>
                  <TableHead sx={{backgroundColor: 'lightgrey'}}>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Working Hours</TableCell>
                      <TableCell>Overtime</TableCell>
                      <TableCell>Total Working Hours</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                  {timeStamps.map((item, subindex) => (
                    <TableRow key={subindex}>
                      <TableCell>{item.date}</TableCell>
                      <TableCell>{item.workingHours}</TableCell>
                      <TableCell>{item.overtime}</TableCell>
                      <TableCell>{item.totalWorkingHours}</TableCell>
                    </TableRow>
                  ))}
                  </TableBody>
                </Table>
              </AccordionDetails> 
        </Accordion>
        ))}
      </div>
      ) : (
        <h1 className="w-full my-5 max-w-2xl mx-auto">No Entries to show</h1>
      )}
    
    </div>
  )
}

export default ViewSubmitted
