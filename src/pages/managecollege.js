import React, { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import {
  Box,
  Button,
  InputAdornment,
  Modal,
  TextField,
  Typography,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Search } from "@mui/icons-material";
import CircleIcon from "@mui/icons-material/Circle";
import { Virtuoso } from "react-virtuoso";
import axios from "axios";
import HeaderWithBackButton from "../components/Header";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { toast } from "react-hot-toast";

const ManageCollege = () => {
  const [colleges, setColleges] = useState([]);
  const [filteredCollege, setFilteredCollege] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [addModal, setAddModal] = useState(false);

  const [collegeAbbrv, setCollegeAbbrv] = useState("");
  const [collegeName, setCollegeName] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isDuplicateDialogOpen, setIsDuplicateDialogOpen] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);

  // 20 Pre-defined hex colors, will be filtered based on college with existing color code
  const [colorCodes, setColorCodes] = useState([
    '#141cff',
    '#04a417',
    '#c2c2c2', 
    '#e9e107',
    '#bb0c0c',
    '#ff4d2e',
    '#3ca897',
    '#8b24d3',
    '#ff9800',
    '#2196f3',
    '#4caf50',
    '#e91e63',
    '#795548',
    '#607d8b',
    '#9c27b0',
    '#00bcd4',
    '#ffeb3b',
    '#673ab7',
    '#03a9f4',
    '#009688'
  ]);

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const response = await axios.get(`/deptprogs/college_depts`);
        const fetchColleges = response.data.colleges;
        setColleges(fetchColleges);
        setFilteredCollege(fetchColleges);

        console.log(colleges);
      } catch (error) {
        console.error("Error fetching colleges:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchColleges();
  }, []);

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredCollege(
      colleges.filter(
        (college) =>
          college.college_name.toLowerCase().includes(query) ||
          college.college_id.toLowerCase().includes(query)
      )
    );
  };

  const handlePostModal = () => {
    setCollegeAbbrv("");
    setCollegeName("");
  };

  const handleOpenAddModal = () => {
    setAddModal(true);
  };
  
  const handleBack = () => {
    if (isSubmitting) {
        return;
    }
    let hasChanges = collegeAbbrv || collegeName;

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
      "College Name": collegeName,
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

  const assignColor = () => {
    const colorExist = colleges.map((college) => college.color_code);

    const updatedArray = colorCodes.filter(
      (color) => !colorExist.includes(color)
    );

    console.log("Existing Colors:", colorExist);
    console.log("Filtered Color Codes:", updatedArray);

    if (updatedArray.length > 0) {
      const randomIndex = Math.floor(Math.random() * updatedArray.length);
      return(updatedArray[randomIndex]); // Use updatedArray here
    }
  }

  const handleAddCollege = async () => {
    try {
      const missingFields = handleCheckFields();

      if (missingFields) {
        alert(
          `Please fill in all required fields: ${missingFields.join(", ")}`
        );
        return;
      }

      // Check for duplicates
      const duplicateId = colleges.find(
        (college) => college.college_id.toLowerCase() === collegeAbbrv.toLowerCase()
      );
      const duplicateName = colleges.find(
        (college) => college.college_name.toLowerCase() === collegeName.toLowerCase()
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
      formData.append("college_name", collegeName);
      formData.append("college_color", assignColor());

      // Send the conference data
      const response = await axios.post("/data/colleges", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setIsSuccessDialogOpen(true);
      
      } catch (error) {
          toast.error(error.response?.data?.error || "Error adding college");
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
            title="Manage Colleges"
            onBack={() => navigate(-1)}
          />

          {/*Main Content */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {/* Search Bar */}
            <Box
              sx={{
                width: "80%", // Center search bar and button
                display: "flex",
                paddingTop: 3,
                paddingBottom: 2,
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <TextField
                variant='outlined'
                placeholder='Search College...'
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
                + Add New College
              </Button>
            </Box>

            {/* Virtuoso Table */}
            <Box
              sx={{
                lex: 1,
                backgroundColor: "#F7F9FC",
                borderRadius: 1,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                width: "80%",
              }}
            >
              {loading ? (
                <Typography>Loading users...</Typography>
              ) : (
                <Box sx={{ flex: 1, overflow: "hidden" }}>
                  <Virtuoso
                    style={{ height: "400px" }}
                    totalCount={filteredCollege.length}
                    components={{
                      Header: () => (
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            backgroundColor: "#0A438F",
                            fontSize: {
                              xs: "0.5rem",
                              md: "0.75rem",
                              lg: "0.9rem",
                            },
                            color: "#FFF",
                            padding: "10px",
                            fontWeight: 700,
                            position: "sticky",
                            top: 0,
                            zIndex: 1000,
                          }}
                        >
                          <Box sx={{ flex: 1 }}>College ID</Box>
                          <Box sx={{ flex: 3 }}>Name</Box>
                          <Box sx={{ flex: 2 }}>Color Code</Box>
                        </Box>
                      ),
                    }}
                    itemContent={(index) => {
                      const college = filteredCollege[index];
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
                          <Box sx={{ flex: 1 }}>{college.college_id}</Box>
                          <Box sx={{ flex: 3 }}>{college.college_name}</Box>
                          <Box sx={{ flex: 2, ml: "3rem" }}>
                            <CircleIcon style={{ color: college.color_code }} />
                          </Box>
                        </Box>
                      );
                    }}
                  />
                </Box>
              )}
            </Box>

            {/* Add College Modal */}
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
                  Add College
                </Typography>
                <TextField
                  label='Abbreviation'
                  value={collegeAbbrv}
                  fullWidth
                  onChange={(e) => setCollegeAbbrv(e.target.value)}
                  margin='normal'
                  sx={createTextFieldStyles()}
                  InputLabelProps={createInputLabelProps()}
                />
                <TextField
                  label='Name'
                  value={collegeName}
                  fullWidth
                  onChange={(e) => setCollegeName(e.target.value)}
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
                    onClick={handleAddCollege}
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
                        Adding College...
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
                    <Typography sx={{ mt: 2, fontSize: "1.25rem" }}>Adding College...</Typography>
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
                            backgroundColor: "#072d61",
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
                            backgroundColor: "#A30417",
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
                          color: "#08397C",
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
                          College has been added successfully.
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
                        ID or name associated to this college already exist.
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

export default ManageCollege;
