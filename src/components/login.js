//created by Nicole Cabansag (September 29, 2024)
//this file is for the login page (provided 2nd option for its UI)

import React, { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import logoImage from "../assets/MMCL_Logo_Horizontal.png"; //path of the image
const axios = require("axios").default;
const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  //handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  //handle form submission --> modified by Nicole Cabansag (September 24, 2024)
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    try {
      const response = await fetch("http://127.0.0.1:5000/login", {
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

      //since the /login route returns 'user_id' and 'role', update the alert message accordingly
      alert(`Login successful! User ID: ${data.user_id}, Role: ${data.role}`);
      window.location.href = "/home";
    } catch (error) {
      console.error("Error during login request:", error);
      alert(`Login failed: ${error.message}`); //show error message to the user
    }
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
            backgroundColor: "#08397C",
            flex: 0.55,
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <img
            src={logoImage}
            alt='MMCL Logo'
            style={{ width: "80%", maxWidth: "700px", height: "auto" }}
          />
        </Box>

        {/* Right side (login form) */}
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
                marginBottom: "1em",
              }}
            >
              Login
            </Typography>

            <Box
              component='form'
              onSubmit={handleSubmit}
              sx={{
                width: "100%",
                justifyContent: "center",
              }}
            >
              {/* Email Field */}
              <TextField
                fullWidth
                label='Mapúa MCL Live Account'
                name='email'
                type='email'
                value={formData.email}
                onChange={handleChange}
                margin='normal'
                variant='outlined'
              />

              {/* Password Field */}
              <TextField
                fullWidth
                label='Password'
                name='password'
                type='password'
                value={formData.password}
                onChange={handleChange}
                margin='normal'
                variant='outlined'
              />

              {/* Submit Button */}
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
                  <Link to='/signup' style={{ color: "#3393EA" }}>
                    Sign up
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Login;
