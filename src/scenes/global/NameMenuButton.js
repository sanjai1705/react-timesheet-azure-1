import { ArrowDropDown, LogoutOutlined, PersonOutlined } from "@mui/icons-material";
import { Button, Menu, MenuItem } from "@mui/material";
import React from "react";
import { useContext } from "react";
import { AuthContext } from "../../App";
import { useNavigate } from "react-router-dom";

const NameMenuButton = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate()

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = () => {
    navigate("/");
    logout();
  };
  return (
    <div>
      <Button sx={{ border: 1 }} onClick={handleClick}>
        {user.username}
        <ArrowDropDown />
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={()=>navigate('/u/profile')}>
          <PersonOutlined /> Profile
        </MenuItem>
        <MenuItem onClick={() => handleLogout()}>
          <LogoutOutlined /> Logout
        </MenuItem>
      </Menu>
    </div>
  );
};

export default NameMenuButton;
