import React, { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
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
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
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
  }, [selectedCollege, searchQuery, programs]);

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
    setDeleteModal(false);
    setSelectedProgram(null);

    const missingFields = handleCheckFields();
    if (missingFields.length === 3) {
      setAddModal(false);
    } else {
      const userConfirmed = window.confirm(
        "You have unsaved changes. Save Changes?"
      );
  
      if (userConfirmed) {
        handleAddProgram();
        return;
      }
      setAddModal(false);
    }

    handlePostModal();
  };

  const handleCheckFields = () => {
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

    return missingFields;
  }

  const handleCheckChanges = () => {
    const hasChanges = newName !== initialData?.program_name;

    if (!hasChanges) {
      setOpenModal(false);
    } else {
      const userConfirmed = window.confirm(
        "Save Changes?"
      );
  
      if (userConfirmed) {
        updateProgram();
        return;
      }
      setOpenModal(false);
    }
    handlePostModal();
  }

  const handleOpenAddModal = () => {
    setAddModal(true);
  };

  const handleAddProgram = async () => {
    try {
      const missingFields = handleCheckFields();

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
    setSelectedProgram(program);
    // Set the initial data
    setInitialData({
      program_name: program.program_name,
    });
    setNewName(program.program_name);

    setOpenModal(true);
  };

  const handleUpdateProgram = () => {
    const hasChanges = newName !== initialData?.program_name;

    if (!hasChanges) {
      alert("No changes were made to save.");
      handleCloseModal();
    } else {
      updateProgram();
    }
  };

  const updateProgram = async () => {
    try {
      // Send the program data
      const response = await axios.put(
        `/data/programs/${selectedProgram.program_id}`,
        { program_name: newName },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

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
  };

  const handleDeleteCollege = (program) => {
    setSelectedProgram(program);

    setDeleteModal(true);
  };

  const deleteCollege = async () => {
    try {
      // Send the college data
      const response = await axios.delete(
        `/data/programs/${selectedProgram.program_id}`,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Response:", response.data);
      alert("Program deleted successfully!");

      handleCloseModal();
      window.location.reload();
    } catch (error) {
      console.error("Error deleting college:", error);
      if (error.response) {
        console.error("Error response:", error.response.data);
        alert(
          `Failed to delete college: ${"This program is currently used by the institution."}`
        );
      } else {
        alert("Failed to delete college. Please try again.");
      }
    }
  };

  // Utility function to create responsive TextField styles
  const createTextFieldStyles = (customFlex = 2) => ({
    flex: customFlex,
    "& .MuiInputBase-input": {
      fontSize: {
        xs: "0.6em", // Mobile
        sm: "0.7rem", // Small devices
        md: "0.8rem", // Medium devices
        lg: "0.8rem", // Large devices
      },
    },
  });

  // Utility function to create responsive label styles
  const createInputLabelProps = () => ({
    sx: {
      fontSize: {
        xs: "0.45rem", // Mobile
        sm: "0.55rem", // Small devices
        md: "0.65rem", // Medium devices
        lg: "0.75rem", // Large devices
      },
    },
  });

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
                lg: "clamp(4rem, 20vh, 5rem)",
              },
              backgroundColor: "#0A438F",
              backgroundSize: "cover",
              backgroundPosition: "center",
              display: "flex",
              alignItems: "center",
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
                  transform: {
                    xs: "scale(0.8)",
                    sm: "scale(1)",
                    md: "scale(1.2)",
                  },
                }}
              >
                <ArrowBackIosIcon />
              </IconButton>
              <Typography
                variant='h3'
                sx={{
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
                  zIndex: 2,
                }}
              >
                Manage Programs
              </Typography>
            </Box>
          </Box>

          {/* Main content area */}
          <Box
            ml={5}
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
              sx={{
                height: "100%",
                flexWrap: "nowrap",
              }}
            >
              {/* Filters Section */}
              <Grid2 size={3}>
                <Box
                  sx={{
                    border: "1px solid #0A438F",
                    height: "auto",
                    borderRadius: 3,
                    padding: 3,
                    overflowY: "hidden",
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
                  <Typography
                    variant='body1'
                    sx={{
                      color: "#08397C",
                      fontSize: { xs: "0.5rem", md: "0.5rem", lg: "0.9rem" },
                    }}
                  >
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
                            checked={selectedCollege.includes(
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
                              lg: "0.75rem",
                            },
                          },
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              </Grid2>
              <Grid2 size={9}>
                {/* Search Bar */}
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
                        mb: 2,
                      }}
                    >
                      <TextField
                        variant='outlined'
                        placeholder='Search program...'
                        value={searchQuery}
                        onChange={handleSearchChange}
                        sx={createTextFieldStyles()}
                        InputLabelProps={createInputLabelProps()}
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
                      <Button
                        variant='contained'
                        color='primary'
                        sx={{
                          backgroundColor: "#CA031B",
                          color: "#FFF",
                          fontFamily: "Montserrat, sans-serif",
                          fontWeight: 600,
                          textTransform: "none",
                          fontSize: { xs: "0.875rem", md: "1rem" },
                          padding: { xs: "0.5rem 1rem", md: "1.25rem" },
                          marginLeft: "2rem",
                          borderRadius: "100px",
                          maxHeight: "3rem",
                          "&:hover": {
                            backgroundColor: "#A30417",
                            color: "#FFF",
                          },
                        }}
                        onClick={handleOpenAddModal}
                      >
                        + Add New Program
                      </Button>
                    </Box>

                    {/* Virtuoso Table */}
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
                        <Typography>Loading users...</Typography>
                      ) : (
                        <Box sx={{ flex: 1, overflow: "hidden" }}>
                          <Virtuoso
                            style={{ height: "400px" }}
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
                                    fontSize: {
                                      xs: "0.5rem",
                                      md: "0.75rem",
                                      lg: "0.9rem",
                                    },
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
                                    padding: "0.5rem",
                                    borderBottom: "1px solid #ccc",
                                    fontSize: {
                                      xs: "0.5rem",
                                      md: "0.65rem",
                                      lg: "0.9rem",
                                    },
                                  }}
                                >
                                  <Box sx={{ flex: 1 }}>
                                    {program.college_id}
                                  </Box>
                                  <Box sx={{ flex: 1 }}>
                                    {program.program_id}
                                  </Box>
                                  <Box sx={{ flex: 4 }}>
                                    {program.program_name}
                                  </Box>
                                  <Box sx={{ flex: 1 }}>
                                    <Button
                                      onClick={() => handleOpenModal(program)}
                                    >
                                      <EditIcon color='primary' />
                                    </Button>
                                  </Box>
                                  <Box sx={{ flex: 1 }}>
                                    <Button
                                      onClick={() =>
                                        handleDeleteCollege(program)
                                      }
                                    >
                                      <DeleteIcon color='primary' />
                                    </Button>
                                  </Box>
                                </Box>
                              );
                            }}
                          />
                        </Box>
                      )}
                    </Box>
                  </Box>
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
                    fontSize: {
                      xs: "clamp(1rem, 2vw, 1rem)",
                      sm: "clamp(1.5rem, 3.5vw, 1.5rem)",
                      md: "clamp(2rem, 4vw, 2.25rem)",
                    },
                  }}
                >
                  Add Program
                </Typography>
                <FormControl fullWidth variant='outlined'>
                  <InputLabel sx={{
                    fontSize: {
                      xs: "0.75rem",
                      md: "0.75rem",
                      lg: "0.8rem",
                    },
                  }}>College</InputLabel>
                  <Select
                    value={collegeAbbrv}
                    onChange={(e) => setCollegeAbbrv(e.target.value)}
                    label='College'
                    sx={createTextFieldStyles()}
                  >
                    {colleges.map((college) => (
                      <MenuItem
                        key={college.college_id}
                        value={college.college_id}
                        sx={{
                          fontSize: {
                            xs: "0.75rem",
                            md: "0.75rem",
                            lg: "0.8rem",
                          },
                        }}
                      >
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
                  sx={createTextFieldStyles()}
                  InputLabelProps={createInputLabelProps()}
                />
                <TextField
                  label='Name'
                  value={programName}
                  fullWidth
                  onChange={(e) => setProgramName(e.target.value)}
                  margin='normal'
                  sx={createTextFieldStyles()}
                  InputLabelProps={createInputLabelProps()}
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
                      fontSize: { xs: "0.875rem", md: "1rem" },
                      padding: { xs: "0.5rem 1rem", md: "1.25rem" },
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
                      fontSize: { xs: "0.875rem", md: "1rem" },
                      padding: { xs: "0.5rem 1rem", md: "1.25rem" },
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
                      fontSize: {
                        xs: "clamp(1rem, 2vw, 1rem)",
                        sm: "clamp(1.5rem, 3.5vw, 1.5rem)",
                        md: "clamp(2rem, 4vw, 2.25rem)",
                      },
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
                    sx={createTextFieldStyles()}
                    InputLabelProps={createInputLabelProps()}
                  />
                  <TextField
                    label='Program ID'
                    value={selectedProgram.program_id}
                    fullWidth
                    disabled
                    margin='normal'
                    sx={createTextFieldStyles()}
                    InputLabelProps={createInputLabelProps()}
                  />
                  <TextField
                    label='Name'
                    value={newName}
                    fullWidth
                    onChange={(e) => setNewName(e.target.value)}
                    margin='normal'
                    sx={createTextFieldStyles()}
                    InputLabelProps={createInputLabelProps()}
                  />
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mt: 5,
                    }}
                  >
                    <Button
                      onClick={handleCheckChanges}
                      sx={{
                        backgroundColor: "#08397C",
                        color: "#FFF",
                        fontFamily: "Montserrat, sans-serif",
                        fontWeight: 600,
                        fontSize: { xs: "0.875rem", md: "1rem" },
                        padding: { xs: "0.5rem 1rem", md: "1.25rem" },
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
                        fontSize: { xs: "0.875rem", md: "1rem" },
                        padding: { xs: "0.5rem 1rem", md: "1.25rem" },
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
                      fontSize: {
                        xs: "clamp(1rem, 2vw, 1rem)",
                        sm: "clamp(1.5rem, 3.5vw, 1.5rem)",
                        md: "clamp(2rem, 4vw, 2.25rem)",
                      },
                    }}
                  >
                    Delete Program
                  </Typography>
                  <Box display='flex' flexDirection='column'>
                    <Typography variant='h7' sx={{ mb: "1rem" }}>
                      <strong>College ID:</strong>{" "}
                      {selectedProgram.college_id || "None"}
                    </Typography>
                    <Typography variant='h7' sx={{ mb: "1rem" }}>
                      <strong>Program ID:</strong>{" "}
                      {selectedProgram.program_id || "None"}
                    </Typography>
                    <Typography variant='h7' sx={{ mb: "1rem" }}>
                      <strong>Program Name:</strong>{" "}
                      {selectedProgram.program_name || "None"}
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
                        fontSize: { xs: "0.875rem", md: "1rem" },
                        padding: { xs: "0.5rem 1rem", md: "1.25rem" },
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
                        fontSize: { xs: "0.875rem", md: "1rem" },
                        padding: { xs: "0.5rem 1rem", md: "1.25rem" },
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
