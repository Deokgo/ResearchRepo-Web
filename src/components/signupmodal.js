// signupmodal.js
import React, { useState } from "react";
import { useModalContext } from "./modalcontext"; // Import the ModalContext
import {
  Box,
  Button,
  IconButton,
  TextField,
  Typography,
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
const SignUpModal = () => {
  const { isSignupModalOpen, closeSignupModal, openLoginModal } =
    useModalContext(); // Use context
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    institution: "",
    email: "",
    reason: "",
    password: "",
  });

  const resetFields = () => {
    setFormData({
      firstName: "",
      lastName: "",
      institution: "",
      email: "",
      reason: "",
      password: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const clearField = (fieldName) => {
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: "",
    }));
  };

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "auto",
    height: "auto",
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

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      alert(`Signup successful! User ID: ${data.user_id}`);
      resetFields();
      closeSignupModal(); // Close the signup modal
      openLoginModal(); // Open the login modal
    } catch (error) {
      alert(`Signup failed: ${error.message}`);
    }
  };

  return (
    <>
      <Modal open={isSignupModalOpen} onClose={closeSignupModal}>
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
                width: "auto",
                justifyContent: "center",
                padding: "1em",
              }}
            >
              <Grid2 container spacing={{ xs: 0, md: 2 }}>
                <Grid2 item size={{ xs: 12, md: 4 }}>
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
                <Grid2 item size={{ xs: 12, md: 4 }}>
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
                          <IconButton onClick={() => clearField("middleName")}>
                            <ClearIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid2>
                <Grid2 item size={{ xs: 12, md: 4 }}>
                  <TextField
                    fullWidth
                    label='Last Name'
                    name='lastName'
                    value={formData.lastName}
                    onChange={handleChange}
                    margin='normal'
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
                <Grid2 item size={{ xs: 12, md: 4 }}>
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
                <Grid2 item size={{ xs: 12, md: 8 }}>
                  <TextField
                    fullWidth
                    label='Email'
                    name='email'
                    type='email'
                    value={formData.email}
                    onChange={handleChange}
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
                </Grid2>
              </Grid2>
              
              <TextField
                fullWidth
                label='Institution'
                name='institution'
                type='institution'
                value={formData.institution}
                onChange={handleChange}
                margin='normal'
                variant='outlined'
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton onClick={() => clearField("institution")}>
                        <ClearIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              ></TextField>
              <TextField
                fullWidth
                label='Reason'
                name='reason'
                type='reason'
                value={formData.reason}
                onChange={handleChange}
                margin='normal'
                multiline
                maxRows={1}
                variant='outlined'
                helperText={`${formData.reason.length}/${100}`}
                inputProps={{
                  maxLength: 100,
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton onClick={() => clearField("reason")}>
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
                            {showPassword ? <VisibilityOff /> : <Visibility />}
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
                          <IconButton onClick={toggleConfirmPasswordVisibility}>
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
                    maxWidth: "200px",
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
                      resetFields();
                      closeSignupModal();
                      openLoginModal();
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
    </>
  );
};

export default SignUpModal;
