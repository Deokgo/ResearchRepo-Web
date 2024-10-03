// src/components/Navbar.js

import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import {
  AppBar,
  Box,
  Button,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import navLogo from "../assets/MMCL_Logo_Nav.png";

const Navbar = () => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  const isMobile = useMediaQuery("(max-width:600px)");

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleProfile = () => {
    navigate("/profile");
  };

  const handleManageUsers = () => {
    navigate("/manage-users");
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleNavigateHome = () => {
    navigate("/home");
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  const mobileMenuItems = isLoggedIn
    ? [
        { label: "Home", onClick: handleNavigateHome },
        { label: "Communities & Collections", onClick: handleCloseNavMenu },
        { label: "Profile", onClick: handleProfile },
        { label: "Manage Users", onClick: handleManageUsers },
      ]
    : [
        { label: "Home", onClick: handleNavigateHome },
        { label: "Log in", onClick: handleLogin },
      ];

  return (
    <AppBar
      position='fixed'
      sx={{
        backgroundColor: "#FFF",
        height: { xs: "3.5rem", sm: "4rem", md: "6rem" },
      }}
    >
      <Toolbar
        sx={{
          height: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: "0rem" }}>
          <IconButton
            onClick={handleNavigateHome}
            sx={{
              p: 0,
              width: { xs: "2.5rem", md: "5rem" },
              height: { xs: "2.5rem", md: "5rem" },
            }}
          >
            <img
              src={navLogo}
              alt='Logo'
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          </IconButton>
          <Divider
            orientation='vertical'
            flexItem
            sx={{
              mx: 2,
              borderColor: "#CA031B",
              height: { xs: "1.5rem", md: "2rem" },
              borderWidth: "2px",
              alignSelf: "center",
            }}
          />
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              cursor: "pointer",
            }}
            onClick={handleNavigateHome}
          >
            <Typography
              variant='h6'
              sx={{
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 600,
                color: "#CA031B",
                fontSize: { xs: "1.2rem", md: "1.5rem" },
                textAlign: { xs: "center", md: "inherit" },
                mr: 1,
              }}
            >
              Institutional
            </Typography>
            <Typography
              variant='h6'
              sx={{
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 600,
                color: "#001C43",
                fontSize: { xs: "1.2rem", md: "1.5rem" },
                textAlign: { xs: "center", md: "inherit" },
                lineHeight: { xs: "1.2", md: "inherit" },
              }}
            >
              Repository
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 3 }}>
          <Button
            key='Home'
            onClick={handleNavigateHome}
            sx={{
              my: 2,
              color: "#001C43",
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 600,
            }}
          >
            Home
          </Button>
          <Button
            key='Communities & Collections'
            onClick={handleCloseNavMenu}
            sx={{
              my: 2,
              color: "#001C43",
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 600,
            }}
          >
            Communities & Collections
          </Button>

          {!isLoggedIn ? (
            <Button
              key={"Log in"}
              onClick={handleLogin}
              sx={{
                my: 2,
                color: "#CA031B",
                fontSize: "1rem",
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 600,
              }}
            >
              Log in
            </Button>
          ) : (
            <IconButton
              size='large'
              onClick={handleOpenUserMenu}
              sx={{ color: "#CA031B" }}
            >
              <AccountCircleIcon sx={{ fontSize: "2rem" }} />
            </IconButton>
          )}
        </Box>
        <Box sx={{ display: { xs: "flex", md: "none" } }}>
          <IconButton
            size='large'
            aria-label='menu'
            aria-controls='menu-appbar'
            aria-haspopup='true'
            onClick={handleOpenNavMenu}
            sx={{ color: "#CA031B" }}
          >
            <MenuIcon />
          </IconButton>

          <Menu
            id='menu-appbar'
            anchorEl={anchorElNav}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorElNav)}
            onClose={handleCloseNavMenu}
            sx={{ "& .MuiPaper-root": { backgroundColor: "#CA031B" } }}
          >
            {mobileMenuItems.map((menuItem, index) => (
              <MenuItem
                key={index}
                onClick={() => {
                  menuItem.onClick();
                  handleCloseNavMenu();
                }}
              >
                <Typography textAlign='center' sx={{ color: "#FFF" }}>
                  {menuItem.label}
                </Typography>
              </MenuItem>
            ))}

            <Divider sx={{ borderColor: "#FFF" }} />
            <MenuItem
              key='Log in'
              onClick={() => {
                handleLogin();
                handleCloseNavMenu();
              }}
            >
              <Typography textAlign='center'>Log out</Typography>
            </MenuItem>
          </Menu>
        </Box>
        <Menu
          anchorEl={anchorElUser}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={Boolean(anchorElUser)}
          onClose={handleCloseUserMenu}
          sx={{ "& .MuiPaper-root": { backgroundColor: "#CA031B" } }}
        >
          <MenuItem onClick={handleProfile}>
            <Typography>Profile</Typography>
          </MenuItem>
          <MenuItem onClick={handleManageUsers}>
            <Typography>Manage Users</Typography>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout}>
            <Typography>Log out</Typography>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
