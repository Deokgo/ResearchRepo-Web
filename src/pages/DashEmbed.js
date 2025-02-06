import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Navbar from "../components/navbar";
import { Box, Tabs, Tab, Tooltip, styled, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import MenuIcon from '@mui/icons-material/Menu';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import FlagIcon from '@mui/icons-material/Flag';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import { useAuth } from "../context/AuthContext";

const DashEmbed = () => {
  const { user } = useAuth();
  const [dashUrl, setDashUrls] = useState(null);
  const [error, setError] = useState(null);
  const [selectedUrl, setSelectedUrl] = useState(null);
  const [selectedTab, setSelectedTab] = useState(2);
  const [expanded, setExpanded] = useState(false); // Track expansion

  // Add ref for the menu container
  const menuRef = useRef(null);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setExpanded(false);
      }
    };

    // Add event listener
    document.addEventListener('mousedown', handleClickOutside);
    
    // Cleanup
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Update iframe height on resize
  const updateIframeSize = () => {
    const iframe = document.getElementById("dashboard-iframe");
    if (iframe) {
      iframe.style.height = `${window.innerHeight + 10}px`; // Adjust this value based on your layout
    }
  };

  useEffect(() => {
    const fetchDashUrls = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No access token found.");
          return;
        }
  
        const response = await axios.get("/dash/combineddash", {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        if (response.data) {
          console.log("Returned Dash Data:", response.data); // Debugging
  
          const urls = Object.values(response.data); // Extract URLs from dictionary
          setDashUrls(urls);
          if (user?.role === "05"){
            setSelectedUrl(urls[0]); // Default to first URL
          } else {
            if (selectedTab === 0) { return; }
            setSelectedUrl(urls[selectedTab-1]); // Default to first URL
          }
          console.log(selectedTab);
        } else {
          setError("Failed to retrieve Dash app URLs.");
        }
      } catch (err) {
        setError(
          err.response?.data?.error || err.message || "Failed to load Dash app."
        );
      }
    };
  
    fetchDashUrls();
  }, [selectedTab]);

  useEffect(() => {
    window.addEventListener("resize", updateIframeSize);
    updateIframeSize(); // Call initially to set the size

    return () => {
      window.removeEventListener("resize", updateIframeSize);
    };
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!dashUrl) {
    return <div>Loading Dash app...</div>;
  }

  const CustomTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
    ))(({ theme }) => ({
      [`& .MuiTooltip-tooltip`]: {
        backgroundColor: "#08397C",
        color: "white",
        fontSize: "1rem",
        borderRadius: "8px",
        padding: "8px 12px",
        maxWidth: "100%", // Set a maximum width for the tooltip
        textAlign: "center", // Center-align text
        boxShadow: theme.shadows[3],
      },
      [`& .MuiTooltip-arrow`]: {
        color: "#08397C", // Same as backgroundColor to match
      },
    }));

  const handleMenuClick = () => {
    setExpanded((prev) => !prev);
  };

  const handleTabChange = (event, newValue) => {
    if (newValue === 0){
      return;
    }
    setSelectedTab(newValue);
    // Collapse menu if selecting any tab except the menu icon (index 0)
    if (newValue !== 0) {
      setExpanded(false);
    }
  };

  const tabSettings = {
    fontSize: '1rem', // Adjust label font size
    display: 'flex',
    flexDirection: 'row', // Make sure items flow horizontally
    alignItems: 'center', // Center items vertically
    justifyContent: 'flex-start', // Start from the left
    padding: '12px', // Add some padding
    '& .MuiTab-iconWrapper': {
      marginRight: 0, // Remove default icon margin
    }
  }

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        <Navbar />
        
        <Box sx={{ display: "flex", height: "100vh", paddingTop: "5rem" }}>
          <Box ref={menuRef} sx={{ display: "flex", height: "100vh" }}>
            <Tabs
              scrollButtons={false}
              orientation="vertical"
              value={selectedTab}
              onChange={handleTabChange}  // <-- Updated here
              sx={{ 
                borderRight: 1, 
                borderColor: "divider", 
                width: expanded ? 350 : 90.5, // Expand width
                transition: "width 0.1s ease-in-out", // Smooth animation
                backgroundColor: "#08397C", 
                "& .MuiTab-root": { 
                  color: "lightgrey", 
                  minHeight: 60 ,
                  justifyContent: expanded ? "flex-start" : "center", // Align left when expanded
                  "&:hover": { 
                    backgroundColor: "#0A4DA2", // Change background on hover
                    color: "white", // Change text color on hover
                  }
                }, // Default text color
                "& .Mui-selected": { 
                  fontColor: "white",
                  fontWeight: "bold",
                  backgroundColor: "#0C5ACF", // Background color for selected tab
                }, // Selected tab color
              }}
            >
              {expanded ? (
                <Typography
                  onClick={handleMenuClick}
                  color='white'
                  padding={3}
                  fontWeight='1000'
                  sx={{
                    cursor: 'pointer', // Add this line
                    textAlign: "start",
                    fontSize: {
                      xs: "clamp(1rem, 2vw, 0.6rem)",
                      sm: "clamp(1.5rem, 3.5vw, 0.7rem)",
                      md: "clamp(2rem, 4vw, 0.8rem)",
                    },
                  }}
                >
                  <MenuIcon sx={{ fontSize: 25, color: "white" }}/>&nbsp;Dashboard
                </Typography>
              ) : (
                <Tab icon={<MenuIcon sx={{ fontSize: 50, color: "white", padding: "0.5rem" }} />} 
                  label={expanded ? "Menu" : ""} 
                  onClick={handleMenuClick} 
                  sx={{ display: 'flex', alignItems: 'flex-start' }}
                />
              )}
              
              {user?.role !== "05" && (
                <CustomTooltip title="User Engagement" placement="right">
                  <Tab 
                    icon={<SupervisedUserCircleIcon sx={{ fontSize: 60, color: "white", padding: "0.9rem" }}/>}
                    label={expanded ? "User Engagement" : ""}
                    sx={tabSettings}
                  />
                </CustomTooltip>
              )}
              <CustomTooltip title="Institutional Performance" placement="right">
                <Tab 
                  icon={<TrackChangesIcon sx={{ fontSize: 60, color: "white", padding: "0.9rem" }}/>}
                  label={expanded ? "Institutional Performance" : ""}
                  sx={tabSettings}
                />
              </CustomTooltip>
              {user?.role !== "05" && (
                <CustomTooltip title="SDG Impact" placement="right">
                  <Tab 
                    icon={<FlagIcon sx={{ fontSize: 60, color: "white", padding: "0.9rem" }}/>}
                    label={expanded ? "SDG Impact" : ""}
                    sx={tabSettings}
                  />
                </CustomTooltip>
              )}
              
            </Tabs>
          </Box>
          <Box 
            sx={{
              flexGrow: 1,
              backgroundColor: "#f5f5f5",
              padding: 0,
              margin: 0,
              height: "100%", // Use remaining height
              overflow: "hidden",
            }}
          >
            <iframe
              id="dashboard-iframe"
              src={selectedUrl}
              style={{
                border: "none",
                width: "100%",
                height: "100%", // Take full height
                display: "block",
              }}
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              title="Dash App"
            />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default DashEmbed;
