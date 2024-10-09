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
              width: "20%",
              backgroundColor: "#f5f5f5",
              padding: "1rem",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              height: "100vh",
              overflowY: "auto",
            }}
          >
            <Typography variant='h6' gutterBottom>
              Filters
            </Typography>

            <Typography variant='subtitle1'>Select Colleges</Typography>
            <Select
              fullWidth
              label='Department'
              name='department'
              multiple
              value={selectedColleges}
              onChange={handleCollegeChange}
              margin='normal'
              variant='outlined'
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
            >
              <MenuItem value=''>-- Select Department --</MenuItem>
              {colleges.map((college) => (
                <MenuItem key={college.college_id} value={college.college_id}>
                  {college.college_name}
                </MenuItem>
              ))}
            </Select>

            <Typography variant='subtitle1' sx={{ marginTop: "1rem" }}>
              Select Year Range
            </Typography>
            <Slider
              value={selectedYears}
              onChange={handleYearChange}
              valueLabelDisplay='auto'
              min={yearRange[0]}
              max={yearRange[1]}
              marks={[
                { value: yearRange[0], label: yearRange[0].toString() },
                { value: yearRange[1], label: yearRange[1].toString() },
              ]}
            />

            <Button
              variant='contained'
              color='primary'
              onClick={handleApplyFilters}
              sx={{ marginTop: "1rem" }}
            >
              Apply Filters
            </Button>
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
        <Footer />
      </Box>
    </>
  );
};

export default KnowledgeGraph;
