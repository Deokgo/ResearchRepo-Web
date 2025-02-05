import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/navbar";
import { Box, Tabs, Tab, Tooltip, styled } from "@mui/material";
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
          <Tabs
            scrollButtons={false}
            orientation="vertical"
            variant="scrollable"
            value={selectedTab}
            onChange={(event, newValue) => setSelectedTab(newValue)}
            sx={{ borderRight: 1, 
              borderColor: "divider", 
              width: 90.5, 
              backgroundColor: "#08397C", 
              "& .MuiTab-root": { 
                color: "lightgrey", 
                minHeight: 60 ,
                "&:hover": { 
                  backgroundColor: "#0A4DA2", // Change background on hover
                  color: "white", // Change text color on hover
                }
              }, // Default text color
              "& .Mui-selected": { 
                color: "white", 
                fontWeight: "bold",
                backgroundColor: "#0C5ACF", // Background color for selected tab
               }, // Selected tab color
            }}
          >
            <Tab icon={<MenuIcon sx={{ fontSize: 30, minHeight: 60 }}/>}/>
            {user?.role !== "05" && (
               <CustomTooltip title="User Engagement" placement="right">
                <Tab icon={<SupervisedUserCircleIcon sx={{ fontSize: 30, minHeight: 60, color: "white" }}/>}/>
              </CustomTooltip>
            )}
            <CustomTooltip title="Institutional Performance" placement="right">
              <Tab icon={<TrackChangesIcon sx={{ fontSize: 30, minHeight: 60, color: "white" }}/>}/>
            </CustomTooltip>
            {user?.role !== "05" && (
              <CustomTooltip title="SDG Impact" placement="right">
                <Tab icon={<FlagIcon sx={{ fontSize: 30, minHeight: 60, color: "white" }}/>}/>
              </CustomTooltip>
            )}
            
          </Tabs>
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
