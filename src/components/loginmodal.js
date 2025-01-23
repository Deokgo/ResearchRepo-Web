import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Modal,
  useMediaQuery,
} from "@mui/material";
import { useModalContext } from "../context/modalcontext";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { isMobile } from "react-device-detect";
import { filterCache, fetchAndCacheFilterData } from "../utils/filterCache";
axios.defaults.baseURL = "http://localhost:5000";
axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.withCredentials = true;
const LoginModal = () => {
  const {
    isLoginModalOpen,
    closeLoginModal,
    openSignupModal,
    openPassresetModal,
  } = useModalContext();
  const navigate = useNavigate();
  const { login } = useAuth();
  const isSizeMobile = useMediaQuery("(max-width:600px)");

  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const resetFields = () => {
    setFormValues({
      email: "",
      password: "",
    });
  };

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: { xs: "90%", sm: "80%", md: "600px" }, // Responsive width
    bgcolor: "background.paper",
    boxShadow: 24,
    p: { xs: 2, sm: 3, md: 4 }, // Responsive padding
    borderRadius: "10px",
  };

  // Handle form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    try {
      const response = await axios.post("/auth/login", formValues);
      const { token } = response.data;

      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      await login(token);

      console.log("[LoginModal] Fetching and caching filter data");
      await fetchAndCacheFilterData();

      const userResponse = await axios.get("/auth/me");
      const userRole = userResponse.data.role;

      handleModalClose();

      // If the user is on a mobile device, navigate to collections immediately
      if (isMobile || isSizeMobile) {
        navigate("/collection");
        return; // Prevent further navigation logic for mobile users
      }

      switch (userRole) {
        case "01":
          navigate("/manage-users");
          break;
        case "02":
        case "03":
          navigate("/researchtracking");
          break;
        case "04":
          navigate("/dash");
          break;
        case "05":
        case "06":
          navigate("/collection");
          break;
        default:
          alert("Unknown role, unable to navigate");
          navigate("/");
          break;
      }
    } catch (error) {
      console.error("Login error details:", error);
      setErrorMessage(
        error.response?.data?.message || "Login failed. Please try again."
      );
    }
  };

  const handleModalClose = () => {
    resetFields();
    closeLoginModal();
  };

  const handleForgotPassword = () => {
    closeLoginModal();
    openPassresetModal();
  };

  // Utility function to create responsive TextField styles
  const createTextFieldStyles = (customFlex = 2) => ({
    flex: customFlex,
    "& .MuiInputBase-input": {
      fontSize: {
        xs: "0.75rem", // Mobile
        sm: "0.75rem", // Small devices
        md: "0.8rem", // Medium devices
        lg: "1rem", // Large devices
      },
      // Adjust input height
      padding: {
        xs: "8px 12px", // Mobile
        md: "12px 14px", // Larger screens
      },
    },
  });

  // Utility function to create responsive label styles
  const createInputLabelProps = () => ({
    sx: {
      fontSize: {
        xs: "0.75rem", // Mobile
        sm: "0.75rem", // Small devices
        md: "0.8rem", // Medium devices
        lg: "0.9rem", // Large devices
      },
    },
  });

  return (
    <>
      {/*Log In Modal*/}
      <Modal open={isLoginModalOpen} onClose={handleModalClose}>
        <Box
          sx={{
            ...modalStyle,
            maxHeight: "90vh", // Limit the modal height to 90% of the viewport height
            overflowY: "auto", // Enable vertical scrolling when content overflows
          }}
        >
          <Typography
            variant='h6'
            color='#0A438F'
            fontWeight='500'
            sx={{
              textAlign: { xs: "center", md: "bottom" },
              fontSize: {
                xs: "clamp(0.5rem, 2vw, 0.5rem)",
                sm: "clamp(0.75rem, 3.5vw, 0.75rem)",
                md: "clamp(1rem, 4vw, 1rem)",
              },
            }}
          >
            Mapúa MCL Research Repository
          </Typography>
          <Typography
            variant='h2'
            color='#F40824'
            fontWeight='700'
            padding={3}
            sx={{
              textAlign: { xs: "center", md: "bottom" },
              fontSize: {
                xs: "clamp(1rem, 2vw, 1rem)",
                sm: "clamp(2rem, 3.5vw, 2rem)",
                md: "clamp(3rem, 4vw, 3rem)",
              },
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
                marginLeft: "5rem",
                marginRight: "5rem",
              }}
            >
              <TextField
                label='Account'
                fullWidth
                name='email'
                value={formValues.email}
                onChange={handleChange}
                margin='normal'
                variant='outlined'
                sx={createTextFieldStyles()}
                InputLabelProps={createInputLabelProps()}
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
                sx={createTextFieldStyles()}
                InputLabelProps={createInputLabelProps()}
              />
              {errorMessage && (
                <Typography
                  color='error'
                  sx={{
                    width: "100%",
                    textAlign: "center",
                    marginTop: 1,
                    marginBottom: 1,
                    fontSize: {
                      xs: "0.75rem",
                      sm: "0.875rem",
                      md: "1rem",
                    },
                  }}
                >
                  {errorMessage}
                </Typography>
              )}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  marginTop: "20px",
                }}
              >
                <Button
                  variant='contained'
                  fullWidth
                  type='submit'
                  sx={{
                    backgroundColor: "#CA031B",
                    color: "#FFF",
                    fontFamily: "Montserrat, sans-serif",
                    fontWeight: 600,
                    textTransform: "none",
                    fontSize: { xs: "0.875rem", md: "1rem" },
                    padding: { xs: "0.5rem 1rem", md: "1.25rem" },
                    borderRadius: "100px",
                    maxHeight: "3rem",
                    "&:hover": {
                      backgroundColor: "#A30417",
                      color: "#FFF",
                    },
                  }}
                >
                  Login
                </Button>

                <Button
                  onClick={handleForgotPassword}
                  color='primary'
                  sx={{
                    textTransform: "none",
                    fontSize: {
                      xs: "10px",
                      sm: "12px",
                      md: "14px",
                      lg: "16px",
                    }, // Small base font size
                    padding: {
                      xs: "4px 6px",
                      sm: "6px 8px",
                      md: "8px 10px",
                      lg: "10px 12px",
                    }, // Smaller base padding
                  }}
                >
                  Forgot Password?
                </Button>

                <Typography
                  sx={{
                    textAlign: { xs: "center", md: "bottom" },
                    fontSize: {
                      xs: "clamp(0.5rem, 2vw, 0.5rem)",
                      sm: "clamp(0.75rem, 3.5vw, 0.75rem)",
                      md: "clamp(1rem, 4vw, 1rem)",
                    },
                  }}
                >
                  Don't have an account?{" "}
                  <a
                    href='#'
                    onClick={(e) => {
                      e.preventDefault();
                      closeLoginModal();
                      openSignupModal();
                      resetFields();
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
    </>
  );
};

export default LoginModal;
