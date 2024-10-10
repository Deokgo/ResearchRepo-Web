import React, { useState } from "react";
import homeBg from "../assets/home_bg.png";
import { Link, useNavigate } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import placeholderImage from "../assets/placeholder_image.png";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Navbar from "./navbar";
import Footer from "./footer";
import {
  Box,
  Button,
  IconButton,
  Paper,
  TextField,
  Typography,
  useMediaQuery,
  Modal,
  Grid2,
  InputAdornment,
  Divider,
} from "@mui/material";
import {
  Clear as ClearIcon,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";

const Home = () => {
  const [isModalLoginOpen, setIsLoginModalOpen] = useState(false);
  const [isModalSignupOpen, setIsSignupModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width:600px)");

  const clearField = (fieldName) => {
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: "",
    }));
  };

  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });

  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    suffix: "",
    email: "",
    department: "CCIS",
    program: "CS",
    password: "",
    confirmPassword: "",
  });

  const departments = [
    {
      id: 1,
      name: "Mapúa Institute of Technology at Laguna",
      description: "Leading the future of engineering and technology.",
      image: placeholderImage, // Placeholder for image path
    },
    {
      id: 2,
      name: "College of Computer and Information Science",
      description: "Innovating through computer science and IT.",
      image: placeholderImage, // Placeholder for image path
    },
    {
      id: 3,
      name: "College of Arts and Science",
      description: "Fostering creativity and scientific knowledge.",
      image: placeholderImage, // Placeholder for image path
    },
    {
      id: 4,
      name: "E.T. Yuchengco College of Business",
      description:
        "Amplifying student voices; nurturing student leaders — for success in today's business world.",
      image: placeholderImage,
    }, // Placeholder for image path
    {
      id: 5,
      name: "College of Health Sciences",
      description:
        "Amplifying student voices; nurturing student leaders — for success in today's business world.",
      image: placeholderImage,
    }, // Placeholder for image path
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const NextArrow = ({ onClick }) => {
    return (
      <IconButton
        onClick={onClick}
        sx={{
          color: "#CA031B", // Set the arrow color to black
          position: "absolute",
          top: "50%",
          right: "-25px",
        }}
      >
        <ArrowForwardIosIcon />
      </IconButton>
    );
  };

  const PrevArrow = ({ onClick }) => {
    return (
      <IconButton
        onClick={onClick}
        sx={{
          color: "#CA031B", // Set the arrow color to black
          position: "absolute",
          top: "50%",
          left: "-25px",
        }}
      >
        <ArrowBackIosIcon />
      </IconButton>
    );
  };
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: isMobile ? 1 : 1,
    slidesToScroll: 1,
    nextArrow: <NextArrow />, // Use custom NextArrow
    prevArrow: <PrevArrow />,
  };

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

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const handleOpenLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const handleCloseLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const handleOpenSignupModal = () => {
    setIsSignupModalOpen(true);
  };

  const handleCloseSignupModal = () => {
    setIsSignupModalOpen(false);
  };

  // Handle form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formValues),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("user_id", data.user_id);
      alert(`Login Successfully`);
      handleCloseLoginModal();
      navigate("/home");
    } catch (error) {
      alert(`Login failed: ${error.message}`);
    }
  };

  // Handle form submission --> modified by Kane Cometa (September 30, 2024)
  const handleSignup = async (e) => {
    e.preventDefault();
    console.log(formData);
    try {
      const response = await fetch("/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json(); //get error details from server
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      console.log("Response from server:", data);

      //since the /signup route returns 'user_id' and 'role', update the alert message accordingly
      handleCloseSignupModal();
      handleOpenLoginModal();
      alert(`Signup successful! User ID: ${data.user_id}`);
    } catch (error) {
      console.error("Error during signup request:", error);
      alert(`Signup failed: ${error.message}`); //show error message to the user
    }
  };

  return (
    <>
      <Box
        sx={{
          // display: "flex",
          // height: "100vh",
          // width: "100vw",
          margin: 0,
          padding: 0,
        }}
      >
        <Navbar />
        <Box
          sx={{
            position: "relative",
            marginTop: { xs: "3.5rem", sm: "4rem", md: "6rem" },
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 4,
            flexGrow: 1,
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: { xs: "100%", md: "calc(100vh - 6rem)" },
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
              opacity: 0.25, // 25% opacity for the background image
              zIndex: 1,
            }}
          />
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              zIndex: 2,
              width: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                zIndex: 2,
                width: "auto",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  width: "50rem",
                  mb: "1rem",
                  padding: "2em",
                }}
              >
                <Slider
                  {...settings}
                  style={{ width: isMobile ? "60%" : "70%" }}
                >
                  {departments.map((department) => (
                    <Box key={department.id} sx={{ px: 3 }}>
                      <Paper
                        elevation={3}
                        sx={{
                          padding: 2,
                          textAlign: "center",
                          width: { xs: "70%", md: "100%" },
                          height: "auto",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <img
                          src={department.image}
                          style={{
                            width: "50%",
                            height: "auto",
                            padding: "1em",
                          }}
                          alt={department.name}
                        />
                        <Typography
                          variant='h7'
                          sx={{
                            fontWeight: 600,
                            fontFamily: "Montserrat, sans-serif",
                            color: "#08397C",
                            minHeight: "3rem",
                            lineHeight: 1.2,
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          {department.name}
                        </Typography>
                      </Paper>
                    </Box>
                  ))}
                </Slider>
              </Box>
              <Typography
                variant='body1'
                sx={{
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 300,
                  fontSize: { xs: "1rem", md: "1.15rem" },
                  color: "#F0F0F0",
                  mb: 4,
                  maxWidth: { xs: "100%", md: "80%" },
                  alignSelf: "center",
                }}
              >
                A platform for researches by the Mapúa MCL researchers
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  gap: 7,
                  justifyContent: { xs: "center" },
                  marginTop: { xs: 0, md: "2rem" },
                }}
              >
                <Button
                  variant='contained'
                  sx={{
                    backgroundColor: "#001C43",
                    color: "#FFF",
                    fontFamily: "Montserrat, sans-serif",
                    fontWeight: 600,
                    textTransform: "none",
                    fontSize: { xs: "0.875rem", md: "1.375rem" },
                    padding: { xs: "0.5rem 1rem", md: "0.75rem 2rem" },
                    borderRadius: "100px",
                    maxHeight: "3rem",
                  }}
                  flexItem
                >
                  Read More
                </Button>
                <Button
                  variant='contained'
                  key={"Get Started"}
                  onClick={handleOpenSignupModal}
                  sx={{
                    backgroundColor: "#CA031B",
                    color: "#FFF",
                    fontFamily: "Montserrat, sans-serif",
                    fontWeight: 600,
                    textTransform: "none",
                    fontSize: { xs: "0.875rem", md: "1.375rem" },
                    padding: { xs: "0.5rem 1rem", md: "0.75rem 2rem" },
                    borderRadius: "100px",
                    maxHeight: "3rem",
                  }}
                  flexItem
                >
                  Get Started
                </Button>
              </Box>
            </Box>
            <Box
              sx={{
                flex: 1,
                display: { xs: "none", md: "flex" },
                justifyContent: "center",
                alignItems: "center",
                zIndex: 2,
              }}
            >
              <Typography
                variant='body1'
                sx={{
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 600,
                  fontSize: { xs: "1rem", md: "1.15rem" },
                  color: "#F0F0F0",
                  mb: 4,
                  maxWidth: { xs: "100%", md: "80%" },
                  alignSelf: "center",
                }}
              >
                Knowledge Graph Here...
              </Typography>
            </Box>
          </Box>
        </Box>

        {/*Log In Modal*/}
        <Modal open={isModalLoginOpen} onClose={handleCloseLoginModal}>
          <Box sx={modalStyle}>
            <Typography
              variant='h2'
              color='#F40824'
              fontWeight='700'
              padding={3}
              sx={{
                textAlign: { xs: "center", md: "bottom" },
              }}
            >
              Login
            </Typography>
            <form onSubmit={handleLogin}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  marginLeft: "4rem",
                  marginRight: "4rem",
                }}
              >
                <TextField
                  label='Email'
                  fullWidth
                  name='email'
                  type='email'
                  value={formValues.email}
                  onChange={handleChange}
                  margin='normal'
                  variant='outlined'
                />
                <TextField
                  label='Password'
                  fullWidth
                  name='password'
                  type='password'
                  onChange={handleChange}
                  value={formValues.password}
                  margin='normal'
                  variant='outlined'
                />
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    marginTop: "20px",
                  }}
                >
                  <Button
                    type='submit'
                    fullWidth
                    variant='contained'
                    sx={{
                      maxWidth: "250px",
                      marginTop: "20px",
                      padding: "15px",
                      backgroundColor: "#EC1F28",
                    }}
                  >
                    Log in
                  </Button>

                  <Typography sx={{ marginTop: "20px" }}>
                    Don’t have an account?{" "}
                    <a
                      href='#'
                      onClick={(e) => {
                        e.preventDefault(); // For the anchor element not to do its usual behavior which is to navigate to another page
                        handleCloseLoginModal();
                        handleOpenSignupModal();
                      }}
                      style={{ color: "#3393EA" }}
                    >
                      Sign up
                    </a>
                  </Typography>
                </Box>
              </Box>
            </form>
          </Box>
        </Modal>

        {/*Sign Up Modal*/}
        <Modal open={isModalSignupOpen} onClose={handleCloseSignupModal}>
          <Box sx={modalStyle}>
            <Typography
              variant='h2'
              color='#F40824'
              fontWeight='700'
              paddingTop='1rem'
              sx={{
                textAlign: { xs: "center", md: "bottom" },
              }}
            >
              Sign Up
            </Typography>
            <form onSubmit={handleSignup}>
              <Box
                sx={{
                  width: "100%",
                  maxWidth: "500px",
                  justifyContent: "center",
                  padding: "2em",
                }}
              >
                <Grid2 container spacing={{ xs: 0, md: 2 }}>
                  <Grid2 item size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      label='First Name'
                      name='firstName'
                      value={formData.firstName}
                      onChange={handleChange}
                      margin='normal'
                      variant='outlined'
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='end'>
                            <IconButton onClick={() => clearField("firstName")}>
                              <ClearIcon />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    ></TextField>
                  </Grid2>
                  <Grid2 item size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      label='Middle Name'
                      name='middleName'
                      value={formData.middleName}
                      onChange={handleChange}
                      margin='normal'
                      variant='outlined'
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='end'>
                            <IconButton
                              onClick={() => clearField("middleName")}
                            >
                              <ClearIcon />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid2>
                  <Grid2 item size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      label='Last Name'
                      name='lastName'
                      value={formData.lastName}
                      onChange={handleChange}
                      variant='outlined'
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='end'>
                            <IconButton onClick={() => clearField("lastName")}>
                              <ClearIcon />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    ></TextField>
                  </Grid2>
                  <Grid2 item size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      label='Suffix'
                      name='suffix'
                      value={formData.suffix}
                      onChange={handleChange}
                      variant='outlined'
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='end'>
                            <IconButton onClick={() => clearField("suffix")}>
                              <ClearIcon />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    ></TextField>
                  </Grid2>
                </Grid2>
                <TextField
                  fullWidth
                  label='Email'
                  name='email'
                  type='email'
                  value={formData.email}
                  onChange={handleChange}
                  margin='normal'
                  variant='outlined'
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton onClick={() => clearField("email")}>
                          <ClearIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                ></TextField>
                <Divider orientation='horizontal' flexItem />
                <Grid2 container spacing={{ xs: 0, md: 2 }}>
                  <Grid2 size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      label='Password'
                      name='password'
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      margin='normal'
                      variant='outlined'
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='end'>
                            <IconButton onClick={togglePasswordVisibility}>
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    ></TextField>
                  </Grid2>
                  <Grid2 size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      label='Confirm Password'
                      name='confirmPassword'
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      margin='normal'
                      variant='outlined'
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='end'>
                            <IconButton
                              onClick={toggleConfirmPasswordVisibility}
                            >
                              {showConfirmPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    ></TextField>
                  </Grid2>
                </Grid2>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    marginTop: "20px",
                  }}
                >
                  <Button
                    fullWidth
                    variant='contained'
                    type='submit'
                    sx={{
                      maxWidth: "250px",
                      marginTop: "20px",
                      padding: "15px",
                      backgroundColor: "#EC1F28",
                    }}
                  >
                    Create Account
                  </Button>
                  <Typography sx={{ marginTop: "20px" }}>
                    Already a member?{" "}
                    <a
                      href='#'
                      onClick={(e) => {
                        e.preventDefault();
                        handleCloseSignupModal();
                        handleOpenLoginModal();
                      }}
                      style={{ color: "#3393EA" }}
                    >
                      Login
                    </a>
                  </Typography>
                </Box>
              </Box>
            </form>
          </Box>
        </Modal>
      </Box>
    </>
  );
};

export default Home;
