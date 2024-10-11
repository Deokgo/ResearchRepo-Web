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
  Paper,
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
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState("");
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/accounts/users");
        const fetchedUsers = response.data.researchers;
        setUsers(fetchedUsers);
        setFilteredUsers(fetchedUsers);
      } catch (error) {
        console.error("Error fetching data of users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleNavigateHome = () => {
    navigate("/main");
  };

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredUsers(
      users.filter(
        (user) =>
          user.email.toLowerCase().includes(query) ||
          user.researcher_id.toLowerCase().includes(query)
      )
    );
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
      selectedUser.researcher_id,
      "New Role:",
      newRole
    );
    setOpenModal(false);
  };

  const numberFontSettings = {
    fontFamily: "Montserrat, sans-serif",
    fontWeight: 500,
    fontSize: { xs: "1.5rem", sm: "2rem", md: "3rem" },
    color: "#08397C",
    mb: 2,
    lineHeight: 1.25,
    alignSelf: "center",
    zIndex: 2,
  }

  const labelFontSettings = {
    fontFamily: "Montserrat, sans-serif",
    fontWeight: 400,
    fontSize: { xs: "1.5rem", sm: "2rem", md: "1.25rem" },
    color: "#DF031D",
    mb: 2,
    lineHeight: 1.25,
    alignSelf: "center",
    zIndex: 2,
  }

  const boxSettings = {
    display: "flex",
    padding: 2,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
  }

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
                onClick={handleNavigateHome}
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
                  mb: 2,
                  lineHeight: 1.25,
                  alignSelf: "center",
                  zIndex: 2,
                }}
              >
                Research Tracking
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
            <Box
              sx={{
                p: 4,
                width: "80%", // Center search bar and button
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Paper
                variant="outlined"
                square={false}
                sx={{
                  textAlign: "center",
                  width: { xs: "50%", md: "100%" },
                  height: "auto",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10rem"
                }}
                style={{ border: '3px solid', borderRadius: 20, borderColor:"#001C43"}}
              >
                {/*contents here */}   
                <Box
                  sx={boxSettings}
                >
                  <Typography
                    variant='h3'
                    sx={numberFontSettings}
                  >
                    37
                  </Typography>
                  <Typography
                    variant='h3'
                    sx={labelFontSettings}
                  >
                    SUBMITTED
                  </Typography>
                </Box>
                <Box
                  sx={boxSettings}
                >
                  <Typography
                    variant='h3'
                    sx={numberFontSettings}
                  >
                    2
                  </Typography>
                  <Typography
                    variant='h3'
                    sx={labelFontSettings}
                  >
                    ACCEPTED
                  </Typography>
                </Box>
                <Box
                  sx={boxSettings}
                >
                  <Typography
                    variant='h3'
                    sx={numberFontSettings}
                  >
                    187
                  </Typography>
                  <Typography
                    variant='h3'
                    sx={labelFontSettings}
                  >
                    PUBLISHED
                  </Typography>
                </Box>
                <Box
                  sx={boxSettings}
                >
                  <Typography
                    variant='h3'
                    sx={numberFontSettings}
                  >
                    26
                  </Typography>
                  <Typography
                    variant='h3'
                    sx={labelFontSettings}
                  >
                    INDEXED
                  </Typography>
                </Box>
              </Paper>
            </Box>
            
            {/* Search Bar */}
            <Box
              sx={{
                pl: 4,
                width: "80%", // Center search bar and button
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <TextField
                variant='outlined'
                placeholder='Search ...'
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

            {/* Virtuoso Table */}
            <Box sx={{ padding: 4, width: "80%" }}>
              {loading ? (
                <Typography>Loading users...</Typography>
              ) : (
                <Virtuoso
                  style={{ height: "250px" }}
                  totalCount={filteredUsers.length}
                  header
                  
                  components={{
                    Header: () => (
                      <Box
                        sx={{
                          display: "flex",
                          fontFamily: "Montserrat, sans-serif",
                          fontSize: { xs: "1.5rem", sm: "2rem", md: "1.25rem" },
                          justifyContent: "space-between",
                          color: "#001C43",
                          padding: "10px",
                          fontWeight: 700,
                          position: "sticky",
                          top: 0,
                          zIndex: 1000,
                        }}
                      >
                        <Box sx={{ flex: 1 }}>Research ID</Box>
                        <Box sx={{ flex: 2 }}>Title</Box>
                        <Box sx={{ flex: 1 }}>Status</Box>
                        <Box sx={{ flex: 1 }}>Action</Box>
                      </Box>
                    ),
                  }}
                  itemContent={(index) => {
                    const user = filteredUsers[index];
                    return (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          padding: "10px",
                          borderBottom: "1px solid #ccc",
                        }}
                      >
                        <Box sx={{ flex: 1 }}>PBC-20240101-040</Box>
                        <Box sx={{ flex: 2 }}>Architectural Design in Modern Cities</Box>
                        <Box sx={{ flex: 1 }}>SUBMITTED</Box>
                        <Box sx={{ flex: 1 }}>
                          <Button
                            variant='text'
                            color='primary'
                            onClick={() => handleOpenModal(user)}
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
            {selectedUser && (
              <Modal
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby='edit-user-role-modal'
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
                    Edit User Role
                  </Typography>
                  <TextField
                    label='Research ID'
                    value="PBC-20240101-040"
                    disabled
                    fullWidth
                    margin='normal'
                  />
                  <TextField
                    label='Title'
                    value="Architectural Design in Modern Cities"
                    disabled
                    fullWidth
                    margin='normal'
                  />
                  <FormControl fullWidth margin='normal'>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value="SUBMITTED"
                      onChange={(e) => ["ACCEPTED", "INDEXED", "SUBMITTED"]}
                      label='Status'
                    >
                      <MenuItem value='Admin'>ACCEPTED</MenuItem>
                      <MenuItem value='Researcher'>INDEXED</MenuItem>
                      <MenuItem value='Viewer'>SUBMITTED</MenuItem>
                    </Select>
                  </FormControl>
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

export default ResearchTracking;
