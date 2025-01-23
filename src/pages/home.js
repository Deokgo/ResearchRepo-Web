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
import Navbar from "../components/navbar";
import LoginModal from "../components/loginmodal";
import SignupModal from "../components/signupmodal";
import PasswordResetModal from "../components/passresetmodal";
import DummyKG from "../assets/dummy_kg.png";
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
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
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
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          paddingTop: {
            xs: "3rem",
            sm: "4.5rem",
            md: "5rem",
          },
        }}
      >
        <Navbar />
        <Box
          sx={{
            position: "relative",
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 4,
            flexGrow: 1,
            backgroundPosition: "center",
            height: { xs: "calc(100vh - 3rem)", md: "calc(100vh - 5rem)" },
            backgroundColor: "#0A438F",
            padding: "5rem 2rem",
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
          <Box
            sx={{
              position: "relative",
              width: { xs: "100%", md: "60%" },
              zIndex: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              mt: { xs: 2, md: 0 },
            }}
          >
            <Box
              sx={{
                width: "100%",
                position: "relative",
                "& .slick-list": {
                  width: "100%",
                },
                "& .slick-slide": {
                  padding: { xs: "0.25rem", md: "1rem 12px" },
                },
                "& .slick-track": {
                  display: "flex",
                  alignItems: "center",
                },
                "& .slick-dots": {
                  bottom: { xs: "-30px", md: "-40px" },
                },
              }}
            >
              <Slider {...settings}>
                {departments.map((department) => (
                  <Box key={department.id} sx={{ px: 2 }}>
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
                        height: { xs: "300px", md: "30rem" },
                        width: "100%",
                        position: "relative",
                      }}
                    >
                      <Box
                        sx={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          right: 0,
                          backgroundColor: "rgba(256,256,256,0.1)",
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
                            textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
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
                gap: { xs: 2, md: 4 },
                justifyContent: "center",
                mt: { xs: 4, md: 2 },
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
              >
                Read More
              </Button>
              <Button
                variant='contained'
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
              >
                Get Started
              </Button>
            </Box>
          </Box>
          <Box
            sx={{
              position: "relative",
              width: { xs: "100%", md: "40%" },
              zIndex: 2,
              display: { xs: "none", md: "flex" },
              flexDirection: "column",
              alignItems: "center",
              mt: { xs: 2 },
            }}
          >
            <img
              src={DummyKG}
              alt='Dummy Knowledge Graph'
              style={{
                width: "100%",
                height: "auto",
                objectFit: "contain",
                maxHeight: "500px",
              }}
            />
            <Typography
              variant='body1'
              sx={{
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 300,
                fontSize: { xs: "1rem", md: "1.1rem" },
                color: "#F0F0F0",
                textAlign: "center",
                mt: 3,
                px: 2,
              }}
            >
              A research platform for researchers, built by Mapúa MCL
              researchers
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
