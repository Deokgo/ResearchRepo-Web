import React, { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import DynamicTimeline from "../components/Timeline";
import { Link } from "react-router-dom";
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import PublishIcon from '@mui/icons-material/Publish';
import ArrowForward from '@mui/icons-material/ArrowForward';
import {
  Box,
  Button,
  Typography,
  Grid2,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { Snackbar, Alert } from "@mui/material"; // Import Snackbar and Alert from Material UI
import HeaderWithBackButton from "../components/Header";
import { useModalContext } from "../context/modalcontext";
import AddSubmission from "../components/addsubmission";
import AddPublish from "../components/addpublish";

const UpdateTrackingInfo = ({ route, navigate }) => {
  const navpage = useNavigate();
  const location = useLocation();
  const { id } = location.state || {}; // Default to an empty object if state is undefined
  const [data, setData] = useState(null); // Start with null to represent no data
  const [loading, setLoading] = useState(true); // Track loading state

  const [pubData, setPubData] = useState(null);
  const [initialValues, setInitialValues] = useState(null);

  const [publicationFormat, setPublicationFormat] = useState("");

  const [conferenceTitle, setConferenceTitle] = useState("");

  const { isAddSubmitModalOpen, openAddSubmitModal, closeAddSubmitModal } = useModalContext();
  const { isAddPublishModalOpen, openAddPublishModal, closeAddPublishModal } = useModalContext();

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
            publication_id: fetched_data[0].publication_id,
            publication_name: fetched_data[0].publication_name,
            journal: fetched_data[0].journal,
            date_published: fetched_data[0].date_published,
            date_submitted: fetched_data[0].date_submitted,
            scopus: fetched_data[0].scopus,
            conference_title: fetched_data[0].conference_title,
            single_country: fetched_data[0].country,
            single_city: fetched_data[0].city,
            conference_date: fetched_data[0].conference_date,
            status: fetched_data[0].status,
            publication_paper: fetched_data[0].publication_paper
          };

          setInitialValues(initialData);
          console.log(initialData);

          // Set current values
          setPublicationFormat(initialData.journal);
          setConferenceTitle(initialData.conference_title);

          setPubData({ dataset: fetched_data });
        }
      } catch (error) {
        console.error("Error fetching publication data:", error);
      } finally {
      }
    };

    fetchPublication();
  }, [id]);

  const isPaperEmpty = Array.isArray(pubData) && pubData.length === 0; // Checks if there are data to be retrived from the database

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
  const handleUpdateToAccept = async () => {
    try {
      // Send the data
      const response = await axios.post(`/track/form/accepted/${id}`, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Response:", response.data);
      alert("Status updated successfully!");

      window.location.reload();
    } catch (error) {
      console.error("Error status update:", error);
      if (error.response) {
        console.error("Error response:", error.response.data);
        alert(
          `Failed to update status: ${
            error.response.data.error || "Please try again."
          }`
        );
      } else {
        alert("Failed to update status. Please try again.");
      }
    }
  };

  ///////////////////// TRACKING PART //////////////////////

  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [refreshTimeline, setRefreshTimeline] = useState(false); // Track refresh state

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await axios.get(`/track/next_status/${id}`); // Replace with your API endpoint
        console.log("API Response:", response.data); // Log the raw response (string)

        setStatus(response.data); // Directly set the response if it's a string
      } catch (err) {
        console.error(err);
        setError("Failed to fetch status.");
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, []);

  useEffect(() => {
    // Disable the button if the status is "PUBLISHED" or "PULLED OUT"
    if (status === "COMPLETED" || status === "PULLOUT" || status === "READY") {
      setIsButtonDisabled(true);
    } else {
      setIsButtonDisabled(false);
    }
  }, [status]);

  // Handle pull out status update
  const handlePullOut = async (newStatus) => {
    try {
      // Make the status update request
      const response = await axios.post(`/track/research_status/pullout/${id}`);

      if (response.status === 200 || response.status === 201) {
        // Toggle refresh to trigger timeline update
        setRefreshTimeline((prev) => !prev);
      }
    } catch (err) {
      console.error("Error updating status:", err);
      setError(err.response?.data?.message || "Failed to update status");
    }
  };

  ///////////////////// PRE-POST MODAL HANDLING //////////////////////
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Function to call the API when the component mounts
    const fetchPaperData = async () => {
      try {
        const response = await fetch(`/track/published_paper/${id}`, {
          method: "GET",
        });

        if (!response.ok) {
          const errorData = await response.json();
          setErrorMessage(errorData.message || "An error occurred!");
          setHasError(true); // Set error flag to true to show banner
        } else {
          // Handle success response (optional)
          const data = await response.json();
          console.log("Success:", data);
        }
      } catch (error) {
        setErrorMessage("Failed to connect to the server.");
        setHasError(true); // Set error flag to true to show banner
      }
    };

    // Call the API immediately
    fetchPaperData();

    // Cleanup: reset the error state when the component unmounts or id changes
    return () => {
      setHasError(false); // Reset error flag on component unmount or id change
    };
  }, [id]);

  // Function to dismiss the alert banner
  const dismissAlert = () => {
    setHasError(false); // Dismiss the alert by setting hasError to false
  };

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

  const [pdfUrl, setPdfUrl] = useState(null);

  useEffect(() => {
    const fetchPdfFile = async () => {
      const filePath = initialValues?.publication_paper;
      if (filePath) {
        try {
          const response = await axios.get(`/paper/view_fs_copy/${id}`, {
            responseType: "blob",
          });

          // Create a blob URL for the PDF
          const blob = new Blob([response.data], { type: "application/pdf" });
          const blobUrl = URL.createObjectURL(blob);

          setPdfUrl(blobUrl);
        } catch (error) {
          console.error("Error fetching the publication paper:", error);
        }
      }
    };

    fetchPdfFile();

    // Cleanup blob URL when component unmounts
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [initialValues?.publication_paper]);

  return (
    <>
      <Box
        sx={{
          margin: 0,
          padding: 0,
          height: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Navbar />
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            height: {
              xs: "calc(100vh - 3.5rem)",
              sm: "calc(100vh - 4rem)",
              md: "calc(100vh - 6rem)",
            },
          }}
        >
          <HeaderWithBackButton
            title='Update Tracking Info'
            onBack={() => navpage(-1)}
          />

          {/*Main Content */}
          <Box
            sx={{
              padding: 3,
            }}
          >
            {/* Left-side Form Section*/}
            <Grid2
              container
              sx={{
                display: "flex",
                flexDirection: "flex-start",
                height: "100%",
              }}
            >
              <Grid2
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
                size={8}
              >
                <Box
                  sx={{
                    border: "1.5px solid #0A438F",
                    marginLeft: 10,
                    marginRight: 5,
                    padding: 3,
                    display: "flex",
                    flexDirection: "column",
                    height: "auto",
                    borderRadius: 3,
                  }}
                >
                  <form onSubmit={null}>
                    <Box
                      sx={{
                        width: "100%",
                        justifyContent: "center",
                      }}
                    >
                      <Grid2 container>
                        {data && data.dataset && data.dataset.length > 0 ? (
                          data.dataset.map((item, index) => (
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                borderRadius: 2,
                                width: "100%",
                              }}
                            >
                              <Grid2
                                container
                                display='flex'
                                flexDirection='column'
                                sx={{ padding: 1 }}
                              >
                                <Typography
                                  variant='h3'
                                  textAlign='left'
                                  fontWeight='700'
                                  sx={{
                                    mb: "0.5rem",
                                    color: "#08397C",
                                    width: "90%",
                                    fontSize: {
                                      xs: "clamp(1rem, 2vw, 1rem)",
                                      sm: "clamp(1.5rem, 3.5vw, 1.5rem)",
                                      md: "clamp(2rem, 4vw, 2rem)",
                                    },
                                  }}
                                >
                                  <Link
                                    to={`/displayresearchinfo/${id}`}
                                    state={{ id }}
                                    style={{
                                      textDecoration: "none",
                                      color: "inherit",
                                    }}
                                  >
                                    {item.title}
                                  </Link>
                                </Typography>
                                <Typography
                                  variant='h7'
                                  sx={{
                                    mb: "0.5rem",
                                    fontSize: {
                                      xs: "clamp(0.7rem, 2vw, 0.7rem)",
                                      sm: "clamp(0.8rem, 3.5vw, 0.8rem)",
                                      md: "clamp(1rem, 4vw, 1rem)",
                                    },
                                  }}
                                  alignSelf='left'
                                  fontWeight='700'
                                >
                                  {Array.isArray(item.authors)
                                    ? item.authors
                                        .map((author) => `${author.name}`)
                                        .join(", ")
                                    : "No authors available"}
                                </Typography>
                                <Typography
                                  variant='h7'
                                  sx={{
                                    mb: "1rem",
                                    color: "#8B8B8B",
                                    fontSize: {
                                      xs: "clamp(0.7rem, 2vw, 0.7rem)",
                                      sm: "clamp(0.7rem, 3.5vw, 0.7rem)",
                                      md: "clamp(0.8rem, 4vw, 0.8rem)",
                                    },
                                  }}
                                  alignSelf='left'
                                  fontWeight='500'
                                >
                                  {item.year}
                                </Typography>
                              </Grid2>
                              <Divider variant='left' sx={{ mb: "0.5rem" }} />
                            </Box>
                          ))
                        ) : (
                          <div>
                            <p>Loading Research Information...</p>
                          </div>
                        )}
                      </Grid2>

                      <div>
                        {/* Snackbar for Alert Banner */}
                        <Snackbar
                          open={hasError}
                          onClose={dismissAlert} // Close the banner when the user interacts with it
                        >
                          <Alert
                            onClose={dismissAlert}
                            severity='error' // "error" severity gives a red background for the alert
                            sx={{ width: "100%" }}
                          >
                            {errorMessage}
                          </Alert>
                        </Snackbar>
                      </div>

                      {/* Publication Part */}
                      <Box padding={1}>
                        {isPaperEmpty ? (
                          <Typography variant='h6' sx={{ color: "#d40821" }}>
                            No Publication Available
                          </Typography>
                        ) : (
                          <Box>
                            <Box>
                              {pubData &&
                              pubData.dataset &&
                              pubData.dataset.length > 0 ? (
                                <Box
                                  sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    position: "relative",
                                    width: "100%",
                                    borderRadius: 2,
                                    height: "auto",
                                  }}
                                >
                                  {/* Labels */}
                                  <Grid2 display='flex' flexDirection='row'>
                                    <Grid2 size={6}>
                                      <Typography
                                        variant='h6'
                                        color='#d40821'
                                        fontWeight='700'
                                        sx={{
                                          mb: "1rem",
                                          fontSize: {
                                            xs: "0.8rem",
                                            md: "1rem",
                                            lg: "1.1rem",
                                          },
                                        }}
                                      >
                                        Publication:
                                      </Typography>
                                    </Grid2>
                                    <Grid2 size={6}>
                                      {conferenceTitle && (
                                        <Typography
                                          variant='h6'
                                          color='#d40821'
                                          fontWeight='700'
                                          sx={{
                                            mb: "1rem",
                                            fontSize: {
                                              xs: "0.8rem",
                                              md: "1rem",
                                              lg: "1.1rem",
                                            },
                                          }}
                                        >
                                          Conference:
                                        </Typography>
                                      )}
                                    </Grid2>
                                  </Grid2>

                                  {/* Details */}
                                  <Grid2 display='flex' flexDirection='row'>
                                    <Grid2
                                      container
                                      size={6}
                                      display='flex'
                                      flexDirection='column'
                                    >
                                      <Typography
                                        variant='h7'
                                        sx={{
                                          mb: "1rem",
                                          fontSize: {
                                            xs: "0.7rem",
                                            md: "0.8rem",
                                            lg: "0.9rem",
                                          },
                                        }}
                                      >
                                        <strong>Publication Type:</strong>{" "}
                                        {selectedFormatName || "None"}
                                      </Typography>
                                      {initialValues?.publication_name && (
                                        <Typography
                                          variant='h7'
                                          sx={{
                                            mb: "1rem",
                                            fontSize: {
                                              xs: "0.7rem",
                                              md: "0.8rem",
                                              lg: "0.9rem",
                                            },
                                          }}
                                        >
                                          <strong>Publication Title:</strong>{" "}
                                          {initialValues?.publication_name ||
                                            "None"}
                                        </Typography>
                                      )}
                                      {publicationFormat === 'JL' && (
                                        
                                        <Typography
                                          variant='h7'
                                          sx={{
                                            mb: "1rem",
                                            fontSize: {
                                              xs: "0.7rem",
                                              md: "0.8rem",
                                              lg: "0.9rem",
                                            },
                                          }}
                                        >
                                          <strong>Date Submitted:</strong>{" "}
                                          {initialValues?.date_submitted
                                            ? new Intl.DateTimeFormat("en-US", {
                                                month: "long",
                                                day: "2-digit",
                                                year: "numeric",
                                              }).format(
                                                new Date(
                                                  initialValues.date_submitted
                                                )
                                              )
                                            : "None"}
                                        </Typography>
                                      )}
                                      {initialValues?.status === 'PUBLISHED' && (
                                        <Box display='flex' flexDirection='column'>
                                          <Typography
                                            variant='h7'
                                            sx={{
                                              mb: "1rem",
                                              fontSize: {
                                                xs: "0.7rem",
                                                md: "0.8rem",
                                                lg: "0.9rem",
                                              },
                                            }}
                                          >
                                            <strong>Indexing Status:</strong>{" "}
                                            {initialValues?.scopus
                                              ? initialValues?.scopus
                                                  .charAt(0)
                                                  .toUpperCase() +
                                                initialValues?.scopus
                                                  .slice(1)
                                                  .toUpperCase()
                                              : "None"}
                                          </Typography>
                                          <Typography
                                            variant='h7'
                                            sx={{
                                              mb: "1rem",
                                              fontSize: {
                                                xs: "0.7rem",
                                                md: "0.8rem",
                                                lg: "0.9rem",
                                              },
                                            }}
                                          >
                                            <strong>Date of Publication:</strong>{" "}
                                            {initialValues?.date_published
                                              ? new Intl.DateTimeFormat(
                                                  "en-US",
                                                  {
                                                    month: "long",
                                                    day: "2-digit",
                                                    year: "numeric",
                                                  }
                                                ).format(
                                                  new Date(
                                                    initialValues.date_published
                                                  )
                                                )
                                              : "None"}
                                          </Typography>

                                          <Typography
                                            variant="h7"
                                            sx={{
                                              mb: "1rem",
                                              fontSize: {
                                                xs: "0.7rem",
                                                md: "0.8rem",
                                                lg: "0.9rem",
                                              },
                                            }}
                                          >
                                            <strong>Published Paper:</strong>{" "}
                                            {pdfUrl ? (
                                              <iframe
                                                src={pdfUrl}
                                                title="Published Paper"
                                                style={{
                                                  width: "100%",
                                                  height: "500px",
                                                  border: "1px solid #ddd",
                                                }}
                                              ></iframe>
                                            ) : (
                                              "None"
                                            )}
                                          </Typography>

                                        </Box>
                                      )}
                                    </Grid2>

                                    {conferenceTitle && (
                                      <Grid2 size={6}>
                                        <Grid2
                                          item
                                          sx={{ mb: "1rem", mr: "2rem" }}
                                        >
                                          <Box
                                            display='flex'
                                            flexDirection='column'
                                          >
                                            <Typography
                                              variant='h7'
                                              sx={{
                                                mb: "1rem",
                                                fontSize: {
                                                  xs: "0.7rem",
                                                  md: "0.8rem",
                                                  lg: "0.9rem",
                                                },
                                              }}
                                            >
                                              <strong>Title:</strong>{" "}
                                              {initialValues?.conference_title ||
                                                "None"}
                                            </Typography>
                                            <Typography
                                              variant='h7'
                                              sx={{
                                                mb: "1rem",
                                                fontSize: {
                                                  xs: "0.7rem",
                                                  md: "0.8rem",
                                                  lg: "0.9rem",
                                                },
                                              }}
                                            >
                                              <strong>Date of Presentation:</strong>{" "}
                                              {initialValues?.conference_date
                                                ? new Intl.DateTimeFormat(
                                                    "en-US",
                                                    {
                                                      month: "long",
                                                      day: "2-digit",
                                                      year: "numeric",
                                                    }
                                                  ).format(
                                                    new Date(
                                                      initialValues.conference_date
                                                    )
                                                  )
                                                : "None"}
                                            </Typography>
                                            <Typography
                                              variant='h7'
                                              sx={{
                                                mb: "1rem",
                                                fontSize: {
                                                  xs: "0.7rem",
                                                  md: "0.8rem",
                                                  lg: "0.9rem",
                                                },
                                              }}
                                            >
                                              <strong>Venue:</strong>{" "}
                                              {`${initialValues?.single_city}, ${initialValues?.single_country}` ||
                                                "None"}
                                            </Typography>
                                          </Box>
                                        </Grid2>
                                      </Grid2>
                                    )}
                                  </Grid2>
                                  {initialValues?.status === 'SUBMITTED' && (
                                      <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "flex-start",
                                        gap: 3,
                                      }}
                                    >
                                      <Typography
                                        variant='h6'
                                        sx={{
                                          fontSize: {
                                            xs: "0.55rem",
                                            md: "0.75rem",
                                            lg: "0.9rem",
                                          },
                                          marginTop: "0.3rem",
                                          borderRadius: "100px",
                                          maxHeight: "3rem",
                                        }}
                                      >
                                        <strong>Update Status:</strong>
                                      </Typography>
                                      <Button
                                        variant='contained'
                                        color='primary'
                                        sx={{
                                          backgroundColor: "#08397C",
                                          color: "#FFF",
                                          fontFamily: "Montserrat, sans-serif",
                                          fontWeight: 300,
                                          textTransform: "none",
                                          fontSize: {
                                            xs: "0.75rem",
                                            md: "0.9rem",
                                            lg: "0.9rem",
                                          },
                                          width: "35%",
                                          padding: "0.5rem",
                                          borderRadius: "100px",
                                          "&:hover": {
                                            backgroundColor: "#072d61",
                                          },
                                        }}
                                        onClick={handleUpdateToAccept}
                                      >
                                        SUBMITTED &nbsp;<ArrowForward/>&nbsp;<strong>ACCEPTED</strong>
                                      </Button>
                                    </Box>
                                  )}
                                  {initialValues?.status === 'ACCEPTED' && (
                                    <Box
                                      marginTop='1rem'
                                    >
                                      <Button
                                        variant='contained'
                                        color='primary'
                                        sx={{
                                          backgroundColor: "#08397C",
                                          color: "#FFF",
                                          fontFamily: "Montserrat, sans-serif",
                                          fontWeight: 500,
                                          textTransform: "none",
                                          fontSize: {
                                            xs: "0.75rem",
                                            md: "0.9rem",
                                            lg: "1rem",
                                          },
                                          width: "40%",
                                          padding: "0.5rem",
                                          borderRadius: "100px",
                                          "&:hover": {
                                            backgroundColor: "#072d61",
                                          },
                                        }}
                                        onClick={openAddPublishModal}
                                      >
                                        <PublishIcon/>&nbsp;Publish {selectedFormatName}
                                      </Button>
                                    </Box>
                                  )}
                                </Box>
                              ) : (
                                <Box
                                  display='flex'
                                  flexDirection='column'
                                  justifyContent='center'
                                >
                                  <Grid2
                                    container
                                    size={6}
                                    justifyContent='flex-start'
                                    margin='1rem'
                                  >
                                    <Box
                                      sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        border: "1px dashed #0A438F",
                                        borderRadius: 1,
                                        cursor: "pointer",
                                        justifyContent: "center",
                                        gap: 2,
                                      }}
                                    >
                                      <Button
                                        variant='text'
                                        color='primary'
                                        sx={{
                                          width: "100%",
                                          color: "#08397C",
                                          fontFamily: "Montserrat, sans-serif",
                                          fontWeight: 600,
                                          textTransform: "none",
                                          fontSize: {
                                            xs: "0.7rem",
                                            md: "0.8rem",
                                            lg: "0.9rem",
                                          },
                                          padding: "1rem",
                                          alignSelf: "center",
                                          maxHeight: "2rem",
                                          "&:hover": {
                                            color: "#052045",
                                          },
                                        }}
                                        onClick={openAddSubmitModal}
                                      >
                                        + Add Publication Details
                                      </Button>
                                    </Box>
                                  </Grid2>
                                </Box>
                              )}
                            </Box>
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </form>
                </Box>
              </Grid2>

              {/* Right-side Timeline Section*/}
              <Grid2
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
                size={3}
              >
                <Box
                  sx={{
                    border: "1.5px solid #0A438F",
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    height: "auto",
                    borderRadius: 3,
                    padding: "1rem", // Optional padding for a better layout
                  }}
                >
                  <DynamicTimeline
                    researchId={id}
                    refresh={refreshTimeline}
                    sx={{
                      alignItems: "flex-start", // Align items to the start
                      "& .MuiTimelineContent-root": {
                        textAlign: "left", // Ensure content aligns left
                      },
                    }}
                  />
                </Box>
                <Button
                  variant='contained'
                  color='primary'
                  onClick={handlePullOut}
                  disabled={isButtonDisabled}
                  sx={{
                    backgroundColor: "#08397C",
                    color: "#FFF",
                    fontFamily: "Montserrat, sans-serif",
                    fontWeight: 600,
                    textTransform: "none",
                    fontSize: { xs: "0.65rem", md: "0.8rem", lg: "1rem" },
                    marginTop: "1rem",
                    padding: "0.5rem",
                    borderRadius: "100px",
                    "&:hover": {
                      backgroundColor: "#072d61",
                      color: "#FFF",
                    },
                  }}
                >
                  <RemoveCircleIcon/>&nbsp; PULL OUT PAPER
                </Button>
              </Grid2>
            </Grid2>
          </Box>
        </Box>
      </Box>
      <AddSubmission
        isOpen={isAddSubmitModalOpen}
        handleClose={closeAddSubmitModal}
      />
      <AddPublish
        isOpen={isAddPublishModalOpen}
        handleClose={closeAddPublishModal}
      />
    </>
  );
};

export default UpdateTrackingInfo;
