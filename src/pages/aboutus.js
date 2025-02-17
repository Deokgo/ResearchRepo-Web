import React, { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import {
  Box,
  Button,
  Grid2,
  Paper,
  Typography,
  Divider,
  IconButton,
  TextField,
  Modal,
} from "@mui/material";
import placeholderImage from "../assets/placeholder_image.png";
import homeBg from "../assets/home_bg.png";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import navLogo from "../assets/CCIS-Logo.png";
import HeaderWithBackButton from "../components/Header";

const AboutUs = () => {
  const navigate = useNavigate();

  const team = [
    {
      name: "Khristian G. Kikuchi",
      role: "Thesis Adviser",
    },
    {
      name: "Francis Nicole B. Cabansag",
      role: "Web Developer",
    },
    {
      name: "Kane Justine A. Cometa",
      role: "Web UI Designer and Developer",
    },
    {
      name: "Jelly Anne Kaye G. Mallari",
      role: "Web UI Designer and Developer",
    },
    {
      name: "John Rafael D. Mendegorin",
      role: "Web Developer",
    },
  ];

  return (
    <>
      <Box
        sx={{
          margin: 0,
          padding: 0,
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Navbar />
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            height: {
              xs: "calc(100vh - 3.5rem)",
              sm: "calc(100vh - 4rem)",
              md: "calc(100vh - 6rem)",
            },
          }}
        >
          <HeaderWithBackButton title='About Us' onBack={() => navigate(-1)} />

          {/* Content Section */}
          <Box sx={{ flexGrow: 1, p: { xs: 7, md: 15 } }}>
            <Grid2 container spacing={4} mb={15}>
              {/* Left Column */}
              <Grid2
                size={{ xs: 12, md: 6 }}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                <Typography
                  variant='h4'
                  sx={{
                    fontWeight: 600,
                    fontSize: { xs: "1.375rem", sm: "2.375rem", md: "4.25rem" },
                    color: "#001C43",
                  }}
                >
                  A centralized <br /> hub for all your
                  <Box
                    sx={{
                      backgroundColor: "#DF031D",
                      mt: 1,
                      ml: 1,
                      display: "inline-block",
                      px: 1.5,
                    }}
                  >
                    <Typography
                      component='span'
                      sx={{
                        fontWeight: 600,
                        color: "#fff",
                        fontSize: { xs: "1rem", sm: "2rem", md: "3.375rem" },
                      }}
                    >
                      research needs
                    </Typography>
                  </Box>
                </Typography>
                <Typography
                  variant='body2'
                  sx={{
                    mt: 3,
                    fontWeight: 600,
                    fontSize: { xs: "0.9rem", sm: "1rem", md: "1.25rem" },
                    color: "#DF031D",
                  }}
                >
                  made by the Mapua Malayan CCIS students
                </Typography>
                <Typography
                  variant='body1'
                  sx={{
                    mt: 2,
                    fontSize: { xs: "0.9rem", sm: "0.95rem", md: "1rem" },
                    color: "#001C43",
                  }}
                >
                  This Research Repository is developed by group CS202401 in
                  partial requirement for CS Thesis
                </Typography>
              </Grid2>

              {/* Right Column */}
              <Grid2
                size={{ xs: 12, md: 6 }}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  alignSelf: "center",
                  textAlign: "center",
                }}
              >
                <img
                  src={navLogo}
                  alt='Logo'
                  style={{
                    width: "65%",
                    height: "auto",
                  }}
                />
              </Grid2>
            </Grid2>
            <Box display='flex' justifyContent='center'>
              <Typography
                variant='h4'
                display='flex'
                justifyContent='center'
                sx={{
                  fontWeight: 600,
                  color: "#DF031D",
                  m: "3rem",
                }}
              >
                Development Team
              </Typography>
            </Box>
            
            <Grid2 container spacing={3} display='flex' justifyContent='center'>
              {team.map((member) => (
                <Grid2 key={member.name} xs={12} sm={6} md={4}>
                  <Paper
                    display='flex'
                    sx={{
                      background: "white",
                      borderRadius: "4px",
                      padding: "2rem",
                      width: "25rem",
                      boxShadow: "0 10px 20px rgba(0, 0, 0, 0.12)",
                    }}
                  >
                    <Typography
                      display='flex'
                      justifyContent='center'
                      variant='h6'
                      sx={{
                        fontWeight: 700,
                        color: "#001C43",
                      }}
                    >
                      {member.name}
                    </Typography>
                    <Typography
                      display='flex'
                      justifyContent='center'
                      variant='body1'
                      sx={{
                        color: "#001C43",
                        mt: 1,
                      }}
                    >
                      {member.role}
                    </Typography>
                  </Paper>
                </Grid2>
              ))}
            </Grid2>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default AboutUs;
