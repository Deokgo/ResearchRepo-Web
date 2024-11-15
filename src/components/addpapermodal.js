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
  const [researchType, setResearchType] = useState("");
  const [dateApproved, setDateApproved] = useState("");
  const [title, setTitle] = useState("");
  const [groupCode, setGroupCode] = useState("");
  const [abstract, setAbstract] = useState("");
  const [sdg, setSDG] = useState(""); // should allow multiple SDG
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
        const response = await axios.get(`/deptprogs/programs`, {
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

  const onDeleteFileHandler = () => {};

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
        File: file,
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

      const formData = new FormData();

      // Get user_id from localStorage
      const storedUser = JSON.parse(localStorage.getItem("user")) || {};
      const userId = storedUser.user_id || "anonymous";

      // Add user_id to formData
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

      // Add panel IDs
      panels.forEach((panel) => {
        formData.append("panel_ids[]", panel.user_id);
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

  // Add a cleanup function to reset form state when modal closes
  useEffect(() => {
    if (!isAddPaperModalOpen) {
      setGroupCode("");
      setSelectedCollege("");
      setSelectedProgram("");
      setResearchType("");
      setDateApproved("");
      setTitle("");
      setAbstract("");
      setAdviser(null);
      setSelectedSDGs([]);
      setKeywords([]);
      setPanels([]);
      setFile(null);
      setAuthors([]);
    }
  }, [isAddPaperModalOpen]);

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
          margin: "10rem",
        }}
      >
        <Typography
          variant='h3'
          color='#08397C'
          fontWeight='1000'
          mb={4}
          sx={{
            textAlign: { xs: "left", md: "bottom" },
          }}
        >
          Add New Paper
        </Typography>
        <Grid2 container spacing={2}>
          <Grid2 size={2}>
            <TextField
              fullWidth
              label='Group Code'
              variant='filled'
              value={groupCode}
              onChange={(e) => setGroupCode(e.target.value)}
            />
          </Grid2>
          <Grid2 size={3}>
            <FormControl fullWidth variant='filled'>
              <InputLabel>Department</InputLabel>
              <Select
                value={selectedCollege}
                onChange={handleCollegeChange}
                label='Department'
              >
                {colleges.map((college) => (
                  <MenuItem key={college.college_id} value={college.college_id}>
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
                value={selectedProgram}
                onChange={(e) => setSelectedProgram(e.target.value)}
                label='Program'
                disabled={!selectedCollege} // Disable if no college is selected
              >
                {programs.map((program) => (
                  <MenuItem key={program.program_id} value={program.program_id}>
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
                value={researchType}
                onChange={(e) => setResearchType(e.target.value)}
              >
                <MenuItem value='COLLEGE-DRIVEN'>COLLEGE-DRIVEN</MenuItem>
                <MenuItem value='INTEGRATIVE'>INTEGRATIVE</MenuItem>
                <MenuItem value='EXTRAMURAL'>EXTRAMURAL</MenuItem>
              </Select>
            </FormControl>
          </Grid2>
          <Grid2 size={2}>
            <TextField
              fullWidth
              label='Date Approved'
              variant='filled'
              type='date'
              value={dateApproved}
              onChange={(e) => setDateApproved(e.target.value)}
              InputLabelProps={{ shrink: true }}
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
                  variant='filled'
                  helperText='Type at least 3 characters to search and select author/s'
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
              value={adviser}
              onChange={(event, newValue) => setAdviser(newValue)}
              inputValue={adviserInputValue}
              onInputChange={(event, newInputValue) => {
                setAdviserInputValue(newInputValue);
                handleAdviserSearch(newInputValue);
              }}
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
          <Grid2 size={5}>
            <Autocomplete
              multiple
              options={panelOptions}
              getOptionLabel={(option) =>
                `${option.first_name || ""} ${option.last_name || ""} (${
                  option.email || ""
                })`
              }
              value={panels}
              onChange={(event, newValue) => setPanels(newValue)}
              inputValue={panelInputValue}
              onInputChange={(event, newInputValue) => {
                setPanelInputValue(newInputValue);
                handlePanelSearch(newInputValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label='Panels'
                  variant='filled'
                  helperText='Type at least 3 characters to search and select multiple panel members'
                />
              )}
            />
          </Grid2>
          <Grid2 size={12}>
            <TextField
              fullWidth
              label='Title'
              variant='filled'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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
                  variant='filled'
                  helperText='Select one or more SDG goals'
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
              value={abstract}
              onChange={(e) => setAbstract(e.target.value)}
            />
          </Grid2>
          <Grid2 size={6}>
            <Typography variant='body1' sx={{ color: "#8B8B8B" }}>
              Upload Full Manuscript:
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                border: "1px dashed #ccc",
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
          </Grid2>
        </Grid2>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 5,
          }}
        >
          <Button
            onClick={closeAddPaperModal}
            sx={{
              backgroundColor: "#08397C",
              color: "#FFF",
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 600,
              fontSize: { xs: "0.875rem", md: "1.275rem" },
              padding: { xs: "0.5rem", md: "1.5rem" },
              marginLeft: "2rem",
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
              fontSize: { xs: "0.875rem", md: "1.275rem" },
              padding: { xs: "0.5rem 1rem", md: "1.5rem" },
              marginLeft: "2rem",
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
