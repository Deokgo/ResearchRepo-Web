import React, { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { Box, Typography, IconButton } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import HeaderWithBackButton from "../components/Header";
// import Select from '@mui/material/Select';

const KnowledgeGraph = () => {
  const [selectedYears, setSelectedYears] = useState([2015, 2023]);
  const [colleges, setColleges] = useState([]);
  const navigate = useNavigate();
  const [selectedColleges, setSelectedColleges] = useState([]);

  const yearRange = [2000, 2023];
  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const response = await axios.get("/deptprogs/college_depts");
        const data = response.data;
        setColleges(data.colleges);
      } catch (error) {
        console.error("Error fetching college data:", error);
      }
    };
    fetchColleges();
  }, []);

  const handleCollegeChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedColleges(typeof value === "string" ? value.split(",") : value);
  };

  const handleYearChange = (event, newValue) => {
    setSelectedYears(newValue);
  };

  const handleApplyFilters = () => {
    console.log("Selected Colleges:", selectedColleges);
    console.log("Selected Years:", selectedYears);
  };

  return (
    <>
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
            title="Knowledge Graph"
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
              src='http://localhost:5000/knowledgegraph'
              style={{
                width: "100%",
                height: "100%",
                border: "none",
              }}
            />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default KnowledgeGraph;
