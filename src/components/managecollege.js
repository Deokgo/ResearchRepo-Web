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
  Grid2
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import homeBg from "../assets/home_bg.png";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { MuiColorInput } from 'mui-color-input'
import { Search } from "@mui/icons-material";
import { Virtuoso } from "react-virtuoso";
import collegeAttributeData from '../data/colorAttribute.json'
import axios from "axios";

const ManageCollege = () => {
  const [colleges, setColleges] = useState([]);
  const [filteredCollege, setFilteredCollege] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [selectedCollege, setSelectedCollege] = useState(null);

  const [collegeAbbrv, setCollegeAbbrv] = useState("");
  const [collegeName, setCollegeName] = useState("");
  const [colorAttrb, setColorAttrb] = useState("#000000");

  // State to manage the college colors
  const [color, setColor] = useState(collegeAttributeData.colorAttribute);

  useEffect(() => {
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
    
    fetchColleges();
  }, []);

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredCollege(
      colleges.filter(
        (college) =>
          college.name.toLowerCase().includes(query) ||
          college.college_id.toLowerCase().includes(query)
      )
    );
  };

  const handleOpenModal = (college) => {
    setSelectedCollege(college);
    setOpenModal(true);
  };

  const handleOpenAddModal = () => {
    setAddModal(true);
  }

  const handleCloseModal = () => {
    setAddModal(false)
    setOpenModal(false);
    setSelectedCollege(null);
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
      //formData.append("college_color", colorAttrb);

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
  const handleSaveChanges = () => {
    console.log(
      "Saving changes for:",
      selectedCollege.college_id
    );
    setOpenModal(false);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <Navbar />
        <Box
          sx={{
            flexGrow: 1,
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
                Manage College
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
                paddingBottom: 5,
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <TextField
                variant='outlined'
                placeholder='Search College...'
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
                marginLeft: "2rem",
                borderRadius: "100px",
                maxHeight: "3rem"        
                }}    
                onClick={handleOpenAddModal}
              >
                Add New College
              </Button>
            </Box>

            {/* Virtuoso Table */}
            <Box sx={{ width: "80%" }}>
              {loading ? (
                <Typography>Loading users...</Typography>
              ) : (
                <Virtuoso
                  style={{ height: "500px" }}
                  totalCount={filteredCollege.length}
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
                        <Box sx={{ flex: 2 }}>Name</Box>
                        <Box sx={{ flex: 1 }}>Color Attribute</Box>
                        <Box sx={{ flex: 1 }}>Action</Box>
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
                          padding: "10px",
                          borderBottom: "1px solid #ccc",
                        }}
                      >
                        <Box sx={{ flex: 1 }}>{college.college_id}</Box>
                        <Box sx={{ flex: 2 }}>{college.college_name}</Box>
                        <Box sx={{ flex: 1 }}>{null}</Box>
                        <Box sx={{ flex: 1 }}>
                          <Button
                            variant='text'
                            color='primary'
                            onClick={() => handleOpenModal(college)}
                          >
                            Edit
                          </Button>
                        </Box>
                      </Box>
                    );
                  }}
                />
              )}
            </Box>

            {/* Add Conference Modal */}
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
                      onClick={handleAddCollege}
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

            {selectedCollege && (
              <Modal
                open={openModal}
                onClose={handleCloseModal}
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 400,
                    bgcolor: "background.paper",
                    boxShadow: 24,
                    p: 4,
                    borderRadius: "8px",
                  }}
                >
                  <Typography variant='h5' mb={3}>
                    Edit College
                  </Typography>
                  <TextField
                    label='College ID'
                    value={selectedCollege.college_id}
                    disabled
                    fullWidth
                    margin='normal'
                  />
                  <TextField
                    label='Name'
                    value={selectedCollege.college_name}
                    fullWidth
                    margin='normal'
                  />
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mt: 3,
                    }}
                  >
                    <Button
                      variant='outlined'
                      onClick={handleCloseModal}
                      sx={{ fontWeight: 600 }}
                    >
                      Back
                    </Button>
                    <Button
                      variant='contained'
                      color='primary'
                      onClick={handleSaveChanges}
                      sx={{ fontWeight: 600 }}
                    >
                      Save Changes
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
