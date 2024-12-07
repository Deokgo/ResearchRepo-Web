import React, { useState, useEffect } from "react";
import Navbar from "./navbar";
import Footer from "./footer";
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
import navLogo from "../assets/MMCL_Logo_Horizontal.png";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "10px",
};

const ReadMore = () => {
  const [userData, setUserData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  // Retrieve user_id from cookie/localStorage
  const getUserId = () => {
    const userId = localStorage.getItem("user_id");
    return userId;
  };
  const [formValues, setFormValues] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    suffix: "",
    department: "",
    program: "",
    email: "",
    role: "",
  });

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

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
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
                lg: "clamp(4rem, 20vh, 5rem)"
              },
              backgroundColor: "#0A438F",
              backgroundSize: "cover",
              backgroundPosition: "center",
              display: "flex",
              alignItems: "center",
              zIndex: 1
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
                    md: "scale(1.2)"
                  }
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
                  zIndex: 2
                }}
              >
                Read More
              </Typography>
            </Box>
          </Box>

          {/* Content Section */}
          <Box sx={{ display:'flex', p: 10 }}>
            <Grid2 spacing={10} container>
              <Grid2
                display='flex'
                flexDirection='column'
                size={6}
              >
                <Typography
                  variant='h3'
                  sx={{
                    fontFamily: "Montserrat, sans-serif",
                    fontWeight: 600,
                    fontSize: { xs: "2rem", md: "3rem", lg: "4rem" },
                    color: "#001C43",
                    lineHeight: 1.25,
                    maxWidth: "100%",
                  }}
                >
                  A centralized hub for all your
                  <Box
                    sx={{
                      backgroundColor: "#DF031D",
                      width: { xs: "17rem", md: "25rem", lg: "33rem" },
                    }}
                  >
                    <Typography
                      align='center'
                      sx={{
                        fontFamily: "Montserrat, sans-serif",
                        fontWeight: 600,
                        fontSize: { xs: "2rem", md: "3rem", lg: "4rem" },
                        color: "#FFF",
                        lineHeight: 1.25,
                      }}
                    >
                      research needs
                    </Typography>
                  </Box>
                </Typography>
                <Typography
                  variant='body1'
                  sx={{
                    fontFamily: "Montserrat, sans-serif",
                    fontWeight: 500,
                    fontSize: { xs: "0.75rem", md: "0.75rem", lg: "1.2em" },
                    color: "#001C43",
                    width: "80%",
                    mt: 4,
                  }}
                >
                  A platform for researches by the Mapúa MCL researchers
                </Typography>
              </Grid2>
              <Grid2
                display='flex'
                flexDirection='column'
                align='center'
                size={6}
              >
                <img
                  src={navLogo}
                  alt='Logo'
                  style={{
                    width: { xs: "40%", md: "80%", lg: "60%" },
                    height: { xs: "40%", md: "80%", lg: "60%" },
                    objectFit: "contain",
                  }}
                />
                <Typography
                  variant='body1'
                  sx={{
                    fontFamily: "Montserrat, sans-serif",
                    fontWeight: 300,
                    fontSize: { xs: "0.75rem", md: "0.75rem", lg: "1.2em" },
                    color: "#001C43",
                    width: "80%",
                    mt: 6,
                  }}
                >
                  Our research repository offers seamless platform to gather,
                  store, analyze, and share valuable data and insights.
                </Typography>
              </Grid2>
            </Grid2>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default ReadMore;
