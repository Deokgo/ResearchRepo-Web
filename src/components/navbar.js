// src/components/Navbar.js

import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
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
import LoginModal from "./loginmodal";
import { useAuth } from "../context/AuthContext";
import { useModalContext } from "./modalcontext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const isLoggedIn = !!user;

  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const [anchorElDash, setAnchorElDash] = useState(null);
  const [anchorElSyma, setAnchorElSyma] = useState(null);

  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef < HTMLButtonElement > null;
  const navigate = useNavigate();

  const {
    isLoginModalOpen,
    openLoginModal,
    closeLoginModal,
    openSignupModal,
    closeSignupModal,
    openPassresetModal,
    closePassresetModal,
  } = useModalContext();

  const isMobile = useMediaQuery("(max-width:600px)");

  {
    /*****************Event Handlers******************/
  }

  {
    /*Logged Out*/
  }
  const handleResearchThrust = () => {
    navigate("/researchthrust");
  };

  const handleLogin = () => {
    openLoginModal();
  };

  const handleCloseLoginModal = () => {
    closeLoginModal();
  };

  const handleOpenSignupModal = () => {
    openSignupModal();
  };

  const handleCloseSignupModal = () => {
    closeSignupModal();
  };

  const handleOpenPassresetModal = () => {
    openPassresetModal();
  };

  const handleClosePassresetModal = () => {
    closePassresetModal();
  };

  {
    /*Logged In*/
  }
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleOpenDashMenu = (event) => {
    setAnchorElDash(event.currentTarget);
  };

  const handleCloseDashMenu = () => {
    setAnchorElDash(null);
  };

  const handleOpenSymaMenu = (event) => {
    setAnchorElSyma(event.currentTarget);
  };

  const handleCloseSymaMenu = () => {
    setAnchorElSyma(null);
  };

  const handleProfile = () => {
    navigate("/profile");
  };

  const handleCollection = () => {
    navigate("/collection");
  };

  const handleManageUsers = () => {
    navigate("/manage-users");
  };

  const handleManageCollege = () => {
    navigate("/managecollege");
  };

  const handleManageProgram = () => {
    navigate("/manageprogram");
  };

  const handleKnowledgeGraph = () => {
    navigate("/knowledgegraph");
  };

  const handleMainDash = () => {
    navigate("/publication");
  };

  const handleReports = () => {
    navigate("/maindash");
  };

  const handleResesearchTrack = () => {
    navigate("/researchtracking");
  };

  const handleManagePapers = () => {
    navigate("/managepapers");
  };

  const handleNavigateHome = () => {
    navigate("/home");
  };

  const handleLogout = () => {
    logout();
    navigate("/home");
  };

  const mobileMenuItems = user
    ? [
        { label: "Home", onClick: handleNavigateHome },
        { label: "Research Thrusts", onClick: handleResearchThrust },
        { label: "Profile", onClick: handleProfile },
        { label: "Manage Users", onClick: handleManageUsers },
      ]
    : [
        { label: "Home", onClick: handleNavigateHome },
        { label: "Log in", onClick: handleLogin },
      ];

  const buttonSettings = {
    my: 2,
    color: "#001C43",
    fontFamily: "Montserrat, sans-serif",
    fontWeight: 600,
    marginRight: "1rem",
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
            onClick={null}
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
                padding: 10,
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
              flexDirection: "column",
              alignItems: "left",
              cursor: "pointer",
            }}
            onClick={null}
          >
            <Typography
              variant='h6'
              sx={{
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 600,
                color: "#CA031B",
                fontSize: { xs: "1.2rem", md: "1.25rem" },
                textAlign: { xs: "center", md: "inherit" },
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
                fontSize: { xs: "1.2rem", md: "1.25rem" },
                textAlign: { xs: "center", md: "inherit" },
                lineHeight: { xs: "0.5" },
                paddingBottom: "0.75rem",
              }}
            >
              Research Repository
            </Typography>
          </Box>
        </Box>

        {/*Navigation Buttons*/}
        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 3 }}>
          {!isLoggedIn ? (
            <Box sx={{ display: { xs: "none", md: "flex" }, gap: 3 }}>
              <Button
                key='Home'
                onClick={handleNavigateHome}
                sx={buttonSettings}
              >
                Home
              </Button>
              <Button
                key='Research Thrusts'
                onClick={handleResearchThrust}
                sx={buttonSettings}
              >
                Research Thrusts
              </Button>
              <Button key={"Log in"} onClick={handleLogin} sx={buttonSettings}>
                Log in
              </Button>
            </Box>
          ) : (
            <Box>
              <Button
                key='Dashboard'
                onClick={handleOpenDashMenu}
                endIcon={
                  <KeyboardArrowDownIcon
                    style={{ color: "red", fontSize: 30 }}
                  />
                }
                sx={buttonSettings}
              >
                Dashboard
              </Button>
              <Button
                key='Collections'
                onClick={handleCollection}
                sx={buttonSettings}
              >
                Collections
              </Button>
              <Button
                key='ResearchTracking'
                onClick={handleResesearchTrack}
                sx={buttonSettings}
              >
                Research Tracking
              </Button>
              <Button
                key='ResearchThrust'
                onClick={handleResearchThrust}
                sx={buttonSettings}
              >
                Research Thrusts
              </Button>
              <Button
                key='SystemManagement'
                onClick={handleOpenSymaMenu}
                endIcon={
                  <KeyboardArrowDownIcon
                    style={{ color: "red", fontSize: 30 }}
                  />
                }
                sx={buttonSettings}
              >
                System Management
              </Button>
              <IconButton
                size='large'
                onClick={handleOpenUserMenu}
                sx={{ color: "#CA031B" }}
              >
                <AccountCircleIcon sx={{ fontSize: "3.5rem" }} />
              </IconButton>
            </Box>
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
              vertical: "bottom",
              horizontal: "center",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "center",
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

        {/*User Menu*/}
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
            <Typography color='common.white'>Profile</Typography>
          </MenuItem>
          <MenuItem onClick={null}>
            <Typography color='common.white'>Contact Us</Typography>
          </MenuItem>
          <MenuItem onClick={null}>
            <Typography color='common.white'>Help</Typography>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout}>
            <Typography color='common.white'>Log out</Typography>
          </MenuItem>
        </Menu>

        {/*Dashboard Menu*/}
        <Menu
          anchorEl={anchorElDash}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={Boolean(anchorElDash)}
          onClose={handleCloseDashMenu}
          sx={{ "& .MuiPaper-root": { backgroundColor: "#CA031B" } }}
        >
          <MenuItem onClick={handleReports}>
            <Typography color='common.white'>Reports</Typography>
          </MenuItem>
          <MenuItem onClick={handleMainDash}>
            <Typography color='common.white'>Analytics</Typography>
          </MenuItem>
          <MenuItem onClick={handleKnowledgeGraph}>
            <Typography color='common.white'>Knowledge Graph</Typography>
          </MenuItem>
        </Menu>

        {/*System Management Menu*/}
        <Menu
          anchorEl={anchorElSyma}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={Boolean(anchorElSyma)}
          onClose={handleCloseSymaMenu}
          sx={{ "& .MuiPaper-root": { backgroundColor: "#CA031B" } }}
        >
          <MenuItem onClick={handleManageUsers}>
            <Typography color='common.white'>Manage Users</Typography>
          </MenuItem>
          <MenuItem onClick={handleManageCollege}>
            <Typography color='common.white'>Manage College</Typography>
          </MenuItem>
          <MenuItem onClick={handleManageProgram}>
            <Typography color='common.white'>Manage Program</Typography>
          </MenuItem>
        </Menu>
      </Toolbar>
      <LoginModal />
    </AppBar>
  );
};

export default Navbar;
