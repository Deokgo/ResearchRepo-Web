import React, { useState } from "react";
import homeBg from "../assets/home_bg.png";
import { useNavigate } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import InfoIcon from '@mui/icons-material/Info';
import CAS from "../assets/CAS.jpg";
import CCIS from "../assets/CCIS.jpg";
import CHS from "../assets/CHS.jpg";
import ETYCB from "../assets/ETYCB.jpg";
import MITL from "../assets/MITL.jpg";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Navbar from "../components/navbar";
import LoginModal from "../components/loginmodal";
import SignupModal from "../components/signupmodal";
import PasswordResetModal from "../components/passresetmodal";
import DummyKG from "../assets/dummy_kg.png";
import { isMobile } from "react-device-detect";
import {
  Box,
  Button,
  IconButton,
  Paper,
  Typography,
  useMediaQuery,
  Grid2,
} from "@mui/material";
import { useModalContext } from "../context/modalcontext";

const Home = () => {
  const navigate = useNavigate();
  const isSizeMobile = useMediaQuery("(max-width:600px)");
  const { openLoginModal, openSignupModal, openPassresetModal } =
    useModalContext();

  const departments = [
    {
      id: 1,
      name: "Mapúa Institute of Technology at Laguna",
      description: "Leading the future of engineering and technology.",
      image: MITL, // Placeholder for image path
    },
    {
      id: 2,
      name: "College of Computer and Information Science",
      description: "Innovating through computer science and IT.",
      image: CCIS, // Placeholder for image path
    },
    {
      id: 3,
      name: "College of Arts and Science",
      description: "Fostering creativity and scientific knowledge.",
      image: CAS, // Placeholder for image path
    },
    {
      id: 4,
      name: "E.T. Yuchengco College of Business",
      description:
        "Amplifying student voices; nurturing student leaders — for success in today's business world.",
      image: ETYCB,
    }, // Placeholder for image path
    {
      id: 5,
      name: "College of Health Sciences",
      description:
        "Amplifying student voices; nurturing student leaders — for success in today's business world.",
      image: CHS,
    }, // Placeholder for image path
  ];
  const NextArrow = ({ onClick }) => {
    return (
      <IconButton
        onClick={onClick}
        sx={{
          color: "#FFF",
          position: "absolute",
          top: "50%",
          right: { xs: "5px", md: "-25px" },
          transform: "translateY(-50%)",
          zIndex: 2,
          backgroundColor: "rgba(0, 0, 0, 0.3)",
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          },
        }}
      >
        <ArrowForwardIosIcon />
      </IconButton>
    );
  };

  const PrevArrow = ({ onClick }) => {
    return (
      <IconButton
        onClick={onClick}
        sx={{
          color: "#FFF",
          position: "absolute",
          top: "50%",
          left: { xs: "5px", md: "-25px" },
          transform: "translateY(-50%)",
          zIndex: 2,
          backgroundColor: "rgba(0, 0, 0, 0.3)",
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          },
        }}
      >
        <ArrowBackIosIcon />
      </IconButton>
    );
  };
  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: (isMobile || isSizeMobile ? 3 : 1),
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  const darkenColor = (color, percent) => {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(255 * percent);
    const R = (num >> 16) - amt;
    const G = ((num >> 8) & 0x00ff) - amt;
    const B = (num & 0x0000ff) - amt;
    return `rgb(${Math.max(R, 0)}, ${Math.max(G, 0)}, ${Math.max(B, 0)})`;
  };
  

  const buttonStyle = (bgColor) => ({
    backgroundColor: bgColor,
    color: "#FFF",
    fontFamily: "Montserrat, sans-serif",
    fontWeight: 600,
    textTransform: "none",
    fontSize: { xs: "0.875rem", md: "1rem" },
    margin: "1rem",
    padding: "0.4rem 1.2rem",
    borderRadius: "100px",
    transition: "all 0.3s ease-in-out",
    "&:hover": {
      backgroundColor: darkenColor(bgColor, 0.15), // Slightly darker shade
      transform: "scale(1.05)", // Slight enlargement on hover
    },
  });

  const textStyle = {
    fontFamily: "Montserrat, sans-serif",
    fontWeight: 300,
    fontSize: { xs: "0.8rem", md: "1rem" },
    color: "#F0F0F0",
    textAlign: "center",
    mt: 3,
    px: 2,
  };

  const handleReadMore = () => {
    navigate("/readmore");
  };

  return (
    <>
      <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <Navbar />
        <Box m={3}>
            
          </Box>
        <Box
          sx={{
            flexGrow: 1,
            gap: 7,
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            backgroundColor: "#0A438F",
            padding: { xs: "3rem 1rem", md: "5rem 3rem" },
            alignItems: (isMobile && isSizeMobile ? "center" : "center"),
            justifyContent: (isMobile && isSizeMobile ? "center" : "flex-end"),
            position: "relative",
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
              opacity: 0.2,
              zIndex: 1,
            }}
          />
          <Box
            sx={{
              position: "relative",
              zIndex: 2,
              width: { xs: "90%", md: "60%" },
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                width: "100%",
                position: "relative",
                "& .slick-list": {
                  width: "100%",
                },
                "& .slick-dots": {
                  bottom: (isSizeMobile || isSizeMobile? { xs: "-20px", md: "-30px" } : { xs: "-10px", md: "-20px" }),
                },
              }}
            >
              <Slider {...settings}>
                {departments.map((department) => (
                  <Box key={department.id} sx={{ px: 4 }}>
                    <Paper
                      elevation={3}
                      sx={{
                        textAlign: "center",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        backgroundImage: `url(${department.image})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        height: { xs: "275px", md: "370px" },
                        width: "100%",
                        position: "relative",
                        borderRadius: "12px",
                      }}
                    >
                      <Box
                        sx={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          right: 0,
                          backgroundColor: "rgba(0,0,0,0.3)",
                          padding: 1.5,
                          borderBottomLeftRadius: "12px",
                          borderBottomRightRadius: "12px",
                        }}
                      >
                        <Typography
                          variant='h5'
                          sx={{
                            fontWeight: 600,
                            fontFamily: "Montserrat, sans-serif",
                            color: "#FFF",
                            lineHeight: 1,
                            textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
                            fontSize: {
                              xs: "0.7em",
                              sm: "0.8rem",
                              md: "0.9rem",
                              lg: "1rem",
                            },
                          }}
                        >
                          {department.name}
                        </Typography>
                      </Box>
                    </Paper>
                  </Box>
                ))}
              </Slider>
            </Box>
            <Box sx={{ display: "flex", gap: 2, justifyContent: "center", mt: 2 }}>
            <Button variant="contained" onClick={handleReadMore} sx={buttonStyle("#001C43")}>
              <InfoIcon sx={{ fontSize: { xs: "0.8rem", md: "1.25rem" } }}/> &nbsp;Read More
            </Button>
            <Button variant="contained" onClick={openLoginModal} sx={buttonStyle("#CA031B")}>
              Get Started <KeyboardArrowRightIcon sx={{ fontSize: { xs: "1rem", md: "1.5rem" } }}/>
            </Button>
          </Box>
          </Box>
          <Box
            sx={{
              position: "relative",
              zIndex: 2,
              width: {xs: "50%", md: "40%"},
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <img
              src={DummyKG}
              alt='Dummy Knowledge Graph'
              style={{ width: "100%", maxHeight: "100%", objectFit: "contain" }}
            />
            <Typography variant="body1" sx={textStyle}>
              A research platform for researchers, built by Mapúa MCL researchers.
            </Typography>
          </Box>
        </Box>

        <LoginModal
          isOpen={openLoginModal.isOpen}
          handleClose={openLoginModal.handleClose}
          handleOpenSignup={openSignupModal}
          handleOpenPassreset={openPassresetModal}
        />
        <SignupModal
          isOpen={openSignupModal.isOpen}
          handleClose={openSignupModal.handleClose}
          handleOpenLogin={openLoginModal}
        />
        <PasswordResetModal
          isOpen={openPassresetModal.isOpen}
          handleClose={openPassresetModal.handleClose}
          handleOpenLogin={openLoginModal}
        />
      </Box>
    </>
  );
};

export default Home;
