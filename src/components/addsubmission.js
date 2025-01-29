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
  Autocomplete,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import axios from "axios";
import AutoCompleteTextBox from "../components/Intellibox";
import InfoIcon from "@mui/icons-material/Info";
import Tooltip from "@mui/material/Tooltip";
import { useModalContext } from "../context/modalcontext";

const AddSubmission = () => {
  const location = useLocation();
  const { id } = location.state || {}; // Default to an empty object if state is undefined

  const [publicationTitle, setPublicationTitle] = useState("");
  const [dateSubmitted, setDateSubmitted] = useState("");
  const [publicationFormat, setPublicationFormat] = useState("");

  const [conferenceTitle, setConferenceTitle] = useState("");
  const [singleCountry, setSingleCountry] = useState("");
  const [singleCity, setSingleCity] = useState("");
  const [countries, setCountries] = useState([]);
  const [countriesAPI, setCountriesAPI] = useState([]);
  const [citiesAPI, setCitiesAPI] = useState([]);
  const [Cities, setCities] = useState([]);
  const [datePresentation, setDatePresentation] = useState("");
  const [conferenceVenues, setConferenceVenues] = useState([]);

  const [countrySearchText, setCountrySearchText] = useState("");
  const [citySearchText, setCitySearchText] = useState("");

  const { isAddSubmitModalOpen, closeAddSubmitModal, openAddSubmitModal } = useModalContext();

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
    if (isAddSubmitModalOpen && singleCountry) {
        fetchCities(singleCountry); // Fetch cities for the selected country
    }
    }, [isAddSubmitModalOpen, singleCountry]);

  ///////////////////// STATUS UPDATE PUBLICATION //////////////////////
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
        "Publication Title": publicationTitle,
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
      formData.append("publication_name", publicationTitle);
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

  ///////////////////// PRE-POST MODAL HANDLING //////////////////////
  const handleFormCleanup = () => {
    setPublicationTitle("");
    setPublicationFormat("");
    setDateSubmitted("");

    setConferenceTitle("");
    setSingleCountry("");
    setSingleCity("");
    setDatePresentation("");
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

  // Modified country selection handling
  const handleCountryChange = (event, newValue) => {
    setSingleCountry(newValue);
    if (newValue) {
      fetchCities(newValue);
    }
  };

  return (
    <>
    {/* Add Publication Modal */}
    <Modal open={isAddSubmitModalOpen}>
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
                value={publicationTitle}
                label='Publication Title'
                id='publication-name'
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
                setPublicationTitle("");
                setPublicationFormat("");
                setDateSubmitted("");
                setSingleCountry("");
                setSingleCity("");
                closeAddSubmitModal();
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
    </>
  );
};

export default AddSubmission;
