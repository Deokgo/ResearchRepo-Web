import React, { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import axios from "axios";
import { Box, IconButton, Typography, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import homeBg from "../assets/home_bg.png";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import HeaderWithBackButton from "../components/Header";

const MainDash = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Handle iframe load event to set loading state
  const handleIframeLoad = () => {
    setLoading(false);
  };

  // Update iframe height on resize
  const updateIframeSize = () => {
    const iframe = document.getElementById("dashboard-iframe");
    if (iframe) {
      iframe.style.height = `${window.innerHeight - 100}px`; // Adjust this value based on your layout
    }
  };

  const getUserCollege = async () => {
    try {
      const response = await axios.get(`/data/college`);
      console.log("Full Response:", response.data.college_id);
    } catch (error) {
      console.error("Error fetching college:", error);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", updateIframeSize);
    updateIframeSize(); // Call initially to set the size
    getUserCollege();

    return () => {
      window.removeEventListener("resize", updateIframeSize);
    };
  }, []);

  return (
    <>
      <Box sx={{ margin: 0, padding: 0, height: "85vh" }}>
        <Navbar />
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            marginTop: { xs: "3.5rem", sm: "4rem", md: "5rem" },
            height: {
              xs: "calc(100vh - 3.5rem)",
              sm: "calc(100vh - 4rem)",
              md: "calc(100vh - 6rem)",
            },
            overflow: "hidden",
          }}
        >
          <HeaderWithBackButton
            title="Reports"
            onBack={() => navigate(-1)}
          />
          <Box
            sx={{
              flexGrow: 1,
              backgroundColor: "#f5f5f5",
              padding: 0,
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              overflowY: "hidden", // Prevent scrollbar in parent
            }}
          >
            {loading && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <CircularProgress />
              </Box>
            )}
            <iframe
              id='dashboard-iframe' // Add an id to the iframe for easy access
              src='http://localhost:5000/dashboard/overview'
              style={{
                width: "100%",
                height: "100%", // Ensure it takes full height of parent
                border: "none",
                display: loading ? "none" : "block",
              }}
              onLoad={handleIframeLoad}
            />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default MainDash;
