import { useContext, useState } from "react";
import logo from '../../zadroit logo.png'
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../themes"
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import { ApprovalOutlined, ArticleOutlined, ManageAccounts, TodayOutlined, ViewAgendaOutlined } from "@mui/icons-material";
import { AuthContext } from "../../App";


const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => {setSelected(title);   sessionStorage.setItem('currentPage', to);
    }}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [selected, setSelected] = useState("Profile");
  const {user} = useContext(AuthContext)

  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Box>
                  <img src={logo} className="w-2/3" />
                </Box>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>
          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            <Item
              title="Profile"
              to={'/u/profile'}
              icon={<PersonOutlinedIcon/>}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="TimeSheet"
              to={'/u/timeentries'}
              icon={<TodayOutlined/>}
              selected={selected}
              setSelected={setSelected}
            />
            {/*
            <Item
              title="View TimeSheet"
              to={'/u/viewtimesheet'}
              icon={<ViewAgendaOutlined/>}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="SamplePage"
              to={'/u/samplepage'}
              icon={<CalendarTodayOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />*/}
            {user.role=='Manager' &&
             <Item
              title="Approvals"
              to={'/u/approvals'}
              icon={<ApprovalOutlined/>}
              selected={selected}
              setSelected={setSelected}
            />}
            {user.role=='Manager' &&
             <Item
              title="Timesheet Reports"
              to={'/u/timesheetreports'}
              icon={<ArticleOutlined/>}
              selected={selected}
              setSelected={setSelected}
            />}
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;