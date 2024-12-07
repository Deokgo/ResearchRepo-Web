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
  const [dateRange, setDateRange] = useState([2010, 2025]); // Default min and max year
  const [sliderValue, setSliderValue] = useState([2010, 2025]); // Initial slider value
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
      (item) => item.year >= sliderValue[0] && item.year <= sliderValue[1]
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
    sliderValue,
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

  useEffect(() => {
    async function fetchDateRange() {
      try {
        const response = await axios.get("/dataset/fetch_date_range"); // API endpoint
        const { min_year, max_year } = response.data.date_range;

        // Update the date range and initialize the slider values
        setDateRange([min_year, max_year]);
        setSliderValue([min_year, max_year]);
      } catch (error) {
        console.error("Failed to fetch date range:", error);
      }
    }

    fetchDateRange();
  }, []);

  const handleDateRangeChange = (event, newValue) => {
    setSliderValue(newValue);
  };

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
  };

  const handleKey = (key) => {
    navigate(`/updatetrackinginfo/`,{state:{id:key}});
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
          margin: 0,
          padding: 0,
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
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
          {/* Header with back button */}
          <Box
            sx={{
              position: "relative",
              width: "100%",
              height: {
                xs: "clamp(2rem, 3vh, 3rem)",
                sm: "clamp(3rem, 8vh, 4rem)",
                md: "clamp(3rem, 14vh, 4rem)",
                lg: "clamp(4rem, 20vh, 5rem)"
              },
              backgroundColor: "#0A438F",
              backgroundSize: "cover",
              backgroundPosition: "center",
              display: "flex",
              alignItems: "center",
              zIndex: 1
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
                    xs: "scale(0.5)",
                    sm: "scale(0.75)",
                    md: "scale(0.75)"
                  }
                }}
                
              >
                <ArrowBackIosIcon />
              </IconButton>
              <Typography
                variant='h3'
                sx={{
                  py: 5,
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
                  zIndex: 2
                }}
              >
                Research Publication Tracking
              </Typography>
            </Box>
          </Box>

          {/* Main Content */}
          <Box
            sx={{
              flex: 1,
              padding: 3,
              overflow: "hidden",
              height: "calc(100% - 48px)",
            }}
          >
            <Grid2 container spacing={4} sx={{ height: "100%", flexWrap: "nowrap", }}>
              {/* Filter Section (Left) */}
              <Grid2 size={3}>
                <Box
                  sx={{
                    border: "1px solid #0A438F",
                    height: "100%",
                    borderRadius: 3,
                    padding: 3,
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Typography
                    variant='h6'
                    sx={{ mb: 2, fontWeight: "bold", color: "#F40824" }}
                  >
                    Filters
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                      <Typography variant='body1' sx={{ mb: 1, color: "#08397C", fontSize: { xs: "0.5rem", md: "0.5rem", lg: "0.9rem" }, }}>
                      Year Range:
                    </Typography>
                    <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          width: "100%",
                          mt: 4,
                        }}
                    >
                        <Slider
                        value={sliderValue}
                        onChange={handleDateRangeChange}
                        valueLabelDisplay='on'
                        min={dateRange[0]}
                        max={dateRange[1]}
                        sx={{
                          width: "90%",
                          "& .MuiSlider-valueLabel": {
                            backgroundColor: "#08397C",
                          },
                          "& .MuiSlider-rail": {
                            backgroundColor: "#ccc",
                          },
                          "& .MuiSlider-track": {
                            backgroundColor: "#08397C",
                          },
                          "& .MuiSlider-thumb": {
                            backgroundColor: "#08397C",
                          },
                        }}
                      />
                    </Box>
                  </Box>
                  
                  <Typography variant='body1' sx={{ mb: 1, color: "#08397C", fontSize: { xs: "0.5rem", md: "0.5rem", lg: "0.9rem" } }}>
                    College:
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      height: "50%",
                      overflowY: "auto",
                      mb: 2,
                      "&::-webkit-scrollbar": {
                        width: "8px",
                      },
                      "&::-webkit-scrollbar-track": {
                        background: "#f1f1f1",
                        borderRadius: "4px",
                      },
                      "&::-webkit-scrollbar-thumb": {
                        background: "#08397C",
                        borderRadius: "4px",
                      },
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
                        sx={{
                          "& .MuiTypography-root": {
                            fontSize: {
                              xs: "0.5rem",
                              md: "0.75rem",
                              lg: "0.9rem",
                            },
                          },
                        }}
                      />
                    ))}
                  </Box>
                  <Typography variant='body1' sx={{ mb: 1, color: "#08397C", fontSize: { xs: "0.5rem", md: "0.5rem", lg: "0.9rem" }, }}>
                    Program:
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      height: "50%",
                      overflowY: "auto",
                      mb: 2,
                      "&::-webkit-scrollbar": {
                        width: "8px",
                      },
                      "&::-webkit-scrollbar-track": {
                        background: "#f1f1f1",
                        borderRadius: "4px",
                      },
                      "&::-webkit-scrollbar-thumb": {
                        background: "#08397C",
                        borderRadius: "4px",
                      },
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
                        sx={{
                          "& .MuiTypography-root": {
                            fontSize: {
                              xs: "0.5rem",
                              md: "0.75rem",
                              lg: "0.9rem",
                            },
                          },
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              </Grid2>

              
              <Grid2 display='flex' justifyContent='flex-start' size={9}>
                {/* Container for Stats, Search Bar, and Virtuoso Table (Right) */}
                
                <Box sx={{ flexBasis: "100%" }}>
                
                  {/* Stats Section */}
                  <div className="App" style={{ 
                    width: '100%',  // Full width
                    transform: 'scale(0.8)', // Reduce size
                    transformOrigin: 'center' // Keep alignment
                  }} >
                    <ArrowSteps steps={steps} onStepClick={handleStepClick} />
                  </div>
                
                  {/* Search Bar */}
                  <Box 
                    sx={{ 
                      width: "100%", // Center search bar and button
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      variant='outlined'
                      placeholder='Search by Title or Code'
                      value={searchQuery}
                      onChange={handleSearchChange}
                      sx={{ 
                        flex: 2,
                        // Responsive font size
                        '& .MuiInputBase-input': {
                          fontSize: { 
                            xs: '0.75rem',   // Mobile
                            sm: '0.85rem',   // Small devices
                            md: '0.9rem',    // Medium devices
                            lg: '1rem'        // Large devices
                          },
                          // Adjust input height
                          padding: { 
                            xs: '8px 12px',   // Mobile
                            md: '12px 14px'   // Larger screens
                          },
                          // Optional: adjust overall height
                          height: { 
                            xs: '15px',   // Mobile
                            md: '25px'    // Larger screens
                          }
                        }
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position='start'>
                            <Search 
                              sx={{
                                fontSize: { 
                                  xs: '1rem',   // Mobile
                                  md: '1.25rem' // Larger screens
                                }
                              }} 
                            />
                          </InputAdornment>
                        ),
                      }}
                    />
                    
                    <Box 
                      sx={{ 
                        display: "flex", 
                      }}
                    >
                        <Typography padding={5} variant='h6' sx={{ justifyContent: "center", color: "#8B8B8B", fontSize: { xs: "0.75rem", md: "0.75rem", lg: "1rem" },}}>
                        {filteredResearch.length} results found
                        </Typography>
                    </Box>       
                  </Box>
                  <Box 
                    sx={{ 
                      backgroundColor: "#F7F9FC",
                      borderRadius: 1,
                      overflow: "hidden",
                      display: "flex",
                      height: '220px',
                      flexDirection: "column"
                    }}
                  >
                    <Box sx={{ flex: 1, overflow: "hidden" }}>
                      {loading ? (
                        <Typography>Loading...</Typography>
                      ) : (
                        <>
                          {/* Virtuoso Table */}
                          <Virtuoso
                            style={{ height: "100%" }}
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
                                <Typography variant="h6" sx={{
                                    mb: 1,
                                    fontSize: {
                                      xs: "0.5rem",
                                      md: "0.75rem",
                                      lg: "1rem",
                                    },
                                    fontWeight: 500,
                                  }}
                                  >{paper.title}</Typography>
                                <Typography variant="body2" color="textSecondary" sx={{
                                    mb: 0.5,
                                    color: "#666",
                                    fontSize: {
                                      xs: "0.5rem",
                                      md: "0.5rem",
                                      lg: "0.75rem",
                                    },
                                  }}>
                                  Status: {paper.status} | Last Updated: {paper.timestamp}
                                </Typography>
                              </Box>
                            )}
                          />
                          
                          {/* Centered Pagination */}
                          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                            <Pagination
                              count={Math.ceil(filteredResearch.length / rowsPerPage)}
                              page={page}
                              onChange={handleChangePage}
                            />
                          </Box>
                        </>
                      )}
                    </Box>
                </Box>
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
