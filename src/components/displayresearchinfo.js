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
  } from "@mui/material";
import Divider from '@mui/material/Divider';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from "./navbar";
import homeBg from "../assets/home_bg.png";
import { useNavigate } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import axios from 'axios';

const DisplayResearchInfo = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = location.state || {}; // Default to an empty object if state is undefined
    const [data, setData] = useState(null); // Start with null to represent no data
    const [loading, setLoading] = useState(true); // Track loading state

    const [title, setTitle] = useState("");
    const [researchCode, setResearchCode] = useState("");
    const [colleges, setColleges] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [selectedCollege, setSelectedCollege] = useState("");
    const [selectedProgram, setSelectedProgram] = useState("");
    const [authors, setAuthors] = useState("");
    const [abstract, setAbstract] = useState("");
    const [journal, setJournal] = useState("");
    const [researchType, setResearchType] = useState("");
    const [sdg, setSDG] = useState(""); // should allow multiple SDG
    const [keywords, setKeywords] = useState(""); // should allow multiple keywords
    const [year, setYear] = useState("");
    const [fullManus, setFullManus] = useState(""); // for the path of the manus

    const [isDisabled, setIsDisabled] = useState(true);
    const [isVisible, setIsVisible] = useState(false);
    const [isLabel, setIsLabel] = useState("Edit Details");
    
    const editDetails = async () => {
        if (isDisabled == true) {
            setIsDisabled(false);
            setIsVisible(true);
            setIsLabel("Cancel")
        }
        else {
            setIsDisabled(true);
            setIsVisible(false);
            setIsLabel("Edit Details")
        }        
    };

    useEffect(() => {
        if (id) {
            const fetchData = async () => {
                try {
                    const response = await axios.get(`/dataset/fetch_ordered_dataset/${id}`);
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
        fetchColleges();
    }, [id]);

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

    const handleCollegeChange = (event) => {
        const selectedCollegeId = event.target.value;
        setSelectedCollege(selectedCollegeId);
        fetchProgramsByCollege(selectedCollegeId);
        setSelectedProgram(""); // Reset selected program when college changes
    };

    // Insert code for updating details
    const handleSaveDetails = () => {

    }

    return (
        <>
        <Box
            sx={{
                height: "100vh",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <Navbar />
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    height: { xs: "100%", md: "calc(100vh - 9rem)" },
                    marginTop: { xs: "3.5rem", sm: "4rem", md: "6rem" },
                }}
            >
                {/* Header Section */}
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
                    <Box sx={{ display: "flex", ml: "5rem", zIndex: 3 }}>
                    <IconButton
                        onClick={() => navigate(-1)}
                        sx={{
                            color: "#fff",
                        }}
                        >
                        <ArrowBackIosIcon />
                    </IconButton>
                    <Typography
                        variant='h3'
                        sx={{
                        fontFamily: "Montserrat, sans-serif",
                        fontWeight: 800,
                        fontSize: { xs: "1.5rem", sm: "2rem", md: "2.575rem" },
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
                <Box
                    sx={{
                    marginLeft: 15,
                    marginRight: 15,
                    padding: 4,
                    }}
                >
                {data && data.dataset && data.dataset.length > 0 ? (
                    data.dataset.map((item, index) => (
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2}}>
                            <Grid2 container spacing={3}>   
                                <Grid2 size={12} paddingBottom={3} >
                                    <TextField
                                        fullWidth
                                        label='Research Title'
                                        variant='standard'
                                        inputProps={{style: {fontSize: 40}}} // font size of input text
                                        value={item.title}
                                        disabled={isDisabled}
                                        onChange={(e) => setTitle(e.target.value)}
                                    />
                                </Grid2>                        
                                <Grid2 size={3}>
                                    <TextField
                                        fullWidth
                                        label='Research Code'
                                        variant='standard'
                                        value={item.research_id}
                                        disabled={isDisabled}
                                        onChange={(e) => setResearchCode(e.target.value)}
                                    />
                                </Grid2>            
                                <Grid2 size={3}>
                                    <FormControl fullWidth variant='standard'>
                                    <InputLabel>Department</InputLabel>
                                    <Select
                                        value={item.college_id}
                                        onChange={handleCollegeChange}
                                        variant='standard'
                                        label='Department'
                                        disabled={isDisabled}
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
                                    <FormControl fullWidth variant='standard'>
                                    <InputLabel>Program</InputLabel>
                                    <Select
                                        value={item.program_name}
                                        onChange={(e) => setSelectedProgram(e.target.value)}
                                        variant='standard'
                                        label='standard'
                                        disabled={isDisabled}
                                    >
                                        {programs.map((program) => (
                                        <MenuItem key={program.program_id} value={program.program_id}>
                                            {program.program_name}
                                        </MenuItem>
                                        ))}
                                    </Select>
                                    </FormControl>
                                </Grid2>
                                <Grid2 size={3}>
                                    <TextField
                                        fullWidth
                                        label='Year'
                                        variant='standard'
                                        value={item.year}
                                        disabled={isDisabled}
                                        onChange={(e) => setYear(e.target.value)}
                                    />
                                </Grid2>
                                <Grid2 size={6}>
                                    <TextField
                                        fullWidth
                                        label='Authors'
                                        variant='standard'
                                        value={item.concatenated_authors}
                                        disabled={isDisabled}
                                        onChange={(e) => setAuthors(e.target.value)}
                                    />
                                </Grid2>
                                <Grid2 size={3}>
                                    <TextField
                                        fullWidth
                                        label='Abstract'
                                        variant='standard'
                                        value={item.abstract}
                                        disabled={isDisabled}
                                        onChange={(e) => setAbstract(e.target.value)}
                                    />
                                </Grid2>
                                <Grid2 size={3}>
                                    <TextField
                                        fullWidth
                                        label='Journal'
                                        variant='standard'
                                        value={item.journal}
                                        disabled={isDisabled}
                                        onChange={(e) => setJournal(e.target.value)}
                                    />
                                </Grid2>
                                <Grid2 size={6}>
                                    <TextField
                                        fullWidth
                                        label='Keywords'
                                        variant='standard'
                                        value={item.concatenated_keywords}
                                        disabled={isDisabled}
                                        onChange={(e) => setKeywords(e.target.value)}
                                    />
                                </Grid2>
                                <Grid2 size={3}>
                                    <TextField
                                        fullWidth
                                        label='Research Type'
                                        variant='standard'
                                        value={item.research_type}
                                        disabled={isDisabled}
                                        onChange={(e) => setResearchType(e.target.value)}
                                    />
                                </Grid2>
                                <Grid2 size={3}>
                                    <TextField
                                        fullWidth
                                        label='SDG'
                                        variant='standard'
                                        value={item.sdg}
                                        disabled={isDisabled}
                                        onChange={(e) => setSDG(e.target.value)}
                                    />
                                </Grid2>
                                <Grid2 size={12}>
                                    <Divider />
                                </Grid2>
                                <Grid2 size={3}>
                                    <TextField
                                        fullWidth
                                        label='Download Count'
                                        variant='outlined'
                                        value={item.download_count}
                                        disabled
                                    />
                                </Grid2>
                                <Grid2 size={3}>
                                    <TextField
                                        fullWidth
                                        label='View Count'
                                        variant='outlined'
                                        value={item.view_count}
                                        disabled
                                    />
                                </Grid2>
                                <Grid2 size={3}>
                                </Grid2>
                                <Grid2 size={3}>
                                </Grid2>
                            </Grid2>      
                        </Box>                               
                        ))
                    ) : (
                        <div>
                            <p>No research information available.</p>
                        </div>
                    )}  
                    <Box sx={{marginTop: "3rem"}}>
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
                                width: "8rem",
                                alignSelf: "center",
                                borderRadius: "100px",
                                maxHeight: "3rem",
                                marginLeft: "2rem",
                                "&:hover": {
                                    backgroundColor: "#A30417",
                                    color: "#FFF",
                                },
                            }}
                            visible={isVisible}
                        >
                            Save
                        </Button>
                    </Box>                 
                </Box>
            </Box>
        </Box>
            
        </>
    );
};

export default DisplayResearchInfo;
