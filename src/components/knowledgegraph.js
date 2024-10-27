import React, { useEffect, useState } from "react";
import Navbar from "./navbar";
import Footer from "./footer";
import {
  Box,
  Typography,
  IconButton,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import homeBg from "../assets/home_bg.png";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
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
            display: "flex",
            flexDirection: "column",
            height: "calc(100vh - 6rem)", // Adjusts based on Navbar and Footer height
            marginTop: { xs: "3.5rem", sm: "4rem", md: "6rem" }
          }}
        >
          {/* Header Section */}
        <Box
            sx={{
              position: "relative",
              marginBottom: 2,
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
                <ArrowBackIosIcon />
              </IconButton>
              <Typography
                variant='h3'
                sx={{
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 800,
                  fontSize: { xs: "1.5rem", sm: "2rem", md: "2.575rem" },
                  color: "#FFF",
                  lineHeight: 1.25,
                  alignSelf: "center",
                  zIndex: 2,
                }}
              >
                Knowledge Graph
              </Typography>
            </Box>
          </Box>
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
