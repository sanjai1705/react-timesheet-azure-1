import './App.css';
import '../src/index.css'
import TimeEntries from './components/TimeEntries/TimeEntries';
import { ColorModeContext, useMode } from './themes';
import { CssBaseline, ThemeProvider } from '@mui/material';
import Topbar from './scenes/global/Topbar'
import SideBar from './scenes/global/Sidebar'
import Dashboard from './scenes/dashboard/index'
import { Route, Routes } from 'react-router-dom';
import React, { createContext, useState, useEffect } from 'react';
import LoginForm from './components/LoginForm';
import Employee from './scenes/employee/Employee';
import Manager from './scenes/manager/Manager';
import ViewTimesheet from './components/ViewTimesheet/ViewTimesheet';
import Approval from './components/Approvals/Approval';
import ViewSubmitted from './components/TimeEntries/ViewSubmitted';
import Samplepage from './components/Calendar/Samplepage';
import TimesheetReports from './components/TimesheetReports/TimesheetReports';
import PdfGeneration from './components/TimesheetReports/PdfGeneration';

export const AuthContext = createContext();

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('userData')) || null);

  // Function to set the user when logged in
  const login = (userData) => {
    setUser(userData);
    // Store user data in localStorage
    localStorage.setItem('userData', JSON.stringify(userData));
  };

  // Function to log out and clear the user data
  const logout = () => {
    setUser(null);
    // Remove user data from localStorage
    localStorage.removeItem('userData');
  };

  useEffect(() => {
    // Check if user data exists in localStorage and restore the user's session
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
      setUser(userData);
    }
  }, []);

  return (
  <ColorModeContext.Provider value={colorMode}>
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      <AuthContext.Provider value={{ user, login, logout }}>
            <Routes>
              <Route path='/' element={<LoginForm/>}/>
              <Route path='e' element={<Employee/>}>
                <Route index element={<Dashboard/>}/>
                <Route path='timeentries' element={<TimeEntries/>}/>
                <Route path='viewtimesheet' element={<ViewTimesheet/>}/>
                <Route path='viewsubmitted' element={<ViewSubmitted/>}/>
                <Route path='calendar' element={<Samplepage/>}/>
              </Route>
              <Route path='m' element={<Manager/>}>
                <Route index element={<Dashboard/>}/>
                <Route path='timeentries' element={<TimeEntries/>}/>
                <Route path='viewtimesheet' element={<ViewTimesheet/>}/>
                <Route path='approvals' element={<Approval/>}/>
                <Route path='calendar' element={<Samplepage/>}/>
                <Route path='timesheetreports' element={<TimesheetReports/>}/>
              </Route>
              <Route path='/generateReport' element={<PdfGeneration/>}/>
            </Routes>
      </AuthContext.Provider>
    </ThemeProvider>
  </ColorModeContext.Provider>
  );
}

export default App;
