import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid2,
  Select,
  FormControl,
  InputLabel,
  Modal,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import axios from "axios";
import AutoCompleteTextBox from "../components/Intellibox";
import FileUploader from "../components/FileUploader";
import { useModalContext } from "../context/modalcontext";

const AddPublish = () => {
  const location = useLocation();
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const { id } = location.state || {}; // Default to an empty object if state is undefined
  const [data, setData] = useState(null); // Start with null to represent no data
  const [loading, setLoading] = useState(true); // Track loading state

  const [pubData, setPubData] = useState(null);
  const [initialValues, setInitialValues] = useState(null);

  const [publicationTitle, setPublicationTitle] = useState("");
  const [publicationFormat, setPublicationFormat] = useState("");
  const [indexingStatus, setIndexingStatus] = useState("");

  const [datePresentation, setDatePresentation] = useState("");
  const [datePublished, setDatePublished] = useState("");
  const [finalSubmitted, setFinalSubmitted] = useState(null);

  const { isAddPublishModalOpen, closeAddPublishModal, openAddPublishModal } = useModalContext();

  ///////////////////// PUBLICATION DATA RETRIEVAL //////////////////////

  // Retrives publication data from the database
  useEffect(() => {
    const fetchPublication = async () => {
      try {
        const response = await axios.get(`/track/publication/${id}`);

        if (response.data.dataset && response.data.dataset.length > 0) {
          const fetched_data = response.data.dataset;
          console.log("Fetched publication data:", fetched_data);

          const initialData = {
            publication_name: fetched_data[0].publication_name,
            journal: fetched_data[0].journal,
            date_submitted: fetched_data[0].date_submitted,
            conference_date: fetched_data[0].conference_date,
          };

          setInitialValues(initialData);
          console.log(initialData);

          // Set current values
          setPublicationTitle(initialData.publication_name);
          setPublicationFormat(initialData.journal);
          setDatePresentation(initialData.conference_date);

          setPubData({ dataset: fetched_data });
        }
      } catch (error) {
        console.error("Error fetching publication data:", error);
      } finally {
      }
    };

    fetchPublication();
  }, [id]);


  ///////////////////// RESEARCH DATA RETRIEVAL //////////////////////
  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          const response = await axios.get(
            `/dataset/fetch_ordered_dataset/${id}`
          );
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

  ///////////////////// STATUS UPDATE PUBLICATION //////////////////////
  const onSelectFileHandlerFS = (e) => {
    setFinalSubmitted(e.target.files[0]);
  };


  const onDeleteFileHandlerFS = () => {
    setFinalSubmitted(null);
  };

  const checkOtherFields = () => {
    // Validate required fields
    // Determine required fields based on publicationFormat
    let requiredFields;

    if (publicationFormat === "PC") {
      requiredFields = {
        "Publication Title": publicationTitle,
        "Indexing Status" : indexingStatus,
        "Date of Publication" : datePublished,
        "Final Submitted Copy" : finalSubmitted
      };
    } else {
      requiredFields = {
        "Indexing Status" : indexingStatus,
        "Date of Publication" : datePublished,
        "Final Submitted Copy" : finalSubmitted
      };
    }
    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => {
        if (Array.isArray(value)) {
          return value.length === 0;
        }
        return !value;
      })
      .map(([key]) => key);

    const approvedDate = new Date(datePublished);
    const today = new Date();

    // Normalize both dates to midnight
    approvedDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    return missingFields;
  };

  const handleEditPublication = async () => {
    try {
      const missingFields = checkOtherFields();

      if (missingFields.length > 0) {
        alert(`Please fill in all required fields: ${missingFields.join(", ")}`);
        return;
      }

      const formData = new FormData();

      // Get user_id from localStorage
      const userId = localStorage.getItem("user_id");
      formData.append("user_id", userId);

      // Add all required fields to formData
      formData.append("scopus", indexingStatus);
      formData.append("date_published", datePublished);
      formData.append("publication_paper", finalSubmitted);

      if (publicationFormat === "PC") {
        formData.append("publication_name", publicationTitle);
      }

      // Send the conference data
      const response = await axios.post(`/track/form/published/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Response:", response.data);
      alert("Publication updated successfully!");
      handleFormCleanup();

      window.location.reload();
    } catch (error) {
      console.error("Error updating publication:", error);
      if (error.response) {
        console.error("Error response:", error.response.data);
        alert(
          `Failed to update publication: ${
            error.response.data.error || "Please try again."
          }`
        );
      } else {
        alert("Failed to update publication. Please try again.");
      }
    }
  };

  ///////////////////// PRE-POST MODAL HANDLING //////////////////////

  const handleFormCleanup = () => {
    setPublicationTitle("");
    setPublicationFormat("");
    setDatePresentation("");
    setDatePublished("");
  };

  // Utility function to create responsive TextField styles
  const createTextFieldStyles = (customFlex = 2) => ({
    flex: customFlex,
    "& .MuiInputBase-input": {
      fontSize: {
        xs: "0.6em", // Mobile
        sm: "0.7rem", // Small devices
        md: "0.8rem", // Medium devices
        lg: "0.9rem", // Large devices
      },
    },
  });

  // Utility function to create responsive label styles
  const createInputLabelProps = () => ({
    sx: {
      fontSize: {
        xs: "0.55rem", // Mobile
        sm: "0.65rem", // Small devices
        md: "0.75rem", // Medium devices
        lg: "0.85rem", // Large devices
      },
    },
  });

  const [pub_names, setPubNames] = useState([]);

  // Fetch data from the API
  useEffect(() => {
    const fetchPub_Names = async () => {
      try {
        const response = await axios.get(
          "/track/data_fetcher/publications/publication_name"
        ); // Replace with your API endpoint
        setPubNames(response.data); // Assuming the API returns an array of fruits
      } catch (error) {
        console.error("Error fetching fruits:", error);
      }
    };

    fetchPub_Names();
  }, []);

  const [publicationFormats, setPublicationFormats] = useState([]);
  
    useEffect(() => {
        const fetchPublicationFormats = async () => {
        try {
            const response = await fetch("/track/fetch_data/pub_format"); // Replace with your API URL
            const data = await response.json(); // Directly parse the JSON response (array format)
            setPublicationFormats(data);
        } catch (error) {
            console.error("Error fetching publication formats:", error);
        }
        };

        fetchPublicationFormats();
    }, []);

  // Find the name corresponding to the current ID
  const selectedFormatName = publicationFormats.find(
    (format) => format.pub_format_id === initialValues?.journal
  )?.pub_format_name;

  return (
    <>
    {/* Update Publication Modal */}
    <Modal open={isAddPublishModalOpen}>
        <Box
            sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "40rem",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 5,
            borderRadius: "8px",
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
            Publish {selectedFormatName}
            </Typography>
            <AutoCompleteTextBox
            fullWidth
            data={pub_names}
            label='Publication Title'
            id='publication-name'
            value={publicationTitle}
            onItemSelected={(value) => setPublicationTitle(value)} // Update state when a suggestion is selected
            sx={{
                ...createTextFieldStyles(),
                "& .MuiInputLabel-root": {
                fontSize: {
                    xs: "0.75rem",
                    md: "0.75rem",
                    lg: "0.8rem",
                },
                },
                ...(publicationFormat === "JL" && {
                pointerEvents: "none",
                opacity: 0.7
                })
            }}
            InputLabelProps={createInputLabelProps()}
            placeholder='ex: PLOS One'
            />
            <FormControl fullWidth variant='outlined' margin='dense'>
            <InputLabel
                sx={{
                fontSize: {
                    xs: "0.75rem",
                    md: "0.75rem",
                    lg: "0.8rem",
                },
                }}
            >
                Indexing Status
            </InputLabel>
            <Select
                label='Indexing Status'
                sx={createTextFieldStyles()}
                value={indexingStatus}
                onChange={(e) => setIndexingStatus(e.target.value)}
            >
                <MenuItem
                value=''
                disabled
                sx={{
                    fontSize: {
                    xs: "0.75rem",
                    md: "0.75rem",
                    lg: "0.8rem",
                    },
                }}
                >
                Select indexing status
                </MenuItem>
                <MenuItem
                value='SCOPUS'
                sx={{
                    fontSize: {
                    xs: "0.75rem",
                    md: "0.75rem",
                    lg: "0.8rem",
                    },
                }}
                >
                Scopus
                </MenuItem>
                <MenuItem
                value='NON-SCOPUS'
                sx={{
                    fontSize: {
                    xs: "0.75rem",
                    md: "0.75rem",
                    lg: "0.8rem",
                    },
                }}
                >
                Non-Scopus
                </MenuItem>
            </Select>
            </FormControl>
            <TextField
            fullWidth
            label='Date of Publication'
            variant='outlined'
            type='date'
            margin='dense'
            value={
                datePublished
                ? new Date(datePublished).toLocaleDateString(
                    "en-CA"
                    )
                : ""
            }
            onChange={(e) => setDatePublished(e.target.value)}
            inputProps={{
                min: publicationFormat === 'PC' ? initialValues?.conference_date : initialValues?.date_submitted,
                max: new Date(new Date().setDate(new Date().getDate())).toISOString().split('T')[0] // Sets tomorrow as the minimum date
            }}
            sx={createTextFieldStyles()}
            InputLabelProps={{
                ...createInputLabelProps(),
                shrink: true,
            }}
            />
            <Grid2 size={3} padding={3}>
            <Typography variant='body2' sx={{ mb: 1 }}>
                <strong>Upload Final Submitted Copy *</strong>
            </Typography>
            <FormControl
                fullWidth
            >
                <FileUploader
                onFileSelect={onSelectFileHandlerFS}
                onFileDelete={onDeleteFileHandlerFS}
                selectedFile={finalSubmitted}
                required
                sx={{ width: "100%" }}
                />
            </FormControl>
            </Grid2>
            <Box
            sx={{
                display: "flex",
                mt: 3,
                gap: 2,
            }}
            >
            <Button
                onClick={() => {
                setPublicationTitle("");
                setIndexingStatus("");
                setDatePresentation("");
                setFinalSubmitted("");
                closeAddPublishModal();
                }}
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
                variant='contained'
                color='primary'
                onClick={handleEditPublication}
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
                Publish
            </Button>
            </Box>
        </Box>
    </Modal>
    </>
  );
};

export default AddPublish;
