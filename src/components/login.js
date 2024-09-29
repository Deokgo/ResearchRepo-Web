//created by Nicole Cabansag (September 29, 2024)
//this file is for the login page of the system

import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Link } from "react-router-dom";
import logoImage from "./MMCL_Logo_Horizontal.png"; // Import your image here

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  //handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  //handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData); //log form data 
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
          backgroundColor: "#08397C", //background color based on the image
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            backgroundColor: "#fff",
            padding: "2em",
            borderRadius: "8px",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
            maxWidth: "500px", //increase the maxWidth
            width: "100%",
          }}
        >
          {/* Add the image at the top */}
          <Box sx={{ textAlign: "center", marginBottom: "1.5em" }}>
            <img
              src={logoImage} //add the image source here
              alt="Mapua MCL Logo"
              style={{ width: "250px" }} 
            />
          </Box>

          <Typography
            variant="h4"
            color="#F40824"
            sx={{
              textAlign: "center",
              marginBottom: "1em",
            }}
          >
            Login to Mapúa MCL's Research Repository
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              width: "100%",
              justifyContent: "center",
            }}
          >
            <TextField
              fullWidth
              label="Mapúa MCL Live Account"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
            ></TextField>

            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"  // Always keep it as password
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
            ></TextField>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                marginTop: "20px",
                padding: "15px",
                backgroundColor: "#EC1F28",
                color: "#fff",
              }}
            >
              Log in
            </Button>

            <Typography
              sx={{
                marginTop: "10px",
                textAlign: "center",
              }}
            >
              Don’t have an account?{" "}
              <Link to="/signup" style={{ color: "#3393EA" }}>
                Sign up
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Login;
