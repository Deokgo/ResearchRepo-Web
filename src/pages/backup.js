import React, { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import {
  Box,
  Button,
  TextField,
  Typography,
  InputAdornment,
} from "@mui/material";
import HeaderWithBackButton from "../components/Header";
import { useNavigate } from "react-router-dom";
import { Virtuoso } from "react-virtuoso";
import axios from "axios";
import RestoreIcon from "@mui/icons-material/Restore";
import BackupIcon from "@mui/icons-material/Backup";
import { Search } from "@mui/icons-material";
const Backup = () => {
  const navigate = useNavigate();
  const [backups, setBackups] = useState([]);
  const [filteredBackups, setFilteredBackups] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch backups from the database
  const fetchBackups = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/backup/list");
      setBackups(response.data.backups);
      setFilteredBackups(response.data.backups);
    } catch (error) {
      console.error("Error fetching backups:", error);
      alert("Error fetching backups");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBackups();
  }, []);

  // Handle search functionality
  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredBackups(
      backups.filter(
        (backup) =>
          backup.backup_id.toLowerCase().includes(query) ||
          backup.database_backup_location.toLowerCase().includes(query) ||
          backup.files_backup_location.toLowerCase().includes(query) ||
          new Date(backup.backup_date)
            .toLocaleString()
            .toLowerCase()
            .includes(query)
      )
    );
  };

  // Handle creating a new backup
  const handleCreateBackup = async () => {
    try {
      setLoading(true);
      await axios.post("/backup/create"); // TODO: API for create backup
      await fetchBackups(); // Refresh the list after creating backup
      alert("Backup created successfully!");
    } catch (error) {
      console.error("Error creating backup:", error);
      alert("Error creating backup");
    } finally {
      setLoading(false);
    }
  };

  // Handle restore functionality
  const handleRestore = async (backupId) => {
    try {
      const confirmRestore = window.confirm(
        "Are you sure you want to restore this backup? This will override current data."
      );

      if (confirmRestore) {
        setLoading(true);
        await axios.post(`/backup/restore/${backupId}`); // TODO: API for restore
        alert("Backup restored successfully!");
      }
    } catch (error) {
      console.error("Error restoring backup:", error);
      alert("Error restoring backup");
    } finally {
      setLoading(false);
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
          <HeaderWithBackButton title='Backup' onBack={() => navigate(-1)} />

          {/* Main Content */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {/* Search Bar and Backup Button */}
            <Box
              sx={{
                width: "80%",
                display: "flex",
                paddingTop: 3,
                paddingBottom: 2,
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <TextField
                variant='outlined'
                placeholder='Search backups'
                value={searchQuery}
                onChange={handleSearchChange}
                sx={{
                  flex: 1,
                  "& .MuiInputBase-input": {
                    fontSize: {
                      xs: "0.6em",
                      sm: "0.7rem",
                      md: "0.8rem",
                      lg: "0.8rem",
                    },
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                variant='contained'
                onClick={handleCreateBackup}
                startIcon={<BackupIcon />}
                sx={{
                  backgroundColor: "#CA031B",
                  color: "#FFF",
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 600,
                  textTransform: "none",
                  fontSize: { xs: "0.875rem", md: "1rem" },
                  padding: { xs: "0.5rem 1rem", md: "1.25rem" },
                  marginLeft: "2rem",
                  borderRadius: "100px",
                  maxHeight: "3rem",
                  "&:hover": {
                    backgroundColor: "#A30417",
                  },
                }}
              >
                Create Backup
              </Button>
            </Box>

            {/* Virtuoso Table */}
            <Box
              sx={{
                flex: 1,
                backgroundColor: "#F7F9FC",
                borderRadius: 1,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                width: "80%",
              }}
            >
              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <Typography>Loading backups...</Typography>
                </Box>
              ) : (
                <Box sx={{ flex: 1, overflow: "hidden" }}>
                  <Virtuoso
                    style={{ height: "400px" }}
                    totalCount={filteredBackups.length}
                    components={{
                      Header: () => (
                        <Box
                          sx={{
                            display: "flex",
                            backgroundColor: "#0A438F",
                            fontSize: {
                              xs: "0.5rem",
                              md: "0.75rem",
                              lg: "0.9rem",
                            },
                            color: "#FFF",
                            padding: "10px",
                            fontWeight: 700,
                            position: "sticky",
                            top: 0,
                            zIndex: 1000,
                          }}
                        >
                          <Box sx={{ flex: 1 }}>Backup ID</Box>
                          <Box sx={{ flex: 2 }}>Backup Date</Box>
                          <Box sx={{ flex: 2 }}>Database Location</Box>
                          <Box sx={{ flex: 2 }}>Files Location</Box>
                          <Box sx={{ flex: 1 }}>Size</Box>
                          <Box sx={{ flex: 1 }}>Action</Box>
                        </Box>
                      ),
                    }}
                    itemContent={(index) => {
                      const backup = filteredBackups[index];
                      return (
                        <Box
                          sx={{
                            display: "flex",
                            padding: "0.5rem",
                            borderBottom: "1px solid #ccc",
                            fontSize: {
                              xs: "0.5rem",
                              md: "0.65rem",
                              lg: "0.9rem",
                            },
                          }}
                        >
                          <Box sx={{ flex: 1 }}>{backup.backup_id}</Box>
                          <Box sx={{ flex: 2 }}>
                            {new Date(backup.backup_date).toLocaleString()}
                          </Box>
                          <Box sx={{ flex: 2 }}>
                            {backup.database_backup_location}
                          </Box>
                          <Box sx={{ flex: 2 }}>
                            {backup.files_backup_location}
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            {(backup.total_size / (1024 * 1024)).toFixed(2)} MB
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <Button
                              variant='contained'
                              onClick={() => handleRestore(backup.backup_id)}
                              startIcon={<RestoreIcon />}
                              sx={{
                                backgroundColor: "#08397C",
                                fontSize: "0.8rem",
                                "&:hover": {
                                  backgroundColor: "#052045",
                                },
                              }}
                            >
                              Restore
                            </Button>
                          </Box>
                        </Box>
                      );
                    }}
                  />
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Backup;
