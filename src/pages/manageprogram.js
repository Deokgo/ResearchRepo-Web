import React, { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import {
  Box,
  Button,
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
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Add, Search } from "@mui/icons-material";
import { Virtuoso } from "react-virtuoso";
import axios from "axios";
import HeaderWithBackButton from "../components/Header";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AddIcon from '@mui/icons-material/Add';
import ErrorIcon from '@mui/icons-material/Error';
import { toast } from "react-hot-toast";

const ManageProgram = () => {
  const [colleges, setColleges] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [filteredCollege, setFilteredCollege] = useState([]);
  const [filteredProgram, setFilteredProgram] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [addModal, setAddModal] = useState(false);

  const [selectedCollege, setSelectedCollege] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState(null);

  const [collegeAbbrv, setCollegeAbbrv] = useState("");
  const [programAbbrv, setProgramAbbrv] = useState("");
  const [programName, setProgramName] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isDuplicateDialogOpen, setIsDuplicateDialogOpen] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);


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
  };

  const handleOpenAddModal = () => {
    setAddModal(true);
  };

  const handleBack = () => {
    if (isSubmitting) {
        return;
    }
    let hasChanges = collegeAbbrv || programAbbrv || programName;

    if (hasChanges) {
      setIsConfirmDialogOpen(true);
    } else {
      handlePostModal();
      setAddModal(false);
    }
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

      if (missingFields.length > 0){
        return true;
      } 
    
    return false;
  }

  const handleAddProgram = async () => {
    try {
      const missingFields = handleCheckFields();

      if (missingFields) {
        alert(
          `Please fill in all required fields: ${missingFields.join(", ")}`
        );
        return;
      }

      // Check for duplicates
      const duplicateId = programs.find(
        (program) => program.program_id.toLowerCase() === programAbbrv.toLowerCase()
      );
      const duplicateName = programs.find(
        (program) => program.program_name.toLowerCase() === programName.toLowerCase()
      );

      if (duplicateId || duplicateName) {
        setIsDuplicateDialogOpen(true);
        return;
      }

      setIsSubmitting(true);

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

      setIsSuccessDialogOpen(true);
      
      } catch (error) {
          toast.error(error.response?.data?.error || "Error adding program");
          console.error("Error:", error);
        } finally {
          setIsSubmitting(false);
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
            height: {
              xs: "calc(100vh - 3.5rem)",
              sm: "calc(100vh - 4rem)",
              md: "calc(100vh - 6rem)",
            },
            overflow: "hidden",
          }}
        >
          <HeaderWithBackButton
            title="Manage Programs"
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
                    height: "90%",
                    borderRadius: 3,
                    padding: 3,
                    overflowY: "hidden",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Typography
                    variant='h6'
                    sx={{ mb: 2, fontWeight: "bold", color: "#F40824" }}
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
                      height: "75%",
                      overflowY: "auto",
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
                        <AddIcon></AddIcon>&nbsp;Add New Program
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
            <Modal open={addModal} onClose={isSubmitting ? undefined : handleBack}>
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
                    onClick={handleBack}
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
                    disabled={handleCheckFields() || isSubmitting}
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
                    {isSubmitting ? (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <CircularProgress size={20} color='#08397C' />
                        Adding Program...
                        </Box>
                    ) : (
                        "Add"
                    )}
                  </Button>
                </Box>
                {/* Add loading overlay */}
                {isSubmitting && (
                <Box
                    sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "rgba(255, 255, 255, 0.7)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 9999,
                    }}
                >
                    <Box sx={{ textAlign: "center" }}>
                    <CircularProgress />
                    <Typography sx={{ mt: 2, fontSize: "1.25rem" }}>Adding Program...</Typography>
                    </Box>
                </Box>
                )}

                {/* Save Progress */}
                <Dialog
                    open={isConfirmDialogOpen}
                    onClose={() => setIsConfirmDialogOpen(false)}
                    PaperProps={{
                        sx: {
                        borderRadius: "15px",
                        padding: "1rem",
                        },
                    }}
                    >
                    <DialogTitle
                        sx={{
                        fontFamily: "Montserrat, sans-serif",
                        fontWeight: 600,
                        color: "#08397C",
                        }}
                    >
                        Unsaved Progress
                    </DialogTitle>
                    <DialogContent>
                        <Typography
                        sx={{
                            fontFamily: "Montserrat, sans-serif",
                            color: "#666",
                        }}
                        >
                        You have unsaved progress. Do you want to save your progress?
                        </Typography>
                    </DialogContent>
                    <DialogActions sx={{ padding: "1rem" }}>
                        <Button
                        onClick={() => {
                            setIsConfirmDialogOpen(false);
                            handlePostModal(); // Set flag to clear fields
                            setAddModal(false);
                        }}
                        sx={{
                            backgroundColor: "#CA031B",
                            color: "#FFF",
                            fontFamily: "Montserrat, sans-serif",
                            fontWeight: 600,
                            textTransform: "none",
                            borderRadius: "100px",
                            padding: "0.75rem",
                            "&:hover": {
                            backgroundColor: "#A30417",
                            },
                        }}
                        >
                        Discard
                        </Button>
                        <Button
                        onClick={() => {
                            setIsConfirmDialogOpen(false);
                            setAddModal(false);
                        }}
                        sx={{
                            backgroundColor: "#08397C",
                            color: "#FFF",
                            fontFamily: "Montserrat, sans-serif",
                            fontWeight: 600,
                            textTransform: "none",
                            borderRadius: "100px",
                            padding: "0.75rem",
                            "&:hover": {
                            backgroundColor: "#072d61",
                            },
                        }}
                        >
                        Save Progress
                        </Button>
                    </DialogActions>
                    </Dialog>

                    {/* Add Success Dialog */}
                    <Dialog
                      open={isSuccessDialogOpen}
                      onClose={() => {
                          setIsSuccessDialogOpen(false);
                          handlePostModal();}}
                      PaperProps={{
                          sx: {
                          borderRadius: "15px",
                          padding: "1rem",
                          },
                      }}
                      >
                      <DialogTitle
                          sx={{
                          fontFamily: "Montserrat, sans-serif",
                          fontWeight: 600,
                          color: "#008000",
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          }}
                      >
                        <Box
                          component='span'
                          sx={{
                              backgroundColor: "#E8F5E9",
                              borderRadius: "75%",
                              padding: "10px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                          }}
                          >
                          <CheckCircleIcon/>
                        </Box>
                          Success
                      </DialogTitle>
                      <DialogContent>
                          <Typography
                          sx={{
                              fontFamily: "Montserrat, sans-serif",
                              color: "#666",
                              mt: 1,
                          }}
                          >
                          Program has been added successfully.
                          </Typography>
                      </DialogContent>
                      <DialogActions sx={{ padding: "1rem" }}>
                        <Button
                          onClick={() => {
                              setIsSuccessDialogOpen(false);
                              handlePostModal();
                              window.location.reload(); }}
                          sx={{
                              backgroundColor: "#08397C",
                              color: "#FFF",
                              fontFamily: "Montserrat, sans-serif",
                              fontWeight: 600,
                              textTransform: "none",
                              borderRadius: "100px",
                              padding: "0.75rem",
                              "&:hover": {
                              backgroundColor: "#072d61",
                              },
                          }}
                          >
                          Close
                        </Button>
                      </DialogActions>
                  </Dialog>
                  {/* Add Duplicate Dialog */}
                  <Dialog
                    open={isDuplicateDialogOpen}
                    onClose={() => setIsDuplicateDialogOpen(false)}
                    PaperProps={{
                      sx: {
                        borderRadius: "15px",
                        padding: "1rem",
                      },
                    }}
                  >
                    <DialogTitle
                      sx={{
                        fontFamily: "Montserrat, sans-serif",
                        fontWeight: 600,
                        color: "#CA031B",
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <Box
                        component='span'
                        sx={{
                          backgroundColor: "#FFEAEA",
                          borderRadius: "50%",
                          padding: "8px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <ErrorIcon/>
                      </Box>
                      Duplicate Detected
                    </DialogTitle>
                    <DialogContent>
                      <Typography
                        sx={{
                          fontFamily: "Montserrat, sans-serif", 
                          color: "#666",
                          mt: 1,
                        }}
                      >
                        ID or name associated to this program already exist.
                      </Typography>
                    </DialogContent>
                    <DialogActions sx={{ padding: "1rem" }}>
                      <Button
                        onClick={() => setIsDuplicateDialogOpen(false)}
                        sx={{
                          backgroundColor: "#08397C",
                          color: "#FFF",
                          fontFamily: "Montserrat, sans-serif",
                          fontWeight: 600,
                          textTransform: "none",
                          borderRadius: "100px",
                          padding: "0.75rem",
                          "&:hover": {
                            backgroundColor: "#072d61",
                          },
                        }}
                      >
                        Close
                      </Button>
                    </DialogActions>
                  </Dialog>
              </Box>
            </Modal>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default ManageProgram;
