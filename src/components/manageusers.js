import React, { useEffect, useState } from "react";
import Navbar from "./navbar";
import Footer from "./footer";
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
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import homeBg from "../assets/home_bg.png";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Search } from "@mui/icons-material";
import { Virtuoso } from "react-virtuoso";
import axios from "axios";
import FileUploadIcon from "@mui/icons-material/FileUpload";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState("");
  const [roles, setRoles] = useState([]);
  const [accountStatus, setAccountStatus] = useState("");
  const [initialData, setInitialData] = useState(null);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [selectedUserType, setSelectedUserType] = useState("");
  const [newUsers, setNewUsers] = useState([]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get(`/accounts/fetch_roles`);
        setRoles(response.data.roles);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await axios.get("/accounts/users");
        const fetchedUsers = response.data.researchers;
        setUsers(fetchedUsers);
        setFilteredUsers(fetchedUsers);
      } catch (error) {
        console.error("Error fetching data of users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoles(); // Call fetchRoles here
    fetchUsers();
  }, []);

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredUsers(
      users.filter(
        (user) =>
          user.email.toLowerCase().includes(query) ||
          user.researcher_id.toLowerCase().includes(query)
      )
    );
  };
  const handleOpenModal = (user) => {
    setSelectedUser(user);

    // Set the initial data for comparison in handleSaveChanges
    setInitialData({
      role_name: user.role_name,
      accountStatus: user.acc_status,
    });

    // Find and set the role_id for the selected user
    const matchingRole = roles.find(
      (role_id) => role_id.role_name === user.role_name
    );
    if (matchingRole) {
      setNewRole(matchingRole.role_id); // Set the newRole state with the role_id
    } else {
      setNewRole(""); // Fallback in case no matching role is found
    }

    console.log("Selected User:", user);
    console.log("Matching Role (if found):", matchingRole);

    setAccountStatus(user.acc_status); // Set account status for the selected user
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedUser(null);
  };

  // Function to get role by role_id
  const getRoleById = (roleId) => {
    return roles.find((role) => role.role_id === roleId);
  };

  const handleSaveChanges = async () => {
    const newRoleName = getRoleById(newRole);
    console.log("newRoleName:", newRoleName.role_name);

    const hasChanges =
      newRoleName.role_name !== initialData?.role_name ||
      accountStatus !== initialData?.accountStatus;

    if (!hasChanges) {
      alert("No changes detected. Please modify user's details before saving.");
    } else {
      updateChanges();
    }
  };

  const updateChanges = async () => {
    try {
      await axios.put(`/accounts/update_acc/${selectedUser.researcher_id}`, {
        role_id: newRole, // Corrected key to 'role_id'
        acc_status: accountStatus,
      });

      const selectedRole = roles.find((role) => role.role_id === newRole);
      const roleName = selectedRole ? selectedRole.role_name : "N/A"; // Default to "N/A" if not found
      console.log("Selected Role Name: ", roleName);

      // Update users state to reflect changes without re-fetching
      const updatedUsers = users.map((user) =>
        user.researcher_id === selectedUser.researcher_id
          ? { ...user, role_name: roleName, acc_status: accountStatus }
          : user
      );

      // Update the state to trigger a re-render
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);

      console.log("New Role ID: ", newRole); // Optional for debugging
    } catch (error) {
      console.error("Error saving changes:", error);
    } finally {
      setOpenModal(false);
    }
  };

  const handleOpenAddModal = () => {
    setOpenAddModal(true);
  };

  const handleCloseAddModal = () => {
    setOpenAddModal(false);
    setSelectedUserType("");
    setNewUsers([]);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // TODO: Implement CSV parsing logic
      // For now, just console log the file
      console.log("File selected:", file);
    }
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <Navbar />
        <Box
          sx={{
            flexGrow: 1,
            height: { xs: "100%", md: "calc(100vh - 9rem)" },
            marginTop: { xs: "3.5rem", sm: "4rem", md: "6rem" },
          }}
        >
          <Box
            sx={{
              position: "relative",
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              padding: 4,
              gap: 4,
              backgroundSize: "cover",
              backgroundPosition: "center",
              height: { xs: "5rem", md: "6rem" },
              backgroundColor: "#0A438F",
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
                <ArrowBackIosIcon></ArrowBackIosIcon>
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
                Manage Users
              </Typography>
            </Box>
          </Box>
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
                paddingTop: 2,
                paddingBottom: 2,
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <TextField
                variant='outlined'
                placeholder='Search by User ID or Email'
                value={searchQuery}
                onChange={handleSearchChange}
                sx={{ width: "30rem" }}
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
                color='primary'
                onClick={handleOpenAddModal}
                sx={{
                  backgroundColor: "#F40824",
                  color: "#FFF",
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 600,
                  textTransform: "none",
                  fontSize: { xs: "0.875rem", md: "1.375rem" },
                  padding: { xs: "0.5rem 1rem", md: "1.5rem" },
                  marginLeft: "2rem",
                  borderRadius: "100px",
                  maxHeight: "3rem",
                }}
              >
                Add New User
              </Button>
            </Box>

            {/* Virtuoso Table */}
            <Box sx={{ width: "80%" }}>
              {loading ? (
                <Typography>Loading users...</Typography>
              ) : (
                <Virtuoso
                  style={{ height: "500px" }}
                  totalCount={filteredUsers.length}
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
                        <Box sx={{ flex: 1 }}>User ID</Box>
                        <Box sx={{ flex: 2 }}>Email</Box>
                        <Box sx={{ flex: 1 }}>Role</Box>
                        <Box sx={{ flex: 1 }}>Action</Box>
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
                          padding: "10px",
                          borderBottom: "1px solid #ccc",
                        }}
                      >
                        <Box sx={{ flex: 1 }}>{user.researcher_id}</Box>
                        <Box sx={{ flex: 2 }}>{user.email}</Box>
                        <Box sx={{ flex: 1 }}>{user.role_name || "N/A"}</Box>
                        <Box sx={{ flex: 1 }}>
                          <Button
                            variant='text'
                            color='primary'
                            onClick={() => handleOpenModal(user)}
                          >
                            Edit
                          </Button>
                        </Box>
                      </Box>
                    );
                  }}
                />
              )}
            </Box>
            {selectedUser && (
              <Modal
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby='edit-user-role-modal'
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
                  <Typography variant='h6' mb={3}>
                    Edit User Account
                  </Typography>
                  <TextField
                    label='User ID'
                    value={selectedUser.researcher_id}
                    disabled
                    fullWidth
                    margin='normal'
                  />
                  <TextField
                    label='Mapúa MCL Live Account'
                    value={selectedUser.email}
                    disabled
                    fullWidth
                    margin='normal'
                  />
                  <FormControl fullWidth margin='normal'>
                    <InputLabel>Role</InputLabel>
                    <Select
                      value={newRole} // This should hold role_id
                      onChange={(e) => setNewRole(e.target.value)} // Update newRole with role_id
                      label='Role'
                      disabled={
                        selectedUser?.institution !==
                          "Mapúa Malayan Colleges Laguna" ||
                        ["01", "02", "03"].includes(selectedUser?.role_id) // Disable for specific role IDs
                      }
                    >
                      {roles
                        .filter(
                          (role) =>
                            !["01", "02", "03"].includes(role.role_id) || // Keep other roles
                            ["01", "02", "03"].includes(newRole) // Always include if the selected role is restricted
                        )
                        .map((role) => (
                          <MenuItem key={role.role_id} value={role.role_id}>
                            {" "}
                            {/* Value is role_id */}
                            {role.role_name} {/* Display role_name */}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                  <FormControl component='fieldset' margin='normal'>
                    <FormLabel component='legend'>Account Status</FormLabel>
                    <RadioGroup
                      value={accountStatus} // Use state variable here
                      onChange={(e) => setAccountStatus(e.target.value)}
                    >
                      <FormControlLabel
                        value='ACTIVATED'
                        control={<Radio />}
                        label='Activated'
                      />
                      <FormControlLabel
                        value='DEACTIVATED'
                        control={<Radio />}
                        label='Deactivated'
                      />
                    </RadioGroup>
                  </FormControl>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mt: 3,
                    }}
                  >
                    <Button
                      variant='outlined'
                      onClick={handleCloseModal}
                      sx={{ fontWeight: 600 }}
                    >
                      Back
                    </Button>
                    <Button
                      variant='contained'
                      color='primary'
                      onClick={handleSaveChanges}
                      sx={{ fontWeight: 600 }}
                    >
                      Save Changes
                    </Button>
                  </Box>
                </Box>
              </Modal>
            )}
          </Box>
        </Box>
      </Box>
      <Modal
        open={openAddModal}
        onClose={handleCloseAddModal}
        aria-labelledby='add-users-modal'
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80%",
            maxWidth: 1000,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: "8px",
            maxHeight: "80vh",
            overflow: "auto",
          }}
        >
          <Typography variant='h6' mb={3}>
            Add Multiple Users
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
            <FormControl sx={{ width: "300px" }}>
              <InputLabel>User Type</InputLabel>
              <Select
                value={selectedUserType}
                onChange={(e) => setSelectedUserType(e.target.value)}
                label='User Type'
              >
                <MenuItem value='researchers'>Researchers</MenuItem>
                <MenuItem value='students'>Students</MenuItem>
                <MenuItem value='faculty'>Faculty</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant='contained'
              component='label'
              startIcon={<FileUploadIcon />}
              sx={{ height: "56px" }}
            >
              Import from CSV
              <input
                type='file'
                hidden
                accept='.csv'
                onChange={handleFileUpload}
              />
            </Button>
          </Box>

          <Box sx={{ width: "100%", overflow: "auto" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Email</TableCell>
                  <TableCell>Surname</TableCell>
                  <TableCell>First Name</TableCell>
                  <TableCell>Middle Initial</TableCell>
                  <TableCell>Suffix</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {newUsers.map((user, index) => (
                  <TableRow key={index}>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.surname}</TableCell>
                    <TableCell>{user.firstName}</TableCell>
                    <TableCell>{user.middleInitial}</TableCell>
                    <TableCell>{user.suffix}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>

          <Box
            sx={{ display: "flex", justifyContent: "flex-end", mt: 3, gap: 2 }}
          >
            <Button
              variant='outlined'
              onClick={handleCloseAddModal}
              sx={{ fontWeight: 600 }}
            >
              Cancel
            </Button>
            <Button
              variant='contained'
              color='primary'
              sx={{ fontWeight: 600 }}
              disabled={newUsers.length === 0}
            >
              Add Users
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default ManageUsers;
