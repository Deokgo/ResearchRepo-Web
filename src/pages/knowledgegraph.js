import React, { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { Box, Typography, IconButton } from "@mui/material";
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
          <Box
            sx={{
              position: "relative",
              width: "100%",
              height: {
                xs: "clamp(2rem, 3vh, 3rem)",
                sm: "clamp(3rem, 8vh, 4rem)",
                md: "clamp(3rem, 14vh, 4rem)",
                lg: "clamp(4rem, 20vh, 5rem)",
              },
              backgroundColor: "#0A438F",
              backgroundSize: "cover",
              backgroundPosition: "center",
              display: "flex",
              alignItems: "center",
              zIndex: 1,
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
                backgroundSize: "cover",
                opacity: 0.25,
                zIndex: 1,
              }}
            />
            <Box sx={{ display: "flex", ml: "5rem", zIndex: 3 }}>
              <IconButton
                onClick={() => navigate(-1)}
                sx={{
                  color: "#fff",
                  transform: {
                    xs: "scale(0.8)",
                    sm: "scale(1)",
                    md: "scale(1.2)",
                  },
                }}
              >
                <ArrowBackIosIcon />
              </IconButton>
              <Typography
                variant='h3'
                sx={{
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 800,
                  fontSize: {
                    xs: "clamp(1rem, 2vw, 1rem)",
                    sm: "clamp(1.5rem, 3.5vw, 1.5rem)",
                    md: "clamp(2rem, 4vw, 2.25rem)",
                  },
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
