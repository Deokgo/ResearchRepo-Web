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
  Grid2
} from "@mui/material";
import { useModalContext } from "./modalcontext";

const Home = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width:600px)");
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
    slidesToShow: 1, // Add this line to explicitly set the number of slides to show
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    nextArrow: <NextArrow />, // Use custom NextArrow
    prevArrow: <PrevArrow />,
  };

  const buttonStyles = {
    fontSize: 'clamp(0.8rem, 3vw, 1.2rem)', // Responsive font size
    padding: '0.5rem 1.5rem', // Consistent padding
    minWidth: '100px', // Minimum width
    borderRadius: '50px', // Rounded corners
    transition: 'transform 0.2s ease', // Smooth interaction
    
    '&:hover': {
      transform: 'scale(1.05)' // Slight grow on hover
    },
    
    '&:active': {
      transform: 'scale(0.95)' // Slight shrink when pressed
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const handleReadMore = () => {
    navigate("/readmore");
  };

  return (
    <>
      <Box
        sx={{
          margin: 0,
          padding: 0,
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
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
              zIndex: 2,
            }}
          />
          <Box
            sx={{
              position: 'relative',
              width: "100%",
              zIndex: 2,
              padding: { xs: 2, md: 4 },
            }}
          >
            <Grid2 
              container
              spacing={2}
              sx={{
                height: "100%",
                flexWrap: "nowrap",
              }}
            >
              <Grid2 size={9}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center",
                    mt: "1rem",
                    mb: "3rem",
                    paddingLeft: "1rem",
                    width: "100%", // Ensure full width
                    "& .slick-list": {
                      width: "100%", // Ensure slider list takes full width
                    },
                    "& .slick-slide": {
                      padding: "0 10px", // Add some padding between slides
                    },
                  }}
                >
                  <Slider
                    {...settings}
                    style={{ width:"100%" }}
                  >
                    {departments.map((department) => (
                      <Box key={department.id} sx={{ px: 1 }}>
                        <Paper
                          elevation={3}
                          sx={{
                            textAlign: "center",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "end",
                            backgroundImage: `url(${department.image})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            height: { xs: "300px", md: "400px" }, // Set a consistent height
                            width: "100%", // Ensure full width
                            position: "relative", // Add this for better positioning
                          }}
                        >
                          <Box
                            sx={{
                              position: 'absolute',
                              bottom: 0,
                              left: 0,
                              right: 0,
                              backgroundColor: 'rgba(256,256,256,0.1)', // Semi-transparent background for text
                              padding: 2,
                            }}
                            >
                            <Typography
                              variant='h5'
                              sx={{
                                fontWeight: 600,
                                fontFamily: "Montserrat, sans-serif",
                                color: "#FFF",
                                lineHeight: 1.2,
                                textShadow: '1px 1px 2px rgba(0,0,0,0.5)', // Add text shadow for better readability
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
                      fontSize: { xs: "0.875rem", md: "1rem" },
                      padding: { xs: "0.5rem 1rem", md: "1.5rem" },
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
                    onClick={openLoginModal}
                    sx={{
                      backgroundColor: "#CA031B",
                      color: "#FFF",
                      fontFamily: "Montserrat, sans-serif",
                      fontWeight: 600,
                      textTransform: "none",
                      fontSize: { xs: "0.875rem", md: "1rem" },
                      padding: { xs: "0.5rem 1rem", md: "1.5rem" },
                      borderRadius: "100px",
                      maxHeight: "3rem",
                    }}
                    flexItem
                  >
                    Get Started
                  </Button>
                </Box>
              </Grid2>
              <Grid2 size={3}>
                {/* Knowledge Graph */}
                <Box
                  sx={{
                    flex: 2,
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
                      fontSize: { xs: "1rem", md: "1rem" },
                      color: "#F0F0F0",
                      maxWidth: { xs: "100%", md: "80%" },
                      py: 15
                    }}
                  >
                    A research platform for researchers, built by Mapúa MCL
                    researchers
                  </Typography>
                </Box>
              </Grid2>
            </Grid2>
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
          handleOpenLogin={openLoginModal} // Pass function to open LoginModal after signup
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
