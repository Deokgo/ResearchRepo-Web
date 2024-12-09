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
} from "@mui/material";
import axios from "axios";
import { useModalContext } from "./modalcontext";
import FileUploader from "./FileUploader";
import sdgGoalsData from "../data/sdgGoals.json";

const AddPaperModal = ({ isOpen, handleClose, onPaperAdded }) => {
  const [colleges, setColleges] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [selectedCollege, setSelectedCollege] = useState("");
  const [selectedProgram, setSelectedProgram] = useState("");
  const [researchType, setResearchType] = useState("Integrative");
  const [dateApproved, setDateApproved] = useState("");
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

  // Fetch all colleges when the modal opens
  useEffect(() => {
    if (isAddPaperModalOpen) {
      fetchColleges();
    }
  }, [isAddPaperModalOpen]);

  // Fetch all colleges
  const fetchColleges = async () => {
    try {
      const response = await axios.get(`/deptprogs/college_depts`);
      setColleges(response.data.colleges);
    } catch (error) {
      console.error("Error fetching colleges:", error);
    }
  };

  // Fetch programs based on selected college
  const fetchProgramsByCollege = async (collegeId) => {
    if (collegeId) {
      try {
        const response = await axios.get(`/deptprogs/programs/${collegeId}`, {
          params: { department: collegeId },
        });
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
        const response = await axios.get("/accounts/search_user", {
          params: { query },
        });
        setAdviserOptions(response.data.users);
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
  const handleCollegeChange = (event) => {
    const selectedCollegeId = event.target.value;
    setSelectedCollege(selectedCollegeId);
    fetchProgramsByCollege(selectedCollegeId);
    setSelectedProgram(""); // Reset selected program when college changes
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

  const handleAddPaper = async () => {
    try {
      // Validate required fields
      const requiredFields = {
        "Group Code": groupCode,
        Department: selectedCollege,
        Program: selectedProgram,
        "Research Type": researchType,
        "Date Approved": dateApproved,
        Title: title,
        Abstract: abstract,
        Adviser: adviser,
        "SDG Goals": selectedSDGs,
        Keywords: keywords,
        Panels: panels,
        Authors: authors,
        "Full Manuscript": file,
      };

      const missingFields = Object.entries(requiredFields)
        .filter(([_, value]) => {
          if (Array.isArray(value)) {
            return value.length === 0;
          }
          return !value;
        })
        .map(([key]) => key);

      if (missingFields.length > 0) {
        alert(
          `Please fill in all required fields: ${missingFields.join(", ")}`
        );
        return;
      }

      console.log("File:", file);
      console.log("Extended Abstract:", extendedAbstract);

      const formData = new FormData();

      // Get user_id from localStorage
      const userId = localStorage.getItem("user_id");
      formData.append("user_id", userId);

      // Add all required fields to formData
      formData.append("research_id", groupCode);
      formData.append("college_id", selectedCollege);
      formData.append("program_id", selectedProgram);
      formData.append("title", title);
      formData.append("abstract", abstract);
      formData.append("date_approved", dateApproved);
      formData.append("research_type", researchType);
      formData.append("adviser_id", adviser?.user_id || "");
      formData.append("sdg", selectedSDGs.map((sdg) => sdg.id).join(";"));
      formData.append("file", file);
      formData.append("extended_abstract", extendedAbstract);

      // Add authors without order
      authors.forEach((author) => {
        formData.append("author_ids", author.user_id);
      });

      // Add panel IDs
      panels.forEach((panel) => {
        formData.append("panel_ids", panel.user_id);
      });

      // Add keywords
      formData.append("keywords", keywords.join(";"));

      // Send the paper data
      const response = await axios.post("/paper/add_paper", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Response:", response.data);
      alert("Paper added successfully!");
      if (onPaperAdded) {
        onPaperAdded();
      }
      closeAddPaperModal();
    } catch (error) {
      console.error("Error adding paper:", error);
      if (error.response) {
        console.error("Error response:", error.response.data);
        alert(
          `Failed to add paper: ${
            error.response.data.error || "Please try again."
          }`
        );
      } else {
        alert("Failed to add paper. Please try again.");
      }
    }
  };

  // Reset form state when modal opens
  useEffect(() => {
    if (!isAddPaperModalOpen) {
      setGroupCode("");
      setSelectedCollege("");
      setSelectedProgram("");
      setResearchType("Integrative"); // Reset to Integrative
      setDateApproved("");
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
    setResearchType("Integrative");
  }, []); // Run once when component mounts

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

  // Add this function to handle research type changes
  const handleResearchTypeChange = (event) => {
    setResearchType(event.target.value);
  };

  return (
    <Modal
      open={isAddPaperModalOpen}
      onClose={closeAddPaperModal}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 5,
          borderRadius: 2,
          width: "auto",
          margin: "5rem",
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
        <Grid2 container spacing={2}>
          <Grid2 size={2}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Research Type</InputLabel>
              <Select
                value={researchType}
                onChange={handleResearchTypeChange}
                label='Research Type'
                defaultValue='Integrative'
              >
                <MenuItem value='Integrative'>Integrative</MenuItem>
                <MenuItem value='College-Driven'>College-Driven</MenuItem>
                <MenuItem value='Extramural'>Extramural</MenuItem>
              </Select>
            </FormControl>
          </Grid2>
          <Grid2 size={2}>
            <TextField
              fullWidth
              label='Group Code'
              variant='outlined'
              value={groupCode}
              onChange={(e) => setGroupCode(e.target.value)}
              inputProps={{ maxLength: 15 }} // Limits input to 15 characters
              sx={createTextFieldStyles()}
              InputLabelProps={createInputLabelProps()}
            />
          </Grid2>
          <Grid2 size={3}>
            <FormControl fullWidth variant='outlined'>
              <InputLabel
                sx={{
                  fontSize: { xs: "0.75rem", md: "0.75rem", lg: "0.8rem" },
                }}
              >
                Department
              </InputLabel>
              <Select
                value={selectedCollege}
                onChange={handleCollegeChange}
                label='Department'
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
            </FormControl>
          </Grid2>
          <Grid2 size={3}>
            <FormControl
              fullWidth
              variant='outlined'
              sx={createTextFieldStyles()}
            >
              <InputLabel
                sx={{
                  fontSize: { xs: "0.75rem", md: "0.75rem", lg: "0.8rem" },
                }}
              >
                Program
              </InputLabel>
              <Select
                value={selectedProgram}
                onChange={(e) => setSelectedProgram(e.target.value)}
                label='Program'
                disabled={!selectedCollege} // Disable if no college is selected
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
            </FormControl>
          </Grid2>
          <Grid2 size={2}>
            <TextField
              fullWidth
              label='Date Approved'
              variant='outlined'
              type='date'
              value={dateApproved}
              onChange={(e) => setDateApproved(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={createTextFieldStyles()}
            />
          </Grid2>
          <Grid2 size={4}>
            <Autocomplete
              multiple
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
                  label='Authors'
                  variant='outlined'
                  helperText='Type at least 3 characters to search and select author/s'
                  sx={createTextFieldStyles()}
                  InputLabelProps={createInputLabelProps()}
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
                if (
                  researchType !== "College-Driven" &&
                  researchType !== "Extramural"
                ) {
                  setAdviserInputValue(newInputValue);
                  handleAdviserSearch(newInputValue);
                }
              }}
              disabled={
                researchType === "College-Driven" ||
                researchType === "Extramural"
              }
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
                if (
                  researchType !== "College-Driven" &&
                  researchType !== "Extramural"
                ) {
                  setPanelInputValue(newInputValue);
                  handlePanelSearch(newInputValue);
                }
              }}
              disabled={
                researchType === "College-Driven" ||
                researchType === "Extramural"
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label='Panels'
                  variant='outlined'
                  helperText='Type at least 3 characters to search and select multiple panel members'
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
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              sx={createTextFieldStyles()}
              InputLabelProps={createInputLabelProps()}
            />
          </Grid2>
          <Grid2 size={6}>
            <Autocomplete
              multiple
              options={sdgGoalsData.sdgGoals}
              getOptionLabel={(option) => `${option.id} - ${option.title}`}
              value={selectedSDGs}
              onChange={(event, newValue) => setSelectedSDGs(newValue)}
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
              options={[]} // Empty array since keywords are free-form
              value={keywords}
              onChange={handleKeywordsChange}
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
              value={abstract}
              onChange={(e) => setAbstract(e.target.value)}
              sx={createTextFieldStyles()}
              InputLabelProps={createInputLabelProps()}
            />
          </Grid2>
          <Grid2 size={3}>
            <Typography
              variant='body1'
              sx={{
                color: "#8B8B8B",
                fontSize: { xs: "0.5rem", md: "0.5rem", lg: "0.9rem" },
              }}
            >
              Upload Full Manuscript:
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
          </Grid2>
          <Grid2 size={3}>
            <Typography
              variant='body1'
              sx={{
                color: "#8B8B8B",
                fontSize: { xs: "0.5rem", md: "0.5rem", lg: "0.9rem" },
              }}
            >
              Upload Extended Abstract:
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
                onDeleteFile={onDeleteFileHandlerEA}
              />
            </Box>
          </Grid2>
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
            onClick={closeAddPaperModal}
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
            Back
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
