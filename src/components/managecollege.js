import React, { useEffect, useState } from "react";
import Navbar from "./navbar";
import Footer from "./footer";
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
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import homeBg from "../assets/home_bg.png";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Search } from "@mui/icons-material";
import { Virtuoso } from "react-virtuoso";
import axios from "axios";

const ManageCollege = () => {
  const [colleges, setColleges] = useState([]);
  const [filteredCollege, setFilteredCollege] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [selectedCollege, setSelectedCollege] = useState(null);

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

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedCollege(null);
  };

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
                  fontSize: { xs: "1.5rem", sm: "2rem", md: "3rem" },
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
