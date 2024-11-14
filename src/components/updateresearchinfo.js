import React, { useEffect, useState } from "react";
import Navbar from "./navbar";
import Footer from "./footer";
import {
  Box,
  Button,
  IconButton,
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
import { useLocation } from "react-router-dom";
import homeBg from "../assets/home_bg.png";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import axios from "axios";
import FileUploader from './FileUploader';

const UpdateResearchInfo = ({route,navigate}) => {
  const [users, setUsers] = useState([]);
  const navpage = useNavigate();
  const location = useLocation();
  const { id } = location.state || {}; // Default to an empty object if state is undefined
  const [data, setData] = useState(null); // Start with null to represent no data
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState("");
  const [loading, setLoading] = useState(true); // Track loading state

  useEffect(() => {
    if (id) {
        const fetchData = async () => {
            try {
                const response = await axios.get(`/dataset/fetch_ordered_dataset/${id}`);
                const fetchedDataset = response.data.dataset || []; // Use empty array if dataset is undefined
                console.log("Fetched data:", fetchedDataset);
                setData({ dataset: fetchedDataset });
            } catch (error) {
                console.error("Error fetching data:", error);
                setData({ dataset: [] }); // Set an empty dataset on error
            } finally {
                setLoading(false); // Stop loading regardless of success or failure
            }
        };
        fetchData();
    } else {
        console.warn("ID is undefined or null:", id);
        setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/accounts/users");
        const fetchedUsers = response.data.researchers;
        setUsers(fetchedUsers);
      } catch (error) {
        console.error("Error fetching data of users:", error);
      } finally {
      }
    };

    fetchUsers();
  }, []);

  const [value, setValue] = useState(null);

  const [file, setFile] = useState(null);

  const onSelectFileHandler = (e) => {
    setFile(e.target.files[0]);
  }
  
  const onDeleteFileHandler = () => {
  
  }
  const handleViewManuscript = async (researchItem) => {
    const { research_id } = researchItem;
    if (research_id) {
      try {
        // Make the API request to get the PDF as a Blob kasi may proxy issue if directly window.open, so padaanin muna natin kay axios
        const response = await axios.get(
          `/paper/view_manuscript/${research_id}`,
          {
            responseType: "blob", // Get the response as a binary Blob (PDF)
          }
        );

        // Create a URL for the Blob and open it in a new tab
        const blob = new Blob([response.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);

        // Open the PDF in a new tab
        window.open(url, "_blank");
      } catch (error) {
        console.error("Error fetching the manuscript:", error);
        alert("Failed to retrieve the manuscript. Please try again.");
      }
    } else {
      alert("No manuscript available for this research.");
    }
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
              marginBottom: 2,
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              padding: 4,
              gap: 4,
              backgroundSize: "cover",
              backgroundPosition: "center",
              height: { xs: "5rem", md: "6rem" },
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
                backgroundSize: "cover",
                opacity: 0.25,
                zIndex: 1,
              }}
            />
            
            <Box sx={{ display: "flex", flexDirection: "row", ml: "5rem", zIndex: 3 }}>
              <IconButton
                onClick={() => navpage(-1)}
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
                  fontSize: { xs: "1.5rem", sm: "2rem", md: "2.575rem" },
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
                }}
            >
              {/* Left-side Form Section*/}
                <Grid2 container sx={{ display: "flex", flexDirection: "flex-start", height: "100%"}}>
                    <Grid2 display="flex" size={9}>
                        <Box
                            sx={{
                                border: "2px solid #0A438F",
                                marginLeft: 10,
                                marginRight: 5,
                                padding: 3,
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
                                <Typography variant='body1' padding={1} sx={{ color: "#08397C" }}>Research Output Details:</Typography>                               
                                    <Grid2 container spacing={{ xs: 0, md: 3 }} sx={{ mb: "1rem" }}>   
                                      {data && data.dataset && data.dataset.length > 0 ? (
                                        data.dataset.map((item, index) => (                            
                                        <Box
                                          sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            width: "auto",
                                            padding: 1
                                          }}
                                        >
                                          <Typography variant='h3' fontWeight='700' sx={{ color: "#08397C", mb: "2rem" }} gutterBottom>
                                            {item.title}
                                          </Typography>
                                          <Typography variant='body1' sx={{ mb: "1rem" }}>
                                            <strong>College Department:</strong> {item.college_id}
                                          </Typography>
                                          <Typography variant='body1' sx={{ mb: "1rem" }}>
                                            <strong>Program:</strong> {item.program_name}
                                          </Typography>
                                          <Typography variant='body1' sx={{ mb: "1rem" }}>
                                            <strong>Authors:</strong>{" "}
                                            {item.concatenated_authors}
                                          </Typography>
                                          <Typography variant='body1' sx={{ mb: "1rem" }}>
                                            <strong>Abstract:</strong>{" "}
                                            {item.abstract || "No abstract available"}
                                          </Typography>
                                          <Typography variant='body1' sx={{ mb: "1rem" }}>
                                            <strong>Keywords:</strong>{" "}
                                            {item.concatenated_keywords ||
                                              "No keywords available"}
                                          </Typography>
                                          <Typography variant='body1' sx={{ mb: "1rem" }}>
                                            <strong>Journal:</strong>{" "}
                                            {item.journal}
                                          </Typography>
                                          <Typography variant='body1' sx={{ mb: "1rem" }}>
                                            <strong>Research Type:</strong>{" "}
                                            {item.research_type}
                                          </Typography>
                                          <Typography variant='body1' sx={{ mb: "1rem" }}>
                                            <strong>SDG:</strong>{" "}
                                            {item.sdg}
                                          </Typography>
                                          <Typography variant='body1' sx={{ mb: "1rem" }}>
                                            <strong>Year:</strong> {item.year}
                                          </Typography>
                                          <Typography variant='body1' sx={{ mb: "1rem" }}>
                                            <strong>Download Count:</strong> {item.download_count}
                                          </Typography>
                                          <Typography variant='body1' sx={{ mb: "1rem" }}>
                                            <strong>View Count:</strong> {item.view_count}
                                          </Typography>
                                          <Button 
                                            variant='contained'
                                            color='primary'
                                            sx={{
                                              backgroundColor: "#08397C",
                                              color: "#FFF",
                                              fontFamily: "Montserrat, sans-serif",
                                              fontWeight: 400,
                                              textTransform: "none",
                                              fontSize: { xs: "0.875rem", md: "1rem" },
                                              padding: { xs: "0.5rem 1rem", md: "1rem" },
                                              marginTop: "1rem",
                                              width: "13rem",
                                              borderRadius: "100px",
                                              maxHeight: "3rem",
                                              "&:hover": {
                                                backgroundColor: "#052045",
                                                color: "#FFF",
                                              },
                                            }}
                                            onClick={() => handleViewManuscript(item)}
                                          >
                                            View Manuscript
                                          </Button>
                                        </Box>
                                        ))
                                    ) : (
                                        <div>
                                            <p>No research information available.</p>
                                        </div>
                                    )}    
                                    </Grid2> 
                                <Divider orientation='horizontal' flexItem />
                                <Typography variant='body1' padding={1} sx={{ color: "#08397C" }}>Publication:</Typography>
                                <Grid2 container padding={1} spacing={{ xs: 0, md: 3 }}>
                                    <Grid2 item size={{ xs: 12, md: 3 }}>
                                    <TextField
                                        fullWidth
                                        label='Publication Name'
                                        name='publicationName'
                                        value={null}
                                        onChange={null}
                                        margin='normal'
                                        variant='outlined'
                                    ></TextField>
                                    </Grid2>
                                    <Grid2 item size={{ xs: 12, md: 3 }}>
                                    <TextField
                                        fullWidth
                                        label='Publication Format'
                                        name='publicationFormat'
                                        value={null}
                                        onChange={null}
                                        margin='normal'
                                        variant='outlined'
                                    ></TextField>
                                    </Grid2>
                                    <Grid2 item size={{ xs: 12, md: 3 }}>
                                    <TextField
                                        fullWidth
                                        label='Published Date'
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
                                        label='Scopus'
                                        name='scopus'
                                        value={null}
                                        onChange={null}
                                        margin='normal'
                                        variant='outlined'
                                    ></TextField>
                                    </Grid2>
                                    <Grid2 item size={{ xs: 12, md: 12 }}>
                                    <Typography variant='body1' sx={{ color: "#8B8B8B" }}>Upload Extended Abstract:</Typography>
                                      <Box
                                        sx={{
                                          display: "flex",
                                          alignItems: "center",
                                          border: "1px dashed #ccc",
                                          borderRadius: 1,
                                          p: 1,
                                          cursor: "pointer",
                                          justifyContent: "center",
                                          gap: 2,
                                          mb: 1
                                        }}
                                      >
                                        <FileUploader onSelectFile={onSelectFileHandler}
                                          onDeleteFile={onDeleteFileHandler} />
                                      </Box>
                                    </Grid2>
                                </Grid2>
                                <Divider orientation='horizontal' flexItem />
                                <Typography variant='body1' padding={1} sx={{ color: "#08397C" }}>Conference:</Typography>
                                <Grid2 container paddingLeft={1} spacing={{ xs: 0, md: 3 }}>
                                  <Grid2 item size={{ xs: 12, md: 12 }}>
                                      <Button 
                                        variant='text'
                                        color='primary'
                                        sx={{
                                          color: "#d4041d",
                                          fontFamily: "Montserrat, sans-serif",
                                          fontWeight: 400,
                                          textTransform: "none",
                                          fontSize: { xs: "0.875rem", md: "1rem" },
                                          width: "13rem",
                                          marginTop: "1rem",
                                          alignSelf: "center",
                                          borderRadius: "100px",
                                          maxHeight: "3rem",
                                          "&:hover": {
                                            color: "#A30417",
                                          },
                                        }}
                                      >
                                        + Add Conference
                                      </Button>
                                  </Grid2>
                                    
                                    <Grid2 item size={{ xs: 12, md: 6 }}>
                                    <TextField
                                        fullWidth
                                        label='Title'
                                        name='publicationName'
                                        value={null}
                                        onChange={null}
                                        margin='normal'
                                        variant='outlined'
                                    ></TextField>
                                    </Grid2>
                                    <Grid2 item size={{ xs: 12, md: 3 }}>
                                    <TextField
                                        fullWidth
                                        label='Venue'
                                        name='publicationFormat'
                                        value={null}
                                        onChange={null}
                                        margin='normal'
                                        variant='outlined'
                                    ></TextField>
                                    </Grid2>
                                    <Grid2 item size={{ xs: 12, md: 3 }}>
                                    <TextField 
                                        fullWidth
                                        label='Date'
                                        name='data'
                                        value={null}
                                        onChange={null}
                                        margin='normal'
                                        variant='outlined' 
                                    ></TextField>
                                    </Grid2>
                                </Grid2>
                                <Box
                                    sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "flex-end",
                                    marginTop: 5,
                                    }}
                                >
                                    <Button 
                                      variant='contained'
                                      color='primary'
                                      sx={{
                                        backgroundColor: "#08397C",
                                        color: "#FFF",
                                        fontFamily: "Montserrat, sans-serif",
                                        fontWeight: 400,
                                        textTransform: "none",
                                        fontSize: { xs: "0.875rem", md: "1.275rem" },
                                        padding: { xs: "0.5rem 1rem", md: "1.5rem" },
                                        marginTop: "1rem",
                                        width: "auto",
                                        borderRadius: "100px",
                                        maxHeight: "3rem",
                                        "&:hover": {
                                          backgroundColor: "#052045",
                                          color: "#FFF",
                                        },
                                      }}
                                    >
                                      Update Info
                                    </Button>
                                </Box>
                            </Box>
                            </form>
                        </Box>
                    </Grid2>

                    {/* Right-side Timeline Section*/}
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
                                        <TimelineDot variant={"outlined"} sx={{ borderColor: "#EC1F28", width: 20, height: 20}}/>
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
                                        <TimelineDot variant={"outlined"} sx={{ borderColor: "#EC1F28", width: 20, height: 20}}/>
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
                                        <TimelineDot sx={{ backgroundColor: '#EC1F28', width: 20, height: 20}}/>
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
                                        <TimelineDot sx={{ backgroundColor: '#EC1F28', width: 20, height: 20}}/>
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
                          variant='contained'
                          color='primary'
                          sx={{
                            backgroundColor: "#d40821",
                            color: "#FFF",
                            fontFamily: "Montserrat, sans-serif",
                            fontWeight: 400,
                            textTransform: "none",
                            fontSize: { xs: "0.875rem", md: "1.275rem" },
                            padding: { xs: "0.5rem 1rem", md: "1.5rem" },
                            marginTop: "1rem",
                            width: "auto",
                            borderRadius: "100px",
                            maxHeight: "3rem",
                            "&:hover": {
                                backgroundColor: "#A30417",
                                color: "#FFF",
                              },
                          }}
                        >
                          Update Status to: Accepted
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
