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
  Autocomplete,
} from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { Snackbar, Alert } from "@mui/material"; // Import Snackbar and Alert from Material UI
import HeaderWithBackButton from "../components/Header";
import AutoCompleteTextBox from "../components/Intellibox";
import InfoIcon from "@mui/icons-material/Info";
import Tooltip from "@mui/material/Tooltip";

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

  const [publicationID, setPublicationID] = useState("");
  const [publicationName, setPublicationName] = useState("");
  const [dateSubmitted, setDateSubmitted] = useState("");
  const [publicationFormat, setPublicationFormat] = useState("");
  const [indexingStatus, setIndexingStatus] = useState("");

  const [conferenceTitle, setConferenceTitle] = useState("");
  const [singleCountry, setSingleCountry] = useState("");
  const [singleCity, setSingleCity] = useState("");
  const [countries, setCountries] = useState([]);
  const [countriesAPI, setCountriesAPI] = useState([]);
  const [citiesAPI, setCitiesAPI] = useState([]);
  const [Cities, setCities] = useState([]);
  const [datePresentation, setDatePresentation] = useState("");
  const [selectedVenue, setSelectedVenue] = useState("");
  const [conferenceVenues, setConferenceVenues] = useState([]);

  const [countrySearchText, setCountrySearchText] = useState("");
  const [citySearchText, setCitySearchText] = useState("");

  const [currentStatus, setCurrentStatus] = useState("");

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
            status: fetched_data[0].status
          };

          setInitialValues(initialData);
          console.log(initialData);

          // Set current values
          setPublicationID(initialData.publication_id);
          setPublicationName(initialData.publication_name);
          setPublicationFormat(initialData.journal);
          setDateSubmitted(initialData.date_submitted);
          setIndexingStatus(initialData.scopus);
          setConferenceTitle(initialData.conference_title);
          setSingleCountry(initialData.single_country);
          setSingleCity(initialData.single_city);
          setDatePresentation(initialData.conference_date);
          setCurrentStatus(initialData.status);

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
    try {
      const response = await axios.get(
        "https://countriesnow.space/api/v0.1/countries",
        { withCredentials: false }
      );
      console.log("Countries API response:", response.data.data);
      setCountriesAPI(response.data.data);
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  };

  const fetchConferenceVenues = async () => {
    try {
      const response = await axios.get("/track/fetch_data/conference");
      console.log("Conference response:", response.data);

      // Process the conference venues
      const venues = response.data
        .map((conf) => {
          if (conf.conference_venue) {
            const [city, country] = conf.conference_venue
              .split(",")
              .map((part) => part.trim());
            return { city, country };
          }
          return null;
        })
        .filter((venue) => venue !== null);

      console.log("Processed venues:", venues);
      setConferenceVenues(venues);
    } catch (error) {
      console.error("Error fetching conference venues:", error);
    }
  };

  // Combined function to fetch all data
  const fetchAllData = async () => {
    try {
      await Promise.all([fetchCountries(), fetchConferenceVenues()]);
      console.log("All data fetched successfully");
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Use effect to fetch data when component mounts
  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    if (countriesAPI.length > 0 && conferenceVenues.length > 0) {
      // Get unique countries from conference venues
      const venueCountries = new Set(
        conferenceVenues.map((venue) => venue.country)
      );

      const filteredCountries = countriesAPI.filter((country) =>
        venueCountries.has(country.country)
      );

      console.log("Filtered countries:", filteredCountries);
      setCountries(filteredCountries);
    }
  }, [countriesAPI, conferenceVenues]);

  const fetchCities = (country, shouldClearCity = true) => {
    // Get cities from countries API for the selected country
    const selectedCountry = countries.find((c) => c.country === country);
    if (selectedCountry) {
      setCitiesAPI(selectedCountry.cities);

      // Get cities from conference venues for the selected country
      const venueCities = conferenceVenues
        .filter((venue) => venue.country === country)
        .map((venue) => venue.city);

      // Filter API cities to only include those that are in our venues
      const filteredCities = selectedCountry.cities.filter((city) =>
        venueCities.includes(city)
      );

      console.log("Available cities for", country, ":", filteredCities);
      setCities(filteredCities);

      // Clear selected city if needed
      if (shouldClearCity) {
        setSingleCity("");
      }
    }
  };

  // Call this when country changes
  useEffect(() => {
    if (openModalEdit && singleCountry) {
      fetchCities(singleCountry); // Fetch cities for the selected country
    }
  }, [openModalEdit, singleCountry]);

  ///////////////////// ADD AND UPDATE PUBLICATION //////////////////////
  const checkFields = () => {
    // Validate required fields
    // Determine required fields based on publicationFormat
    let requiredFields;

    if (publicationFormat === "PC") {
      requiredFields = {
        "Publication Type": publicationFormat,
        "Conference Title": conferenceTitle,
        Country: singleCountry,
        City: singleCity,
        "Date of Presentation": datePresentation,
      };
    } else {
      requiredFields = {
        "Publication Name": publicationName,
        "Publication Type": publicationFormat,
        "Date of Submission": dateSubmitted,
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

    const approvedDate = new Date(dateSubmitted);
    const today = new Date();

    // Normalize both dates to midnight
    approvedDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    return missingFields;
  };

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
      formData.append("date_submitted", dateSubmitted);
      formData.append("conference_title", conferenceTitle);
      formData.append("city", singleCity);
      formData.append("country", singleCountry);
      formData.append("conference_date", datePresentation);

      // Send the conference data
      const response = await axios.post(`/track/form/submitted/${id}`, formData, {
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

  const handleCheckChanges = () => {
    // Check if there are any changes by comparing the current state with initial data
    const hasChanges =
      publicationName != initialValues?.publication_name ||
      publicationFormat != initialValues?.journal ||
      dateSubmitted != initialValues?.date_published ||
      conferenceTitle != initialValues?.conference_title ||
      datePresentation != initialValues?.conference_date ||
      singleCity != initialValues?.single_city ||
      singleCountry != initialValues?.single_country ||
      console.log("Initial Data:", initialValues);

    return hasChanges;
  };

  const handleSaveDetails = () => {
    const hasChanges = handleCheckChanges();

    if (!hasChanges) {
      alert("No changes were made to save.");
      setOpenModalEdit(false);
      return;
    }
    handleEditPublication();
  };

  const handleCheckDetails = () => {
    const hasChanges = handleCheckChanges();

    if (hasChanges) {
      const userConfirmed = window.confirm(
        "You have unsaved changes. Save Changes?"
      );

      if (userConfirmed) {
        handleEditPublication();
        return;
      }
      setOpenModalEdit(false);
    }

    // Reset current values
    setPublicationName(initialValues?.publication_name);
    setPublicationFormat(initialValues?.journal);
    setDateSubmitted(initialValues?.date_published);
    setIndexingStatus(initialValues?.scopus);
    setConferenceTitle(initialValues?.conference_title);
    setSingleCountry(initialValues?.single_country);
    setSingleCity(initialValues?.single_city);
    setDatePresentation(initialValues?.conference_date);

    setOpenModalEdit(false);
  };

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
      handleFormCleanup();

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

  const handleEditPublication = async () => {
    try {
      const missingFields = checkFields();

      if (missingFields.length > 0) {
        alert(`All fields are required: ${missingFields.join(", ")}`);
        return;
      }

      const formData = new FormData();

      // Get user_id from localStorage
      const userId = localStorage.getItem("user_id");
      formData.append("user_id", userId);

      // Add all required fields to formData
      formData.append("publication_id", publicationID);
      formData.append("publication_name", publicationName);
      formData.append("journal", publicationFormat);
      formData.append("date_published", dateSubmitted);
      formData.append("scopus", indexingStatus);

      if (publicationFormat === "PC") {
        formData.append("conference_title", conferenceTitle);
        formData.append("city", singleCity);
        formData.append("country", singleCountry);
        formData.append("conference_date", datePresentation);
      }

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
      setDateSubmitted(initialValues.date_published);
      setIndexingStatus(initialValues.scopus);
      setConferenceTitle(initialValues.conference_title);
      setDatePresentation(initialValues.conference_date);
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

  const handleUpdateModalPub = () => {
    setOpenModalEdit(true);
  };

  const handleFormCleanup = () => {
    setPublicationName("");
    setPublicationFormat("");
    setDateSubmitted("");
    setIndexingStatus("");

    setConferenceTitle("");
    setSingleCountry("");
    setSingleCity("");
    setDatePresentation("");
    setCurrentStatus("");

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
  const [conf_title, setConfTitle] = useState([]);

  // Fetch data from the API
  useEffect(() => {
    const fetchConf_titles = async () => {
      try {
        const response = await axios.get(
          "/track/data_fetcher/conference/conference_title"
        ); // Replace with your API endpoint
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
    (format) => format.pub_format_id === initialValues?.journal
  )?.pub_format_name;

  // Modified country selection handling
  const handleCountryChange = (event, newValue) => {
    setSingleCountry(newValue);
    if (newValue) {
      fetchCities(newValue);
    }
  };

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
                                          <strong>Publication Name:</strong>{" "}
                                          {initialValues?.publication_name ||
                                            "None"}
                                        </Typography>
                                      )}
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
                                      {/*
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
                                                .toLowerCase()
                                            : "None"}
                                        </Typography>
                                      */}
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
                                            xs: "0.55rem",
                                            md: "0.75rem",
                                            lg: "0.9rem",
                                          },
                                          paddingLeft: "1.5rem",
                                          paddingRight: "1.5rem",
                                          borderRadius: "100px",
                                          maxHeight: "3rem",
                                          "&:hover": {
                                            backgroundColor: "#072d61",
                                          },
                                        }}
                                        onClick={handleUpdateToAccept}
                                      >
                                        SUBMITTED to&nbsp;<strong>ACCEPTED</strong>
                                      </Button>
                                    </Box>
                                  )}
                                  {initialValues?.status === 'ACCEPTED' && (
                                    <Box
                                      display='flex'
                                      flexDirection='column'
                                      justifyContent='center'
                                      margin='1rem'
                                    >
                                      <Grid2
                                        container
                                        size={6}
                                        justifyContent='flex-start'
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
                                            onClick={handleUpdateModalPub}
                                          >
                                            + Add More Details
                                          </Button>
                                        </Box>
                                      </Grid2>
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
                    Add Details
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
                      Publication Type
                    </InputLabel>
                    <Select
                      label='Publication Type'
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
                        Select type
                      </MenuItem>
                      {publicationFormats.map((format) => (
                        <MenuItem
                          key={format.pub_format_id}
                          value={format.pub_format_id}
                          sx={{
                            fontSize: {
                              xs: "0.75rem",
                              md: "0.75rem",
                              lg: "0.8rem",
                            },
                          }}
                        >
                          {format.pub_format_name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {publicationFormat === "JL" && (
                    <Box>
                      <AutoCompleteTextBox
                        fullWidth
                        data={pub_names}
                        value={publicationName}
                        label='Publication Name'
                        id='publication-name'
                        onItemSelected={(value) => setPublicationName(value)} // Update state when a suggestion is selected
                        sx={{
                          ...createTextFieldStyles(),
                          "& .MuiInputLabel-root": {
                            fontSize: {
                              xs: "0.75rem",
                              md: "0.75rem",
                              lg: "0.8rem",
                            },
                          },
                        }}
                        InputLabelProps={createInputLabelProps()}
                        placeholder='ex: PLOS One'
                      />
                    </Box>
                  )}
                    
                  {publicationFormat === "PC" && (
                    <Box>
                      <AutoCompleteTextBox
                        fullWidth
                        data={conf_title}
                        label='Conference Title'
                        value={conferenceTitle}
                        id='conf-name'
                        onItemSelected={(value) => setConferenceTitle(value)}
                        sx={{
                          ...createTextFieldStyles(),
                          "& .MuiInputLabel-root": {
                            fontSize: {
                              xs: "0.75rem",
                              md: "0.75rem",
                              lg: "0.8rem",
                            },
                          },
                        }}
                        InputLabelProps={createInputLabelProps()}
                        placeholder='ex: Proceedings of the International Conference on Artificial Intelligence'
                      />
                     <TextField
                        fullWidth
                        label='Date of Presentation'
                        variant='outlined'
                        type='date'
                        margin='dense'
                        value={datePresentation}
                        onChange={(e) => setDatePresentation(e.target.value)}
                        inputProps={{
                          min: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0] // Sets tomorrow as the minimum date
                        }}
                        sx={createTextFieldStyles()}
                        InputLabelProps={{
                          ...createInputLabelProps(),
                          shrink: true,
                        }}
                      />
                      <Grid2 container spacing={4}>
                        <Grid2 size={6}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Autocomplete
                              fullWidth
                              options={
                                countrySearchText
                                  ? countriesAPI.map((c) => c.country)
                                  : countries
                                      .filter((c) =>
                                        conferenceVenues.some(
                                          (v) => v.country === c.country
                                        )
                                      )
                                      .map((c) => c.country)
                              }
                              value={singleCountry}
                              onChange={handleCountryChange}
                              onInputChange={(event, newInputValue) => {
                                setCountrySearchText(newInputValue);
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label='Country'
                                  margin='dense'
                                  sx={createTextFieldStyles()}
                                  InputLabelProps={createInputLabelProps()}
                                />
                              )}
                            />
                            <Tooltip
                              title="Can't find your country? Type to search from all available countries"
                              placement='right'
                            >
                              <InfoIcon
                                sx={{
                                  color: "#08397C",
                                  fontSize: "1.2rem",
                                  cursor: "help",
                                }}
                              />
                            </Tooltip>
                          </Box>
                        </Grid2>
                        <Grid2 size={6}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Autocomplete
                              fullWidth
                              options={
                                citySearchText
                                  ? countries.find(
                                      (c) => c.country === singleCountry
                                    )?.cities || []
                                  : Cities
                              }
                              value={singleCity}
                              onChange={(event, newValue) => {
                                setSingleCity(newValue);
                              }}
                              onInputChange={(event, newInputValue) => {
                                setCitySearchText(newInputValue);
                              }}
                              disabled={!singleCountry}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  label='City'
                                  margin='dense'
                                  sx={createTextFieldStyles()}
                                  InputLabelProps={createInputLabelProps()}
                                />
                              )}
                            />
                            <Tooltip
                              title="Can't find your city? Type to search from all available cities"
                              placement='right'
                            >
                              <InfoIcon
                                sx={{
                                  color: "#08397C",
                                  fontSize: "1.2rem",
                                  cursor: "help",
                                }}
                              />
                            </Tooltip>
                          </Box>
                        </Grid2>
                      </Grid2>
                    </Box>
                  )}
                  <TextField
                    fullWidth
                    label='Date of Submission'
                    variant='outlined'
                    type='date' 
                    margin='dense'
                    value={dateSubmitted}
                    onChange={(e) => setDateSubmitted(e.target.value)}
                    inputProps={{
                    max: new Date().toISOString().split('T')[0] // This sets today as the maximum date
                    }}
                    sx={createTextFieldStyles()}
                    InputLabelProps={{
                    ...createInputLabelProps(),
                    shrink: true,
                    }}
                  />
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
                        setDateSubmitted("");
                        setIndexingStatus("");
                        setSingleCountry("");
                        setSingleCity("");
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
                      Submit
                    </Button>
                  </Box>
                </Box>
              </Modal>

              {/* Update Publication Modal */}
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
                    Add More Details
                  </Typography>
                  <AutoCompleteTextBox
                    fullWidth
                    data={pub_names}
                    label='Publication Name'
                    id='publication-name'
                    value={publicationName}
                    onItemSelected={(value) => setPublicationName(value)} // Update state when a suggestion is selected
                    sx={{
                      
                      ...createTextFieldStyles(),
                      "& .MuiInputLabel-root": {
                        fontSize: {
                          xs: "0.75rem",
                          md: "0.75rem",
                          lg: "0.8rem",
                        },
                      },
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
                    label='Date of Presentation'
                    variant='outlined'
                    type='date'
                    margin='dense'
                    value={
                      datePresentation
                        ? new Date(datePresentation).toLocaleDateString(
                            "en-CA"
                          )
                        : ""
                    }
                    onChange={(e) => setDatePresentation(e.target.value)}
                    sx={createTextFieldStyles()}
                    InputLabelProps={{
                      ...createInputLabelProps(),
                      shrink: true,
                    }}
                  />
                  <Box
                    sx={{
                      display: "flex",
                      mt: 3,
                      gap: 2,
                    }}
                  >
                    <Button
                      onClick={handleCheckDetails}
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
                      onClick={handleSaveDetails}
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
