import {
  Box,
  Button,
  Grid2,
  TextField,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  IconButton,
  Autocomplete,
} from "@mui/material";
import FileUploader from "./FileUploader";
import sdgGoalsData from "../data/sdgGoals.json";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "./navbar";
import homeBg from "../assets/home_bg.png";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import axios from "axios";

const DisplayResearchInfo = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const research_id = location.state?.id;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [researchCode, setResearchCode] = useState("");
  const [colleges, setColleges] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [groupCode, setGroupCode] = useState("");
  const [selectedCollege, setSelectedCollege] = useState("");
  const [selectedProgram, setSelectedProgram] = useState("");
  const [abstract, setAbstract] = useState("");
  const [researchType, setResearchType] = useState("");
  const [selectedSDGs, setSelectedSDGs] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [dateApproved, setDateApproved] = useState("");

  const [authors, setAuthors] = useState([]);
  const [authorInputValue, setAuthorInputValue] = useState("");
  const [authorOptions, setAuthorOptions] = useState([]);

  const [adviser, setAdviser] = useState(null);
  const [adviserInputValue, setAdviserInputValue] = useState("");
  const [adviserOptions, setAdviserOptions] = useState([]);

  const [panels, setPanels] = useState([]);
  const [panelInputValue, setPanelInputValue] = useState("");
  const [panelOptions, setPanelOptions] = useState([]);

  const [file, setFile] = useState(null);

  const [isDisabled, setIsDisabled] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [isLabel, setIsLabel] = useState("Edit Details");
  const [initialData, setInitialData] = useState(null);

  // Add state for initial values
  const [initialValues, setInitialValues] = useState(null);

  const editDetails = () => {
    if (isDisabled) {
      // Entering edit mode
      setIsDisabled(false);
      setIsVisible(true);
      setIsLabel("Cancel");
    } else {
      // Canceling - reset all form fields to initial values
      setTitle(initialValues.title);
      setSelectedCollege(initialValues.college_id);
      setSelectedProgram(initialValues.program_id);
      setAbstract(initialValues.abstract);
      setResearchType(initialValues.research_type);
      setDateApproved(initialValues.date_approved);
      setSelectedSDGs(initialValues.sdgs);
      setKeywords(initialValues.keywords);
      setAuthors(initialValues.authors);
      setAdviser(initialValues.adviser);
      setPanels(initialValues.panels);
      setFile(initialValues.file);

      // Reset edit mode
      setIsDisabled(true);
      setIsVisible(false);
      setIsLabel("Edit Details");
    }
  };

  useEffect(() => {
    const fetchResearchDetails = async () => {
      try {
        if (research_id) {
          const response = await axios.get(
            `/dataset/fetch_ordered_dataset/${research_id}`
          );

          if (response.data.dataset && response.data.dataset.length > 0) {
            const item = response.data.dataset[0];
            console.log("Fetched research data:", item);
            // Store initial values when first loading the data
            const initialData = {
              group_code: item.research_id || "",
              title: item.title || "",
              college_id: item.college_id || "",
              program_id: item.program_id || "",
              abstract: item.abstract || "",
              research_type: item.research_type || "",
              date_approved: item.date_approved
                ? new Date(item.date_approved).toISOString().split("T")[0]
                : "",
              sdgs: item.sdg
                ? item.sdg.split(";").map((sdgId) => ({
                    id: sdgId,
                    title:
                      sdgGoalsData.sdgGoals.find((goal) => goal.id === sdgId)
                        ?.title || "",
                  }))
                : [],
              keywords: item.keywords || [],
              authors: item.authors
                ? item.authors.map((author) => ({
                    user_id: author.user_id,
                    name: author.name,
                    email: author.email,
                  }))
                : [],
              adviser: item.adviser
                ? {
                    user_id: item.adviser.user_id,
                    name: item.adviser.name,
                    email: item.adviser.email,
                  }
                : null,
              panels: item.panels
                ? item.panels.map((panel) => ({
                    user_id: panel.user_id,
                    name: panel.name,
                    email: panel.email,
                  }))
                : [],
              file: item.full_manuscript || "",
            };
            setInitialValues(initialData);

            // Set current values
            setResearchCode(initialData.group_code);
            setTitle(initialData.title);
            setSelectedCollege(initialData.college_id);
            setSelectedProgram(initialData.program_id);
            setAbstract(initialData.abstract);
            setResearchType(initialData.research_type);
            setDateApproved(initialData.date_approved);
            setSelectedSDGs(initialData.sdgs);
            setKeywords(initialData.keywords);
            setAuthors(initialData.authors);
            setAdviser(initialData.adviser);
            setPanels(initialData.panels);
            setFile(initialData.file);

            // Also fetch the programs for the selected college
            if (item.college_id) {
              try {
                const programsResponse = await axios.get(
                  `/deptprogs/programs`,
                  {
                    params: { department: item.college_id },
                  }
                );
                setPrograms(programsResponse.data.programs);
              } catch (error) {
                console.error("Error fetching programs:", error);
              }
            }

            // Set authors with proper format
            if (item.authors && Array.isArray(item.authors)) {
              const formattedAuthors = item.authors.map((author) => ({
                user_id: author.user_id,
                name: author.name,
                email: author.email,
              }));
              setAuthors(formattedAuthors);
              setAuthorOptions(formattedAuthors);
            }

            // Set adviser with proper format
            if (item.adviser) {
              const formattedAdviser = {
                user_id: item.adviser.user_id,
                name: item.adviser.name,
                email: item.adviser.email,
              };
              setAdviser(formattedAdviser);
              setAdviserOptions([formattedAdviser]);
            }

            // Set panels with proper format
            if (item.panels && Array.isArray(item.panels)) {
              const formattedPanels = item.panels.map((panel) => ({
                user_id: panel.user_id,
                name: panel.name,
                email: panel.email,
              }));
              setPanels(formattedPanels);
              setPanelOptions(formattedPanels);
            }

            // Set SDG goals
            if (item.sdg) {
              const sdgArray = item.sdg.split(";").map((sdg) => sdg.trim());
              const formattedSDGs = sdgArray.map((sdgId) => ({
                id: sdgId,
                title:
                  sdgGoalsData.sdgGoals.find((goal) => goal.id === sdgId)
                    ?.title || "",
              }));
              setSelectedSDGs(formattedSDGs);
            }

            // Set keywords
            if (item.keywords && Array.isArray(item.keywords)) {
              setKeywords(item.keywords);
            }

            setLoading(false);
          }
        }
      } catch (error) {
        console.error("Error fetching research details:", error);
        alert("Failed to fetch research details. Please try again.");
      }
    };

    fetchResearchDetails();
  }, [research_id]);

  useEffect(() => {
    fetchColleges();
  }, []);

  useEffect(() => {
    const fetchProgramsForCollege = async () => {
      if (selectedCollege) {
        try {
          const response = await axios.get(`/deptprogs/programs`, {
            params: { department: selectedCollege },
          });
          setPrograms(response.data.programs);
        } catch (error) {
          console.error("Error fetching programs:", error);
        }
      }
    };

    fetchProgramsForCollege();
  }, [selectedCollege]);

  const handleSaveDetails = () => {
    // Check if there are any changes by comparing the current state with initial data
    const hasChanges =
      selectedCollege !== initialData?.college_id ||
      selectedProgram !== initialData?.program_id ||
      title !== initialData?.title ||
      abstract !== initialData?.abstract ||
      researchType !== initialData?.research_type ||
      dateApproved !== initialData?.date_approved ||
      keywords.join(";") !== initialData?.keywords ||
      selectedSDGs.join(";") !== initialData?.sdg ||
      adviser !== initialData?.adviser ||
      panels.join(";") !== initialData?.panels ||
      authors.join(";") !== initialData?.authors ||
      file.join(";") !== initialData?.full_manuscript;

    if (!hasChanges) {
      alert("No changes are made");
    } else {
      updateResearchDetails();
    }
  };

  const updateResearchDetails = async () => {
    try {
      // Validate required fields
      const requiredFields = {
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
      const userId = localStorage.getItem("user_id");
      formData.append("user_id", userId);

      // Add all required fields to formData
      formData.append("college_id", selectedCollege);
      formData.append("program_id", selectedProgram);
      formData.append("title", title);
      formData.append("abstract", abstract);
      formData.append("date_approved", dateApproved);
      formData.append("research_type", researchType);
      formData.append("adviser_id", adviser?.user_id || "");
      formData.append("sdg", selectedSDGs.map((sdg) => sdg.id).join(";"));
      formData.append("file", file);

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
      const response = await axios.put(
        `/paper/update_paper/${research_id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Response:", response.data);
      alert("Paper updated successfully!");
    } catch (error) {
      console.error("Error updating paper:", error);
      if (error.response) {
        console.error("Error response:", error.response.data);
        alert(
          `Failed to update paper: ${
            error.response.data.error || "Please try again."
          }`
        );
      } else {
        alert("Failed to update paper. Please try again.");
      }
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

  const handleCollegeChange = (event) => {
    const selectedCollegeId = event.target.value;
    setSelectedCollege(selectedCollegeId);
    fetchProgramsByCollege(selectedCollegeId);
    setSelectedProgram("");
  };

  const onSelectFileHandler = (e) => {
    setFile(e.target.files[0]);
  };

  const onDeleteFileHandler = () => {};

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

  const handleKeywordsChange = (event, newValue) => {
    setKeywords(newValue);
  };

  const handleViewManuscript = async () => {
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
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: { size: "100%", md: "calc(100vh - 9rem)" },
          marginTop: { size: "3.5rem", sm: "4rem", md: "6rem" },
        }}
      >
        <Box
          sx={{
            position: "relative",
            marginBottom: 2,
            display: "flex",
            flexDirection: { size: "column", md: "row" },
            padding: 4,
            gap: 4,
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: { size: "5rem", md: "6rem" },
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
          <Box sx={{ display: "flex", ml: "5rem", zIndex: 3 }}>
            <IconButton onClick={() => navigate(-1)} sx={{ color: "#fff" }}>
              <ArrowBackIosIcon />
            </IconButton>
            <Typography
              variant='h3'
              sx={{
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 800,
                fontSize: { size: "1.5rem", sm: "2rem", md: "2.575rem" },
                color: "#FFF",
                lineHeight: 1.25,
                alignSelf: "center",
                zIndex: 2,
              }}
            >
              Update Research Output Details
            </Typography>
          </Box>
        </Box>
        <Box sx={{ marginLeft: 10, marginRight: 10, padding: 4 }}>
          {loading ? (
            <Typography>Loading research details...</Typography>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Grid2 container spacing={2}>
                <Grid2 size={2}>
                  <Box sx={{ height: "100%" }}>
                    <TextField
                      fullWidth
                      label='Group Code'
                      variant='filled'
                      value={researchCode}
                      disabled
                    />
                  </Box>
                </Grid2>
                <Grid2 size={3}>
                  <Box sx={{ height: "100%" }}>
                    <FormControl
                      fullWidth
                      variant='filled'
                      disabled={isDisabled}
                    >
                      <InputLabel>Department</InputLabel>
                      <Select
                        value={selectedCollege}
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
                  </Box>
                </Grid2>
                <Grid2 size={3}>
                  <Box sx={{ height: "100%" }}>
                    <FormControl
                      fullWidth
                      variant='filled'
                      disabled={isDisabled}
                    >
                      <InputLabel>Program</InputLabel>
                      <Select
                        value={selectedProgram || ""}
                        onChange={(e) => setSelectedProgram(e.target.value)}
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
                  </Box>
                </Grid2>
                <Grid2 size={2}>
                  <Box sx={{ height: "100%" }}>
                    <FormControl
                      fullWidth
                      variant='filled'
                      disabled={isDisabled}
                    >
                      <InputLabel>Research Type</InputLabel>
                      <Select
                        value={researchType}
                        onChange={(e) => setResearchType(e.target.value)}
                      >
                        <MenuItem value='EXTRAMURAL'>EXTRAMURAL</MenuItem>
                        <MenuItem value='COLLEGE-DRIVEN'>
                          COLLEGE-DRIVEN
                        </MenuItem>
                        <MenuItem value='INTEGRATIVE'>INTEGRATIVE</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </Grid2>
                <Grid2 size={2}>
                  <Box sx={{ height: "100%" }}>
                    <TextField
                      fullWidth
                      label='Date Approved'
                      type='date'
                      variant='filled'
                      value={dateApproved}
                      onChange={(e) => setDateApproved(e.target.value)}
                      disabled={isDisabled}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Box>
                </Grid2>
                <Grid2 size={4}>
                  <Autocomplete
                    multiple
                    value={authors}
                    onChange={(event, newValue) => {
                      // Transform the selected values to a consistent format
                      const formattedAuthors = newValue.map((author) => {
                        if (author.name) {
                          // Already in the correct format
                          return author;
                        } else {
                          // Transform from search result format
                          return {
                            name: `${author.first_name} ${author.last_name}`,
                            user_id: author.user_id || author.researcher_id,
                            email: author.email,
                          };
                        }
                      });
                      setAuthors(formattedAuthors);
                    }}
                    inputValue={authorInputValue}
                    onInputChange={(event, newInputValue) => {
                      setAuthorInputValue(newInputValue);
                      handleAuthorSearch(newInputValue);
                    }}
                    options={authorOptions}
                    getOptionLabel={(option) => {
                      // Handle both formats for display
                      if (option.name) {
                        return `${option.name} (${option.email})`;
                      }
                      return `${option.first_name} ${option.last_name} (${option.email})`;
                    }}
                    isOptionEqualToValue={(option, value) => {
                      // Compare by email since it's unique
                      return option.email === value.email;
                    }}
                    disabled={isDisabled}
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
                    freeSolo
                    options={adviserOptions}
                    value={adviser}
                    onChange={(event, newValue) => {
                      // Transform the selected value to a consistent format
                      if (newValue) {
                        const formattedAdviser = newValue.name
                          ? newValue // Already in correct format
                          : {
                              name: `${newValue.first_name} ${newValue.last_name}`,
                              user_id:
                                newValue.user_id || newValue.researcher_id,
                              email: newValue.email,
                            };
                        setAdviser(formattedAdviser);
                      } else {
                        setAdviser(null);
                      }
                    }}
                    inputValue={adviserInputValue}
                    onInputChange={(event, newInputValue) => {
                      setAdviserInputValue(newInputValue);
                      handleAdviserSearch(newInputValue);
                    }}
                    getOptionLabel={(option) => {
                      // Handle both formats for display
                      if (option.name) {
                        return `${option.name} (${option.email})`;
                      }
                      return `${option.first_name} ${option.last_name} (${option.email})`;
                    }}
                    isOptionEqualToValue={(option, value) => {
                      // Compare by email since it's unique
                      return option.email === value.email;
                    }}
                    disabled={isDisabled}
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
                    value={panels}
                    onChange={(event, newValue) => {
                      // Transform the selected values to a consistent format
                      const formattedPanels = newValue.map((panel) => {
                        if (panel.name) {
                          // Already in the correct format
                          return panel;
                        } else {
                          // Transform from search result format
                          return {
                            name: `${panel.first_name} ${panel.last_name}`,
                            user_id: panel.user_id || panel.researcher_id,
                            email: panel.email,
                          };
                        }
                      });
                      setPanels(formattedPanels);
                    }}
                    inputValue={panelInputValue}
                    onInputChange={(event, newInputValue) => {
                      setPanelInputValue(newInputValue);
                      handlePanelSearch(newInputValue);
                    }}
                    options={panelOptions}
                    getOptionLabel={(option) => {
                      // Handle both formats for display
                      if (option.name) {
                        return `${option.name} (${option.email})`;
                      }
                      return `${option.first_name} ${option.last_name} (${option.email})`;
                    }}
                    isOptionEqualToValue={(option, value) => {
                      // Compare by email since it's unique
                      return option.email === value.email;
                    }}
                    disabled={isDisabled}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label='Panel Members'
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
                    disabled={isDisabled}
                  />
                </Grid2>
                <Grid2 size={6}>
                  <Autocomplete
                    multiple
                    value={selectedSDGs}
                    onChange={(event, newValue) => setSelectedSDGs(newValue)}
                    options={sdgGoalsData.sdgGoals}
                    getOptionLabel={(option) =>
                      `${option.id} - ${option.title}`
                    }
                    disabled={isDisabled}
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
                    onChange={handleKeywordsChange}
                    options={[]}
                    disabled={isDisabled}
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
                    value={abstract}
                    onChange={(e) => setAbstract(e.target.value)}
                    disabled={isDisabled}
                    variant='filled'
                  />
                </Grid2>
                <Grid2
                  size={4}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                  }}
                >
                  <Typography variant='body1' sx={{ color: "#8B8B8B", mb: 1 }}>
                    Full Manuscript:
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      // border: "1px dashed #ccc",
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
                      disabled={isDisabled}
                    />
                  </Box>
                </Grid2>
                <Grid2 size={2} display='flex' justifyContent='center'>
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
                      marginTop: "2.5rem",
                      width: "13rem",
                      borderRadius: "100px",
                      maxHeight: "3rem",
                      "&:hover": {
                        backgroundColor: "#052045",
                        color: "#FFF",
                      },
                    }}
                    onClick={handleViewManuscript}
                  >
                    View Manuscript
                  </Button>
                </Grid2>
              </Grid2>
              <Box
                sx={{ display: "flex", justifyContent: "flex-start", mt: 2 }}
              >
                <Button
                  variant='contained'
                  color='primary'
                  sx={{
                    backgroundColor: "#08397C",
                    color: "#FFF",
                    fontFamily: "Montserrat, sans-serif",
                    fontWeight: 600,
                    textTransform: "none",
                    fontSize: { xs: "0.875rem", md: "1.275rem" },
                    width: "10rem",
                    alignSelf: "center",
                    borderRadius: "100px",
                    maxHeight: "3rem",
                    "&:hover": {
                      backgroundColor: "#052045",
                      color: "#FFF",
                    },
                  }}
                  onClick={editDetails}
                >
                  {isLabel}
                </Button>
                {isVisible && (
                  <Button
                    variant='contained'
                    color='primary'
                    sx={{
                      backgroundColor: "#d40821",
                      color: "#FFF",
                      fontFamily: "Montserrat, sans-serif",
                      fontWeight: 600,
                      textTransform: "none",
                      fontSize: { xs: "0.875rem", md: "1.275rem" },
                      width: "12rem",
                      alignSelf: "center",
                      borderRadius: "100px",
                      maxHeight: "3rem",
                      ml: 2,
                      "&:hover": {
                        backgroundColor: "#8a0b14",
                        color: "#FFF",
                      },
                    }}
                    onClick={handleSaveDetails}
                  >
                    Save Changes
                  </Button>
                )}
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default DisplayResearchInfo;
