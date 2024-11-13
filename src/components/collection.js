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
  const itemsPerPage = 5;

  const handleNavigateKnowledgeGraph = () => {
    navigate("/knowledgegraph");
  };

  const handleResearchItemClick = async (item) => {
    try {
        // Call the API to increment the view count
        const response = await fetch(`/paper/increment_views/${item.research_id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to increment view count');
        }

        // If the response is successful, get the updated view count from the response
        const data = await response.json();
        console.log(data.message);  // Optionally log the response message

        // Update the view count in the item object
        const updatedItem = { ...item, view_count: data.updated_views };

        // Set the updated item in the state to reflect the change in real-time
        setSelectedResearchItem(updatedItem);
    } catch (error) {
        console.error('Error:', error.message);
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
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery) ||
          item.concatenated_authors.toLowerCase().includes(searchQuery)
      );
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
        // Make the API request to get the PDF as a Blob kasi may proxy issue if directly window.open, so padaanin muna natin kay axios
        const response = await axios.get(
          `/paper/view_manuscript/${research_id}`,
          {
            responseType: "blob", // Get the response as a binary Blob (PDF)
          }
        );

        // Create a URL for the Blob and open it in a new tab
        const blob = new Blob([response.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);

        // Open the PDF in a new tab
        window.open(url, "_blank");
      } catch (error) {
        console.error("Error fetching the manuscript:", error);
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
        }}
      >
        <Navbar />
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            height: { xs: "100%", md: "calc(100vh - 9rem)" },
            marginTop: { xs: "3.5rem", sm: "4rem", md: "6rem" },
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

          {/* Main Content Section */}
          <Box
            sx={{
              flexGrow: 1,
              padding: 2,
              mb: 2,
            }}
          >
            <Grid2 container spacing={5} sx={{ height: "100%" }}>
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
                      height: "8rem",
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
                      height: "8rem",
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
              <Grid2 size={6}>
                <Box
                  sx={{
                    height: "100%",
                    boxSizing: "border-box",
                  }}
                >
                  <TextField
                    variant='outlined'
                    placeholder='Search by Title or Authors'
                    value={searchQuery}
                    onChange={handleSearchChange}
                    sx={{ width: "30rem", paddingBottom: "1rem" }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <Search />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Box sx={{ padding: 2, backgroundColor: "#F7F9FC" }}>
                    {loading ? (
                      <Typography>Loading...</Typography>
                    ) : (
                      <Virtuoso
                        style={{ height: "29rem" }}
                        data={paginatedResearch}
                        itemContent={(index, researchItem) => (
                          <Box
                            key={researchItem.research_id}
                            sx={{ marginBottom: 2, cursor: "pointer" }}
                            onClick={() =>
                              handleResearchItemClick(researchItem)
                            }
                          >
                            <Typography variant='h6'>
                              {researchItem.title}
                            </Typography>
                            <Typography variant='body2'>
                              {researchItem.program_name} |{" "}
                              {researchItem.concatenated_authors} |{" "}
                              {researchItem.year}
                            </Typography>
                            <Typography variant='caption'>
                              {researchItem.journal}
                            </Typography>
                          </Box>
                        )}
                      />
                    )}
                  </Box>
                  <Pagination
                    count={Math.ceil(filteredResearch.length / itemsPerPage)}
                    page={currentPage}
                    onChange={handleChangePage}
                    sx={{ mt: 1 }}
                  />
                </Box>
              </Grid2>
              <Grid2 size={3}>
                <Button
                  onClick={handleNavigateKnowledgeGraph}
                  sx={{
                    width: "100%",
                    height: "90%",
                    border: "1px solid #ccc",
                    padding: 0,
                    boxSizing: "border-box",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Box
                    sx={{
                      width: "100%",
                      height: "100%",
                      backgroundColor: "#FFF",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <img
                      src={DummyKG}
                      alt='Dummy Knowledge Graph'
                      style={{
                        width: "100%",
                        height: "auto",
                        objectFit: "contain",
                      }}
                    />
                  </Box>
                </Button>
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
            width: "auto",
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: 2,
            padding: 7
          }}
        >
          {selectedResearchItem && (
            <>
              <Typography variant='h3' fontWeight='700' sx={{ mb: "2rem" }} gutterBottom>
                {selectedResearchItem.title}
              </Typography>
              <Typography variant='body1' sx={{ mb: "1rem" }}>
                <strong>College Department:</strong> {selectedResearchItem.college_id}
              </Typography>
              <Typography variant='body1' sx={{ mb: "1rem" }}>
                <strong>Program:</strong> {selectedResearchItem.program_name}
              </Typography>
              <Typography variant='body1' sx={{ mb: "1rem" }}>
                <strong>Authors:</strong>{" "}
                {selectedResearchItem.concatenated_authors}
              </Typography>
              <Typography variant='body1' sx={{ mb: "1rem" }}>
                <strong>Abstract:</strong>{" "}
                {selectedResearchItem.abstract || "No abstract available"}
              </Typography>
              <Typography variant='body1' sx={{ mb: "1rem" }}>
                <strong>Keywords:</strong>{" "}
                {selectedResearchItem.concatenated_keywords ||
                  "No keywords available"}
              </Typography>
              <Typography variant='body1' sx={{ mb: "1rem" }}>
                <strong>Journal:</strong>{" "}
                {selectedResearchItem.journal}
              </Typography>
              <Typography variant='body1' sx={{ mb: "1rem" }}>
                <strong>Research Type:</strong>{" "}
                {selectedResearchItem.research_type}
              </Typography>
              <Typography variant='body1' sx={{ mb: "1rem" }}>
                <strong>SDG:</strong>{" "}
                {selectedResearchItem.sdg}
              </Typography>
              <Typography variant='body1' sx={{ mb: "1rem" }}>
                <strong>Year:</strong> {selectedResearchItem.year}
              </Typography>
              <Typography variant='body1' sx={{ mb: "1rem" }}>
                <strong>Download Count:</strong> {selectedResearchItem.download_count}
              </Typography>
              <Typography variant='body1' sx={{ mb: "1rem" }}>
                <strong>View Count:</strong> {selectedResearchItem.view_count}
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
                }}
                onClick={() => handleViewManuscript(selectedResearchItem)}
              >
                View Manuscript
              </Button>
            </>
          )}
        </Box>
      </Modal>
    </>
  );
};

export default DepartmentCollection;
