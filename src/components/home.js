import React, { useState } from "react";
import homeBg from "../assets/home_bg.png";
import { useNavigate } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import placeholderImage from "../assets/placeholder_image.png";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Navbar from "./navbar";
import LoginModal from "./loginmodal";
import SignupModal from "./signupmodal";
import PasswordResetModal from "./passresetmodal";
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
      image: placeholderImage, // Placeholder for image path
    },
    {
      id: 2,
      name: "College of Computer and Information Science",
      description: "Innovating through computer science and IT.",
      image: placeholderImage, // Placeholder for image path
    },
    {
      id: 3,
      name: "College of Arts and Science",
      description: "Fostering creativity and scientific knowledge.",
      image: placeholderImage, // Placeholder for image path
    },
    {
      id: 4,
      name: "E.T. Yuchengco College of Business",
      description:
        "Amplifying student voices; nurturing student leaders — for success in today's business world.",
      image: placeholderImage,
    }, // Placeholder for image path
    {
      id: 5,
      name: "College of Health Sciences",
      description:
        "Amplifying student voices; nurturing student leaders — for success in today's business world.",
      image: placeholderImage,
    }, // Placeholder for image path
  ];
  const NextArrow = ({ onClick }) => {
    return (
      <IconButton
        onClick={onClick}
        sx={{
          color: "#CA031B", // Set the arrow color to black
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
          color: "#CA031B", // Set the arrow color to black
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
    speed: 500,
    slidesToShow: isMobile ? 1 : 1,
    slidesToScroll: 1,
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
                  width: "50rem",
                  mb: "1rem",
                  padding: "2em",
                }}
              >
                <Slider
                  {...settings}
                  style={{ width: isMobile ? "60%" : "70%" }}
                >
                  {departments.map((department) => (
                    <Box key={department.id} sx={{ px: 3 }}>
                      <Paper
                        elevation={3}
                        sx={{
                          padding: 2,
                          textAlign: "center",
                          width: { xs: "70%", md: "100%" },
                          height: "auto",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <img
                          src={department.image}
                          style={{
                            width: "50%",
                            height: "auto",
                            padding: "1em",
                          }}
                          alt={department.name}
                        />
                        <Typography
                          variant='h7'
                          sx={{
                            fontWeight: 600,
                            fontFamily: "Montserrat, sans-serif",
                            color: "#08397C",
                            minHeight: "3rem",
                            lineHeight: 1.2,
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
              <Typography
                variant='body1'
                sx={{
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 300,
                  fontSize: { xs: "1rem", md: "1.15rem" },
                  color: "#F0F0F0",
                  mb: 4,
                  maxWidth: { xs: "100%", md: "80%" },
                  alignSelf: "center",
                }}
              >
                A platform for researches by the Mapúa MCL researchers
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  gap: 7,
                  justifyContent: { xs: "center" },
                  marginTop: { xs: 0, md: "2rem" },
                }}
              >
                <Button
                  variant='contained'
                  sx={{
                    backgroundColor: "#001C43",
                    color: "#FFF",
                    fontFamily: "Montserrat, sans-serif",
                    fontWeight: 600,
                    textTransform: "none",
                    fontSize: { xs: "0.875rem", md: "1.375rem" },
                    padding: { xs: "0.5rem 1rem", md: "0.75rem 2rem" },
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
                    padding: { xs: "0.5rem 1rem", md: "0.75rem 2rem" },
                    borderRadius: "100px",
                    maxHeight: "3rem",
                  }}
                  flexItem
                >
                  Get Started
                </Button>
              </Box>
            </Box>
            <Box
              sx={{
                flex: 1,
                display: { xs: "none", md: "flex" },
                justifyContent: "center",
                alignItems: "center",
                zIndex: 2,
              }}
            >
              <Typography
                variant='body1'
                sx={{
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 600,
                  fontSize: { xs: "1rem", md: "1.15rem" },
                  color: "#F0F0F0",
                  mb: 4,
                  maxWidth: { xs: "100%", md: "80%" },
                  alignSelf: "center",
                }}
              >
                Knowledge Graph Here...
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
