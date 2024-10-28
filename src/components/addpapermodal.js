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
} from "@mui/material";
import axios from "axios";
import { useModalContext } from "./modalcontext";
import FileUploader from './FileUploader';

const AddPaperModal = ({ isOpen, handleClose }) => {
  const [colleges, setColleges] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [selectedCollege, setSelectedCollege] = useState("");
  const [selectedProgram, setSelectedProgram] = useState("");
  const [researchType, setResearchType] = useState("");
  const [dateApproved, setDateApproved] = useState("");
  const [title, setTitle] = useState("");
  const [groupCode, setGroupCode] = useState("");
  const [abstract, setAbstract] = useState("");
  const { isAddPaperModalOpen, closeAddPaperModal, openAddPaperModal } =
    useModalContext();
  const [file, setFile] = useState(null);
  
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

  const handleCollegeChange = (event) => {
    const selectedCollegeId = event.target.value;
    setSelectedCollege(selectedCollegeId);
    fetchProgramsByCollege(selectedCollegeId);
    setSelectedProgram(""); // Reset selected program when college changes
  };

  const onSelectFileHandler = (e) => {
    setFile(e.target.files[0]);
  }
  
  const onDeleteFileHandler = () => {
  
  }

  const handleAddPaper = async () => {
    try {
      const response = await axios.post('paper/add_paper', {
        research_id: groupCode,
        college_id: selectedCollege,
        program_id: selectedProgram,
        title: title,
        abstract: abstract,
        date_approved: dateApproved,
        research_type: researchType,
      });
      console.log("Response:", response.data);
      alert("Paper added successfully!");
      closeAddPaperModal();
    } catch (error) {
      console.error("Error adding paper:", error);
      alert("Failed to add paper. Please try again.");
    }
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
          p: 6,
          borderRadius: 2,
          width: "60%",
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
          <Grid2 size={3}>
            <TextField 
            fullWidth
            label="Group Code"
            variant="filled"
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
          <Grid2 size={3}>
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
          <Grid2 size={3}>
            <TextField
              fullWidth
              label="Date Approved"
              variant="filled"
              type="date"
              value={dateApproved}
              onChange={(e) => setDateApproved(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid2>     
          <Grid2 size={3}>
            <FormControl fullWidth variant='filled'>
              <InputLabel>Adviser</InputLabel>
              <Select>
                <MenuItem value='Khristian G. Kikuchi'>
                  Khristian G. Kikuchi
                </MenuItem>
                <MenuItem value='AddNewAdviser' sx={{
                    fontFamily: "Montserrat, sans-serif",
                    fontWeight: 300,
                    color: "#0A438F",
                  }}>+ Add New Adviser</MenuItem>
              </Select>
            </FormControl>
          </Grid2>
          <Grid2 size={6}>
            <TextField fullWidth label='Panels' variant='filled' />
          </Grid2>
          <Grid2 size={6}>
            <TextField fullWidth label='Targeted SDG/s' variant='filled' />
          </Grid2>
          <Grid2 size={6}>
            <TextField fullWidth label='Keywords' variant='filled' />
          </Grid2>
          <Grid2 size={12}>
            <TextField 
              fullWidth
              label="Title"
              variant="filled"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
             />
          </Grid2>
          <Grid2 size={12}>
            <TextField
              fullWidth
              label="Abstract"
              multiline
              rows={4}
              variant="filled"
              value={abstract}
              onChange={(e) => setAbstract(e.target.value)}
            />
          </Grid2>
          <Grid2 size={12}>
            <Typography variant='body1' sx={{ color: "#8B8B8B" }}>Upload Full Manuscript:</Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                border: "1px dashed #ccc",
                borderRadius: 1,
                p: 2,
                cursor: "pointer",
                justifyContent: "center",
                gap: 2,
              }}
            >
              <FileUploader onSelectFile={onSelectFileHandler}
                onDeleteFile={onDeleteFileHandler} />
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
            variant='outlined'
            onClick={closeAddPaperModal}
            sx={{
              backgroundColor: "#FFF",
              color: "#08397C",
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 600,
              textTransform: "none",
              fontSize: { xs: "0.875rem", md: "1.375rem" },
              padding: { xs: "0.5rem", md: "1.5rem" },
              marginLeft: "2rem",
              borderRadius: "100px",
              borderColor: "#8B8B8B",
              maxHeight: "3rem",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#D4D4D6",
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
              fontSize: { xs: "0.875rem", md: "1.375rem" },
              padding: { xs: "0.5rem 1rem", md: "1.5rem" },
              marginLeft: "2rem",
              borderRadius: "100px",
              maxHeight: "3rem",
              textTransform: "none",
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
