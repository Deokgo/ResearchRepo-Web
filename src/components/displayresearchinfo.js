import {
    Box,
    Button,
    Grid,
    TextField,
    Typography,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    IconButton,
    Autocomplete
} from "@mui/material";
import FileUploader from "./FileUploader";
import sdgGoalsData from "../data/sdgGoals.json";
import Divider from '@mui/material/Divider';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from "./navbar";
import homeBg from "../assets/home_bg.png";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import axios from 'axios';

const DisplayResearchInfo = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = location.state || {}; // Default to an empty object if state is undefined
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

    const editDetails = () => {
        setIsDisabled(!isDisabled);
        setIsVisible(!isVisible);
        setIsLabel(isDisabled ? "Cancel" : "Edit Details");
    };

    useEffect(() => {
        if (id) {
            const fetchData = async () => {
                try {
                    const response = await axios.get(`/dataset/fetch_ordered_dataset/${id}`);
                    const fetchedDataset = response.data.dataset || [];
                    console.log("Fetched data:", fetchedDataset);
                    setData({ dataset: fetchedDataset });
                } catch (error) {
                    console.error("Error fetching data:", error);
                    setData({ dataset: [] });
                } finally {
                    setLoading(false);
                }
            };
            fetchData();
        } else {
            console.warn("ID is undefined or null:", id);
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchColleges();
    }, []);

    useEffect(() => {
        if (data && data.dataset && data.dataset.length > 0) {
            const item = data.dataset[0];
            setTitle(item.title || "");
            setGroupCode(item.research_id || "");
            setAbstract(item.abstract || "");
            setResearchType(item.research_type || "");
            setDateApproved(item.date_approved || "");
    
            // Handling keywords
            if (item.concatenated_keywords) {
                const keywordsArray = item.concatenated_keywords.split(';').map(concatenated_keywords => concatenated_keywords.trim());
                setKeywords(keywordsArray);  // Set the state as an array of keywords
            } else {
                setKeywords([]);
            }

            // Handling SDGs
            if (item.sdg) {
                // Split SDG string into an array
                const sdgArray = item.sdg.split(';').map(sdg => sdg.trim());
                setSelectedSDGs(sdgArray);  // Set the state for selected SDGs
            } else {
                setSelectedSDGs([]);
            }

            // Handling full_manuscript

            //
        }
    }, [data]);

    // Mapping SDG IDs to full SDG objects
    const selectedSDGObjects = selectedSDGs.map(sdgId => 
        sdgGoalsData.sdgGoals.find(sdg => sdg.id === sdgId)
    ).filter(Boolean); // Filter out any undefined values
    
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
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Ensure two-digit month
        const day = String(date.getDate()).padStart(2, '0'); // Ensure two-digit day
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

    const handleSaveDetails = () => {
        // Add code for saving updated details
    };

    return (
        <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
            <Navbar />
            <Box sx={{ display: "flex", flexDirection: "column", height: { xs: "100%", md: "calc(100vh - 9rem)" }, marginTop: { xs: "3.5rem", sm: "4rem", md: "6rem" } }}>
                <Box sx={{ position: "relative", marginBottom: 2, display: "flex", flexDirection: { xs: "column", md: "row" }, padding: 4, gap: 4, backgroundSize: "cover", backgroundPosition: "center", height: { xs: "5rem", md: "6rem" }, backgroundColor: "#0A438F" }}>
                    <Box sx={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundImage: `url(${homeBg})`, backgroundSize: "cover", opacity: 0.25, zIndex: 1 }} />
                    <Box sx={{ display: "flex", ml: "5rem", zIndex: 3 }}>
                        <IconButton onClick={() => navigate(-1)} sx={{ color: "#fff" }}>
                            <ArrowBackIosIcon />
                        </IconButton>
                        <Typography variant='h3' sx={{ fontFamily: "Montserrat, sans-serif", fontWeight: 800, fontSize: { xs: "1.5rem", sm: "2rem", md: "2.575rem" }, color: "#FFF", lineHeight: 1.25, alignSelf: "center", zIndex: 2 }}>
                            Update Research Output Details
                        </Typography>
                    </Box>
                </Box>
                <Box sx={{ marginLeft: 15, marginRight: 15, padding: 4 }}>
                    {data && data.dataset && data.dataset.length > 0 ? (
                        data.dataset.map((item, index) => (
                            <Box key={index} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={2}>
                                        <TextField
                                            fullWidth
                                            label='Group Code'
                                            variant='filled'
                                            value={groupCode}
                                            disabled={isDisabled}
                                            onChange={(e) => setGroupCode(e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={3}>
                                        <FormControl fullWidth variant='filled'>
                                            <InputLabel>Department</InputLabel>
                                            <Select value={selectedCollege} onChange={handleCollegeChange} label='Department' disabled={isDisabled}>
                                                {colleges.map((college) => (
                                                    <MenuItem key={college.college_id} value={college.college_id}>{college.college_name}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <FormControl fullWidth variant='filled'>
                                            <InputLabel>Program</InputLabel>
                                            <Select value={selectedProgram} onChange={(e) => setSelectedProgram(e.target.value)} label='Program' disabled={!selectedCollege}>
                                                {programs.map((program) => (
                                                    <MenuItem key={program.program_id} value={program.program_id}>{program.program_name}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={2}>
                                        <FormControl fullWidth variant='filled'>
                                            <InputLabel>Research Type</InputLabel>
                                            <Select disabled={isDisabled} value={researchType} onChange={(e) => setResearchType(e.target.value)}>
                                                <MenuItem value='COLLEGE-DRIVEN'>COLLEGE-DRIVEN</MenuItem>
                                                <MenuItem value='INTEGRATIVE'>INTEGRATIVE</MenuItem>
                                                <MenuItem value='EXTRAMURAL'>EXTRAMURAL</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={2}>
                                        <TextField
                                            fullWidth
                                            label='Date Approved'
                                            variant='filled'
                                            type='date'
                                            disabled={isDisabled}
                                            value={dateApproved ? formatDate(dateApproved) : ''} // Format to yyyy-MM-dd
                                            onChange={(e) => setDateApproved(e.target.value)}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Autocomplete
                                            multiple
                                            options={authorOptions}
                                            getOptionLabel={(option) =>
                                                `${option.first_name || ""} ${option.last_name || ""} (${
                                                option.email || ""
                                                })`
                                            }
                                            value={authors}
                                            disabled={isDisabled}
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
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Autocomplete
                                            freeSolo
                                            options={adviserOptions}
                                            getOptionLabel={(option) =>
                                                `${option.first_name || ""} ${option.last_name || ""} (${
                                                option.email || ""
                                                })`
                                            }
                                            value={adviser}
                                            disabled={isDisabled}
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
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Autocomplete
                                            multiple
                                            options={panelOptions}
                                            getOptionLabel={(option) =>
                                                `${option.first_name || ""} ${option.last_name || ""} (${
                                                option.email || ""
                                                })`
                                            }
                                            value={panels}
                                            disabled={isDisabled}
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
                                    </Grid>
                                    <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label='Title'
                                        variant='filled'
                                        value={title}
                                        disabled={isDisabled}
                                        onChange={(e) => setTitle(e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField
                                            fullWidth
                                            multiline
                                            rows={4}
                                            label='Abstract'
                                            variant='filled'
                                            value={abstract} // Use the state variable here
                                            disabled={isDisabled}
                                            onChange={(e) => setAbstract(e.target.value)} // Update state when changed
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant='body1' sx={{ color: "#8B8B8B" }}>
                                        Full Manuscript:
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
                                            disabled={isDisabled}
                                        />
                                        </Box>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Autocomplete
                                            multiple
                                            options={sdgGoalsData.sdgGoals} // The list of all SDG options
                                            getOptionLabel={(option) => `${option.id} - ${option.title}`} // Display format for each SDG option
                                            value={selectedSDGObjects} // Use the full SDG objects instead of just IDs
                                            onChange={(event, newValue) => setSelectedSDGs(newValue.map(sdg => sdg.id))} // Update selected SDGs with only their IDs
                                            disabled={isDisabled}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="SDG Goals"
                                                    variant="filled"
                                                    helperText="Select one or more SDG goals"
                                                />
                                            )}
                                            renderOption={(props, option) => (
                                                <li {...props}>
                                                    <Typography variant="body2">
                                                        <strong>{option.id}</strong> - {option.title}
                                                    </Typography>
                                                </li>
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Autocomplete
                                            multiple
                                            freeSolo
                                            options={[]} // No predefined options because you're letting the user add keywords
                                            value={keywords} // Display the current keywords in the input
                                            onChange={(event, newValue) => setKeywords(newValue)} // Update the keywords array on change
                                            disabled={isDisabled}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Keywords"
                                                    variant="filled"
                                                    helperText="Type and press Enter to add multiple keywords"
                                                />
                                            )}
                                        />
                                    </Grid>
                                </Grid>
                            </Box>
                        ))
                    ) : (
                        <Typography>No research information available.</Typography>
                    )}
                    <Box sx={{ marginTop: "3rem" }}>
                        <Button variant='contained' color='primary' sx={{ backgroundColor: "#08397C", color: "#FFF", fontFamily: "Montserrat, sans-serif", fontWeight: 600, textTransform: "none", fontSize: { xs: "0.875rem", md: "1.275rem" }, width: "10rem", alignSelf: "center", borderRadius: "100px", maxHeight: "3rem", "&:hover": { backgroundColor: "#052045", color: "#FFF" } }} onClick={editDetails}>
                            {isLabel}
                        </Button>
                        {isVisible && (
                            <Button variant='contained' color='primary' sx={{ backgroundColor: "#d40821", color: "#FFF", fontFamily: "Montserrat, sans-serif", fontWeight: 600, textTransform: "none", fontSize: { xs: "0.875rem", md: "1.275rem" }, width: "10rem", alignSelf: "center", borderRadius: "100px", maxHeight: "3rem", ml: 2, "&:hover": { backgroundColor: "#8a0b14", color: "#FFF" } }} onClick={handleSaveDetails}>
                                Save Changes
                            </Button>
                        )}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default DisplayResearchInfo
