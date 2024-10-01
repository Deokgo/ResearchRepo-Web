import MenuIcon from "@mui/icons-material/Menu";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  Grid2,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  SvgIcon,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import React from "react";
import navLogo from "../assets/MMCL_Logo_Nav.png";
import homeBg from "../assets/home_bg.png";
import heroImage from "../assets/hero_image.png";
import { useNavigate } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import placeholderImage from "../assets/placeholder_image.png";

const Home = () => {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const navigate = useNavigate();

  const pages = ["Home", "Communities & Collections", "Log in"];
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
  ];

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleLogin = () => {
    navigate("/login");
  };
  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? departments.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === departments.length - 1 ? 0 : prevIndex + 1
    );
  };
  const getVisibleDepartments = () => {
    const visibleDepartments = [];
    for (let i = 0; i < 3; i++) {
      visibleDepartments.push(
        departments[(currentIndex + i) % departments.length]
      );
    }
    return visibleDepartments;
  };

  return (
    <>
      <Box
        sx={{
          // display: "flex",
          // height: "100vh",
          // width: "100vw",
          margin: 0,
          padding: 0,
        }}
      >
        <AppBar
          position='fixed'
          sx={{
            backgroundColor: "#FFF",
            height: { xs: "3.5rem", sm: "4rem", md: "6rem" },
          }}
        >
          <Toolbar
            sx={{
              height: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconButton
                sx={{
                  p: 0,
                  width: { xs: "2.5rem", md: "5rem" },
                  height: { xs: "2.5rem", md: "5rem" },
                }}
              >
                <img
                  src={navLogo}
                  alt='Logo'
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              </IconButton>
              <Divider
                orientation='vertical'
                flexItem
                sx={{
                  mx: 2,
                  borderColor: "#CA031B",
                  height: { xs: "1.5rem", md: "2rem" },
                  borderWidth: "2px",
                  alignSelf: "center",
                }}
              />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  alignItems: "center",
                }}
              >
                <Typography
                  variant='h6'
                  component='a'
                  sx={{
                    fontFamily: "Montserrat, sans-serif",
                    fontWeight: 600,
                    color: "#CA031B",
                    fontSize: { xs: "1.2rem", md: "1.5rem" },
                    textAlign: { xs: "center", md: "inherit" },
                    mr: 1.5,
                  }}
                >
                  Institutional
                </Typography>
                <Typography
                  variant='h6'
                  component='a'
                  sx={{
                    fontFamily: "Montserrat, sans-serif",
                    fontWeight: 600,
                    color: "#001C43",
                    fontSize: { xs: "1.2rem", md: "1.5rem" },
                    textAlign: { xs: "center", md: "inherit" },
                    lineHeight: { xs: "1.2", md: "inherit" },
                  }}
                >
                  Repository
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                gap: 3,
              }}
            >
              {pages.slice(0, 2).map((page) => (
                <Button
                  key={page}
                  onClick={handleCloseNavMenu}
                  sx={{
                    my: 2,
                    color: "#001C43",
                    fontFamily: "Montserrat, sans-serif",
                    fontWeight: 600,
                  }}
                >
                  {page}
                </Button>
              ))}
              <Button
                key={"Log in"}
                onClick={handleLogin}
                sx={{
                  my: 2,
                  color: "#CA031B",
                  fontSize: "1rem",
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 600,
                }}
              >
                Log in
              </Button>
            </Box>
            <Box sx={{ display: { xs: "flex", md: "none" } }}>
              <IconButton
                size='large'
                aria-label='menu'
                aria-controls='menu-appbar'
                aria-haspopup='true'
                onClick={handleOpenNavMenu}
                sx={{ color: "#CA031B" }}
              >
                <MenuIcon />
              </IconButton>

              <Menu
                id='menu-appbar'
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
              >
                {pages.slice(0, 2).map((page) => (
                  <MenuItem key={page} onClick={handleCloseNavMenu}>
                    <Typography textAlign='center'>{page}</Typography>
                  </MenuItem>
                ))}
                <MenuItem
                  key='Log in'
                  onClick={() => {
                    handleLogin();
                    handleCloseNavMenu();
                  }}
                >
                  <Typography textAlign='center'>Log in</Typography>
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>
        <Box
          sx={{
            position: "relative",
            marginTop: { xs: "3.5rem", sm: "4rem", md: "6rem" },
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            padding: 4,
            gap: 4,
            flexGrow: 1,
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: { xs: "100%", md: "calc(100vh - 6rem)" },
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
              opacity: 0.25, // 25% opacity for the background image
              zIndex: 1,
            }}
          />
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              zIndex: 2,
              width: "100%",
            }}
          >
            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                zIndex: 2,
              }}
            >
              <Typography
                variant='h3'
                sx={{
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 800,
                  fontSize: { xs: "2.5rem", md: "4.375rem" },
                  color: "#FFF",
                  mb: 2,
                  lineHeight: 1.25,
                  maxWidth: "80%",
                  alignSelf: "center",
                }}
              >
                A centralized hub for all your research needs.
              </Typography>
              <Typography
                variant='body1'
                sx={{
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 500,
                  fontSize: { xs: "1rem", md: "1.25rem" },
                  color: "#F0F0F0",
                  mb: 4,
                  maxWidth: "80%",
                  alignSelf: "center",
                }}
              >
                Our research repository offers seamless platform to gather,
                store, analyze, and share valuable data and insights.
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  gap: 7,
                  justifyContent: { xs: "center", md: "flex-start" },
                  marginLeft: { xs: 0, md: "5rem" },
                }}
              >
                <Button
                  variant='contained'
                  sx={{
                    backgroundColor: "#001C43",
                    color: "#FFF",
                    fontFamily: "Montserrat, sans-serif",
                    fontWeight: 600,
                    textTransform: "none",
                    fontSize: { xs: "0.875rem", md: "1.375rem" },
                    padding: { xs: "0.5rem 1rem", md: "0.75rem 2rem" },
                    borderRadius: "8px",
                    maxHeight: "5rem",
                  }}
                  flexItem
                >
                  Read More
                </Button>
                <Button
                  variant='contained'
                  sx={{
                    backgroundColor: "#CA031B",
                    color: "#FFF",
                    fontFamily: "Montserrat, sans-serif",
                    fontWeight: 600,
                    textTransform: "none",
                    fontSize: { xs: "0.875rem", md: "1.375rem" },
                    padding: { xs: "0.5rem 1rem", md: "0.75rem 2rem" },
                    borderRadius: "8px",
                    maxHeight: "5rem",
                  }}
                  flexItem
                >
                  Get Started
                </Button>
              </Box>
            </Box>
            <Box
              sx={{
                flex: 1,
                display: { xs: "none", md: "flex" },
                justifyContent: "center",
                alignItems: "center",
                zIndex: 2,
              }}
            >
              <img
                src={heroImage}
                alt='Research Repository'
                style={{
                  width: "80%",
                  height: "auto",
                }}
              />
            </Box>
          </Box>
        </Box>
        <Box sx={{ mt: 8, textAlign: "center" }}>
          <Typography
            variant='h4'
            sx={{
              mb: 4,
              fontWeight: 800,
              color: "#0A438F",
              fontFamily: "Montserrat, sans-serif",
            }}
          >
            Communities & Collections
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 2,
            }}
          >
            <IconButton onClick={handlePrev}>
              <ArrowBackIosIcon />
            </IconButton>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                width: "75%",
                marginBottom: "5rem",
              }}
            >
              {getVisibleDepartments().map(
                (
                  department // this would create a paper for each dept
                ) => (
                  <Paper
                    elevation={3}
                    sx={{
                      padding: 2,
                      textAlign: "center",
                      width: "30%",
                      height: "auto",
                    }}
                    key={department.id}
                  >
                    <img
                      src={department.image}
                      style={{ width: "100%", height: "auto" }}
                      alt={department.name}
                    />
                    <Typography
                      variant='h6'
                      sx={{
                        fontWeight: 600,
                        fontFamily: "Montserrat, sans-serif",
                        color: "#08397C",
                      }}
                    >
                      {department.name}
                    </Typography>
                  </Paper>
                )
              )}
            </Box>
            <IconButton onClick={handleNext}>
              <ArrowForwardIosIcon />
            </IconButton>
          </Box>
        </Box>
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
      </Box>
    </>
  );
};

export default Home;
