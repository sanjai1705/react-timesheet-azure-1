import { Button, ButtonGroup, Container, Typography } from "@mui/material";
import WeekWiseTimeentries from "./WeekWiseTimeentries";
import { useEffect, useState } from "react";
import DayWiseTimeentries from "./DayWiseTimeentries";
import TaskWiseTimeentries from "./TaskWiseTimeentries";
import Example from "./Example";
import axios from "axios";

const TimeEntries = () => {
  const [toggleView, settoggleView] = useState('Example Wise')

  /*useEffect(() => {
    const getFlag = async()=>{
      try{
        const response = await axios.get(`https://springboot-timesheet-azure.azurewebsites.net/Timesheet/Flagcheck`)
        console.log(response.data[0].timesheetType)
        //settoggleView(response.data)
      } catch(error) {
        console.log('Error ')
      }
    }
    getFlag()
  }, [])*/

  return (
    <>
    <div className="grid grid-cols-2">
      {/*<Typography variant="h2" fontSize="bold">
      </Typography>
        <div className="grid grid-cols-4 mr-0 ml-auto w-3/6 divide-x bg-white border-solid border-2 rounded-b-lg">
          <button onClick={()=>settoggleView('Day Wise')} className={toggleView=='Day Wise' && 'bg-amber-200'}>Day Wise</button>
          <button onClick={()=>settoggleView('Week Wise')} className={toggleView=='Week Wise' && 'bg-amber-200'}>Week Wise</button>
          <button onClick={()=>settoggleView('Task Wise')} className={toggleView=='Task Wise' && 'bg-amber-200'}>Task Wise</button>
          <button onClick={()=>settoggleView('Example Wise')} className={toggleView=='Example Wise' && 'bg-amber-200'}>Example</button>
        </div>
  */}
    </div>
    {toggleView=='Day Wise' && <DayWiseTimeentries/> || toggleView=='Week Wise' && <WeekWiseTimeentries/> || toggleView=='Task Wise' && <TaskWiseTimeentries/> || toggleView=='Example Wise' && <Example/>}
    </>
  );
};

export default TimeEntries
