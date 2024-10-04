import { Box, Button, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import logoImage from "../assets/mmcl_logo_white.png"; // path of the image
import homeBg from "../assets/home_bg.png";
import { Link } from "react-router-dom";

const PasswordReset = () => {
  const [formData, setFormData] = useState({
    email: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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

        {/* Right side (Password Recovery) */}
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
              variant='h3'
              fontWeight='700'
              color='#F40824'
              sx={{
                textAlign: { xs: "center", md: "left" },
                marginBottom: "1em",
              }}
            >
              Reset Password
            </Typography>
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
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginTop: "20px",
              }}
            >
              <Typography sx={{ marginTop: "20px" }}>
                Did not receive the OTP?{" "}
                <Link style={{ color: "#3393EA" }}>Resend OTP</Link>
              </Typography>
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
                Send OTP
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default PasswordReset;
