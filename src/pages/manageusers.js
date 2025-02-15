import React, { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormLabel,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Tooltip,
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import homeBg from "../assets/home_bg.png";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Search } from "@mui/icons-material";
import { Virtuoso } from "react-virtuoso";
import axios from "axios";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import ErrorIcon from "@mui/icons-material/Error";
import HeaderWithBackButton from "../components/Header";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [colleges, setColleges] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [parsedUsers, setParsedUsers] = useState([]);
  const [programsByCollege, setProgramsByCollege] = useState({});
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedCollege, setSelectedCollege] = useState("");
  const [selectedProgram, setSelectedProgram] = useState("");
  const [hasFile, setHasFile] = useState(false);
  const [manualEntry, setManualEntry] = useState({
    email: "",
    firstName: "",
    middleInitial: "",
    surname: "",
    suffix: "",
  });
  const [duplicateEmails, setDuplicateEmails] = useState([]);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState({
    title: "",
    message: "",
    confirmAction: null,
  });
  const [openArchiveModal, setOpenArchiveModal] = useState(false);
  const [archiveType, setArchiveType] = useState("INACTIVE");
  const [archiveDays, setArchiveDays] = useState(180);
  const [openSuccessDialog, setOpenSuccessDialog] = useState(false);
  const [openErrorDialog, setOpenErrorDialog] = useState(false);
  const [openArchiveConfirmDialog, setOpenArchiveConfirmDialog] =
    useState(false);
  const [archiveInProgress, setArchiveInProgress] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [openWarningDialog, setOpenWarningDialog] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmTitle, setConfirmTitle] = useState("");
  const [roles, setRoles] = useState([]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/accounts/users");

      // Sort users: ACTIVATED first, then DEACTIVATED
      const sortedUsers = response.data.researchers.sort((a, b) => {
        if (a.acc_status === b.acc_status) return 0;
        return a.acc_status === "ACTIVATED" ? -1 : 1;
      });

      setUsers(sortedUsers);
      setFilteredUsers(sortedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      setErrorMessage("Error fetching users");
      setOpenErrorDialog(true);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = (user, researcher_id) => {
    const updatedStatus =
      user.acc_status === "ACTIVATED" ? "DEACTIVATED" : "ACTIVATED";

    setConfirmTitle("Confirm Status Change");
    setConfirmMessage(
      `Are you sure you want to change the status to ${updatedStatus}?`
    );
    setConfirmAction(() => async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.put(
          `/accounts/update_status/${researcher_id}`,
          { acc_status: updatedStatus },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Update user status in the table
        setFilteredUsers((prevUsers) =>
          prevUsers.map((u) =>
            u.researcher_id === researcher_id
              ? { ...u, acc_status: updatedStatus }
              : u
          )
        );

        setSuccessMessage(
          `Account status successfully changed to ${updatedStatus}`
        );
        setOpenSuccessDialog(true);
      } catch (error) {
        console.error("Error updating account status:", error);
        setErrorMessage(
          error.response?.data?.error ||
            "Failed to update account status. Please try again."
        );
        setOpenErrorDialog(true);
      }
    });
    setOpenConfirmDialog(true);
  };

  const fetchRoles = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/accounts/fetch_roles", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRoles(response.data.roles);
    } catch (error) {
      console.error("Error fetching roles:", error);
      setErrorMessage(error.response?.data?.message || "Error fetching roles");
      setOpenErrorDialog(true);
    }
  };

  const fetchColleges = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/deptprogs/college_depts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setColleges(response.data.colleges);
    } catch (error) {
      console.error("Error fetching colleges:", error);
      setErrorMessage(
        error.response?.data?.message || "Error fetching colleges"
      );
      setOpenErrorDialog(true);
    }
  };

  const handleCollegeChange = async (collegeId) => {
    setSelectedCollege(collegeId);
    setSelectedProgram(""); // Reset program selection

    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`/deptprogs/programs/${collegeId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPrograms(response.data.programs);
    } catch (error) {
      console.error("Error fetching programs:", error);
      setErrorMessage(
        error.response?.data?.message || "Error fetching programs"
      );
      setOpenErrorDialog(true);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([fetchUsers(), fetchRoles(), fetchColleges()]);
    };
    fetchData();
  }, []);

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    // Filter users based on search query
    const filtered = users.filter(
      (user) =>
        user.email.toLowerCase().includes(query) ||
        user.researcher_id.toLowerCase().includes(query) ||
        (user.role_name && user.role_name.toLowerCase().includes(query))
    );

    // Sort users: ACTIVATED first, then DEACTIVATED
    const sortedUsers = filtered.sort((a, b) => {
      if (a.acc_status === b.acc_status) return 0; // Keep relative order if status is same
      return a.acc_status === "ACTIVATED" ? -1 : 1; // ACTIVATED comes first
    });

    setFilteredUsers(sortedUsers);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleOpenAddModal = () => {
    setOpenModal(true);
  };

  const handleCloseAddModal = () => {
    setOpenModal(false);
    setSelectedRole("");
    setSelectedCollege("");
    setSelectedProgram("");
    setParsedUsers([]);
    setHasFile(false);
    setDuplicateEmails([]);
    setManualEntry({
      email: "",
      firstName: "",
      middleInitial: "",
      surname: "",
      suffix: "",
    });

    // Reset file input
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const checkDuplicateEmail = async (email) => {
    try {
      // Check for duplicates in current table
      const tableCount = parsedUsers.filter(
        (user) => user.email === email
      ).length;
      if (tableCount > 1) return true;

      // Check database for existing email
      const response = await axios.get(`/accounts/check_email?email=${email}`);
      return response.data.exists;
    } catch (error) {
      console.error("Error checking email:", error);
      return false;
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const text = e.target.result;
        const rows = text.split("\n");
        const headers = rows[0]
          .toLowerCase()
          .split(",")
          .map((h) => h.trim());

        // Get current table state
        const currentTableEmails = new Map(
          parsedUsers.map((user) => [
            user.email,
            !duplicateEmails.includes(user.email),
          ])
        );

        const newDuplicates = [];
        const newUsers = [];
        const processedEmails = new Set();

        // Process each row
        for (const row of rows.slice(1)) {
          const values = row.split(",").map((v) => v.trim());
          const email = values[headers.indexOf("email")]?.trim();

          if (!email) continue;

          // Skip if already processed in this import
          if (processedEmails.has(email)) {
            if (!newDuplicates.includes(email)) {
              newDuplicates.push(email);
            }
            continue;
          }

          // Check if email exists in current table
          if (currentTableEmails.has(email)) {
            // If it's a valid entry (not marked as duplicate), skip without marking as duplicate
            if (currentTableEmails.get(email)) {
              continue;
            }
          }

          // Check database for existing email
          const isDuplicate = await checkDuplicateEmail(email);
          if (isDuplicate) {
            if (!newDuplicates.includes(email)) {
              newDuplicates.push(email);
            }
            continue;
          }

          // Add new user if email is unique
          processedEmails.add(email);
          newUsers.push({
            id: Date.now() + newUsers.length,
            email: email,
            firstName: values[headers.indexOf("first_name")]?.trim(),
            middleInitial: values[headers.indexOf("middle_initial")]?.trim(),
            surname: values[headers.indexOf("surname")]?.trim(),
            suffix: values[headers.indexOf("suffix")]?.trim() || "",
          });
        }

        // Update states
        setParsedUsers((prevUsers) => [...prevUsers, ...newUsers]);
        setDuplicateEmails((prev) => [...new Set([...prev, ...newDuplicates])]);

        if (newDuplicates.length > 0) {
          setWarningMessage(
            `Warning: The following emails are duplicates or already exist and will be ignored:\n${newDuplicates.join(
              "\n"
            )}`
          );
          setOpenWarningDialog(true);
        }
      };
      reader.readAsText(file);
    }

    // Reset file input
    event.target.value = "";
  };

  const handleRoleChange = (userId, newRole) => {
    setParsedUsers((users) =>
      users.map((user) =>
        user.id === userId ? { ...user, roleId: newRole } : user
      )
    );
  };

  const handleProgramChange = (userId, newProgram) => {
    setParsedUsers((users) =>
      users.map((user) =>
        user.id === userId ? { ...user, programId: newProgram } : user
      )
    );
  };

  const fetchProgramsForCollege = async (collegeId) => {
    try {
      const response = await axios.get(`/deptprogs/programs/${collegeId}`);
      setProgramsByCollege((prev) => ({
        ...prev,
        [collegeId]: response.data.programs,
      }));
    } catch (error) {
      console.error("Error fetching programs:", error);
    }
  };

  // Add this function to handle form submission
  const handleAddUsers = async () => {
    try {
      // Validate selections
      if (!selectedRole || !selectedCollege || !selectedProgram) {
        setWarningMessage("Please select role, college, and program");
        setOpenWarningDialog(true);
        return;
      }

      // Check if we have any users to add
      if (parsedUsers.length === 0) {
        setWarningMessage("Please add at least one user");
        setOpenWarningDialog(true);
        return;
      }

      // Create FormData object
      const formData = new FormData();

      // Get the original CSV file if it exists
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput?.files[0]) {
        formData.append("file", fileInput.files[0]);
      }

      // Add the parsed users data with common selections
      const enrichedUsers = parsedUsers
        .filter((user) => !duplicateEmails.includes(user.email))
        .map((user) => ({
          email: user.email.trim(),
          firstName: user.firstName.trim(),
          middleInitial: user.middleInitial ? user.middleInitial.trim() : "",
          surname: user.surname.trim(),
          suffix: user.suffix ? user.suffix.trim() : "",
          roleId: selectedRole,
          collegeId: selectedCollege,
          programId: selectedProgram,
        }));

      if (enrichedUsers.length === 0) {
        setWarningMessage("No valid users to add. All emails are duplicates.");
        setOpenWarningDialog(true);
        return;
      }

      formData.append("users", JSON.stringify(enrichedUsers));

      // Make the API call
      const response = await axios.post("/accounts/bulk", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Handle success and download credentials file
      if (response.data) {
        const blob = new Blob([response.data], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `accounts_${new Date().toISOString()}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        setSuccessMessage(
          "Users added successfully! Downloading credentials file..."
        );
        setOpenSuccessDialog(true);
        handleCloseAddModal();
        fetchUsers();
      }
    } catch (error) {
      console.error("Error adding users:", error);
      setErrorMessage(error.response?.data?.error || "Error adding users");
      setOpenErrorDialog(true);
    }
  };

  const handleAddRow = async () => {
    // Check required fields
    if (!manualEntry.email || !manualEntry.firstName || !manualEntry.surname) {
      setWarningMessage("Email, First Name, and Surname are required");
      setOpenWarningDialog(true);
      return;
    }

    // Check if email exists in current table
    const emailExistsInTable = parsedUsers.some(
      (user) => user.email === manualEntry.email
    );
    if (emailExistsInTable) {
      setWarningMessage(
        `Email ${manualEntry.email} already exists in the current entries`
      );
      setOpenWarningDialog(true);
      return;
    }

    // Check if email exists in database
    const isDuplicate = await checkDuplicateEmail(manualEntry.email);
    if (isDuplicate) {
      setWarningMessage(
        `Email ${manualEntry.email} already exists in the database`
      );
      setOpenWarningDialog(true);
      return;
    }

    // If email is unique, add the new row
    setParsedUsers([...parsedUsers, { ...manualEntry, id: Date.now() }]);

    // Reset manual entry form
    setManualEntry({
      email: "",
      firstName: "",
      middleInitial: "",
      surname: "",
      suffix: "",
    });
  };

  const handleDeleteRow = async (id) => {
    // Remove the row
    const updatedUsers = parsedUsers.filter((user) => user.id !== id);
    setParsedUsers(updatedUsers);

    // Recalculate duplicates
    const newDuplicates = [];
    for (const user of updatedUsers) {
      // Check for duplicates in current table
      const tableCount = updatedUsers.filter(
        (u) => u.email === user.email
      ).length;
      const isDuplicate =
        tableCount > 1 || (await checkDuplicateEmail(user.email));
      if (isDuplicate && !newDuplicates.includes(user.email)) {
        newDuplicates.push(user.email);
      }
    }
    setDuplicateEmails(newDuplicates);
  };

  // Add this function to check if there are any valid (non-duplicate) users
  const hasValidUsers = () => {
    const validUsers = parsedUsers.filter(
      (user) => !duplicateEmails.includes(user.email)
    );
    return validUsers.length > 0;
  };

  // Update the DuplicateWarning component to show appropriate message
  const DuplicateWarning = ({ duplicateEmails }) => {
    if (duplicateEmails.length === 0) return null;

    const allDuplicates = duplicateEmails.length === parsedUsers.length;

    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          color: "error.main",
          mt: 2,
        }}
      >
        <ErrorIcon fontSize='small' />
        <Typography variant='body2'>
          {allDuplicates
            ? "All emails already exist in the database. No new users will be added."
            : `${duplicateEmails.length} duplicate email${
                duplicateEmails.length === 1 ? "" : "s"
              } found among the users to be added. 
              ${
                duplicateEmails.length === 1 ? "This will" : "These will"
              } be ignored during import: ${duplicateEmails.join(", ")}`}
        </Typography>
      </Box>
    );
  };

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

  // Add this function to handle archiving
  const handleArchive = async () => {
    try {
      setArchiveInProgress(true);
      setOpenArchiveConfirmDialog(false); // Close confirmation dialog
      setOpenArchiveModal(false); // Close archive modal

      const response = await axios.post("/accounts/archive_accounts", {
        archive_type: archiveType,
        days: archiveDays,
      });

      if (response.data.count > 0) {
        setSuccessMessage(
          `Successfully archived ${response.data.count} accounts. The archive file has been created.`
        );
        setOpenSuccessDialog(true);
        fetchUsers(); // Refresh the users list
      } else {
        setWarningMessage("No accounts found matching the archive criteria.");
        setOpenWarningDialog(true);
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.error || "Error archiving accounts"
      );
      setOpenErrorDialog(true);
    } finally {
      setArchiveInProgress(false);
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
          <HeaderWithBackButton
            title='Manage Users'
            onBack={() => navigate(-1)}
          />

          {/*Main Content */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {/* Search Bar */}
            <Box
              sx={{
                width: "80%", // Center search bar and button
                display: "flex",
                paddingTop: 3,
                paddingBottom: 2,
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <TextField
                variant='outlined'
                placeholder='Search by User ID, Email or Role'
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
              <Box>
                <Button
                  variant='contained'
                  color='primary'
                  onClick={handleOpenAddModal}
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
                >
                  <AddIcon></AddIcon>&nbsp;Add Users
                </Button>
                <Button
                  onClick={() => setOpenArchiveModal(true)}
                  sx={{
                    backgroundColor: "#08397C",
                    color: "#FFF",
                    marginLeft: "1rem",
                    "&:hover": {
                      backgroundColor: "#08397C",
                    },
                  }}
                >
                  Archive Accounts
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
                maxHeight: "calc(100vh - 20rem)", // Leave consistent space at bottom
              }}
            >
              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <Typography>Loading users...</Typography>
                </Box>
              ) : (
                <Box sx={{ flex: 1, overflow: "hidden" }}>
                  <Virtuoso
                    style={{
                      height: "calc(100vh - 20rem)", // Match parent height
                    }}
                    totalCount={filteredUsers.length}
                    components={{
                      Header: () => (
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            backgroundColor: "#0A438F",
                            fontSize: "0.875rem",
                            color: "#FFF",
                            padding: "0.625rem",
                            fontWeight: 700,
                            position: "sticky",
                            top: 0,
                            zIndex: 1000,
                          }}
                        >
                          <Box sx={{ flex: 1, fontSize: "0.875rem" }}>
                            User ID
                          </Box>
                          <Box sx={{ flex: 2, fontSize: "0.875rem" }}>
                            Email
                          </Box>
                          <Box sx={{ flex: 2, fontSize: "0.875rem" }}>Role</Box>
                          <Box sx={{ flex: 1, fontSize: "0.875rem" }}>
                            Active
                          </Box>
                        </Box>
                      ),
                    }}
                    itemContent={(index) => {
                      const user = filteredUsers[index];
                      return (
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            padding: "0.5rem",
                            borderBottom: "1px solid #ccc",
                            fontSize: "0.875rem",
                            "&:hover": {
                              backgroundColor: "#f5f5f5",
                            },
                          }}
                        >
                          <Box sx={{ flex: 1, fontSize: "inherit" }}>
                            {user.researcher_id}
                          </Box>
                          <Box sx={{ flex: 2, fontSize: "inherit" }}>
                            {user.email}
                          </Box>
                          <Box sx={{ flex: 2, fontSize: "inherit" }}>
                            {user.role_name || "N/A"}
                          </Box>
                          <Box
                            sx={{
                              flex: 1,
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <Switch
                              checked={user.acc_status === "ACTIVATED"}
                              onChange={() =>
                                handleToggleStatus(user, user.researcher_id)
                              }
                              color='primary'
                              size='small'
                            />
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

      {/* Add User Modal */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby='add-users-modal'
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "auto",
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
            mb={4}
            sx={{
              textAlign: { xs: "left", md: "bottom" },
              fontSize: {
                xs: "clamp(1rem, 2vw, 1rem)",
                sm: "clamp(1.5rem, 3.5vw, 1.5rem)",
                md: "clamp(2rem, 4vw, 2.25rem)",
              },
            }}
          >
            Add Users
          </Typography>

          {/* Required Fields Information */}
          <Box
            sx={{
              mb: 3,
              p: 2,
              bgcolor: "#f5f5f5",
              borderRadius: 1,
              border: "1px solid #e0e0e0",
            }}
          >
            <Typography
              variant='subtitle1'
              sx={{
                color: "#08397C",
                fontWeight: 600,
                mb: 1,
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              Required CSV Fields:
            </Typography>
            <Typography
              variant='body2'
              sx={{
                fontFamily: "Montserrat, sans-serif",
                "& span": { fontWeight: 600 },
              }}
            >
              • <span>email</span> - Mapúa MCL Live Account (e.g.,
              jdcruz@live.mcl.edu.ph)
            </Typography>
            <Typography
              variant='body2'
              sx={{
                fontFamily: "Montserrat, sans-serif",
                "& span": { fontWeight: 600 },
              }}
            >
              • <span>first_name</span> - First Name
            </Typography>
            <Typography
              variant='body2'
              sx={{
                fontFamily: "Montserrat, sans-serif",
                "& span": { fontWeight: 600 },
              }}
            >
              • <span>middle_initial (optional)</span> - Middle Initial
            </Typography>
            <Typography
              variant='body2'
              sx={{
                fontFamily: "Montserrat, sans-serif",
                "& span": { fontWeight: 600 },
              }}
            >
              • <span>surname</span> - Surname
            </Typography>
            <Typography
              variant='body2'
              sx={{
                fontFamily: "Montserrat, sans-serif",
                "& span": { fontWeight: 600 },
              }}
            >
              • <span>suffix (optional)</span> - Name suffix (e.g., Jr., III)
            </Typography>
          </Box>

          {/* Common Dropdowns */}
          <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel
                sx={{
                  fontSize: {
                    xs: "0.75rem",
                    md: "0.75rem",
                    lg: "0.8rem",
                  },
                }}
              >
                Role
              </InputLabel>
              <Select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                label='Role'
                sx={createTextFieldStyles()}
              >
                {roles
                  .filter((role) => role.role_id !== "01") // Exclude role_id "01"
                  .map((role) => (
                    <MenuItem
                      key={role.role_id}
                      value={role.role_id}
                      sx={{
                        fontSize: {
                          xs: "0.75rem",
                          md: "0.75rem",
                          lg: "0.8rem",
                        },
                      }}
                    >
                      {role.role_name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel
                sx={{
                  fontSize: {
                    xs: "0.75rem",
                    md: "0.75rem",
                    lg: "0.8rem",
                  },
                }}
              >
                College
              </InputLabel>
              <Select
                value={selectedCollege}
                onChange={(e) => handleCollegeChange(e.target.value)}
                label='College'
                sx={createTextFieldStyles()}
              >
                {colleges.map((college) => (
                  <MenuItem
                    key={college.college_id}
                    value={college.college_id}
                    sx={{
                      fontSize: {
                        xs: "0.75rem",
                        md: "0.75rem",
                        lg: "0.8rem",
                      },
                    }}
                  >
                    {college.college_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel
                sx={{
                  fontSize: {
                    xs: "0.75rem",
                    md: "0.75rem",
                    lg: "0.8rem",
                  },
                }}
              >
                Program
              </InputLabel>
              <Select
                value={selectedProgram}
                onChange={(e) => setSelectedProgram(e.target.value)}
                label='Program'
                disabled={!selectedCollege}
                sx={createTextFieldStyles()}
              >
                {programs.map((program) => (
                  <MenuItem
                    key={program.program_id}
                    value={program.program_id}
                    sx={{
                      fontSize: {
                        xs: "0.75rem",
                        md: "0.75rem",
                        lg: "0.8rem",
                      },
                    }}
                  >
                    {program.program_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                border: "2px dashed #0A438F",
                borderRadius: 1,
                m: 1,
                cursor: "pointer",
                justifyContent: "center",
                gap: 2,
              }}
            >
              <Button
                variant='text'
                color='primary'
                component='label'
                startIcon={<FileUploadIcon />}
                sx={{
                  color: "#08397C",
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 600,
                  textTransform: "none",
                  fontSize: { xs: "0.875rem", md: "1rem" },
                  padding: { xs: "0.5rem 1rem", md: "1.25rem" },
                  alignSelf: "center",
                  maxHeight: "2rem",
                  "&:hover": {
                    color: "#052045",
                  },
                }}
              >
                Import from CSV
                <input
                  type='file'
                  accept='.csv'
                  hidden
                  onChange={handleFileUpload}
                />
              </Button>
            </Box>
          </Box>

          {/* Users Table */}
          <TableContainer
            sx={{
              mb: 3,
              width: "70rem",
              maxHeight: "400px", // Add fixed height
              overflow: "auto", // Make scrollable
            }}
          >
            <Table stickyHeader>
              {" "}
              {/* Make header sticky */}
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableCell>
                    <Typography variant='subtitle2' sx={{ fontWeight: 700 }}>
                      Email
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant='subtitle2' sx={{ fontWeight: 700 }}>
                      First Name
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant='subtitle2' sx={{ fontWeight: 700 }}>
                      Middle Initial
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant='subtitle2' sx={{ fontWeight: 700 }}>
                      Surname
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant='subtitle2' sx={{ fontWeight: 700 }}>
                      Suffix
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant='subtitle2' sx={{ fontWeight: 700 }}>
                      Action
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/* Existing Users */}
                {parsedUsers.map((user) => (
                  <TableRow
                    key={user.id}
                    sx={{
                      backgroundColor: duplicateEmails.includes(user.email)
                        ? "#ffebee"
                        : "inherit",
                      "&:hover": {
                        backgroundColor: duplicateEmails.includes(user.email)
                          ? "#ffcdd2"
                          : "inherit",
                      },
                    }}
                  >
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        {user.email}
                        {duplicateEmails.includes(user.email) && (
                          <Tooltip title='Duplicate email'>
                            <ErrorIcon color='error' fontSize='small' />
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>{user.firstName}</TableCell>
                    <TableCell>{user.middleInitial}</TableCell>
                    <TableCell>{user.surname}</TableCell>
                    <TableCell>{user.suffix}</TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => handleDeleteRow(user.id)}
                        color='error'
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {/* Manual Entry Row */}
                <TableRow>
                  <TableCell>
                    <TextField
                      size='small'
                      value={manualEntry.email}
                      onChange={(e) =>
                        setManualEntry({
                          ...manualEntry,
                          email: e.target.value,
                        })
                      }
                      placeholder='Email'
                      sx={createTextFieldStyles()}
                      InputLabelProps={createInputLabelProps()}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      size='small'
                      value={manualEntry.firstName}
                      onChange={(e) =>
                        setManualEntry({
                          ...manualEntry,
                          firstName: e.target.value,
                        })
                      }
                      placeholder='First Name'
                      sx={createTextFieldStyles()}
                      InputLabelProps={createInputLabelProps()}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      size='small'
                      value={manualEntry.middleInitial}
                      onChange={(e) =>
                        setManualEntry({
                          ...manualEntry,
                          middleInitial: e.target.value,
                        })
                      }
                      placeholder='MI'
                      sx={createTextFieldStyles()}
                      InputLabelProps={createInputLabelProps()}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      size='small'
                      value={manualEntry.surname}
                      onChange={(e) =>
                        setManualEntry({
                          ...manualEntry,
                          surname: e.target.value,
                        })
                      }
                      placeholder='Surname'
                      sx={createTextFieldStyles()}
                      InputLabelProps={createInputLabelProps()}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      size='small'
                      value={manualEntry.suffix}
                      onChange={(e) =>
                        setManualEntry({
                          ...manualEntry,
                          suffix: e.target.value,
                        })
                      }
                      placeholder='Suffix'
                      sx={createTextFieldStyles()}
                      InputLabelProps={createInputLabelProps()}
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={handleAddRow} color='primary'>
                      <AddIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          {/* Footer area with warning and buttons */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              mt: 3,
            }}
          >
            {/* Warning message on the left */}
            <Box sx={{ flex: 1 }}>
              <DuplicateWarning duplicateEmails={duplicateEmails} />
            </Box>

            {/* Action buttons on the right */}
            <Box
              sx={{
                display: "flex",
                gap: 2,
              }}
            >
              <Button
                onClick={handleCloseModal}
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
                onClick={handleAddUsers}
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
                disabled={
                  !hasValidUsers() || // Disable if no valid users
                  !selectedRole ||
                  !selectedCollege ||
                  !selectedProgram ||
                  parsedUsers.length === 0
                }
              >
                Add Users
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
      <Dialog
        open={isConfirmDialogOpen}
        onClose={() => setIsConfirmDialogOpen(false)}
        PaperProps={{ sx: { borderRadius: "15px", padding: "1rem" } }}
      >
        <DialogTitle
          sx={{
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 600,
            color: "#08397C",
          }}
        >
          {dialogContent.title}
        </DialogTitle>
        <DialogContent>
          <Typography
            sx={{
              fontFamily: "Montserrat, sans-serif",
              color: "#666",
            }}
          >
            {dialogContent.message}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ padding: "1rem" }}>
          {dialogContent.cancelAction ? (
            // Yes and No buttons
            <>
              <Button
                onClick={dialogContent.cancelAction}
                sx={{
                  backgroundColor: "#CA031B",
                  color: "#FFF",
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 600,
                  textTransform: "none",
                  borderRadius: "100px",
                  padding: "0.75rem",
                  "&:hover": { backgroundColor: "#072d61" },
                }}
              >
                No
              </Button>
              <Button
                onClick={dialogContent.confirmAction}
                sx={{
                  backgroundColor: "#08397C",
                  color: "#FFF",
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 600,
                  textTransform: "none",
                  borderRadius: "100px",
                  padding: "0.75rem",
                  "&:hover": { backgroundColor: "#A30417" },
                }}
              >
                Yes
              </Button>
            </>
          ) : (
            // OK button for simple alerts
            <Button
              onClick={dialogContent.confirmAction}
              sx={{
                backgroundColor: "#08397C",
                color: "#FFF",
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 600,
                textTransform: "none",
                borderRadius: "100px",
                padding: "0.75rem",
                "&:hover": { backgroundColor: "#A30417" },
              }}
            >
              OK
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Archive Modal */}
      <Modal
        open={openArchiveModal}
        onClose={() => setOpenArchiveModal(false)}
        aria-labelledby='archive-modal'
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: "8px",
          }}
        >
          <Typography
            variant='h6'
            component='h2'
            mb={3}
            sx={{
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 600,
              color: "#08397C",
            }}
          >
            Archive Accounts
          </Typography>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Archive Type</InputLabel>
            <Select
              value={archiveType}
              onChange={(e) => setArchiveType(e.target.value)}
              label='Archive Type'
            >
              <MenuItem value='INACTIVE'>Inactive Accounts</MenuItem>
              <MenuItem value='DEACTIVATED'>Deactivated Accounts</MenuItem>
              <MenuItem value='ALL'>
                All Inactive and Deactivated Accounts
              </MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Days Threshold</InputLabel>
            <Select
              value={archiveDays}
              onChange={(e) => setArchiveDays(e.target.value)}
              label='Days Threshold'
            >
              <MenuItem value={180}>180 days (6 months)</MenuItem>
              <MenuItem value={365}>365 days (1 year)</MenuItem>
              <MenuItem value={730}>730 days (2 years)</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
            <Button
              onClick={() => setOpenArchiveModal(false)}
              sx={{
                backgroundColor: "#CA031B",
                color: "#FFF",
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 600,
                textTransform: "none",
                borderRadius: "100px",
                padding: "0.75rem",
                "&:hover": { backgroundColor: "#A30417" },
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => setOpenArchiveConfirmDialog(true)}
              sx={{
                backgroundColor: "#08397C",
                color: "#FFF",
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 600,
                textTransform: "none",
                borderRadius: "100px",
                padding: "0.75rem",
                "&:hover": { backgroundColor: "#072d61" },
              }}
            >
              Archive
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Archive Confirmation Dialog */}
      <Dialog
        open={openArchiveConfirmDialog}
        onClose={() => setOpenArchiveConfirmDialog(false)}
        maxWidth='sm'
        fullWidth
      >
        <DialogTitle sx={{ fontFamily: "Montserrat, sans-serif" }}>
          Confirm Archive Operation
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontFamily: "Montserrat, sans-serif" }}>
            This operation will archive{" "}
            {archiveType === "ALL"
              ? "all inactive and deactivated"
              : archiveType === "INACTIVE"
              ? "inactive"
              : "deactivated"}{" "}
            accounts that have been in that state for {archiveDays} days.
            <Box sx={{ mt: 2, color: "warning.main" }}>
              Note: Archived accounts will be removed from the active database
              but can be restored later using the generated SQL file.
            </Box>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenArchiveConfirmDialog(false)}
            sx={{
              fontFamily: "Montserrat, sans-serif",
              textTransform: "none",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleArchive}
            variant='contained'
            color='primary'
            sx={{
              fontFamily: "Montserrat, sans-serif",
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Proceed with Archive
          </Button>
        </DialogActions>
      </Dialog>

      {/* Archive Progress Dialog */}
      <Dialog open={archiveInProgress} fullWidth maxWidth='sm'>
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              py: 2,
            }}
          >
            <CircularProgress sx={{ mb: 2 }} />
            <Typography sx={{ fontFamily: "Montserrat, sans-serif" }}>
              Archiving accounts. Please wait...
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog
        open={openSuccessDialog}
        onClose={() => setOpenSuccessDialog(false)}
        maxWidth='sm'
        fullWidth
      >
        <DialogTitle sx={{ fontFamily: "Montserrat, sans-serif" }}>
          Archive Operation Successful
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontFamily: "Montserrat, sans-serif" }}>
            {successMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenSuccessDialog(false)}
            sx={{
              fontFamily: "Montserrat, sans-serif",
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Error Dialog */}
      <Dialog
        open={openErrorDialog}
        onClose={() => setOpenErrorDialog(false)}
        maxWidth='sm'
        fullWidth
      >
        <DialogTitle
          sx={{
            fontFamily: "Montserrat, sans-serif",
            color: "error.main",
          }}
        >
          Error
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            sx={{
              fontFamily: "Montserrat, sans-serif",
              color: "error.main",
            }}
          >
            {errorMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenErrorDialog(false)}
            sx={{
              fontFamily: "Montserrat, sans-serif",
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Warning Dialog */}
      <Dialog
        open={openWarningDialog}
        onClose={() => setOpenWarningDialog(false)}
        maxWidth='sm'
        fullWidth
      >
        <DialogTitle
          sx={{
            fontFamily: "Montserrat, sans-serif",
            color: "warning.main",
          }}
        >
          Warning
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            sx={{
              fontFamily: "Montserrat, sans-serif",
              whiteSpace: "pre-line", // This preserves line breaks in the message
            }}
          >
            {warningMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenWarningDialog(false)}
            sx={{
              fontFamily: "Montserrat, sans-serif",
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog
        open={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
        maxWidth='sm'
        fullWidth
      >
        <DialogTitle sx={{ fontFamily: "Montserrat, sans-serif" }}>
          {confirmTitle}
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontFamily: "Montserrat, sans-serif" }}>
            {confirmMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenConfirmDialog(false)}
            sx={{
              fontFamily: "Montserrat, sans-serif",
              textTransform: "none",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              setOpenConfirmDialog(false);
              confirmAction && confirmAction();
            }}
            variant='contained'
            sx={{
              fontFamily: "Montserrat, sans-serif",
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ManageUsers;
