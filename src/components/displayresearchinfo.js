import React, { useEffect, useState } from "react";
import Navbar from "./navbar";
import DynamicTimeline from "./Timeline";
import StatusUpdateButton from "./StatusUpdateButton";
import { CircularProgress } from "@mui/material";
import {
  Box,
  Button,
  IconButton,
  TextField,
  Typography,
  Grid2,
  Divider,
  Modal,
  MenuItem,
} from "@mui/material";
import Stack from '@mui/material/Stack';
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import homeBg from "../assets/home_bg.png";
import axios from "axios";
import FileUploader from "./FileUploader";

const DisplayResearchInfo = ({ route, navigate }) => {
  const [users, setUsers] = useState([]);
  const navpage = useNavigate();
  const location = useLocation();
  const [openModal, setOpenModal] = useState(false);
  const { id } = location.state || {}; // Default to an empty object if state is undefined
  const [data, setData] = useState(null); // Start with null to represent no data
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState("");
  const [loading, setLoading] = useState(true); // Track loading state

  const [conferenceTitle, setConferenceTitle] = useState("");
  const [singleCountry, setSingleCountry] = useState("");
  const [singleCity, setSingleCity] = useState("");
  const [countries, setCountries] = useState([]);
  const [Cities, setCities] = useState([]);
  const [dateApproved, setDateApproved] = useState("");

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          const response = await axios.get(
            `/dataset/fetch_ordered_dataset/${id}`
          );
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

  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [refreshTimeline, setRefreshTimeline] = useState(false); // Track refresh state

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await axios.get(`/track/next_status/${id}`); // Replace with your API endpoint
        console.log("API Response:", response.data); // Log the raw response (string)

        setStatus(response.data); // Directly set the response if it's a string
      } catch (err) {
        console.error(err);
        setError("Failed to fetch status.");
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, []);

  useEffect(() => {
    // Disable the button if the status is "PUBLISHED" or "PULLED OUT"
    if (status === "COMPLETED" || status === "PULLOUT" || status === "READY") {
      setIsButtonDisabled(true);
    } else {
      setIsButtonDisabled(false);
    }
  }, [status]);
  // Handle status update and refresh timeline
  const handleStatusUpdate = async (newStatus) => {
    try {
      // Make the status update request
      const response = await axios.post(`/track/research_status/${id}`, {
        status: newStatus,
      });

      if (response.status === 200 || response.status === 201) {
        // Toggle refresh to trigger timeline update
        setRefreshTimeline((prev) => !prev);

        // Fetch the next available status
        const nextStatusResponse = await axios.get(`/track/next_status/${id}`);
        setStatus(nextStatusResponse.data);
      }
    } catch (err) {
      console.error("Error updating status:", err);
      setError(err.response?.data?.message || "Failed to update status");
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

                <Box
                sx={{
                    display: "flex",
                    flexDirection: "row",
                    ml: "5rem",
                    zIndex: 3,
                }}
                >
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
                    Research Output Information
                </Typography>
                </Box>
            </Box>

            {/*Main Content */}
            <Box
                sx={{
                padding: 5,
                }}
            >
                <Grid2
                    container
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        height: "100%",
                    }}
                    size={12}
                >
                    <Box
                        sx={{
                            border: "2px solid #0A438F",
                            display: 'flex',
                            justifyContent:'center',
                            marginLeft: 10,
                            marginRight: 10,
                            padding: 4,
                            width: 'auto',
                            borderRadius: 3,
                        }}
                    >
                        {data && data.dataset && data.dataset.length > 0 ? (
                            data.dataset.map((item, index) => (
                            <Box>
                                <Grid2 container display='flex' flexDirection='column' justifyContent='center'>
                                <Typography
                                    variant='h3'
                                    alignSelf='center'
                                    textAlign="center"
                                    fontWeight='700'
                                    sx={{ color: "#08397C"}}
                                    gutterBottom
                                >
                                    {item.title}
                                </Typography>
                                <Typography 
                                    variant='h6' 
                                    sx={{ mb: "1rem" }} 
                                    alignSelf='center'
                                    fontWeight='600'
                                >
                                    {Array.isArray(item.authors)
                                    ? item.authors
                                        .map((author) => `${(author.name)}`)
                                        .join(", ")
                                    : "No authors available"}
                                </Typography>
                                <Typography
                                    variant='h7' 
                                    sx={{ mb: "1rem", color:"#8B8B8B"}} 
                                    alignSelf='center'
                                    fontWeight='500'
                                >
                                    {item.year}
                                </Typography>
                                </Grid2>

                                <Grid2 container display='flex' justifyContent='flex-end'>
                                <Stack direction="row" alignContent="center" gap={1}>
                                    <DownloadIcon color='primary'/>
                                    <Typography variant='h7' sx={{ mr: "2rem" }}>
                                    {item.download_count} Downloads
                                    </Typography>
                                </Stack>
                                <Stack direction="row" alignContent="center" gap={1}>
                                    <VisibilityIcon color='primary'/>
                                    <Typography variant='h7' sx={{ mr: "1rem" }}>
                                    {item.view_count} Views
                                    </Typography>
                                </Stack>
                                </Grid2>
                                
                                <Divider variant="middle" sx={{ mt: "1rem", mb: "2rem"}}/>

                                <Grid2 container display='flex' paddingLeft={2} paddingRight={2}>
                                <Grid2 size={8} paddingRight={10}>
                                    <Typography variant='h6' fontWeight='700' sx={{ mb: "1rem" }}>Keywords:</Typography>
                                    <Typography variant='body1'>
                                    {Array.isArray(item.keywords)
                                        ? item.keywords.join("; ")
                                        : "No keywords available"}
                                    </Typography>
                                    <Typography variant='h6' fontWeight='700' sx={{ mt: "2rem", mb: "1rem" }}>Abstract:</Typography>
                                    <Typography variant='body1'>
                                    {item.abstract || "No abstract available"}
                                    </Typography>
                                </Grid2>
                                <Grid2 size={4} justifyContent='flex-end'>
                                    <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        position: "relative",
                                        width: "auto",
                                        bgcolor: "#f0f0f0",
                                        borderRadius: 2,
                                        padding: 3,
                                        height: "auto",
                                    }}
                                    >
                                    <Typography variant='h7' sx={{ mb: "1rem" }}>
                                        <strong>College Department:</strong>{" "}
                                        {item.college_id}
                                    </Typography>
                                    <Typography variant='h7' sx={{ mb: "1rem" }}>
                                        <strong>Program:</strong>{" "}
                                        {item.program_name}
                                    </Typography>
                                    <Typography variant='body1' sx={{ mb: "1rem" }}>
                                        <strong>Adviser:</strong>{" "}
                                        {item.adviser
                                        ? `${item.adviser.name}`
                                        : "No adviser available"}
                                    </Typography>
                                    <Typography variant='body1' sx={{ mb: "1rem" }}>
                                        <strong>Panel Members:</strong>{" "}
                                        {Array.isArray(item.panels) &&
                                        item.panels.length > 0
                                        ? item.panels
                                            .map((panel) => `${panel.name}`)
                                            .join("; ")
                                        : "No panel members available"}
                                    </Typography>
                                    <Divider variant="middle" sx={{ mt: "1rem", mb: "1rem"}}/>
                                    <Typography variant='body1' sx={{ mb: "1rem" }}>
                                        <strong>Journal:</strong> {item.journal}
                                    </Typography>
                                    <Typography variant='body1' sx={{ mb: "1rem" }}>
                                        <strong>Research Type:</strong>{" "}
                                        {item.research_type}
                                    </Typography>
                                    <Typography variant='body1' sx={{ mb: "1rem" }}>
                                        <strong>SDG:</strong> {item.sdg}
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
                                        marginTop: "2rem",
                                        width: "13rem",
                                        alignSelf: "center",
                                        borderRadius: "100px",
                                        maxHeight: "3rem",
                                        "&:hover": {
                                            backgroundColor: "#072d61",
                                        },
                                        }}
                                        onClick={() => handleViewManuscript(item)}
                                    >
                                        View PDF
                                    </Button>
                                    </Box>               
                                </Grid2>
                                </Grid2>
                            </Box>
                            ))
                        ) : (
                            <div>
                            <p>No research information available.</p>
                            </div>
                        )}
                    </Box>
                </Grid2>             
            </Box>
        </Box>
      </Box>
    </>
  );
};

export default DisplayResearchInfo;
