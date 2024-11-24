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
  Select,
  InputLabel,
  FormControl,
  Autocomplete,
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
        .get(`/deptprogs/programs`, {
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
      const response = await axios.get(`/deptprogs/programs`, {
        params: { department: selectedCollegeId },
      });
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
              padding: "5%",
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
                  <Box key={index} sx={{ width: "100%" }}>
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
                            sx={{ color: "#08397C" }}
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
                                  .map((author) => `${author.name}`)
                                  .join(", ")
                              : "No authors available"}
                          </Typography>
                          <Typography
                            variant='h7'
                            sx={{ mb: "1rem", color: "#8B8B8B" }}
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
                          <Stack direction='row' alignContent='center' gap={2}>
                            <Button
                              variant='outlined'
                              startIcon={<EditIcon />}
                              sx={{
                                color: "#08397C",
                                borderColor: "#08397C",
                                mr: "2rem",
                                "&:hover": {
                                  borderColor: "#072d61",
                                  backgroundColor: "transparent",
                                },
                              }}
                              onClick={() => handleEdit(item)}
                            >
                              Edit
                            </Button>

                            <Stack
                              direction='row'
                              alignContent='center'
                              gap={1}
                            >
                              <DownloadIcon color='primary' />
                              <Typography variant='h7' sx={{ mr: "2rem" }}>
                                {item.download_count} Downloads
                              </Typography>
                            </Stack>
                            <Stack
                              direction='row'
                              alignContent='center'
                              gap={1}
                            >
                              <VisibilityIcon color='primary' />
                              <Typography variant='h7' sx={{ mr: "1rem" }}>
                                {item.view_count} Views
                              </Typography>
                            </Stack>
                          </Stack>
                        </Grid2>
                        <Divider
                          variant='middle'
                          sx={{ mt: "1rem", mb: "2rem" }}
                        />
                        <Grid2
                          container
                          display='flex'
                          paddingLeft={2}
                          paddingRight={2}
                        >
                          <Grid2
                            size={8}
                            paddingRight={10}
                            sx={{ flexGrow: 1 }}
                          >
                            <Typography
                              variant='h6'
                              fontWeight='700'
                              sx={{ mb: "1rem" }}
                            >
                              Keywords:
                            </Typography>
                            <Typography variant='body1'>
                              {Array.isArray(item.keywords)
                                ? item.keywords.join("; ")
                                : "No keywords available"}
                            </Typography>
                            <Typography
                              variant='h6'
                              fontWeight='700'
                              sx={{ mt: "2rem", mb: "1rem" }}
                            >
                              Abstract:
                            </Typography>
                            <Typography variant='body1'>
                              {item.abstract || "No abstract available"}
                            </Typography>
                          </Grid2>
                          <Grid2
                            size={4}
                            justifyContent='flex-end'
                            sx={{ flexGrow: 1 }}
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
                              <Typography variant='h7' sx={{ mb: "1rem" }}>
                                <strong>College Department:</strong>{" "}
                                {item.college_id}
                              </Typography>
                              <Typography variant='h7' sx={{ mb: "1rem" }}>
                                <strong>Program:</strong> {item.program_name}
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
                              <Divider
                                variant='middle'
                                sx={{ mt: "1rem", mb: "1rem" }}
                              />
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
                                View Full Manuscript
                              </Button>
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
                                onClick={() => handleViewEA(item)}
                              >
                                View Extended Abstract
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
                              variant='filled'
                              value={editableData.research_id}
                              disabled
                            />
                          </Grid2>
                          <Grid2 size={3}>
                            <FormControl fullWidth variant='filled'>
                              <InputLabel>Department</InputLabel>
                              <Select
                                value={editableData.college_id}
                                onChange={handleCollegeChange}
                              >
                                {colleges.map((college) => (
                                  <MenuItem
                                    key={college.college_id}
                                    value={college.college_id}
                                  >
                                    {college.college_name}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Grid2>
                          <Grid2 size={3}>
                            <FormControl fullWidth variant='filled'>
                              <InputLabel>Program</InputLabel>
                              <Select
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
                                  >
                                    {program.program_name}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Grid2>
                          <Grid2 size={2}>
                            <FormControl fullWidth variant='filled'>
                              <InputLabel>Research Type</InputLabel>
                              <Select
                                value={editableData.research_type}
                                onChange={(e) =>
                                  setEditableData((prev) => ({
                                    ...prev,
                                    research_type: e.target.value,
                                  }))
                                }
                              >
                                <MenuItem value='EXTRAMURAL'>
                                  EXTRAMURAL
                                </MenuItem>
                                <MenuItem value='COLLEGE-DRIVEN'>
                                  COLLEGE-DRIVEN
                                </MenuItem>
                                <MenuItem value='INTEGRATIVE'>
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
                              variant='filled'
                              value={editableData.date_approved}
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
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label='Authors'
                                  variant='filled'
                                  helperText='Type at least 3 characters to search and select author/s'
                                />
                              )}
                            />
                          </Grid2>
                          <Grid2 size={4}>
                            <Autocomplete
                              value={editableData.adviser}
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
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label='Adviser'
                                  variant='filled'
                                  helperText='Type at least 3 characters to search for an adviser'
                                />
                              )}
                            />
                          </Grid2>
                          <Grid2 size={4}>
                            <Autocomplete
                              multiple
                              value={editableData.panels}
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
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label='Panel Members'
                                  variant='filled'
                                  helperText='Type at least 3 characters to search and select panel members'
                                />
                              )}
                            />
                          </Grid2>
                          <Grid2 size={12}>
                            <TextField
                              fullWidth
                              label='Title'
                              variant='filled'
                              value={editableData.title}
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
                                  variant='filled'
                                  helperText='Select one or more SDG goals'
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
                                  variant='filled'
                                  helperText='Type and press Enter to add multiple keywords'
                                />
                              )}
                            />
                          </Grid2>
                          <Grid2 size={6}>
                            <TextField
                              fullWidth
                              label='Abstract'
                              multiline
                              rows={4}
                              variant='filled'
                              value={editableData.abstract}
                              onChange={(e) =>
                                setEditableData((prev) => ({
                                  ...prev,
                                  abstract: e.target.value,
                                }))
                              }
                            />
                          </Grid2>
                          <Grid2 size={3}>
                            <Typography
                              variant='body1'
                              sx={{ color: "#8B8B8B", mb: 1 }}
                            >
                              Full Manuscript:
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                width: "100%",
                                flex: 1,
                                minHeight: "5rem",
                                p: 3,
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
                              sx={{
                                backgroundColor: "#08397C",
                                color: "#FFF",
                                fontFamily: "Montserrat, sans-serif",
                                fontWeight: 400,
                                textTransform: "none",
                                fontSize: { xs: "0.875rem", md: "1rem" },
                                padding: { xs: "0.5rem 1rem", md: "1rem" },
                                marginTop: "1rem",
                                width: "100%",
                                borderRadius: "100px",
                                maxHeight: "3rem",
                                "&:hover": {
                                  backgroundColor: "#052045",
                                },
                              }}
                            >
                              View Manuscript
                            </Button>
                          </Grid2>
                          <Grid2 size={3}>
                            <Typography
                              variant='body1'
                              sx={{ color: "#8B8B8B", mb: 1 }}
                            >
                              Extended Abstract:
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                width: "100%",
                                flex: 1,
                                minHeight: "5rem",
                                p: 3,
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
                              sx={{
                                backgroundColor: "#08397C",
                                color: "#FFF",
                                fontFamily: "Montserrat, sans-serif",
                                fontWeight: 400,
                                textTransform: "none",
                                fontSize: { xs: "0.875rem", md: "1rem" },
                                padding: { xs: "0.5rem 1rem", md: "1rem" },
                                marginTop: "1rem",
                                width: "100%",
                                borderRadius: "100px",
                                maxHeight: "3rem",
                                "&:hover": {
                                  backgroundColor: "#052045",
                                },
                              }}
                            >
                              View Extended Abstract
                            </Button>
                          </Grid2>
                          <Grid2 size={12}>
                            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                              <Button
                                variant='contained'
                                onClick={handleCancelEdit}
                                sx={{
                                  backgroundColor: "#08397C",
                                  color: "#FFF",
                                  "&:hover": {
                                    backgroundColor: "#052045",
                                  },
                                }}
                              >
                                Cancel
                              </Button>
                              <Button
                                variant='contained'
                                onClick={handleSaveChanges}
                                sx={{
                                  backgroundColor: "#d40821",
                                  color: "#FFF",
                                  "&:hover": {
                                    backgroundColor: "#8a0b14",
                                  },
                                }}
                              >
                                Save Changes
                              </Button>
                            </Box>
                          </Grid2>
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
