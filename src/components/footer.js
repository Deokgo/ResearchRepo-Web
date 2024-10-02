// src/components/Footer.js

import { Box, Container, Divider, Typography } from "@mui/material";

const Footer = () => {
  return (
    <Box sx={{ backgroundColor: "#CA031B", color: "#FFF", py: 3, mt: 8 }}>
      <Container maxWidth='false'>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 3,
              alignItems: "center",
              justifyContent: "flex-start",
              flexDirection: { xs: "column", md: "row" }, // Stack vertically on mobile
              textAlign: { xs: "center", md: "left" },
            }}
          >
            <Typography
              variant='body2'
              sx={{
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 600,
                fontSize: { xs: "0.8rem", md: "1rem" },
              }}
            >
              © All Digital Rights Reserved 2024
            </Typography>
            <Divider
              orientation='vertical'
              sx={{
                height: "1.2rem",
                borderColor: "#FFF",
                borderWidth: "2px",
                display: { xs: "none", md: "inline-flex" },
              }}
            />
            <Typography
              variant='body2'
              sx={{
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 600,
                fontSize: { xs: "0.8rem", md: "1rem" },
                cursor: "pointer",
              }}
            >
              Contact Us
            </Typography>
            <Divider
              orientation='vertical'
              sx={{
                height: "1.2rem",
                borderColor: "#FFF",
                borderWidth: "2px",
                display: { xs: "none", md: "inline-flex" },
              }}
            />
            <Typography
              variant='body2'
              sx={{
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 600,
                fontSize: { xs: "0.8rem", md: "1rem" },
                cursor: "pointer",
              }}
            >
              Feedback
            </Typography>
          </Box>
          <Typography
            variant='body2'
            sx={{
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 600,
              fontSize: { xs: "0.8rem", md: "1rem" },
              justifyContent: "flex-end",
              textAlign: "right",
            }}
          >
            Mapúa Malayan Colleges Laguna
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
