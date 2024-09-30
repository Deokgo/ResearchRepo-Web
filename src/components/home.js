import Menu from "@mui/icons-material/Menu";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  MenuItem,
  SvgIcon,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import React from "react";
import navLogo from "../assets/MMCL_Logo_Nav.png";

const Home = () => {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const pages = ["Home", "Communities & Collections", "Log in"];
  const settings = ["Home", "Communities & Collections", "Log in"];
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          height: "100vh",
          width: "100vw",
          margin: 0,
          padding: 0,
        }}
      >
        <AppBar
          position='static'
          sx={{ backgroundColor: "#FFF", height: "6rem" }}
        >
          <Box sx={{ margin: "0rem 3rem" }}>
            <Toolbar disableGutters>
              <IconButton>
                <img
                  src={navLogo}
                  style={{
                    width: "5rem",
                    height: "5rem",
                  }}
                ></img>
              </IconButton>
              <Divider
                orientation='vertical'
                flexItem
                sx={{ mx: 2, borderColor: "#D3D3D3" }}
              />
              <Typography
                variant='h6'
                noWrap
                component='a'
                href='#app-bar-with-responsive-menu'
                sx={{
                  mr: 1.5,
                  display: { xs: "none", md: "flex" },
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 600,
                  color: "#CA031B",
                  textDecoration: "none",
                }}
              >
                Institutional
              </Typography>
              <Typography
                variant='h6'
                noWrap
                component='a'
                href='#app-bar-with-responsive-menu'
                sx={{
                  mr: 2,
                  display: { xs: "none", md: "flex" },
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 600,
                  color: "#001C43",
                  textDecoration: "none",
                }}
              >
                Repository
              </Typography>
              <Box
                sx={{ ml: "auto", display: { xs: "none", md: "flex" }, gap: 3 }}
              >
                {pages.slice(0, 2).map((page) => (
                  <Button
                    key={page}
                    onClick={handleCloseNavMenu}
                    sx={{
                      my: 2,
                      color: "#001C43",
                      display: "block",
                      fontFamily: "Montserrat, sans-serif",
                      fontWeight: 600,
                    }}
                  >
                    {page}
                  </Button>
                ))}
                <Button
                  key={"Log in"}
                  onClick={handleCloseNavMenu}
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
              <Box sx={{ flexGrow: 0 }}>
                <Menu
                  sx={{ mt: "45px", display: { md: "none" } }}
                  id='menu-appbar'
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {settings.map((setting) => (
                    <MenuItem key={setting} onClick={handleCloseUserMenu}>
                      <Typography sx={{ textAlign: "center" }}>
                        {setting}
                      </Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            </Toolbar>
          </Box>
        </AppBar>
      </Box>
    </>
  );
};

export default Home;
