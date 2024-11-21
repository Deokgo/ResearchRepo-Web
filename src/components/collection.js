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
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';
import axios from "axios";
import { Virtuoso } from "react-virtuoso";
import DummyKG from "../assets/dummy_kg_keyword.png";
import Modal from "@mui/material/Modal";

const DepartmentCollection = () => {
  const navigate = useNavigate();
  const [userDepartment, setUserDepartment] = useState(null);
  const [research, setResearch] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [allPrograms, setAllPrograms] = useState([]);
  const [filteredResearch, setFilteredResearch] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [dateRange, setDateRange] = useState([2010, 2024]);
  const [selectedColleges, setSelectedColleges] = useState([]);
  const [selectedPrograms, setSelectedPrograms] = useState([]);
  const [selectedFormats, setSelectedFormats] = useState([]);
  const [selectedResearchItem, setSelectedResearchItem] = useState(null);
  const [response, setReponse] = useState(null);
  const itemsPerPage = 5;

  const handleNavigateKnowledgeGraph = () => {
    navigate("/knowledgegraph");
  };

  const handleResearchItemClick = async (item) => {
    try {
      const currentTime = Date.now(); // Get the current timestamp
      const lastViewedTimeKey = `lastViewedTime_${item.research_id}`;
      const lastViewedTime = parseInt(localStorage.getItem(lastViewedTimeKey), 10);
      const userId = localStorage.getItem("user_id");
  
      // Determine if increment is needed
      const isIncrement = !lastViewedTime || currentTime - lastViewedTime > 30000;
  
      const response = await axios.put(
        `/paper/increment_views/${item.research_id}?is_increment=${isIncrement}`,
        {
          user_id: userId,
        }
      );
  
      // Update the item and save the current timestamp
      const updatedItem = {
        ...item,
        view_count: response.data.updated_views,
        download_count: response.data.download_count,
      };
  
      setSelectedResearchItem(updatedItem);
      if (isIncrement) {
        localStorage.setItem(lastViewedTimeKey, currentTime); // Save the current timestamp
      }
    } catch (error) {
      console.error("Error incrementing view count:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        item: item,
      });
      setSelectedResearchItem(item); // Fall back to the original item if an error occurs
    }
  };
  
  const handleCloseModal = () => {
    setSelectedResearchItem(null);
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

  // Fetch programs based on selected colleges
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
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
  };
  const fetchAllResearchData = async () => {
    try {
      const response = await axios.get(`/dataset/fetch_ordered_dataset`);
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
        const titleMatch = item.title
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        const authorMatch = item.authors.some(
          (author) =>
            author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            author.email.toLowerCase().includes(searchQuery.toLowerCase())
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

  // Handle change in search query
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  // Handle change in date range filter
  const handleDateRangeChange = (event, newValue) => {
    setDateRange(newValue);
  };
  const handleCollegeChange = (event) => {
    const { value, checked } = event.target;
    setSelectedColleges((prev) =>
      checked ? [...prev, value] : prev.filter((item) => item !== value)
    );
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

  const handleViewManuscript = async (researchItem) => {
    const { research_id } = researchItem;
    if (research_id) {
      try {
        // Make the API request to get the PDF as a Blob
        const response = await axios.get(
          `/paper/view_manuscript/${research_id}`,
          {
            responseType: "blob",
          }
        );
  
        // Create a URL for the Blob and open it in a new tab
        const blob = new Blob([response.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);
        window.open(url, "_blank");
  
        // Increment the download count after successfully displaying the Blob
        const userId = localStorage.getItem("user_id");
        const incrementResponse = await axios.put(
          `/paper/increment_downloads/${research_id}`,
          {
            user_id: userId,
          }
        );
  
        // Update the download count in the researchItem object
        const updatedItem = {
          ...researchItem,
          download_count: incrementResponse.data.updated_downloads,
        };
        setSelectedResearchItem(updatedItem);
      } catch (error) {
        console.error("Error handling manuscript:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          item: researchItem,
        });
        alert("Failed to retrieve the manuscript. Please try again.");
      }
    } else {
      alert("No manuscript available for this research.");
    }
  };  

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
          {/* Header with back button */}
          <Box
            sx={{
              position: "relative",
              height: { xs: "5rem", md: "6rem" },
              backgroundColor: "#0A438F",
              backgroundSize: "cover",
              backgroundPosition: "center",
              display: "flex",
              alignItems: "center",
              padding: 2,
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
                Collections
              </Typography>
            </Box>
          </Box>

          {/* Main content area */}
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
              {/* Filters Section */}
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

              {/* Research List Section */}
              <Grid2 size={6}>
                <Box
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <TextField
                    variant='outlined'
                    placeholder='Search by Title or Authors'
                    value={searchQuery}
                    onChange={handleSearchChange}
                    sx={{
                      width: "100%",
                      mb: 2,
                    }}
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
              </Grid2>

              {/* Knowledge Graph Section */}
              <Grid2 size={3}>
                <Box
                  sx={{
                    height: "100%",
                    border: "1px solid #ccc",
                    borderRadius: 3,
                    overflow: "hidden",
                  }}
                >
                  <Button
                    onClick={handleNavigateKnowledgeGraph}
                    sx={{
                      width: "100%",
                      height: "100%",
                      p: 0,
                    }}
                  >
                    <img
                      src={DummyKG}
                      alt='Dummy Knowledge Graph'
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </Button>
                </Box>
              </Grid2>
            </Grid2>
          </Box>
        </Box>
      </Box>

      {/* View Research Details */}
      <Modal open={Boolean(selectedResearchItem)} onClose={handleCloseModal}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80rem",
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: 2,
            py: 8,
            pl: 5,
            pr: 5,
            height: "45rem",
            overflow: "hidden",
            overflowY: "scroll",
          }}
        >
          {selectedResearchItem && (
            <>
              <Grid2 container display='flex' flexDirection='column' justifyContent='center'>
                <Typography
                  variant='h3'
                  alignSelf='center'
                  textAlign="center"
                  fontWeight='700'
                  sx={{ color: "#08397C", width: "100%"}}
                  gutterBottom
                >
                  {selectedResearchItem.title}
                </Typography>
                <Typography 
                  variant='h6' 
                  sx={{ mb: "1rem" }} 
                  alignSelf='center'
                  fontWeight='600'
                >
                  {Array.isArray(selectedResearchItem.authors)
                    ? selectedResearchItem.authors
                        .map((author) => `${(author.name)}`)
                        .join(", ")
                    : "No authors available"}
                </Typography>
                <Typography
                  variant='h7' 
                  sx={{ mb: "1rem", color:"#8B8B8B"}} 
                  alignSelf='center'
                  fontWeight='500'
                >
                  {selectedResearchItem.year}
                </Typography>
              </Grid2>

              <Grid2 container display='flex' justifyContent='flex-end'>
                <Stack direction="row" alignContent="center" gap={1}>
                  <DownloadIcon color='primary'/>
                  <Typography variant='h7' sx={{ mr: "2rem" }}>
                    {selectedResearchItem.download_count} Downloads
                  </Typography>
                </Stack>
                <Stack direction="row" alignContent="center" gap={1}>
                  <VisibilityIcon color='primary'/>
                  <Typography variant='h7' sx={{ mr: "1rem" }}>
                    {selectedResearchItem.view_count} Views
                  </Typography>
                </Stack>
              </Grid2>
              
              <Divider variant="middle" sx={{ mt: "1rem", mb: "2rem"}}/>

              <Grid2 container display='flex' paddingLeft={2} paddingRight={2}>
                <Grid2 size={8} paddingRight={10}>
                  <Typography variant='h6' fontWeight='700' sx={{ mb: "1rem" }}>Keywords:</Typography>
                  <Typography variant='body1'>
                    {Array.isArray(selectedResearchItem.keywords)
                      ? selectedResearchItem.keywords.join("; ")
                      : "No keywords available"}
                  </Typography>
                  <Typography variant='h6' fontWeight='700' sx={{ mt: "2rem", mb: "1rem" }}>Abstract:</Typography>
                  <Typography variant='body1'>
                    {selectedResearchItem.abstract || "No abstract available"}
                  </Typography>
                </Grid2>
                <Grid2 size={4} justifyContent='flex-end'>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      position: "absolute",
                      width: "auto",
                      bgcolor: "#f0f0f0",
                      borderRadius: 2,
                      marginRight: 5,
                      padding: 3,
                      height: "auto",
                    }}
                  >
                    <Typography variant='h7' sx={{ mb: "1rem" }}>
                      <strong>College Department:</strong>{" "}
                      {selectedResearchItem.college_id}
                    </Typography>
                    <Typography variant='h7' sx={{ mb: "1rem" }}>
                      <strong>Program:</strong> {selectedResearchItem.program_name}
                    </Typography>
                    <Typography variant='body1' sx={{ mb: "1rem" }}>
                      <strong>Adviser:</strong>{" "}
                      {selectedResearchItem.adviser
                        ? `${selectedResearchItem.adviser.name}`
                        : "No adviser available"}
                    </Typography>
                    <Typography variant='body1' sx={{ mb: "1rem" }}>
                      <strong>Panel Members:</strong>{" "}
                      {Array.isArray(selectedResearchItem.panels) &&
                      selectedResearchItem.panels.length > 0
                        ? selectedResearchItem.panels
                            .map((panel) => `${panel.name}`)
                            .join("; ")
                        : "No panel members available"}
                    </Typography>
                    <Button
                      variant='contained'
                      color='primary'
                      sx={{
                        backgroundColor: "#08397C",
                        color: "#FFF",
                        fontFamily: "Montserrat, sans-serif",
                        fontWeight: 400,
                        textTransform: "none",
                        fontSize: { xs: "0.875rem", md: "1rem" },
                        padding: { xs: "0.5rem 1rem", md: "1rem" },
                        marginTop: "2rem",
                        width: "13rem",
                        alignSelf: "center",
                        borderRadius: "100px",
                        maxHeight: "3rem",
                        "&:hover": {
                          backgroundColor: "#072d61",
                        },
                      }}
                      onClick={() => handleViewManuscript(selectedResearchItem)}
                    >
                      View PDF
                    </Button>
                  </Box>               
                </Grid2>
              </Grid2>
              {/*
              <Typography variant='body1' sx={{ mb: "1rem" }}>
                <strong>Journal:</strong> {selectedResearchItem.journal}
              </Typography>
              <Typography variant='body1' sx={{ mb: "1rem" }}>
                <strong>Research Type:</strong>{" "}
                {selectedResearchItem.research_type}
              </Typography>
              <Typography variant='body1' sx={{ mb: "1rem" }}>
                <strong>SDG:</strong> {selectedResearchItem.sdg}
              </Typography>
              */}
            </>
          )}
        </Box>
      </Modal>
    </>
  );
};

export default DepartmentCollection;
