// src/components/Navbar.js

import MenuIcon from "@mui/icons-material/Menu";
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
  const navigate = useNavigate();
  const pages = ["Home", "Communities & Collections", "Log out"];
  const isMobile = useMediaQuery("(max-width:600px)");

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleLogin = () => {
    navigate("/login");
  };

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
            }}
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
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            gap: 3,
          }}
        >
          {pages.slice(0, 2).map((page) => (
            <Button
              key={page}
              onClick={handleCloseNavMenu}
              sx={{
                my: 2,
                color: "#001C43",
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 600,
              }}
            >
              {page}
            </Button>
          ))}
          <Button
            key={"Log out"}
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
            {pages.slice(0, 2).map((page) => (
              <MenuItem key={page} onClick={handleCloseNavMenu}>
                <Typography textAlign='center' sx={{ color: "#FFF" }}>
                  {page}
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
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
