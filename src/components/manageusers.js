import React, { useEffect, useState } from "react";
import Navbar from "./navbar";
import Footer from "./footer";
import { Box, Button, IconButton, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import homeBg from "../assets/home_bg.png";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Virtuoso } from "react-virtuoso";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Simulating user data fetching
  useEffect(() => {
    // Fetch or set your user data here
    const fetchedUsers = [
      { id: "US-20240930-001", email: "admin@live.mcl.edu.ph", role: "Admin" },
      { id: "US-20240930-002", email: "admin2@live.mcl.edu.ph", role: "Admin" },
      { id: "US-20240930-003", email: "admin3@live.mcl.edu.ph", role: "Admin" },
      { id: "US-20240930-004", email: "admin4@live.mcl.edu.ph", role: "Admin" },
      { id: "US-20240930-005", email: "admin5@live.mcl.edu.ph", role: "Admin" },
      // Add more users as needed
    ];
    setUsers(fetchedUsers);
    setFilteredUsers(fetchedUsers);
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
          user.id.toLowerCase().includes(query)
      )
    );
  };

  const handleRoleUpdate = (userId) => {
    // Functionality to handle role update (e.g., opening modal or changing role)
    console.log("Update role for User:", userId);
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
              />
              <Button variant='contained' color='primary' sx={{ ml: 2 }}>
                Add New User
              </Button>
            </Box>

            {/* Virtuoso Table */}
            <Box sx={{ padding: 4, width: "80%" }}>
              <Virtuoso
                style={{ height: "400px" }}
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
                        zIndex: 2,
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
                      <Box sx={{ flex: 1 }}>{user.id}</Box>
                      <Box sx={{ flex: 2 }}>{user.email}</Box>
                      <Box sx={{ flex: 1 }}>{user.role}</Box>
                      <Box sx={{ flex: 1 }}>
                        <Button
                          variant='text'
                          color='primary'
                          onClick={() => handleRoleUpdate(user.id)}
                        >
                          Edit
                        </Button>
                      </Box>
                    </Box>
                  );
                }}
              />
            </Box>
          </Box>
        </Box>
        <Footer />
      </Box>
    </>
  );
};

export default ManageUsers;
