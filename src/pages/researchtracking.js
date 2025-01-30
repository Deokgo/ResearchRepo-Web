import React, { useEffect, useState } from "react";
import ArrowSteps from "../components/arrowsteps";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
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
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import homeBg from "../assets/home_bg.png";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Search, Update } from "@mui/icons-material";
import { Virtuoso } from "react-virtuoso";
import axios from "axios";
import { filterCache, fetchAndCacheFilterData } from "../utils/filterCache";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HeaderWithBackButton from "../components/Header";

// First, define the useDebounce hook
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const ResearchTracking = () => {
  // Add navigate hook at the top with other hooks
  const navigate = useNavigate();

  // Define rowsPerPage constant
  const rowsPerPage = 5; // or whatever number you want to use

  // Then declare all state variables
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedColleges, setSelectedColleges] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState("");

  const [userDepartment, setUserDepartment] = useState(null);
  const [colleges, setColleges] = useState([]);
  const [allPrograms, setAllPrograms] = useState([]);
  const [department, setDepartment] = useState(null);
  const [research, setResearch] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [filteredResearch, setFilteredResearch] = useState([]);
  const [dateRange, setDateRange] = useState([2010, 2025]); // Default min and max year
  const [sliderValue, setSliderValue] = useState([2010, 2025]); // Initial slider value
  const [selectedPrograms, setSelectedPrograms] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState([]);

  const [badgeValues, setBadgeValues] = useState({
    total_ready: 0,
    total_submitted: 0,
    total_accepted: 0,
    total_published: 0,
  });

  // Use the debounced value after the state declarations
  const debouncedColleges = useDebounce(selectedColleges, 300);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Or whatever number you prefer

  const steps = [
    {
      color: "#B0B0B0",
      hoverColor: "#888888",
      label: "READY",
      icon: "fa-check-to-slot",
      badge: badgeValues.total_ready,
      activeColor: "#F44336",
    },
    {
      color: "#FFC107",
      hoverColor: "#FFD54F",
      label: "SUBMITTED",
      icon: "fa-paper-plane",
      badge: badgeValues.total_submitted,
      activeColor: "#F44336",
    },
    {
      color: "#2196F3",
      hoverColor: "#64B5F6",
      label: "ACCEPTED",
      icon: "fa-thumbs-up",
      badge: badgeValues.total_accepted,
      activeColor: "#F44336",
    },
    {
      color: "#4CAF50",
      hoverColor: "#81C784",
      label: "PUBLISHED",
      icon: "fa-file-arrow-up",
      badge: badgeValues.total_published,
      activeColor: "#F44336",
    },
  ];

  const handleStepClick = (selectedStep) => {
    const selectedStepStatus = selectedStep.label; // Extract the label of the clicked step
    console.log("Selected Step:", selectedStepStatus);

    // Update selectedStatus to filter the research data by the selected step's status
    setSelectedStatus((prevSelected) => {
      const isAlreadySelected = prevSelected.includes(selectedStepStatus);

      if (isAlreadySelected) {
        // Remove the status if it's already selected
        return prevSelected.filter((status) => status !== selectedStepStatus);
      } else {
        // Add the new status to the selected statuses
        return [...prevSelected, selectedStepStatus];
      }
    });
  };

  const fetchDeptProg = async () => {
    try {
      const cached = filterCache.get();
      if (cached) {
        setColleges(cached.colleges);
        setPrograms(cached.programs);
        setAllPrograms(cached.programs);
        return;
      }
      const data = await fetchAndCacheFilterData();
      setColleges(data.colleges);
      setPrograms(data.programs);
    } catch (error) {
      console.error("Error fetching colleges:", error);
    }
  };

  const fetchProgramsByCollege = async (collegeIds) => {
    setIsLoading(true);
    try {
      if (collegeIds.length > 0) {
        const cached = filterCache.get();
        if (cached) {
          const filteredPrograms = cached.programs.filter((program) =>
            collegeIds.includes(String(program.college_id))
          );
          setPrograms(filteredPrograms);
        }
      } else {
        const cached = filterCache.get();
        setPrograms(cached.programs);
      }
    } catch (error) {
      console.error("Error fetching programs by college:", error);
      setPrograms(allPrograms);
      setSelectedPrograms([]);
    } finally {
      setIsLoading(false);
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
    fetchDeptProg();
    fetchAllResearchData();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const cached = filterCache.get();
      if (cached) {
        // Get programs from selected colleges
        let filteredPrograms =
          debouncedColleges.length === 0
            ? cached.programs
            : cached.programs.filter((program) =>
                debouncedColleges.includes(String(program.college_id))
              );

        // Add any selected programs that aren't in the filtered list
        const selectedProgramObjects = cached.programs.filter((program) =>
          selectedPrograms.includes(program.program_name)
        );

        // Combine and remove duplicates
        filteredPrograms = [
          ...new Map(
            [...filteredPrograms, ...selectedProgramObjects].map((program) => [
              program.program_name,
              program,
            ])
          ).values(),
        ];

        setPrograms(filteredPrograms);
      }
    }
  }, [debouncedColleges, isLoading, selectedPrograms]);

  // Add a new useEffect to calculate badge values only once when research data is loaded
  useEffect(() => {
    const calculateBadgeCounts = (researchData) => {
      return {
        total_ready: researchData.filter(
          (item) => item.status.toLowerCase() === "ready"
        ).length,
        total_submitted: researchData.filter(
          (item) => item.status.toLowerCase() === "submitted"
        ).length,
        total_accepted: researchData.filter(
          (item) => item.status.toLowerCase() === "accepted"
        ).length,
        total_published: researchData.filter(
          (item) => item.status.toLowerCase() === "published"
        ).length,
      };
    };

    if (research.length > 0) {
      const counts = calculateBadgeCounts(research);
      setBadgeValues(counts);
    }
  }, [research]); // Only recalculate when research data changes

  // Modify the useEffect that handles filtering
  useEffect(() => {
    const applyFilters = () => {
      let filtered = [...research];

      // Apply all filters except status first
      // Handle college and program filtering
      if (selectedColleges.length > 0 || selectedPrograms.length > 0) {
        filtered = filtered.filter((item) => {
          const matchesProgram =
            selectedPrograms.length > 0 &&
            selectedPrograms.includes(item.program_name);

          const matchesCollege =
            selectedColleges.length > 0 &&
            selectedColleges.includes(String(item.college_id));

          return (
            matchesProgram ||
            (matchesCollege &&
              !selectedPrograms.some((prog) => {
                const programCollege = programs.find(
                  (p) => p.program_name === prog
                )?.college_id;
                return String(programCollege) === String(item.college_id);
              }))
          );
        });
      }

      // Apply remaining filters
      if (sliderValue[0] !== dateRange[0] || sliderValue[1] !== dateRange[1]) {
        filtered = filtered.filter(
          (item) => item.year >= sliderValue[0] && item.year <= sliderValue[1]
        );
      }

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(
          (item) =>
            item.title.toLowerCase().includes(query) ||
            item.research_id.toLowerCase().includes(query)
        );
      }

      const updatedBadgeValues = {
        total_ready: filtered.filter(
          (item) => item.status.toLowerCase() === "ready"
        ).length,
        total_submitted: filtered.filter(
          (item) => item.status.toLowerCase() === "submitted"
        ).length,
        total_accepted: filtered.filter(
          (item) => item.status.toLowerCase() === "accepted"
        ).length,
        total_published: filtered.filter(
          (item) => item.status.toLowerCase() === "published"
        ).length,
      };

      setBadgeValues(updatedBadgeValues);

      // Finally, apply status filter if any
      if (selectedStatus.length > 0) {
        filtered = filtered.filter((item) =>
          selectedStatus.some(
            (status) => status.toLowerCase() === item.status.toLowerCase()
          )
        );
      }

      setFilteredResearch(filtered);
      setCurrentPage(1);
    };

    const timeoutId = setTimeout(applyFilters, 300);
    return () => clearTimeout(timeoutId);
  }, [
    research,
    selectedColleges,
    selectedPrograms,
    programs,
    sliderValue,
    selectedStatus,
    searchQuery,
    dateRange,
  ]);

  const handleCollegeChange = (event) => {
    const { value, checked } = event.target;
    setSelectedColleges((prev) => {
      const newSelection = checked
        ? [...prev, value]
        : prev.filter((item) => item !== value);
      return newSelection;
    });
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
    navigate(`/updatetrackinginfo/`, { state: { id: key } });
  };

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const paginatedResearch = filteredResearch.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
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
            height: {
              xs: "calc(100vh - 3.5rem)",
              sm: "calc(100vh - 4rem)",
              md: "calc(100vh - 6rem)",
            },
            overflow: "hidden",
          }}
        >
          <HeaderWithBackButton
            title='Research Publication Tracking'
            onBack={() => navigate(-1)}
          />
          {/* Main Content */}
          <Box
            sx={{
              flex: 1,
              padding: 3,
              overflow: "hidden",
              height: "calc(100% - 48px)",
            }}
          >
            <Grid2
              container
              spacing={4}
              sx={{ height: "100%", flexWrap: "nowrap" }}
            >
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
                    <Typography
                      variant='body1'
                      sx={{
                        mb: 2,
                        color: "#08397C",
                        position: "relative",
                        zIndex: 2,
                        fontSize: {
                          xs: "0.5rem",
                          md: "0.5rem",
                          lg: "0.9rem",
                        },
                      }}
                    >
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

                  <Accordion defaultExpanded>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography
                        sx={{
                          color: "#08397C",
                          fontSize: {
                            xs: "0.5rem",
                            md: "0.5rem",
                            lg: "0.9rem",
                          },
                        }}
                      >
                        College
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Box sx={{ maxHeight: "200px", overflow: "auto" }}>
                        {colleges.map((college) => (
                          <FormControlLabel
                            key={college.college_id}
                            control={
                              <Checkbox
                                checked={selectedColleges.includes(
                                  String(college.college_id)
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
                    </AccordionDetails>
                  </Accordion>

                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography
                        sx={{
                          color: "#08397C",
                          fontSize: {
                            xs: "0.5rem",
                            md: "0.5rem",
                            lg: "0.9rem",
                          },
                        }}
                      >
                        Program
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Box sx={{ maxHeight: "200px", overflow: "auto" }}>
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
                    </AccordionDetails>
                  </Accordion>
                </Box>
              </Grid2>

              <Grid2
                display='flex'
                flexDirection='column'
                justifyContent='flex-start'
                size={9}
              >
                {/* Stats Section */}
                <div
                  className='App'
                  style={{
                    width: "100%", // Full width
                    transform: "scale(0.8)", // Reduce size
                    transformOrigin: "center", // Keep alignment
                  }}
                >
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
                      "& .MuiInputBase-input": {
                        fontSize: {
                          xs: "0.75rem", // Mobile
                          sm: "0.85rem", // Small devices
                          md: "0.9rem", // Medium devices
                          lg: "1rem", // Large devices
                        },
                        // Adjust input height
                        padding: {
                          xs: "8px 12px", // Mobile
                          md: "12px 14px", // Larger screens
                        },
                        // Optional: adjust overall height
                        height: {
                          xs: "15px", // Mobile
                          md: "25px", // Larger screens
                        },
                      },
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <Search
                            sx={{
                              fontSize: {
                                xs: "1rem", // Mobile
                                md: "1.25rem", // Larger screens
                              },
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
                    <Typography
                      padding={5}
                      variant='h6'
                      sx={{
                        justifyContent: "center",
                        color: "#8B8B8B",
                        fontSize: { xs: "0.75rem", md: "0.75rem", lg: "1rem" },
                      }}
                    >
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
                    height: "100%",
                    flexDirection: "column",
                  }}
                >
                  <Box sx={{ flex: 1, overflow: "hidden" }}>
                    {loading ? (
                      <Typography>Loading...</Typography>
                    ) : (
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          height: "100%",
                        }}
                      >
                        <Box sx={{ flex: 1, overflow: "hidden" }}>
                          <Virtuoso
                            style={{ height: "100%" }}
                            data={paginatedResearch}
                            itemContent={(index, paper) => (
                              <Box
                                key={paper.research_id}
                                sx={{
                                  padding: 2,
                                  borderBottom: "1px solid #ddd",
                                  cursor: "pointer",
                                }}
                                onClick={() => handleKey(paper.research_id)}
                              >
                                <Typography
                                  variant='h6'
                                  sx={{
                                    mb: 1,
                                    fontSize: {
                                      xs: "0.5rem",
                                      md: "0.75rem",
                                      lg: "1rem",
                                    },
                                    fontWeight: 500,
                                  }}
                                >
                                  {paper.title}
                                </Typography>
                                <Typography
                                  variant='body2'
                                  color='textSecondary'
                                  sx={{
                                    mb: 0.5,
                                    color: "#666",
                                    fontSize: {
                                      xs: "0.5rem",
                                      md: "0.5rem",
                                      lg: "0.75rem",
                                    },
                                  }}
                                >
                                  Status: {paper.status} | Authors:{" "}
                                  {paper.authors
                                    .map((author) => author.name)
                                    .join(", ")}{" "}
                                  | Last Updated: {paper.timestamp}
                                </Typography>
                              </Box>
                            )}
                          />
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            py: 1,
                            backgroundColor: "#fff",
                            borderTop: "1px solid #eee",
                          }}
                        >
                          <Pagination
                            count={Math.ceil(
                              filteredResearch.length / itemsPerPage
                            )}
                            page={currentPage}
                            onChange={handleChangePage}
                          />
                        </Box>
                      </Box>
                    )}
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
