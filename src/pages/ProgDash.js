import React, { useState, useEffect } from "react";
import api from "../services/api";
import { Box } from "@mui/material";
import Navbar from "../components/navbar";
import { useNavigate } from "react-router-dom";

const ProgDash = () => {
  const [dashUrl, setDashUrl] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Update iframe height on resize
  const updateIframeSize = () => {
    const iframe = document.getElementById("dashboard-iframe");
    if (iframe) {
      iframe.style.height = `${window.innerHeight + 10}px`; // Adjust this value based on your layout
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
        const response = await api.get("/dash/combineddash", {
          headers: {
            Authorization: `Bearer ${token}`, // Add JWT to the request headers
          },
        });

        // Check if response contains the overview URL
        if (response.data?.overview) {
          setDashUrl(response.data.overview); // Set the Dash app URL
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
          paddingTop: "3.5rem",
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          height: "100vh", // Full viewport height
          overflow: "hidden", // Ensures no overflow issues
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: "100%",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <iframe
            id='dashboard-iframe'
            src={dashUrl}
            style={{
              border: "none",
              width: "111%", // Compensating for scale(0.8)
              height: "111%",
              display: "block",
              transform: "scale(0.9)",
              transformOrigin: "top left",
              position: "absolute",
              top: 0,
              left: 0,
            }}
            sandbox='allow-scripts allow-same-origin allow-forms allow-popups'
            title='Dash App'
          />
        </Box>
      </Box>
    </>
  );
};

export default ProgDash;
