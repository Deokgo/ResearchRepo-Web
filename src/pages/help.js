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
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useModalContext } from "../context/modalcontext";
import HeaderWithBackButton from "../components/Header";

const Help = () => {
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
      answer: (
        <>
          <strong>To change password:</strong> <br />
          (1) Go to the [user icon] on the upper-right corner. A user menu will
          open, select [profile]. <br />
          (2) Under the profile tab, select [change password]. A small window
          will pop up to your screen, kindly input your old password and new
          password. For confirmation purposes, you need enter the new password
          twice. <br />
          (3) The click submit.
        </>
      ),
    },
    {
      id: 2,
      question: "Can I still log in again If I didn't log in for a long time?",
      answer:
        "Yes, you can still log in to your account as long as it has been active within the last six months \
        from your recent login. If more than six months have passed since your last login, your account \
        will be automatically inactive or require additional steps to regain access. If you experience any \
        issues, we recommend reaching out to our support team for assistance.",
    },
    {
      id: 3,
      question: "How to regain access to my inactive account?",
      answer: (
        <>
          <strong>
            If you experience any issues, please contact our support team for
            assistance:
          </strong>{" "}
          <br />
          📧 Email: support@example.com <br />
          📞 Phone: +69 (02) 0123-4567 <br />
          💬 Live Chat: Visit our support page
        </>
      ),
    },
  ];

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
          margin: 0,
          padding: 0,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <Navbar />
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            height: "calc(100% - 6rem)",
            overflow: "hidden",
          }}
        >
          <HeaderWithBackButton title='Help' onBack={() => navigate(-1)} />

          {/* Content Section */}
          <Box
            sx={{
              display: "flex",
              padding: 3,
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
                  m: 2,
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
                    sx={{ m: { xs: "0.5rem", md: "0.75rem", lg: "0.9rem" } }}
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
                              xs: "0.7rem",
                              md: "0.8rem",
                              lg: "0.9rem",
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
