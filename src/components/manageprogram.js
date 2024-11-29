import React, { useEffect, useState } from "react";
import Navbar from "./navbar";
import Footer from "./footer";
import {
  Box,
  Button,
  IconButton,
  FormControlLabel,
  InputAdornment,
  Modal,
  TextField,
  Typography,
  Grid2,
  Checkbox, 
  FormControl,
  InputLabel,
  Select,
  MenuItem,

} from "@mui/material";
import { useNavigate } from "react-router-dom";
import homeBg from "../assets/home_bg.png";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Search } from "@mui/icons-material";
import { Virtuoso } from "react-virtuoso";
import axios from "axios";

const ManageProgram = () => {
  const [colleges, setColleges] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [filteredCollege, setFilteredCollege] = useState([]);
  const [filteredProgram, setFilteredProgram] = useState([]);
  const [department, setDepartment] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [openModal, setOpenModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const [selectedCollege, setSelectedCollege] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState(null);

  const [collegeAbbrv, setCollegeAbbrv] = useState("");
  const [programAbbrv, setProgramAbbrv] = useState("");
  const [programName, setProgramName] = useState("");

  const [initialData, setInitialData] = useState(null);
  const [newName, setNewName] = useState("");

  const fetchColleges = async () => {
    try {
    const response = await axios.get(`/deptprogs/college_depts`);
    const fetchColleges = response.data.colleges;
    setColleges(fetchColleges);
    setFilteredCollege(fetchColleges);
    } catch (error) {
    console.error("Error fetching colleges:", error); 
    } finally {
        setLoading(false);
    }
    };

  const fetchAllPrograms = async () => {
    try {
        const response = await axios.get(`/deptprogs/fetch_programs`);
        const fetchedProgram = response.data.programs;
        setPrograms(fetchedProgram);
        setFilteredProgram(fetchedProgram);
    } catch (error) {
        console.error("Error fetching programs:", error);
    } finally {
        setLoading(false);
    }
    };

  useEffect(() => {
    fetchColleges();
    fetchAllPrograms();
    }, []);
  
  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    };

  useEffect(() => {
    let filtered = programs;

    // Filter by College
    if (selectedCollege.length > 0) {
      filtered = filtered.filter((item) =>
          selectedCollege.includes(String(item.college_id))
      );
    }

    // Filter by Search Query
    if (searchQuery) {
      filtered = filtered.filter((program) =>
          program.program_name.toLowerCase().includes(searchQuery)
      );
    }
    setFilteredProgram(filtered);
  }, [
    selectedCollege,
    searchQuery,
    programs,
  ]);

  // Modify the handleCollegeChange function to handle initial selection
  const handleCollegeChange = (event) => {
    const { value, checked } = event.target;
    setSelectedCollege((prev) => {
        // Ensure prev is an array
        const prevSelected = prev || [];
        
        return checked 
            ? [...prevSelected, value] 
            : prevSelected.filter((item) => item !== value);
    });
  };

  const handlePostModal = () => {
    setCollegeAbbrv("");
    setProgramAbbrv("");
    setProgramName("");

    setNewName("");
  };

  const handleCloseModal = () => {
    setAddModal(false)
    setOpenModal(false);
    setDeleteModal(false);
    setSelectedProgram(null);

    handlePostModal();
  };
  
  const handleOpenAddModal = () => {
    setAddModal(true);
  };

  const handleAddProgram = async () => {
    try {
      // Validate required fields
      const requiredFields = {
        "College ID": collegeAbbrv,
        "Program Abbrv": programAbbrv,
        "Program Name": programName,
      };

      const missingFields = Object.entries(requiredFields)
        .filter(([_, value]) => {
          if (Array.isArray(value)) {
            return value.length === 0;
          }
          return !value;
        })
        .map(([key]) => key);

      if (missingFields.length > 0) {
        alert(
          `Please fill in all required fields: ${missingFields.join(", ")}`
        );
        return;
      }

      const formData = new FormData();

      // Get user_id from localStorage
      const userId = localStorage.getItem("user_id");
      formData.append("user_id", userId);

      // Add all required fields to formData
      formData.append("college_id", collegeAbbrv);
      formData.append("program_id", programAbbrv);
      formData.append("program_name", programName);
      
      // Send the conference data
      const response = await axios.post("/data/programs", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Response:", response.data);

      alert("Program added successfully!");

      handleCloseModal();
      window.location.reload();
      
    } catch (error) {
      console.error("Error adding college:", error);
      if (error.response) {
        console.error("Error response:", error.response.data);
        alert(
          `Failed to add program: ${
            error.response.data.error || "Please try again."
          }`
        );
      } else {
        alert("Failed to add program. Please try again.");
      }
    }
  };

  const handleOpenModal = (program) => {
    setSelectedProgram(program)
    // Set the initial data
    setInitialData({
      program_name: program.program_name,
    })
    setNewName(program.program_name);

    setOpenModal(true);
  };

  const handleUpdateProgram = () => {
    const hasChanges =
      newName !== initialData?.program_name

    if (!hasChanges) {
      alert(
        "No changes detected. Please modify user's details before saving."
      );
    } else {
      updateProgram();
    }
  };

  const updateProgram = async () => {
    try {
      // Send the program data
      const response = await axios.put(`/data/programs/${selectedProgram.program_id}`, 
        {program_name: newName}, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Response:", response.data);
      alert("Program updated successfully!");

      // Update users state to reflect changes without re-fetching
      const updatedProgram = programs.map((program) =>
        program.program_id === selectedProgram.program_id
          ? { ...program, program_name: newName }
          : program
      );
  
      // Update the state to trigger a re-render
      setPrograms(updatedProgram);
      setFilteredProgram(updatedProgram);

      handleCloseModal();
  
    } catch (error) {
      console.error("Error updating program:", error);
      if (error.response) {
        console.error("Error response:", error.response.data);
        alert(
          `Failed to update program: ${
            error.response.data.error || "Please try again."
          }`
        );
      } else {
        alert("Failed to update program. Please try again.");
      }
    }
  }

  const handleDeleteCollege = (program) => {
    setSelectedProgram(program)

    setDeleteModal(true);
  };

  const deleteCollege = async () => {
    try {
      // Send the college data
      const response = await axios.delete(`/data/programs/${selectedProgram.program_id}`, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Response:", response.data);
      alert("Program deleted successfully!");
  
      handleCloseModal();
      window.location.reload();
      
    } catch (error) {
      console.error("Error deleting college:", error);
      if (error.response) {
        console.error("Error response:", error.response.data);
        alert(
          `Failed to delete college: ${
            error.response.data.error || "Please try again."
          }`
        );
      } else {
        alert("Failed to delete college. Please try again.");
      }
    }
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
        <Box
          sx={{
            height: { xs: "100%", md: "calc(100vh - 9rem)" },
            marginTop: { xs: "3.5rem", sm: "4rem", md: "6rem" },
          }}
        >
          <Box
            sx={{
              position: "relative",
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
                <ArrowBackIosIcon></ArrowBackIosIcon>
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
                Manage Program
              </Typography>
            </Box>
          </Box>

          {/* Main content area */}
          <Box
            ml={10}
             sx={{
              flex: 1,
              padding: 4,
              overflow: "hidden",
              height: "calc(100% - 48px)",
            }}
          >
            <Grid2
              container
              spacing={6}
              sx={{
                height: "auto",
                flexWrap: "nowrap",
              }}
            >
              {/* Filters Section */}
              <Grid2 size={3}>
                <Box
                  sx={{
                    border: "2px solid #0A438F",
                    height: "auto",
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
                    Filter
                  </Typography>
                  <Typography variant='body1' sx={{ mb: 1, color: "#08397C" }}>
                    College:
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      height: "25%",
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
                            checked={selectedCollege.includes(college.college_id)}
                            onChange={handleCollegeChange}
                            value={college.college_id}
                          />
                        }
                        label={college.college_name}
                      />
                    ))}
                  </Box>
                </Box>
              </Grid2>
              <Grid2 size={9}>
                {/* Search Bar */}
                <Box
                  sx={{
                    width: "90%", // Center search bar and button
                    display: "flex",
                    paddingBottom: 3,
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <TextField
                    variant='outlined'
                    placeholder='Search Program...'
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
                    backgroundColor: "#F40824",
                    color: "#FFF",
                    fontFamily: "Montserrat, sans-serif",
                    fontWeight: 600,
                    textTransform: "none",
                    fontSize: { xs: "0.875rem", md: "1.375rem" },
                    padding: { xs: "0.5rem 1rem", md: "1.5rem" },
                    borderRadius: "100px",
                    maxHeight: "3rem"        
                    }}    
                    onClick={handleOpenAddModal}
                  >
                    Add New Program
                  </Button>
                </Box>

                {/* Virtuoso Table */}
                <Box sx={{ width: "90%" }}>
                  {loading ? (
                    <Typography>Loading users...</Typography>
                  ) : (
                    <Virtuoso
                    style={{ height: "30rem" }}
                    totalCount={filteredProgram.length}
                    components={{
                      Header: () => (
                      <Box
                          sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          backgroundColor: "#0A438F",
                          color: "#FFF",
                          padding: "10px",
                          fontWeight: 700,
                          position: "sticky",
                          top: 0,
                          zIndex: 1000,
                          }}
                      >
                          <Box sx={{ flex: 1 }}>College ID</Box>
                          <Box sx={{ flex: 1 }}>Program ID</Box>
                          <Box sx={{ flex: 4 }}>Name</Box>
                          <Box sx={{ flex: 1 }}>Modify</Box>
                          <Box sx={{ flex: 1 }}>Delete</Box>
                      </Box>
                      ),
                    }}
                    itemContent={(index) => {
                      const program = filteredProgram[index];
                      return (
                        <Box
                          sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          padding: "10px",
                          borderBottom: "1px solid #ccc",
                          }}
                        >
                          <Box sx={{ flex: 1 }}>{program.college_id}</Box>
                          <Box sx={{ flex: 1 }}>{program.program_id}</Box>
                          <Box sx={{ flex: 4 }}>{program.program_name}</Box>
                          <Box sx={{ flex: 1 }}>
                            <Button
                                onClick={() => handleOpenModal(program)}
                            >
                                <EditIcon color='primary'/>
                            </Button>
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <Button
                                onClick={() => handleDeleteCollege(program)}
                            >
                                <DeleteIcon color='primary'/>
                            </Button>
                          </Box>
                        </Box>
                      );
                    }}
                    />
                  )}
                </Box>
              </Grid2>
            </Grid2>
      
            {/* Add Program Modal */}
            <Modal open={addModal} onClose={handleCloseModal}>
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "40rem",
                  bgcolor: "background.paper",
                  boxShadow: 24,
                  p: 5,
                  borderRadius: "8px",
                }}
              >
                <Typography
                  variant='h3'
                  color='#08397C'
                  fontWeight='1000'
                  mb={4}
                  sx={{
                    textAlign: { xs: "left", md: "bottom" },
                  }}
                >
                  Add Program
                </Typography>
                <FormControl fullWidth variant='outlined'>
                  <InputLabel>College</InputLabel>
                  <Select
                    value={collegeAbbrv}
                    onChange={(e) => setCollegeAbbrv(e.target.value)}
                    label='College'
                  >
                    {colleges.map((college) => (
                      <MenuItem key={college.college_id} value={college.college_id}>
                        {college.college_id} - {college.college_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  label='Program Abbreviation'
                  value={programAbbrv}
                  fullWidth
                  onChange={(e) => setProgramAbbrv(e.target.value)}
                  margin='normal'
                />
                <TextField
                  label='Name'
                  value={programName}
                  fullWidth
                  onChange={(e) => setProgramName(e.target.value)}
                  margin='normal'
                />    
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 5,
                  }}
                >
                  <Button
                    onClick={handleCloseModal}
                    sx={{
                      backgroundColor: "#08397C",
                      color: "#FFF",
                      fontFamily: "Montserrat, sans-serif",
                      fontWeight: 600,
                      fontSize: { xs: "0.875rem", md: "1.275rem" },
                      padding: { xs: "0.5rem", md: "1.5rem" },
                      borderRadius: "100px",
                      maxHeight: "3rem",
                      textTransform: "none",
                      "&:hover": {
                        backgroundColor: "#072d61",
                      },
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant='contained'
                    color='primary'
                    onClick={handleAddProgram}
                    sx={{
                      backgroundColor: "#CA031B",
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
                        backgroundColor: "#A30417",
                        color: "#FFF",
                      },
                    }}
                  >
                    Add
                  </Button>
                </Box>
              </Box>
            </Modal>

            {/* Update College Modal */}
            {selectedProgram && (
            <Modal open={openModal} onClose={handleCloseModal}>
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "40rem",
                  bgcolor: "background.paper",
                  boxShadow: 24,
                  p: 5,
                  borderRadius: "8px",
                }}
              >
                <Typography
                  variant='h3'
                  color='#08397C'
                  fontWeight='1000'
                  mb={4}
                  sx={{
                    textAlign: { xs: "left", md: "bottom" },
                  }}
                >
                  Edit Program
                </Typography>
                <TextField
                  label='College ID'
                  value={selectedProgram.college_id}
                  fullWidth
                  disabled
                  margin='normal'
                />
                <TextField
                  label='Program ID'
                  value={selectedProgram.program_id}
                  fullWidth
                  disabled
                  margin='normal'
                />
                <TextField
                  label='Name'
                  value={newName}
                  fullWidth
                  onChange={(e) => setNewName(e.target.value)}
                  margin='normal'
                />  
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 5,
                  }}
                >
                  <Button
                    onClick={handleCloseModal}
                    sx={{
                      backgroundColor: "#08397C",
                      color: "#FFF",
                      fontFamily: "Montserrat, sans-serif",
                      fontWeight: 600,
                      fontSize: { xs: "0.875rem", md: "1.275rem" },
                      padding: { xs: "0.5rem", md: "1.5rem" },
                      borderRadius: "100px",
                      maxHeight: "3rem",
                      textTransform: "none",
                      "&:hover": {
                        backgroundColor: "#072d61",
                      },
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant='contained'
                    color='primary'
                    onClick={handleUpdateProgram}
                    sx={{
                      backgroundColor: "#CA031B",
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
                        backgroundColor: "#A30417",
                        color: "#FFF",
                      },
                    }}
                  >
                    Update
                  </Button>
                </Box>
              </Box>
            </Modal>       
            )}

            {/* Delete Program Modal */}
            {selectedProgram && (
              <Modal open={deleteModal} onClose={handleCloseModal}>
                <Box
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "40rem",
                    bgcolor: "background.paper",
                    boxShadow: 24,
                    p: 5,
                    borderRadius: "8px",
                  }}
                >
                  <Typography
                    variant='h3'
                    color='#08397C'
                    fontWeight='1000'
                    mb={4}
                    sx={{
                      textAlign: { xs: "left", md: "bottom" },
                    }}
                  >
                    Delete Program
                  </Typography>
                  <Box display="flex" flexDirection="column">
                    <Typography variant="h7" sx={{ mb: '1rem' }}>
                      <strong>College ID:</strong> {selectedProgram.college_id || 'None'}
                    </Typography>
                    <Typography variant="h7" sx={{ mb: '1rem' }}>
                      <strong>Program ID:</strong> {selectedProgram.program_id || 'None'}
                    </Typography>
                    <Typography variant="h7" sx={{ mb: '1rem' }}>
                      <strong>Program Name:</strong> {selectedProgram.program_name || 'None'}
                    </Typography>
                  </Box>    
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mt: 5,
                    }}
                  >
                    <Button
                      onClick={handleCloseModal}
                      sx={{
                        backgroundColor: "#08397C",
                        color: "#FFF",
                        fontFamily: "Montserrat, sans-serif",
                        fontWeight: 600,
                        fontSize: { xs: "0.875rem", md: "1.275rem" },
                        padding: { xs: "0.5rem", md: "1.5rem" },
                        borderRadius: "100px",
                        maxHeight: "3rem",
                        textTransform: "none",
                        "&:hover": {
                          backgroundColor: "#072d61",
                        },
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant='contained'
                      color='primary'
                      onClick={deleteCollege}
                      sx={{
                        backgroundColor: "#CA031B",
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
                          backgroundColor: "#A30417",
                          color: "#FFF",
                        },
                      }}
                    >
                      Delete
                    </Button>
                  </Box>
                </Box>
              </Modal>       
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default ManageProgram;
