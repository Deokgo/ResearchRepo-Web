import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import axios from "axios";
import { useModalContext } from "../context/modalcontext";
import FileUploader from "./FileUploader";
import sdgGoalsData from "../data/sdgGoals.json";
import { useAuth } from "../context/AuthContext";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import { filterCache, fetchAndCacheFilterData } from "../utils/filterCache";
import { toast } from "react-hot-toast";

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
  const [formData] = useState(new FormData());
  const dismissAll = () =>  toast.dismiss();

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
        const response = await axios.get(`/deptprogs/programs/${collegeId}`);
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
        const response = await axios.get(
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
        const response = await axios.get("/accounts/search_user", {
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
    if (!schoolYear) errors.schoolYear = "School Year is required";
    if (!term) errors.term = "Term is required";
    if (authors.length === 0)
      errors.authors = "At least one author is required";
    if (!title) errors.title = "Title is required";
    if (!abstract) errors.abstract = "Abstract is required";
    if (!file) errors.manuscript = "Full Manuscript is required";
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
    console.log(Object.keys(errors).length)
    setFormErrors(errors);
    return Object.keys(errors).length
  };

  const handleBack = () => {
    if (validateForm() === 11) {
      closeAddPaperModal();
      toast.dismiss();
      return;
    }
    const userConfirmed = window.confirm(
      "You have unsaved changes. Save Changes?"
    );

    if (userConfirmed) {
      handleAddPaper();
    } else {
      closeAddPaperModal();
    }   
  }

  const handleAddPaper = async () => {
    if (validateForm() !== 0) {
      toast.error("Please fill in all required fields", {
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }
    toast.dismiss()

    // Clear any existing data in formData
    for (let pair of formData.entries()) {
      formData.delete(pair[0]);
    }

    // Add new data
    formData.append("research_id", groupCode);
    formData.append("college_id", selectedCollege);
    formData.append("program_id", selectedProgram);
    formData.append("title", title);
    formData.append("abstract", abstract);
    formData.append("school_year", schoolYear);
    formData.append("term", term);
    formData.append("research_type", researchType);
    formData.append("file", file);

    if (extendedAbstract) {
      formData.append("extended_abstract", extendedAbstract);
    }

    formData.append("sdg", selectedSDGs.map((sdg) => sdg.id).join(";"));
    formData.append("keywords", keywords.join(";"));

    authors.forEach((author) => {
      formData.append("author_ids", author.researcher_id);
    });

    if (researchType === "FD") {
      if (adviser) {
        formData.append("adviser_id", adviser.researcher_id);
      }
      panels.forEach((panel) => {
        formData.append("panel_ids", panel.researcher_id);
      });
    }

    formData.append(
      "research_areas",
      selectedResearchAreas.map((area) => area.id).join(";")
    );

    try {
      const response = await axios.post("/paper/add_paper", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Paper added successfully!");
      closeAddPaperModal();
    } catch (error) {
      toast.error(error.response?.data?.error || "Error adding paper");
      console.error("Error:", error);
    }
  };

  // Reset form state when modal opens
  useEffect(() => {
    if (!isAddPaperModalOpen) {
      setGroupCode("");
      setSelectedCollege("");
      setSelectedProgram("");
      setResearchType("FD");
      setSchoolYear(""); // Reset school year
      setTerm(""); // Reset term
      setTitle("");
      setAbstract("");
      setAdviser(null);
      setAdviserInputValue("");
      setAuthorInputValue("");
      setPanelInputValue("");
      setSelectedSDGs([]);
      setKeywords([]);
      setPanels([]);
      setFile(null);
      setExtendedAbstract(null);
      setAuthors([]);
    }
  }, [isAddPaperModalOpen]);

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
        const formattedAreas = cached.researchAreas.map((area) => ({
          research_area_id: area.id,
          research_area_name: area.name,
        }));
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
      const response = await axios.post("/paper/predict_research_areas", {
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

  return (
    <Modal
      open={isAddPaperModalOpen}
      onClose={closeAddPaperModal}
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
              onChange={(e) => setGroupCode(e.target.value)}
              error={!!formErrors.groupCode}
              helperText={formErrors.groupCode || "Maximum 15 characters"}
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
              <InputLabel required shrink>
                School Year
              </InputLabel>
              <Select
                value={schoolYear}
                onChange={(e) => setSchoolYear(e.target.value)}
                label='School Year'
                notched
                sx={createTextFieldStyles()}
              >
                {schoolYears.map((year) => (
                  <MenuItem key={year} value={year.split("-")[0]}>
                    {" "}
                    {/* Only store first year */}
                    {year}
                  </MenuItem>
                ))}
              </Select>
              {formErrors.schoolYear && (
                <FormHelperText error>{formErrors.schoolYear}</FormHelperText>
              )}
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
                      fontSize: { xs: "0.75rem", md: "0.75rem", lg: "0.8rem" },
                    },
                  },
                },
              }}
              value={authors}
              onChange={(event, newValue) => setAuthors(newValue)}
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
                  error={!!formErrors.authors}
                  helperText={
                    formErrors.authors ||
                    "Type at least 3 characters to search and select author/s"
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
                      fontSize: { xs: "0.75rem", md: "0.75rem", lg: "0.8rem" },
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
                  error={!!formErrors.adviser}
                  helperText={
                    researchType === "FD"
                      ? formErrors.adviser ||
                        "Type at least 3 characters to search for an adviser"
                      : ""
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
                      fontSize: { xs: "0.75rem", md: "0.75rem", lg: "0.8rem" },
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
                  error={!!formErrors.panels}
                  helperText={
                    researchType === "FD"
                      ? formErrors.panels ||
                        "Type at least 3 characters to search and select multiple panel members"
                      : ""
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
              onChange={(e) => setTitle(e.target.value)}
              error={!!formErrors.title}
              helperText={formErrors.title}
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
                  error={!!formErrors.sdgs}
                  helperText={formErrors.sdgs || "Select one or more SDG goals"}
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
              error={!!formErrors.abstract}
              helperText={formErrors.abstract}
              sx={createTextFieldStyles()}
              InputLabelProps={{
                shrink: true,
                required: true,
              }}
            />
          </Grid2>
          <Grid2 size={6}>
            <FormControl fullWidth error={!!formErrors.researchAreas}>
              <Autocomplete
                multiple
                disableCloseOnSelect
                options={researchAreas}
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
                    error={!!formErrors.researchAreas}
                    helperText={
                      formErrors.researchAreas || "Select research areas"
                    }
                    InputLabelProps={{
                      ...params.InputLabelProps,
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
            <FormControl fullWidth error={!!formErrors.manuscript}>
              <FileUploader
                onFileSelect={onSelectFileHandler}
                onFileDelete={onDeleteFileHandler}
                selectedFile={file}
                required
                sx={{ width: "100%" }}
              />
              {formErrors.manuscript && (
                <FormHelperText error>{formErrors.manuscript}</FormHelperText>
              )}
            </FormControl>
          </Grid2>
          <Grid2 size={3}>
            <Typography variant='body2' sx={{ mb: 1 }}>
              Upload Extended Abstract
            </Typography>
            <FileUploader
              onSelectFile={onSelectFileHandlerEA}
              onDeleteFile={onDeleteFileHandlerEA}
              file={extendedAbstract}
              sx={{ width: "100%" }}
            />
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
            onClick={handleAddPaper}
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
            Add Paper
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddPaperModal;
