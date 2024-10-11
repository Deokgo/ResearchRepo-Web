import React, { useEffect, useState } from "react";
import Navbar from "./navbar";
import Footer from "./footer";
import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography,
  Button,
  Slider,
  TextField,
  MenuItem,
  Select,
  Chip,
} from "@mui/material";
import axios from "axios";
// import Select from '@mui/material/Select';

const KnowledgeGraph = () => {
  const [selectedYears, setSelectedYears] = useState([2015, 2023]);
  const [colleges, setColleges] = useState([]);
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
            display: "flex",
            flexGrow: 1,
            height: { xs: "100%", md: "calc(100vh - 6rem)" },
            marginTop: { xs: "3.5rem", sm: "4rem", md: "6rem" },
          }}
        >
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
        <Footer />
      </Box>
    </>
  );
};

export default KnowledgeGraph;
