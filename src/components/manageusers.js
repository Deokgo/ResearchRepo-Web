import React from "react";
import Navbar from "./navbar";
import Footer from "./footer";
import { Box, IconButton, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import homeBg from "../assets/home_bg.png";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

const ManageUsers = () => {
  const navigate = useNavigate();
  const handleNavigateHome = () => {
    navigate("/home");
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <Navbar />
        <Box sx={{ flexGrow: 1 }}>
          <Box
            sx={{
              position: "relative",
              marginTop: { xs: "3.5rem", sm: "4rem", md: "6rem" },
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              padding: 4,
              gap: 4,
              backgroundSize: "cover",
              backgroundPosition: "center",
              height: { xs: "5rem", md: "8rem" },
              backgroundColor: "#0A438F",
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
            <Box sx={{ display: "flex", ml: "5rem", zIndex: 3 }}>
              <IconButton
                onClick={handleNavigateHome}
                sx={{
                  color: "#fff",
                }}
              >
                <ArrowBackIosIcon></ArrowBackIosIcon>
              </IconButton>
              <Typography
                variant='h3'
                sx={{
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 800,
                  fontSize: { xs: "2rem", sm: "2.5rem", md: "4.375rem" },
                  color: "#FFF",
                  mb: 2,
                  lineHeight: 1.25,
                  alignSelf: "center",
                  zIndex: 2,
                }}
              >
                Manage Users
              </Typography>
            </Box>
          </Box>
        </Box>
        <Footer />
      </Box>
    </>
  );
};

export default ManageUsers;
