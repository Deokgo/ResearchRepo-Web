import React, { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
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
  AccordionSummary,
} from "@mui/material";
import placeholderImage from "../assets/placeholder_image.png";
import homeBg from "../assets/home_bg.png";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import InfoIcon from "@mui/icons-material/Info";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useModalContext } from "../context/modalcontext";
import HeaderWithBackButton from "../components/Header";

const ResearchThrust = () => {
  const [userData, setUserData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, logout } = useAuth();
  const isLoggedIn = !!user;
  const navigate = useNavigate();
  // Retrieve user_id from cookie/localStorage

  const { openLoginModal, closeLoginModal } = useModalContext();

  const handleLogin = () => {
    openLoginModal();
  };

  const departments = [
    {
      id: 1,
      name: "Mapúa Institute of Technology at Laguna",
      description:
        "The research thrusts of MITL are grouped into eight cluster areas constituting the eight\
      departments that make up the college. In each cluster, there are several areas that are\
      structured according to priority. These research thrusts and areas emphasize the\
      importance of innovation on the design of processes and technologies as well as\
      improvement of existing materials and processes to cater to the ever-increasing need of\
      society for sustainable products, processes, practices, and renewable resources.",
      image: placeholderImage, // Placeholder for image path
      programs: [
        {
          name: "BS Architecture",
          focusAreas:
            "The research thrusts of the Architecture Department are structured into two tracks or cluster areas namely: \
          Sustainable Design and Design Innovations. Under the umbrella of sustainable design are the following priorities: \
          Green architecture, Green Building, Sustainable Construction, formulation and adoption of sustainable materials in architectural \
          design, resilience architecture and, adaptive re-use of existing buildings, Under the design innovations track are the following \
          research priorities: alternative and innovative construction methods, user-behavior in architectural design, mathematics in \
          architecture (space syntax theory), design cognition and learning, building ventilation & diagnostics and, building utilities",
        },
        {
          name: "BS Chemical Engineering",
          focusAreas:
            "The Chemical Engineering discipline is devoted towards finding sustainable solutions to existing problems \
          through innovation and advancement in chemical and environmental processes and materials. The core research engagements are \
          in the following tracks: environmental processes and technology, polymeric materials and catalysis, chemical and biological sensors\
          energy and sustainability, process engineering and design, biotechnology",
        },
        {
          name: "BS Civil Engineering",
          focusAreas:
            "The Department of Civil Engineering shall engage in research towards s ustainable material utilization and management.\
          This is briefly subdivided in the following core research priorities: waste material utilization for development of light \
          construction materials, utility design model of structures for economy and sustainability, wastewater treatment, water resources & \
          purification",
        },
        {
          name: "BS Computer Engineering",
          focusAreas:
            "The Computer Engineering Department is geared on developing ubiquitous system solution and application towards emerging \
          computing trends. The focus of research shall be in the following fields: physical computing, human computer interaction, wearable \
          computer, ambient intelligence, sensor grid",
        },
        {
          name: "BS Electrical Engineering",
          focusAreas:
            "The Electrical Engineering Department has identified the following research opportunities for generation and delivery \
          of sustainable energy towards efficient utilization: alternative/renewable energy. The focus of research shall be in the following \
          fields: energy conversion, smart grid, power quality, equipment protection, instrumentation, automation & control.",
        },
        {
          name: "BS Electronics Engineering",
          focusAreas:
            "The Department of Electronics Engineering is dedicated towards development of innovative solutions through integration \
          of emerging electronic technologies. The core priorities for research shall be as follows: semiconductor and electronic design, \
          electronic and information technologies, smart systems, instrumentation and control systems, automated test development,automation \
          and robotics, electronic equipment for medical applications.",
        },
        {
          name: "BS Industrial Engineering",
          focusAreas:
            "The Industrial Engineering Department is engaged in research on continuous quality improvement through industrial \
          systems development. The fields of principal interest are the following: manufacturing & production systems, product innovation \
          quality & reliability engineering.",
        },
        {
          name: "BS Mechanical Engineering",
          focusAreas:
            "The Department of Mechanical Engineering is geared towards development of innovative processes and technologies for a \
          dynamic and efficient utilization of available energy resources. The core research interests are identified as follows: renewable \
          energy technologies, waste heat recovery systems, heating, ventilation & AC systems, bio-based fuel",
        },
        // Repeat for other programs...
      ],
    },
    {
      id: 2,
      name: "College of Computer and Information Science",
      description:
        "“Engineering Software towards Sustainable Quality Systems” - The College of Computer and Information Science (CCIS) identifies various fields of\
      specialization related to CS and IT programs that can be used to improve business, governance, learning, health, environment, and internet of things (IoT).\
      In the following areas: Business - development, implementation, application and improvement of business aplications and systems. Government - development \
      and application of emerging technologies to enable transparency, fight corruption, and monitor public service delivery. Learning - utilization, integration, \
      and assessment of technology in teaching/learning. Health - showcase technology-driven transformational approaches and solutions to solve the health care problems.\
      Environment - development and application of ICTs through the establishment of monitoring systems that can forecast and monitor the impact of natural and manmade\
      disasters. Internet of Things (IoT) - development and application of emerging technologies to connect objects around us to the Internet with minimum supervision",
      image: placeholderImage, // Placeholder for image path
      programs: [
        {
          name: "BS Computer Science",
          focusAreas:
            "The fields of specialization includes Algorithms, Computer Graphics and Animation, Machine Learning and Computer Vision, \
          Modeling and Simulation, Natural Language Processing, Pattern Recognition & Data Mining, and Software Engineering.",
        },
        {
          name: "BS Information Technology",
          focusAreas:
            "The fields of specialization includes Mobile Applications, Web Applications, Networked Systems, Multimedia Systems, and Game Development",
        },
        // Repeat for other programs...
      ],
    },
    {
      id: 3,
      name: "College of Arts and Science",
      description:
        "“Media in Social Development and Nation Building” -  \
      The College of Arts and Science (CAS) fosters interdisciplinary research aimed at addressing contemporary challenges in communication, \
      multimedia arts, and human interaction. With a strong focus on the social, cultural, and technological aspects of communication, CAS \
      engages in innovative projects that bridge the gap between theory and practice. Research initiatives are designed to enhance \
      understanding of how media, technology, and communication influence society, and how these fields can be harnessed for positive societal \
      transformation. The research agenda aligns with the broader goals of enhancing education, fostering creativity, and contributing to \
      global sustainable development.",
      image: placeholderImage, // Placeholder for image path
      programs: [
        {
          name: "BA Multimedia Arts",
          focusAreas:
            "The Multimedia Arts program shall be engaged in research on the use of multimedia \
          technologies for nation building. The fields and issues of interest are the following: visual \
          image studies, animation, multimedia technology, new media, game system, and other \
          industrial and social applications of multimedia.",
        },
        {
          name: "BA Communication",
          focusAreas:
            "The research initiatives of the Communication program shall focus on the application of \
          communication principles and techniques for social transformation. The specific areas of\
          study shall include the following: media and telecommunications, educational\
          communication, gender issues, development communication, and other industrial and\
          practical applications of communication.",
        },
        {
          name: "Science and Mathematics Cluster",
          focusAreas:
            "The Science and Mathematics clusters provide the foundational courses that support the\
          major subjects of the various disciplines. Their research focus would seek to expand the\
          understanding of scientific, mathematical, engineering, and statistical principles and their\
          integrated application to different fields of study. Research areas of interest include, but\
          are not limited to, science and math education, mathematical modelling, advanced\
          computational techniques, physics, chemistry, materials science and engineering,\
          environmental science, nanotechnology, electromagnetics, statics, dynamics, solid and\
          fluid mechanics.",
        },
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
          name: "BS Accountancy",
          focusAreas:
            "“Sustainability Accounting & Reporting” -  \
          Sustainability or sometimes referred to as corporate social responsibility is what is\
          commonly known as the “triple bottom line” consideration of 1) economic viability, 2)\
          social responsibility, and 3) environmental responsibility. The research thrust of the\
          college centers on how these aspects are considered by businesses in various parts of the\
          world and how these areas are accounted for, valued, and recognized in financial\
          statements.\n The areas of research includes Environmental, Social, Economic.",
        },
        {
          name: "BS Business Administration",
          focusAreas:
            "In response to the Institutional mission of “producing social wealth from the generation\
          of new knowledge and helping solve society’s problems by the expert application of \
          existing knowledge”, The Bachelor of Business Administration program is committed to\
          address environmental and societal concerns, sustainability, life and community\
          improvement, by providing innovative and technology-based products or services, and\
          social entrepreneurship thru business planning and research.",
        },
        {
          name: "BS Hotel & Restaurant Management",
          focusAreas:
            "“Sustainable Practices in Hotel, Restaurant and Culinary Operations” -  \
          The research thrust of the Hotel and Restaurant Management program focuses on\
          adopting sustainable practices to reduce the environmental, social, and economic impacts\
          of the hospitality industry. Areas of study are lodging and foodservice operations.",
        },
        {
          name: "BS Tourism Management",
          focusAreas:
            "The Tourism Management is geared towards developing a model for “Sustainable\
          Tourism Development Initiatives”. The research component identified as follows:\
          plan for promoting community participation, plan for developing sustainable marketing,\
          plan for developing sustainable tourism activities, plan for developing amenities, attraction\
          sites and plan for sustainable resources and environment.",
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
          name: "BS Biology",
          focusAreas:
            "The BS Biology program is structured as a generalized framework of study with the end\
        view of grounding students with the fundamental concepts, principles, and theories of the\
        biological, natural, and physical sciences and the conduct of research. The research areas include \
        but not limited to: Environmental and population health, Animal behavior, Cell and molecular biology \
        Ethnobotany, Biophysics, Microbiology, Bioentrepreneurship, Health professions education research \
        Education and technology research, Translational research",
        },
        {
          name: "BS Psychology",
          focusAreas:
            "The BS Psychology program is dedicated to fostering a dynamic learning environment that\
          empowers students and faculty members to engage in meaningful research endeavors.\
          The program has strategically identified a range of research thrust areas that encompass\
          various dimensions of psychological study. These research areas not only align with the\
          evolving landscape of psychology but also hold significant relevance to the holistic\
          development of students. Each of these research areas is chosen for its contemporary\
          significance and potential to drive positive societal change. By engaging in research within\
          these areas, students and faculty members alike contribute to the advancement of\
          psychological knowledge and practice. Furthermore, this diverse range of research areas\
          ensures that graduates are equipped to address a wide spectrum of psychological\
          challenges in their future careers. The research areas include the following: \
          Mental Health and Well-Being, Child and Developmental Psychology, Counseling and Clinical Psychology \
          Social and Cultural Psychology, Neuroscience and Cognitive Psychology, Organizational and Industrial Psychology \
          Positive Psychology, Psychological Measurement and Assessment, Psychology for Exceptional Children",
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
    setExpandedPanelProgram(false);
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
          height: "100%",
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
            height: "calc(100% - 6rem)",
          }}
        >
          <HeaderWithBackButton
            title='Research Thrusts'
            onBack={() => navigate(-1)}
          />

          {/* Content Section */}
          <Box
            sx={{
              display: "flex",
              padding: 5,
              marginLeft: 5,
              marginRight: 5,
              justifyContent: "space-around",
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
                  flexDirection: "column",
                }}
              >
                {departments.map((department) => (
                  <Box
                    key={department.id}
                    sx={{ m: { xs: "0.5rem", md: "0.75rem", lg: "1rem" } }}
                  >
                    <Accordion
                      expanded={expandedPanel === department.id}
                      onChange={handleAccordionChange(department.id)}
                    >
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography
                          variant='h5'
                          sx={{
                            padding: {
                              xs: "0.25rem",
                              md: "0.5rem",
                              lg: "0.75rem",
                            },
                            fontWeight: 700,
                            fontSize: {
                              xs: "0.8rem",
                              md: "0.9rem",
                              lg: "1.2rem",
                            },
                            fontFamily: "Montserrat, sans-serif",
                            color: "#CA031B",
                            "&:hover": {
                              color: "#A30417",
                            },
                          }}
                        >
                          {department.name}
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography
                          sx={{
                            paddingLeft: {
                              xs: "0.5rem",
                              md: "0.75rem",
                              lg: "1rem",
                            },
                            fontSize: {
                              xs: "0.7rem",
                              md: "0.8rem",
                              lg: "0.9rem",
                            },
                          }}
                        >
                          {department.description}
                        </Typography>
                        {!isLoggedIn ? (
                          <Button
                            onClick={handleLogin}
                            variant='text'
                            sx={{
                              mt: 3,
                              color: "#08397C",
                              fontFamily: "Montserrat, sans-serif",
                              fontWeight: 600,
                              paddingLeft: {
                                xs: "0.5rem",
                                md: "0.75rem",
                                lg: "1rem",
                              },
                              fontSize: {
                                xs: "0.7rem",
                                md: "0.8rem",
                                lg: "0.8rem",
                              },
                              "&:hover": {
                                color: "#072d61",
                              },
                            }}
                          >
                            Learn More &nbsp;<InfoIcon />
                          </Button>
                        ) : (
                          <Box>
                            <Divider sx={{ marginY: 2 }} />
                            {department.programs.map((program, index) => (
                              <Box sx={{ m: 2 }} key={index}>
                                <Accordion
                                  expanded={
                                    expandedPanelProgram === program.name
                                  }
                                  onChange={handleAccordionChangeProgram(
                                    program.name
                                  )}
                                >
                                  <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                  >
                                    <Typography
                                      variant='h6'
                                      sx={{
                                        fontWeight: 700,
                                        fontFamily: "Montserrat, sans-serif",
                                        color: "#08397C",
                                        ml: 2,
                                        fontSize: {
                                          xs: "0.75rem",
                                          md: "0.95rem",
                                          lg: "1.3rem",
                                        }, // Add responsive font sizes
                                        padding: {
                                          xs: "0.25rem",
                                          md: "0.5rem",
                                          lg: "0.75rem",
                                        }, // Add responsive padding
                                      }}
                                    >
                                      {program.name}
                                    </Typography>
                                  </AccordionSummary>
                                  <AccordionDetails>
                                    <Typography
                                      sx={{
                                        color: "#36454F",
                                        paddingLeft: {
                                          xs: "0.5rem",
                                          md: "0.75rem",
                                          lg: "1rem",
                                        },
                                        fontSize: {
                                          xs: "0.65rem",
                                          md: "0.85rem",
                                          lg: "1rem",
                                        },
                                      }}
                                    >
                                      {program.focusAreas}
                                    </Typography>
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
