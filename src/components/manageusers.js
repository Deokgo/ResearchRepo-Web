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

const ManageUsers = () => {
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
    navigate("/home");
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
                Manage Users
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
                p: 4,
                width: "80%", // Center search bar and button
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <TextField
                variant='outlined'
                placeholder='Search User...'
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
              <Button variant='contained' color='primary' sx={{ ml: 2 }}>
                Add New User
              </Button>
            </Box>

            {/* Virtuoso Table */}
            <Box sx={{ padding: 4, width: "80%" }}>
              {loading ? (
                <Typography>Loading users...</Typography>
              ) : (
                <Virtuoso
                  style={{ height: "500px" }}
                  totalCount={filteredUsers.length}
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
                        <Box sx={{ flex: 1 }}>User ID</Box>
                        <Box sx={{ flex: 2 }}>Email</Box>
                        <Box sx={{ flex: 1 }}>Role</Box>
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
                        <Box sx={{ flex: 1 }}>{user.researcher_id}</Box>
                        <Box sx={{ flex: 2 }}>{user.email}</Box>
                        <Box sx={{ flex: 1 }}>{user.role || "N/A"}</Box>
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
                    label='User ID'
                    value={selectedUser.researcher_id}
                    disabled
                    fullWidth
                    margin='normal'
                  />
                  <TextField
                    label='Mapúa MCL Live Account'
                    value={selectedUser.email}
                    disabled
                    fullWidth
                    margin='normal'
                  />
                  <FormControl fullWidth margin='normal'>
                    <InputLabel>Role</InputLabel>
                    <Select
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value)}
                      label='Role'
                    >
                      <MenuItem value='Admin'>Admin</MenuItem>
                      <MenuItem value='Researcher'>Researcher</MenuItem>
                      <MenuItem value='Viewer'>Viewer</MenuItem>
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
        <Footer />
      </Box>
    </>
  );
};

export default ManageUsers;
