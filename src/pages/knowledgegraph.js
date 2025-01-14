import React, { useEffect, useRef } from "react";
import Navbar from "../components/navbar";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import HeaderWithBackButton from "../components/Header";

const KnowledgeGraph = () => {
  const navigate = useNavigate();
  const iframeRef = useRef(null);

  useEffect(() => {
    const handleMessage = (event) => {
      // Check if the message is from our Dash app
      if (
        event.data &&
        event.data.type === "study_click" &&
        event.data.research_id
      ) {
        console.log("Received study click:", event.data); // Debug log
        navigate(`/displayresearchinfo/${event.data.research_id}`, {
          state: { id: event.data.research_id },
        });
      }
    };

    // Add event listener
    window.addEventListener("message", handleMessage);

    // Cleanup
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [navigate]);

  return (
    <Box sx={{ margin: 0, padding: 0 }}>
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
          title='Knowledge Graph'
          onBack={() => navigate(-1)}
        />
        <Box
          sx={{
            flexGrow: 1,
            height: "100%",
            overflow: "hidden",
          }}
        >
          <iframe
            ref={iframeRef}
            src='http://localhost:5000/knowledgegraph'
            style={{
              width: "100%",
              height: "100%",
              border: "none",
            }}
            title='Knowledge Graph'
          />
        </Box>
      </Box>
    </Box>
  );
};

export default KnowledgeGraph;
