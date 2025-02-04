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
  const handleCreateBackup = async (type) => {
    setLoading(true);
    try {
      const response = await axios.post(`/backup/create/${type}`);
      showMessage(response.data.message);
      await fetchBackups();
    } catch (error) {
      console.error("Error creating backup:", error);
      showMessage("Error creating backup: " + error.message, "error");
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
      await fetchBackups();
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
                          <TableCell>Date</TableCell>
                          <TableCell>Size</TableCell>
                          <TableCell>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {backups.map((backup) => (
                          <TableRow key={backup.backup_id}>
                            <TableCell>{backup.backup_id}</TableCell>
                            <TableCell>
                              <Typography
                                color={getBackupTypeColor(backup.backup_type)}
                              >
                                {backup.backup_type}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              {formatDate(backup.backup_date)}
                            </TableCell>
                            <TableCell>
                              {formatBytes(backup.total_size)}
                            </TableCell>
                            <TableCell>
                              <Button
                                startIcon={<RestoreIcon />}
                                onClick={() => handleRestoreClick(backup)}
                                disabled={loading}
                              >
                                Restore
                              </Button>
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
              <Box sx={{ mt: 2, color: "warning.main" }}>
                Note: This is an incremental backup. The restore process will
                include the base full backup and all incremental backups up to
                this point.
              </Box>
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
