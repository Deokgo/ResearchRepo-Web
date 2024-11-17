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
import Divider from "@mui/material/Divider";
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

  const editDetails = () => {
    setIsDisabled(!isDisabled);
    setIsVisible(!isVisible);
    setIsLabel(isDisabled ? "Cancel" : "Edit Details");
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

            // Set basic fields
            setTitle(item.title || "");
            setResearchCode(item.research_id || "");
            setSelectedCollege(item.college_id || "");
            setSelectedProgram(item.program_id || "");
            setAbstract(item.abstract || "");
            setResearchType(item.research_type || "");
            setDateApproved(
              item.date_approved
                ? new Date(item.date_approved).toISOString().split("T")[0]
                : ""
            );

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

  const handleSaveDetails = () => {
    // Check if there are any changes by comparing the current state with initial data
    const hasChanges =
      title !== initialData?.title ||
      groupCode !== initialData?.research_id ||
      abstract !== initialData?.abstract ||
      researchType !== initialData?.research_type ||
      dateApproved !== initialData?.date_approved;
    // include
    //keywords.join(';') !== initialData?.keywords ||
    //selectedSDGs.join(';') !== initialData?.sdg;

    if (!hasChanges) {
      alert("No changes are made");
    } else {
      alert("Changes saved successfully!");
      // Your save logic here
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
        `/paper/update_paper/${groupCode}`,
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
  // Mapping SDG IDs to full SDG objects
  const selectedSDGObjects = selectedSDGs
    .map((sdgId) => sdgGoalsData.sdgGoals.find((sdg) => sdg.id === sdgId))
    .filter(Boolean); // Filter out any undefined values

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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Ensure two-digit month
    const day = String(date.getDate()).padStart(2, "0"); // Ensure two-digit day
    return `${year}-${month}-${day}`; // Return the formatted date as yyyy-MM-dd
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
        <Box sx={{ marginLeft: 15, marginRight: 15, padding: 4 }}>
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
                        value={selectedProgram}
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
                        <MenuItem value='INTRAMURAL'>INTRAMURAL</MenuItem>
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
                  <Box sx={{ height: "100%" }}>
                    <Autocomplete
                      multiple
                      value={authors}
                      onChange={(event, newValue) => setAuthors(newValue)}
                      inputValue={authorInputValue}
                      onInputChange={(event, newInputValue) => {
                        setAuthorInputValue(newInputValue);
                        handleAuthorSearch(newInputValue);
                      }}
                      options={authorOptions}
                      getOptionLabel={(option) =>
                        option ? `${option.name} (${option.email})` : ""
                      }
                      disabled={isDisabled}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label='Authors'
                          variant='filled'
                          sx={{ height: "100%" }}
                        />
                      )}
                      sx={{ height: "100%" }}
                    />
                  </Box>
                </Grid2>
                <Grid2 size={4}>
                  <Box sx={{ height: "100%" }}>
                    <Autocomplete
                      value={adviser}
                      onChange={(event, newValue) => setAdviser(newValue)}
                      inputValue={adviserInputValue}
                      onInputChange={(event, newInputValue) => {
                        setAdviserInputValue(newInputValue);
                        handleAdviserSearch(newInputValue);
                      }}
                      options={adviserOptions}
                      getOptionLabel={(option) =>
                        option ? `${option.name} (${option.email})` : ""
                      }
                      disabled={isDisabled}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label='Adviser'
                          variant='filled'
                          sx={{ height: "100%" }}
                        />
                      )}
                      sx={{ height: "100%" }}
                    />
                  </Box>
                </Grid2>
                <Grid2 size={4}>
                  <Box sx={{ height: "100%" }}>
                    <Autocomplete
                      multiple
                      value={panels}
                      onChange={(event, newValue) => setPanels(newValue)}
                      inputValue={panelInputValue}
                      onInputChange={(event, newInputValue) => {
                        setPanelInputValue(newInputValue);
                        handlePanelSearch(newInputValue);
                      }}
                      options={panelOptions}
                      getOptionLabel={(option) =>
                        option ? `${option.name} (${option.email})` : ""
                      }
                      disabled={isDisabled}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label='Panel Members'
                          variant='filled'
                          sx={{ height: "100%" }}
                        />
                      )}
                      sx={{ height: "100%" }}
                    />
                  </Box>
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
                  <TextField
                    fullWidth
                    label='Abstract'
                    variant='filled'
                    multiline
                    rows={4}
                    value={abstract}
                    onChange={(e) => setAbstract(e.target.value)}
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
                      />
                    )}
                  />
                </Grid2>
                <Grid2 size={6}>
                  <FileUploader
                    onSelectFile={onSelectFileHandler}
                    onDeleteFile={onDeleteFileHandler}
                    disabled={isDisabled}
                  />
                </Grid2>
              </Grid2>
              <Box
                sx={{ display: "flex", justifyContent: "flex-start", mt: 2 }}
              >
                <Button
                  variant='contained'
                  onClick={editDetails}
                  sx={{
                    backgroundColor: "#08397C",
                    "&:hover": { backgroundColor: "#072d61" },
                  }}
                >
                  {isLabel}
                </Button>
                {isVisible && (
                  <Button
                    variant='contained'
                    onClick={handleSaveDetails}
                    sx={{
                      marginLeft: 2,
                      backgroundColor: "#08397C",
                      "&:hover": { backgroundColor: "#072d61" },
                    }}
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
