import React, { useState, useEffect } from "react";
import Navbar from "./navbar";
import Footer from "./footer";
import {
  Box,
  Button,
  Grid2,
  Typography,
  Divider,
  IconButton,
  TextField,
  Modal,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import homeBg from "../assets/home_bg.png";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "10px",
};

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  // Retrieve user_id from cookie/localStorage
  const getUserId = () => {
    const userId = localStorage.getItem("user_id");
    return userId;
  };
  const [formValues, setFormValues] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    suffix: "",
    department: "",
    program: "",
    email: "",
    role: "",
  });

  const fetchUserData = async () => {
    const userId = getUserId();
    if (userId) {
      try {
        const response = await axios.get(`/accounts/users/${userId}`);
        const data = response.data;
        setUserData(data);
        setFormValues({
          firstName: data.researcher.first_name || "",
          middleName: data.researcher.middle_name || "",
          lastName: data.researcher.last_name || "",
          suffix: data.researcher.suffix || "",
          department: data.researcher.college_id || "",
          program: data.researcher.program_id || "",
          email: data.account.email || "",
          role: data.account.role || "",
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
  };

  // Fetch user data on component mount
  useEffect(() => {
    fetchUserData();
  }, []);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };
  const handleNavigateHome = () => {
    navigate("/main");
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
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
        }}
      >
        <Navbar />
        <Box 
        sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            height: { xs: "100%", md: "calc(100vh - 9rem)" },
            marginTop: { xs: "3.5rem", sm: "4rem", md: "6rem" },
          }}
        >

          {/* Header Section */}
          <Box
            sx={{
              position: "relative",
              marginBottom: 2,
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
                <ArrowBackIosIcon />
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
                Profile
              </Typography>
            </Box>
          </Box>

          {/* Content Section */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: 4,
              width: "100%",
            }}
          >
            <Box sx={{ width: "60%", mb: "1.5rem" }}>
              <Button
                variant='outlined'
                startIcon={<EditIcon />}
                onClick={handleOpenModal}
                sx={{ fontWeight: 600 }}
              >
                Edit Profile
              </Button>
            </Box>
            <Grid2 container spacing={2} sx={{ width: "60%" }}>
              {userData ? (
                [
                  {
                    label: "First Name",
                    value: userData.researcher.first_name,
                  },
                  {
                    label: "Middle Name",
                    value: userData.researcher.middle_name,
                  },
                  {
                    label: "Last Name",
                    value: userData.researcher.last_name,
                  },
                  {
                    label: "Suffix",
                    value: userData.researcher.suffix || "N/A",
                  },
                  {
                    label: "Email Account",
                    value: userData.account.email,
                  },
                  {
                    label: "Role",
                    value: userData.account.role,
                  },
                  {
                    label: "Department",
                    value: userData.researcher.college_id,
                  },
                  {
                    label: "Program",
                    value: userData.researcher.program_id,
                  },
                ].map((field, index) => (
                  <Grid2 size={{ xs: 12, sm: 6 }} key={index}>
                    <Typography
                      variant='body1'
                      sx={{
                        color: "#777",
                        fontWeight: 600,
                        fontSize: "1rem",
                      }}
                    >
                      {field.label}
                    </Typography>
                    <Typography
                      variant='h6'
                      sx={{
                        color: "#001C43",
                        fontWeight: 600,
                        fontSize: "1.25rem",
                        mt: "0.25rem",
                      }}
                    >
                      {field.value}
                    </Typography>
                    <Divider
                      sx={{ mt: "0.75rem", mb: "1.5rem", borderColor: "#ccc" }}
                    />
                  </Grid2>
                ))
              ) : (
                <Typography variant='body1'>Loading user data...</Typography>
              )}
            </Grid2>
          </Box>
          <Modal open={isModalOpen} onClose={handleCloseModal}>
            <Box sx={modalStyle}>
              <Typography
                variant='h4'
                sx={{ mb: 4, fontWeight: 800, color: "#08397C" }}
              >
                Edit Profile
              </Typography>
              <Grid2 container spacing={2}>
                <Grid2 size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label='First Name'
                    fullWidth
                    name='firstName'
                    value={formValues.firstName}
                    onChange={handleInputChange}
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label='Middle Name'
                    fullWidth
                    name='middleName'
                    value={formValues.middleName}
                    onChange={handleInputChange}
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label='Last Name'
                    fullWidth
                    name='lastName'
                    value={formValues.lastName}
                    onChange={handleInputChange}
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label='Suffix'
                    fullWidth
                    name='suffix'
                    value={formValues.suffix}
                    onChange={handleInputChange}
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label='Email Account'
                    fullWidth
                    name='email'
                    value={formValues.email}
                    disabled
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label='Role'
                    fullWidth
                    name='role'
                    value={formValues.role}
                    disabled
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label='Department'
                    fullWidth
                    name='department'
                    value={formValues.department}
                    onChange={handleInputChange}
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label='Program'
                    fullWidth
                    name='program'
                    value={formValues.program}
                    onChange={handleInputChange}
                  />
                </Grid2>
              </Grid2>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "1.5rem",
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
                  onClick={handleCloseModal}
                  sx={{
                    backgroundColor: "#CA031B",
                    color: "#FFF",
                    fontWeight: 600,
                  }}
                >
                  Save Changes
                </Button>
              </Box>
            </Box>
          </Modal>
        </Box>
      </Box>
    </>
  );
};

export default Profile;
