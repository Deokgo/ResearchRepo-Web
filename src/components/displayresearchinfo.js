import React, { useEffect, useState } from "react";
import Navbar from "./navbar";
import { isMobile } from 'react-device-detect';
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
  Select,
  InputLabel,
  FormControl,
  Autocomplete,
  useMediaQuery,
} from "@mui/material";
import Stack from "@mui/material/Stack";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import homeBg from "../assets/home_bg.png";
import axios from "axios";
import FileUploader from "./FileUploader";
import EditIcon from "@mui/icons-material/Edit";
import sdgGoalsData from "../data/sdgGoals.json";
import { useAuth } from "../context/AuthContext";

const DisplayResearchInfo = ({ route, navigate }) => {
  const [users, setUsers] = useState([]);
  const navpage = useNavigate();
  const location = useLocation();
  const isSizeMobile = useMediaQuery('(max-width:600px)');
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

  const [isEditMode, setIsEditMode] = useState(false);
  const [editableData, setEditableData] = useState(null);
  const [authorInputValue, setAuthorInputValue] = useState("");
  const [authorOptions, setAuthorOptions] = useState([]);
  const [adviserInputValue, setAdviserInputValue] = useState("");
  const [adviserOptions, setAdviserOptions] = useState([]);
  const [panelInputValue, setPanelInputValue] = useState("");
  const [panelOptions, setPanelOptions] = useState([]);
  const [selectedSDGs, setSelectedSDGs] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [file, setFile] = useState(null);
  const [extendedAbstract, setExtendedAbstract] = useState(null);

  const { user } = useAuth();

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

  const handleViewEA = async (researchItem) => {
    const { research_id } = researchItem;
    if (research_id) {
      try {
        // Fetch the PDF as a Blob
        const response = await axios.get(
          `/paper/view_extended_abstract/${research_id}`,
          {
            responseType: "blob",
          }
        );

        const blob = new Blob([response.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);
        window.open(url, "_blank");

        // Increment the download count
        const userId = localStorage.getItem("user_id");
        const incrementResponse = await axios.put(
          `/paper/increment_downloads/${research_id}`,
          {
            user_id: userId,
          }
        );

        const updatedDownloadCount = incrementResponse.data.updated_downloads;

        // Update the specific item in the data state
        setData((prevData) => ({
          ...prevData,
          dataset: prevData.dataset.map((item) =>
            item.research_id === research_id
              ? { ...item, download_count: updatedDownloadCount }
              : item
          ),
        }));
      } catch (error) {
        console.error("Error fetching the manuscript:", error);
        alert("Failed to retrieve the extended abstract. Please try again.");
      }
    } else {
      alert("No extended abstract available for this research.");
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

  const handleEdit = (item) => {
    setEditableData({
      research_id: item.research_id,
      title: item.title,
      college_id: item.college_id,
      program_id: item.program_id,
      abstract: item.abstract,
      research_type: item.research_type,
      date_approved: item.date_approved
        ? new Date(item.date_approved).toISOString().split("T")[0]
        : "",
      sdgs: item.sdg
        ? item.sdg.split(";").map((sdgId) => ({
            id: sdgId,
            title:
              sdgGoalsData.sdgGoals.find((goal) => goal.id === sdgId)?.title ||
              "",
          }))
        : [],
      keywords: item.keywords || [],
      authors: item.authors || [],
      adviser: item.adviser || null,
      panels: item.panels || [],
      file: item.full_manuscript || null,
    });
    setSelectedSDGs(
      item.sdg
        ? item.sdg.split(";").map((sdgId) => ({
            id: sdgId,
            title:
              sdgGoalsData.sdgGoals.find((goal) => goal.id === sdgId)?.title ||
              "",
          }))
        : []
    );
    setKeywords(item.keywords || []);
    setIsEditMode(true);
    fetchColleges();

    // Fetch programs for the selected college
    if (item.college_id) {
      axios
        .get(`/deptprogs/programs/${item.college_id}`, {
          params: { department: item.college_id },
        })
        .then((response) => {
          setPrograms(response.data.programs);
        })
        .catch((error) => {
          console.error("Error fetching programs:", error);
        });
    }
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditableData(null);
  };

  const handleSaveChanges = async () => {
    try {
      // Check if any changes were made by comparing editableData with original data
      const originalData = data.dataset.find(
        (item) => item.research_id === editableData.research_id
      );

      // Format dates for comparison
      const originalDate = originalData.date_approved
        ? new Date(originalData.date_approved).toISOString().split("T")[0]
        : "";
      const editableDate = editableData.date_approved || "";

      // Compare relevant fields
      const hasChanges =
        originalData.title !== editableData.title ||
        originalData.college_id !== editableData.college_id ||
        originalData.program_id !== editableData.program_id ||
        originalData.abstract !== editableData.abstract ||
        originalData.research_type !== editableData.research_type ||
        originalDate !== editableDate || // Compare formatted dates
        originalData.adviser?.user_id !== editableData.adviser?.user_id ||
        JSON.stringify(originalData.keywords.sort()) !==
          JSON.stringify(keywords.sort()) ||
        originalData.sdg !== selectedSDGs.map((sdg) => sdg.id).join(";") ||
        JSON.stringify(originalData.authors.map((a) => a.user_id).sort()) !==
          JSON.stringify(editableData.authors.map((a) => a.user_id).sort()) ||
        JSON.stringify(originalData.panels.map((p) => p.user_id).sort()) !==
          JSON.stringify(editableData.panels.map((p) => p.user_id).sort()) ||
        file !== null || // Check if new file was uploaded
        extendedAbstract !== null; // Check if new extended abstract was uploaded

      console.log("Changes detected:", {
        title: originalData.title !== editableData.title,
        college: originalData.college_id !== editableData.college_id,
        program: originalData.program_id !== editableData.program_id,
        abstract: originalData.abstract !== editableData.abstract,
        type: originalData.research_type !== editableData.research_type,
        date: originalDate !== editableDate,
        adviser:
          originalData.adviser?.user_id !== editableData.adviser?.user_id,
        keywords:
          JSON.stringify(originalData.keywords.sort()) !==
          JSON.stringify(keywords.sort()),
        sdg: originalData.sdg !== selectedSDGs.map((sdg) => sdg.id).join(";"),
        authors:
          JSON.stringify(originalData.authors.map((a) => a.user_id).sort()) !==
          JSON.stringify(editableData.authors.map((a) => a.user_id).sort()),
        panels:
          JSON.stringify(originalData.panels.map((p) => p.user_id).sort()) !==
          JSON.stringify(editableData.panels.map((p) => p.user_id).sort()),
        newFile: file !== null,
        newEA: extendedAbstract !== null,
      });

      if (!hasChanges) {
        alert("No changes were made to save.");
        setIsEditMode(false);
        setEditableData(null);
        return;
      }

      // Proceed with existing save logic if changes were detected
      const formData = new FormData();
      const userId = localStorage.getItem("user_id");

      // Add all required fields to formData
      formData.append("user_id", userId);
      formData.append("college_id", editableData.college_id);
      formData.append("program_id", editableData.program_id);
      formData.append("title", editableData.title);
      formData.append("abstract", editableData.abstract);

      formData.append("date_approved", editableData.date_approved);

      formData.append("research_type", editableData.research_type);
      formData.append("adviser_id", editableData.adviser?.user_id || "");
      formData.append("sdg", selectedSDGs.map((sdg) => sdg.id).join(";"));

      // Handle file upload
      if (file) {
        formData.append("file", file);
      }
      if (extendedAbstract) {
        formData.append("extended_abstract", extendedAbstract);
      }

      // Add authors
      editableData.authors.forEach((author) => {
        formData.append("author_ids", author.user_id);
      });

      // Add panel members
      editableData.panels.forEach((panel) => {
        formData.append("panel_ids", panel.user_id);
      });

      // Add keywords
      formData.append("keywords", keywords.join(";"));

      const response = await axios.put(
        `/paper/update_paper/${editableData.research_id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Response:", response.data);
      alert("Paper updated successfully!");
      setIsEditMode(false);
      setEditableData(null);
      setFile(null); // Reset file state after successful upload
      setExtendedAbstract(null); // Add this line

      // Refresh the data
      const refreshResponse = await axios.get(
        `/dataset/fetch_ordered_dataset/${id}`
      );
      setData({ dataset: refreshResponse.data.dataset || [] });
    } catch (error) {
      console.error("Error updating paper:", error);
      alert("Failed to update paper. Please try again.");
    }
  };

  const fetchColleges = async () => {
    try {
      const response = await axios.get(`/deptprogs/college_depts`);
      setColleges(response.data.colleges);
    } catch (error) {
      console.error("Error fetching colleges:", error);
    }
  };

  const handleCollegeChange = async (event) => {
    const selectedCollegeId = event.target.value;
    setEditableData((prev) => ({ ...prev, college_id: selectedCollegeId }));

    try {
      const response = await axios.get(
        `/deptprogs/programs/${selectedCollegeId}`,
        {
          params: { department: selectedCollegeId },
        }
      );
      setPrograms(response.data.programs);
    } catch (error) {
      console.error("Error fetching programs:", error);
    }
  };

  const handleAuthorSearch = async (query) => {
    if (query.length > 2) {
      try {
        const response = await axios.get("/accounts/search_user", {
          params: { query },
        });
        setAuthorOptions(response.data.users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    }
  };

  const handleAdviserSearch = async (query) => {
    if (query.length > 2) {
      try {
        const response = await axios.get("/accounts/search_user", {
          params: { query },
        });
        setAdviserOptions(response.data.users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    }
  };

  const handlePanelSearch = async (query) => {
    if (query.length > 2) {
      try {
        const response = await axios.get("/accounts/search_user", {
          params: { query },
        });
        setPanelOptions(response.data.users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    }
  };

  const onSelectFileHandler = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
    } else {
      alert("Please select a PDF file");
    }
  };

  const onSelectFileHandlerEA = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setExtendedAbstract(selectedFile);
    } else {
      alert("Please select a PDF file");
    }
  };

  const onDeleteFileHandler = () => {
    setFile(null);
  };

  // Utility function to create responsive TextField styles
  const createTextFieldStyles = (customFlex = 2) => ({
    flex: customFlex,
    "& .MuiInputBase-input": {
      fontSize: {
        xs: "0.6em", // Mobile
        sm: "0.7rem", // Small devices
        md: "0.8rem", // Medium devices
        lg: "0.8rem", // Large devices
      },
    },
  });

  // Utility function to create responsive label styles
  const createInputLabelProps = () => ({
    sx: {
      fontSize: {
        xs: "0.45rem", // Mobile
        sm: "0.55rem", // Small devices
        md: "0.65rem", // Medium devices
        lg: "0.75rem", // Large devices
      },
    },
  });

  return (
    <>
      <Box
        sx={{
          margin: 0,
          padding: 0,
          height: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Navbar />
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            marginTop: { xs: "3.5rem", sm: "4rem", md: "5rem" },
            height: {
              xs: "calc(100vh - 3.5rem)",
              sm: "calc(100vh - 4rem)",
              md: "calc(100vh - 6rem)",
            },
          }}
        >
          {/* Header with back button */}
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
            <Box sx={{ display: "flex", ml: "5rem", zIndex: 3 }}>
              <IconButton
                onClick={() => navpage(-1)}
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
                variant='h3'
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
                Research information
              </Typography>
            </Box>
          </Box>

          {/*Main Content */}
          <Box
            sx={{
              padding: 6,
              width: "100%", // Ensure the container stretches across the full width
            }}
          >
            <Grid2
              container
              sx={{
                display: "flex",
                justifyContent: "center",
                height: "100%",
                width: "100%", // Ensure Grid also expands fully
              }}
            >
              {data && data.dataset && data.dataset.length > 0 ? (
                data.dataset.map((item, index) => (
                  <Box key={index} sx={{ width: "90%" }}>
                    {!isEditMode ? (
                      <>
                        <Grid2
                          container
                          display='flex'
                          flexDirection='column'
                          justifyContent='center'
                          sx={{ width: "100%" }}
                        >
                          <Typography
                            variant='h3'
                            alignSelf='center'
                            textAlign='center'
                            fontWeight='700'
                            sx={{
                              mb: "0.5rem",
                              color: "#08397C",
                              fontSize: {
                                xs: "clamp(1rem, 2vw, 1rem)",
                                sm: "clamp(1.5rem, 3.5vw, 1.5rem)",
                                md: "clamp(2rem, 4vw, 2.25rem)",
                              },
                            }}
                          >
                            {item.title}
                          </Typography>
                          <Typography
                            variant='h6'
                            sx={{
                              mb: "0.5rem",
                              fontSize: {
                                xs: "clamp(1rem, 2vw, 1rem)",
                                sm: "clamp(1rem, 3.5vw, 1rem)",
                                md: "clamp(1.25rem, 4vw, 1.5rem)",
                              },
                            }}
                            alignSelf='center'
                            fontWeight='600'
                          >
                            {Array.isArray(item.authors)
                              ? item.authors
                                  .map((author) => `${author.name}`)
                                  .join(", ")
                              : "No authors available"}
                          </Typography>
                          <Typography
                            variant='h7'
                            sx={{
                              mb: "1rem",
                              color: "#8B8B8B",
                              fontSize: {
                                xs: "clamp(0.75rem, 2vw, 0.75rem)",
                                sm: "clamp(0.75rem, 3.5vw, 1rem)",
                                md: "clamp(0.75rem, 4vw, 1rem)",
                              },
                            }}
                            alignSelf='center'
                            fontWeight='500'
                          >
                            {item.year}
                          </Typography>
                        </Grid2>
                        <Grid2
                          container
                          display='flex'
                          justifyContent='flex-end'
                        >
                          <Stack
                            direction='row'
                            alignItems='center'
                            justifyContent='space-between'
                            gap={3}
                          >
                            {user?.role === "05" && (
                              <Button
                                startIcon={<EditIcon />}
                                variant='contained'
                                color='primary'
                                sx={{
                                  backgroundColor: "#08397C",
                                  color: "#FFF",
                                  fontFamily: "Montserrat, sans-serif",
                                  fontWeight: 600,
                                  textTransform: "none",
                                  fontSize: {
                                    xs: "0.55rem",
                                    md: "0.75rem",
                                    lg: "0.9rem",
                                  },
                                  paddingLeft: "1.5rem",
                                  paddingRight: "1.5rem",
                                  borderRadius: "100px",
                                  maxHeight: "3rem",
                                  "&:hover": {
                                    backgroundColor: "#072d61",
                                  },
                                }}
                                onClick={() => handleEdit(item)}
                              >
                                Edit
                              </Button>
                            )}
                            <Stack direction='row' alignItems='center' gap={1}>
                              <DownloadIcon
                                color='primary'
                                sx={{
                                  fontSize: {
                                    xs: "0.8rem",
                                    md: "1rem",
                                    lg: "1.2rem",
                                  },
                                }}
                              />
                              <Typography
                                variant='h7'
                                sx={{
                                  fontSize: {
                                    xs: "0.55rem",
                                    md: "0.65rem",
                                    lg: "0.9rem",
                                  },
                                }}
                              >
                                {item.download_count} Downloads
                              </Typography>
                            </Stack>
                            <Stack direction='row' alignItems='center' gap={1}>
                              <VisibilityIcon
                                color='primary'
                                sx={{
                                  fontSize: {
                                    xs: "0.8rem",
                                    md: "1rem",
                                    lg: "1.2rem",
                                  },
                                }}
                              />
                              <Typography
                                variant='h7'
                                sx={{
                                  fontSize: {
                                    xs: "0.55rem",
                                    md: "0.65rem",
                                    lg: "0.9rem",
                                  },
                                }}
                              >
                                {item.view_count} Views
                              </Typography>
                            </Stack>
                          </Stack>
                        </Grid2>
                        <Divider
                          variant='middle'
                          sx={{ mt: "1rem", mb: "1rem" }}
                        />
                        <Grid2
                          container
                          display="flex"
                          direction={isMobile || isSizeMobile ? "column" : "row"}
                          paddingLeft={2}
                          paddingRight={2}
                        >
                          <Grid2
                            size={isMobile || isSizeMobile ? 12 : 8}
                            paddingRight={isMobile || isSizeMobile ? 0 : 10}
                            sx={{ flexGrow: 1 }}
                          >
                            <Typography
                              variant='h6'
                              fontWeight='700'
                              sx={{
                                mb: "1rem",
                                fontSize: {
                                  xs: "0.75rem",
                                  md: "0.75rem",
                                  lg: "1.1rem",
                                },
                              }}
                            >
                              Keywords:
                            </Typography>
                            <Typography
                              variant='body1'
                              sx={{
                                fontSize: {
                                  xs: "0.6rem",
                                  md: "0.7rem",
                                  lg: "0.9rem",
                                },
                              }}
                            >
                              {Array.isArray(item.keywords)
                                ? item.keywords.join("; ")
                                : "No keywords available"}
                            </Typography>
                            <Typography
                              variant='h6'
                              fontWeight='700'
                              sx={{
                                mt: "2rem",
                                mb: "1rem",
                                fontSize: {
                                  xs: "0.75rem",
                                  md: "0.75rem",
                                  lg: "1.1rem",
                                },
                              }}
                            >
                              Abstract:
                            </Typography>
                            <Typography
                              variant='body1'
                              sx={{
                                fontSize: {
                                  xs: "0.6rem",
                                  md: "0.7rem",
                                  lg: "0.9rem",
                                },
                              }}
                            >
                              {item.abstract || "No abstract available"}
                            </Typography>
                          </Grid2>
                          <Grid2
                            size={isMobile || isSizeMobile ? 12 : 4}
                            justifyContent="flex-end"
                            sx={{
                              flexGrow: 1,
                              marginTop: isMobile || isSizeMobile ? "2rem" : 0,
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                position: "relative",
                                width: "100%",
                                bgcolor: "#f0f0f0",
                                borderRadius: 2,
                                padding: 3,
                                height: "auto",
                              }}
                            >
                              <Typography
                                variant='h7'
                                sx={{
                                  mb: "1rem",
                                  fontSize: {
                                    xs: "0.6rem",
                                    md: "0.65rem",
                                    lg: "0.8rem",
                                  },
                                }}
                              >
                                <strong>College Department:</strong>{" "}
                                {item.college_id}
                              </Typography>
                              <Typography
                                variant='h7'
                                sx={{
                                  mb: "1rem",
                                  fontSize: {
                                    xs: "0.6rem",
                                    md: "0.65rem",
                                    lg: "0.8rem",
                                  },
                                }}
                              >
                                <strong>Program:</strong> {item.program_name}
                              </Typography>
                              <Typography
                                variant="body1"
                                sx={{
                                  mb: "1rem",
                                  fontSize: {
                                    xs: "0.6rem",
                                    md: "0.65rem",
                                    lg: "0.8rem",
                                  },
                                }}
                              >
                                <strong>Adviser:</strong>{" "}
                                {item.adviser && item.adviser.name 
                                  ? `${item.adviser.name}` 
                                  : "No adviser"}
                              </Typography>
                              <Typography
                                variant='body1'
                                sx={{
                                  mb: "1rem",
                                  fontSize: {
                                    xs: "0.5rem",
                                    md: "0.65rem",
                                    lg: "0.8rem",
                                  },
                                }}
                              >
                                <strong>Panel Members:</strong>{" "}
                                {Array.isArray(item.panels) &&
                                item.panels.length > 0
                                  ? item.panels
                                      .map((panel) => `${panel.name}`)
                                      .join("; ")
                                  : "No panel members"}
                              </Typography>
                              <Divider variant='middle' sx={{ mb: "1rem" }} />
                              <Typography
                                variant='body1'
                                sx={{
                                  mb: "1rem",
                                  fontSize: {
                                    xs: "0.5rem",
                                    md: "0.65rem",
                                    lg: "0.8rem",
                                  },
                                }}
                              >
                                <strong>Journal:</strong> {item.journal}
                              </Typography>
                              <Typography
                                variant='body1'
                                sx={{
                                  mb: "1rem",
                                  fontSize: {
                                    xs: "0.5rem",
                                    md: "0.65rem",
                                    lg: "0.8rem",
                                  },
                                }}
                              >
                                <strong>Research Type:</strong>{" "}
                                {item.research_type}
                              </Typography>
                              <Typography
                                variant='body1'
                                sx={{
                                  mb: "1rem",
                                  fontSize: {
                                    xs: "0.5rem",
                                    md: "0.65rem",
                                    lg: "0.8rem",
                                  },
                                }}
                              >
                                <strong>SDG:</strong> {item.sdg}
                              </Typography>
                              {user?.role !== "06" && (
                                <Button
                                  variant='contained'
                                  color='primary'
                                  startIcon={
                                    <VisibilityIcon
                                      sx={{
                                        fontSize: {
                                          xs: "0.65rem",
                                          md: "0.75rem",
                                          lg: "1rem",
                                        },
                                      }}
                                    />
                                  }
                                  sx={{
                                    backgroundColor: "#08397C",
                                    color: "#FFF",
                                    fontFamily: "Montserrat, sans-serif",
                                    fontWeight: 400,
                                    textTransform: "none",
                                    fontSize: {
                                      xs: "0.5rem",
                                      md: "0.65rem",
                                      lg: "0.8rem",
                                    },
                                    marginTop: "2rem",
                                    width: "inherit",
                                    alignSelf: "center",
                                    borderRadius: "100px",
                                    maxHeight: "3rem",
                                    "&:hover": {
                                      backgroundColor: "#072d61",
                                    },
                                  }}
                                  onClick={() => handleViewManuscript(item)}
                                >
                                  Full Manuscript
                                </Button>
                              )}
                              <Button
                                variant='contained'
                                color='primary'
                                startIcon={
                                  <VisibilityIcon
                                    sx={{
                                      fontSize: {
                                        xs: "0.65rem",
                                        md: "0.75rem",
                                        lg: "1rem",
                                      },
                                    }}
                                  />
                                }
                                sx={{
                                  backgroundColor: "#08397C",
                                  color: "#FFF",
                                  fontFamily: "Montserrat, sans-serif",
                                  fontWeight: 400,
                                  textTransform: "none",
                                  fontSize: {
                                    xs: "0.5rem",
                                    md: "0.65rem",
                                    lg: "0.8rem",
                                  },
                                  marginTop: "1rem",
                                  width: "inherit",
                                  alignSelf: "center",
                                  borderRadius: "100px",
                                  maxHeight: "3rem",
                                  "&:hover": {
                                    backgroundColor: "#072d61",
                                  },
                                }}
                                onClick={() => handleViewEA(item)}
                              >
                                Extended Abstract
                              </Button>
                            </Box>
                          </Grid2>
                        </Grid2>
                      </>
                    ) : (
                      <>
                        <Grid2 container spacing={2}>
                          <Grid2 size={2}>
                            <TextField
                              fullWidth
                              label='Group Code'
                              variant='outlined'
                              value={editableData.research_id}
                              sx={createTextFieldStyles()}
                              InputLabelProps={createInputLabelProps()}
                              disabled
                            />
                          </Grid2>
                          <Grid2 size={4}>
                            <FormControl fullWidth variant='outlined' disabled>
                              <InputLabel
                                sx={{
                                  fontSize: {
                                    xs: "0.75rem",
                                    md: "0.75rem",
                                    lg: "0.8rem",
                                  },
                                }}
                              >
                                Department
                              </InputLabel>
                              <Select
                                label='Department'
                                sx={createTextFieldStyles()}
                                value={editableData.college_id}
                                onChange={handleCollegeChange}
                              >
                                {colleges.map((college) => (
                                  <MenuItem
                                    key={college.college_id}
                                    value={college.college_id}
                                    sx={{
                                      fontSize: {
                                        xs: "0.75rem",
                                        md: "0.75rem",
                                        lg: "0.8rem",
                                      },
                                    }}
                                  >
                                    {college.college_name}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Grid2>
                          <Grid2 size={2}>
                            <FormControl fullWidth variant='outlined' disabled={user.role !== "05"}>
                              <InputLabel
                                sx={{
                                  fontSize: {
                                    xs: "0.75rem",
                                    md: "0.75rem",
                                    lg: "0.8rem",
                                  },
                                }}
                              >
                                Program
                              </InputLabel>
                              <Select
                                label='Program'
                                sx={createTextFieldStyles()}
                                value={editableData.program_id || ""}
                                onChange={(e) =>
                                  setEditableData((prev) => ({
                                    ...prev,
                                    program_id: e.target.value,
                                  }))
                                }
                              >
                                {programs.map((program) => (
                                  <MenuItem
                                    key={program.program_id}
                                    value={program.program_id}
                                    sx={{
                                      fontSize: {
                                        xs: "0.75rem",
                                        md: "0.75rem",
                                        lg: "0.8rem",
                                      },
                                    }}
                                  >
                                    {program.program_name}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Grid2>
                          <Grid2 size={2}>
                          <FormControl fullWidth variant="outlined">
                            <InputLabel
                              sx={{
                                fontSize: {
                                  xs: "0.75rem",
                                  md: "0.75rem",
                                  lg: "0.8rem",
                                },
                              }}
                            >
                              Research Type
                            </InputLabel>
                            <Select
                              label="Research Type"
                              sx={createTextFieldStyles()}
                              value={editableData.research_type || ''} // Default to an empty string if undefined
                              onChange={(e) =>
                                setEditableData((prev) => ({
                                  ...prev,
                                  research_type: e.target.value,
                                }))
                              }
                            >
                              <MenuItem
                                value="EXTRAMURAL"
                                sx={{
                                  fontSize: {
                                    xs: "0.75rem",
                                    md: "0.75rem",
                                    lg: "0.8rem",
                                  },
                                }}
                              >
                                EXTRAMURAL
                              </MenuItem>
                              <MenuItem
                                value="COLLEGE-DRIVEN"
                                sx={{
                                  fontSize: {
                                    xs: "0.75rem",
                                    md: "0.75rem",
                                    lg: "0.8rem",
                                  },
                                }}
                              >
                                COLLEGE-DRIVEN
                              </MenuItem>
                              <MenuItem
                                value="INTEGRATIVE"
                                sx={{
                                  fontSize: {
                                    xs: "0.75rem",
                                    md: "0.75rem",
                                    lg: "0.8rem",
                                  },
                                }}
                              >
                                INTEGRATIVE
                              </MenuItem>
                            </Select>
                          </FormControl>
                          </Grid2>
                          <Grid2 size={2}>
                            <TextField
                              fullWidth
                              label='Date Approved'
                              type='date'
                              variant='outlined'
                              value={editableData.date_approved}
                              sx={createTextFieldStyles()}
                              onChange={(e) =>
                                setEditableData((prev) => ({
                                  ...prev,
                                  date_approved: e.target.value,
                                }))
                              }
                              InputLabelProps={{ shrink: true }}
                            />
                          </Grid2>
                          <Grid2 size={4}>
                            <Autocomplete
                              multiple
                              value={editableData.authors}
                              onChange={(event, newValue) => {
                                const formattedAuthors = newValue.map(
                                  (author) => ({
                                    user_id:
                                      author.user_id || author.researcher_id,
                                    name:
                                      author.name ||
                                      `${author.first_name} ${author.last_name}`,
                                    email: author.email,
                                  })
                                );
                                setEditableData((prev) => ({
                                  ...prev,
                                  authors: formattedAuthors,
                                }));
                              }}
                              inputValue={authorInputValue}
                              onInputChange={(event, newInputValue) => {
                                setAuthorInputValue(newInputValue);
                                handleAuthorSearch(newInputValue);
                              }}
                              options={authorOptions}
                              getOptionLabel={(option) =>
                                option.name
                                  ? `${option.name} (${option.email})`
                                  : `${option.first_name} ${option.last_name} (${option.email})`
                              }
                              componentsProps={{
                                popper: {
                                  sx: {
                                    "& .MuiAutocomplete-listbox": {
                                      fontSize: {
                                        xs: "0.75rem",
                                        md: "0.75rem",
                                        lg: "0.8rem",
                                      },
                                    },
                                  },
                                },
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label='Authors'
                                  variant='outlined'
                                  helperText='Type at least 3 characters to search and select author/s'
                                  sx={createTextFieldStyles()}
                                  InputLabelProps={createInputLabelProps()}
                                />
                              )}
                            />
                          </Grid2>
                          <Grid2 size={4}>
                            <Autocomplete
                              value={editableData.adviser}
                              disabled={editableData.research_type === "COLLEGE-DRIVEN" || editableData.research_type === "EXTRAMURAL"}
                              onChange={(event, newValue) => {
                                const formattedAdviser = newValue
                                  ? {
                                      user_id:
                                        newValue.user_id ||
                                        newValue.researcher_id,
                                      name:
                                        newValue.name ||
                                        `${newValue.first_name} ${newValue.last_name}`,
                                      email: newValue.email,
                                    }
                                  : null;
                                setEditableData((prev) => ({
                                  ...prev,
                                  adviser: formattedAdviser,
                                }));
                              }}
                              inputValue={adviserInputValue}
                              onInputChange={(event, newInputValue) => {
                                setAdviserInputValue(newInputValue);
                                handleAdviserSearch(newInputValue);
                              }}
                              options={adviserOptions}
                              getOptionLabel={(option) =>
                                option.name
                                  ? `${option.name} (${option.email})`
                                  : `${option.first_name} ${option.last_name} (${option.email})`
                              }
                              componentsProps={{
                                popper: {
                                  sx: {
                                    "& .MuiAutocomplete-listbox": {
                                      fontSize: {
                                        xs: "0.75rem",
                                        md: "0.75rem",
                                        lg: "0.8rem",
                                      },
                                    },
                                  },
                                },
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label='Adviser'
                                  variant='outlined'
                                  helperText='Type at least 3 characters to search for an adviser'
                                  sx={createTextFieldStyles()}
                                  InputLabelProps={createInputLabelProps()}
                                />
                              )}
                            />
                          </Grid2>
                          <Grid2 size={4}>
                            <Autocomplete
                              multiple
                              value={editableData.panels}
                              disabled={editableData.research_type === "COLLEGE-DRIVEN" || editableData.research_type === "EXTRAMURAL"}
                              onChange={(event, newValue) => {
                                const formattedPanels = newValue.map(
                                  (panel) => ({
                                    user_id:
                                      panel.user_id || panel.researcher_id,
                                    name:
                                      panel.name ||
                                      `${panel.first_name} ${panel.last_name}`,
                                    email: panel.email,
                                  })
                                );
                                setEditableData((prev) => ({
                                  ...prev,
                                  panels: formattedPanels,
                                }));
                              }}
                              inputValue={panelInputValue}
                              onInputChange={(event, newInputValue) => {
                                setPanelInputValue(newInputValue);
                                handlePanelSearch(newInputValue);
                              }}
                              options={panelOptions}
                              getOptionLabel={(option) =>
                                option.name
                                  ? `${option.name} (${option.email})`
                                  : `${option.first_name} ${option.last_name} (${option.email})`
                              }
                              componentsProps={{
                                popper: {
                                  sx: {
                                    "& .MuiAutocomplete-listbox": {
                                      fontSize: {
                                        xs: "0.75rem",
                                        md: "0.75rem",
                                        lg: "0.8rem",
                                      },
                                    },
                                  },
                                },
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label='Panel Members'
                                  variant='outlined'
                                  helperText='Type at least 3 characters to search and select panel members'
                                  sx={createTextFieldStyles()}
                                  InputLabelProps={createInputLabelProps()}
                                />
                              )}
                            />
                          </Grid2>
                          <Grid2 size={12}>
                            <TextField
                              fullWidth
                              label='Title'
                              variant='outlined'
                              value={editableData.title}
                              sx={createTextFieldStyles()}
                              InputLabelProps={createInputLabelProps()}
                              onChange={(e) =>
                                setEditableData((prev) => ({
                                  ...prev,
                                  title: e.target.value,
                                }))
                              }
                            />
                          </Grid2>
                          <Grid2 size={6}>
                            <Autocomplete
                              multiple
                              value={selectedSDGs}
                              onChange={(event, newValue) =>
                                setSelectedSDGs(newValue)
                              }
                              options={sdgGoalsData.sdgGoals}
                              getOptionLabel={(option) =>
                                `${option.id} - ${option.title}`
                              }
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label='SDG Goals'
                                  variant='outlined'
                                  helperText='Select one or more SDG goals'
                                  sx={createTextFieldStyles()}
                                  InputLabelProps={createInputLabelProps()}
                                />
                              )}
                            />
                          </Grid2>
                          <Grid2 size={6}>
                            <Autocomplete
                              multiple
                              freeSolo
                              value={keywords}
                              onChange={(event, newValue) =>
                                setKeywords(newValue)
                              }
                              options={[]}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label='Keywords'
                                  variant='outlined'
                                  helperText='Type and press Enter to add multiple keywords'
                                  sx={createTextFieldStyles()}
                                  InputLabelProps={createInputLabelProps()}
                                />
                              )}
                            />
                          </Grid2>
                          <Grid2 size={6}>
                            <TextField
                              fullWidth
                              label='Abstract'
                              multiline
                              rows={3}
                              variant='outlined'
                              value={editableData.abstract}
                              sx={createTextFieldStyles()}
                              InputLabelProps={createInputLabelProps()}
                              onChange={(e) =>
                                setEditableData((prev) => ({
                                  ...prev,
                                  abstract: e.target.value,
                                }))
                              }
                            />
                          </Grid2>
                          <Grid2
                            size={3}
                            display='flex'
                            flexDirection='column'
                            justifyContent='center'
                          >
                            <Typography
                              variant='body1'
                              sx={{
                                color: "#8B8B8B",
                                mb: 1,
                                fontSize: {
                                  xs: "0.5rem",
                                  md: "0.5rem",
                                  lg: "0.9rem",
                                },
                              }}
                            >
                              Modify Full Manuscript:
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                border: "1px dashed #0A438F",
                                borderRadius: 1,
                                m: 1,
                                cursor: "pointer",
                                justifyContent: "center",
                                gap: 2,
                              }}
                            >
                              <FileUploader
                                onSelectFile={onSelectFileHandler}
                                onDeleteFile={onDeleteFileHandler}
                              />
                            </Box>
                            <Button
                              variant='contained'
                              onClick={() => handleViewManuscript(editableData)}
                              startIcon={
                                <VisibilityIcon
                                  sx={{
                                    fontSize: {
                                      xs: "0.65rem",
                                      md: "0.75rem",
                                      lg: "1rem",
                                    },
                                  }}
                                />
                              }
                              sx={{
                                backgroundColor: "#08397C",
                                color: "#FFF",
                                fontFamily: "Montserrat, sans-serif",
                                fontWeight: 400,
                                textTransform: "none",
                                fontSize: {
                                  xs: "0.5rem",
                                  md: "0.65rem",
                                  lg: "0.8rem",
                                },
                                marginTop: "1.5rem",
                                alignSelf: "center",
                                borderRadius: "100px",
                                maxHeight: "3rem",
                                "&:hover": {
                                  backgroundColor: "#072d61",
                                },
                              }}
                            >
                              View Manuscript
                            </Button>
                          </Grid2>
                          <Grid2
                            size={3}
                            display='flex'
                            flexDirection='column'
                            justifyContent='center'
                          >
                            <Typography
                              variant='body1'
                              sx={{
                                color: "#8B8B8B",
                                mb: 1,
                                fontSize: {
                                  xs: "0.5rem",
                                  md: "0.5rem",
                                  lg: "0.9rem",
                                },
                              }}
                            >
                              Modify Extended Abstract:
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                border: "1px dashed #0A438F",
                                borderRadius: 1,
                                m: 1,
                                cursor: "pointer",
                                justifyContent: "center",
                                gap: 2,
                              }}
                            >
                              <FileUploader
                                onSelectFile={onSelectFileHandlerEA}
                                onDeleteFile={onDeleteFileHandler}
                              />
                            </Box>
                            <Button
                              variant='contained'
                              onClick={() => handleViewEA(editableData)}
                              startIcon={
                                <VisibilityIcon
                                  sx={{
                                    fontSize: {
                                      xs: "0.65rem",
                                      md: "0.75rem",
                                      lg: "1rem",
                                    },
                                  }}
                                />
                              }
                              sx={{
                                backgroundColor: "#08397C",
                                color: "#FFF",
                                fontFamily: "Montserrat, sans-serif",
                                fontWeight: 400,
                                textTransform: "none",
                                fontSize: {
                                  xs: "0.5rem",
                                  md: "0.65rem",
                                  lg: "0.8rem",
                                },
                                marginTop: "1.5rem",
                                alignSelf: "center",
                                borderRadius: "100px",
                                maxHeight: "3rem",
                                "&:hover": {
                                  backgroundColor: "#072d61",
                                },
                              }}
                            >
                              View Extended Abstract
                            </Button>
                          </Grid2>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "flex-start",
                              mt: 2,
                              gap: 2,
                            }}
                          >
                            <Button
                              variant='contained'
                              onClick={handleCancelEdit}
                              sx={{
                                backgroundColor: "#08397C",
                                color: "#FFF",
                                fontFamily: "Montserrat, sans-serif",
                                fontWeight: 600,
                                fontSize: { xs: "0.875rem", md: "1rem" },
                                padding: { xs: "0.5rem 1rem", md: "1.25rem" },
                                borderRadius: "100px",
                                maxHeight: "3rem",
                                textTransform: "none",
                                "&:hover": {
                                  backgroundColor: "#072d61",
                                },
                              }}
                            >
                              Cancel
                            </Button>
                            <Button
                              variant='contained'
                              onClick={handleSaveChanges}
                              sx={{
                                backgroundColor: "#CA031B",
                                color: "#FFF",
                                fontFamily: "Montserrat, sans-serif",
                                fontWeight: 600,
                                textTransform: "none",
                                fontSize: { xs: "0.875rem", md: "1rem" },
                                padding: { xs: "0.5rem 1rem", md: "1.25rem" },
                                borderRadius: "100px",
                                maxHeight: "3rem",
                                "&:hover": {
                                  backgroundColor: "#A30417",
                                  color: "#FFF",
                                },
                              }}
                            >
                              Save Changes
                            </Button>
                          </Box>
                        </Grid2>
                      </>
                    )}
                  </Box>
                ))
              ) : (
                <div>
                  <p>No research information available.</p>
                </div>
              )}
            </Grid2>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default DisplayResearchInfo;
