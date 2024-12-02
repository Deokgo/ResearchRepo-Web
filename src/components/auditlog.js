import {
    Box,
    Button,
    Checkbox,
    FormControlLabel,
    Grid2,
    IconButton,
    InputAdornment,
    Pagination,
    Slider,
    TextField,
    Typography,
  } from "@mui/material";
  import React, { useEffect, useState } from "react";
  import Navbar from "./navbar";
  import homeBg from "../assets/home_bg.png";
  import { Search } from "@mui/icons-material";
  import { useNavigate } from "react-router-dom";
  import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
  import axios from "axios";
  import { Virtuoso } from "react-virtuoso";

  const DisplayAuditLog = () => {
    const navigate = useNavigate();
    const [research, setResearch] = useState([]);

    const [filteredResearch, setFilteredResearch] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState([2010, 2025]); // Default min and max year
    const [sliderValue, setSliderValue] = useState([2010, 2025]); // Initial slider value
    
    const [selectedOperations, setSelectedOperations] = useState([]);
    const [operations, setOperation] = useState([]);
    const [roles, setRole] = useState([]);
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [logs, setLogs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const logsPerPage = 10;
    // Calculate total pages
    const totalPages = Math.ceil(logs.length / logsPerPage);
    const [filteredAuditLogs, setFilteredAuditLogs] = useState([]);

    const fetchOperations = async () => {
      try {
        const response = await axios.get(`/auditlogs/fetch_operations`);
        setOperation(response.data.operations);
      } catch (error) {
        console.error("Error fetching operations:", error);
      }
    };

    const fetchRoles = async () => {
        try {
          const response = await axios.get(`/auditlogs/fetch_roles`);
          setRole(response.data.roles);
        } catch (error) {
          console.error("Error fetching roles:", error);
        }
      };
  
    const getUserId = () => {
      const userId = localStorage.getItem("user_id");
      return userId;
    };

    const fetchAuditLogs = async () => {
        try {
          const response = await axios.get('/auditlogs/fetch_logs');
          if (response.data && response.data.logs) {
            setLogs(response.data.logs);  // Set the logs data to state
          } else {
            throw new Error("No logs found");
          }
        } catch (error) {
          console.error("Error fetching audit logs:", error);
          setLogs([]);  // Set an empty array in case of error
        } finally {
          setLoading(false); // Stop loading once the data is fetched or failed
        }
      };
      
    useEffect(() => {
      fetchOperations();
      fetchRoles();
      fetchAuditLogs();
    }, []);
  
  
    useEffect(() => {
      let filtered = research;
  
      // Filter by Date Range
      filtered = filtered.filter(
        (item) => item.year >= sliderValue[0] && item.year <= sliderValue[1]
      );

      // Filter by Selected Operations
      if (selectedOperations.length > 0) {
        filtered = filtered.filter((item) =>
          selectedOperations.some(
            (operation) =>
              item.operation &&
              operation === item.operation.toLowerCase().trim()
          )
        );
      }
        
      // Filter by Search Query
      if (searchQuery) {
        filtered = filtered.filter((item) => {
          const titleMatch = item.title
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
          const authorMatch = item.authors.some(
            (author) =>
              author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              author.email.toLowerCase().includes(searchQuery.toLowerCase())
          );
          return titleMatch || authorMatch;
        });
      }
      
      setFilteredAuditLogs(filtered);
      setCurrentPage(1); // Reset to the first page on filter change
    }, [
      sliderValue,
      selectedOperations,
      searchQuery,
      research,
    ]);
  
    // Handle change in search query
    const handleSearchChange = (e) => {
      const query = e.target.value.toLowerCase();
      setSearchQuery(query);
      setFilteredAuditLogs(
        logs.filter(
          (log) =>
            log.email.toLowerCase().includes(query) ||
            log.audit_log.toLowerCase().includes(query)
        )
      );
    };
  
    // Function to fetch the year range dynamically
    useEffect(() => {
      async function fetchDateRange() {
        try {
          const response = await axios.get("/auditlogs/fetch_date_range"); // API endpoint
          const { min_year, max_year } = response.data.date_range;
  
          // Update the date range and initialize the slider values
          setDateRange([min_year, max_year]);
          setSliderValue([min_year, max_year]);
        } catch (error) {
          console.error("Failed to fetch date range:", error);
        }
      }
  
      fetchDateRange();
    }, []);
  
    // Handle change in date range filter
    const handleDateRangeChange = (event, newValue) => {
      setSliderValue(newValue);
    };

    const handleOperationChange = (event) => {
        const { value, checked } = event.target;
        setSelectedOperations((prev) => {
          const updated = checked
            ? [...new Set([...prev, value])] // Add if checked, avoid duplicates
            : prev.filter((operation) => operation !== value); // Remove if unchecked
          console.log("Updated Selected Operations:", updated);
          return updated;
        });
      };      

    const handleRoleChange = (event) => {
        const { value, checked } = event.target;
        setSelectedRoles((prev) =>
          checked
            ? [...prev, value] // Add role if checked
            : prev.filter((role) => role !== value) // Remove role if unchecked
        );
      };

    // Get logs for the current page
    const paginatedLogs = logs.slice(
        (currentPage - 1) * logsPerPage,
        currentPage * logsPerPage
    );
  
    // Handle pagination change
    const handlePageChange = (event, page) => {
        setCurrentPage(page);
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
            overflow: "hidden",
          }}
        >
          <Navbar />
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
              marginTop: { xs: "3.5rem", sm: "4rem", md: "6rem" },
              height: {
                xs: "calc(100vh - 3.5rem)",
                sm: "calc(100vh - 4rem)",
                md: "calc(100vh - 6rem)",
              },
              overflow: "hidden",
            }}
          >
            {/* Header with back button */}
            <Box
              sx={{
                position: "relative",
                height: { xs: "5rem", md: "6rem" },
                backgroundColor: "#0A438F",
                backgroundSize: "cover",
                backgroundPosition: "center",
                display: "flex",
                alignItems: "center",
                padding: 2,
                zIndex: 1,
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
                  Audit Logs
                </Typography>
              </Box>
            </Box>
  
            {/* Main content area */}
            <Box
              sx={{
                flex: 1,
                padding: 5,
                overflow: "hidden",
                height: "calc(100% - 48px)",
              }}
            >
              <Grid2
                container
                spacing={4}
                sx={{
                  height: "100%",
                  flexWrap: "nowrap",
                }}
              >
                {/* Filters Section */}
                <Grid2 size={3}>
                  <Box
                    sx={{
                      border: "2px solid #0A438F",
                      height: "100%",
                      borderRadius: 3,
                      padding: 3,
                      overflow: "hidden",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Typography
                      variant='h6'
                      sx={{ mb: 3, fontWeight: "bold", color: "#F40824" }}
                    >
                      Filters
                    </Typography>
                    <Box sx={{ mb: 4 }}>
                      <Typography
                        variant='body1'
                        sx={{
                          mb: 2,
                          color: "#08397C",
                          position: "relative",
                          zIndex: 2,
                        }}
                      >
                        Year Range:
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          width: "100%",
                          mt: 4,
                        }}
                      >
                        <Slider
                          value={sliderValue}
                          onChange={handleDateRangeChange}
                          valueLabelDisplay='on'
                          min={dateRange[0]}
                          max={dateRange[1]}
                          sx={{
                            width: "90%",
                            "& .MuiSlider-valueLabel": {
                              backgroundColor: "#08397C",
                            },
                            "& .MuiSlider-rail": {
                              backgroundColor: "#ccc",
                            },
                            "& .MuiSlider-track": {
                              backgroundColor: "#08397C",
                            },
                            "& .MuiSlider-thumb": {
                              backgroundColor: "#08397C",
                            },
                          }}
                        />
                      </Box>
                    </Box>
                    <Typography variant='body1' sx={{ mb: 1, color: "#08397C" }}>
                      Show last ___ hour/s 
                    </Typography>
                    <Typography variant='body1' sx={{ mb: 1, color: "#08397C" }}>
                      Operations:
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        height: "25%",
                        overflowY: "auto",
                        mb: 2,
                        "&::-webkit-scrollbar": {
                          width: "8px",
                        },
                        "&::-webkit-scrollbar-track": {
                          background: "#f1f1f1",
                          borderRadius: "4px",
                        },
                        "&::-webkit-scrollbar-thumb": {
                          background: "#08397C",
                          borderRadius: "4px",
                        },
                      }}
                    >
                      {operations.length > 0 ? (
                        operations.map((operation, index) => (
                            <FormControlLabel
                            key={index}
                            control={
                                <Checkbox
                                checked={selectedOperations.includes(operation.trim().toLowerCase())}
                                onChange={handleOperationChange}
                                value={operation.trim().toLowerCase()}
                                />
                            }
                            label={operation}
                            />
                        ))
                        ) : (
                        <Typography variant="body2" sx={{ color: "gray" }}>
                            No operations found.
                        </Typography>
                        )}
                    </Box>
                    <Typography variant="body1" sx={{ color: "#08397C" }}>
                        Roles:
                    </Typography>
                    <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        height: "25%",
                        overflowY: "auto",
                        mb: 2,
                        "&::-webkit-scrollbar": {
                        width: "8px",
                        },
                        "&::-webkit-scrollbar-track": {
                        background: "#f1f1f1",
                        borderRadius: "4px",
                        },
                        "&::-webkit-scrollbar-thumb": {
                        background: "#08397C",
                        borderRadius: "4px",
                        },
                    }}
                    >
                    {roles.length > 0 ? (
                        roles.map((role, index) => (
                            <FormControlLabel
                            key={index}
                            control={
                                <Checkbox
                                checked={selectedRoles.includes(role)}
                                onChange={handleRoleChange}
                                value={role}
                                />
                            }
                            label={role}
                            />
                        ))
                        ) : (
                        <Typography variant="body2" sx={{ color: "gray" }}>
                            No roles found.
                        </Typography>
                        )}
                    </Box>
                  </Box>
                </Grid2>
  
                {/* Research List Section */}
                <Grid2 size={10}>
                  <Box
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Box
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          gap: 2,
                          mb: 2,
                        }}
                      >
                        <TextField
                          variant='outlined'
                          placeholder='Search by Log ID or Email User'
                          value={searchQuery}
                          onChange={handleSearchChange}
                          sx={{ flex: 2 }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position='start'>
                                <Search />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Box>
                      <Box
                        sx={{
                          flex: 1,
                          backgroundColor: "#F7F9FC",
                          borderRadius: 1,
                          overflow: "hidden",
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <Box sx={{ flex: 1, overflow: "hidden" }}>
                        {loading ? (
                            <Typography>Loading...</Typography>
                        ) : (
                            <Virtuoso
                            style={{ height: "500px" }}
                            totalCount={paginatedLogs.length}
                            components={{
                                Header: () => (
                                <Box
                                    sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    backgroundColor: "#0A438F",
                                    color: "#FFF",
                                    padding: "10px",
                                    fontWeight: 700,
                                    position: "sticky",
                                    top: 0,
                                    zIndex: 1000,
                                    }}
                                >
                                    <Box sx={{ flex: 1 }}>Log ID</Box>
                                    <Box sx={{ flex: 2 }}>User Email</Box>
                                    <Box sx={{ flex: 1 }}>Role</Box>
                                    <Box sx={{ flex: 1 }}>Action</Box>
                                    <Box sx={{ flex: 1 }}>Resource</Box>
                                    <Box sx={{ flex: 1 }}>Record Reference</Box>
                                    <Box sx={{ flex: 1 }}>Date/Time</Box>
                                    <Box sx={{ flex: 1 }}>Details</Box>
                                </Box>
                                ),
                            }}
                            itemContent={(index) => {
                                const log = paginatedLogs[index]; // Get the log entry for the current index
                                return (
                                <Box
                                    sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    padding: "10px",
                                    borderBottom: "1px solid #ccc",
                                    }}
                                >
                                    <Box sx={{ flex: 1 }}>{log.audit_log}</Box>
                                    <Box sx={{ flex: 2 }}>{log.email}</Box>
                                    <Box sx={{ flex: 1 }}>{log.role_name}</Box>
                                    <Box sx={{ flex: 1 }}>{log.operation}</Box>
                                    <Box sx={{ flex: 1 }}>{log.table_name}</Box>
                                    <Box sx={{ flex: 1 }}>{log.record_id}</Box>
                                    <Box sx={{ flex: 1 }}>
                                    {new Date(log.changed_datetime).toLocaleString()}
                                    </Box>
                                    <Box sx={{ flex: 1 }}>{log.action_desc}</Box>
                                </Box>
                                );
                            }}
                            />
                        )}
                        </Box>
                        <Box
                            sx={{
                            display: "flex",
                            justifyContent: "center",
                            py: 1,
                            backgroundColor: "#fff",
                            borderTop: "1px solid #eee",
                            }}
                        >
                            <Pagination
                            count={totalPages}
                            page={currentPage}
                            onChange={handlePageChange}
                            color="primary"
                            />
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Grid2>
              </Grid2>
            </Box>
          </Box>
        </Box>
      </>
    );
  };
  
  export default DisplayAuditLog;
  