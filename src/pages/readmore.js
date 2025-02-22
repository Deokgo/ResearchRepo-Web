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
import HeaderWithBackButton from "../components/Header";

const ReadMore = () => {
  const navigate = useNavigate();

  return (
    <>
      <Box
        sx={{
          margin: 0,
          padding: 0,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <Navbar />
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            height: "calc(100% - 6rem)",
            overflow: "hidden",
          }}
        >
          <HeaderWithBackButton
            title="Read More"
            onBack={() => navigate(-1)}
          />

          {/* Content Section */}
          <Box sx={{ flexGrow: 1, p: { xs: 5, md: 10 } }}>
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
                    fontSize: { xs: "1.375rem", sm: "2.375rem", md: "4.25rem" },
                    color: "#001C43",
                  }}
                >
                  A centralized hub for all your
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
                  variant='body1'
                  sx={{
                    mt: 5,
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
                  alignSelf: "center",
                  textAlign: "center",
                }}
              >
                <img
                  src={navLogo}
                  alt='Logo'
                  style={{
                    width: "75%",
                    height: "auto",
                  }}
                />
                <Typography
                  variant='body1'
                  sx={{
                    mt: 5,
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
