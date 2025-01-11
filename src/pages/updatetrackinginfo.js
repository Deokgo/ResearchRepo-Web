import React, { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import DynamicTimeline from "../components/Timeline";
import StatusUpdateButton from "../components/StatusUpdateButton";
import { CircularProgress } from "@mui/material";
import { Link } from "react-router-dom";
import {
  Box,
  Button,
  IconButton,
  TextField,
  Typography,
  Grid2,
  Divider,
  Select,
  FormControl,
  InputLabel,
  Modal,
  MenuItem,
  Pagination,
  InputAdornment,
} from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { Snackbar, Alert } from "@mui/material"; // Import Snackbar and Alert from Material UI
import HeaderWithBackButton from "../components/Header";
import AutoCompleteTextBox from "../components/Intellibox";

const UpdateTrackingInfo = ({ route, navigate }) => {
  const navpage = useNavigate();
  const location = useLocation();
  const [openModalPub, setOpenModalPub] = useState(false);
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const { id } = location.state || {}; // Default to an empty object if state is undefined
  const [data, setData] = useState(null); // Start with null to represent no data
  const [loading, setLoading] = useState(true); // Track loading state

  const [pubData, setPubData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [initialValues, setInitialValues] = useState(null);

  const [publicationName, setPublicationName] = useState("");
  const [datePublished, setDatePublished] = useState("");
  const [publicationFormat, setPublicationFormat] = useState("");
  const [indexingStatus, setIndexingStatus] = useState("");

  const [conferenceTitle, setConferenceTitle] = useState("");
  const [singleCountry, setSingleCountry] = useState("");
  const [singleCity, setSingleCity] = useState("");
  const [countries, setCountries] = useState([]);
  const [Cities, setCities] = useState([]);
  const [dateApproved, setDateApproved] = useState("");
  const [selectedVenue, setSelectedVenue] = useState("");

  const itemsPerPage = 5;

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
            publication_name: fetched_data[0].publication_name || "",
            journal: fetched_data[0].journal || "",
            date_published: fetched_data[0].date_published,
            scopus: fetched_data[0].scopus || "",
            conference_title: fetched_data[0].conference_title || "",
            single_country: fetched_data[0].country || "",
            single_city: fetched_data[0].city || "",
            conference_date: fetched_data[0].conference_date || "",
          };

          setInitialValues(initialData);
          console.log(initialData);

          // Set current values
          setPublicationName(initialData.publication_name);
          setPublicationFormat(initialData.journal);
          setDatePublished(initialData.date_published);
          setIndexingStatus(initialData.scopus);
          setConferenceTitle(initialData.conference_title);
          setSingleCountry(initialData.single_country);
          setSingleCity(initialData.single_city);
          setDateApproved(initialData.conference_date);

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

  ///////////////////// COUNTRY AND CITY API RETRIEVAL //////////////////////
  const fetchCountries = async () => {
    let country = await axios.get(
      "https://countriesnow.space/api/v0.1/countries",
      { withCredentials: false }
    );
    console.log(country);

    setCountries(country.data.data);
  };

  const fetchCities = (country) => {
    const selectedCountry = countries.find((c) => c.country === country);
    if (selectedCountry) {
      setCities(selectedCountry.cities);
      setSingleCity(""); // Reset city when country changes
    }
  };

  const fetchCities2 = (country) => {
    const selectedCountry = countries.find((c) => c.country === country);
    if (selectedCountry) {
      setCities(selectedCountry.cities);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  useEffect(() => {
    if (openModalEdit && singleCountry) {
      fetchCities2(singleCountry); // Fetch cities for the selected country
    }
  }, [openModalEdit, singleCountry]);

  ///////////////////// ADD AND EDIT PUBLICATION //////////////////////
  const checkFields = () => {
    // Validate required fields
      // Determine required fields based on publicationFormat
      let requiredFields;

      if (publicationFormat === "PC") {
        requiredFields = {
          "Publication Name": publicationName,
          "Publication Format": publicationFormat,
          "Publication Date":datePublished,
          "Indexing Status": indexingStatus,
          "Conference Title": conferenceTitle,
          "Country": singleCountry,
          "City": singleCity,
          "Conference Date": dateApproved,
        };
      } else {
          requiredFields = {
            "Publication Name": publicationName,
            "Publication Format": publicationFormat,
            "Publication Date":datePublished,
            "Indexing Status": indexingStatus,}
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
  }

  const handleSavePublication = async () => {
    try {
      const missingFields = checkFields();

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
      formData.append("publication_name", publicationName);
      formData.append("pub_format_id", publicationFormat);
      formData.append("date_published", datePublished);
      formData.append("scopus", indexingStatus);
      formData.append("conference_title", conferenceTitle);
      formData.append("city", singleCity);
      formData.append("country", singleCountry);
      formData.append("conference_date", dateApproved);

      // Send the conference data
      const response = await axios.post(`/track/publication/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Response:", response.data);
      alert("Publication added successfully!");
      handleFormCleanup();

      window.location.reload();
    } catch (error) {
      console.error("Error adding publication:", error);
      if (error.response) {
        console.error("Error response:", error.response.data);
        alert(
          `Failed to add publication: ${
            error.response.data.error || "Please try again."
          }`
        );
      } else {
        alert("Failed to add publication. Please try again.");
      }
    }
  };

  const handleSaveDetails = () => {
    // Check if there are any changes by comparing the current state with initial data
    const hasChanges =
      publicationName != initialValues?.publication_name ||
      publicationFormat != initialValues?.journal ||
      datePublished != initialValues?.date_published ||
      indexingStatus != initialValues?.scopus ||

    console.log("Initial Data:", initialValues);

    if (!hasChanges) {
      alert(
        "No changes were made to save."
      );
    } else {
      handleEditPublication();
    }
  };

  const handleEditPublication = async () => {
    try {
      const missingFields = checkFields();

      if (missingFields.length > 0) {
        alert(
          `All fields are required: ${missingFields.join(", ")}`
        );
        return;
      }

      const formData = new FormData();

      // Get user_id from localStorage
      const userId = localStorage.getItem("user_id");
      formData.append("user_id", userId);

      // Add all required fields to formData
      formData.append("publication_name", publicationName);
      formData.append("journal", publicationFormat);
      formData.append("date_published", datePublished);
      formData.append("scopus", indexingStatus);
      formData.append("conference_title", conferenceTitle);
      formData.append("city", singleCity);
      formData.append("country", singleCountry);
      formData.append("conference_date", dateApproved);

      // Send the conference data
      const response = await axios.put(`/track/publication/${id}`, formData, {
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

  // Revert variables to initial values if editing cancelled
  const toggleEdit = () => {
    if (isEditing) {
      setPublicationName(initialValues.publication_name);
      setPublicationFormat(initialValues.journal);
      setDatePublished(initialValues.date_published);
      setIndexingStatus(initialValues.scopus);
      setConferenceTitle(initialValues.conference_title);
      setDateApproved(initialValues.conference_date);
      setSelectedVenue(initialValues.conference_venue);
    }
    setIsEditing(!isEditing); // Switch view state from view to edit; vice versa
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

  // Handle status update and refresh timeline
  const handleStatusUpdate = async (newStatus) => {
    try {
      // Make the status update request
      const response = await axios.post(`/track/research_status/${id}`, {
        status: newStatus,
      });

      if (response.status === 200 || response.status === 201) {
        // Toggle refresh to trigger timeline update
        setRefreshTimeline((prev) => !prev);

        // Fetch the next available status
        const nextStatusResponse = await axios.get(`/track/next_status/${id}`);
        setStatus(nextStatusResponse.data);
      }
    } catch (err) {
      console.error("Error updating status:", err);
      setError(err.response?.data?.message || "Failed to update status");
    }
  };

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
  const handleOpenModalPub = () => {
    setOpenModalPub(true);
  };

  const handleOpenModalEdit= () => {
    setOpenModalEdit(true);
  };

  const handleFormCleanup = () => {
    setPublicationName("");
    setPublicationFormat("");
    setDatePublished("");
    setIndexingStatus("");

    setConferenceTitle("");
    setSingleCountry("");
    setSingleCity("");
    setDateApproved("");

    setSelectedVenue("");
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
  const [pub_names, setPubNames] = useState([]);
  
  // Fetch data from the API
  useEffect(() => {
    const fetchPub_Names = async () => {
      try {
        const response = await axios.get("/track/data_fetcher/publications/publication_name"); // Replace with your API endpoint
        setPubNames(response.data); // Assuming the API returns an array of fruits
      } catch (error) {
        console.error("Error fetching fruits:", error);
      }
    };

    fetchPub_Names();
  }, []);
  const [conf_title, setConfTitle] = useState([]);
  
  // Fetch data from the API
  useEffect(() => {
    const fetchConf_titles = async () => {
      try {
        const response = await axios.get("/track/data_fetcher/conference/conference_title"); // Replace with your API endpoint
        setConfTitle(response.data); // Assuming the API returns an array of fruits
      } catch (error) {
        console.error("Error fetching fruits:", error);
      }
    };

    fetchConf_titles();
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

  // Handle change event
  const handleChange = (e) => {
    setPublicationFormat(e.target.value); // Update state with selected value
    console.log("Selected Publication Format ID:", e.target.value); // Log the selected value
  };

  // Find the name corresponding to the current ID
  const selectedFormatName = publicationFormats.find(
    (format) => format.pub_format_id === publicationFormat
  )?.pub_format_name;

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
            marginTop: { xs: "3.5rem", sm: "4rem", md: "5rem" },
            height: {
              xs: "calc(100vh - 3.5rem)",
              sm: "calc(100vh - 4rem)",
              md: "calc(100vh - 6rem)",
            },
          }}
        >
          <HeaderWithBackButton
            title="Update Tracking Info"
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
                                    <Grid2 container size={6} display='flex' flexDirection='column'>
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
                                        <strong>Format:</strong>{" "}
                                        {selectedFormatName || "None"}
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
                                        <strong>Publication Name:</strong>{" "}
                                        {publicationName || "None"}
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
                                        <strong>Date Published:</strong>{" "}
                                        {datePublished || "None"}
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
                                        <strong>Indexing Status:</strong>{" "}
                                        {indexingStatus
                                          ? indexingStatus
                                              .charAt(0)
                                              .toUpperCase() +
                                            indexingStatus
                                              .slice(1)
                                              .toLowerCase()
                                          : "None"}
                                      </Typography>
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
                                              {conferenceTitle || "None"}
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
                                              <strong>Date:</strong>{" "}
                                              {dateApproved || "None"}
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
                                              {`${singleCity}, ${singleCountry}` || "None"}
                                            </Typography>
                                          </Box>
                                        </Grid2>
                                      </Grid2>
                                    )}
                                  </Grid2>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "flex-start",
                                      gap: 3,
                                    }}
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
                                        fontSize: {
                                          xs: "0.55rem",
                                          md: "0.75rem",
                                          lg: "0.9rem",
                                        },
                                        marginTop: "1rem",
                                        paddingLeft: "1.5rem",
                                        paddingRight: "1.5rem",
                                        borderRadius: "100px",
                                        maxHeight: "3rem",
                                        "&:hover": {
                                          backgroundColor: "#072d61",
                                        },
                                      }}
                                      onClick={handleOpenModalEdit}
                                    >
                                      Edit
                                    </Button>
                                  </Box>
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
                                        onClick={handleOpenModalPub}
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

              {/* Add Publication Modal */}
              <Modal open={openModalPub}>
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
                    Add Publication Details
                  </Typography>
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
                      Format
                    </InputLabel>
                    <Select
                      label="Format"
                      sx={createTextFieldStyles()} // Assuming this is a custom style function
                      value={publicationFormat || ""}
                      onChange={handleChange} // Call handleChange when user selects an option
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
                        Select publication format
                      </MenuItem>
                      {publicationFormats.map((format) => (
                        <MenuItem key={format.pub_format_id} value={format.pub_format_id} sx={{
                          fontSize: {
                            xs: "0.75rem",
                            md: "0.75rem",
                            lg: "0.8rem",
                          },
                        }}>
                          {format.pub_format_name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <AutoCompleteTextBox
                    fullWidth
                    data={pub_names}
                    value={publicationName}
                    label="Publication Name"
                    id="publication-name"
                    onItemSelected={(value) => setPublicationName(value)} // Update state when a suggestion is selected
                    sx={{...createTextFieldStyles(), 
                      '& .MuiInputLabel-root': {
                      fontSize: {
                        xs: "0.75rem",
                        md: "0.75rem",
                        lg: "0.8rem",
                      },
                    }}}
                    InputLabelProps={createInputLabelProps()}
                    placeholder="ex: PLOS One"
                  />
                  <Grid2 container spacing={4}> 
                    <Grid2 size={6}>
                      <TextField
                        fullWidth
                        label='Date'
                        variant='outlined'
                        type='date'
                        margin='dense'
                        value={datePublished}
                        onChange={(e) => setDatePublished(e.target.value)}
                        sx={createTextFieldStyles()}
                        InputLabelProps={{
                          ...createInputLabelProps(),
                          shrink: true,
                        }}
                      />
                    </Grid2>
                    <Grid2 size={6}>
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
                    </Grid2>
                  </Grid2>
                  {publicationFormat === "PC" && (
                    <Box>
                      <Divider
                        orientation='horizontal'
                        flexItem
                        sx= {{ mt: '0.5rem', mb: '0.5rem' }}
                      />
                      <AutoCompleteTextBox
                        fullWidth
                        data={conf_title}
                        label='Conference Title'
                        value={conferenceTitle}
                        id="conf-name"
                        onItemSelected={(value) => setConferenceTitle(value)}
                        sx={{...createTextFieldStyles(), 
                          '& .MuiInputLabel-root': {
                          fontSize: {
                            xs: "0.75rem",
                            md: "0.75rem",
                            lg: "0.8rem",
                          },
                        }}}
                        InputLabelProps={createInputLabelProps()}
                        placeholder="ex: Proceedings of the International Conference on Artificial Intelligence"
                      />

                      <Grid2 container spacing={4}> 
                        <Grid2 size={6}>
                           <TextField
                            select
                            fullWidth
                            label='Country'
                            value={singleCountry}
                            onChange={(e) => {
                              setSingleCountry(e.target.value);
                              fetchCities(e.target.value);
                            }}
                            margin='dense'
                            sx={{...createTextFieldStyles(), 
                              '& .MuiInputLabel-root': {
                              fontSize: {
                                xs: "0.75rem",
                                md: "0.75rem",
                                lg: "0.8rem",
                              },
                            }}}
                            InputLabelProps={createInputLabelProps()}
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
                              Select your country
                            </MenuItem>
                            {countries.map((country) => (
                              <MenuItem
                                key={country.country}
                                value={country.country}
                                sx={{
                                  fontSize: {
                                    xs: "0.75rem",
                                    md: "0.75rem",
                                    lg: "0.8rem",
                                  },
                                }}
                              >
                                {country.country}
                              </MenuItem>
                            ))}
                          </TextField>
                        </Grid2>
                        <Grid2 size={6}>
                          <TextField
                            select
                            fullWidth
                            label='City'
                            value={singleCity}
                            onChange={(e) => setSingleCity(e.target.value)}
                            margin='dense'
                            disabled={!Cities.length} // Disable if no cities are loaded
                            sx={{...createTextFieldStyles(), 
                              '& .MuiInputLabel-root': {
                              fontSize: {
                                xs: "0.75rem",
                                md: "0.75rem",
                                lg: "0.8rem",
                              },
                            }}}
                            InputLabelProps={createInputLabelProps()}
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
                              Select your city
                            </MenuItem>
                            {Cities.map((city) => (
                              <MenuItem
                                key={city}
                                value={city}
                                sx={{
                                  fontSize: {
                                    xs: "0.75rem",
                                    md: "0.75rem",
                                    lg: "0.8rem",
                                  },
                                }}
                              >
                                {city}
                              </MenuItem>
                            ))}
                          </TextField>
                        </Grid2>
                      </Grid2>
                      <TextField
                        fullWidth
                        label='Conference Date'
                        variant='outlined'
                        type='date'
                        margin='dense'
                        value={dateApproved}
                        onChange={(e) => setDateApproved(e.target.value)}
                        sx={createTextFieldStyles()}
                        InputLabelProps={{
                          ...createInputLabelProps(),
                          shrink: true,
                        }}
                      />
                    </Box>
                  )}
                  <Box
                    sx={{
                      display: "flex",
                      mt: 3,
                      gap: 2,
                    }}
                  >
                    <Button
                      onClick={() => {
                        setPublicationName("");
                        setPublicationFormat("");
                        setDatePublished("");
                        setIndexingStatus("");
                        setOpenModalPub(false);
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
                      onClick={handleSavePublication}
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
                      Add
                    </Button>
                  </Box>
                </Box>
              </Modal>

              {/* Edit Publication Modal */}
              <Modal open={openModalEdit}>
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
                    Edit Publication Details
                  </Typography>
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
                      Format
                    </InputLabel>
                    <Select
                      label="Format"
                      sx={createTextFieldStyles()} // Assuming this is a custom style function
                      value={publicationFormat}
                      onChange={handleChange} // Call handleChange when user selects an option
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
                        Select publication format
                      </MenuItem>
                      {publicationFormats.map((format) => (
                        <MenuItem key={format.pub_format_id} value={format.pub_format_id} sx={{
                          fontSize: {
                            xs: "0.75rem",
                            md: "0.75rem",
                            lg: "0.8rem",
                          },
                        }}>
                          {format.pub_format_name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <AutoCompleteTextBox
                    fullWidth
                    data={pub_names}
                    label="Publication Name"
                    id="publication-name"
                    value={publicationName}
                    onItemSelected={(value) => setPublicationName(value)} // Update state when a suggestion is selected
                    sx={{...createTextFieldStyles(), 
                      '& .MuiInputLabel-root': {
                      fontSize: {
                        xs: "0.75rem",
                        md: "0.75rem",
                        lg: "0.8rem",
                      },
                    }}}
                    InputLabelProps={createInputLabelProps()}
                    placeholder="ex: PLOS One"
                  />
                  <Grid2 container spacing={4}> 
                    <Grid2 size={6}>
                      <TextField
                        fullWidth
                        label='Date'
                        variant='outlined'
                        type='date'
                        margin='dense'
                        value={datePublished
                          ? new Date(
                              datePublished
                            ).toLocaleDateString("en-CA")
                          : ""}
                        onChange={(e) => setDatePublished(e.target.value)}
                        sx={createTextFieldStyles()}
                        InputLabelProps={{
                          ...createInputLabelProps(),
                          shrink: true,
                        }}
                      />
                    </Grid2>
                    <Grid2 size={6}>
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
                    </Grid2>
                  </Grid2>
                  {publicationFormat === "PC" && (
                    <Box>
                      <Divider
                        orientation='horizontal'
                        flexItem
                        sx= {{ mt: '0.5rem', mb: '0.5rem' }}
                      />
                      <AutoCompleteTextBox
                        fullWidth
                        data={conf_title}
                        label='Conference Title'
                        id="conf-name"
                        value={conferenceTitle}
                        onItemSelected={(value) => setConferenceTitle(value)}
                        sx={{...createTextFieldStyles(), 
                          '& .MuiInputLabel-root': {
                          fontSize: {
                            xs: "0.75rem",
                            md: "0.75rem",
                            lg: "0.8rem",
                          },
                        }}}
                        InputLabelProps={createInputLabelProps()}
                        placeholder="ex: Proceedings of the International Conference on Artificial Intelligence"
                      />

                      <Grid2 container spacing={4}> 
                        <Grid2 size={6}>
                           <TextField
                            select
                            fullWidth
                            label='Country'
                            value={singleCountry}
                            onChange={(e) => {
                              setSingleCountry(e.target.value);
                              fetchCities(e.target.value);
                            }}
                            margin='dense'
                            sx={{...createTextFieldStyles(), 
                              '& .MuiInputLabel-root': {
                              fontSize: {
                                xs: "0.75rem",
                                md: "0.75rem",
                                lg: "0.8rem",
                              },
                            }}}
                            InputLabelProps={createInputLabelProps()}
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
                              Select your country
                            </MenuItem>
                            {countries.map((country) => (
                              <MenuItem
                                key={country.country}
                                value={country.country}
                                sx={{
                                  fontSize: {
                                    xs: "0.75rem",
                                    md: "0.75rem",
                                    lg: "0.8rem",
                                  },
                                }}
                              >
                                {country.country}
                              </MenuItem>
                            ))}
                          </TextField>
                        </Grid2>
                        <Grid2 size={6}>
                          <TextField
                            select
                            fullWidth
                            label='City'
                            value={singleCity}
                            onChange={(e) => setSingleCity(e.target.value)}
                            margin='dense'
                            sx={{...createTextFieldStyles(), 
                              '& .MuiInputLabel-root': {
                              fontSize: {
                                xs: "0.75rem",
                                md: "0.75rem",
                                lg: "0.8rem",
                              },
                            }}}
                            InputLabelProps={createInputLabelProps()}
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
                              Select your city
                            </MenuItem>
                            {Cities.map((city) => (
                              <MenuItem
                                key={city}
                                value={city}
                                sx={{
                                  fontSize: {
                                    xs: "0.75rem",
                                    md: "0.75rem",
                                    lg: "0.8rem",
                                  },
                                }}
                              >
                                {city}
                              </MenuItem>
                            ))}
                          </TextField>
                        </Grid2>
                      </Grid2>
                      <TextField
                        fullWidth
                        label='Conference Date'
                        variant='outlined'
                        type='date'
                        margin='dense'
                        value={dateApproved
                          ? new Date(
                              dateApproved
                            ).toLocaleDateString("en-CA")
                          : ""}
                        onChange={(e) => setDateApproved(e.target.value)}
                        sx={createTextFieldStyles()}
                        InputLabelProps={{
                          ...createInputLabelProps(),
                          shrink: true,
                        }}
                      />
                    </Box>
                  )}
                  <Box
                    sx={{
                      display: "flex",
                      mt: 3,
                      gap: 2,
                    }}
                  >
                    <Button
                      onClick={() => {
                        setOpenModalEdit(false);
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
                      onClick={handleSavePublication}
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
                      Save
                    </Button>
                  </Box>
                </Box>
              </Modal>

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
                {loading ? (
                  <CircularProgress />
                ) : error ? (
                  <div style={{ color: "red" }}>{error}</div>
                ) : (
                  status && (
                    <StatusUpdateButton
                      apiUrl={`/track/research_status/${id}`}
                      statusToUpdate={status}
                      disabled={isButtonDisabled}
                      onStatusUpdate={handleStatusUpdate}
                    />
                  )
                )}
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
                    borderRadius: "100px",
                    maxHeight: "3rem",
                    "&:hover": {
                      backgroundColor: "#072d61",
                      color: "#FFF",
                    },
                  }}
                >
                  PULL OUT PAPER
                </Button>
              </Grid2>
            </Grid2>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default UpdateTrackingInfo;
