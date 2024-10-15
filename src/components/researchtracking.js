import React, { useEffect, useState } from "react";
import Navbar from "./navbar";
import Footer from "./footer";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
  Paper,
  Pagination,
  IconButton,
  InputAdornment,
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
  const [page, setPage] = useState(1);
  const rowsPerPage = 10; // Changed to a constant
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/dataset/fetch_dataset");
        const fetchedUsers = response.data.dataset.map((user) => ({
          research_id: user.research_id,
          title: user.title,
          timestamp: user.timestamp,
          status: user.status,
        }));
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
          user.research_id.toLowerCase().includes(query) ||
          user.title.toLowerCase().includes(query)
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
      selectedUser.research_id,
      "New Role:",
      newRole
    );
    // Here, you might want to implement an API call to save the changes
    setOpenModal(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Sliced data for pagination
  const paginatedUsers = filteredUsers.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const numberFontSettings = {
    fontFamily: "Montserrat, sans-serif",
    fontWeight: 500,
    fontSize: { xs: "1.5rem", sm: "2rem", md: "3rem" },
    color: "#08397C",
    mb: 2,
    lineHeight: 1.25,
    alignSelf: "center",
    zIndex: 2,
  };

  const labelFontSettings = {
    fontFamily: "Montserrat, sans-serif",
    fontWeight: 400,
    fontSize: { xs: "1.5rem", sm: "2rem", md: "1.25rem" },
    color: "#DF031D",
    mb: 2,
    lineHeight: 1.25,
    alignSelf: "center",
    zIndex: 2,
  };

  const boxSettings = {
    display: "flex",
    padding: 2,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
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
                <ArrowBackIosIcon />
              </IconButton>
              <Typography
                variant="h3"
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

          {/* Main Content */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              padding: 4,
            }}
          >
            {/* Filter Section (Left) */}
            <Box
              sx={{
                flexBasis: "20%",
                mr: 4,
              }}
            >
              <TextField
                variant="outlined"
                placeholder="Filter by"
                value={searchQuery}
                onChange={handleSearchChange}
                sx={{ width: "100%" }}
              />
            </Box>

            {/* Container for Stats, Search Bar, and Virtuoso Table (Right) */}
            <Box sx={{ flexBasis: "80%" }}>
              {/* Stats Section */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 4,
                }}
              >
                <Paper
                  variant="outlined"
                  square={false}
                  sx={{
                    textAlign: "center",
                    width: "100%",
                    height: "auto",
                    display: "flex",
                    justifyContent: "space-around",
                    padding: 2,
                    borderRadius: 3,
                    borderColor: "#001C43",
                  }}
                >
                  <Box sx={boxSettings}>
                    <Typography variant="h3" sx={numberFontSettings}>
                      37
                    </Typography>
                    <Typography variant="h3" sx={labelFontSettings}>
                      READY
                    </Typography>
                  </Box>
                  <Box sx={boxSettings}>
                    <Typography variant="h3" sx={numberFontSettings}>
                      2
                    </Typography>
                    <Typography variant="h3" sx={labelFontSettings}>
                      SUBMITTED
                    </Typography>
                  </Box>
                  <Box sx={boxSettings}>
                    <Typography variant="h3" sx={numberFontSettings}>
                      187
                    </Typography>
                    <Typography variant="h3" sx={labelFontSettings}>
                      ACCEPTED
                    </Typography>
                  </Box>
                  <Box sx={boxSettings}>
                    <Typography variant="h3" sx={numberFontSettings}>
                      26
                    </Typography>
                    <Typography variant="h3" sx={labelFontSettings}>
                      PUBLISHED
                    </Typography>
                  </Box>
                </Paper>
              </Box>

              {/* Search Bar */}
              <TextField
                variant="outlined"
                placeholder="Search ..."
                value={searchQuery}
                onChange={handleSearchChange}
                sx={{
                  marginBottom: 2,
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />

              {/* Virtuoso Table */}
              <Box sx={{ padding: 2, backgroundColor: "#F7F9FC" }}>
                {loading ? (
                  <Typography>Loading...</Typography>
                ) : (
                  <Virtuoso
                    style={{ height: "400px" }}
                    data={paginatedUsers}
                    itemContent={(index, user) => (
                      <Box
                        key={user.research_id}
                        sx={{
                          padding: 2,
                          borderBottom: "1px solid #ddd",
                          cursor: "pointer",
                        }}
                        onClick={() => handleOpenModal(user)}
                      >
                        <Typography variant="h6">{user.title}</Typography>
                        <Typography variant="body2" color="textSecondary">
                          Status: {user.status} | Timestamp: {user.timestamp}
                        </Typography>
                      </Box>
                    )}
                  />
                )}
              </Box>

              {/* Pagination */}
              <Pagination
                count={Math.ceil(filteredUsers.length / rowsPerPage)}
                page={page}
                onChange={handleChangePage}
                sx={{ mt: 2 }}
              />
            </Box>
          </Box>
        </Box>

        {/* Modal for Editing User */}
        <Modal open={openModal} onClose={handleCloseModal}>
          <Box
            sx={{
              width: "400px",
              bgcolor: "background.paper",
              p: 4,
              borderRadius: 2,
              boxShadow: 24,
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <Typography variant="h6" component="h2">
              Edit User Role
            </Typography>
            <TextField
              variant="outlined"
              label="Role"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              sx={{ mt: 2, width: "100%" }}
            />
            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
              <Button variant="contained" onClick={handleSaveChanges}>
                Save
              </Button>
              <Button variant="outlined" onClick={handleCloseModal}>
                Cancel
              </Button>
            </Box>
          </Box>
        </Modal>
      </Box>
      <Footer />
    </>
  );
};

export default ResearchTracking;
