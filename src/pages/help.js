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

const Help = () => {
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

  const faqs = [
    {
        id: 1,
        question: "How to change my password?",
        answer:
        "To change password, (1) go to the [user icon] on the upper-right corner. A user menu \
        will open, select [profile]. (2) Under the profile tab, select [change password]. A small window \
        will pop up to your screen, kindly input your old password and new password. For confirmation \
        purposes, you need enter the new password twice. (3) The click submit.",
    },
    {
        id: 2,
        question: "How to change my password?",
        answer:
            "To change password, (1) go to the [user icon] on the upper-right corner. A user menu \
            will open, select [profile]. (2) Under the profile tab, select [change password]. A small window \
            will pop up to your screen, kindly input your old password and new password. For confirmation \
            purposes, you need enter the new password twice. (3) The click submit.",
    },
    {
        id: 3,
        question: "How to change my password?",
        answer:
            "To change password, (1) go to the [user icon] on the upper-right corner. A user menu \
            will open, select [profile]. (2) Under the profile tab, select [change password]. A small window \
            will pop up to your screen, kindly input your old password and new password. For confirmation \
            purposes, you need enter the new password twice. (3) The click submit.",
    }
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
            marginTop: { xs: "3.5rem", sm: "4rem", md: "5rem" },
            height: {
              xs: "calc(100vh - 3.5rem)",
              sm: "calc(100vh - 4rem)",
              md: "calc(100vh - 6rem)",
            },
          }}
        >
          <HeaderWithBackButton
            title="Help"
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
                <Typography
                    variant='body1'
                    sx={{
                        m:3,
                        fontWeight: 400,
                        fontSize: { xs: "0.7rem", sm: "0.8rem", md: "1rem" },
                        color: "#001C43",
                    }}
                >
                    Here are the list of 'Frequently Asked Questions' (FAQs):
                </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {faqs.map((faq) => (
                  <Box
                    key={faq.id}
                    sx={{ m: { xs: "0.5rem", md: "0.75rem", lg: "1rem" } }}
                  >
                    <Accordion
                      expanded={expandedPanel === faq.id}
                      onChange={handleAccordionChange(faq.id)}
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
                              xs: "0.75rem",
                              md: "0.95rem",
                              lg: "1.3rem",
                            },
                            fontFamily: "Montserrat, sans-serif",
                            color: "#CA031B",
                            "&:hover": {
                              color: "#A30417",
                            },
                          }}
                        >
                          {faq.question}
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
                              xs: "0.65rem",
                              md: "0.85rem",
                              lg: "1rem",
                            },
                          }}
                        >
                          {faq.answer}
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

export default Help;
