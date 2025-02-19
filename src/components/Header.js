import React from "react";
import { Box, Button, Typography } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import homeBg from "../assets/home_bg.png";
import newBG from "../assets/new_header_bg.png";

const HeaderWithBackButton = ({ title, onBack, backgroundImage }) => {
  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: {
          xs: "clamp(2rem, 3vh, 2rem)",
          sm: "clamp(3rem, 8vh, 2.75rem)",
          md: "clamp(3rem, 14vh, 2.75rem)",
          lg: "clamp(4rem, 20vh, 3.25rem)",
        },
        backgroundColor: "#0A438F",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        zIndex: 1,
        marginTop: {
          xs: "3rem",
          sm: "3rem",
          md: "4rem",
        },
      }}
    >
      {newBG && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url(${newBG})`,
            backgroundSize: "cover",
            opacity: 0.25,
            zIndex: 1,
          }}
        />
      )}
      <Box sx={{ display: "flex", ml: "5rem", zIndex: 3 }}>
        <Button
          onClick={onBack}
          sx={{
            color: "#fff",
            height: "inherit",
            transform: {
              xs: "scale(0.8)",
              sm: "scale(0.9)",
              md: "scale(1)",
            },
          }}
        >
          <ArrowBackIosIcon />
        </Button>
        <Typography
          variant='h3'
          sx={{
            py: 5,
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 800,
            fontSize: {
              xs: "clamp(1rem, 2vw, 1.25rem)",
              sm: "clamp(1.25rem, 3.5vw, 1.25rem)",
              md: "clamp(1.75rem, 4vw, 1.50rem)",
            },
            color: "#FFF",
            alignSelf: "center",
            zIndex: 2,
          }}
        >
          {title}
        </Typography>
      </Box>
    </Box>
  );
};

export default HeaderWithBackButton;
