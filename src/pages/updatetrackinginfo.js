import React, { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import DynamicTimeline from "../components/Timeline";
import { Link } from "react-router-dom";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import PublishIcon from "@mui/icons-material/Publish";
import ArrowForward from "@mui/icons-material/ArrowForward";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {
  Box,
  Button,
  Typography,
  Grid2,
  Divider,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  TextField,
  InputAdornment,
  IconButton,

  DialogTitle,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import api from "../services/api";
import { Snackbar, Alert } from "@mui/material"; // Import Snackbar and Alert from Material UI
import HeaderWithBackButton from "../components/Header";
import { useModalContext } from "../context/modalcontext";
import AddSubmission from "../components/addsubmission";
import AddPublish from "../components/addpublish";
import { toast } from "react-hot-toast";
import { fetchAndCacheFilterData } from "../utils/trackCache";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";

const UpdateTrackingInfo = ({ route, navigate }) => {
  const navpage = useNavigate();
  const location = useLocation();
  const { id } = location.state || {}; // Default to an empty object if state is undefined
  const [data, setData] = useState(null); // Start with null to represent no data
  const [loading, setLoading] = useState(true); // Track loading state
  const [header, setHeader] = useState("Update Tracking Status");

  const [pubData, setPubData] = useState(null);
  const [initialValues, setInitialValues] = useState(null);

  const [publicationFormat, setPublicationFormat] = useState("");
  const [conferenceTitle, setConferenceTitle] = useState("");

  const [status, setStatus] = useState("");
  const [userRemarks, setUserRemarks] = useState("");
  const [remarksError, setRemarksError] = useState(false);

  const { isAddSubmitModalOpen, openAddSubmitModal, closeAddSubmitModal } =
    useModalContext();
  const { isAddPublishModalOpen, openAddPublishModal, closeAddPublishModal } =
    useModalContext();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRevert, setIsRivert] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [openConfirmPulloutDialog, setOpenConfirmPulloutDialog] =
    useState(false);
  const [openConfirmRevertDialog, setOpenConfirmRevertDialog] = useState(false);

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
            publication_paper: fetched_data[0].publication_paper,
          };

          setInitialValues(initialData);
          console.log(initialData);

          if (initialData.status === "PUBLISHED") {
            setHeader("Published Research Details");
          }

          if (initialData.status === "PULLOUT") {
            setHeader("Research Details");
          }

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
          const response = await api.get(
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
      setIsSubmitting(true);
      // Send the data
      const response = await api.post(`/track/form/accepted/${id}`, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setIsSuccessDialogOpen(true);
    } catch (error) {
      toast.error(error.response?.data?.error || "Error updating status");
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  ///////////////////// TRACKING PART //////////////////////
  const [refreshTimeline, setRefreshTimeline] = useState(false); // Track refresh state

  const confirmPullOut = async () => {
    setStatus("PULLOUT");
    setOpenConfirmPulloutDialog(true);
  };

  const confirmReject = async () => {
    setStatus("REJECT");
    setOpenConfirmPulloutDialog(true);
  };

  // Handle pull out status update
  const handleRevert = async () => {
    try {
      setIsRivert(true);

      if (!userRemarks.trim()) {
        setRemarksError(true);
        toast.error("Remarks are required.");
        return;
      }
      setRemarksError(false);

      const formData = new FormData();

      // Add new data
      formData.append("status", status);
      formData.append("user_remarks", userRemarks);

      // Make the status update request
      const response = await api.post(`/track/research_status/pullout/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        },
      });

      if (response.status === 200 || response.status === 201) {
        // Toggle refresh to trigger timeline update
        setRefreshTimeline((prev) => !prev);
      }
      setIsSuccessDialogOpen(true);
    } catch (error) {
      toast.error(error.response?.data?.error || "Error updating status");
      console.error("Error:", error);
    } finally {
      setIsRivert(false);
    }
  };

  ///////////////////// PRE-POST MODAL HANDLING //////////////////////
  const [publicationFormats, setPublicationFormats] = useState([]);

  const loadInitialData = async () => {
    try {
      const cachedData = await fetchAndCacheFilterData();
      if (cachedData) {
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

  const [pdfUrl, setPdfUrl] = useState(null);

  useEffect(() => {
    const fetchPdfFile = async () => {
      const filePath = initialValues?.publication_paper;
      if (filePath) {
        try {
          const response = await api.get(`/paper/view_fs_copy/${id}`, {
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
          height: "100%",
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
            height: "calc(100% - 6rem)",
          }}
        >
          <HeaderWithBackButton title={header} showBackButton={false} />

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
                                      sm: "clamp(1.25rem, 3.5vw, 1.25rem)",
                                      md: "clamp(1.75rem, 4vw, 1.75rem)",
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
                                      md: "clamp(0.9rem, 4vw, 0.9rem)",
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
                                      {publicationFormat === "JL" && (
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
                                      {initialValues?.status ===
                                        "PUBLISHED" && (
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
                                            <strong>
                                              Date of Publication:
                                            </strong>{" "}
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
                                              <strong>
                                                Date of Presentation:
                                              </strong>{" "}
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
                                  {initialValues?.status === "SUBMITTED" && (
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
                                          width: {
                                            xs: "55%",
                                            md: "55%",
                                            lg: "35%",
                                          },
                                          padding: "0.5rem",
                                          borderRadius: "100px",
                                          "&:hover": {
                                            backgroundColor: "#072d61",
                                          },
                                        }}
                                        onClick={handleUpdateToAccept}
                                      >
                                        {isSubmitting ? (
                                          <Box
                                            sx={{
                                              display: "flex",
                                              alignItems: "center",
                                              gap: 1,
                                            }}
                                          >
                                            <CircularProgress
                                              size={20}
                                              color='#08397C'
                                            />
                                            Updating Status...
                                          </Box>
                                        ) : (
                                          <Typography
                                            display='flex'
                                            justifyContent='center'
                                            sx={{
                                              fontSize: {
                                                xs: "0.75rem",
                                                md: "0.9rem",
                                                lg: "0.9rem",
                                              },
                                            }}
                                          >
                                            SUBMITTED &nbsp;
                                            <ArrowForward />
                                            &nbsp;<strong>ACCEPTED</strong>
                                          </Typography>
                                        )}
                                      </Button>
                                    </Box>
                                  )}
                                  {initialValues?.status === "ACCEPTED" && (
                                    <Box marginTop='1rem'>
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
                                            xs: "0.875rem",
                                            md: "0.9rem",
                                          },
                                          padding: {
                                            xs: "0.5rem 1rem",
                                            md: "0.5rem 0.8rem",
                                          },
                                          width: "40%",
                                          borderRadius: "100px",
                                          "&:hover": {
                                            backgroundColor: "#072d61",
                                          },
                                        }}
                                        onClick={openAddPublishModal}
                                      >
                                        <PublishIcon />
                                        &nbsp;Publish {selectedFormatName}
                                      </Button>
                                    </Box>
                                  )}
                                  {initialValues?.status === "PUBLISHED" && (
                                    <Typography
                                      variant='h7'
                                      sx={{
                                        mt: "2rem",
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
                                          title='Published Paper'
                                          style={{
                                            marginTop: "1rem",
                                            width: "100%",
                                            height: "800px", // Increased height from 500px to 800px
                                            border: "1px solid #ddd",
                                            boxShadow:
                                              "0 4px 6px rgba(0,0,0,0.1)", // Added subtle shadow
                                            borderRadius: "8px", // Rounded corners
                                          }}
                                        ></iframe>
                                      ) : (
                                        "None"
                                      )}
                                    </Typography>
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
                                        + Submit Publication
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
                        Updating Status...
                      </Typography>
                    </Box>
                  </Box>
                )}
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
                      Status has been updated succesfully.
                    </Typography>
                  </DialogContent>
                  <DialogActions sx={{ padding: "1rem" }}>
                    <Button
                      onClick={() => {
                        setIsSuccessDialogOpen(false);
                        navpage(0);
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

                <Dialog
                  open={openConfirmPulloutDialog}
                  onClose={() => setOpenConfirmPulloutDialog(false)}
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
                      <PriorityHighIcon />
                    </Box>
                    &nbsp;Confirm Status Change
                  </DialogTitle>
                  <DialogContent>
                    <DialogContentText
                      sx={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      Are you sure you want to {status} this research paper?
                    </DialogContentText>
                    <TextField
                      fullWidth
                      label='Remarks'
                      value={userRemarks}
                      onChange={(e) => setUserRemarks(e.target.value)}
                      error={remarksError}
                      helperText={remarksError ? 'Remarks is required.' : ''}
                      margin='normal'
                      multiline
                      maxRows={1}
                      variant='outlined'
                      required
                      inputProps={{
                        maxLength: 100,
                      }}
                      sx={{ fontSize: { xs: "0.7rem", md: "0.8rem", lg: "0.9rem" } }}
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button
                      onClick={() => {
                        setOpenConfirmPulloutDialog(false);
                        setUserRemarks("");
                        setRemarksError(false);
                      }}
                      variant='text'
                      sx={{
                        color: "#08397C",
                        fontFamily: "Montserrat, sans-serif",
                        fontWeight: 600,
                        textTransform: "none",
                        borderRadius: "100px",
                        padding: "0.75rem",
                        "&:hover": {
                          color: "#072d61",
                        },
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleRevert}
                      variant='contained'
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
                      {status} PAPER
                    </Button>
                  </DialogActions>
                </Dialog>
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
                {(initialValues?.status === "ACCEPTED" ||
                  initialValues?.status === "SUBMITTED") && (
                  <>
                    <Button
                      variant='contained'
                      color='primary'
                      onClick={confirmPullOut}
                      sx={{
                        backgroundColor: "#08397C",
                        color: "#FFF",
                        fontFamily: "Montserrat, sans-serif",
                        fontWeight: 600,
                        textTransform: "none",
                        fontSize: { xs: "0.875rem", md: "0.9rem" },
                        marginTop: "1rem",
                        borderRadius: "100px",
                        "&:hover": {
                          backgroundColor: "#072d61",
                          color: "#FFF",
                        },
                      }}
                    >
                      {isRevert ? (
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <CircularProgress size={20} color='#08397C' />
                          Pulling out...
                        </Box>
                      ) : (
                        <Typography
                          display='flex'
                          justifyContent='center'
                          sx={{ fontSize: { xs: "0.875rem", md: "0.9rem" } }}
                        >
                          <RemoveCircleIcon
                            sx={{
                              fontSize: {
                                xs: "0.9rem",
                                md: "1.2rem",
                                xs: "1.2rem",
                              },
                            }}
                          />{" "}
                          &nbsp; <strong>PULL OUT PAPER</strong>
                        </Typography>
                      )}
                    </Button>
                    <Button
                      variant='contained'
                      color='primary'
                      onClick={confirmReject}
                      sx={{
                        backgroundColor: "#d40821",
                        color: "#FFF",
                        fontFamily: "Montserrat, sans-serif",
                        fontWeight: 600,
                        textTransform: "none",
                        fontSize: { xs: "0.875rem", md: "0.9rem" },
                        marginTop: "1rem",
                        borderRadius: "100px",
                        "&:hover": {
                          backgroundColor: "#A30417",
                          color: "#FFF",
                        },
                      }}
                    >
                      {isRevert ? (
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <CircularProgress size={20} color='#08397C' />
                          Pulling out...
                        </Box>
                      ) : (
                        <Typography
                          display='flex'
                          justifyContent='center'
                          sx={{ fontSize: { xs: "0.875rem", md: "0.9rem" } }}
                        >
                          <RemoveCircleIcon
                            sx={{
                              fontSize: {
                                xs: "0.9rem",
                                md: "1.2rem",
                                xs: "1.2rem",
                              },
                            }}
                          />{" "}
                          &nbsp; <strong>REJECT PAPER</strong>
                        </Typography>
                      )}
                    </Button>
                  </>
                )}
              </Grid2>
            </Grid2>
          </Box>
          {/* Add loading overlay */}
          {isRevert && (
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
                  Pulling out Publication...
                </Typography>
              </Box>
            </Box>
          )}
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
