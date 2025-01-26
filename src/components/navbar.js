// src/components/Navbar.js

import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { isMobile } from "react-device-detect";
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
  useTheme,
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import navLogo from "../assets/MMCL_Logo_Nav.png";
import LoginModal from "./loginmodal";
import { useAuth } from "../context/AuthContext";
import { useModalContext } from "../context/modalcontext";
import axios from "axios";

const Navbar = () => {
  const { user, logout } = useAuth();
  const theme = useTheme();
  const isLoggedIn = !!user;
  const isSizeMobile = useMediaQuery("(max-width:600px)");

  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const [anchorElDash, setAnchorElDash] = useState(null);

  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef < HTMLButtonElement > null;
  const navigate = useNavigate();
  const location = useLocation();

  const {
    isLoginModalOpen,
    openLoginModal,
    closeLoginModal,
    openSignupModal,
    closeSignupModal,
    openPassresetModal,
    closePassresetModal,
  } = useModalContext();

  // Add this style object for active buttons
  const activeButtonStyle = {
    position: "relative",
    color: "#CA031B", // Match the underline color
    "&:after": {
      content: '""',
      position: "absolute",
      bottom: 0, // Aligns the underline closely below the text
      left: 0,
      width: "100%",
      height: "3px", // Thickness of the underline
      backgroundColor: "#CA031B",
    },
    "&:hover": {
      color: "#a8031b", // Darker shade on hover
    },
  };

  // Update buttonSettings to include active state
  const buttonSettings = {
    color: "#001C43",
    fontFamily: "Montserrat, sans-serif",
    fontWeight: 600,
    fontSize: {
      xs: "0.25rem",
      sm: "0.25rem",
      md: "0.60rem",
      lg: "0.75rem",
    },
    marginRight: {
      xs: "0.75rem",
      sm: "0.50rem",
      md: "0.25rem",
    },
    padding: {
      xs: "0rem 0.25rem",
      sm: "0.25rem 0.5rem",
      md: "0.25rem 0.5rem",
    },
    "&:hover": {
      backgroundColor: "rgba(202, 3, 27, 0.04)",
    },
  };

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

  const handleProfile = () => {
    navigate("/profile");
  };

  const handleAboutUs = () => {
    navigate("/aboutus");
  };

  const handleHelp = () => {
    navigate("/help");
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

  const handleViewAuditLog = () => {
    navigate("/auditlog");
  };

  const handleMainDash = () => {
    navigate("/dash/analytics");
  };

  const handleUserEngagementDash = () => {
    navigate("/dash/user-engagement");
  };

  const handleReports = () => {
    navigate("/dash");
  };

  const handleResesearchTrack = () => {
    navigate("/researchtracking");
  };

  const handleNavigateHome = () => {
    navigate("/home");
  };

  const handleKnowledgeGraph = () => {
    navigate("/knowledgegraph");
  };

  const handleBackup = () => {
    navigate("/backup");
  };

  const handleLogout = async () => {
    try {
      const response = await axios({
        method: "post",
        url: "http://localhost:5000/auth/logout",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true,
      });

      if (response.status === 200) {
        // Clear the token from storage
        localStorage.removeItem("token");
        // Update auth context state
        logout();
        // Close any open menus
        handleCloseUserMenu();
        // Navigate to home
        navigate("/home", { replace: true });
      }
    } catch (error) {
      console.error("Logout error:", error);
      // Still perform logout actions even if the server request fails
      localStorage.removeItem("token");
      logout();
      handleCloseUserMenu();
      navigate("/home", { replace: true });
    }
  };

  const mobileMenuItems = user
    ? [
        //{ label: "Home", onClick: handleNavigateHome },
        { label: "Collections", onClick: handleCollection },
        { label: "Knowledge Graph", onClick: handleKnowledgeGraph },
        { label: "Research Thrusts", onClick: handleResearchThrust },
        { label: "Profile", onClick: handleProfile },
        { label: "About Us", onClick: handleAboutUs },
        { label: "Help", onClick: handleHelp },
      ]
    : [
        { label: "Home", onClick: handleNavigateHome },
        { label: "Log in", onClick: handleLogin },
      ];

  // Define which menu items are available for each role
  const getNavbarItems = () => {
    if (!user) return [];

    // Common items for all roles
    const commonItems = [
      { label: "Collections", onClick: handleCollection },
      { label: "Research Thrusts", onClick: handleResearchThrust },
    ];

    if (isMobile || isSizeMobile) {
      // On mobile, only return common items
      return commonItems;
    }

    // Role-specific items
    const roleSpecificItems = {
      "01": [
        // System Administrator
        { label: "Manage Users", onClick: handleManageUsers },
        { label: "Manage Colleges", onClick: handleManageCollege },
        { label: "Manage Programs", onClick: handleManageProgram },
        { label: "View Audit Logs", onClick: handleViewAuditLog },
        { label: "Backup", onClick: handleBackup },
      ],
      "02": [
        // Director
        { label: "Dashboard", onClick: handleOpenDashMenu },
        { label: "Research Tracking", onClick: handleResesearchTrack },
        ...commonItems,
      ],
      "03": [
        // Head Executive
        { label: "Dashboard", onClick: handleOpenDashMenu },
        { label: "Research Tracking", onClick: handleResesearchTrack },
        ...commonItems,
      ],
      "04": [
        // College Administrator
        { label: "Dashboard", onClick: handleOpenDashMenu },
        ...commonItems,
      ],
      "05": [
        // Program Administrator
        {
          label: "Institutional Performance Dashboard",
          onClick: handleReports,
        },
        { label: "Research Tracking", onClick: handleResesearchTrack },
        ...commonItems,
      ],
      "06": [
        // Researcher
        ...commonItems,
      ],
    };

    return (
      roleSpecificItems[user.role]?.map((item) => ({
        ...item,
        isActive: location.pathname === getPathFromLabel(item.label),
      })) || commonItems
    );
  };

  // Helper function to get path from label
  const getPathFromLabel = (label) => {
    const pathMap = {
      Collections: "/collection",
      "Research Thrusts": "/researchthrust",
      Dashboard: "/dash",
      "Manage Users": "/manage-users",
      "Manage Colleges": "/managecollege",
      "Manage Programs": "/manageprogram",
      "View Audit Logs": "/auditlog",
      Backup: "/backup",
      "Research Tracking": "/researchtracking",
      "Knowledge Graph": "/knowledgegraph",
      Home: "/home",
    };
    return pathMap[label] || "/";
  };

  return (
    <AppBar
      position='fixed'
      sx={{
        backgroundColor: "#FFF",
        height: {
          xs: "4rem",
          sm: "4.5rem",
          md: "5rem",
        },
        zIndex: theme.zIndex.appBar,
      }}
    >
      <Toolbar
        sx={{
          height: "100%",
          display: "flex",
          flexWrap: "nowrap",
          justifyContent: "space-between",
          alignItems: "center",
          px: { xs: 2, sm: 2, md: 3 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexGrow: { xs: 1, md: 0 },
          }}
        >
          <IconButton
            onClick={null}
            sx={{
              p: 0,
              width: { xs: "3rem", sm: "3.5rem", md: "4rem", lg: "5rem" },
              height: { xs: "3rem", sm: "3.5rem", md: "4rem", lg: "5rem" },
            }}
          >
            <img
              src={navLogo}
              alt='Logo'
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                padding: "0.5rem",
              }}
            />
          </IconButton>
          <Divider
            orientation='vertical'
            flexItem
            sx={{
              mx: { xs: 1.5, md: 2 },
              borderColor: "#CA031B",
              height: { xs: "2rem", md: "2rem" },
              borderWidth: { xs: "1px", sm: "1px", md: "2px" },
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
                fontSize: {
                  xs: "0.7rem",
                  sm: "0.75rem",
                  md: "0.75rem",
                  lg: "1rem",
                },
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
                fontSize: {
                  xs: "0.7rem",
                  sm: "0.75rem",
                  md: "0.75rem",
                  lg: "1rem",
                },
                lineHeight: { xs: "1.2", md: "1.2" },
              }}
            >
              Research Repository
            </Typography>
          </Box>
        </Box>

        {/*Navigation Buttons*/}
        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 3 }}>
          {!isLoggedIn ? (
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                gap: { md: 1, lg: 2 },
              }}
            >
              <Button onClick={handleNavigateHome} sx={buttonSettings}>
                Home
              </Button>
              <Button onClick={handleResearchThrust} sx={buttonSettings}>
                Research Thrusts
              </Button>
              <Button onClick={handleLogin} sx={buttonSettings}>
                Log in
              </Button>
            </Box>
          ) : (
            <Box sx={{ display: "flex", gap: 2 }}>
              {getNavbarItems().map((item, index) => (
                <Button
                  key={index}
                  onClick={item.onClick}
                  sx={{
                    ...buttonSettings,
                    ...(item.isActive ? activeButtonStyle : {}),
                  }}
                  endIcon={
                    item.label === "Dashboard" ||
                    item.label === "System Management" ? (
                      <KeyboardArrowDownIcon
                        style={{
                          color: item.isActive ? "#CA031B" : "red", // Match underline color
                          fontSize: 30,
                        }}
                      />
                    ) : null
                  }
                >
                  {item.label}
                </Button>
              ))}
              <IconButton
                onClick={handleOpenUserMenu}
                sx={{
                  color: "#CA031B",
                  fontSize: { xs: "2rem", md: "2rem", lg: "3rem" },
                }}
              >
                <AccountCircleIcon fontSize='inherit' />
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
              key='Log out'
              onClick={() => {
                handleLogout();
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
          <MenuItem onClick={handleAboutUs}>
            <Typography color='common.white'>About Us</Typography>
          </MenuItem>
          <MenuItem onClick={handleHelp}>
            <Typography color='common.white'>Help</Typography>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout}>
            <Typography color='common.white'>Log out</Typography>
          </MenuItem>
        </Menu>

        {/*Dashboard Menu*/}
        {/* Render Menus Conditionally */}
        {(!isMobile || !isSizeMobile) &&
          (user?.role === "02" ||
            user?.role === "03" ||
            user?.role === "04") && (
            <Menu
              anchorEl={anchorElDash}
              open={Boolean(anchorElDash)}
              onClose={handleCloseDashMenu}
              sx={{ "& .MuiPaper-root": { backgroundColor: "#CA031B" } }}
            >
              <MenuItem onClick={handleReports}>
                <Typography color='common.white'>
                  Institutional Performance Dashboard
                </Typography>
              </MenuItem>
              <MenuItem onClick={handleMainDash}>
                <Typography color='common.white'>
                  SDG Impact Dashboard
                </Typography>
              </MenuItem>
              <MenuItem onClick={handleUserEngagementDash}>
                <Typography color='common.white'>
                  User Engagament Dashboard
                </Typography>
              </MenuItem>
            </Menu>
          )}
      </Toolbar>
      <LoginModal />
    </AppBar>
  );
};

export default Navbar;
