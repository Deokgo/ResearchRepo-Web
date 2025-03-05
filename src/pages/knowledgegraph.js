import React, { useEffect, useRef, useState } from "react";
import Navbar from "../components/navbar";
import { Box, Tabs, Tab } from "@mui/material";
import { useNavigate } from "react-router-dom";
import HeaderWithBackButton from "../components/Header";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const KnowledgeGraph = () => {
  const navigate = useNavigate();
  const iframeRef = useRef(null);
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [graphUrls, setGraphUrls] = useState({});

  // Check if user has permission to see tabs
  const showTabs = user?.role === "02" || user?.role === "04"; // Director or College Admin

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

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box>
      <Navbar />
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        <HeaderWithBackButton title='Knowledge Graph' showBackButton={false} />
        {showTabs && (
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              sx={{
                "& .MuiTab-root": {
                  color: "#666",
                  "&.Mui-selected": {
                    color: "#0A438F",
                    fontWeight: 700,
                  },
                },
                "& .MuiTabs-indicator": {
                  backgroundColor: "#0A438F",
                },
                pl: 4,
              }}
            >
              <Tab label='Research Discovery' sx={{ pl: 5, pr: 5 }} />
              <Tab label='Research Synergy Network' sx={{ pl: 5, pr: 5 }} />
            </Tabs>
          </Box>
        )}
        <Box
          sx={{
            flexGrow: 1,
            height: "100%",
            overflow: "hidden",
          }}
        >
          <iframe
            ref={iframeRef}
            src={`http://localhost:5000/knowledgegraph${
              activeTab === 1 ? "/research-network" : ""
            }?role=${user?.role || ""}`}
            style={{
              width: "100%",
              height: "calc(100% + 30px)", // Adjust height for tabs
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
