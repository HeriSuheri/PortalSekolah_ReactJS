import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Tooltip,
  Avatar,
  Menu,
  MenuItem,
} from "@mui/material";
import { useAuth } from "../internal/AuthContext";
import LogoutIcon from "@mui/icons-material/Logout";
import SchoolIcon from "@mui/icons-material/School";
import { handleLogout } from "../util";
import { useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";

export default function Header({ toggleSidebar, openChangePasswordModal, openLogout }) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const user = JSON.parse(localStorage.getItem("userLogin"));
  

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    navigate("/profile");
    handleMenuClose();
  };

  const handleChangePassword = () => {
    // navigate("/change-password");
    openChangePasswordModal();
    handleMenuClose();
  };

  const handleLogoutClick = () => {
    // logout();
    // navigate("/");
    openLogout();
    handleMenuClose();
  };


  return (
    <AppBar
      position="fixed"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar sx={{ display: "flex", alignItems: "center" }}>
        {/* Sidebar Toggle + Logo + Title */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton onClick={toggleSidebar} sx={{ mr: 1 }}>
            <MenuIcon />
          </IconButton>
          <SchoolIcon />
          <Typography variant="h6" noWrap component="div">
            Portal Sekolah
          </Typography>
        </Box>

        {/* Spacer */}
        <Box sx={{ flexGrow: 1 }} />

        {/* Logout Button */}
        {/* <Tooltip title="Keluar">
          <IconButton color="inherit" onClick={onLogout}>
            <LogoutIcon />
          </IconButton>
        </Tooltip> */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <IconButton onClick={handleMenuOpen} color="inherit" sx={{ p: 0 }}>
            <Avatar
              src={`http://localhost:8080${user?.fotoProfil}`}
              sx={{ width: 32, height: 32 }}
            >
              {user?.nama?.charAt(0)}
            </Avatar>
          </IconButton>
          <Typography
            variant="body2"
            sx={{ mt: 0.5, textAlign: "center", fontSize: "10px" }}
          >
            {user?.nama}
          </Typography>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MenuItem onClick={handleProfile}>👤 Profile</MenuItem>
            <MenuItem onClick={handleChangePassword}>
              🔑 Change Password
            </MenuItem>
            <MenuItem onClick={handleLogoutClick}>🚪 Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
