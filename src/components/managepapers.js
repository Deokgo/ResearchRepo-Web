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
  const refreshResearchData = () => {
    fetchAllResearchData();
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
                Manage Papers
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
                    sx={{
                      mb: 2,
                      fontWeight: "bold",
                      color: "#0A438F",
                      fontSize: "1.5rem",
                    }}
                  >
                    {userProgram}
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
              <Grid2 size={9}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
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
                  </Box>

                  <Button
                    variant='contained'
                    color='primary'
                    sx={{
                      backgroundColor: "#08397C",
                      color: "#FFF",
                      fontFamily: "Montserrat, sans-serif",
                      fontWeight: 600,
                      textTransform: "none",
                      fontSize: { xs: "0.875rem", md: "1.375rem" },
                      padding: { xs: "0.5rem 1rem", md: "1.5rem" },
                      marginLeft: "2rem",
                      borderRadius: "100px",
                      maxHeight: "3rem",
                    }}
                    onClick={openAddPaperModal}
                  >
                    Add New Paper
                  </Button>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    paddingTop: 2,
                    height: "60vh",
                  }}
                >
                  <Box sx={{ padding: 2, backgroundColor: "#F7F9FC" }}>
                    {loading ? (
                      <Typography>Loading...</Typography>
                    ) : (
                      <Virtuoso
                        style={{ height: "28rem" }}
                        data={paginatedResearch}
                        itemContent={(index, researchItem) => (
                          <Box
                            key={researchItem.research_id}
                            sx={{ marginBottom: 2 }}
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
            </Grid2>
          </Box>
          <AddPaperModal
            isOpen={isAddPaperModalOpen}
            handleClose={closeAddPaperModal}
            onPaperAdded={refreshResearchData}
          />
        </Box>
      </Box>
    </>
  );
};

export default ManagePapers;
