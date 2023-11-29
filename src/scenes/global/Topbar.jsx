import React, { createContext } from 'react'
import { Box, Button, IconButton, InputBase, Menu, MenuItem, Typography, useTheme } from '@mui/material'
import { useContext } from 'react'
import { ColorModeContext, tokens } from '../../themes'
import { LightModeOutlined, DarkModeOutlined, NotificationsOutlined,
         SettingsOutlined, PersonOutline, Search, PersonOutlined, LogoutOutlined, ArrowDropDown} from '@mui/icons-material'
import { AuthContext } from '../../App'
import { mockDataTeam } from '../../data/mockData'
import { Navigate, useNavigate } from 'react-router-dom'

const Topbar = () => {
  const {user, logout} = useContext(AuthContext)
  const navigate = useNavigate();

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

  
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = () => {
    navigate('/')
    logout();
  };
  /*
  const storedTheme = localStorage.getItem('theme');

// Determine the initial theme based on localStorage or system preferences
if (storedTheme === 'dark' || !storedTheme ) {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}

  const handleDarkmode=()=>{
    if (document.documentElement.classList.contains('dark')) {
      // If currently in dark mode, switch to light mode
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      // If currently in light mode, switch to dark mode
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  }
  */
  
  return (
    <Box display="flex" justifyContent="space-between" p={2}>
      {/* SEARCH BAR */}
      <Box textAlign="center">
           
      </Box>

      {/* ICONS */}
      <Box>
        {/*<IconButton onClick={()=>{colorMode.toggleColorMode()}}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlined />
          ) : (
            <LightModeOutlined />
          )}
          </IconButton>*/}
          
        <Button sx={{border: 1}} onClick={handleClick}>
          {user.username}<ArrowDropDown/>
        </Button>
        <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem><PersonOutlined/> Profile</MenuItem>
        <MenuItem onClick={()=>handleLogout()}><LogoutOutlined/> Logout</MenuItem>
      </Menu>
      </Box>
    </Box>
  );
}

export default Topbar
