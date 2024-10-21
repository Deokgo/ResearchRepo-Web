import React, { useEffect, useState } from "react";
import Navbar from "./navbar";
import Footer from "./footer";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
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
import { Search } from "@mui/icons-material";
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
  const [selectedStatus, setSelectedStatus] = useState([
    "Submitted",
    "Accepted",
    "Published",
  ]);

  const handleFormatChange = (event) => {
    const { value } = event.target;
    setSelectedStatus((prevSelected) =>
      prevSelected.includes(value)
        ? prevSelected.filter((status) => status !== value)
        : [...prevSelected, value]
    );
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

    // Filter by Selected Formats
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

  const handleOpenModal = (user) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedUser(null);
  };

  const handleSaveChanges = () => {
    console.log(
      "Saving changes for:",
      selectedUser.research_id,
      "New Role:",
      newRole
    );
    setOpenModal(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const paginatedResearch = filteredResearch.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );
  const numberFontSettings = {
    fontFamily: "Montserrat, sans-serif",
    fontWeight: 500,
    fontSize: { xs: "1.5rem", sm: "2rem", md: "3rem" },
    color: "#08397C",
    mb: 2,
    lineHeight: 1.25,
    alignSelf: "center",
    zIndex: 2,
  };

  const labelFontSettings = {
    fontFamily: "Montserrat, sans-serif",
    fontWeight: 400,
    fontSize: { xs: "1.5rem", sm: "2rem", md: "1.25rem" },
    color: "#DF031D",
    mb: 2,
    lineHeight: 1.25,
    alignSelf: "center",
    zIndex: 2,
  };

  const boxSettings = {
    display: "flex",
    padding: 2,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
  };

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
              height: { xs: "5rem", md: "8rem" },
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
                  fontSize: { xs: "1.5rem", sm: "2rem", md: "3rem" },
                  color: "#FFF",
                  mb: 2,
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
                  <Divider orientation='horizontal' />
                  <Typography variant='body1' sx={{ mb: 1, color: "#08397C" }}>
                    Research Status:
                  </Typography>
                  {[
                    "Ready",
                    "Submitted",
                    "Accepted",
                    "Published",
                    "Pullout",
                  ].map((format) => (
                    <FormControlLabel
                      key={format}
                      control={
                        <Checkbox
                          checked={selectedStatus.includes(format)}
                          onChange={handleFormatChange}
                          value={format}
                        />
                      }
                      label={format}
                    />
                  ))}
                </Box>
              </Grid2>
              <Grid2 display='flex' justifyContent='flex-start' size={9}>
                {/* Container for Stats, Search Bar, and Virtuoso Table (Right) */}
                <Box sx={{ flexBasis: "90%" }}>
                  {/* Stats Section */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 4,
                    }}
                  >
                    <Paper
                      variant='outlined'
                      square={false}
                      sx={{
                        textAlign: "center",
                        width: "100%",
                        height: "auto",
                        display: "flex",
                        justifyContent: "space-around",
                        padding: 2,
                        borderRadius: 3,
                        borderColor: "#001C43",
                      }}
                    >
                      <Box sx={boxSettings}>
                        <Typography variant='h3' sx={numberFontSettings}>
                          37
                        </Typography>
                        <Typography variant='h3' sx={labelFontSettings}>
                          READY
                        </Typography>
                      </Box>
                      <Box sx={boxSettings}>
                        <Typography variant='h3' sx={numberFontSettings}>
                          2
                        </Typography>
                        <Typography variant='h3' sx={labelFontSettings}>
                          SUBMITTED
                        </Typography>
                      </Box>
                      <Box sx={boxSettings}>
                        <Typography variant='h3' sx={numberFontSettings}>
                          187
                        </Typography>
                        <Typography variant='h3' sx={labelFontSettings}>
                          ACCEPTED
                        </Typography>
                      </Box>
                      <Box sx={boxSettings}>
                        <Typography variant='h3' sx={numberFontSettings}>
                          26
                        </Typography>
                        <Typography variant='h3' sx={labelFontSettings}>
                          PUBLISHED
                        </Typography>
                      </Box>
                    </Paper>
                  </Box>

                  {/* Search Bar */}
                  <TextField
                    variant='outlined'
                    placeholder='Search by Title or Code'
                    value={searchQuery}
                    onChange={handleSearchChange}
                    sx={{
                      width: "40%",
                      display: "flex",
                      justifyContent: "flex-start",
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <Search />
                        </InputAdornment>
                      ),
                    }}
                  />

                  {/* Virtuoso Table */}
                  <Box sx={{ padding: 2, backgroundColor: "#F7F9FC" }}>
                    {loading ? (
                      <Typography>Loading...</Typography>
                    ) : (
                      <Virtuoso
                        style={{ height: "400px" }}
                        data={paginatedResearch}
                        itemContent={(index, paper) => (
                          <Box
                            key={paper.research_id}
                            sx={{
                              padding: 2,
                              borderBottom: "1px solid #ddd",
                              cursor: "pointer",
                            }}
                            onClick={() => handleOpenModal(paper)}
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

        {/* Modal for Updating Status */}
        <Modal open={openModal} onClose={handleCloseModal}>
          <Box
            sx={{
              width: "400px",
              bgcolor: "background.paper",
              p: 4,
              borderRadius: 2,
              boxShadow: 24,
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <Typography variant='h6' component='h2'>
              Update Status
            </Typography>
            <TextField
              variant='outlined'
              value={"(STATUS)"}
              onChange={(e) => setNewRole(e.target.value)}
              sx={{ mt: 2, width: "100%" }}
            />
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}
            >
              <Button variant='contained' onClick={handleSaveChanges}>
                Save
              </Button>
              <Button variant='outlined' onClick={handleCloseModal}>
                Cancel
              </Button>
            </Box>
          </Box>
        </Modal>
      </Box>
      <Footer />
    </>
  );
};

export default ResearchTracking;
