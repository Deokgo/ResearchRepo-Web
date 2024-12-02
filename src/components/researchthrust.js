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
      description: "Mapúa Institute of Technology at Laguna (MITL) is committed to advancing research that addresses global challenges through sustainable development, technological innovation, and societal impact, in alignment with the United Nations \
      Sustainable Development Goals (SDGs). Its research agenda emphasizes interdisciplinary collaboration to create breakthrough solutions that enhance quality of life, drive economic growth, and protect the environment. Focus areas include green architecture,\
       renewable energy, intelligent systems, and advanced manufacturing processes, integrating sustainability and cutting-edge technologies to solve real-world problems. By fostering innovation and equipping students with transformative research opportunities, \
       MITL prepares them to become leaders who shape smarter, safer, and more sustainable communities.",
      image: placeholderImage, // Placeholder for image path
    },
    {
      id: 2,
      name: "College of Computer and Information Science",
      description: "The College of Computer and Information Science (CCIS) is dedicated to advancing research in computing technologies that support innovation, security, and the development of solutions for complex global problems. With a focus on \
      interdisciplinary collaboration, CCIS research integrates computer science, data analytics, and information technology to provide actionable solutions that benefit industries and society. The college's research initiatives aim to push the boundaries \
      of digital technologies while emphasizing sustainability, cybersecurity, and intelligent systems for the future.",
      image: placeholderImage, // Placeholder for image path
    },
    {
      id: 3,
      name: "College of Arts and Science",
      description: "The College of Arts and Science (CAS) fosters interdisciplinary research aimed at addressing contemporary challenges in communication, multimedia arts, and human interaction. With a strong focus on the social, cultural, and technological \
      aspects of communication, CAS engages in innovative projects that bridge the gap between theory and practice. Research initiatives are designed to enhance understanding of how media, technology, and communication influence society, and how these fields can be \
      harnessed for positive societal transformation. The research agenda aligns with the broader goals of enhancing education, fostering creativity, and contributing to global sustainable development.",
      image: placeholderImage, // Placeholder for image path
    },
    {
      id: 4,
      name: "E.T. Yuchengco College of Business",
      description:
        "The E.T. Yuchengco College of Business is committed to fostering cutting-edge research that empowers future business leaders to navigate complex global markets. The research agenda of the college emphasizes innovation, sustainability, and the application of business \
        intelligence in real-world contexts. The research initiatives are designed to drive advancements in various business sectors, promote ethical practices, and contribute to the sustainable growth of industries.",
      image: placeholderImage,
    }, // Placeholder for image path
    {
      id: 5,
      name: "College of Health Sciences",
      description:
        "The College of Health Sciences at MITL is dedicated to advancing research in health sciences that focuses on improving public health, healthcare practices, and quality of life. The research agenda of the college are designed to address pressing health challenges, \
        promote innovations in medical technologies, and contribute to the sustainability of healthcare systems. By collaborating with local and international health organizations, the college aims to produce research that not only impacts clinical practice but also enhances\
         the overall well-being of communities. The focus on sustainability and social impact drives research in disease prevention, health education, and healthcare equity.",
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
