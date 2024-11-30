import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, TextField, Typography, Modal } from "@mui/material";
import { useModalContext } from "./modalcontext";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const LoginModal = () => {
  const {
    isLoginModalOpen,
    closeLoginModal,
    openSignupModal,
    openPassresetModal,
  } = useModalContext();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });

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
    width: 600,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: "10px",
  };

  // Handle form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/auth/login", formValues);
      const { token } = response.data;

      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      await login(token);

      const userResponse = await axios.get("/auth/me");
      const userRole = userResponse.data.role;

      handleModalClose();

      alert(`Login Successfully`);

      switch (userRole) {
        case "01":
          navigate("/manage-users");
          break;
        case "02":
        case "03":
          navigate("/researchtracking");
          break;
        case "04":
          navigate("/maindash");
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
      alert(`Login failed: ${error.response?.data?.message || error.message}`);
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

  return (
    <>
      {/*Log In Modal*/}
      <Modal open={isLoginModalOpen} onClose={handleModalClose}>
        <Box sx={modalStyle}>
          <Typography
            variant='h6'
            color='#0A438F'
            fontWeight='500'
            sx={{
              textAlign: { xs: "center", md: "bottom" },
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
                    maxWidth: "200px",
                    marginTop: "20px",
                    padding: "15px",
                    backgroundColor: "#EC1F28",
                  }}
                >
                  Log in
                </Button>

                <Button
                  onClick={handleForgotPassword}
                  color='primary'
                  sx={{ textTransform: "none" }}
                >
                  Forgot Password?
                </Button>
                <Typography sx={{ marginTop: "20px" }}>
                  Don’t have an account?{" "}
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
