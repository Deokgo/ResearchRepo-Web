import React, { useEffect, useState, useRef } from "react";
import Navbar from "../components/navbar";
import { isMobile } from "react-device-detect";
import DynamicTimeline from "../components/Timeline";
import StatusUpdateButton from "../components/StatusUpdateButton";
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
  Checkbox,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import Stack from "@mui/material/Stack";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import homeBg from "../assets/home_bg.png";
import api from "../services/api";
import FileUploader from "../components/FileUploader";
import EditIcon from "@mui/icons-material/Edit";
import sdgGoalsData from "../data/sdgGoals.json";
import { useAuth } from "../context/AuthContext";
import { filterCache, fetchAndCacheFilterData } from "../utils/filterCache";
import HeaderWithBackButton from "../components/Header";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const DisplayResearchInfo = () => {
  const userId = localStorage.getItem("user_id");
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const isSizeMobile = useMediaQuery("(max-width:600px)");
  const [openModal, setOpenModal] = useState(false);
  const { id } = location.state || {}; // Default to an empty object if state is undefined
  const [data, setData] = useState(null); // Start with null to represent no data
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState("");
  const [loading, setLoading] = useState(true); // Track loading state
  const [header, setHeader] = useState("Research Information");

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
  const [researchAreas, setResearchAreas] = useState([]);
  const [researchTypes, setResearchTypes] = useState([]);

  const [schoolYear, setSchoolYear] = useState("");
  const [term, setTerm] = useState("");

  const terms = [
    { display: "1st", value: "1" },
    { display: "2nd", value: "2" },
    { display: "3rd", value: "3" },
  ];

  const currentYear = new Date().getFullYear();
  const schoolYears = Array.from({ length: 10 }, (_, i) => {
    const year = currentYear - i;
    return `${year}-${year + 1}`;
  });

  const { user } = useAuth();

  const fileInputRef = useRef(null);
  const extendedAbstractRef = useRef(null);

  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const [hasChanges, setHasChanges] = useState(false);

  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);

  useEffect(() => {
    if (!id) return;

    const timer = setTimeout(async () => {
      try {
        await api.put(`/paper/increment_views/${id}?is_increment=true`, {
          user_id: userId,
        });
      } catch (error) {
        console.error("Error incrementing view count:", error);
      }
    }, 30000); // 30 seconds delay

    return () => clearTimeout(timer); // Clears the timer if user leaves before 30s
  }, [id, userId]);

  const handleChange = (field, value) => {
    setEditableData((prev) => {
      const newData = { ...prev, [field]: value };

      // Compare the new data with original data
      const originalData = data.dataset[0];

      // Check if there are any differences between original and new data
      const isChanged = Object.keys(newData).some((key) => {
        // Handle arrays (like authors, panels, etc.)
        if (Array.isArray(newData[key])) {
          return (
            JSON.stringify(newData[key]) !== JSON.stringify(originalData[key])
          );
        }
        // Handle regular values
        return newData[key] !== originalData[key];
      });

      setHasChanges(isChanged);

      return newData;
    });
  };

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          const response = await api.get(
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
        const response = await api.get("/accounts/users");
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
    // Get the correct file path, either from current file or original data
    const research_id = researchItem.research_id;
    const currentData = data.dataset.find(
      (item) => item.research_id === research_id
    );

    if (research_id) {
      try {
        const response = await api.get(
          `/paper/view_manuscript/${research_id}`,
          {
            responseType: "blob",
          }
        );

        const blob = new Blob([response.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);
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
    const research_id = researchItem.research_id;
    const currentData = data.dataset.find(
      (item) => item.research_id === research_id
    );

    if (research_id) {
      try {
        const response = await api.get(
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
        const incrementResponse = await api.put(
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
        console.error("Error fetching the extended abstract:", error);
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
        const response = await api.get(`/track/next_status/${id}`); // Replace with your API endpoint
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
      const response = await api.post(`/track/research_status/${id}`, {
        status: newStatus,
      });

      if (response.status === 200 || response.status === 201) {
        // Toggle refresh to trigger timeline update
        setRefreshTimeline((prev) => !prev);

        // Fetch the next available status
        const nextStatusResponse = await api.get(`/track/next_status/${id}`);
        setStatus(nextStatusResponse.data);
      }
    } catch (err) {
      console.error("Error updating status:", err);
      setError(err.response?.data?.message || "Failed to update status");
    }
  };

  const fetchResearchAreas = async () => {
    try {
      const cached = filterCache.get();
      if (cached.researchAreas) {
        const formattedAreas = cached.researchAreas
          .map((area) => ({
            research_area_id: area.id,
            research_area_name: area.name,
          }))
          .sort((a, b) =>
            a.research_area_name.localeCompare(b.research_area_name)
          ); // Sort alphabetically
        setResearchAreas(formattedAreas);
      }
    } catch (error) {
      console.error("Error fetching research areas:", error);
    }
  };

  const handleEdit = async (item) => {
    try {
      setHeader("Edit Research Information");
      // Temporarily disable change detection while setting up initial data
      setHasChanges(false);

      await fetchResearchAreas();
      const matchingResearchType = researchTypes.find(
        (type) => type.research_type_name === item.research_type
      );

      // Extract just the filenames without the full path
      const manuscriptFileName = item.full_manuscript
        ? item.full_manuscript.split("/").pop().split("\\").pop()
        : null;

      const extendedAbstractFileName = item.extended_abstract
        ? item.extended_abstract.split("/").pop().split("\\").pop()
        : null;

      // Store the original file paths
      setFile(
        manuscriptFileName
          ? {
              name: manuscriptFileName,
              isExisting: true,
              path: item.full_manuscript,
            }
          : null
      );

      setExtendedAbstract(
        extendedAbstractFileName
          ? {
              name: extendedAbstractFileName,
              isExisting: true,
              path: item.extended_abstract,
            }
          : null
      );

      // Parse existing SDGs and match them with their titles
      const existingSDGs =
        item.sdg && item.sdg !== "Not Specified"
          ? item.sdg
              .split(";")
              .map((sdgString) => {
                const match = sdgString.trim().match(/SDG\s+(\d+)/);
                if (match) {
                  const sdgNumber = match[1];
                  const sdgGoal = sdgGoalsData.sdgGoals.find(
                    (goal) => goal.id === `SDG ${sdgNumber}`
                  );
                  return sdgGoal || null;
                }
                return null;
              })
              .filter((sdg) => sdg !== null)
          : [];

      // Format school year using item.year instead of item.school_year
      const startYear = item.year?.toString();
      const formattedSchoolYear = startYear
        ? `${startYear}-${parseInt(startYear) + 1}`
        : "";

      // Set all the state updates at once
      setEditableData({
        research_id: item.research_id,
        title: item.title,
        college_id: item.college_id,
        program_id: item.program_id,
        abstract: item.abstract,
        research_type: matchingResearchType ? matchingResearchType.id : "FD",
        date_approved: item.date_approved
          ? new Date(item.date_approved).toISOString().split("T")[0]
          : "",
        sdgs: existingSDGs,
        keywords: item.keywords || [],
        authors: item.authors || [],
        adviser: item.adviser || null,
        panels: item.panels || [],
        file: manuscriptFileName
          ? {
              name: manuscriptFileName,
              isExisting: true,
              path: item.full_manuscript,
            }
          : null,
        extended_abstract: extendedAbstractFileName
          ? {
              name: extendedAbstractFileName,
              isExisting: true,
              path: item.extended_abstract,
            }
          : null,
        research_areas: item.research_areas || [],
        full_manuscript: manuscriptFileName,
        extended_abstract: extendedAbstractFileName,
        school_year: startYear,
        term: item.term?.toString(),
      });

      setSelectedSDGs(existingSDGs);
      setKeywords(item.keywords || []);
      setIsEditMode(true);

      // Use cached data for colleges and programs
      const cached = filterCache.get();
      if (cached) {
        setColleges(cached.colleges);
        const filteredPrograms = cached.programs.filter(
          (program) => program.college_id === item.college_id
        );
        setPrograms(filteredPrograms);
      } else {
        await fetchDeptProg();
        if (item.college_id) {
          const response = await api.get(
            `/deptprogs/programs/${item.college_id}`
          );
          setPrograms(response.data.programs);
        }
      }

      // Set the select fields
      setSchoolYear(startYear);
      setTerm(item.term?.toString());

      // Reset hasChanges after all state updates
      setTimeout(() => {
        setHasChanges(false);
      }, 100);
    } catch (error) {
      console.error("Error setting up edit mode:", error);
    }
  };

  const handleCheckChanges = () => {
    // First check if all required fields are filled
    if (!validateRequiredFields()) {
      setHasChanges(false);
      return false;
    }

    // Get the original data from the current dataset
    const originalData = data.dataset.find(
      (item) => item.research_id === editableData.research_id
    );

    // Compare abstract (trim whitespace to ensure accurate comparison)
    const abstractChanged =
      (originalData.abstract || "").trim() !==
      (editableData.abstract || "").trim();

    // Compare keywords (sort arrays to ensure order doesn't matter)
    const originalKeywords = [...(originalData.keywords || [])].sort();
    const currentKeywords = [...(keywords || [])].sort();
    const keywordsChanged =
      JSON.stringify(originalKeywords) !== JSON.stringify(currentKeywords);

    // Compare SDGs
    const originalSDGs = originalData.sdg
      ? originalData.sdg
          .split(";")
          .map((sdg) => sdg.trim())
          .filter((sdg) => sdg)
          .sort()
      : [];

    const currentSDGs = selectedSDGs
      .map((sdg) => sdg.id)
      .filter((sdg) => sdg)
      .sort();

    const sdgsChanged =
      JSON.stringify(originalSDGs) !== JSON.stringify(currentSDGs);

    // Compare research areas
    const originalAreas = [...(originalData.research_areas || [])]
      .map((ra) => ra.research_area_id)
      .sort();
    const currentAreas = [...(editableData.research_areas || [])]
      .map((ra) => ra.research_area_id)
      .sort();
    const areasChanged =
      JSON.stringify(originalAreas) !== JSON.stringify(currentAreas);

    // Check file changes - only consider it a change if there's a new file
    const filesChanged =
      (file?.file && !file.isExisting) ||
      (extendedAbstract?.file && !extendedAbstract.isExisting);

    // Don't allow saving if files were deleted without new uploads
    const filesDeleted =
      (originalData.full_manuscript &&
        !file &&
        !editableData.full_manuscript) ||
      (originalData.extended_abstract &&
        !extendedAbstract &&
        !editableData.extended_abstract);

    const changes =
      (abstractChanged ||
        keywordsChanged ||
        sdgsChanged ||
        areasChanged ||
        filesChanged) &&
      !filesDeleted;

    setHasChanges(changes);
    return changes;
  };

  // Add effect to check for changes when relevant states update
  useEffect(() => {
    if (editableData) {
      handleCheckChanges();
    }
  }, [editableData, keywords, selectedSDGs, file, extendedAbstract]);

  const handleCancelEdit = () => {
    if (handleCheckChanges()) {
      setShowCancelDialog(true);
    } else {
      setIsEditMode(false);
      setEditableData(null);
      setFile(null);
      setExtendedAbstract(null);
      setHeader("Research Information");
    }
  };

  const handleSaveChanges = async () => {
    try {
      const formData = new FormData();

      // Add basic fields
      formData.append("abstract", editableData.abstract || "");

      // Format and add SDGs
      if (selectedSDGs && selectedSDGs.length > 0) {
        const sdgString = selectedSDGs
          .map((sdg) => sdg.id)
          .sort() // Sort to maintain consistent order
          .join(";");
        formData.append("sdg", sdgString);
      } else {
        formData.append("sdg", ""); // Send empty string if no SDGs selected
      }

      // Add keywords if they exist
      if (keywords && keywords.length > 0) {
        formData.append("keywords", keywords.join(";"));
      } else {
        formData.append("keywords", "");
      }

      // Add research areas if they exist
      if (
        editableData.research_areas &&
        editableData.research_areas.length > 0
      ) {
        const researchAreaIds = editableData.research_areas
          .map((area) => area.research_area_id)
          .join(";");
        formData.append("research_areas", researchAreaIds);
      } else {
        formData.append("research_areas", "");
      }

      // Handle file uploads with the new structure
      if (file && !file.isExisting) {
        formData.append("file", file.file);
      }
      if (extendedAbstract && !extendedAbstract.isExisting) {
        formData.append("extended_abstract", extendedAbstract.file);
      }

      // Make the API call
      const response = await api.put(
        `/paper/update_paper/${editableData.research_id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      // Show success dialog instead of alert
      setIsSuccessDialogOpen(true);
      setIsEditMode(false);
      setEditableData(null);
      setFile(null);
      setExtendedAbstract(null);
      setHeader("Research Information");

      // Refresh the data
      const refreshResponse = await api.get(
        `/dataset/fetch_ordered_dataset/${id}`
      );
      setData({ dataset: refreshResponse.data.dataset || [] });
    } catch (error) {
      console.error("Error updating paper:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        alert(
          `Failed to update paper: ${
            error.response.data.error || "Unknown error"
          }`
        );
      } else {
        alert("Failed to update paper. Please try again.");
      }
    }
  };

  const fetchDeptProg = async () => {
    try {
      // Try to get from cache first
      const cached = filterCache.get();
      if (cached) {
        setColleges(cached.colleges);
        setPrograms(cached.programs);
        return;
      }

      // If not in cache, fetch and cache the data
      const data = await fetchAndCacheFilterData();
      setColleges(data.colleges);
      setPrograms(data.programs);
    } catch (error) {
      console.error("Error fetching colleges:", error);
    }
  };

  const handleCollegeChange = async (event) => {
    const selectedCollegeId = event.target.value;
    setEditableData((prev) => ({ ...prev, college_id: selectedCollegeId }));

    // Get programs from cache instead of making API call
    const cached = filterCache.get();
    if (cached) {
      const filteredPrograms = cached.programs.filter(
        (program) => program.college_id === selectedCollegeId
      );
      setPrograms(filteredPrograms);
    } else {
      // Fallback to API call if cache is missing
      try {
        const response = await api.get(
          `/deptprogs/programs/${selectedCollegeId}`
        );
        setPrograms(response.data.programs);
      } catch (error) {
        console.error("Error fetching programs:", error);
      }
    }
  };

  const handleAuthorSearch = async (query) => {
    if (query.length > 2) {
      try {
        const response = await api.get("/accounts/search_user", {
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
        const response = await api.get("/accounts/search_user", {
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
        const response = await api.get("/accounts/search_user", {
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
      setFile({
        name: selectedFile.name,
        file: selectedFile,
        isExisting: false,
      });
    } else {
      alert("Please select a PDF file");
      setFile(null);
    }
  };

  const onSelectFileHandlerEA = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setExtendedAbstract({
        name: selectedFile.name,
        file: selectedFile,
        isExisting: false,
      });
    } else {
      alert("Please select a PDF file");
      setExtendedAbstract(null);
    }
  };

  const onDeleteFileHandler = (type) => {
    if (type === "manuscript") {
      setFile(null);
    } else if (type === "extended_abstract") {
      setExtendedAbstract(null);
    }
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

  useEffect(() => {
    const fetchResearchTypes = async () => {
      const cached = filterCache.get();
      if (cached && cached.researchTypes) {
        setResearchTypes(cached.researchTypes);
      }
    };

    fetchResearchTypes();
  }, []);

  // Update the validateRequiredFields function
  const validateRequiredFields = () => {
    // Check if abstract is empty or only whitespace
    if (!editableData.abstract?.trim()) {
      return false;
    }

    // Check if SDGs are selected
    if (!selectedSDGs || selectedSDGs.length === 0) {
      return false;
    }

    // Check if keywords are present
    if (!keywords || keywords.length === 0) {
      return false;
    }

    // Check if research areas are selected
    if (
      !editableData.research_areas ||
      editableData.research_areas.length === 0
    ) {
      return false;
    }

    return true;
  };

  return (
    <>
      <Box
        sx={{
          margin: 0,
          padding: 0,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <Navbar />
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            height: "calc(100% - 6rem)",
            overflow: "hidden",
          }}
        >
          <HeaderWithBackButton title={header} onBack={() => navigate(-1)} />

          {/*Main Content */}
          <Box
            sx={{
              padding: 5,
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
                                sm: "clamp(1.25rem, 3.5vw, 1.25rem)",
                                md: "clamp(2rem, 4vw, 2rem)",
                              },
                            }}
                          >
                            {item.title}
                          </Typography>
                          <Typography
                            variant='h6'
                            sx={{
                              mb: "0.25rem",
                              fontSize: {
                                xs: "clamp(0.9rem, 2vw, 0.9rem)",
                                sm: "clamp(0.9rem, 3.5vw, 0.9rem)",
                                md: "clamp(1rem, 4vw, 1rem)",
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
                              color: "#8B8B8B",
                              fontSize: {
                                xs: "clamp(0.8rem, 2vw, 0.8rem)",
                                sm: "clamp(0.85rem, 3.5vw, 0.85rem)",
                                md: "clamp(0.9rem, 4vw, 0.9rem)",
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
                            mr='1rem'
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
                                {item.download_count} Download(s)
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
                                {item.view_count} View(s)
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
                          display='flex'
                          direction={
                            isMobile || isSizeMobile ? "column" : "row"
                          }
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
                                mb: "0.5rem",
                                fontSize: {
                                  xs: "0.75rem",
                                  md: "0.75rem",
                                  lg: "1.1rem",
                                },
                              }}
                            >
                              Research Areas:
                            </Typography>
                            <Typography
                              variant='body1'
                              sx={{
                                fontSize: {
                                  xs: "0.6rem",
                                  md: "0.7rem",
                                  lg: "0.8rem",
                                },
                                mb: "1.5rem",
                              }}
                            >
                              {Array.isArray(item.research_areas) &&
                              item.research_areas.length > 0
                                ? item.research_areas
                                    .map((area) => area.research_area_name)
                                    .join("; ")
                                : "No research areas available"}
                            </Typography>
                            <Typography
                              variant='h6'
                              fontWeight='700'
                              sx={{
                                mb: "0.5rem",
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
                                  lg: "0.8rem",
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
                                mt: "1.5rem",
                                mb: "0.5rem",
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
                                  lg: "0.8rem",
                                },
                              }}
                            >
                              {item.abstract || "No abstract available"}
                            </Typography>
                          </Grid2>
                          <Grid2
                            size={isMobile || isSizeMobile ? 12 : 4}
                            justifyContent='flex-end'
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
                                padding: 2.5,
                                height: "auto",
                              }}
                            >
                              <Typography
                                variant='h7'
                                sx={{
                                  mb: "0.5rem",
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
                                  mb: "0.5rem",
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
                                variant='body1'
                                sx={{
                                  mb: "0.5rem",
                                  fontSize: {
                                    xs: "0.6rem",
                                    md: "0.65rem",
                                    lg: "0.8rem",
                                  },
                                }}
                              >
                                <strong>Adviser:</strong>{" "}
                                {(item.adviser?.name &&
                                  item.adviser.name.trim()) ||
                                  "No adviser"}
                              </Typography>
                              <Typography
                                variant='body1'
                                sx={{
                                  mb: "0.5rem",
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
                              <Divider
                                variant='middle'
                                sx={{ mb: "1rem", mt: "0.5rem" }}
                              />
                              <Typography
                                variant='body1'
                                sx={{
                                  mb: "0.5rem",
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
                                  mb: "0.5rem",
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
                                  mb: "0.5rem",
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
                            <FormControl fullWidth variant='outlined'>
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
                                label='Research Type'
                                sx={createTextFieldStyles()}
                                value={editableData.research_type || ""}
                                disabled={true}
                                onChange={(e) => {
                                  setEditableData((prev) => ({
                                    ...prev,
                                    research_type: e.target.value,
                                  }));
                                }}
                              >
                                {researchTypes.map((type) => (
                                  <MenuItem
                                    key={type.id}
                                    value={type.id}
                                    sx={{
                                      fontSize: {
                                        xs: "0.75rem",
                                        md: "0.75rem",
                                        lg: "0.8rem",
                                      },
                                    }}
                                  >
                                    {type.name}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Grid2>
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
                          <Grid2 size={2.5}>
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
                          <Grid2 size={2.5}>
                            <FormControl
                              fullWidth
                              variant='outlined'
                              disabled={user.role !== "05"}
                            >
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
                                disabled={true}
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

                          <Grid2 size={1.5}>
                            <FormControl fullWidth>
                              <InputLabel>School Year</InputLabel>
                              <Select
                                value={editableData?.school_year || ""}
                                onChange={(e) => {
                                  setEditableData((prev) => ({
                                    ...prev,
                                    school_year: e.target.value,
                                  }));
                                  setSchoolYear(e.target.value);
                                }}
                                label='School Year'
                                notched
                                disabled={true}
                                sx={createTextFieldStyles()}
                              >
                                {schoolYears.map((year) => (
                                  <MenuItem
                                    key={year}
                                    value={year.split("-")[0]}
                                  >
                                    {year}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Grid2>
                          <Grid2 size={1.5}>
                            <FormControl fullWidth>
                              <InputLabel>Term</InputLabel>
                              <Select
                                value={editableData?.term || ""}
                                onChange={(e) => {
                                  setEditableData((prev) => ({
                                    ...prev,
                                    term: e.target.value,
                                  }));
                                  setTerm(e.target.value);
                                }}
                                label='Term'
                                notched
                                disabled={true}
                                sx={createTextFieldStyles()}
                              >
                                {terms.map((termOption) => (
                                  <MenuItem
                                    key={termOption.value}
                                    value={termOption.value}
                                  >
                                    {termOption.display}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Grid2>
                          <Grid2 size={4}>
                            <Autocomplete
                              multiple
                              disabled={true}
                              value={editableData.authors}
                              options={[]} // No need for options since it's disabled
                              getOptionLabel={(option) =>
                                option.name
                                  ? `${option.name} (${option.email})`
                                  : `${option.first_name} ${option.last_name} (${option.email})`
                              }
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label='Authors'
                                  variant='outlined'
                                  sx={createTextFieldStyles()}
                                  InputLabelProps={createInputLabelProps()}
                                />
                              )}
                            />
                          </Grid2>
                          <Grid2 size={4}>
                            <Autocomplete
                              disabled={true}
                              value={editableData.adviser}
                              options={[]} // No need for options since it's disabled
                              getOptionLabel={(option) =>
                                option?.name
                                  ? `${option.name} (${option.email})`
                                  : option
                                  ? `${option.first_name} ${option.last_name} (${option.email})`
                                  : ""
                              }
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label='Adviser'
                                  variant='outlined'
                                  sx={createTextFieldStyles()}
                                  InputLabelProps={createInputLabelProps()}
                                />
                              )}
                            />
                          </Grid2>
                          <Grid2 size={4}>
                            <Autocomplete
                              multiple
                              disabled={true}
                              value={editableData.panels}
                              options={[]} // No need for options since it's disabled
                              getOptionLabel={(option) =>
                                option.name
                                  ? `${option.name} (${option.email})`
                                  : `${option.first_name} ${option.last_name} (${option.email})`
                              }
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label='Panel Members'
                                  variant='outlined'
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
                              value={editableData.title || ""}
                              disabled={true}
                              sx={createTextFieldStyles()}
                              InputLabelProps={createInputLabelProps()}
                            />
                          </Grid2>
                          <Grid2 size={6}>
                            <Autocomplete
                              multiple
                              value={selectedSDGs}
                              disableCloseOnSelect
                              onChange={(event, newValue) =>
                                setSelectedSDGs(newValue)
                              }
                              options={sdgGoalsData.sdgGoals}
                              getOptionLabel={(option) =>
                                `${option.id} - ${option.title}`
                              }
                              isOptionEqualToValue={(option, value) =>
                                option.id === value.id
                              }
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label='SDG Goals'
                                  required
                                  variant='outlined'
                                  helperText='Select one or more SDGs'
                                  sx={createTextFieldStyles()}
                                  InputLabelProps={createInputLabelProps()}
                                />
                              )}
                              renderTags={(value, getTagProps) =>
                                value.map((option, index) => (
                                  <Chip
                                    label={`${option.id} - ${option.title}`}
                                    {...getTagProps({ index })}
                                    sx={{
                                      backgroundColor: "#f0f0f0",
                                      margin: "2px",
                                      "& .MuiChip-deleteIcon": {
                                        color: "#666",
                                      },
                                    }}
                                  />
                                ))
                              }
                              renderOption={(props, option) => (
                                <li {...props}>
                                  {`${option.id} - ${option.title}`}
                                </li>
                              )}
                              ListboxProps={{
                                sx: {
                                  maxHeight: "250px",
                                },
                              }}
                              sx={{
                                "& .MuiAutocomplete-tag": {
                                  maxWidth: "calc(100% - 8px)",
                                },
                              }}
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
                                  required
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
                              required
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
                          <Grid2 size={6}>
                            <Autocomplete
                              multiple
                              value={editableData.research_areas || []}
                              disableCloseOnSelect
                              onChange={(event, newValue) => {
                                setEditableData((prev) => ({
                                  ...prev,
                                  research_areas: newValue,
                                }));
                              }}
                              options={researchAreas || []}
                              getOptionLabel={(option) =>
                                option.research_area_name || ""
                              }
                              isOptionEqualToValue={(option, value) =>
                                option.research_area_id ===
                                value.research_area_id
                              }
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label='Research Areas'
                                  required
                                  variant='outlined'
                                  helperText='Select one or more research areas'
                                  sx={createTextFieldStyles()}
                                  InputLabelProps={createInputLabelProps()}
                                />
                              )}
                              sx={{
                                "& .MuiAutocomplete-input": {
                                  fontSize: {
                                    xs: "0.6rem",
                                    sm: "0.7rem",
                                    md: "0.8rem",
                                    lg: "0.8rem",
                                  },
                                },
                              }}
                            />
                          </Grid2>
                          <Grid2 size={6}></Grid2>
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
                                onFileSelect={onSelectFileHandler}
                                onFileDelete={() =>
                                  onDeleteFileHandler("manuscript")
                                }
                                selectedFile={file?.file}
                              />
                            </Box>
                            {editableData.full_manuscript && (
                              <Typography
                                variant='body2'
                                sx={{
                                  textAlign: "center",
                                  mt: 1,
                                  fontSize: {
                                    xs: "0.5rem",
                                    md: "0.6rem",
                                    lg: "0.75rem",
                                  },
                                  color: "#666",
                                }}
                              >
                                Current file: {editableData.full_manuscript}
                              </Typography>
                            )}
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
                                marginTop: "0.5rem",
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
                                onFileSelect={onSelectFileHandlerEA}
                                onFileDelete={() =>
                                  onDeleteFileHandler("extended_abstract")
                                }
                                selectedFile={extendedAbstract?.file}
                              />
                            </Box>
                            {editableData.extended_abstract && (
                              <Typography
                                variant='body2'
                                sx={{
                                  textAlign: "center",
                                  mt: 1,
                                  fontSize: {
                                    xs: "0.5rem",
                                    md: "0.6rem",
                                    lg: "0.75rem",
                                  },
                                  color: "#666",
                                }}
                              >
                                Current file: {editableData.extended_abstract}
                              </Typography>
                            )}
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
                                marginTop: "0.5rem",
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
                                fontSize: { xs: "0.875rem", md: "0.9rem" },
                                padding: {
                                  xs: "0.5rem 1rem",
                                  md: "0.5rem 0.8rem",
                                },
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
                              disabled={
                                !hasChanges || !validateRequiredFields()
                              }
                              sx={{
                                backgroundColor: "#CA031B",
                                color: "#FFF",
                                fontFamily: "Montserrat, sans-serif",
                                fontWeight: 600,
                                textTransform: "none",
                                fontSize: { xs: "0.875rem", md: "0.9rem" },
                                padding: {
                                  xs: "0.5rem 1rem",
                                  md: "0.5rem 0.8rem",
                                },
                                borderRadius: "100px",
                                maxHeight: "3rem",
                                "&:hover": {
                                  backgroundColor: "#A30417",
                                  color: "#FFF",
                                },
                                "&:disabled": {
                                  backgroundColor: "#ccc",
                                  color: "#666",
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
      <Dialog
        open={showCancelDialog}
        onClose={() => setShowCancelDialog(false)}
        PaperProps={{
          sx: {
            borderRadius: "15px",
            padding: "1rem",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 600,
            color: "#08397C",
          }}
        >
          Unsaved Changes
        </DialogTitle>
        <DialogContent>
          <Typography
            sx={{
              fontFamily: "Montserrat, sans-serif",
              color: "#666",
            }}
          >
            You have unsaved changes. Are you sure you want to cancel editing?
            All changes will be lost.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setShowCancelDialog(false)}
            sx={{
              backgroundColor: "#08397C",
              color: "#FFF",
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 600,
              textTransform: "none",
              borderRadius: "100px",
              padding: "0.75rem",
              "&:hover": {
                backgroundColor: "#072d61",
              },
            }}
          >
            Continue Editing
          </Button>
          <Button
            onClick={() => {
              setShowCancelDialog(false);
              setIsEditMode(false);
              setEditableData(null);
              setFile(null);
              setExtendedAbstract(null);
            }}
            sx={{
              backgroundColor: "#CA031B",
              color: "#FFF",
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 600,
              textTransform: "none",
              borderRadius: "100px",
              padding: "0.75rem",
              "&:hover": {
                backgroundColor: "#A30417",
              },
            }}
            autoFocus
          >
            Discard Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Dialog */}
      <Dialog
        open={isSuccessDialogOpen}
        onClose={() => setIsSuccessDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: "15px",
            padding: "1rem",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 600,
            color: "#008000",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Box
            component='span'
            sx={{
              backgroundColor: "#E8F5E9",
              borderRadius: "75%",
              padding: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CheckCircleIcon />
          </Box>
          Success
        </DialogTitle>
        <DialogContent>
          <Typography
            sx={{
              fontFamily: "Montserrat, sans-serif",
              color: "#666",
              mt: 1,
            }}
          >
            Paper has been successfully updated.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ padding: "1rem" }}>
          <Button
            onClick={() => setIsSuccessDialogOpen(false)}
            sx={{
              backgroundColor: "#08397C",
              color: "#FFF",
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 600,
              textTransform: "none",
              borderRadius: "100px",
              padding: "0.75rem",
              "&:hover": {
                backgroundColor: "#072d61",
              },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DisplayResearchInfo;
