import React, { useEffect, useState } from "react";
import Navbar from "./navbar";
import Footer from "./footer";
import {
  Box,
  IconButton,
  Typography,
  CircularProgress
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import homeBg from "../assets/home_bg.png";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

const PubDash = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  // Handle iframe load event to set loading state
  const handleIframeLoad = () => {
    setLoading(false);
  };

  // Update iframe height on resize
  const updateIframeSize = () => {
    const iframe = document.getElementById('dashboard-iframe');
    if (iframe) {
      iframe.style.height = `${window.innerHeight - 100}px`; // Adjust this value based on your layout
    }
  };

  useEffect(() => {
    window.addEventListener('resize', updateIframeSize);
    updateIframeSize(); // Call initially to set the size

    return () => {
      window.removeEventListener('resize', updateIframeSize);
    };
  }, []);

  return (
    <>
      <Box sx={{ margin: 0, padding: 0, height: "85vh" }}>
        <Navbar />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "calc(100vh - 6rem)", // Adjusts based on Navbar and Footer height
            marginTop: { xs: "3.5rem", sm: "4rem", md: "6rem" },
          }}
        >
          <Box
            sx={{
              position: "relative",
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              padding: 4,
              gap: 4,
              backgroundSize: "cover",
              backgroundPosition: "center",
              height: { xs: "5rem", md: "6rem" },
              backgroundColor: "#0A438F",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: `url(${homeBg})`,
                opacity: 0.25,
                zIndex: 1,
              }}
            />
            <Box sx={{ display: "flex", ml: "5rem", zIndex: 3 }}>
              <IconButton
                onClick={() => navigate(-1)}
                sx={{
                  color: "#fff",
                }}
              >
                <ArrowBackIosIcon></ArrowBackIosIcon>
              </IconButton>
              <Typography
                variant='h3'
                sx={{
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 800,
                  fontSize: { xs: "1.5rem", sm: "2rem", md: "3rem" },
                  color: "#FFF",
                  lineHeight: 1.25,
                  alignSelf: "center",
                  zIndex: 2,
                }}
              >
                SDG Analytics Dashboard
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              flexGrow: 1,
              backgroundColor: "#f5f5f5",
              padding: 0,
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              overflowY: "hidden",
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
              id="dashboard-iframe" // Add an id to the iframe for easy access
              src="http://localhost:5000/dashboard/publication"
              style={{
                width: "100%",
                height: "100%", // Initial height
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

export default PubDash;