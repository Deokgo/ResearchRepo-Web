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
import InfoIcon from '@mui/icons-material/Info';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useModalContext } from "./modalcontext";

const ResearchThrust = () => {
  const [userData, setUserData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, logout } = useAuth();
  const isLoggedIn = !!user;
  const navigate = useNavigate();
  // Retrieve user_id from cookie/localStorage

  const {
    openLoginModal,
    closeLoginModal,
  } = useModalContext();

  const handleLogin = () => {
    openLoginModal();
  };

  const departments = [
    {
      id: 1,
      name: "Mapúa Institute of Technology at Laguna",
      description: "Mapúa Institute of Technology at Laguna (MITL) is committed to advancing research that addresses global challenges through sustainable development, technological innovation, and societal impact, in alignment with the United Nations \
      Sustainable Development Goals (SDGs). Its research agenda emphasizes interdisciplinary collaboration to create breakthrough solutions that enhance quality of life, drive economic growth, and protect the environment. Focus areas include green architecture,\
       renewable energy, intelligent systems, and advanced manufacturing processes, integrating sustainability and cutting-edge technologies to solve real-world problems. By fostering innovation and equipping students with transformative research opportunities, \
       MITL prepares them to become leaders who shape smarter, safer, and more sustainable communities.",
      image: placeholderImage, // Placeholder for image path
      programs: [
        {
          name: "Bachelor of Science in Architecture",
          focusAreas: [
            { title: "Sustainable Architecture & Urban Design", sdgs: [11, 13], description: "Eco-friendly buildings, energy-efficient urban spaces, and green architecture solutions." },
            { title: "Smart Cities and Digital Architecture", sdgs: [9, 11], description: "IoT and automation for intelligent urban environments." },
            { title: "Cultural and Environmental Heritage Preservation", sdgs: [11], description: "Preserving historical architecture while adopting modern, sustainable building practices." },
          ],
        },
        {
          name: "Bachelor of Science in Architecture",
          focusAreas: [
            { title: "Sustainable Architecture & Urban Design", sdgs: [11, 13], description: "Eco-friendly buildings, energy-efficient urban spaces, and green architecture solutions." },
            { title: "Smart Cities and Digital Architecture", sdgs: [9, 11], description: "IoT and automation for intelligent urban environments." },
            { title: "Cultural and Environmental Heritage Preservation", sdgs: [11], description: "Preserving historical architecture while adopting modern, sustainable building practices." },
          ],
        },
        {
          name: "Bachelor of Science in Architecture",
          focusAreas: [
            { title: "Sustainable Architecture & Urban Design", sdgs: [11, 13], description: "Eco-friendly buildings, energy-efficient urban spaces, and green architecture solutions." },
            { title: "Smart Cities and Digital Architecture", sdgs: [9, 11], description: "IoT and automation for intelligent urban environments." },
            { title: "Cultural and Environmental Heritage Preservation", sdgs: [11], description: "Preserving historical architecture while adopting modern, sustainable building practices." },
          ],
        },
        {
          name: "Bachelor of Science in Chemical Engineering",
          focusAreas: [
            { title: "Renewable Energy & Environmental Technologies", sdgs: [11, 13], description: "Eco-friendly buildings, energy-efficient urban spaces, and green architecture solutions." },
            { title: "Green Chemical Engineering", sdgs: [9, 11], description: "IoT and automation for intelligent urban environments." },
            { title: "Industrial Waste Treatment", sdgs: [12,6], description: "Preserving historical architecture while adopting modern, sustainable building practices." },
          ],
        },
        {
          name: "Bachelor of Science in Architecture",
          focusAreas: [
            { title: "Sustainable Architecture & Urban Design", sdgs: [11, 13], description: "Eco-friendly buildings, energy-efficient urban spaces, and green architecture solutions." },
            { title: "Smart Cities and Digital Architecture", sdgs: [9, 11], description: "IoT and automation for intelligent urban environments." },
            { title: "Cultural and Environmental Heritage Preservation", sdgs: [11], description: "Preserving historical architecture while adopting modern, sustainable building practices." },
          ],
        },
        {
          name: "Bachelor of Science in Architecture",
          focusAreas: [
            { title: "Sustainable Architecture & Urban Design", sdgs: [11, 13], description: "Eco-friendly buildings, energy-efficient urban spaces, and green architecture solutions." },
            { title: "Smart Cities and Digital Architecture", sdgs: [9, 11], description: "IoT and automation for intelligent urban environments." },
            { title: "Cultural and Environmental Heritage Preservation", sdgs: [11], description: "Preserving historical architecture while adopting modern, sustainable building practices." },
          ],
        },
        // Repeat for other programs...
      ],
    },
    {
      id: 2,
      name: "College of Computer and Information Science",
      description: "The College of Computer and Information Science (CCIS) is dedicated to advancing research in computing technologies that support innovation, security, and the development of solutions for complex global problems. With a focus on \
      interdisciplinary collaboration, CCIS research integrates computer science, data analytics, and information technology to provide actionable solutions that benefit industries and society. The college's research initiatives aim to push the boundaries \
      of digital technologies while emphasizing sustainability, cybersecurity, and intelligent systems for the future.",
      image: placeholderImage, // Placeholder for image path
      programs: [
        {
          name: "Bachelor of Science in Architecture",
          focusAreas: [
            { title: "Sustainable Architecture & Urban Design", sdgs: [11, 13], description: "Eco-friendly buildings, energy-efficient urban spaces, and green architecture solutions." },
            { title: "Smart Cities and Digital Architecture", sdgs: [9, 11], description: "IoT and automation for intelligent urban environments." },
            { title: "Cultural and Environmental Heritage Preservation", sdgs: [11], description: "Preserving historical architecture while adopting modern, sustainable building practices." },
          ],
        },
        {
          name: "Bachelor of Science in Architecture",
          focusAreas: [
            { title: "Sustainable Architecture & Urban Design", sdgs: [11, 13], description: "Eco-friendly buildings, energy-efficient urban spaces, and green architecture solutions." },
            { title: "Smart Cities and Digital Architecture", sdgs: [9, 11], description: "IoT and automation for intelligent urban environments." },
            { title: "Cultural and Environmental Heritage Preservation", sdgs: [11], description: "Preserving historical architecture while adopting modern, sustainable building practices." },
          ],
        },
        {
          name: "Bachelor of Science in Architecture",
          focusAreas: [
            { title: "Sustainable Architecture & Urban Design", sdgs: [11, 13], description: "Eco-friendly buildings, energy-efficient urban spaces, and green architecture solutions." },
            { title: "Smart Cities and Digital Architecture", sdgs: [9, 11], description: "IoT and automation for intelligent urban environments." },
            { title: "Cultural and Environmental Heritage Preservation", sdgs: [11], description: "Preserving historical architecture while adopting modern, sustainable building practices." },
          ],
        },
        {
          name: "Bachelor of Science in Chemical Engineering",
          focusAreas: [
            { title: "Renewable Energy & Environmental Technologies", sdgs: [11, 13], description: "Eco-friendly buildings, energy-efficient urban spaces, and green architecture solutions." },
            { title: "Green Chemical Engineering", sdgs: [9, 11], description: "IoT and automation for intelligent urban environments." },
            { title: "Industrial Waste Treatment", sdgs: [12,6], description: "Preserving historical architecture while adopting modern, sustainable building practices." },
          ],
        },
        {
          name: "Bachelor of Science in Architecture",
          focusAreas: [
            { title: "Sustainable Architecture & Urban Design", sdgs: [11, 13], description: "Eco-friendly buildings, energy-efficient urban spaces, and green architecture solutions." },
            { title: "Smart Cities and Digital Architecture", sdgs: [9, 11], description: "IoT and automation for intelligent urban environments." },
            { title: "Cultural and Environmental Heritage Preservation", sdgs: [11], description: "Preserving historical architecture while adopting modern, sustainable building practices." },
          ],
        },
        {
          name: "Bachelor of Science in Architecture",
          focusAreas: [
            { title: "Sustainable Architecture & Urban Design", sdgs: [11, 13], description: "Eco-friendly buildings, energy-efficient urban spaces, and green architecture solutions." },
            { title: "Smart Cities and Digital Architecture", sdgs: [9, 11], description: "IoT and automation for intelligent urban environments." },
            { title: "Cultural and Environmental Heritage Preservation", sdgs: [11], description: "Preserving historical architecture while adopting modern, sustainable building practices." },
          ],
        },
        // Repeat for other programs...
      ],
    },
    {
      id: 3,
      name: "College of Arts and Science",
      description: "The College of Arts and Science (CAS) fosters interdisciplinary research aimed at addressing contemporary challenges in communication, multimedia arts, and human interaction. With a strong focus on the social, cultural, and technological \
      aspects of communication, CAS engages in innovative projects that bridge the gap between theory and practice. Research initiatives are designed to enhance understanding of how media, technology, and communication influence society, and how these fields can be \
      harnessed for positive societal transformation. The research agenda aligns with the broader goals of enhancing education, fostering creativity, and contributing to global sustainable development.",
      image: placeholderImage, // Placeholder for image path
      programs: [
        {
          name: "Bachelor of Science in Architecture",
          focusAreas: [
            { title: "Sustainable Architecture & Urban Design", sdgs: [11, 13], description: "Eco-friendly buildings, energy-efficient urban spaces, and green architecture solutions." },
            { title: "Smart Cities and Digital Architecture", sdgs: [9, 11], description: "IoT and automation for intelligent urban environments." },
            { title: "Cultural and Environmental Heritage Preservation", sdgs: [11], description: "Preserving historical architecture while adopting modern, sustainable building practices." },
          ],
        },
        {
          name: "Bachelor of Science in Architecture",
          focusAreas: [
            { title: "Sustainable Architecture & Urban Design", sdgs: [11, 13], description: "Eco-friendly buildings, energy-efficient urban spaces, and green architecture solutions." },
            { title: "Smart Cities and Digital Architecture", sdgs: [9, 11], description: "IoT and automation for intelligent urban environments." },
            { title: "Cultural and Environmental Heritage Preservation", sdgs: [11], description: "Preserving historical architecture while adopting modern, sustainable building practices." },
          ],
        },
        {
          name: "Bachelor of Science in Architecture",
          focusAreas: [
            { title: "Sustainable Architecture & Urban Design", sdgs: [11, 13], description: "Eco-friendly buildings, energy-efficient urban spaces, and green architecture solutions." },
            { title: "Smart Cities and Digital Architecture", sdgs: [9, 11], description: "IoT and automation for intelligent urban environments." },
            { title: "Cultural and Environmental Heritage Preservation", sdgs: [11], description: "Preserving historical architecture while adopting modern, sustainable building practices." },
          ],
        },
        {
          name: "Bachelor of Science in Chemical Engineering",
          focusAreas: [
            { title: "Renewable Energy & Environmental Technologies", sdgs: [11, 13], description: "Eco-friendly buildings, energy-efficient urban spaces, and green architecture solutions." },
            { title: "Green Chemical Engineering", sdgs: [9, 11], description: "IoT and automation for intelligent urban environments." },
            { title: "Industrial Waste Treatment", sdgs: [12,6], description: "Preserving historical architecture while adopting modern, sustainable building practices." },
          ],
        },
        {
          name: "Bachelor of Science in Architecture",
          focusAreas: [
            { title: "Sustainable Architecture & Urban Design", sdgs: [11, 13], description: "Eco-friendly buildings, energy-efficient urban spaces, and green architecture solutions." },
            { title: "Smart Cities and Digital Architecture", sdgs: [9, 11], description: "IoT and automation for intelligent urban environments." },
            { title: "Cultural and Environmental Heritage Preservation", sdgs: [11], description: "Preserving historical architecture while adopting modern, sustainable building practices." },
          ],
        },
        {
          name: "Bachelor of Science in Architecture",
          focusAreas: [
            { title: "Sustainable Architecture & Urban Design", sdgs: [11, 13], description: "Eco-friendly buildings, energy-efficient urban spaces, and green architecture solutions." },
            { title: "Smart Cities and Digital Architecture", sdgs: [9, 11], description: "IoT and automation for intelligent urban environments." },
            { title: "Cultural and Environmental Heritage Preservation", sdgs: [11], description: "Preserving historical architecture while adopting modern, sustainable building practices." },
          ],
        },
        // Repeat for other programs...
      ],
    },
    {
      id: 4,
      name: "E.T. Yuchengco College of Business",
      description:
        "The E.T. Yuchengco College of Business is committed to fostering cutting-edge research that empowers future business leaders to navigate complex global markets. The research agenda of the college emphasizes innovation, sustainability, and the application of business \
        intelligence in real-world contexts. The research initiatives are designed to drive advancements in various business sectors, promote ethical practices, and contribute to the sustainable growth of industries.",
      image: placeholderImage,
      programs: [
        {
          name: "Bachelor of Science in Architecture",
          focusAreas: [
            { title: "Sustainable Architecture & Urban Design", sdgs: [11, 13], description: "Eco-friendly buildings, energy-efficient urban spaces, and green architecture solutions." },
            { title: "Smart Cities and Digital Architecture", sdgs: [9, 11], description: "IoT and automation for intelligent urban environments." },
            { title: "Cultural and Environmental Heritage Preservation", sdgs: [11], description: "Preserving historical architecture while adopting modern, sustainable building practices." },
          ],
        },
        {
          name: "Bachelor of Science in Architecture",
          focusAreas: [
            { title: "Sustainable Architecture & Urban Design", sdgs: [11, 13], description: "Eco-friendly buildings, energy-efficient urban spaces, and green architecture solutions." },
            { title: "Smart Cities and Digital Architecture", sdgs: [9, 11], description: "IoT and automation for intelligent urban environments." },
            { title: "Cultural and Environmental Heritage Preservation", sdgs: [11], description: "Preserving historical architecture while adopting modern, sustainable building practices." },
          ],
        },
        {
          name: "Bachelor of Science in Architecture",
          focusAreas: [
            { title: "Sustainable Architecture & Urban Design", sdgs: [11, 13], description: "Eco-friendly buildings, energy-efficient urban spaces, and green architecture solutions." },
            { title: "Smart Cities and Digital Architecture", sdgs: [9, 11], description: "IoT and automation for intelligent urban environments." },
            { title: "Cultural and Environmental Heritage Preservation", sdgs: [11], description: "Preserving historical architecture while adopting modern, sustainable building practices." },
          ],
        },
        {
          name: "Bachelor of Science in Chemical Engineering",
          focusAreas: [
            { title: "Renewable Energy & Environmental Technologies", sdgs: [11, 13], description: "Eco-friendly buildings, energy-efficient urban spaces, and green architecture solutions." },
            { title: "Green Chemical Engineering", sdgs: [9, 11], description: "IoT and automation for intelligent urban environments." },
            { title: "Industrial Waste Treatment", sdgs: [12,6], description: "Preserving historical architecture while adopting modern, sustainable building practices." },
          ],
        },
        {
          name: "Bachelor of Science in Architecture",
          focusAreas: [
            { title: "Sustainable Architecture & Urban Design", sdgs: [11, 13], description: "Eco-friendly buildings, energy-efficient urban spaces, and green architecture solutions." },
            { title: "Smart Cities and Digital Architecture", sdgs: [9, 11], description: "IoT and automation for intelligent urban environments." },
            { title: "Cultural and Environmental Heritage Preservation", sdgs: [11], description: "Preserving historical architecture while adopting modern, sustainable building practices." },
          ],
        },
        {
          name: "Bachelor of Science in Architecture",
          focusAreas: [
            { title: "Sustainable Architecture & Urban Design", sdgs: [11, 13], description: "Eco-friendly buildings, energy-efficient urban spaces, and green architecture solutions." },
            { title: "Smart Cities and Digital Architecture", sdgs: [9, 11], description: "IoT and automation for intelligent urban environments." },
            { title: "Cultural and Environmental Heritage Preservation", sdgs: [11], description: "Preserving historical architecture while adopting modern, sustainable building practices." },
          ],
        },
        // Repeat for other programs...
      ],
    }, 
    {
      id: 5,
      name: "College of Health Sciences",
      description:
        "The College of Health Sciences at MITL is dedicated to advancing research in health sciences that focuses on improving public health, healthcare practices, and quality of life. The research agenda of the college are designed to address pressing health challenges, \
        promote innovations in medical technologies, and contribute to the sustainability of healthcare systems. By collaborating with local and international health organizations, the college aims to produce research that not only impacts clinical practice but also enhances\
         the overall well-being of communities. The focus on sustainability and social impact drives research in disease prevention, health education, and healthcare equity.",
      image: placeholderImage,
      programs: [
        {
          name: "Bachelor of Science in Architecture",
          focusAreas: [
            { title: "Sustainable Architecture & Urban Design", sdgs: [11, 13], description: "Eco-friendly buildings, energy-efficient urban spaces, and green architecture solutions." },
            { title: "Smart Cities and Digital Architecture", sdgs: [9, 11], description: "IoT and automation for intelligent urban environments." },
            { title: "Cultural and Environmental Heritage Preservation", sdgs: [11], description: "Preserving historical architecture while adopting modern, sustainable building practices." },
          ],
        },
        {
          name: "Bachelor of Science in Architecture",
          focusAreas: [
            { title: "Sustainable Architecture & Urban Design", sdgs: [11, 13], description: "Eco-friendly buildings, energy-efficient urban spaces, and green architecture solutions." },
            { title: "Smart Cities and Digital Architecture", sdgs: [9, 11], description: "IoT and automation for intelligent urban environments." },
            { title: "Cultural and Environmental Heritage Preservation", sdgs: [11], description: "Preserving historical architecture while adopting modern, sustainable building practices." },
          ],
        },
        {
          name: "Bachelor of Science in Architecture",
          focusAreas: [
            { title: "Sustainable Architecture & Urban Design", sdgs: [11, 13], description: "Eco-friendly buildings, energy-efficient urban spaces, and green architecture solutions." },
            { title: "Smart Cities and Digital Architecture", sdgs: [9, 11], description: "IoT and automation for intelligent urban environments." },
            { title: "Cultural and Environmental Heritage Preservation", sdgs: [11], description: "Preserving historical architecture while adopting modern, sustainable building practices." },
          ],
        },
        {
          name: "Bachelor of Science in Chemical Engineering",
          focusAreas: [
            { title: "Renewable Energy & Environmental Technologies", sdgs: [11, 13], description: "Eco-friendly buildings, energy-efficient urban spaces, and green architecture solutions." },
            { title: "Green Chemical Engineering", sdgs: [9, 11], description: "IoT and automation for intelligent urban environments." },
            { title: "Industrial Waste Treatment", sdgs: [12,6], description: "Preserving historical architecture while adopting modern, sustainable building practices." },
          ],
        },
        {
          name: "Bachelor of Science in Architecture",
          focusAreas: [
            { title: "Sustainable Architecture & Urban Design", sdgs: [11, 13], description: "Eco-friendly buildings, energy-efficient urban spaces, and green architecture solutions." },
            { title: "Smart Cities and Digital Architecture", sdgs: [9, 11], description: "IoT and automation for intelligent urban environments." },
            { title: "Cultural and Environmental Heritage Preservation", sdgs: [11], description: "Preserving historical architecture while adopting modern, sustainable building practices." },
          ],
        },
        {
          name: "Bachelor of Science in Architecture",
          focusAreas: [
            { title: "Sustainable Architecture & Urban Design", sdgs: [11, 13], description: "Eco-friendly buildings, energy-efficient urban spaces, and green architecture solutions." },
            { title: "Smart Cities and Digital Architecture", sdgs: [9, 11], description: "IoT and automation for intelligent urban environments." },
            { title: "Cultural and Environmental Heritage Preservation", sdgs: [11], description: "Preserving historical architecture while adopting modern, sustainable building practices." },
          ],
        },
        // Repeat for other programs...
      ],
    }, 
  ];

  // State to track which accordion is currently expanded
  const [expandedPanel, setExpandedPanel] = useState(false);
  const [expandedPanelProgram, setExpandedPanelProgram] = useState(false);

  // Handler for accordion expansion
  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedPanel(isExpanded ? panel : false);
  };

  // Handler for accordion expansion
  const handleAccordionChangeProgram = (panel) => (event, isExpanded) => {
    setExpandedPanelProgram(isExpanded ? panel : false);
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
        }}
      >
        <Navbar />
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            marginTop: { xs: "3.5rem", sm: "4rem", md: "6rem" },
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
                    sm: "scale(0.75)",
                    md: "scale(0.75)"
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
                Research Thrust
              </Typography>
            </Box>
          </Box>
        
          {/* Content Section */}
          <Box
            sx={{
              display: "flex",
              padding: 5,
              marginLeft: 5,
              marginRight: 5,
              justifyContent: 'space-around',
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: 'column',
                }}
              >
                {departments.map((department) => (
                  <Box key={department.id} sx={{ m: { xs: "0.5rem", md: "0.75rem", lg: "1rem" } }}>
                    <Accordion
                      expanded={expandedPanel === department.id}
                      onChange={handleAccordionChange(department.id)}
                    >
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography
                          variant="h5"
                          sx={{
                            padding: { xs: "0.25rem", md: "0.5rem", lg: "0.75rem" },
                            fontWeight: 700,
                            fontSize: { xs: "0.75rem", md: "0.95rem", lg: "1.3rem" },
                            fontFamily: "Montserrat, sans-serif",
                            color: "#08397C",
                          }}
                        >
                          {department.name}
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography 
                          sx={{ 
                            paddingLeft: { xs: "0.5rem", md: "0.75rem", lg: "1rem" },
                            fontSize: { xs: "0.65rem", md: "0.85rem", lg: "1rem" },
                          }}
                        >
                          {department.description}</Typography>
                          {!isLoggedIn ? (
                            <Button
                              onClick={handleLogin}
                              variant='text'
                              sx={{
                                mt: 3,
                                color: "#CA031B",
                                fontFamily: "Montserrat, sans-serif",
                                fontWeight: 600,
                                paddingLeft: { xs: "0.5rem", md: "0.75rem", lg: "1rem" },
                                fontSize: { xs: "0.5rem", md: "0.75rem", lg: "1rem" },
                              }}
                            >
                              Learn More <InfoIcon/>
                            </Button>
                          ) : (
                            <Box>
                              <Divider sx={{ marginY: 2 }} />
                              {department.programs.map((program, index) => (
                                <Box sx={{m: 2}}>
                                  <Accordion 
                                    key={index}
                                    expanded={expandedPanelProgram === program.name}
                                    onChange={handleAccordionChangeProgram(program.name)}
                                  >
                                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                      <Typography
                                        variant="h6"
                                        sx={{
                                          fontWeight: 600,
                                          fontFamily: "Montserrat, sans-serif",
                                          color: "#08397C",
                                        }}
                                      >
                                        {program.name}
                                      </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                      {program.focusAreas.map((focus, idx) => (
                                        <Box key={idx} sx={{ marginBottom: 2 }}>
                                          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                                            {focus.title}
                                          </Typography>
                                          <Typography variant="body2" sx={{ paddingLeft: 2 }}>
                                            {focus.description} <br />
                                            <b>SDGs:</b> {focus.sdgs.join(", ")}
                                          </Typography>
                                        </Box>
                                      ))}
                                    </AccordionDetails>
                                  </Accordion>
                                </Box>
                              ))}
                            </Box>
                          )}
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
