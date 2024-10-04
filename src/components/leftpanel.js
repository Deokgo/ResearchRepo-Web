import React from "react";
import { Box, Typography } from "@mui/material";
import logoImage from "../assets/mmcl_logo_white.png"; // path of the image
import homeBg from "../assets/home_bg.png";

const LeftPanel = () => {
  return (
    <Box
      sx={{
        position: "relative",
        backgroundColor: "#08397C",
        flex: 0.55,
        display: { xs: "none", md: "flex" },
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
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
      <img
        src={logoImage}
        alt='MMCL Logo'
        style={{ width: "30%", height: "auto" }}
        sx={{ zIndex: 2 }}
      />
      <Box
        sx={{
          zIndex: 2,
          backgroundColor: "#EC1F28",
          padding: "10px 20px",
          marginTop: "20px",
          borderRadius: "8rem",
        }}
      >
        <Typography
          variant='h2'
          sx={{
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 400,
            color: "#FFF",
            px: "3rem",
            fontSize: "1.5rem",
            letterSpacing: "0.1rem",
          }}
        >
          Institutional Repository
        </Typography>
      </Box>
    </Box>
  );
};

export default LeftPanel;
