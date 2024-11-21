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
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Navbar from "./navbar";
import Footer from "./footer";
import homeBg from "../assets/home_bg.png";
import { Search } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import axios from "axios";
import { Virtuoso } from "react-virtuoso";
import AddPaperModal from "./addpapermodal";
import { useModalContext } from "./modalcontext";

const ManagePapers = () => {
  const navigate = useNavigate();
  const [userDepartment, setUserDepartment] = useState(null);
  const [userProgram, setUserProgram] = useState(null);
  const [colleges, setColleges] = useState([]);
  const [research, setResearch] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [allPrograms, setAllPrograms] = useState([]);
  const [filteredResearch, setFilteredResearch] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [dateRange, setDateRange] = useState([2010, 2024]);
  const [selectedPrograms, setSelectedPrograms] = useState([]);
  const [selectedColleges, setSelectedColleges] = useState([]);
  const [selectedFormats, setSelectedFormats] = useState([]);
  const itemsPerPage = 5;
  const [page, setPage] = useState(1);

  const handleNavigateHome = () => {
    navigate("/main");
  };
  const { isAddPaperModalOpen, openAddPaperModal, closeAddPaperModal } =
    useModalContext();
  const getUserId = () => {
    const userId = localStorage.getItem("user_id");
    return userId;
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
        // If no college is selected, fetch all programs
        setPrograms(allPrograms);
      }
    } catch (error) {
      console.error("Error fetching programs by college:", error);
    }
  };

  const fetchUserData = async () => {
    const userId = getUserId();
    if (userId) {
      try {
        const response = await axios.get(`/accounts/users/${userId}`);
        const data = response.data;
        setUserDepartment(data.researcher.college_id);
        setUserProgram(data.researcher.program_id);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
  };

  const fetchResearchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/dataset/fetch_ordered_dataset");
      console.log("Fetched research data:", response.data);
      if (response.data && response.data.dataset) {
        setResearch(response.data.dataset);
      }
    } catch (error) {
      console.error("Error fetching research:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchColleges();
    fetchAllPrograms();
    fetchResearchData();
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
        selectedColleges.includes(String(item.college_id))
      );
    }

    // Filter by Selected Programs
    if (selectedPrograms.length > 0) {
      filtered = filtered.filter((item) =>
        selectedPrograms.includes(item.program_name)
      );
    }

    // Filter by Selected Formats
    if (selectedFormats.length > 0) {
      filtered = filtered.filter((item) =>
        selectedFormats.some(
          (format) => format.toLowerCase() === item.journal.toLowerCase()
        )
      );
    }

    // Filter by Search Query
    if (searchQuery) {
      filtered = filtered.filter((item) => {
        const titleMatch = item.title.toLowerCase().includes(searchQuery);
        const authorMatch = item.authors.some((author) =>
          `${author.name} (${author.email})`.toLowerCase().includes(searchQuery)
        );
        return titleMatch || authorMatch;
      });
    }

    setFilteredResearch(filtered);
    setCurrentPage(1); // Reset to the first page on filter change
  }, [
    dateRange,
    selectedColleges,
    selectedPrograms,
    selectedFormats,
    searchQuery,
    research,
  ]);
  useEffect(() => {
    if (userDepartment) {
      setSelectedColleges([userDepartment]);
    }
    if (userProgram) {
      const program = allPrograms.find(
        (prog) => String(prog.program_id) === String(userProgram)
      );
      if (program) {
        setSelectedPrograms([program.program_name]);
      }
    }
  }, [userDepartment, userProgram, allPrograms]);
  // Handle change in search query
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };
  const handleCollegeChange = (e) => {
    const { value, checked } = e.target;
    setSelectedColleges((prev) =>
      checked ? [...prev, value] : prev.filter((item) => item !== value)
    );
  };

  // Handle change in date range filter
  const handleDateRangeChange = (event, newValue) => {
    setDateRange(newValue);
  };

  const handleKey = (key) => {
    navigate(`/updateresearchinfo/`, { state: { id: key } }); // change the page for viewing research output details
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
            marginTop: { xs: "3.5rem", sm: "4rem", md: "6rem" },
            height: {
              xs: "calc(100vh - 3.5rem)",
              sm: "calc(100vh - 4rem)",
              md: "calc(100vh - 6rem)",
            },
            overflow: "hidden",
          }}
        >
          {/* Header Section */}
          <Box
            sx={{
              position: "relative",
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              padding: 2,
              // gap: 4,
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
                Manage Papers
              </Typography>
            </Box>
          </Box>

          {/* Main Content Section */}
          <Box
            sx={{
              flex: 1,
              padding: 5,
              overflow: "hidden",
              height: "calc(100% - 48px)",
            }}
          >
            <Grid2
              container
              spacing={4}
              sx={{
                height: "100%",
                flexWrap: "nowrap",
              }}
            >
              <Grid2 size={3}>
                <Box
                  sx={{
                    border: "2px solid #0A438F",
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
                    sx={{ mb: 3, fontWeight: "bold", color: "#F40824" }}
                  >
                    Filters
                  </Typography>
                  <Box sx={{ mb: 4 }}>
                    <Typography
                    variant='body1'
                    sx={{
                      mb: 2,
                      color: "#08397C",
                      position: "relative",
                      zIndex: 2,
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
                        value={dateRange}
                        onChange={handleDateRangeChange}
                        valueLabelDisplay='on'
                        min={2010}
                        max={2024}
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
                  <Typography variant='body1' sx={{ mb: 1, color: "#08397C" }}>
                    College:
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      height: "25%",
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
                      />
                    ))}
                  </Box>

                  <Typography variant='body1' sx={{ mb: 1, color: "#08397C" }}>
                    Program:
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      height: "30%",
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
                      />
                    ))}
                  </Box>
                  <Typography variant='body1' sx={{ color: "#08397C" }}>
                    Publication Format:
                  </Typography>
                  {["Journal", "Proceeding", "Unpublished"].map((format) => (
                    <FormControlLabel
                      key={format}
                      control={
                        <Checkbox
                          checked={selectedFormats.includes(format)}
                          onChange={handleFormatChange}
                          value={format}
                        />
                      }
                      label={format}
                    />
                  ))}
                </Box>
              </Grid2>
              <Grid2 size={9}>
                <Box
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Box sx={{ mb: 2 }}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                      }}
                    >
                      <TextField
                        variant='outlined'
                        placeholder='Search by Title or Authors'
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

                      <Button
                        variant='contained'
                        color='primary'
                        sx={{
                          backgroundColor: "#08397C",
                          color: "#FFF",
                          fontFamily: "Montserrat, sans-serif",
                          fontWeight: 600,
                          textTransform: "none",
                          fontSize: { xs: "0.875rem", md: "1.275rem" },
                          padding: { xs: "0.5rem 1rem", md: "1.5rem" },
                          marginLeft: "2rem",
                          borderRadius: "100px",
                          maxHeight: "3rem",
                          "&:hover": {
                            backgroundColor: "#072d61",
                          },
                        }}
                        onClick={openAddPaperModal}
                      >
                        + Add New Paper
                      </Button>
                    </Box>
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
                    {loading ? (
                      <Typography>Loading...</Typography>
                    ) : research.length === 0 ? (
                      <Typography>No research papers found.</Typography>
                    ) : (
                      <>
                        <Box sx={{ flex: 1, overflow: "hidden" }}>
                          <Virtuoso
                            style={{ height: "100%" }}
                            data={paginatedResearch}
                            itemContent={(index, researchItem) => (
                              <Box
                                key={researchItem.research_id}
                                sx={{
                                  p: 2,
                                  cursor: "pointer",
                                  height: "120px",
                                  display: "flex",
                                  flexDirection: "column",
                                  justifyContent: "center",
                                  borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
                                  "&:hover": {
                                    backgroundColor: "rgba(0, 0, 0, 0.04)",
                                  },
                                }}
                                onClick={() =>
                                  handleKey(researchItem.research_id)
                                }
                              >
                                <Typography
                                  variant='h6'
                                  sx={{
                                    mb: 1.5,
                                    fontSize: "1.1rem",
                                    fontWeight: 500,
                                  }}
                                >
                                  {researchItem.title}
                                </Typography>
                                <Typography
                                  variant='body2'
                                  sx={{
                                    mb: 1,
                                    color: "#666",
                                  }}
                                >
                                  {researchItem.program_name} |{" "}
                                  {Array.isArray(researchItem.authors)
                                    ? researchItem.authors
                                        .map((author) => `${author.name}`)
                                        .join("; ")
                                    : "No authors available"}{" "}
                                  | {researchItem.year}
                                </Typography>
                                <Typography
                                  variant='caption'
                                  sx={{
                                    color: "#0A438F",
                                    fontWeight: 500,
                                  }}
                                >
                                  {researchItem.journal}
                                </Typography>
                              </Box>
                            )}
                          />
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            pt: 1,
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
                      </>
                    )}
                  </Box>
                </Box>
              </Grid2>
            </Grid2>
          </Box>
          <AddPaperModal
            isOpen={isAddPaperModalOpen}
            handleClose={closeAddPaperModal}
            onPaperAdded={fetchResearchData}
          />
        </Box>
      </Box>
    </>
  );
};

export default ManagePapers;
