import React, { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import {
  Box,
  Button,
  Grid,
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
import navLogo from "../assets/MMCL_Logo_Horizontal.png";

const ReadMore = () => {
  const navigate = useNavigate();

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
            marginTop: { xs: "3.5rem", sm: "4rem", md: "5rem" },
            height: {
              xs: "calc(100vh - 3.5rem)",
              sm: "calc(100vh - 4rem)",
              md: "calc(100vh - 6rem)",
            },
          }}
        >
          {/* Header with back button */}
          <Box
            sx={{
              position: "relative",
              width: "100%",
              height: {
                xs: "clamp(2rem, 3vh, 3rem)",
                sm: "clamp(3rem, 8vh, 4rem)",
                md: "clamp(3rem, 14vh, 4rem)",
                lg: "clamp(4rem, 20vh, 5rem)",
              },
              backgroundColor: "#0A438F",
              backgroundSize: "cover",
              backgroundPosition: "center",
              display: "flex",
              alignItems: "center",
              zIndex: 1,
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
                backgroundSize: "cover",
                opacity: 0.25,
                zIndex: 1,
              }}
            />
            <Box sx={{ display: "flex", ml: "5rem", zIndex: 3 }}>
              <IconButton
                onClick={() => navigate(-1)}
                sx={{
                  color: "#fff",
                  transform: {
                    xs: "scale(0.8)",
                    sm: "scale(1)",
                    md: "scale(1.2)",
                  },
                }}
              >
                <ArrowBackIosIcon />
              </IconButton>
              <Typography
                variant='h3'
                sx={{
                  py: 15,
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 800,
                  fontSize: {
                    xs: "clamp(1rem, 2vw, 1rem)",
                    sm: "clamp(1.5rem, 3.5vw, 1.5rem)",
                    md: "clamp(2rem, 4vw, 2.25rem)",
                  },
                  color: "#FFF",
                  lineHeight: 1.25,
                  alignSelf: "center",
                  zIndex: 2,
                }}
              >
                Read More
              </Typography>
            </Box>
          </Box>

          {/* Content Section */}
          <Box sx={{ flexGrow: 1, p: { xs: 2, md: 10 } }}>
            <Grid container spacing={4}>
              {/* Left Column */}
              <Grid
                item
                xs={12}
                md={6}
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
                    fontSize: { xs: "1.5rem", sm: "2rem", md: "3rem" },
                    color: "#001C43",
                  }}
                >
                  A centralized hub for all your
                  <Box
                    sx={{
                      backgroundColor: "#DF031D",
                      mt: 1,
                      display: "inline-block",
                      px: 2,
                    }}
                  >
                    <Typography
                      component='span'
                      sx={{
                        fontWeight: 600,
                        color: "#fff",
                        fontSize: { xs: "1.5rem", sm: "2rem", md: "3rem" },
                      }}
                    >
                      research needs
                    </Typography>
                  </Box>
                </Typography>
                <Typography
                  variant='body1'
                  sx={{
                    mt: 2,
                    fontSize: { xs: "0.9rem", sm: "1rem", md: "1.2rem" },
                    color: "#001C43",
                  }}
                >
                  A platform for researches by the Mapúa MCL researchers.
                </Typography>
              </Grid>

              {/* Right Column */}
              <Grid
                item
                xs={12}
                md={6}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                <img
                  src={navLogo}
                  alt='Logo'
                  style={{
                    width: "60%",
                    height: "auto",
                  }}
                />
                <Typography
                  variant='body1'
                  sx={{
                    mt: 2,
                    fontSize: { xs: "0.9rem", sm: "1rem", md: "1.2rem" },
                    color: "#001C43",
                  }}
                >
                  Our research repository offers a seamless platform to gather,
                  store, analyze, and share valuable data and insights.
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default ReadMore;
