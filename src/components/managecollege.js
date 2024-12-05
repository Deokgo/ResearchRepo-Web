import React, { useEffect, useState } from "react";
import Navbar from "./navbar";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
  Grid2,
  InputProps
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import homeBg from "../assets/home_bg.png";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Circle, Search } from "@mui/icons-material";
import EditIcon from '@mui/icons-material/Edit';
import CircleIcon from '@mui/icons-material/Circle';
import DeleteIcon from '@mui/icons-material/Delete';
import { Virtuoso } from "react-virtuoso";
import axios from "axios";

const ManageCollege = () => {
  const [colleges, setColleges] = useState([]);
  const [filteredCollege, setFilteredCollege] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedCollege, setSelectedCollege] = useState(null);

  const [collegeAbbrv, setCollegeAbbrv] = useState("");
  const [collegeName, setCollegeName] = useState("");
  const [colorAttrb, setColorAttrb] = useState("#000000");

  const [initialData, setInitialData] = useState(null);
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState("");

  useEffect(() => {
    const fetchColleges = async () => {
        try {
        const response = await axios.get(`/deptprogs/college_depts`);
        const fetchColleges = response.data.colleges;
        setColleges(fetchColleges);
        setFilteredCollege(fetchColleges);

        console.log(colleges)
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
    setColorAttrb("#000000");
    setNewName("");
    setNewColor("");
  }

  const handleOpenAddModal = () => {
    setAddModal(true);
  }

  const handleCloseModal = () => {
    setAddModal(false)
    setOpenModal(false);
    setDeleteModal(false);
    setSelectedCollege(null);

    handlePostModal();
  };

  const handleAddCollege = async () => {
    try {
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
      formData.append("college_name", collegeName);

      if (colorAttrb !== '#000000'){
        formData.append("college_color", colorAttrb);
      }
      
      // Send the conference data
      const response = await axios.post("/data/colleges", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Response:", response.data);

      alert("College added successfully!");

      handleCloseModal();
      window.location.reload();
      
    } catch (error) {
      console.error("Error adding college:", error);
      if (error.response) {
        console.error("Error response:", error.response.data);
        alert(
          `Failed to add college: ${
            error.response.data.error || "Please try again."
          }`
        );
      } else {
        alert("Failed to add college. Please try again.");
      }
    }
  }

  const handleOpenModal = (college) => {
    setSelectedCollege(college)
    // Set the initial data
    setInitialData({
      college_name: college.college_name,
      color_code: college.color_code
    })
    setNewName(college.college_name);
    setNewColor(college.color_code);

    setOpenModal(true);
  };

  const handleUpdateCollege = () => {
    const hasChanges =
      newName !== initialData?.college_name ||
      newColor !== initialData?.color_code;

    if (!hasChanges) {
      alert(
        "No changes detected. Please modify user's details before saving."
      );
    } else {
      updateCollege();
    }
  };

  const updateCollege = async () => {
    try {
      // Send the college data
      const response = await axios.put(`/data/colleges/${selectedCollege.college_id}`, 
        {college_name: newName,
        color_code: newColor}, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Response:", response.data);
      alert("College updated successfully!");

      // Update users state to reflect changes without re-fetching
      const updatedCollege = colleges.map((college) =>
        college.college_id === selectedCollege.college_id
          ? { ...college, college_name: newName, color_code: newColor }
          : college
      );
  
      // Update the state to trigger a re-render
      setColleges(updatedCollege);
      setFilteredCollege(updatedCollege);

      handleCloseModal();
    
    } catch (error) {
      console.error("Error updating college:", error);
      if (error.response) {
        console.error("Error response:", error.response.data);
        alert(
          `Failed to update college: ${
            error.response.data.error || "Please try again."
          }`
        );
      } else {
        alert("Failed to update college. Please try again.");
      }
    }
  }

  const handleDeleteCollege = (college) => {
    setSelectedCollege(college)

    setDeleteModal(true);
  };

  const deleteCollege = async () => {
    try {
      // Send the college data
      const response = await axios.delete(`/data/colleges/${selectedCollege.college_id}`, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Response:", response.data);
      alert("College deleted successfully!");
  
      handleCloseModal();
      window.location.reload();
      
    } catch (error) {
      console.error("Error deleting college:", error);
      if (error.response) {
        console.error("Error response:", error.response.data);
        alert(
          `Failed to delete college: ${
            "This college department is currently used by the institution."
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
              width: "100%",
              height: {
                xs: "clamp(2rem, 3vh, 3rem)",
                sm: "clamp(3rem, 8vh, 4rem)",
                md: "clamp(3rem, 14vh, 4rem)",
                lg: "clamp(4rem, 20vh, 5rem)"
              },
              backgroundColor: "#0A438F",
              backgroundSize: "cover",
              backgroundPosition: "center",
              display: "flex",
              alignItems: "center",
              zIndex: 1
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
                    md: "scale(1.2)"
                  }
                }}
              >
                <ArrowBackIosIcon />
              </IconButton>
              <Typography
                variant='h3'
                sx={{
                  py: 5,
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
                  zIndex: 2
                }}
              >
                Manage Colleges
              </Typography>
            </Box>
          </Box>

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
                sx={{ 
                  flex: 2,
                  // Responsive font size
                  '& .MuiInputBase-input': {
                    fontSize: { 
                      xs: '0.75rem',   // Mobile
                      sm: '0.85rem',   // Small devices
                      md: '0.9rem',    // Medium devices
                      lg: '1rem'        // Large devices
                    },
                    // Adjust input height
                    padding: { 
                      xs: '8px 12px',   // Mobile
                      md: '12px 14px'   // Larger screens
                    },
                    // Optional: adjust overall height
                    height: { 
                      xs: '15px',   // Mobile
                      md: '25px'    // Larger screens
                    }
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <Search 
                        sx={{
                          fontSize: { 
                            xs: '1rem',   // Mobile
                            md: '1.25rem' // Larger screens
                          }
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
                backgroundColor: "#F40824",
                color: "#FFF",
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 600,
                textTransform: "none",
                fontSize: { xs: "0.875rem", md: "1rem" },
                padding: { xs: "0.5rem 1rem", md: "1.25rem" },
                marginLeft: "2rem",
                borderRadius: "100px",
                maxHeight: "3rem"        
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
                width: "80%" 
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
                          fontSize: { xs: "0.5rem", md: "0.75rem", lg: "0.9rem" },
                          color: "#FFF",
                          padding: "10px",
                          fontWeight: 700,
                          position: "sticky",
                          top: 0,
                          zIndex: 1000,
                        }}
                      >
                        <Box sx={{ flex: 1 }}>College ID</Box>
                        <Box sx={{ flex: 2 }}>Name</Box>
                        <Box sx={{ flex: 2 }}>Color Code</Box>
                        <Box sx={{ flex: 1 }}>Modify</Box>
                        <Box sx={{ flex: 1 }}>Delete</Box>
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
                          fontSize: { xs: "0.5rem", md: "0.65rem", lg: "0.9rem" },
                        }}
                      >
                        <Box sx={{ flex: 1 }}>{college.college_id}</Box>
                        <Box sx={{ flex: 2 }}>{college.college_name}</Box>
                        <Box sx={{ flex: 2, ml: "3rem" }}>
                            <CircleIcon style={{ color: college.color_code }}/>
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <IconButton
                            onClick={() => handleOpenModal(college)}
                          >
                            <EditIcon color='primary'/>
                          </IconButton>
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <IconButton
                            onClick={() => handleDeleteCollege(college)}
                          >
                            <DeleteIcon color='primary'/>
                          </IconButton>
                        </Box>
                      </Box>
                    );
                  }}
                />
                </Box>
              )}
            </Box>

            {/* Add College Modal */}
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
                  Add College
                </Typography>
                <TextField
                  label='Abbreviation'
                  value={collegeAbbrv}
                  fullWidth
                  onChange={(e) => setCollegeAbbrv(e.target.value)}
                  margin='normal'
                />
                <TextField
                  label='Name'
                  value={collegeName}
                  fullWidth
                  onChange={(e) => setCollegeName(e.target.value)}
                  margin='normal'
                />
                <Grid2 display='flex'>
                  <Grid2 width='50%' size={6}>
                    <TextField
                      type='color'
                      fullWidth
                      label='Color Attribute'
                      value={colorAttrb}
                      onChange={(e) => setColorAttrb(e.target.value)}
                      margin='normal'
                    />
                  </Grid2>
                  <Grid2 paddingTop='2rem' size={6}>
                    <Typography
                      variant='h6'
                      sx={{ display:'flex', width: '50%' }}
                      color='#08397C'
                      ml={4}
                    >
                      {colorAttrb}
                    </Typography>
                  </Grid2>
                </Grid2>      
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
                    onClick={handleAddCollege}
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
            {selectedCollege && (
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
                    Edit College
                  </Typography>
                  <TextField
                    label='Abbreviation'
                    value={selectedCollege.college_id}
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
                  <Grid2 display='flex'>
                    <Grid2 width='50%' size={6}>
                      <TextField
                        type='color'
                        fullWidth
                        label='Color Attribute'
                        value={newColor}
                        onChange={(e) => setNewColor(e.target.value)}
                        margin='normal'
                      />
                    </Grid2>
                    <Grid2 paddingTop='2rem' size={6}>
                      <Typography
                        variant='h6'
                        sx={{ display:'flex', width: '50%' }}
                        color='#08397C'
                        ml={4}
                      >
                        {newColor}
                      </Typography>
                    </Grid2>
                  </Grid2>      
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
                      onClick={handleUpdateCollege}
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

            {/* Delete College Modal */}
            {selectedCollege && (
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
                    Delete College
                  </Typography>
                  <Box display="flex" flexDirection="column">
                    <Typography variant="h7" sx={{ mb: '1rem' }}>
                      <strong>College ID:</strong> {selectedCollege.college_id || 'None'}
                    </Typography>
                    <Typography variant="h7" sx={{ mb: '1rem' }}>
                      <strong>College Name:</strong> {selectedCollege.college_name || 'None'}
                    </Typography>
                    <Typography variant="h7" sx={{ mb: '1rem' }}>
                      <strong>Color Code:</strong> 
                      <Grid2 display='flex' flexDirection='row' paddingTop='1rem'>
                        <Grid2 size={6}>
                          <CircleIcon style={{ color: selectedCollege.color_code, paddingTop: '0.35rem' }}/>
                        </Grid2>
                        <Grid2 size={6}>
                          <Typography
                            variant='h6'
                            sx={{ display:'flex', width: '50%' }}
                            color='#08397C'
                            ml={4}
                          >
                            {selectedCollege.color_code || '#000000'}
                          </Typography>
                        </Grid2>
                      </Grid2>
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

export default ManageCollege;
