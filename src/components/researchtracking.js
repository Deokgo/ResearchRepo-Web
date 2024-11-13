import React, { useEffect, useState } from "react";
import ArrowSteps from "./arrowsteps";
import Navbar from "./navbar";
import Footer from "./footer";
import {
  Box,
  TextField,
  Typography,
  Paper,
  Pagination,
  IconButton,
  Grid2,
  InputAdornment,
  Slider,
  FormControlLabel,
  Checkbox,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import homeBg from "../assets/home_bg.png";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Search, Update } from "@mui/icons-material";
import { Virtuoso } from "react-virtuoso";
import axios from "axios";

const ResearchTracking = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const rowsPerPage = 10; // Changed to a constant
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState("");

  const [userDepartment, setUserDepartment] = useState(null);
  const [colleges, setColleges] = useState([]);
  const [allPrograms, setAllPrograms] = useState([]);
  const [selectedColleges, setSelectedColleges] = useState([]);
  const [department, setDepartment] = useState(null);
  const [research, setResearch] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [filteredResearch, setFilteredResearch] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [dateRange, setDateRange] = useState([2010, 2024]);
  const [selectedPrograms, setSelectedPrograms] = useState([]);
  const itemsPerPage = 5;
  const [selectedStatus, setSelectedStatus] = useState([]);

  const [badgeValues, setBadgeValues] = useState({
    total_ready: 0,
    total_submitted: 0,
    total_accepted: 0,
    total_published: 0,
  });

  const steps = [
    {
      color: "#B0B0B0",
      hoverColor: "#888888",
      label: "READY",
      icon: "fa-solid fa-check-to-slot",
      badge: badgeValues.total_ready,
      activeColor: "#F44336"
    },
    {
      color: "#FFC107",
      hoverColor: "#FFD54F",
      label: "SUBMITTED",
      icon: "fa-solid fa-paper-plane",
      badge: badgeValues.total_submitted,
      activeColor: "#F44336"
    },
    {
      color: "#2196F3",
      hoverColor: "#64B5F6",
      label: "ACCEPTED",
      icon: "fa-solid fa-thumbs-up",
      badge: badgeValues.total_accepted,
      activeColor: "#F44336"
    },
    {
      color: "#4CAF50",
      hoverColor: "#81C784",
      label: "PUBLISHED",
      icon: "fa-solid fa-file-arrow-up",
      badge: badgeValues.total_published,
      activeColor: "#F44336"
    },
  ];

  const handleStepClick = (selectedStep) => {
    const selectedStepStatus = selectedStep.label; //extract the label of the clicked step
    console.log("Selected Step:", selectedStepStatus);

    //update selectedStatus to filter the research data by the selected step's status
    if (selectedStatus.includes(selectedStepStatus)) {
      //if the status is already selected, remove it
      setSelectedStatus((prevSelected) =>
        prevSelected.filter((status) => status !== selectedStepStatus)
      );
    } else {
      //otherwise, add the new status to the selected statuses
      setSelectedStatus((prevSelected) => [
        ...prevSelected,
        selectedStepStatus,
      ]);
    }
  };

  const fetchColleges = async () => {
    try {
      const response = await axios.get(`/deptprogs/college_depts`);
      setColleges(response.data.colleges);
    } catch (error) {
      console.error("Error fetching colleges:", error);
    }
  };

  const fetchAllPrograms = async () => {
    try {
      const response = await axios.get(`/deptprogs/fetch_programs`);
      setPrograms(response.data.programs);
      setAllPrograms(response.data.programs);
    } catch (error) {
      console.error("Error fetching all programs:", error);
    }
  };

  const fetchProgramsByCollege = async (collegeIds) => {
    try {
      if (collegeIds.length > 0) {
        const promises = collegeIds.map((collegeId) =>
          axios.get(`/deptprogs/programs`, {
            params: { department: collegeId },
          })
        );

        const results = await Promise.all(promises);
        const allPrograms = results.flatMap((result) => result.data.programs);
        setPrograms(allPrograms);
      } else {
        setPrograms(allPrograms);
      }
    } catch (error) {
      console.error("Error fetching programs by college:", error);
    }
  };

  const getUserId = () => {
    const userId = localStorage.getItem("user_id");
    return userId;
  };

  const fetchUserData = async () => {
    const userId = getUserId();
    if (userId) {
      try {
        const response = await axios.get(`/accounts/users/${userId}`);
        const data = response.data;
        setUserDepartment(data.researcher.college_id);
        setDepartment(data.researcher.department_name);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
  };

  const fetchAllResearchData = async () => {
    try {
      const response = await axios.get(`/dataset/fetch_dataset`);
      const fetchedResearch = response.data.dataset;
      setResearch(fetchedResearch);
      setFilteredResearch(fetchedResearch);
    } catch (error) {
      console.error("Error fetching all research data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchColleges();
    fetchAllPrograms();
    fetchAllResearchData();
  }, []);

  useEffect(() => {
    fetchProgramsByCollege(selectedColleges);
  }, [selectedColleges]);

  useEffect(() => {
    let filtered = research;

    // Filter by Date Range
    filtered = filtered.filter(
      (item) => item.year >= dateRange[0] && item.year <= dateRange[1]
    );

    // Filter by College
    if (selectedColleges.length > 0) {
      filtered = filtered.filter((item) =>
        selectedColleges.includes(item.college_id)
      );
    }

    // Filter by Selected Programs
    if (selectedPrograms.length > 0) {
      filtered = filtered.filter((item) =>
        selectedPrograms.includes(item.program_name)
      );
    }

    // Filter by Selected Formats (statuses)
    if (selectedStatus.length > 0) {
      filtered = filtered.filter((item) =>
        selectedStatus.some(
          (format) => format.toLowerCase() === item.status.toLowerCase()
        )
      );
    }

    // Filter by Search Query
    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery) ||
          item.research_id.toLowerCase().includes(searchQuery)
      );
    }

    setFilteredResearch(filtered);
    setCurrentPage(1); // Reset to the first page on filter change

    //update badge counts based on the filtered data
    const updatedBadgeValues = {
      total_ready: filtered.filter(item => item.status.toLowerCase() === 'ready').length,
      total_submitted: filtered.filter(item => item.status.toLowerCase() === 'submitted').length,
      total_accepted: filtered.filter(item => item.status.toLowerCase() === 'accepted').length,
      total_published: filtered.filter(item => item.status.toLowerCase() === 'published').length,
    };

    setBadgeValues(updatedBadgeValues);
  }, [
    dateRange,
    selectedColleges,
    selectedPrograms,
    selectedStatus,
    searchQuery,
    research,
  ]);

  const handleCollegeChange = (event) => {
    const { value, checked } = event.target;
    setSelectedColleges((prev) =>
      checked ? [...prev, value] : prev.filter((item) => item !== value)
    );
  };

  const handleProgramChange = (event) => {
    const { value, checked } = event.target;
    setSelectedPrograms((prev) =>
      checked ? [...prev, value] : prev.filter((item) => item !== value)
    );
  };

  const handleDateRangeChange = (event, newValue) => {
    setDateRange(newValue);
  };

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
  };

  const handleKey = (key) => {
    navigate(`/updateresearchinfo/`,{state:{id:key}});
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const paginatedResearch = filteredResearch.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Navbar />
        <Box sx={{ flexGrow: 1 }}>
          <Box
            sx={{
              position: "relative",
              marginTop: { xs: "3.5rem", sm: "4rem", md: "6rem" },
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
                Research Publication Tracking
              </Typography>
            </Box>
          </Box>

          {/* Main Content */}
          <Box
            sx={{
              flexGrow: 1,
              padding: 2,
              mb: 2,
            }}
          >
            <Grid2 container spacing={5} sx={{ height: "100%" }}>
              {/* Filter Section (Left) */}
              <Grid2 display='flex' justifyContent='flex-end' size={3}>
                <Box
                  sx={{
                    border: "2px solid #0A438F",
                    padding: 2,
                    display: "flex",
                    flexDirection: "column",
                    width: "80%",
                    height: "auto",
                    borderRadius: 3,
                  }}
                >
                  <Typography
                    variant='h6'
                    sx={{
                      mb: 2,
                      fontWeight: "bold",
                      color: "#0A438F",
                      fontSize: "1.5rem",
                    }}
                  >
                    {department}
                  </Typography>
                  <Typography
                    variant='h6'
                    sx={{ mb: 2, fontWeight: "bold", color: "#F40824" }}
                  >
                    Filters
                  </Typography>
                  <Typography variant='body1' sx={{ mb: 1, color: "#08397C" }}>
                    Year Range:
                  </Typography>
                  <Slider
                    value={dateRange}
                    onChange={handleDateRangeChange}
                    valueLabelDisplay='on'
                    min={2010}
                    max={2024}
                    sx={{ my: 3, width: "80%", alignSelf: "center" }}
                  />
                  <Typography variant='body1' sx={{ mb: 1, color: "#08397C" }}>
                    College:
                  </Typography>
                  <Box
                    sx={{
                      height: "15rem",
                      overflowY: "auto",
                    }}
                  >
                    {colleges.map((college) => (
                      <FormControlLabel
                        key={college.college_id}
                        control={
                          <Checkbox
                            checked={selectedColleges.includes(
                              college.college_id
                            )}
                            onChange={handleCollegeChange}
                            value={college.college_id}
                          />
                        }
                        label={college.college_name}
                      />
                    ))}
                  </Box>
                  <Typography variant='body1' sx={{ mb: 1, color: "#08397C" }}>
                    Program:
                  </Typography>
                  <Box
                    sx={{
                      height: "15rem",
                      overflowY: "auto",
                    }}
                  >
                    {programs.map((program) => (
                      <FormControlLabel
                        key={program.program_id}
                        control={
                          <Checkbox
                            checked={selectedPrograms.includes(
                              program.program_name
                            )}
                            onChange={handleProgramChange}
                            value={program.program_name}
                          />
                        }
                        label={program.program_name}
                      />
                    ))}
                  </Box>
                </Box>
              </Grid2>

              
              <Grid2 display='flex' justifyContent='flex-start' size={9}>
                {/* Container for Stats, Search Bar, and Virtuoso Table (Right) */}
                
                <Box sx={{ flexBasis: "90%" }}>
                
                  {/* Stats Section */}
                  <div className="App">
                    <ArrowSteps steps={steps} onStepClick={handleStepClick} />
                  </div>
                
                  {/* Search Bar */}
                  <Box 
                    sx={{ 
                      width: "100%", // Center search bar and button
                      display: "flex",
                      padding: 1,
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      variant='outlined'
                      placeholder='Search by Title or Code'
                      value={searchQuery}
                      onChange={handleSearchChange}
                      sx={{ width: "30rem" }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position='start'>
                            <Search />
                          </InputAdornment>
                        ),
                      }}
                    />
                    
                    <Box 
                      sx={{ 
                        display: "flex", 
                      }}
                    >
                      <TextField
                        variant='outlined'
                        placeholder='Search by Title or Code'
                        value={filteredResearch.length}
                        disabled
                        sx={{ width: "5rem", input: {textAlign: "center"}}}
                      />
                        <Typography padding={2} variant='h6' sx={{ justifyContent: "center", color: "#8B8B8B" }}>
                          results found
                        </Typography>
                    </Box>       
                    
                  </Box>
                  

                  {/* Virtuoso Table */}
                  <Box sx={{ padding: 2, backgroundColor: "#F7F9FC" }}>
                    {loading ? (
                      <Typography>Loading...</Typography>
                    ) : (
                      <Virtuoso
                        style={{ height: "400px" }}
                        data={paginatedResearch}
                        itemContent={(index, paper, key) => (
                          <Box
                            key={paper.research_id}
                            sx={{
                              padding: 2,
                              borderBottom: "1px solid #ddd",
                              cursor: "pointer",
                            }}
                            onClick={() => handleKey(paper.research_id)}
                          >
                            <Typography variant='h6'>{paper.title}</Typography>
                            <Typography variant='body2' color='textSecondary'>
                              Status: {paper.status} | Last Updated:{" "}
                              {paper.timestamp}
                            </Typography>
                          </Box>
                        )}
                      />
                    )}
                  </Box>

                  {/* Pagination */}
                  <Pagination
                    count={Math.ceil(filteredResearch.length / rowsPerPage)}
                    page={page}
                    onChange={handleChangePage}
                    sx={{ mt: 2 }}
                  />
                </Box>
              </Grid2>
            </Grid2>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default ResearchTracking;
