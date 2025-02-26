import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid2,
  IconButton,
  InputAdornment,
  Pagination,
  Slider,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import { Search } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { Virtuoso } from "react-virtuoso";
import { useModalContext } from "../context/modalcontext";
import AddPaperModal from "../components/addpapermodal";
import { useAuth } from "../context/AuthContext";
import { filterCache } from "../utils/filterCache";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HeaderWithBackButton from "../components/Header";
import AddIcon from "@mui/icons-material/Add";

// Debounce function to limit rapid state updates
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

const Collection = () => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width:600px)"); // Checks if the screen is 600px or smaller (mobile)
  const [research, setResearch] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [allPrograms, setAllPrograms] = useState([]);
  const [filteredResearch, setFilteredResearch] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [dateRange, setDateRange] = useState([2010, 2025]); // Default min and max year
  const [sliderValue, setSliderValue] = useState([2010, 2025]); // Initial slider value
  const [selectedColleges, setSelectedColleges] = useState([]);
  const [selectedPrograms, setSelectedPrograms] = useState([]);
  const [selectedFormats, setSelectedFormats] = useState([]);
  const [publicationFormats, setPublicationFormats] = useState([]);
  const [selectedResearchItem, setSelectedResearchItem] = useState(null);
  const [response, setReponse] = useState(null);
  const itemsPerPage = 10;
  const { isAddPaperModalOpen, openAddPaperModal, closeAddPaperModal } =
    useModalContext();
  const { user } = useAuth();
  const [otherSectionsVisible, setOtherSectionsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedColleges = useDebounce(selectedColleges, 300);

  // Fetch publication formats from the API
  useEffect(() => {
    const fetchPublicationFormats = async () => {
      try {
        const response = await api.get("/paper/publication_format");
        setPublicationFormats(response.data.publication_formats);
      } catch (error) {
        console.error("Error fetching publication formats:", error);
      }
    };

    fetchPublicationFormats();
  }, []);

  const handleResearchItemClick = async (item) => {
    try {
      // Navigate to the research details page immediately
      navigate(`/displayresearchinfo/${item.research_id}`, {
        state: { id: item.research_id },
      });
    } catch (error) {
      console.error("Error handling research item click:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        item: item,
      });
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
        const response = await api.get(`/accounts/users/${userId}`);
        const data = response.data;
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
  };

  const fetchAllResearchData = async () => {
    try {
      const response = await api.get(`/dataset/fetch_ordered_dataset`);
      let fetchedResearch = response.data.dataset;

      // Apply automatic filtering based on user college/program
      if (user?.role === "04" || user?.role === "05") {
        setSelectedColleges(user?.college);
        fetchedResearch = fetchedResearch.filter(
          (item) => item.college_id === user?.college
        );
        if (user?.role === "05") {
          fetchedResearch = fetchedResearch.filter(
            (item) => item.program_id === user?.program
          );
        }
      }

      setResearch(fetchedResearch);
      setFilteredResearch(fetchedResearch);
    } catch (error) {
      console.error("Error fetching all research data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      try {
        // Only read from cache, don't fetch
        const cached = filterCache.get();
        if (cached) {
          console.log("[Collection] Using cached filter data");
          setColleges(cached.colleges);
          setPrograms(cached.programs);
          setAllPrograms(cached.programs);
        }

        // Fetch other data specific to collection page
        await fetchUserData();
        await fetchAllResearchData();
      } catch (error) {
        console.error("Error initializing data:", error);
      }
    };

    initializeData();
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

        // Only proceed with selected programs if cached.programs exists
        if (cached.programs) {
          // Add any selected programs that aren't in the filtered list
          const selectedProgramObjects = cached.programs.filter((program) =>
            selectedPrograms.includes(program.program_name)
          );

          // Combine and remove duplicates
          filteredPrograms = [
            ...new Map(
              [...filteredPrograms, ...selectedProgramObjects].map(
                (program) => [program.program_name, program]
              )
            ).values(),
          ];
        }

        setPrograms(filteredPrograms || []);
      } else {
        // If cache is empty or invalid, set empty programs array
        setPrograms([]);

        // Optionally, you could fetch the data here
        // fetchAndCacheFilterData().then(data => {
        //   if (data) setPrograms(data.programs || []);
        // });
      }
    }
  }, [debouncedColleges, isLoading, selectedPrograms]);

  useEffect(() => {
    const applyFilters = () => {
      try {
        console.log("Applying filters with:", {
          researchCount: research?.length,
          selectedColleges,
          selectedPrograms,
          sliderValue,
          selectedFormats,
          searchQuery,
        });

        if (!research) {
          console.log("No research data available");
          setFilteredResearch([]);
          return;
        }

        let filtered = [...research];
        console.log("Initial filtered count:", filtered.length);

        // Handle college and program filtering
        if (selectedColleges.length > 0 || selectedPrograms.length > 0) {
          filtered = filtered.filter((item) => {
            // Check if item matches any selected program
            const matchesProgram =
              selectedPrograms.length > 0 &&
              selectedPrograms.includes(item.program_name);

            // Check if item's college is selected
            const matchesCollege =
              selectedColleges.length > 0 &&
              selectedColleges.includes(String(item.college_id));

            // Show items that either:
            // 1. Match any selected program (regardless of college), OR
            // 2. Belong to a selected college (if no program from that college is selected)
            return (
              matchesProgram ||
              (matchesCollege &&
                !selectedPrograms.some((prog) => {
                  // Find the college of this selected program
                  const programCollege = programs.find(
                    (p) => p.program_name === prog
                  )?.college_id;
                  // Only apply college filter if no program from this college is selected
                  return String(programCollege) === String(item.college_id);
                }))
            );
          });
          console.log("After college/program filter:", filtered.length);
        }

        // Apply remaining filters
        if (
          sliderValue[0] !== dateRange[0] ||
          sliderValue[1] !== dateRange[1]
        ) {
          filtered = filtered.filter(
            (item) => item.year >= sliderValue[0] && item.year <= sliderValue[1]
          );
        }

        if (selectedFormats.length > 0) {
          filtered = filtered.filter((item) =>
            selectedFormats.some(
              (format) => format.toLowerCase() === item.journal.toLowerCase()
            )
          );
        }

        if (searchQuery) {
          try {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter((item) => {
              try {
                const titleMatch =
                  item.title?.toLowerCase().includes(query) ?? false;
                const authorMatch =
                  item.authors?.some(
                    (author) =>
                      author.name?.toLowerCase().includes(query) ||
                      author.email?.toLowerCase().includes(query)
                  ) ?? false;

                return titleMatch || authorMatch;
              } catch (error) {
                return false; // Skip this item if an error occurs
              }
            });
          } catch (error) {
            return false;
          }
        }

        console.log("Final filtered count:", filtered.length);
        setFilteredResearch(filtered);
        setCurrentPage(1);
      } catch (error) {
        console.error("Error applying filters:", error);
        setFilteredResearch([]);
      }
    };

    const timeoutId = setTimeout(applyFilters, 300);
    return () => clearTimeout(timeoutId);
  }, [
    research,
    selectedColleges,
    selectedPrograms,
    programs,
    sliderValue,
    selectedFormats,
    searchQuery,
    dateRange,
  ]);

  // Handle change in search query
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Function to fetch the year range dynamically
  useEffect(() => {
    async function fetchDateRange() {
      try {
        console.log("Fetching date range...");
        const response = await api.get("/dataset/fetch_date_range");
        console.log("Date range response:", response.data);
        if (response.data && response.data.date_range) {
          const { min_year, max_year } = response.data.date_range;
          setDateRange([min_year, max_year]);
          setSliderValue([min_year, max_year]);
        }
      } catch (error) {
        console.error("Failed to fetch date range:", error);
      }
    }
    fetchDateRange();
  }, []);

  // Handle change in date range filter
  const handleDateRangeChange = (event, newValue) => {
    setSliderValue(newValue);
  };
  const handleCollegeChange = (event) => {
    const { value, checked } = event.target;
    setSelectedColleges((prev) => {
      const newSelection = checked
        ? [...prev, value]
        : prev.filter((item) => item !== value);
      return newSelection;
    });
  };
  // Handle change in selected programs filter
  const handleProgramChange = (event) => {
    const { value, checked } = event.target;
    setSelectedPrograms((prev) =>
      checked ? [...prev, value] : prev.filter((item) => item !== value)
    );
  };

  // Handle change in selected formats filter
  const handleFormatChange = (event) => {
    const { value, checked } = event.target;
    setSelectedFormats((prev) =>
      checked ? [...prev, value] : prev.filter((item) => item !== value)
    );
  };

  // Handle pagination change
  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  // Get the paginated research outputs
  const paginatedResearch = filteredResearch.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    // If the screen is mobile, hide the other sections
    setOtherSectionsVisible(!isMobile);
  }, [isMobile]);

  const handleResetFilters = () => {
    setSelectedColleges([]);
    setSelectedPrograms([]);
    setSelectedFormats([]);
    setSliderValue(dateRange); // Reset to the default year range
  };

  const [expandedAccordion, setExpandedAccordion] = useState(null);

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
            title='Collections'
            onBack={() => navigate(-1)}
          />

          {/* Main content area */}
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
              spacing={3}
              sx={{
                height: "100%",
                flexWrap: "nowrap",
              }}
            >
              {/* Filters Section */}
              {!isMobile && (
                <Grid2 size={3}>
                  <Box
                    sx={{
                      border: "1px solid #0A438F",
                      height: "80%",
                      borderRadius: 3,
                      padding: 3,
                      overflow: "auto",
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

                    {user?.role !== "04" && (
                      <>
                        {user?.role !== "05" && (
                          <Accordion
                            expanded={expandedAccordion === "college"}
                            onChange={() =>
                              setExpandedAccordion(
                                expandedAccordion === "college"
                                  ? null
                                  : "college"
                              )
                            }
                          >
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
                              <Box
                                sx={{
                                  maxHeight: "125px",
                                  overflow: "auto",
                                  display: "flex",
                                  flexDirection: "column",
                                }}
                              >
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
                        )}
                      </>
                    )}

                    {user?.role !== "05" && (
                      <Accordion
                        expanded={expandedAccordion === "program"}
                        onChange={() =>
                          setExpandedAccordion(
                            expandedAccordion === "program" ? null : "program"
                          )
                        }
                      >
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
                          <Box
                            sx={{
                              maxHeight: "125px",
                              overflow: "auto",
                              display: "flex",
                              flexDirection: "column",
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
                        </AccordionDetails>
                      </Accordion>
                    )}

                    <Accordion
                      expanded={expandedAccordion === "format"}
                      onChange={() =>
                        setExpandedAccordion(
                          expandedAccordion === "format" ? null : "format"
                        )
                      }
                    >
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
                          Publication Format
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Box
                          sx={{
                            maxHeight: "125px",
                            overflow: "auto",
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          {publicationFormats.map((format) => (
                            <FormControlLabel
                              key={format.id}
                              control={
                                <Checkbox
                                  checked={selectedFormats.includes(
                                    format.name
                                  )}
                                  onChange={handleFormatChange}
                                  value={format.name}
                                />
                              }
                              label={format.name}
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
                  <Button
                    onClick={handleResetFilters}
                    variant='outlined'
                    sx={{
                      color: "#08397C",
                      border: "1px solid #08397C",
                      fontFamily: "Montserrat, sans-serif",
                      fontWeight: 600,
                      textTransform: "none",
                      fontSize: { xs: "0.80rem", md: "0.85rem", lg: "0.9rem" },
                      width: "100%",
                      marginTop: "1rem",
                      padding: "0.5rem",
                      borderRadius: "100px",
                      "&:hover": {
                        backgroundColor: "#072d61",
                        color: "#FFF",
                      },
                    }}
                  >
                    Reset Filter
                  </Button>
                </Grid2>
              )}

              {/* Research List Section */}
              <Grid2 size={otherSectionsVisible ? 9 : 12}>
                <Box
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Box
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        gap: 2,
                        mb: 1,
                      }}
                    >
                      <TextField
                        variant='outlined'
                        placeholder='Search by Title or Authors'
                        value={searchQuery}
                        onChange={handleSearchChange}
                        sx={{
                          flex: 2,
                          "& .MuiInputBase-input": {
                            fontSize: {
                              xs: "0.5rem",
                              md: "0.75rem",
                              lg: "1rem",
                            },
                          },
                          "& .MuiInputBase-input::placeholder": {
                            fontSize: "0.85rem", // Adjust placeholder font size
                            color: "rgba(0, 0, 0, 0.5)", // Optional: Adjust placeholder color
                          },
                        }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position='start'>
                              <Search />
                            </InputAdornment>
                          ),
                        }}
                      />

                      {!isMobile && user?.role === "05" && (
                        <Button
                          variant='contained'
                          color='primary'
                          sx={{
                            backgroundColor: "#08397C",
                            color: "#FFF",
                            fontFamily: "Montserrat, sans-serif",
                            fontWeight: 600,
                            textTransform: "none",
                            fontSize: { xs: "0.875rem", md: "1rem" },
                            padding: { xs: "0.5rem 1rem", md: "1.25rem" },
                            marginLeft: "1rem",
                            borderRadius: "100px",
                            maxHeight: "3rem",
                            "&:hover": {
                              backgroundColor: "#072d61",
                            },
                          }}
                          onClick={openAddPaperModal}
                        >
                          <AddIcon></AddIcon>&nbsp;Add New Paper
                        </Button>
                      )}
                    </Box>
                    <Box
                      sx={{
                        flex: 1,
                        backgroundColor: "#F7F9FC",
                        borderRadius: 1,
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Box sx={{ flex: 1, overflow: "hidden" }}>
                        {loading ? (
                          <Typography>Loading...</Typography>
                        ) : (
                          <Virtuoso
                            style={{ height: "100%" }}
                            data={paginatedResearch}
                            itemContent={(index, researchItem) => (
                              <Box
                                key={researchItem.research_id}
                                sx={{
                                  p: 2,
                                  cursor: "pointer",
                                  minHeight: "calc((100% - 48px) / 5)",
                                  display: "flex",
                                  flexDirection: "column",
                                  justifyContent: "center",
                                  borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
                                  "&:hover": {
                                    backgroundColor: "rgba(0, 0, 0, 0.04)",
                                  },
                                }}
                                onClick={() =>
                                  handleResearchItemClick(researchItem)
                                }
                              >
                                <Typography
                                  variant='h6'
                                  sx={{
                                    mb: 0.8,
                                    fontSize: {
                                      xs: "0.5rem",
                                      md: "0.75rem",
                                      lg: "1rem",
                                    },
                                    fontWeight: 500,
                                  }}
                                >
                                  {researchItem.title}
                                </Typography>
                                <Typography
                                  variant='body2'
                                  sx={{
                                    color: "#666",
                                    fontSize: {
                                      xs: "0.5rem",
                                      md: "0.5rem",
                                      lg: "0.75rem",
                                    },
                                  }}
                                >
                                  {researchItem.program_name} |{" "}
                                  {researchItem.authors
                                    .map((author) => author.name)
                                    .join("; ")}{" "}
                                  | {researchItem.year}
                                </Typography>
                                <Typography
                                  variant='caption'
                                  sx={{
                                    color: "#0A438F",
                                    fontWeight: 500,
                                    fontSize: {
                                      xs: "0.5rem",
                                      md: "0.5rem",
                                      lg: "0.75rem",
                                    },
                                  }}
                                >
                                  {researchItem.journal}
                                </Typography>
                              </Box>
                            )}
                          />
                        )}
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
                  </Box>
                </Box>
              </Grid2>

              {/* Knowledge Graph Section 

                {!isMobile && (
                  <Grid2
                    size={{ xs: 12, sm: 6, md: 3 }}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginBottom: "1rem",
                    }}
                  >
                    <Box
                      sx={{
                        width: "100%",
                        height: "100%", // Ensures Box takes full height
                        border: "1px solid #ccc",
                        borderRadius: 3,
                        position: "relative", // For child positioning
                        overflow: "hidden", // Prevents content overflow
                        boxSizing: "border-box", // Ensures padding is included in dimensions
                        padding: "0.5rem 1rem 1rem 0.5rem", // top, right, bottom, left
                      }}
                    >
                      <iframe
                        src='http://localhost:5000/collectionkg'
                        style={{
                          width: "100%", // Adjusts to parent size
                          height: "100%", // Adjusts to parent size
                          border: "none", // Removes border
                          display: "block", // Prevents inline-block spacing
                          margin: 0, // Removes default iframe margin
                          padding: 0, // Removes default iframe padding
                          overflow: "hidden", // Prevents content overflow inside iframe
                        }}
                        scrolling='no' // Removes the scrollbar
                      />
                      <Box
                        onClick={handleNavigateKnowledgeGraph}
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          cursor: "pointer",
                          backgroundColor: "transparent", // No visual interference
                        }}
                      />
                    </Box>
                  </Grid2>
                )}
              
              */}
            </Grid2>
          </Box>
        </Box>
      </Box>
      <AddPaperModal
        isOpen={isAddPaperModalOpen}
        handleClose={closeAddPaperModal}
        onPaperAdded={fetchAllResearchData}
      />
    </>
  );
};

export default Collection;
