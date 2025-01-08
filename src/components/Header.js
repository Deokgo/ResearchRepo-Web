import React from "react";
import { Box, IconButton, Typography } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import homeBg from "../assets/home_bg.png";

const HeaderWithBackButton = ({ title, onBack, backgroundImage }) => {
  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: {
          xs: "clamp(2rem, 3vh, 3rem)",
          sm: "clamp(3rem, 8vh, 4rem)",
          md: "clamp(3rem, 14vh, 4rem)",
          lg: "clamp(4rem, 20vh, 5rem)",
        },
        backgroundColor: "#0A438F",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        zIndex: 1,
      }}
    >
      {homeBg && (
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
      )}
      <Box sx={{ display: "flex", ml: "5rem", zIndex: 3 }}>
        <IconButton
          onClick={onBack}
          sx={{
            color: "#fff",
            transform: {
              xs: "scale(0.8)",
              sm: "scale(1)",
              md: "scale(1.2)",
            },
          }}
        >
          <ArrowBackIosIcon />
        </IconButton>
        <Typography
          variant="h3"
          sx={{
            py: 5,
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
