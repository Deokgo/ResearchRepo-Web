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
import UploadFileIcon from "@mui/icons-material/UploadFile";
import axios from "axios";
import { useModalContext } from "./modalcontext";

const AddPaperModal = ({ isOpen, handleClose }) => {
  const [colleges, setColleges] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [selectedCollege, setSelectedCollege] = useState("");
  const [selectedProgram, setSelectedProgram] = useState("");
  const { isAddPaperModalOpen, closeAddPaperModal, openAddPaperModal } =
    useModalContext();
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
          p: 4,
          borderRadius: 2,
          width: "60%",
        }}
      >
        <Typography
          variant='h4'
          sx={{ fontWeight: "bold", mb: 3, color: "#08397C" }}
        >
          Add New Paper
        </Typography>
        <Grid2 container spacing={3}>
          <Grid2 size={3}>
            <TextField fullWidth label='Group Code' variant='filled' />
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
              <Select>
                <MenuItem value='College-Driven'>Integrative Course</MenuItem>
                <MenuItem value='College-Driven'>College-Driven</MenuItem>
                <MenuItem value='Department-Driven'>Faculty-Driven</MenuItem>
              </Select>
            </FormControl>
          </Grid2>
          <Grid2 size={6}>
            <FormControl fullWidth variant='filled'>
              <InputLabel>Adviser</InputLabel>
              <Select>
                <MenuItem value='Khristian G. Kikuchi'>
                  Khristian G. Kikuchi
                </MenuItem>
                <MenuItem value='Other Adviser'>Other Adviser</MenuItem>
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
            <TextField fullWidth label='Title' variant='filled' />
          </Grid2>
          <Grid2 size={12}>
            <TextField
              fullWidth
              label='Abstract'
              multiline
              rows={4}
              variant='filled'
            />
          </Grid2>
          <Grid2 size={12}>
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
              <IconButton component='label'>
                <UploadFileIcon />
                <input type='file' hidden />
              </IconButton>
              <Typography>Browse or drop file</Typography>
            </Box>
          </Grid2>
        </Grid2>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 5,
            gap: 3,
          }}
        >
          <Button
            variant='outlined'
            color='secondary'
            onClick={closeAddPaperModal}
            sx={{
              minWidth: "150px",
              borderColor: "#000",
              color: "#000",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#F2F2F2",
                borderColor: "#000",
              },
            }}
          >
            Back
          </Button>
          <Button
            variant='contained'
            sx={{
              minWidth: "150px",
              backgroundColor: "#CA031B",
              color: "#FFF",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#B20219",
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
