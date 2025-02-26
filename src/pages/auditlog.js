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
import Navbar from "../components/navbar";
import homeBg from "../assets/home_bg.png";
import { Search } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import api from "../services/api";
import { Virtuoso } from "react-virtuoso";
import HeaderWithBackButton from "../components/Header";

const DisplayAuditLog = () => {
  const navigate = useNavigate();
  const [research, setResearch] = useState([]);

  const [filteredResearch, setFilteredResearch] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
  });
  const [sliderValue, setSliderValue] = useState([2010, 2025]); // Initial slider value

  const [selectedOperations, setSelectedOperations] = useState([]);
  const [operations, setOperation] = useState([]);
  const [roles, setRole] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [logs, setLogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 20;
  const [filteredAuditLogs, setFilteredAuditLogs] = useState([]);
  const [hoursFilter, setHoursFilter] = useState("");

  const fetchOperations = async () => {
    try {
      const response = await api.get(`/auditlogs/fetch_operations`);
      setOperation(response.data.operations);
    } catch (error) {
      console.error("Error fetching operations:", error);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await api.get(`/auditlogs/fetch_roles`);
      setRole(response.data.roles);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const fetchAuditLogs = async (hours = null) => {
    try {
      const url = hours
        ? `/auditlogs/fetch_logs/${hours}`
        : "/auditlogs/fetch_logs";
      const response = await api.get(url);
      if (response.data && response.data.logs) {
        setLogs(response.data.logs);
      } else {
        throw new Error("No logs found");
      }
    } catch (error) {
      console.error("Error fetching audit logs:", error);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOperations();
    fetchRoles();
    fetchAuditLogs();
  }, []);

  useEffect(() => {
    let filtered = logs;

    // Filter by Date Range
    filtered = filtered.filter((log) => {
      const logDate = new Date(log.changed_datetime);
      const { startDate, endDate } = dateRange;

      if (startDate && !endDate) {
        // Set start date to beginning of day (00:00:00)
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        return logDate >= start;
      } else if (!startDate && endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        return logDate <= end;
      } else if (startDate && endDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        return logDate >= start && logDate <= end;
      }
      return true; // No date filter applied
    });

    // Filter by Selected Operations
    if (selectedOperations.length > 0) {
      filtered = filtered.filter((log) =>
        selectedOperations.includes(log.operation.toLowerCase())
      );
    }

    // Filter by Roles
    if (selectedRoles.length > 0) {
      filtered = filtered.filter((log) => selectedRoles.includes(log.role));
    }

    // Filter by Search Query
    if (searchQuery) {
      filtered = filtered.filter(
        (log) =>
          log.audit_log.toLowerCase().includes(searchQuery.toLowerCase()) ||
          log.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredAuditLogs(filtered);
    setCurrentPage(1); // Reset to the first page on filter change
  }, [logs, dateRange, selectedOperations, selectedRoles, searchQuery]);

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
        const response = await api.get("/auditlogs/fetch_date_range"); // API endpoint
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
    setSelectedRoles(
      (prev) =>
        checked
          ? [...prev, value] // Add role if checked
          : prev.filter((role) => role !== value) // Remove role if unchecked
    );
  };

  // Calculate total pages based on filtered logs
  const totalPages = Math.ceil(filteredAuditLogs.length / rowsPerPage);

  // Calculate start and end indices for current page
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;

  // Get current page data
  const currentPageData = filteredAuditLogs.slice(startIndex, endIndex);

  // Utility function to create responsive TextField styles
  const createTextFieldStyles = (customFlex = 2) => ({
    flex: customFlex,
    "& .MuiInputBase-input": {
      fontSize: {
        xs: "0.6em", // Mobile
        sm: "0.7rem", // Small devices
        md: "0.8rem", // Medium devices
        lg: "0.8rem", // Large devices
      },
    },
  });

  // Utility function to create responsive label styles
  const createInputLabelProps = () => ({
    sx: {
      fontSize: {
        xs: "0.45rem", // Mobile
        sm: "0.55rem", // Small devices
        md: "0.65rem", // Medium devices
        lg: "0.75rem", // Large devices
      },
    },
  });

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
            height: {
              xs: "calc(100vh - 3.5rem)",
              sm: "calc(100vh - 4rem)",
              md: "calc(100vh - 6rem)",
            },
            overflow: "hidden",
          }}
        >
          <HeaderWithBackButton
            title='View Audit Logs'
            onBack={() => navigate(-1)}
          />

          {/* Main content area */}
          <Box
            sx={{
              flex: 1,
              padding: 3,
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
                    border: "1px solid #0A438F",
                    height: "100%",
                    borderRadius: 3,
                    padding: 3,
                    overflowY: "hidden",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Typography
                    variant='h6'
                    sx={{ mb: 2, fontWeight: "bold", color: "#F40824" }}
                  >
                    Filters
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant='body1'
                      sx={{
                        mb: 1,
                        color: "#08397C",
                        fontSize: { xs: "0.5rem", md: "0.5rem", lg: "0.9rem" },
                      }}
                    >
                      Date Range:
                    </Typography>
                    <Box sx={{ display: "flex", gap: 2 }}>
                      <TextField
                        type='date'
                        label='From'
                        value={
                          dateRange.startDate
                            ? dateRange.startDate.toISOString().split("T")[0]
                            : ""
                        }
                        onChange={(e) => {
                          setDateRange((prev) => ({
                            ...prev,
                            startDate: e.target.value
                              ? new Date(e.target.value)
                              : null,
                          }));
                        }}
                        sx={createTextFieldStyles()}
                        InputLabelProps={{
                          ...createInputLabelProps(),
                          shrink: true,
                        }}
                        fullWidth
                        size='small'
                      />
                      <TextField
                        type='date'
                        label='To'
                        value={
                          dateRange.endDate
                            ? dateRange.endDate.toISOString().split("T")[0]
                            : ""
                        }
                        onChange={(e) => {
                          setDateRange((prev) => ({
                            ...prev,
                            endDate: e.target.value
                              ? new Date(e.target.value)
                              : null,
                          }));
                        }}
                        sx={createTextFieldStyles()}
                        InputLabelProps={{
                          ...createInputLabelProps(),
                          shrink: true,
                        }}
                        fullWidth
                        size='small'
                      />
                    </Box>
                  </Box>
                  <Typography
                    variant='body1'
                    sx={{
                      color: "#08397C",
                      fontSize: { xs: "0.5rem", md: "0.5rem", lg: "0.9rem" },
                    }}
                  >
                    Operations:
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      height: "30%",
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
                              checked={selectedOperations.includes(
                                operation.trim().toLowerCase()
                              )}
                              onChange={handleOperationChange}
                              value={operation.trim().toLowerCase()}
                            />
                          }
                          label={operation}
                          sx={{
                            "& .MuiTypography-root": {
                              fontSize: {
                                xs: "0.5rem",
                                md: "0.75rem",
                                lg: "0.75rem",
                              },
                            },
                          }}
                        />
                      ))
                    ) : (
                      <Typography variant='body2' sx={{ color: "gray" }}>
                        No operations found.
                      </Typography>
                    )}
                  </Box>
                  <Typography
                    variant='body1'
                    sx={{
                      color: "#08397C",
                      fontSize: { xs: "0.5rem", md: "0.5rem", lg: "0.9rem" },
                    }}
                  >
                    Roles:
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      height: "30%",
                      overflowY: "auto",
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
                          sx={{
                            "& .MuiTypography-root": {
                              fontSize: {
                                xs: "0.5rem",
                                md: "0.75rem",
                                lg: "0.75rem",
                              },
                            },
                          }}
                        />
                      ))
                    ) : (
                      <Typography variant='body2' sx={{ color: "gray" }}>
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
                        sx={createTextFieldStyles()}
                        InputLabelProps={createInputLabelProps()}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position='start'>
                              <Search
                                sx={{
                                  fontSize: {
                                    xs: "1rem", // Mobile
                                    md: "1.25rem", // Larger screens
                                  },
                                }}
                              />
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
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          height: "100%",
                          overflowY: "auto",
                        }}
                      >
                        {loading ? (
                          <Typography>Loading...</Typography>
                        ) : (
                          <>
                            {/* Table Header */}
                            <Box
                              sx={{
                                display: "flex",
                                padding: "10px",
                                justifyContent: "space-between",
                                fontSize: {
                                  xs: "0.5rem",
                                  md: "0.75rem",
                                  lg: "0.9rem",
                                },
                                backgroundColor: "#0A438F",
                                color: "#FFF",
                                borderBottom: "1px solid #ccc",
                                fontWeight: "bold",
                              }}
                            >
                              <Box sx={{ flex: 1 }}>Log ID</Box>
                              <Box sx={{ flex: 2 }}>User Email</Box>
                              <Box sx={{ flex: 1 }}>Role</Box>
                              <Box sx={{ flex: 1 }}>Action</Box>
                              <Box sx={{ flex: 1 }}>Reference</Box>
                              <Box sx={{ flex: 1.5 }}>Date/Time</Box>
                              <Box sx={{ flex: 1 }}>Details</Box>
                            </Box>

                            {/* Virtuoso Component */}
                            <Virtuoso
                              style={{ height: "500px" }}
                              totalCount={currentPageData.length}
                              itemContent={(index) => {
                                const log = currentPageData[index];

                                // Create date object directly from database timestamp
                                const date = new Date(log.changed_datetime);
                                const formattedDateTime = date
                                  .toLocaleString("en-US", {
                                    weekday: "short",
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                    hour: "numeric",
                                    minute: "2-digit",
                                    hour12: true,
                                  })
                                  .replace(",", "");

                                return (
                                  <Box
                                    sx={{
                                      display: "flex",
                                      padding: "10px",
                                      justifyContent: "space-between",
                                      fontSize: {
                                        xs: "0.5rem",
                                        md: "0.5rem",
                                        lg: "0.75rem",
                                      },
                                      borderBottom: "1px solid #ccc",
                                      gap: 2,
                                    }}
                                  >
                                    <Box sx={{ flex: 1 }}>{log.audit_log}</Box>
                                    <Box sx={{ flex: 2 }}>{log.email}</Box>
                                    <Box sx={{ flex: 1 }}>{log.role}</Box>
                                    <Box sx={{ flex: 1 }}>{log.operation}</Box>
                                    <Box sx={{ flex: 1 }}>{log.record_id}</Box>
                                    <Box sx={{ flex: 1.5 }}>
                                      {formattedDateTime}
                                    </Box>
                                    <Box sx={{ flex: 1 }}>
                                      {log.action_desc}
                                    </Box>
                                  </Box>
                                );
                              }}
                            />

                            {/* Pagination */}
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
                                onChange={(event, page) => setCurrentPage(page)}
                                color='primary'
                              />
                            </Box>
                          </>
                        )}
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
