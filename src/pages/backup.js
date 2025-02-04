import React, { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import {
  Box,
  Button,
  TextField,
  Typography,
  InputAdornment,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";
import HeaderWithBackButton from "../components/Header";
import { useNavigate } from "react-router-dom";
import { Virtuoso } from "react-virtuoso";
import axios from "axios";
import RestoreIcon from "@mui/icons-material/Restore";
import BackupIcon from "@mui/icons-material/Backup";
import { Search } from "@mui/icons-material";
import { formatBytes, formatDate } from "../utils/format";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import BackupTableIcon from '@mui/icons-material/BackupTable';
import DialogTitle from "@mui/material/DialogTitle";
import DownloadIcon from "@mui/icons-material/Download";

const Backup = () => {
  const navigate = useNavigate();
  const [backups, setBackups] = useState([]);
  const [filteredBackups, setFilteredBackups] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [currentTimeline, setCurrentTimeline] = useState(null);
  const [openDownloadDialog, setOpenDownloadDialog] = useState(false);

  // Fetch backups from the database
  const fetchBackups = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/backup/list");
      setBackups(response.data.backups);
      setFilteredBackups(response.data.backups);
    } catch (error) {
      console.error("Error fetching backups:", error);
      showMessage("Error fetching backups: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  // Add function to fetch current timeline
  const fetchCurrentTimeline = async () => {
    try {
      const response = await axios.get("/backup/current-timeline");
      setCurrentTimeline(response.data.timeline_id);
    } catch (error) {
      console.error("Error fetching current timeline:", error);
    }
  };

  // Update useEffect to fetch timeline
  useEffect(() => {
    fetchBackups();
    fetchCurrentTimeline();
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

  // Update the function to check for full backup in current timeline
  const canCreateIncrementalBackup = () => {
    // Get current timeline (highest timeline number)
    const currentTimeline = Math.max(...backups.map((b) => b.timeline_id || 0));

    // Check if there's a full backup in the current timeline
    return backups.some(
      (backup) =>
        backup.backup_type === "FULL" && backup.timeline_id === currentTimeline
    );
  };

  // Modify handleCreateBackup to include a more specific warning
  const handleCreateBackup = async (type) => {
    if (type === "INCR" && !canCreateIncrementalBackup()) {
      showMessage(
        "Cannot create incremental backup: No full backup exists in the current timeline. Please create a full backup first.",
        "warning"
      );
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`/backup/create/${type}`);
      showMessage(response.data.message);
      await fetchBackups();
    } catch (error) {
      console.error("Error creating backup:", error);
      showMessage(
        error.response?.data?.error ||
          "Error creating backup: " + error.message,
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle restore functionality
  const handleRestoreClick = (backup) => {
    setSelectedBackup(backup);
    setOpenDialog(true);
  };

  const handleRestoreConfirm = async () => {
    setOpenDialog(false);
    setLoading(true);
    try {
      const response = await axios.post(
        `/backup/restore/${selectedBackup.backup_id}`
      );
      showMessage(response.data.message);
      // Fetch both backups and current timeline after restore
      await Promise.all([fetchBackups(), fetchCurrentTimeline()]);
    } catch (error) {
      console.error("Error restoring backup:", error);
      showMessage("Error restoring backup: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const getBackupTypeColor = (type) => {
    return type === "FULL" ? "primary.main" : "secondary.main";
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const showMessage = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  // Modify the handleDownloadBackup function
  const handleDownloadBackup = async (backup) => {
    try {
      if (backup.backup_type !== "FULL") {
        showMessage(
          "Only full backups can be downloaded. Incremental backups must be restored through the application.",
          "warning"
        );
        return;
      }

      setLoading(true);
      const response = await axios.get(`/backup/download/${backup.backup_id}`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${backup.backup_id}.tar.gz`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading backup:", error);
      showMessage("Error downloading backup: " + error.message, "error");
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

          {/* Add Timeline Info Box */}
          <Box
            sx={{
              width: "80%",
              margin: "0 auto",
              mt: 2,
              p: 2,
              bgcolor: "info.light",
              borderRadius: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant='body1' color='info.contrastText'>
              Current Timeline: {currentTimeline || "Loading..."}
            </Typography>
            <Typography variant='body2' color='info.contrastText'>
              Note: Full backup restores continue in the same timeline, while
              incremental restores create a new timeline
            </Typography>
          </Box>

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
              <Box>
                <Button
                  variant='contained'
                  color='primary'
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
                      color: "#FFF",
                    },
                  }}
                  onClick={() => handleCreateBackup("FULL")}
                >
                  <BackupIcon sx={{ pb:"0.15rem" }}></BackupIcon>&nbsp; Full Backup
                </Button>
                <Button
                  variant='contained'
                  color='primary'
                  sx={{
                    backgroundColor: "#08397C",
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
                      backgroundColor: "#072d61",
                      color: "#FFF",
                    },
                  }}
                  onClick={() => handleCreateBackup("INCR")}
                >
                  <BackupTableIcon sx={{ pb:"0.15rem" }}></BackupTableIcon>&nbsp; Incremental Backup
                </Button>
              </Box>
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
                  <CircularProgress />
                </Box>
              ) : (
                <Box sx={{ flex: 1, overflow: "hidden" }}>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Backup ID</TableCell>
                          <TableCell>Type</TableCell>
                          <TableCell>Timeline</TableCell>
                          <TableCell>Date</TableCell>
                          <TableCell>Size</TableCell>
                          <TableCell>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {backups.map((backup) => (
                          <TableRow
                            key={backup.backup_id}
                            sx={{
                              pl: backup.backup_type === "INCR" ? 4 : 0,
                              borderLeft:
                                backup.backup_type === "INCR"
                                  ? "2px solid #1976d2"
                                  : "none",
                            }}
                          >
                            <TableCell>{backup.backup_id}</TableCell>
                            <TableCell>
                              <Typography
                                color={getBackupTypeColor(backup.backup_type)}
                              >
                                {backup.backup_type}
                                {backup.wal_lsn && (
                                  <Typography variant='caption' display='block'>
                                    WAL Position: {backup.wal_lsn}
                                  </Typography>
                                )}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant='body2'>
                                Timeline {backup.timeline_id || "N/A"}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              {formatDate(backup.backup_date)}
                            </TableCell>
                            <TableCell>
                              {formatBytes(backup.total_size)}
                            </TableCell>
                            <TableCell>
                              <Box sx={{ display: "flex", gap: 1 }}>
                                <Button
                                  startIcon={<RestoreIcon />}
                                  onClick={() => handleRestoreClick(backup)}
                                  disabled={loading}
                                >
                                  Restore
                                </Button>
                                {backup.backup_type === "FULL" && (
                                  <Button
                                    startIcon={<DownloadIcon />}
                                    onClick={() => handleDownloadBackup(backup)}
                                    disabled={loading}
                                  >
                                    Download
                                  </Button>
                                )}
                              </Box>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Box>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Restore</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to restore from backup{" "}
            {selectedBackup?.backup_id}? This will replace all current data with
            the backup data.
            {selectedBackup?.backup_type === "INCR" && (
              <>
                <Box sx={{ mt: 2, color: "warning.main" }}>
                  Note: This is an incremental backup. The restore process will
                  include the base full backup and all incremental backups up to
                  this point.
                </Box>
                <Box sx={{ mt: 2, color: "info.main" }}>
                  Important: Restoring this backup will create a new timeline.
                  Any existing incremental backups from the current timeline
                  will become invalid and cannot be restored after this
                  operation.
                </Box>
              </>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={handleRestoreConfirm}
            variant='contained'
            color='primary'
          >
            Restore
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDownloadDialog}
        onClose={() => setOpenDownloadDialog(false)}
      >
        <DialogTitle>Download Incremental Backup</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This is an incremental backup. Please choose your download option:
            <Box sx={{ mt: 2 }}>
              <Typography variant='body2' color='warning.main'>
                Note: Incremental backups require the full backup and all
                previous incremental backups in the chain to be useful.
              </Typography>
            </Box>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDownloadDialog(false)}>Cancel</Button>
          <Button
            onClick={async () => {
              setOpenDownloadDialog(false);
              try {
                const response = await axios.get(
                  `/backup/download/${selectedBackup.backup_id}`,
                  {
                    responseType: "blob",
                  }
                );
                const url = window.URL.createObjectURL(
                  new Blob([response.data])
                );
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute(
                  "download",
                  `${selectedBackup.backup_id}.tar.gz`
                );
                document.body.appendChild(link);
                link.click();
                link.remove();
              } catch (error) {
                showMessage(
                  "Error downloading backup: " + error.message,
                  "error"
                );
              }
            }}
          >
            Download Single Backup
          </Button>
          <Button
            onClick={async () => {
              setOpenDownloadDialog(false);
              try {
                const response = await axios.get(
                  `/backup/download-chain/${selectedBackup.backup_id}`,
                  {
                    responseType: "blob",
                  }
                );
                const url = window.URL.createObjectURL(
                  new Blob([response.data])
                );
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute(
                  "download",
                  `backup_chain_${selectedBackup.backup_id}.tar.gz`
                );
                document.body.appendChild(link);
                link.click();
                link.remove();
              } catch (error) {
                showMessage(
                  "Error downloading backup chain: " + error.message,
                  "error"
                );
              }
            }}
          >
            Download Complete Chain
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Backup;
