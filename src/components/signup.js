import React, { useEffect, useState } from "react";
import logoImage from "../assets/mmcl_logo_white.png"; //path of the image
import homeBg from "../assets/home_bg.png";
import {
  Box,
  Button,
  Divider,
  Grid2,
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
import { Link } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  // State for form fields
  /////////////////////////////////////////////////////////////////////////////////////////////
  //Dummy values for department, program since there are no values yet in the combobox
  //subject for changes once combobox is setup
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    suffix: "",
    role_id: "04",
    email: "",
    department: "CCIS",
    program: "CS",
    password: "",
    confirmPassword: "",
  });
  ////////////////////////////////////////////////////////////////////////////////////////////

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [colleges, setColleges] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [selectedCollege, setSelectedCollege] = useState("");

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const response = await axios.get("/deptprogs/college_depts");
        const data = response.data;
        setColleges(data.colleges);
      } catch (error) {
        console.error("Error fetching college data:", error);
      }
    };
    fetchColleges();
  }, []);
  const fetchPrograms = async (collegeId) => {
    if (collegeId) {
      try {
        const response = await axios.get(
          `/deptprogs/programs?department=${collegeId}`
        );
        setPrograms(response.data.programs);
      } catch (error) {
        console.error("Error fetching programs:", error);
      }
    }
  };
  const handleCollegeChange = (e) => {
    const collegeId = e.target.value;
    setSelectedCollege(collegeId);
    setFormData((prevData) => ({ ...prevData, department: collegeId }));
    fetchPrograms(collegeId);
  };
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

  // Handle form submission --> modified by Kane Cometa (September 30, 2024)
  const handleSubmit = async (e) => {
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
      alert(`Signup successful! User ID: ${data.user_id}`);
      window.location.href = "/login";
    } catch (error) {
      console.error("Error during signup request:", error);
      alert(`Signup failed: ${error.message}`); //show error message to the user
    }
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
        {/* Left side for large screens */}
        <Box
          sx={{
            position: "relative",
            backgroundColor: "#08397C",
            flex: 0.55,
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
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
          <img
            src={logoImage}
            alt='MMCL Logo'
            style={{ width: "30%", height: "auto" }}
            sx={{ zIndex: 2 }}
          />
          <Box
            sx={{
              zIndex: 2,
              backgroundColor: "#EC1F28",
              padding: "10px 20px",
              marginTop: "20px",
              borderRadius: "8rem",
            }}
          >
            <Typography
              variant='h2'
              sx={{
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 400,
                color: "#FFF",
                px: "3rem",
                fontSize: "1.5rem",
                letterSpacing: "0.1rem", // Add letter spacing
              }}
            >
              Institutional Repository
            </Typography>
          </Box>
        </Box>
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
              variant='h2'
              color='#F40824'
              fontWeight='700'
              sx={{
                textAlign: { xs: "center", md: "left", paddingBottom: 20 },
              }}
            >
              Sign up
            </Typography>

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
                        <IconButton onClick={() => clearField("middleName")}>
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
              label='Mapúa MCL Live Account'
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
                  onChange={handleCollegeChange}
                  margin='normal'
                  variant='outlined'
                >
                  <MenuItem value=''>-- Select Department --</MenuItem>
                  {colleges.map((college) => (
                    <MenuItem
                      key={college.college_id}
                      value={college.college_id}
                    >
                      {college.college_name}
                    </MenuItem>
                  ))}
                </TextField>
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
                >
                  <MenuItem value=''>-- Select Program --</MenuItem>
                  {programs.map((prog) => (
                    <MenuItem key={prog.program_id} value={prog.program_id}>
                      {prog.program_name}
                    </MenuItem>
                  ))}
                </TextField>
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
                <Link to='/login' color='#3393EA'>
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
