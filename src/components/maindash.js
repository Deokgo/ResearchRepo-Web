import React, { useEffect, useState } from "react";
import Navbar from "./navbar";
import Footer from "./footer";
import { Box, CircularProgress } from "@mui/material";

const MainDash = () => {
  const [loading, setLoading] = useState(true);

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
              id="dashboard-iframe" // Add an id to the iframe for easy access
              src="http://localhost:5000/dashboard/overview"
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
        <Footer />
      </Box>
    </>
  );
};

export default MainDash;