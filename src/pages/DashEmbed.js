import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/navbar";
import { Box, IconButton, Typography } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useNavigate } from "react-router-dom";
import HeaderWithBackButton from "../components/Header";

const DashEmbed = () => {
  const [dashUrl, setDashUrl] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Update iframe height on resize
  const updateIframeSize = () => {
    const iframe = document.getElementById("dashboard-iframe");
    if (iframe) {
      iframe.style.height = `${window.innerHeight - 100}px`; // Adjust this value based on your layout
    }
  };

  useEffect(() => {
    // Fetch the Dash app URL
    const fetchDashUrl = async () => {
      try {
        const token = localStorage.getItem("token"); // Get JWT from local storage
        if (!token) {
          setError("No access token found.");
          return;
        }
        const response = await axios.get("/dash/sampledash", {
          headers: {
            Authorization: `Bearer ${token}`, // Add JWT to the request headers
          },
        });

        // Check if response contains URL
        if (response.data?.url) {
          setDashUrl(response.data.url); // Set the Dash app URL
        } else {
          setError("Failed to retrieve Dash app URL.");
        }
      } catch (err) {
        setError(
          err.response?.data?.error || err.message || "Failed to load Dash app."
        );
      }
    };

    fetchDashUrl();
  }, []);

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

  return (
    <>
      <Navbar />
      <Box
  sx={{
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    height: "100vh", // Full viewport height
    overflow: "hidden", // Ensures no overflow issues
  }}
>
  <HeaderWithBackButton
    title="Institutional Performance Dashboard"
    onBack={() => navigate(-1)}
  />
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
      src={dashUrl}
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

    </>
  );
};

export default DashEmbed;
