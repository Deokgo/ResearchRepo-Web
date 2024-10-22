import React, { useEffect, useState } from "react";
import Navbar from "./navbar";
import Footer from "./footer";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
  Grid2,
  Divider,
} from "@mui/material";
import {
    Timeline,
    TimelineItem,
    TimelineSeparator,
    TimelineConnector,
    TimelineContent,
    TimelineDot,
} from "@mui/lab";
import TimelineOppositeContent, {
    timelineOppositeContentClasses,
  } from '@mui/lab/TimelineOppositeContent';
import { useNavigate } from "react-router-dom";
import homeBg from "../assets/home_bg.png";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import axios from "axios";

const UpdateResearchInfo = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState("");
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/accounts/users");
        const fetchedUsers = response.data.researchers;
        setUsers(fetchedUsers);
        setFilteredUsers(fetchedUsers);
      } catch (error) {
        console.error("Error fetching data of users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleNavigateHome = () => {
    navigate("/main");
  };

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredUsers(
      users.filter(
        (user) =>
          user.email.toLowerCase().includes(query) ||
          user.researcher_id.toLowerCase().includes(query)
      )
    );
  };
  const handleOpenModal = (user) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setOpenModal(true);
  };

  const handleSaveChanges = () => {
    console.log(
      "Saving changes for:",
      selectedUser.researcher_id,
      "New Role:",
      newRole
    );
    setOpenModal(false);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <Navbar />
        <Box
          sx={{
            flexGrow: 1,
            height: { xs: "100%", md: "calc(100vh - 9rem)" },
            marginTop: { xs: "3.5rem", sm: "4rem", md: "6rem" },
          }}
        >
          <Box
            sx={{
              position: "relative",
              display: "flex",
              flexDirection: { xs: "column", md: "column" },
              padding: 4,
              backgroundSize: "cover",
              backgroundPosition: "center",
              height: { xs: "5rem", md: "8rem" },
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
                opacity: 0.25,
                zIndex: 1,
              }}
            />
            
            <Box sx={{ display: "flex", flexDirection: "row", ml: "5rem", zIndex: 3 }}>
              <IconButton
                onClick={() => navigate(-1)}
                sx={{
                  color: "#fff",
                }}
              >
                <ArrowBackIosIcon></ArrowBackIosIcon>
              </IconButton>
              <Typography
                variant='h3'
                sx={{
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 800,
                  fontSize: { xs: "1.5rem", sm: "2rem", md: "3rem" },
                  color: "#FFF",
                  alignSelf: "center",
                  zIndex: 2,
                }}
              >
                Update Research Info
              </Typography>
            </Box>
          </Box>
          {/*Main Content */}
            <Box
                sx={{
                padding: 5,
                mb: 2,
                }}
            >
                <Grid2 container sx={{ display: "flex", flexDirection: "flex-start", height: "100%"}}>
                    <Grid2 display="flex" size={9}>
                        <Box
                            sx={{
                                border: "2px solid #0A438F",
                                padding: 2,
                                display: "flex",
                                flexDirection: "column",
                                height: "auto",
                                borderRadius: 3,
                            }}
                            >
                            <form onSubmit={null}>
                                <Box
                                sx={{
                                    width: "100%",
                                    justifyContent: "center",
                                }}
                                >
                                <Grid2 container padding={3} spacing={{ xs: 0, md: 2 }}>
                                    <Grid2 item size={{ xs: 12, md: 3 }}>
                                    <TextField
                                        fullWidth
                                        label='Research Code'
                                        name='research code'
                                        value={null}
                                        onChange={null}
                                        margin='normal'
                                        variant='outlined'
                                    ></TextField>
                                    </Grid2>
                                    <Grid2 item size={{ xs: 12, md: 6 }}>
                                    <TextField
                                        fullWidth
                                        label='Title'
                                        name='title'
                                        value={null}
                                        onChange={null}
                                        margin='normal'
                                        variant='outlined'
                                    ></TextField>
                                    </Grid2>
                                    <Grid2 item size={{ xs: 12, md: 3 }}>
                                    <TextField
                                        fullWidth
                                        label='Authors'
                                        name='authors'
                                        value={null}
                                        onChange={null}
                                        margin='normal'
                                        variant='outlined'
                                    ></TextField>
                                    </Grid2>
                                </Grid2>
                                <Divider orientation='horizontal' flexItem />
                                <Grid2 container padding={3} spacing={{ xs: 0, md: 2 }}>
                                    <Grid2 item size={{ xs: 12, md: 3 }}>
                                    <TextField
                                        fullWidth
                                        label='Publication Format'
                                        name='publicationformat'
                                        value={null}
                                        onChange={null}
                                        margin='normal'
                                        variant='outlined'
                                    ></TextField>
                                    </Grid2>
                                    <Grid2 item size={{ xs: 12, md: 3 }}>
                                    <TextField
                                        fullWidth
                                        label='Conference'
                                        name='conference'
                                        value={null}
                                        onChange={null}
                                        margin='normal'
                                        variant='outlined'
                                    ></TextField>
                                    </Grid2>
                                    <Grid2 item size={{ xs: 12, md: 3 }}>
                                    <TextField
                                        fullWidth
                                        label='Funding Agency'
                                        name='fundingagency'
                                        value={null}
                                        onChange={null}
                                        margin='normal'
                                        variant='outlined'
                                    ></TextField>
                                    </Grid2>
                                    <Grid2 item size={{ xs: 12, md: 3 }}>
                                    <TextField
                                        fullWidth
                                        label='Publisher'
                                        name='publisher'
                                        value={null}
                                        onChange={null}
                                        margin='normal'
                                        variant='outlined'
                                    ></TextField>
                                    </Grid2>
                                </Grid2>
                                <Divider orientation='horizontal' flexItem />
                                <Box
                                    sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "flex-end",
                                    p:4,
                                    marginTop: "20px",
                                    }}
                                >
                                    <Button
                                        fullWidth
                                        variant='contained'
                                        type='submit'
                                        sx={{
                                            maxWidth: "200px",
                                            marginTop: "20px",
                                            padding: "15px",
                                            borderRadius:100,
                                            backgroundColor: "#EC1F28",
                                        }}
                                    >
                                    Update Info
                                    </Button>
                                </Box>
                            </Box>
                            </form>
                        </Box>
                    </Grid2>
                    <Grid2 sx={{ display: "flex", flexDirection: "column", height: "100%"}} size={3}>
                        <Box
                            sx={{
                                border: "2px solid #0A438F",
                                display: "flex",
                                flexDIrection: "column",
                                padding: 2,
                                width: "100%",
                                height: "auto",
                                borderRadius: 3,
                            }}
                            >
                            <Timeline
                                sx={{
                                    alignContent: "center", 
                                    [`& .${timelineOppositeContentClasses.root}`]: {
                                    flex: 0.8,
                                    },
                                }}
                                >
                                <TimelineItem>
                                    <TimelineOppositeContent
                                    sx={{
                                        fontFamily: "Montserrat, sans-serif",
                                        fontSize: { md: "1rem" },
                                        alignItems: "center"
                                    }}
                                    > 
                                    </TimelineOppositeContent>

                                    <TimelineSeparator>
                                        <TimelineDot variant={"outlined"} sx={{ width: 20, height: 20}}/>
                                        <TimelineConnector sx={{ backgroundColor: '#EC1F28'}}/>
                                    </TimelineSeparator>

                                    <TimelineContent 
                                        sx={{
                                            fontFamily: "Montserrat, sans-serif",
                                            fontWeight: 600,
                                            fontSize: { md: "1.25rem" },
                                        }}
                                    > PUBLISHED
                                    </TimelineContent>
                                </TimelineItem>
                                <TimelineItem>
                                    <TimelineOppositeContent
                                    sx={{
                                        fontFamily: "Montserrat, sans-serif",
                                        fontSize: { md: "1rem" },
                                        alignItems: "center"
                                    }}
                                    > 
                                    </TimelineOppositeContent>

                                    <TimelineSeparator>
                                        <TimelineDot variant={"outlined"} sx={{ width: 20, height: 20}}/>
                                        <TimelineConnector sx={{ backgroundColor: '#EC1F28'}}/>
                                    </TimelineSeparator>

                                    <TimelineContent 
                                        sx={{
                                            fontFamily: "Montserrat, sans-serif",
                                            fontWeight: 600,
                                            fontSize: { md: "1.25rem" },
                                        }}
                                    > ACCEPTED
                                    </TimelineContent>
                                </TimelineItem>
                                <TimelineItem>
                                    <TimelineOppositeContent
                                    sx={{
                                        fontFamily: "Montserrat, sans-serif",
                                        fontSize: { md: "1rem" },
                                        alignItems: "center"
                                    }}
                                    > 2024-10-05
                                    </TimelineOppositeContent>

                                    <TimelineSeparator>
                                        <TimelineDot variant={"outlined"} sx={{ backgroundColor: '#EC1F28', width: 20, height: 20}}/>
                                        <TimelineConnector sx={{ backgroundColor: '#EC1F28'}}/>
                                    </TimelineSeparator>

                                    <TimelineContent 
                                        sx={{
                                            fontFamily: "Montserrat, sans-serif",
                                            fontWeight: 600,
                                            fontSize: { md: "1.25rem" },
                                        }}
                                    > SUBMITTED
                                    </TimelineContent>
                                </TimelineItem>
                                <TimelineItem>
                                    <TimelineOppositeContent
                                        sx={{
                                            fontFamily: "Montserrat, sans-serif",
                                            fontSize: { md: "1rem" },
                                        }}
                                    >   2024-10-10
                                    </TimelineOppositeContent>

                                    <TimelineSeparator>
                                        <TimelineDot variant={"outlined"} sx={{ backgroundColor: '#EC1F28', width: 20, height: 20}}/>
                                    </TimelineSeparator>

                                    <TimelineContent
                                        sx={{
                                            fontFamily: "Montserrat, sans-serif",
                                            fontWeight: 600,
                                            fontSize: { md: "1.25rem" },
                                        }}
                                    >   READY
                                    </TimelineContent>
                                </TimelineItem>
                            </Timeline>
                            
                        </Box>
                        <Button
                            fullWidth
                            variant='contained'
                            type='submit'
                            sx={{
                                width: "80%",
                                marginTop: "20px",
                                padding: "15px",
                                borderRadius:100,
                                backgroundColor: "#EC1F28",
                            }}
                        >
                        Update Status to: ACCEPTED
                        </Button>
                    </Grid2>
                </Grid2>
            </Box>
        </Box>
      </Box>
    </>
  );
};

export default UpdateResearchInfo;
