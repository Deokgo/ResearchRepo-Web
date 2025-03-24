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
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import api from "../services/api";
import AutoCompleteTextBox from "../components/Intellibox";
import FileUploader from "../components/FileUploader";
import { useModalContext } from "../context/modalcontext";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { toast } from "react-hot-toast";
import { fetchAndCacheFilterData } from "../utils/trackCache";

const AddPublish = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = location.state || {}; // Default to an empty object if state is undefined

  const [initialValues, setInitialValues] = useState(null);
  const [pub_names, setPubNames] = useState([]);
  const [publicationFormats, setPublicationFormats] = useState([]);

  const [publicationTitle, setPublicationTitle] = useState("");
  const [publicationFormat, setPublicationFormat] = useState("");
  const [indexingStatus, setIndexingStatus] = useState("");

  const [datePresentation, setDatePresentation] = useState("");
  const [datePublished, setDatePublished] = useState("");
  const [finalSubmitted, setFinalSubmitted] = useState(null);

  const { isAddPublishModalOpen, closeAddPublishModal, openAddPublishModal } =
    useModalContext();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);

  ///////////////////// PUBLICATION DATA RETRIEVAL //////////////////////

  // Retrives publication data from the database
  useEffect(() => {
    const fetchPublication = async () => {
      try {
        const response = await api.get(`/track/publication/${id}`);

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
        }
      } catch (error) {
        console.error("Error fetching publication data:", error);
      } finally {
      }
    };

    fetchPublication();
  }, [id]);

  ///////////////////// STATUS UPDATE PUBLICATION //////////////////////
  const onSelectFileHandlerFS = (e) => {
    setFinalSubmitted(e.target.files[0]);
  };

  const onDeleteFileHandlerFS = () => {
    setFinalSubmitted(null);
  };

  const handleBack = () => {
    if (isSubmitting) {
      return;
    }
    let hasChanges;
    hasChanges = indexingStatus || datePublished || finalSubmitted;

    if (hasChanges) {
      setIsConfirmDialogOpen(true);
    } else {
      handleFormCleanup();
      closeAddPublishModal();
    }
  };

  const checkOtherFields = () => {
    // Validate required fields
    // Determine required fields based on publicationFormat
    let requiredFields = {
      "Indexing Status": indexingStatus,
      "Date of Publication": datePublished,
      "Final Submitted Copy": finalSubmitted,
    };

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

    if (missingFields.length > 0) {
      return true;
    }

    return false;
  };

  const handleEditPublication = async () => {
    try {
      const missingFields = checkOtherFields();

      if (missingFields) {
        alert(
          `Please fill in all required fields: ${missingFields.join(", ")}`
        );
        return;
      }

      setIsSubmitting(true);

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
      const response = await api.post(`/track/form/published/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setIsSuccessDialogOpen(true);
    } catch (error) {
      toast.error(error.response?.data?.error || "Error publishing");
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  ///////////////////// PRE-POST MODAL HANDLING //////////////////////

  const handleFormCleanup = () => {
    setIndexingStatus("");
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

  const loadInitialData = async () => {
    try {
      const cachedData = await fetchAndCacheFilterData();
      if (cachedData) {
        setPubNames(cachedData.publicationNames);
        setPublicationFormats(cachedData.publicationFormats);
      }
    } catch (error) {
      console.error("Error loading initial data:", error);
      toast.error("Failed to load form data");
    }
  };
  // Use effect to load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  // Find the name corresponding to the current ID
  const selectedFormatName = publicationFormats.find(
    (format) => format.pub_format_id === initialValues?.journal
  )?.pub_format_name;

  // Disable if the conference date is in the future
  const isDisabled =
    publicationFormat === "PC" &&
    new Date(initialValues?.conference_date) > new Date();

  return (
    <>
      {/* Update Publication Modal */}
      <Modal
        open={isAddPublishModalOpen}
        onClose={isSubmitting ? undefined : handleBack}
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
            Publish {selectedFormatName}
          </Typography>
          {publicationFormat === "PC" && (
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
                  opacity: 0.7,
                }),
              }}
              InputLabelProps={createInputLabelProps()}
              placeholder='ex: PLOS One'
            />
          )}
          {publicationFormat === "JL" && (
            <TextField
              fullWidth
              label='Publication Title'
              variant='outlined'
              margin='dense'
              disabled
              value={publicationTitle}
              sx={createTextFieldStyles()}
              InputLabelProps={createInputLabelProps()}
            />
          )}
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
                ? new Date(datePublished).toLocaleDateString("en-CA")
                : ""
            }
            onChange={(e) => setDatePublished(e.target.value)}
            inputProps={{
              min:
                publicationFormat === "PC"
                  ? initialValues?.conference_date
                  : initialValues?.date_submitted,
              max: new Date(new Date().setDate(new Date().getDate()))
                .toISOString()
                .split("T")[0], // Sets tomorrow as the minimum date
            }}
            sx={createTextFieldStyles()}
            InputLabelProps={{
              ...createInputLabelProps(),
              shrink: true,
            }}
            disabled={isDisabled}
            helperText={isDisabled ? "*Date must be today or earlier" : ""}
          />
          <Grid2 size={3} padding={3}>
            <Typography variant='body2' sx={{ mb: 1 }}>
              <strong>Upload Final Submitted Copy *</strong>
            </Typography>
            <FormControl fullWidth>
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
              variant='contained'
              color='primary'
              onClick={handleEditPublication}
              disabled={checkOtherFields() || isSubmitting}
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
              {isSubmitting ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CircularProgress size={20} color='#08397C' />
                  Publishing...
                </Box>
              ) : (
                "Publish"
              )}
            </Button>
          </Box>
          {/* Add loading overlay */}
          {isSubmitting && (
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(255, 255, 255, 0.7)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 9999,
              }}
            >
              <Box sx={{ textAlign: "center" }}>
                <CircularProgress />
                <Typography sx={{ mt: 2, fontSize: "1.25rem" }}>
                  Publishing...
                </Typography>
              </Box>
            </Box>
          )}

          {/* Save Progress */}
          <Dialog
            open={isConfirmDialogOpen}
            onClose={() => setIsConfirmDialogOpen(false)}
            PaperProps={{
              sx: {
                borderRadius: "15px",
                padding: "1rem",
              },
            }}
          >
            <DialogTitle
              sx={{
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 600,
                color: "#08397C",
              }}
            >
              Unsaved Progress
            </DialogTitle>
            <DialogContent>
              <Typography
                sx={{
                  fontFamily: "Montserrat, sans-serif",
                  color: "#666",
                }}
              >
                You have unsaved progress. Do you want to save your progress?
              </Typography>
            </DialogContent>
            <DialogActions sx={{ padding: "1rem" }}>
              <Button
                onClick={() => {
                  setIsConfirmDialogOpen(false);
                  handleFormCleanup(); // Set flag to clear fields
                  closeAddPublishModal();
                }}
                sx={{
                  backgroundColor: "#CA031B",
                  color: "#FFF",
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 600,
                  textTransform: "none",
                  borderRadius: "100px",
                  padding: "0.75rem",
                  "&:hover": {
                    backgroundColor: "#A30417",
                  },
                }}
              >
                Discard
              </Button>
              <Button
                onClick={() => {
                  setIsConfirmDialogOpen(false);
                  closeAddPublishModal();
                }}
                sx={{
                  backgroundColor: "#08397C",
                  color: "#FFF",
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 600,
                  textTransform: "none",
                  borderRadius: "100px",
                  padding: "0.75rem",
                  "&:hover": {
                    backgroundColor: "#072d61",
                  },
                }}
              >
                Save Progress
              </Button>
            </DialogActions>
          </Dialog>

          {/* Add Success Dialog */}
          <Dialog
            open={isSuccessDialogOpen}
            PaperProps={{
              sx: {
                borderRadius: "15px",
                padding: "1rem",
              },
            }}
          >
            <DialogTitle
              sx={{
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 600,
                color: "#008000",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Box
                component='span'
                sx={{
                  backgroundColor: "#E8F5E9",
                  borderRadius: "75%",
                  padding: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CheckCircleIcon />
              </Box>
              Success
            </DialogTitle>
            <DialogContent>
              <Typography
                sx={{
                  fontFamily: "Montserrat, sans-serif",
                  color: "#666",
                  mt: 1,
                }}
              >
                Research output has been published successfully.
              </Typography>
            </DialogContent>
            <DialogActions sx={{ padding: "1rem" }}>
              <Button
                onClick={() => {
                  setIsSuccessDialogOpen(false);
                  handleFormCleanup();
                  navigate(0);
                }}
                sx={{
                  backgroundColor: "#08397C",
                  color: "#FFF",
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 600,
                  textTransform: "none",
                  borderRadius: "100px",
                  padding: "0.75rem",
                  "&:hover": {
                    backgroundColor: "#072d61",
                  },
                }}
              >
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Modal>
    </>
  );
};

export default AddPublish;
