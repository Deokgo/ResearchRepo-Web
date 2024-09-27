import React, { useState } from "react";
import {
  Box,
  Button,
  Divider,
  Grid2,
  Link,
  MenuItem,
  TextField,
  Typography,
  Container,
  IconButton,
  InputAdornment,
} from "@mui/material";
import {
  Clear as ClearIcon,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";

const Signup = () => {
  // State for form fields
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    department: "",
    program: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Handle input changes
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

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData); // This is for us to get the form data using console log
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          height: "100vh",
          width: "100vw",
          margin: 0,
          padding: 0,
        }}
      >
        <Box
          sx={{
            backgroundColor: "#08397C",
            flex: 0.55,
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        ></Box>
        <Box
          sx={{
            flex: { xs: 1, md: 0.45 },
            backgroundColor: "#fff",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            component='form'
            onSubmit={handleSubmit}
            sx={{
              width: "100%",
              maxWidth: "500px",
              justifyContent: "center",
              padding: "2em",
            }}
          >
            <Typography
              variant='h4'
              color='#F40824'
              sx={{
                textAlign: { xs: "center", md: "left" },
              }}
            >
              Sign up
            </Typography>
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
            <TextField
              fullWidth
              label='Email Address'
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
            <Grid2 container spacing={{ xs: 0, md: 2 }}>
              <Grid2 item size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label='Department'
                  name='department'
                  select
                  value={formData.department}
                  onChange={handleChange}
                  margin='normal'
                  variant='outlined'
                ></TextField>
              </Grid2>
              <Grid2 item size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label='Program'
                  name='program'
                  select
                  value={formData.program}
                  onChange={handleChange}
                  margin='normal'
                  variant='outlined'
                ></TextField>
              </Grid2>
            </Grid2>
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
                <Link href='Login' color='#3393EA'>
                  Login
                </Link>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Signup;
