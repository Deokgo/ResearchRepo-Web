import React, { useState } from "react";
import homeBg from "../assets/home_bg.png";
import { useNavigate } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import placeholderImage from "../assets/placeholder_image.png";
import CAS from "../assets/CAS.jpg";
import CCIS from "../assets/CCIS.jpg";
import CHS from "../assets/CHS.jpg";
import ETYCB from "../assets/ETYCB.jpg";
import MITL from "../assets/MITL.jpg";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Navbar from "./navbar";
import LoginModal from "./loginmodal";
import SignupModal from "./signupmodal";
import PasswordResetModal from "./passresetmodal";
import DummyKG from "../assets/dummy_kg.png";
import {
  Box,
  Button,
  IconButton,
  Paper,
  Typography,
  useMediaQuery,
} from "@mui/material";

const Home = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width:600px)");
  const [isModalLoginOpen, setIsLoginModalOpen] = useState(false);
  const [isModalSignupOpen, setIsSignupModalOpen] = useState(false);
  const [isModalPassresetOpen, setIsPassresetModalOpen] = useState(false);

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
          color: "#FFF", // Set the arrow color to black
          position: "absolute",
          top: "50%",
          right: "-25px",
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
          color: "#FFF", // Set the arrow color to black
          position: "absolute",
          top: "50%",
          left: "-25px",
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
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    nextArrow: <NextArrow />, // Use custom NextArrow
    prevArrow: <PrevArrow />,
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };
  const handleOpenLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const handleCloseLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const handleOpenSignupModal = () => {
    setIsSignupModalOpen(true);
  };

  const handleCloseSignupModal = () => {
    setIsSignupModalOpen(false);
  };

  const handleOpenPassresetModal = () => {
    setIsPassresetModalOpen(true);
  };

  const handleClosePassresetModal = () => {
    setIsPassresetModalOpen(false);
  };

  const handleReadMore = () => {
    navigate("/readmore");
  };

  return (
    <>
      <Box
        sx={{
          // display: "flex",
          // height: "100vh",
          // width: "100vw",
          margin: 0,
          padding: 0,
        }}
      >
        <Navbar />
        <Box
          sx={{
            position: "relative",
            marginTop: { xs: "3.5rem", sm: "4rem", md: "6rem" },
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 4,
            flexGrow: 1,
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: { xs: "100%", md: "calc(100vh - 6rem)" },
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
              backgroundSize: "cover",
              opacity: 0.25, // 25% opacity for the background image
              zIndex: 1,
            }}
          />
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              zIndex: 2,
              width: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                zIndex: 2,
                width: "auto",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center",
                  width: "75rem",
                  mb: "3rem",
                  paddingLeft: "1em",
                }}
              >
                <Slider
                  {...settings}
                  style={{ width: isMobile ? "60%" : "95%" }}
                >
                  {departments.map((department) => (
                    <Box key={department.id} sx={{ px: 3 }}>
                      <Paper
                        elevation={3}
                        sx={{
                          padding: 2,
                          textAlign: "center",
                          width: { xs: "70%", md: "100%" },
                          height: "32rem",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "end",
                          backgroundImage: `url(${department.image})`,
                          backgroundSize: "cover",
                        }}
                      >
                        <Typography
                          variant='h5'
                          sx={{
                            fontWeight: 600,
                            fontFamily: "Montserrat, sans-serif",
                            color: "#FFF",
                            minHeight: "3rem",
                            lineHeight: 1.2,
                            textShadow: 10,
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          {department.name}
                        </Typography>
                      </Paper>
                    </Box>
                  ))}
                </Slider>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  gap: 7,
                  justifyContent: { xs: "center" },
                }}
              >
                <Button
                  variant='contained'
                  onClick={handleReadMore}
                  sx={{
                    backgroundColor: "#001C43",
                    color: "#FFF",
                    fontFamily: "Montserrat, sans-serif",
                    fontWeight: 600,
                    textTransform: "none",
                    fontSize: { xs: "0.875rem", md: "1.375rem" },
                    padding: { xs: "0.5rem 1rem", md: "1.5rem 2rem" },
                    borderRadius: "100px",
                    maxHeight: "3rem",
                  }}
                  flexItem
                >
                  Read More
                </Button>
                <Button
                  variant='contained'
                  key={"Get Started"}
                  onClick={() => handleOpenLoginModal(true)}
                  sx={{
                    backgroundColor: "#CA031B",
                    color: "#FFF",
                    fontFamily: "Montserrat, sans-serif",
                    fontWeight: 600,
                    textTransform: "none",
                    fontSize: { xs: "0.875rem", md: "1.375rem" },
                    padding: { xs: "0.5rem 1rem", md: "1.5rem 2rem" },
                    borderRadius: "100px",
                    maxHeight: "3rem",
                  }}
                  flexItem
                >
                  Get Started
                </Button>
              </Box>
            </Box>

            {/* Knowledge Graph */}
            <Box
              sx={{
                flex: 1,
                display: { xs: "none", md: "flex" },
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                alignSelf: "center",
              }}
            >
              <img
                src={DummyKG}
                alt='Dummy Knowledge Graph'
                style={{
                  width: "100%",
                  height: "auto",
                  objectFit: "contain",
                  paddingTop: "5rem",
                }}
              />
              <Typography
                variant='body1'
                sx={{
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 300,
                  fontSize: { xs: "1rem", md: "1.15rem" },
                  color: "#F0F0F0",
                  maxWidth: { xs: "100%", md: "80%" },
                  paddingTop: "5rem",
                  paddingLeft: "5rem",
                }}
              >
                A research platform for researchers, built by Mapúa MCL
                researchers
              </Typography>
            </Box>
          </Box>
        </Box>

        <LoginModal
          isOpen={isModalLoginOpen}
          handleClose={handleCloseLoginModal}
          handleOpenSignup={handleOpenSignupModal}
          handleOpenPassreset={handleOpenPassresetModal}
        />
        <SignupModal
          isOpen={isModalSignupOpen}
          handleClose={handleCloseSignupModal}
          handleOpenLogin={handleOpenLoginModal} // Pass function to open LoginModal after signup
        />
        <PasswordResetModal
          isOpen={isModalPassresetOpen}
          handleClose={handleClosePassresetModal}
          handleOpenLogin={handleOpenLoginModal}
        />
      </Box>
    </>
  );
};

export default Home;
