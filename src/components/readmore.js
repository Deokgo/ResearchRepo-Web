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

  const fetchUserData = async () => {
    const userId = getUserId();
    if (userId) {
      try {
        const response = await axios.get(`/accounts/users/${userId}`);
        const data = response.data;
        setUserData(data);
        setFormValues({
          firstName: data.researcher.first_name || "",
          middleName: data.researcher.middle_name || "",
          lastName: data.researcher.last_name || "",
          suffix: data.researcher.suffix || "",
          department: data.researcher.college_id || "",
          program: data.researcher.program_id || "",
          email: data.account.email || "",
          role: data.account.role || "",
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
  };

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

  // Fetch user data on component mount
  useEffect(() => {
    fetchUserData();
  }, []);

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
              backgroundSize: "cover",
              backgroundPosition: "center",
              height: { xs: "5rem", md: "6rem" },
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
            <Box sx={{ display: "flex", ml: "12rem", zIndex: 3 }}>
              <IconButton
                onClick={() => navigate(-1)}
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
                  fontSize: { xs: "1.5rem", sm: "2rem", md: "2.575rem" },
                  color: "#FFF",
                  lineHeight: 1.25,
                  maxWidth: { xs: "100%", md: "100%" },
                  alignSelf: "center",
                  paddingLeft: 3,
                  zIndex: 2,
                }}
              >
                Read More
              </Typography>
            </Box>
          </Box>

          {/* Content Section */}
          <Box
            sx={{
              flexGrow: 1,
              mt: 12
            }}
          >
            <Grid2 container sx={{ paddingLeft: 25, height: "100%" }}>
              <Grid2 display="flex" flexDirection="column" justifyContent="flex-end" size={6}>
                <Typography
                    variant='h3'
                    sx={{
                        fontFamily: "Montserrat, sans-serif",
                        fontWeight: 600,
                        fontSize: { xs: "2.5rem", md: "4.375rem" },
                        color: "#001C43",
                        lineHeight: 1.25,
                        maxWidth: "80%",
                    }}
                >
                    A centralized hub for all your
                        <Box
                            sx={{
                                backgroundColor: "#DF031D",
                                width: "33rem"
                            }}
                        >
                            <Typography
                                align="center"
                                sx={{
                                    fontFamily: "Montserrat, sans-serif",
                                    fontWeight:600,
                                    fontSize: { xs: "2.5rem", md: "4rem" },
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
                    fontSize: { xs: "1rem", md: "1.5rem" },
                    color: "#001C43",
                    width: "80%",
                    mt: 4
                    }}
                >
                    A platform for researches by the Mapúa MCL researchers
                </Typography>      
                 
              </Grid2>
              <Grid2 display="flex" flexDirection="column" align="center" size={6}>
                <img
                    src={navLogo}
                    alt='Logo'
                    style={{
                        width: "80%",
                        height: "80%",
                        objectFit: "contain",
                    }}
                />
                <Typography
                    variant='body1'
                    sx={{
                    fontFamily: "Montserrat, sans-serif",
                    fontWeight: 300,
                    fontSize: { xs: "1rem", md: "1.25rem" },
                    color: "#001C43",
                    width: "80%",
                    mt: 6
                    }}
                >
                    Our research repository offers seamless platform to gather, store, analyze, and share valuable data and insights.
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
