import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Button,
  Grid2,
  Modal,
  TextField,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  IconButton,
  Autocomplete,
  Tooltip,
  FormHelperText,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import api from "../services/api";
import { useModalContext } from "../context/modalcontext";
import FileUploader from "./FileUploader";
import sdgGoalsData from "../data/sdgGoals.json";
import { useAuth } from "../context/AuthContext";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { filterCache, fetchAndCacheFilterData } from "../utils/filterCache";
import { toast } from "react-hot-toast";
import { debounce } from "lodash";

const AddPaperModal = ({ isOpen, handleClose, onPaperAdded }) => {
  const [colleges, setColleges] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [selectedCollege, setSelectedCollege] = useState("");
  const [selectedProgram, setSelectedProgram] = useState("");
  const [researchType, setResearchType] = useState("FD");
  const [schoolYear, setSchoolYear] = useState("");
  const [term, setTerm] = useState("");
  const [title, setTitle] = useState("");
  const [groupCode, setGroupCode] = useState("");
  const [abstract, setAbstract] = useState("");
  const [adviser, setAdviser] = useState(null);
  const [adviserInputValue, setAdviserInputValue] = useState("");
  const [authorInputValue, setAuthorInputValue] = useState("");
  const [panels, setPanels] = useState([]);
  const [panelInputValue, setPanelInputValue] = useState("");
  const [keywords, setKeywords] = useState([]); // Change to array for multiple keywords
  const [authors, setAuthors] = useState([]); // Change to array for multiple authors
  const [authorOptions, setAuthorOptions] = useState([]);
  const [adviserOptions, setAdviserOptions] = useState([]);
  const [panelOptions, setPanelOptions] = useState([]);
  const { isAddPaperModalOpen, closeAddPaperModal, openAddPaperModal } =
    useModalContext();
  const [file, setFile] = useState(null);
  const [extendedAbstract, setExtendedAbstract] = useState(null);
  const [selectedSDGs, setSelectedSDGs] = useState([]);
  const { user } = useAuth();
  const [researchAreas, setResearchAreas] = useState([]);
  const [selectedResearchAreas, setSelectedResearchAreas] = useState([]);
  const [isModelPredicting, setIsModelPredicting] = useState(false);
  const [researchTypes, setResearchTypes] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [isDuplicateCode, setIsDuplicateCode] = useState(false);
  const [isDuplicateTitle, setIsDuplicateTitle] = useState(false);
  const [isDuplicateAuthors, setIsDuplicateAuthors] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [shouldClearFields, setShouldClearFields] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [isDuplicateDialogOpen, setIsDuplicateDialogOpen] = useState(false);
  const [isConfirmDuplicateTitleOpen, setIsConfirmDuplicateTitleOpen] =
    useState(false);
  const [isAwaitingConfirmation, setIsAwaitingConfirmation] = useState(false);

  // Create array of school years (last 10 years)
  const currentYear = new Date().getFullYear();
  const schoolYears = Array.from({ length: 10 }, (_, i) => {
    const year = currentYear - i;
    return `${year}-${year + 1}`;
  });

  // Create array of terms with their corresponding values
  const terms = [
    { display: "1st", value: "1" },
    { display: "2nd", value: "2" },
    { display: "3rd", value: "3" },
  ];

  // Fetch research types from the API
  useEffect(() => {
    const fetchResearchTypes = async () => {
      const cached = filterCache.get();
      if (cached.researchTypes) {
        setResearchTypes(cached.researchTypes);
      }
    };

    fetchResearchTypes();
  }, []);

  // Add console logs to debug user data
  useEffect(() => {
    console.log("Current user:", user);
    console.log("Is modal open:", isAddPaperModalOpen);
    console.log("User role:", user?.role);
    console.log("User researcher data:", user?.researcher);
  }, [user, isAddPaperModalOpen]);

  // Fetch colleges when modal opens
  useEffect(() => {
    if (isAddPaperModalOpen) {
      const loadFilterData = async () => {
        try {
          // Try to get from cache first
          const cached = filterCache.get();
          if (cached) {
            setColleges(cached.colleges);
            setPrograms(cached.programs);
            return;
          }

          // If not in cache, fetch and cache
          const data = await fetchAndCacheFilterData();
          setColleges(data.colleges);
          setPrograms(data.programs);
        } catch (error) {
          console.error("Error loading filter data:", error);
        }
      };

      loadFilterData();
    }
  }, [isAddPaperModalOpen]);

  // Update your handleCollegeChange to use cached programs
  const handleCollegeChange = (event) => {
    const selectedCollegeId = event.target.value;
    setSelectedCollege(selectedCollegeId);

    // Filter programs from cache instead of fetching
    const cached = filterCache.get();
    if (cached) {
      const filteredPrograms = cached.programs.filter(
        (program) => program.college_id === selectedCollegeId
      );
      setPrograms(filteredPrograms);
    } else {
      // Fallback to API call if cache is missing
      fetchProgramsByCollege(selectedCollegeId);
    }

    setSelectedProgram(""); // Reset selected program
  };

  // Keep fetchProgramsByCollege as fallback
  const fetchProgramsByCollege = async (collegeId) => {
    if (collegeId) {
      try {
        const response = await api.get(`/deptprogs/programs/${collegeId}`);
        setPrograms(response.data.programs);
      } catch (error) {
        console.error("Error fetching programs by college:", error);
      }
    } else {
      setPrograms([]);
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
        const response = await api.get(
          `/accounts/search_user/${selectedCollege}`,
          {
            params: {
              query,
            },
          }
        );
        setAdviserOptions(response.data.users);
        console.log("advisers: ", response.data.users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    } else {
      setAdviserOptions([]);
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
    } else {
      setPanelOptions([]);
    }
  };

  const onSelectFileHandler = (e) => {
    setFile(e.target.files[0]);
  };

  const onSelectFileHandlerEA = (e) => {
    setExtendedAbstract(e.target.files[0]);
  };

  const onDeleteFileHandler = () => {
    setFile(null);
  };

  const onDeleteFileHandlerEA = () => {
    setExtendedAbstract(null);
  };

  const handleKeywordsChange = (event, newValue) => {
    setKeywords(newValue);
  };

  const validateForm = () => {
    const errors = {};

    // Required field validation
    if (!groupCode) errors.groupCode = "Group Code is required";
    if (!schoolYear || schoolYear.length !== 9) {
      errors.schoolYear = "School Year must be in YYYY-YYYY format";
    } else if (!validateSchoolYear(schoolYear)) {
      errors.schoolYear = "Invalid school year format";
    }
    if (!term) errors.term = "Term is required";
    if (authors.length === 0)
      errors.authors = "At least one author is required";
    if (!title) errors.title = "Title is required";
    if (!abstract) errors.abstract = "Abstract is required";
    if (!file) errors.manuscript = "Full Manuscript is required";
    if (!extendedAbstract)
      errors.extendedAbstract = "Extended Abstract is required";
    if (selectedSDGs.length === 0)
      errors.sdgs = "At least one SDG Goal is required";
    if (selectedResearchAreas.length === 0)
      errors.researchAreas = "At least one Research Area is required";

    // Special validation for FD research type
    if (researchType === "FD") {
      if (!adviser)
        errors.adviser = "Adviser is required for Faculty Directed research";
      if (panels.length === 0)
        errors.panels =
          "At least one Panel member is required for Faculty Directed research";
    }

    setFormErrors(attemptedSubmit ? errors : {});
    const errorCount = Object.keys(errors).length;

    // Update isValid based on errors and duplicate checks
    setIsValid(
      errorCount === 0 &&
        !isDuplicateCode &&
        !(isDuplicateTitle && isDuplicateAuthors)
    );

    return errorCount;
  };

  // Add useEffect to validate form when relevant fields change
  useEffect(() => {
    validateForm();
  }, [
    groupCode,
    schoolYear,
    term,
    authors,
    title,
    abstract,
    file,
    extendedAbstract,
    selectedSDGs,
    selectedResearchAreas,
    adviser,
    panels,
    researchType,
    isDuplicateCode,
    isDuplicateTitle,
    isDuplicateAuthors,
  ]);

  const handleBack = () => {
    if (isSubmitting) {
      return;
    }

    const hasChanges =
      groupCode ||
      schoolYear.length ||
      title ||
      abstract ||
      authors.length > 0 ||
      keywords.length > 0 ||
      selectedSDGs.length > 0 ||
      selectedResearchAreas.length > 0 ||
      file ||
      extendedAbstract ||
      (researchType === "FD" && (adviser || panels.length > 0));

    if (hasChanges) {
      setIsConfirmDialogOpen(true);
    } else {
      setShouldClearFields(true);
      closeAddPaperModal();
    }
  };

  // Add this validation function
  const validateSchoolYear = (input) => {
    const regex = /^(\d{4})-(\d{4})$/;
    const match = input.match(regex);

    if (!match) return false;

    const startYear = parseInt(match[1]);
    const endYear = parseInt(match[2]);
    const currentYear = new Date().getFullYear();
    const minimumYear = 2011; // Add minimum year constant

    return (
      startYear <= currentYear &&
      endYear === startYear + 1 &&
      startYear >= minimumYear && // Add minimum year check
      startYear <= 9999
    );
  };

  const handleAddPaper = async () => {
    setAttemptedSubmit(true);

    // Check for duplicate paper first
    if (isDuplicateTitle && isDuplicateAuthors) {
      setIsDuplicateDialogOpen(true);
      return;
    }

    // If title is duplicate but authors are different, show confirmation dialog
    if (isDuplicateTitle && !isDuplicateAuthors && !isAwaitingConfirmation) {
      setIsConfirmDuplicateTitleOpen(true);
      return;
    }

    setIsSubmitting(true);
    toast.dismiss();

    const formData = new FormData();

    // Extract the first year from the school year input
    const startYear = schoolYear.split("-")[0];

    // Add new data
    formData.append("research_id", groupCode);
    formData.append("college_id", selectedCollege);
    formData.append("program_id", selectedProgram);
    formData.append("title", title);
    formData.append("abstract", abstract);
    formData.append("school_year", startYear);
    formData.append("term", term);
    formData.append("research_type", researchType);
    formData.append("file", file);

    if (extendedAbstract) {
      formData.append("extended_abstract", extendedAbstract);
    }

    formData.append("sdg", selectedSDGs.map((sdg) => sdg.id).join(";"));
    formData.append("keywords", keywords.join(";"));

    authors.forEach((author) => {
      formData.append("author_ids", author.user_id);
    });

    if (researchType === "FD") {
      if (adviser) {
        formData.append("adviser_id", adviser.user_id);
      }
      panels.forEach((panel) => {
        formData.append("panel_ids", panel.user_id);
      });
    }

    formData.append(
      "research_areas",
      selectedResearchAreas.map((area) => area.research_area_id).join(";")
    );

    try {
      const response = await api.post("/paper/add_paper", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Show success dialog instead of toast
      setIsSuccessDialogOpen(true);

      if (onPaperAdded) {
        await onPaperAdded();
      }

      // Don't close the modal immediately - let user close via dialog
    } catch (error) {
      toast.error(error.response?.data?.error || "Error adding paper");
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuccessClose = () => {
    setIsSuccessDialogOpen(false);
    setShouldClearFields(true);
    closeAddPaperModal();
  };

  // Modify the useEffect that handles cleanup
  useEffect(() => {
    if (!isAddPaperModalOpen && shouldClearFields) {
      // Only clear if explicitly set
      setGroupCode("");
      setSelectedCollege("");
      setSelectedProgram("");
      setResearchType("FD");
      setSchoolYear("");
      setTerm("");
      setTitle("");
      setAbstract("");
      setAdviser(null);
      setAdviserInputValue("");
      setAuthorInputValue("");
      setPanelInputValue("");
      setPanels([]);
      setSelectedSDGs([]);
      setKeywords([]);
      setFile(null);
      setExtendedAbstract(null);
      setAuthors([]);
      setFormErrors({});
      setAttemptedSubmit(false);
      setSelectedResearchAreas([]);
      setAuthorOptions([]);
      setAdviserOptions([]);
      setPanelOptions([]);
      setShouldClearFields(false); // Reset the flag
    }
  }, [isAddPaperModalOpen, shouldClearFields]);

  // Initialize research type
  useEffect(() => {
    setResearchType("FD");
  }, []); // Run once when component mounts

  // Modify the program admin initialization effect
  useEffect(() => {
    const initializeProgramAdminDetails = async () => {
      if (isAddPaperModalOpen && user?.role === "05" && user?.college) {
        try {
          // Try to get from cache first
          const cached = filterCache.get();
          if (cached) {
            setColleges(cached.colleges);
            setPrograms(
              cached.programs.filter(
                (program) => program.college_id === user.college
              )
            );
          } else {
            // If not in cache, fetch and cache the data
            const data = await fetchAndCacheFilterData();
            setColleges(data.colleges);
            setPrograms(
              data.programs.filter(
                (program) => program.college_id === user.college
              )
            );
          }

          // Set the college/department
          setSelectedCollege(user.college || "");

          // Set the program
          if (user.program) {
            setSelectedProgram(user.program);
          }
        } catch (error) {
          console.error("Error initializing program admin details:", error);
        }
      }
    };

    initializeProgramAdminDetails();
  }, [isAddPaperModalOpen, user]);

  // Style for disabled Select components
  const disabledSelectStyle = {
    backgroundColor: "#f5f5f5",
    "& .MuiSelect-select": {
      color: "#666",
      fontStyle: "italic",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "#ccc",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "#ccc",
    },
    "&.Mui-disabled": {
      backgroundColor: "#f5f5f5",
      cursor: "not-allowed",
    },
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

  // Add this function to handle research type changes
  const handleResearchTypeChange = (event) => {
    setResearchType(event.target.value);
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
          );
        setResearchAreas(formattedAreas);
      }
    } catch (error) {
      console.error("Error fetching research areas:", error);
    }
  };

  const predictResearchAreas = async () => {
    if (!title || !abstract || !keywords.length) {
      alert(
        "Please fill in title, abstract, and keywords before predicting research areas"
      );
      return;
    }

    setIsModelPredicting(true);
    try {
      const response = await api.post("/paper/predict_research_areas", {
        title,
        abstract,
        keywords: keywords.join(", "),
      });

      if (response.data.predicted_areas) {
        // Find matching research areas from the full list
        const predictedAreas = response.data.predicted_areas
          .map((prediction) => {
            const matchingArea = researchAreas.find(
              (area) => area.research_area_name === prediction.name
            );
            return matchingArea;
          })
          .filter((area) => area !== undefined); // Remove any unmatched areas

        console.log("Predicted areas:", predictedAreas); // Debug log
        setSelectedResearchAreas(predictedAreas);
      }
    } catch (error) {
      console.error("Error predicting research areas:", error);
      alert(
        "Failed to predict research areas. Please try again or select manually."
      );
    } finally {
      setIsModelPredicting(false);
    }
  };

  // Add this useEffect to fetch research areas when component mounts
  useEffect(() => {
    fetchResearchAreas();
  }, []);

  // Add this CSS for the spinner animation
  const spinnerStyles = {
    "@keyframes spin": {
      "0%": { transform: "rotate(0deg)" },
      "100%": { transform: "rotate(360deg)" },
    },
  };

  // Create debounced check functions
  const debouncedCheckDuplicateCode = useMemo(
    () =>
      debounce(async (code) => {
        if (code.length > 0) {
          try {
            const response = await api.get(`/paper/check_duplicate`, {
              params: { group_code: code },
            });
            setIsDuplicateCode(response.data.isDuplicate);
          } catch (error) {
            console.error("Error checking duplicate code:", error);
          }
        } else {
          setIsDuplicateCode(false);
        }
      }, 500),
    []
  );

  const debouncedCheckDuplicates = useMemo(
    () =>
      debounce(async (title, authorIds) => {
        if (title.length > 0 && authorIds.length > 0) {
          try {
            const response = await api.get(`/paper/check_duplicate`, {
              params: {
                title: title,
                author_ids: authorIds.join(","),
              },
            });
            setIsDuplicateTitle(response.data.isDuplicateTitle);
            setIsDuplicateAuthors(response.data.isDuplicateAuthors);
          } catch (error) {
            console.error("Error checking duplicates:", error);
          }
        } else {
          setIsDuplicateTitle(false);
          setIsDuplicateAuthors(false);
        }
      }, 500),
    []
  );

  // Modify the existing handlers
  const handleGroupCodeChange = (e) => {
    const newCode = e.target.value;
    setGroupCode(newCode);
    debouncedCheckDuplicateCode(newCode);
  };

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    debouncedCheckDuplicates(
      newTitle,
      authors.map((author) => author.user_id)
    );
  };

  // Update the authors change handler in the Autocomplete component
  const handleAuthorsChange = (event, newValue) => {
    setAuthors(newValue);
    if (title) {
      debouncedCheckDuplicates(
        title,
        newValue.map((author) => author.user_id)
      );
    }
  };

  // Update the isFormValid function to properly check all fields
  const isFormValid = () => {
    // Check for required fields
    if (
      !groupCode ||
      !schoolYear ||
      schoolYear.length !== 9 ||
      !term ||
      authors.length === 0 ||
      !title ||
      !abstract ||
      !file ||
      !extendedAbstract ||
      selectedSDGs.length === 0 ||
      selectedResearchAreas.length === 0 ||
      keywords.length === 0
    ) {
      return false;
    }

    // Check for FD specific requirements
    if (researchType === "FD") {
      if (!adviser || panels.length === 0) {
        return false;
      }
    }

    // Check for any errors in form fields
    if (Object.values(formErrors).some((error) => error !== null)) {
      return false;
    }

    // Check for duplicate code
    if (isDuplicateCode) {
      return false;
    }

    // Check for duplicate title and authors combination
    if (isDuplicateTitle && isDuplicateAuthors) {
      return false;
    }

    return true;
  };

  return (
    <Modal
      open={isAddPaperModalOpen}
      onClose={isSubmitting ? undefined : handleBack} // Disable closing when submitting
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "auto",
      }}
    >
      <Box
        sx={{
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 5,
          borderRadius: 2,
          width: "auto",
          margin: "2rem",
          maxHeight: "90vh",
          overflowY: "auto",
          position: "relative",
          "&:focus": {
            outline: "none",
          },
        }}
      >
        <Typography
          variant='h3'
          color='#08397C'
          fontWeight='1000'
          mb={3}
          sx={{
            textAlign: { xs: "left", md: "bottom" },
            fontSize: {
              xs: "clamp(1rem, 2vw, 1rem)",
              sm: "clamp(1.5rem, 3.5vw, 1.5rem)",
              md: "clamp(2rem, 4vw, 2.25rem)",
            },
          }}
        >
          Add New Paper
        </Typography>
        <Typography
          variant='caption'
          color='text.secondary'
          sx={{ mb: 2, display: "block" }}
        >
          * Required fields
        </Typography>
        <Grid2 container spacing={2}>
          <Grid2 size={2}>
            <FormControl fullWidth error={!!formErrors.researchType}>
              <InputLabel required shrink>
                Research Type
              </InputLabel>
              <Select
                value={researchType}
                onChange={handleResearchTypeChange}
                label='Research Type'
                defaultValue='FD'
                sx={createTextFieldStyles()}
              >
                {researchTypes.map((type) => (
                  <MenuItem key={type.id} value={type.id}>
                    {type.name}
                  </MenuItem>
                ))}
              </Select>
              {formErrors.researchType && (
                <FormHelperText error>{formErrors.researchType}</FormHelperText>
              )}
            </FormControl>
          </Grid2>
          <Grid2 size={2}>
            <TextField
              fullWidth
              required
              label='Group Code'
              variant='outlined'
              value={groupCode}
              onChange={handleGroupCodeChange}
              error={
                isDuplicateCode || (attemptedSubmit && !!formErrors.groupCode)
              }
              helperText={
                isDuplicateCode
                  ? "This group code already exists"
                  : attemptedSubmit && formErrors.groupCode
                  ? formErrors.groupCode
                  : "Maximum 15 characters"
              }
              inputProps={{ maxLength: 15 }}
              sx={createTextFieldStyles()}
              InputLabelProps={{
                shrink: true,
                required: true,
              }}
            />
          </Grid2>
          <Grid2 size={2.5}>
            <FormControl fullWidth error={!!formErrors.college}>
              <InputLabel required shrink>
                Department
              </InputLabel>
              <Select
                value={selectedCollege}
                onChange={handleCollegeChange}
                label='Department'
                disabled={user?.role === "05"}
                sx={{
                  ...disabledSelectStyle,
                  fontSize: { xs: "0.75rem", md: "0.75rem", lg: "0.8rem" },
                }}
              >
                {colleges.map((college) => (
                  <MenuItem
                    key={college.college_id}
                    value={college.college_id}
                    sx={{
                      fontSize: { xs: "0.75rem", md: "0.75rem", lg: "0.8rem" },
                    }}
                  >
                    {college.college_name}
                  </MenuItem>
                ))}
              </Select>
              {formErrors.college && (
                <FormHelperText error>{formErrors.college}</FormHelperText>
              )}
            </FormControl>
          </Grid2>
          <Grid2 size={2.5}>
            <FormControl fullWidth error={!!formErrors.program}>
              <InputLabel required shrink>
                Program
              </InputLabel>
              <Select
                value={selectedProgram}
                onChange={(e) => setSelectedProgram(e.target.value)}
                label='Program'
                disabled={user?.role === "05"}
                sx={{
                  ...disabledSelectStyle,
                  fontSize: { xs: "0.75rem", md: "0.75rem", lg: "0.8rem" },
                }}
              >
                {programs.map((program) => (
                  <MenuItem
                    key={program.program_id}
                    value={program.program_id}
                    sx={{
                      fontSize: { xs: "0.75rem", md: "0.75rem", lg: "0.8rem" },
                    }}
                  >
                    {program.program_name}
                  </MenuItem>
                ))}
              </Select>
              {formErrors.program && (
                <FormHelperText error>{formErrors.program}</FormHelperText>
              )}
            </FormControl>
          </Grid2>
          <Grid2 size={1.5}>
            <FormControl fullWidth error={!!formErrors.schoolYear}>
              <Autocomplete
                freeSolo
                options={schoolYears}
                value={schoolYear}
                onChange={(event, newValue) => {
                  setSchoolYear(newValue || "");
                  if (!newValue) {
                    setFormErrors((prev) => ({ ...prev, schoolYear: null }));
                    setIsValid(false);
                    return;
                  }
                  if (!validateSchoolYear(newValue)) {
                    setFormErrors((prev) => ({
                      ...prev,
                      schoolYear:
                        "Invalid school year format. Year must be between 2011 and current year.",
                    }));
                    setIsValid(false);
                  } else {
                    setFormErrors((prev) => ({ ...prev, schoolYear: null }));
                    setIsValid(true);
                  }
                }}
                onInputChange={(event, newInputValue) => {
                  // Only allow numbers and remove any other characters immediately
                  let formattedValue = newInputValue
                    .replace(/[^0-9]/g, "")
                    .slice(0, 4);

                  // Clear error when user starts typing again
                  if (formattedValue.length < 4) {
                    setFormErrors((prev) => ({ ...prev, schoolYear: null }));
                    setSchoolYear(formattedValue);
                    return;
                  }

                  // When 4 digits are entered
                  if (formattedValue.length === 4) {
                    const startYear = parseInt(formattedValue);
                    const currentYear = new Date().getFullYear();
                    const minimumYear = 2011;

                    // Always format as YYYY-YYYY first
                    const endYear = startYear + 1;
                    const displayValue = `${startYear}-${endYear}`;
                    setSchoolYear(displayValue);

                    // Set error message after a brief delay
                    setTimeout(() => {
                      if (startYear > currentYear) {
                        setFormErrors((prev) => ({
                          ...prev,
                          schoolYear: `Start year cannot exceed current year (${currentYear})`,
                        }));
                      } else if (startYear < minimumYear) {
                        setFormErrors((prev) => ({
                          ...prev,
                          schoolYear: `Start year cannot be earlier than ${minimumYear}`,
                        }));
                      } else {
                        setFormErrors((prev) => ({
                          ...prev,
                          schoolYear: null,
                        }));
                      }
                    }, 0);
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    required
                    label='School Year'
                    placeholder='Enter start year (YYYY)'
                    error={!!formErrors.schoolYear}
                    helperText={formErrors.schoolYear || " "}
                    FormHelperTextProps={{
                      style: {
                        visibility: formErrors.schoolYear
                          ? "visible"
                          : "hidden",
                        minHeight: "1.5em",
                        margin: "8px 14px 0",
                      },
                    }}
                    InputLabelProps={{
                      shrink: true,
                      required: true,
                    }}
                    inputProps={{
                      ...params.inputProps,
                      maxLength: 4,
                      pattern: "[0-9]*", // Add pattern for numeric input
                      inputMode: "numeric", // Show numeric keyboard on mobile
                      onKeyDown: (e) => {
                        // Prevent non-numeric inputs except for backspace, delete, arrows
                        if (
                          !/[0-9]/.test(e.key) &&
                          ![
                            "Backspace",
                            "Delete",
                            "ArrowLeft",
                            "ArrowRight",
                            "Tab",
                          ].includes(e.key)
                        ) {
                          e.preventDefault();
                        }
                      },
                    }}
                    sx={{
                      ...createTextFieldStyles(),
                      "& .MuiFormHelperText-root": {
                        position: "static",
                        marginBottom: "8px",
                        color: (theme) => theme.palette.error.main,
                        opacity: formErrors.schoolYear ? 1 : 0,
                        transition: "opacity 0.2s ease-in-out",
                      },
                    }}
                  />
                )}
                componentsProps={{
                  popper: {
                    sx: {
                      zIndex: 1301,
                    },
                  },
                }}
              />
            </FormControl>
          </Grid2>
          <Grid2 size={1.5}>
            <FormControl fullWidth error={!!formErrors.term}>
              <InputLabel required shrink>
                Term
              </InputLabel>
              <Select
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                label='Term'
                notched
                sx={createTextFieldStyles()}
              >
                {terms.map((termOption) => (
                  <MenuItem key={termOption.value} value={termOption.value}>
                    {termOption.display}
                  </MenuItem>
                ))}
              </Select>
              {formErrors.term && (
                <FormHelperText error>{formErrors.term}</FormHelperText>
              )}
            </FormControl>
          </Grid2>
          <Grid2 size={4}>
            <Autocomplete
              multiple
              disableCloseOnSelect
              options={authorOptions}
              getOptionLabel={(option) =>
                `${option.first_name || ""} ${option.last_name || ""} (${
                  option.email || ""
                })`
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
              value={authors}
              onChange={handleAuthorsChange}
              inputValue={authorInputValue}
              onInputChange={(event, newInputValue) => {
                setAuthorInputValue(newInputValue);
                handleAuthorSearch(newInputValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  required
                  label='Authors'
                  error={
                    (isDuplicateTitle && isDuplicateAuthors) ||
                    (attemptedSubmit && !!formErrors.authors)
                  }
                  helperText={
                    isDuplicateTitle && isDuplicateAuthors
                      ? "These authors already have a paper with this title"
                      : attemptedSubmit && formErrors.authors
                      ? formErrors.authors
                      : "Type at least 3 characters to search and select author/s"
                  }
                  sx={createTextFieldStyles()}
                  InputLabelProps={{
                    ...params.InputLabelProps,
                    shrink: true,
                    required: true,
                  }}
                />
              )}
            />
          </Grid2>
          <Grid2 size={3}>
            <Autocomplete
              freeSolo
              options={adviserOptions}
              getOptionLabel={(option) =>
                `${option.first_name || ""} ${option.last_name || ""} (${
                  option.email || ""
                })`
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
              value={adviser}
              onChange={(event, newValue) => setAdviser(newValue)}
              inputValue={adviserInputValue}
              onInputChange={(event, newInputValue) => {
                if (researchType === "FD") {
                  setAdviserInputValue(newInputValue); // Update input normally
                  handleAdviserSearch(newInputValue); // Perform search
                } else {
                  setAdviserInputValue(""); // Ensure input is cleared for specific research types
                }
              }}
              disabled={researchType !== "FD"}
              renderInput={(params) => (
                <TextField
                  {...params}
                  required
                  label='Adviser'
                  error={attemptedSubmit && !!formErrors.adviser}
                  helperText={
                    attemptedSubmit
                      ? formErrors.adviser ||
                        "Type at least 3 characters to search for an adviser"
                      : "Type at least 3 characters to search for an adviser"
                  }
                  InputLabelProps={{
                    ...params.InputLabelProps,
                    shrink: true,
                    required: true,
                  }}
                  sx={
                    researchType !== "FD"
                      ? {
                          ...disabledSelectStyle,
                          fontSize: {
                            xs: "0.75rem",
                            md: "0.75rem",
                            lg: "0.8rem",
                          },
                        }
                      : {
                          fontSize: {
                            xs: "0.75rem",
                            md: "0.75rem",
                            lg: "0.8rem",
                          },
                        }
                  }
                />
              )}
            />
          </Grid2>
          <Grid2 size={5}>
            <Autocomplete
              multiple
              options={panelOptions}
              getOptionLabel={(option) =>
                `${option.first_name || ""} ${option.last_name || ""} (${
                  option.email || ""
                })`
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
              value={panels}
              onChange={(event, newValue) => setPanels(newValue)}
              inputValue={panelInputValue}
              onInputChange={(event, newInputValue) => {
                if (researchType === "FD") {
                  setPanelInputValue(newInputValue); // Update input field
                  handlePanelSearch(newInputValue); // Perform panel search
                } else {
                  setPanelInputValue(""); // Clear input field
                }
              }}
              disabled={researchType !== "FD"}
              renderInput={(params) => (
                <TextField
                  {...params}
                  required
                  label='Panel Members'
                  error={attemptedSubmit && !!formErrors.panels}
                  helperText={
                    attemptedSubmit
                      ? formErrors.panels ||
                        "Type at least 3 characters to search and select multiple panel members"
                      : "Type at least 3 characters to search and select multiple panel members"
                  }
                  InputLabelProps={{
                    ...params.InputLabelProps,
                    shrink: true,
                    required: true,
                  }}
                  sx={
                    researchType !== "FD"
                      ? {
                          ...disabledSelectStyle,
                          fontSize: {
                            xs: "0.75rem",
                            md: "0.75rem",
                            lg: "0.8rem",
                          },
                        }
                      : {
                          fontSize: {
                            xs: "0.75rem",
                            md: "0.75rem",
                            lg: "0.8rem",
                          },
                        }
                  }
                />
              )}
            />
          </Grid2>
          <Grid2 size={12}>
            <TextField
              fullWidth
              required
              label='Title'
              variant='outlined'
              value={title}
              onChange={handleTitleChange}
              error={
                (isDuplicateTitle && isDuplicateAuthors) ||
                (attemptedSubmit && !!formErrors.title)
              }
              helperText={
                isDuplicateTitle && isDuplicateAuthors
                  ? "This paper already exists with these authors"
                  : isDuplicateTitle
                  ? "A paper with this title exists (different authors)"
                  : attemptedSubmit && formErrors.title
                  ? formErrors.title
                  : ""
              }
              sx={createTextFieldStyles()}
              InputLabelProps={{
                shrink: true,
                required: true,
              }}
            />
          </Grid2>
          <Grid2 size={6}>
            <Autocomplete
              multiple
              disableCloseOnSelect
              options={sdgGoalsData.sdgGoals}
              getOptionLabel={(option) => `${option.id} - ${option.title}`}
              value={selectedSDGs}
              onChange={(event, newValue) => setSelectedSDGs(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  required
                  label='SDG Goals'
                  error={attemptedSubmit && !!formErrors.sdgs}
                  helperText={
                    attemptedSubmit
                      ? formErrors.sdgs || "Select one or more SDGs"
                      : "Select one or more SDGs"
                  }
                  InputLabelProps={{
                    ...params.InputLabelProps,
                    shrink: true,
                    required: true,
                  }}
                />
              )}
              renderOption={(props, option) => (
                <li {...props}>
                  <Typography variant='body2'>
                    <strong>{option.id}</strong> - {option.title}
                  </Typography>
                </li>
              )}
            />
          </Grid2>
          <Grid2 size={6}>
            <Autocomplete
              multiple
              freeSolo
              options={[]}
              value={keywords}
              onChange={handleKeywordsChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  required
                  label='Keywords'
                  helperText='Type and press Enter to add multiple keywords'
                  InputLabelProps={{
                    ...params.InputLabelProps,
                    shrink: true,
                    required: true,
                  }}
                />
              )}
            />
          </Grid2>
          <Grid2 size={6}>
            <TextField
              fullWidth
              required
              label='Abstract'
              variant='outlined'
              multiline
              rows={4}
              value={abstract}
              onChange={(e) => setAbstract(e.target.value)}
              error={attemptedSubmit && !!formErrors.abstract}
              helperText={
                attemptedSubmit
                  ? formErrors.abstract ||
                    "Please provide the abstract for the paper"
                  : "Please provide the abstract for the paper"
              }
              sx={createTextFieldStyles()}
              InputLabelProps={{
                shrink: true,
                required: true,
              }}
            />
          </Grid2>
          <Grid2 size={6}>
            <FormControl
              fullWidth
              error={attemptedSubmit && !!formErrors.researchAreas}
            >
              <Autocomplete
                multiple
                options={researchAreas}
                disableCloseOnSelect
                getOptionLabel={(option) => option.research_area_name}
                value={selectedResearchAreas}
                onChange={(event, newValue) =>
                  setSelectedResearchAreas(newValue)
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    required
                    label='Research Areas'
                    error={attemptedSubmit && !!formErrors.researchAreas}
                    helperText={
                      attemptedSubmit
                        ? formErrors.researchAreas ||
                          "Select one or more research areas"
                        : "Select one or more research areas"
                    }
                    sx={createTextFieldStyles()}
                    InputLabelProps={{
                      shrink: true,
                      required: true,
                    }}
                  />
                )}
              />
            </FormControl>
          </Grid2>
          <Grid2 size={6}></Grid2>
          <Grid2 size={3}>
            <Typography variant='body2' sx={{ mb: 1 }}>
              Upload Full Manuscript *
            </Typography>
            <FormControl
              fullWidth
              error={attemptedSubmit && !!formErrors.manuscript}
            >
              <FileUploader
                onFileSelect={onSelectFileHandler}
                onFileDelete={onDeleteFileHandler}
                selectedFile={file}
                required
                sx={{ width: "100%" }}
              />
              {attemptedSubmit && formErrors.manuscript && (
                <FormHelperText error>{formErrors.manuscript}</FormHelperText>
              )}
            </FormControl>
          </Grid2>
          <Grid2 size={3}>
            <Typography variant='body2' sx={{ mb: 1 }}>
              Upload Extended Abstract *
            </Typography>
            <FormControl
              fullWidth
              error={attemptedSubmit && !!formErrors.extendedAbstract}
            >
              <FileUploader
                onFileSelect={onSelectFileHandlerEA}
                onFileDelete={onDeleteFileHandlerEA}
                selectedFile={extendedAbstract}
                required
                sx={{ width: "100%" }}
              />
              {attemptedSubmit && formErrors.extendedAbstract && (
                <FormHelperText error>
                  {formErrors.extendedAbstract}
                </FormHelperText>
              )}
            </FormControl>
          </Grid2>
        </Grid2>
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            mt: 3,
            gap: 2,
          }}
        >
          <Button
            onClick={handleBack}
            sx={{
              backgroundColor: "#08397C",
              color: "#FFF",
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 600,
              fontSize: { xs: "0.875rem", md: "0.9rem" },
              padding: { xs: "0.5rem 1rem", md: "0.5rem 0.8rem" },
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
            onClick={handleAddPaper}
            disabled={!isFormValid() || isSubmitting}
            sx={{
              backgroundColor: "#CA031B",
              color: "#FFF",
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 600,
              textTransform: "none",
              fontSize: { xs: "0.875rem", md: "0.9rem" },
              padding: { xs: "0.5rem 1rem", md: "0.5rem 0.8rem" },
              borderRadius: "100px",
              maxHeight: "3rem",
              "&:hover": {
                backgroundColor: "#A30417",
                color: "#FFF",
              },
              "&:disabled": {
                backgroundColor: "#cccccc",
                color: "#666666",
              },
            }}
          >
            {isSubmitting ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CircularProgress size={20} color='inherit' />
                Adding Paper...
              </Box>
            ) : (
              "Add Paper"
            )}
          </Button>
        </Box>

        {/* Add loading overlay */}
        {isSubmitting && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(255, 255, 255, 0.7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 9999,
            }}
          >
            <Box sx={{ textAlign: "center" }}>
              <CircularProgress />
              <Typography sx={{ mt: 2 }}>Adding Paper...</Typography>
            </Box>
          </Box>
        )}

        {/* Save Progress */}
        <Dialog
          open={isConfirmDialogOpen}
          onClose={() => setIsConfirmDialogOpen(false)}
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
            Unsaved Progress
          </DialogTitle>
          <DialogContent>
            <Typography
              sx={{
                fontFamily: "Montserrat, sans-serif",
                color: "#666",
              }}
            >
              You have unsaved progress. Do you want to save your progress?
            </Typography>
          </DialogContent>
          <DialogActions sx={{ padding: "1rem" }}>
            <Button
              onClick={() => {
                setIsConfirmDialogOpen(false);
                setShouldClearFields(true); // Set flag to clear fields
                closeAddPaperModal();
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
            >
              Discard
            </Button>
            <Button
              onClick={() => {
                setIsConfirmDialogOpen(false);
                setShouldClearFields(false); // Don't clear fields
                closeAddPaperModal();
              }}
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
              Save Progress
            </Button>
          </DialogActions>
        </Dialog>

        {/* Add Success Dialog */}
        <Dialog
          open={isSuccessDialogOpen}
          onClose={handleSuccessClose}
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
              Paper has been successfully added to the repository.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ padding: "1rem" }}>
            <Button
              onClick={handleSuccessClose}
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

        {/* Add Duplicate Dialog */}
        <Dialog
          open={isDuplicateDialogOpen}
          onClose={() => setIsDuplicateDialogOpen(false)}
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
              color: "#CA031B",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Box
              component='span'
              sx={{
                backgroundColor: "#FFEAEA",
                borderRadius: "50%",
                padding: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ⚠️
            </Box>
            Duplicate Paper Detected
          </DialogTitle>
          <DialogContent>
            <Typography
              sx={{
                fontFamily: "Montserrat, sans-serif",
                color: "#666",
                mt: 1,
              }}
            >
              This paper already exists in the repository with the same title
              and authors.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ padding: "1rem" }}>
            <Button
              onClick={() => setIsDuplicateDialogOpen(false)}
              sx={{
                backgroundColor: "#08397C",
                color: "#FFF",
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 600,
                textTransform: "none",
                borderRadius: "100px",
                "&:hover": {
                  backgroundColor: "#072d61",
                },
              }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* Add Confirm Duplicate Title Dialog */}
        <Dialog
          open={isConfirmDuplicateTitleOpen}
          onClose={() => setIsConfirmDuplicateTitleOpen(false)}
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
              color: "#F5A524",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Box
              component='span'
              sx={{
                backgroundColor: "#FFF8E7",
                borderRadius: "50%",
                padding: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ⚠️
            </Box>
            Similar Title Found
          </DialogTitle>
          <DialogContent>
            <Typography
              sx={{
                fontFamily: "Montserrat, sans-serif",
                color: "#666",
                mt: 1,
              }}
            >
              A paper with this title already exists. Are you sure you want to
              proceed?
            </Typography>
          </DialogContent>
          <DialogActions sx={{ padding: "1rem", gap: 1 }}>
            <Button
              onClick={() => {
                setIsConfirmDuplicateTitleOpen(false);
                setIsAwaitingConfirmation(false);
              }}
              sx={{
                color: "#666",
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 600,
                textTransform: "none",
                borderRadius: "100px",
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                setIsConfirmDuplicateTitleOpen(false);
                setIsAwaitingConfirmation(true);
                handleAddPaper();
              }}
              sx={{
                backgroundColor: "#08397C",
                color: "#FFF",
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 600,
                textTransform: "none",
                borderRadius: "100px",
                "&:hover": {
                  backgroundColor: "#072d61",
                },
              }}
            >
              Proceed
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Modal>
  );
};

export default AddPaperModal;
