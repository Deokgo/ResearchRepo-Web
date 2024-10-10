import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Modal,
} from "@mui/material";

const LoginModal = () => {
    const [isModalLoginOpen, setIsLoginModalOpen] = useState(false);
    const navigate = useNavigate();

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

  const handleOpenLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const handleCloseLoginModal = () => {
    setIsLoginModalOpen(false);
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

  return (
    <>
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
