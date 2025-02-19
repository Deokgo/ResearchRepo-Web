import React, { useEffect, useRef, useState } from "react";
import Navbar from "../components/navbar";
import { Box, Tabs, Tab } from "@mui/material";
import { useNavigate } from "react-router-dom";
import HeaderWithBackButton from "../components/Header";
import { useAuth } from "../context/AuthContext";

const KnowledgeGraph = () => {
  const navigate = useNavigate();
  const iframeRef = useRef(null);
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);

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
    <Box sx={{ margin: 0, padding: 0 }}>
      <Navbar />
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
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
                  },
                },
                "& .MuiTabs-indicator": {
                  backgroundColor: "#0A438F",
                },
              }}
            >
              <Tab label='SDG/Research Area' />
              <Tab label='Program-Keywords' />
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
              height: showTabs ? "calc(100% - 96px)" : "calc(100% - 48px)", // Adjust height for tabs
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
