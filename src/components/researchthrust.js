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
  Accordion,
  AccordionDetails,
  AccordionSummary
} from "@mui/material";
import placeholderImage from "../assets/placeholder_image.png";
import homeBg from "../assets/home_bg.png";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from "axios";
import { useNavigate } from "react-router-dom";

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

const ResearchThrust = () => {
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

  // State to track which accordion is currently expanded
  const [expandedPanel, setExpandedPanel] = useState(false);

  // Handler for accordion expansion
  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedPanel(isExpanded ? panel : false);
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
                }}
              >
                <ArrowBackIosIcon />
              </IconButton>
              <Typography
                variant='h3'
                sx={{
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 800,
                  fontSize: { xs: "1.5rem", sm: "2rem", md: "2.575rem" },
                  color: "#FFF",
                  lineHeight: 1.25,
                  alignSelf: "center",
                  zIndex: 2,
                }}
              >
                Research Thrusts
              </Typography>
            </Box>
          </Box>
          
          {/* Content Section */}
          <Box
            sx={{
              display: "flex",
              padding: 5,
              justifyContent: 'space-around',
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Search Bar */}
              <TextField
                variant='outlined'
                placeholder='Search fields...'
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <Box
                sx={{
                  paddingTop: '2rem',
                  display: "flex",
                  flexDirection: 'column',
                }}
              >
                {departments.map((department) => (
                  <Box key={department.id} sx={{ m: 2 }}>
                    <Accordion
                     expanded={expandedPanel === department.id}
                     onChange={handleAccordionChange(department.id)}
                    >
                      <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                        <Typography
                          variant='h5'
                          sx={{
                            padding: 2,
                            fontWeight: 700,
                            fontFamily: "Montserrat, sans-serif",
                            color: "#08397C",
                            minHeight: "3rem",
                            lineHeight: 1.2,
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          {department.name}
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography
                          variant='h7'
                          sx={{
                            paddingLeft: 2,
                            fontWeight: 500,
                            fontFamily: "Montserrat, sans-serif",
                            minHeight: "3rem",
                            lineHeight: 1.2,
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          {department.description}
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default ResearchThrust;
