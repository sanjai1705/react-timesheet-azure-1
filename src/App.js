import './App.css';
import '../src/index.css'
import TimeEntries from './components/TimeEntries/TimeEntries';
import { ColorModeContext, useMode } from './themes';
import { CssBaseline, ThemeProvider } from '@mui/material';
import Dashboard from './scenes/dashboard/index'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import React, { createContext, useState, useEffect } from 'react';
import LoginForm from './components/LoginForm';
import ViewTimesheet from './components/ViewTimesheet/ViewTimesheet';
import Approval from './components/Approvals/Approval';
import ViewSubmitted from './components/TimeEntries/ViewSubmitted';
import Samplepage from './components/Samplepage/Samplepage';
import TimesheetReports from './components/TimesheetReports/TimesheetReports';
import PdfGeneration from './components/TimesheetReports/PdfGeneration';
import Userpage from './scenes/userpage/Userpage';
import Forgotpassword from './scenes/global/Forgotpassword';
import ResetPassword from './scenes/global/Resetpassword';

export const AuthContext = createContext();

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('userData')) || null);
  const navigate = useNavigate(); // Import useNavigate from react-router-dom

  // Function to set the user when logged in
  const login = (userData) => {
    const userDataWithTimestamp = { ...userData, loginTime: Date.now() };
    setUser(userDataWithTimestamp);
    
    // Store user data in localStorage
    localStorage.setItem('userData', JSON.stringify(userDataWithTimestamp));
  };

  // Function to log out and clear the user data
  const logout = () => {
    setUser(null);
    // Remove user data from localStorage
    localStorage.removeItem('userData');
    sessionStorage.removeItem('currentPage');
  };


  /*useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));

    if (userData) {
      const { loginTime } = userData;
      const expirationTime = loginTime + 70 * 60 * 60 * 1000; // 70 hours in milliseconds

      if (Date.now() < expirationTime) {
        // If user data is not expired, set the user and navigate to the dashboard
        setUser(userData);

        // Check if there's any stored page information
        /*const storedPage = sessionStorage.getItem("currentPage");
        if (storedPage) {
          // If there's a stored page, navigate to that page and clear the storage
          navigate(storedPage);
          //sessionStorage.removeItem('currentPage');
        } else {
          // If no stored page, navigate to the dashboard
          navigate("/u/profile");
        }

        navigate("/u/timeentries");

      } else {
        // If user data is expired, clear user data and navigate to login
        logout();
        navigate("/login");
        
      }
    } else if ((!window.location.pathname.startsWith("/reset")) && (!window.location.pathname.startsWith("/forgotpass"))) {
      // If user data doesn't exist, navigate to the login page
      navigate("/login");
    }
  }, [setUser]); */


  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if(userData == null) {
      if ((!window.location.pathname.startsWith("/reset")) && (!window.location.pathname.startsWith("/forgotpass"))) {
        navigate("/login");
      }
    } else {
      const { loginTime } = userData;
      const expirationTime = loginTime + 70 * 60 * 60 * 1000; // 1/10 hours in milliseconds

      if (Date.now() > expirationTime) {
        logout();
        navigate("/login"); 
      }
      else {
        const storedPage = sessionStorage.getItem("currentPage")
        if (storedPage) {
          // If there's a stored page, navigate to that page and clear the storage
          navigate(storedPage);
          //sessionStorage.removeItem('currentPage');
        } else {
          // If no stored page, navigate to the dashboard
          navigate("/u/timeentries");
        }
      }
    }

  }, [setUser]);

  const ProtectedRoute = ({ element, allowedRoles }) => {

    if (user && allowedRoles.includes(user.role)) {
      return element;
    } else {
      // Redirect to dashboard if user is not authorized
      return <Navigate to="/u/profile" />;
    }
  };

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthContext.Provider value={{ user, login, logout }}>
          <Routes>
          {user ? (
              <>
              <Route path="/u" element={<Userpage/>}>
                <Route path="profile" element={<Dashboard />} onleave/>
                <Route path="timeentries" element={<TimeEntries />} />
                <Route path="viewtimesheet" element={<ViewTimesheet />} />
                <Route path="viewsubmitted" element={<ViewSubmitted />} />
                <Route
                  path="approvals"
                  element={
                    <ProtectedRoute
                      element={<Approval />}
                      allowedRoles={["Admin", "Manager"]}
                    />
                  }
                />
                <Route
                  path="timesheetreports"
                  element={
                    <ProtectedRoute
                      element={<TimesheetReports />}
                      allowedRoles={["Admin", "Manager"]}
                    />
                  }
                />
                <Route path="samplepage" element={<Samplepage />} />
            </Route>
            <Route path="/u/*" element={<Navigate to='/u/profile'/>} />
            <Route
              path="/generateReport"
              element={
                <ProtectedRoute
                  element={<PdfGeneration />}
                  allowedRoles={["Admin", "Manager"]}
                />
              }
            />
            </>
          ) : (
            <>
             <Route path="/login" element={<LoginForm />} />
            
            <Route path="*" element={<Navigate to="/login" />} />

            <Route path="/forgotpass" element={<Forgotpassword/>}/>

            <Route path="/reset" element={<ResetPassword/>} />
            </>
          )}
           
          </Routes>
        </AuthContext.Provider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
