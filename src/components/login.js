import React, { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import logoImage from "../assets/mmcl_logo_white.png"; // path of the image
import homeBg from "../assets/home_bg.png";
import LeftPanel from "../components/leftpanel";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/auth/login", {
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
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("user_id", data.user_id);
      navigate("/main");
    } catch (error) {
      alert(`Login failed: ${error.message}`);
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
        <LeftPanel />

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
              variant='h2'
              color='#F40824'
              fontWeight='700'
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
