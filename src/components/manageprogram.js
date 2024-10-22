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
  Checkbox
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import homeBg from "../assets/home_bg.png";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
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
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState(null);

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

    
    {/*
    useEffect(() => {
        let filtered = programs;

        // Filter by College
        if (selectedCollege.length > 0) {
        filtered = filtered.filter((item) =>
            selectedCollege.includes(item.college_id)
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

        setFilteredProgram(filtered);
    }, [
        selectedCollege,
        searchQuery,
        programs,
    ]);
    */}

    const handleCollegeChange = (event) => {
        const { value, checked } = event.target;
        setSelectedCollege((prev) =>
        checked ? [...prev, value] : prev.filter((item) => item !== value)
        );
    };

    const handleOpenModal = (college) => {
        setSelectedProgram(college);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedProgram(null);
    };

    const handleSaveChanges = () => {
        console.log(
        "Saving changes for:",
        selectedProgram.program_id
        );
        setOpenModal(false);
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
                Manage Program
              </Typography>
            </Box>
          </Box>

          {/*Main Content */}
          <Box
            sx={{
              flexGrow: 1,
              paddingTop: 5,
              mb: 2,
              ml: 5
            }}
          >
            <Grid2 container spacing={5} sx={{ height: "100%" }}>
                <Grid2 display='flex'justifyContent='flex-end' size={3}>
                <Box
                  sx={{
                    border: "2px solid #0A438F",
                    padding: 3,
                    display: "flex",
                    flexDirection: "column",
                    width: "80%",
                    height: "70%",
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
                    Filter
                  </Typography>
                  <Typography variant='body1' sx={{ mb: 1, color: "#08397C" }}>
                    College:
                  </Typography>
                  <Box
                    sx={{
                      height: "10rem",
                    }}
                  >
                    {colleges.map((college) => (
                      <FormControlLabel
                        key={college.college_id}
                        control={
                          <Checkbox
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
                <Grid2 display='flex' flexDirection='column' size={9}>
                    {/* Search Bar */}
                    <Box
                    sx={{
                        width: "80%", // Center search bar and button
                        display: "flex",
                        paddingBottom: 5,
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
                    >
                        Add New Program
                    </Button>
                    </Box>

                    {/* Virtuoso Table */}
                        <Box sx={{ width: "80%" }}>
                        {loading ? (
                            <Typography>Loading users...</Typography>
                        ) : (
                            <Virtuoso
                            style={{ height: "450px" }}
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
                                    <Box sx={{ flex: 1 }}>Program ID</Box>
                                    <Box sx={{ flex: 3 }}>Name</Box>
                                    <Box sx={{ flex: 1 }}>Action</Box>
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
                                    <Box sx={{ flex: 1 }}>{program.program_id}</Box>
                                    <Box sx={{ flex: 2 }}>{program.program_name}</Box>
                                    <Box sx={{ flex: 1 }}>{null}</Box>
                                    <Box sx={{ flex: 1 }}>
                                    <Button
                                        variant='text'
                                        color='primary'
                                        onClick={() => handleOpenModal(program)}
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
                </Grid2>
            </Grid2>
      
            {selectedProgram && (
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
                    value={selectedProgram.program_id}
                    disabled
                    fullWidth
                    margin='normal'
                  />
                  <TextField
                    label='Name'
                    value={selectedProgram.college_id}
                    fullWidth
                    margin='normal'
                  />
                  <TextField
                    label='Name'
                    value={selectedProgram.program_name}
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

export default ManageProgram;
