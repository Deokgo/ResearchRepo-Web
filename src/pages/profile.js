import React, { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import {
  Box,
  Button,
  Grid2,
  Typography,
  Divider,
  IconButton,
  TextField,
  Modal,
  MenuItem,
  InputLabel,
  Select,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import homeBg from "../assets/home_bg.png";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import HeaderWithBackButton from "../components/Header";
import OtpModal from "../components/otpmodal"; // Adjust the path if needed

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", sm: "80%", md: "600px" }, // Responsive width
  bgcolor: "background.paper",
  boxShadow: 24,
  p: { xs: 2, sm: 3, md: 4 }, // Responsive padding
  borderRadius: "10px",
};

const Profile = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCollege, setSelectedCollege] = useState("");
  const [selectedProgram, setSelectedProgram] = useState("");
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] =
    useState(false);
  const [colleges, setColleges] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [initialData, setInitialData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    suffix: "",
    department: "",
    program: "",
  });  
  const navigate = useNavigate();
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [formValues, setFormValues] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    suffix: "",
    department: "",
    program: "",
    email: "",
    role: "",
    institution: "",
  });
  const [email, setEmail] = useState(null);

  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState({
    title: "",
    message: "",
    confirmAction: null,
  });

  const [passwordValues, setPasswordValues] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const fetchUserData = async () => {
    if (user?.user_id) {
      try {
        const response = await axios.get(`/accounts/users/${user.user_id}`);
        const data = response.data;

        // Set user data for later use
        setUserData(data);
        console.log("response: ", response);

        // Set the email for the password reset (OTP)
        setEmail(data.account.email);

        // Set form values
        setFormValues({
          firstName: data.researcher.first_name || "",
          middleName: data.researcher.middle_name || "",
          lastName: data.researcher.last_name || "",
          suffix: data.researcher.suffix || "",
          department: data.researcher.college_id || "",
          program: data.researcher.program_id || "",
          email: data.account.email || "",
          role: data.account.role_name || "",
          institution: data.researcher.institution || "",
        });

        // Set initial data for comparison
        setInitialData({
          firstName: data.researcher.first_name || "",
          middleName: data.researcher.middle_name || "",
          lastName: data.researcher.last_name || "",
          suffix: data.researcher.suffix || "",
          department: data.researcher.college_id || "",
          program: data.researcher.program_id || "",
        });

        console.log("Initial data set:", initialData); // Check if this is correct

        // Fetch programs for the initially set department if present
        if (data.researcher.college_id) {
          fetchProgramsByCollege(data.researcher.college_id);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
  };

  // Disabling combobox when the role of the user are these:
  const shouldDisableInputs =
    ["System Administrator", "Director", "Head Executive"].includes(
      formValues.role
    ) ||
    (formValues.role === "Researcher" && !formValues.department);

  // Effect to check selected department (console log)
  useEffect(() => {
    if (formValues.department) {
      console.log("Selected College on load:", formValues.department);
    }
  }, [formValues.department]);

  // Fetch user data on component mount
  useEffect(() => {
    if (user?.user_id) {
      fetchUserData();
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordValues({ ...passwordValues, [name]: value });
  };

  const handleSaveUserChanges = async () => {
    try {
      if (!user?.user_id) {
        setDialogContent({
          title: "User ID Not Found",
          message: "We couldn't find your User ID. Please try again.",
          confirmAction: () => setIsConfirmDialogOpen(false),
        });
        setIsConfirmDialogOpen(true);
        return;
      }
  
      const { firstName, middleName, lastName, suffix, department: college_id, program: program_id } = formValues;
  
      const payload = { first_name: firstName, middle_name: middleName, last_name: lastName, suffix, college_id, program_id };
  
      const hasChanges =
        firstName !== initialData?.firstName ||
        middleName !== initialData?.middleName ||
        lastName !== initialData?.lastName ||
        suffix !== initialData?.suffix ||
        college_id !== initialData?.department ||
        program_id !== initialData?.program;
  
      if (!hasChanges) {
        setDialogContent({
          title: "No Changes Detected",
          message: "You haven't made any changes. Please modify your profile before saving.",
          confirmAction: () => setIsConfirmDialogOpen(false),
        });
        setIsConfirmDialogOpen(true);
        return;
      }
  
      const response = await fetch(`/accounts/update_account/${user.user_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      if (response.ok) {
        const data = await response.json();
  
        // Update initialData to reflect saved changes
        setInitialData({
          firstName,
          middleName,
          lastName,
          suffix,
          department: college_id,
          program: program_id,
        });
  
        setDialogContent({
          title: "Profile Updated",
          message: "Your profile has been updated successfully.",
          confirmAction: () => {
            setIsConfirmDialogOpen(false);
            fetchUserData();
          },
        });
      } else {
        const errorData = await response.json();
        setDialogContent({
          title: "Update Failed",
          message: `Failed to update profile: ${errorData.message || "Unknown error"}`,
          confirmAction: () => setIsConfirmDialogOpen(false),
        });
  
        if (errorData.missing_fields) {
          console.log("Missing fields:", errorData.missing_fields);
        }
      }
  
      setIsConfirmDialogOpen(true);
    } catch (error) {
      console.error("Error updating profile:", error);
      setDialogContent({
        title: "An Error Occurred",
        message: "Something went wrong while updating your profile. Please try again later.",
        confirmAction: () => setIsConfirmDialogOpen(false),
      });
      setIsConfirmDialogOpen(true);
    }
  };  

  const handleSaveNewPassword = async () => {
    const { newPassword, confirmPassword } = passwordValues;
  
    if (!user?.user_id) {
      setDialogContent({
        title: "User ID Not Found",
        message: "We couldn't find your User ID. Please try again.",
        confirmAction: () => setIsConfirmDialogOpen(false),
      });
      setIsConfirmDialogOpen(true);
      return;
    }
  
    // Validate input fields
    if (!newPassword || !confirmPassword) {
      setDialogContent({
        title: "Missing Fields",
        message: "All fields are required.",
        confirmAction: () => setIsConfirmDialogOpen(false),
      });
      setIsConfirmDialogOpen(true);
      return;
    }
  
    if (newPassword !== confirmPassword) {
      setDialogContent({
        title: "Password Mismatch",
        message: "Passwords do not match. Please check and try again.",
        confirmAction: () => setIsConfirmDialogOpen(false),
      });
      setIsConfirmDialogOpen(true);
      return;
    }
  
    try {
      // Send request to the server
      const response = await axios.put(`/accounts/update_password/${user.user_id}`, {
        newPassword,
        confirmPassword,
      });
  
      // Handle server response
      if (response.status === 200) {
        setDialogContent({
          title: "Password Updated",
          message: "Your password has been successfully updated.",
          confirmAction: () => {
            setIsConfirmDialogOpen(false);
            setPasswordValues({
              newPassword: "",
              confirmPassword: "",
            });
            handleCloseChangePasswordModal();
          },
        });
      } else {
        setDialogContent({
          title: "Update Failed",
          message: response.data.message || "Something went wrong.",
          confirmAction: () => setIsConfirmDialogOpen(false),
        });
      }
    } catch (error) {
      console.error("Error updating password:", error);
  
      setDialogContent({
        title: "An Error Occurred",
        message: error.response?.data?.message || "An error occurred while updating the password. Please try again later.",
        confirmAction: () => setIsConfirmDialogOpen(false),
      });
    }
  
    setIsConfirmDialogOpen(true);
  };  

  const handleNavigateHome = () => {
    navigate("/main");
  };

  const handleOpenModal = async () => {
    setIsModalOpen(true);
    console.log("Should disable inputs:", shouldDisableInputs);
    console.log("Role:", formValues.role);
    console.log("Department:", formValues.department);
    console.log("Program:", formValues.program);
    await fetchUserData();
  };

  const handleCloseModal = () => {
    const { firstName, middleName, lastName, suffix, department: college_id, program: program_id } = formValues;
  
    const hasChanges =
      firstName !== initialData?.firstName ||
      middleName !== initialData?.middleName ||
      lastName !== initialData?.lastName ||
      suffix !== initialData?.suffix ||
      college_id !== initialData?.department ||
      program_id !== initialData?.program;
  
    if (hasChanges) {
      setDialogContent({
        title: "Unsaved Changes",
        message: "You have unsaved changes. Do you want to discard them?",
        confirmText: "Yes, Discard",
        cancelText: "No, Keep Editing",
        confirmAction: () => {
          setIsConfirmDialogOpen(false);
          setIsModalOpen(false);
  
          // ✅ Reset form values when discarding changes
          setFormValues(initialData);
        },
        cancelAction: () => {
          setIsConfirmDialogOpen(false);
          // ✅ Modal remains open (no action on setIsModalOpen)
        },
      });
      setIsConfirmDialogOpen(true);
    } else {
      setIsModalOpen(false);
    }
  };  

  // Fetch all colleges when the modal opens
  useEffect(() => {
    if (isModalOpen) {
      fetchColleges();
    }
  }, [isModalOpen]);

  // Fetch all colleges
  const fetchColleges = async () => {
    try {
      const response = await axios.get(`/deptprogs/college_depts`);
      setColleges(response.data.colleges);
    } catch (error) {
      console.error("Error fetching colleges:", error);
    }
  };

  // Fetch programs based on selected college
  const fetchProgramsByCollege = async (collegeId) => {
    if (collegeId) {
      try {
        const response = await axios.get(`/deptprogs/programs/${collegeId}`);
        setPrograms(response.data.programs);
      } catch (error) {
        console.error("Error fetching programs by college:", error);
      }
    } else {
      setPrograms([]);
    }
  };

  const handleCollegeChange = (event) => {
    const selectedCollegeId = event.target.value;
    setSelectedCollege(selectedCollegeId);
    fetchProgramsByCollege(selectedCollegeId);
    setSelectedProgram(""); // Reset selected program when college changes
  };

  const handleOpenChangePasswordModal = () => {
    setIsChangePasswordModalOpen(true);
  };
  

  const handleOpenOtpModal = async () => {
    try {
      const otpResponse = await axios.post("/auth/send_otp", {
        email: email, // Ensure email is correctly defined
        isPasswordReset: true, // Ensure it is explicitly set
      });
  
      if (otpResponse.status === 200) {
        setIsOtpModalOpen(true);
      } else {
        console.warn("Unexpected response status:", otpResponse.status);
      }
    } catch (error) {
      console.error("Error sending OTP:", error.response?.data || error.message);
    } finally {
      setIsOtpModalOpen(true); // Ensure modal opens even if OTP fails
    }
  };
  
  

  const handleCloseOtpModal = () => {
    setIsOtpModalOpen(false);
  };

  const handleOtpVerificationSuccess = () => {
    handleCloseOtpModal(); // Close the OTP modal
    handleOpenChangePasswordModal(); // Open the Change Password modal
  };

  const handleCloseChangePasswordModal = () => {
    setIsChangePasswordModalOpen(false);
    setPasswordValues({
      newPassword: "",
      confirmPassword: "",
    });
  };

  return (
    <>
      <Box
        sx={{
          margin: 0,
          padding: 0,
          height: "100%",
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
            height: "calc(100% - 6rem)",
            overflow: "hidden",
          }}
        >
          <HeaderWithBackButton title='Profile' onBack={() => navigate(-1)} />

          {/* Content Section */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: 4,
              width: "100%",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between", // Pushes buttons to opposite sides
                alignItems: "center", // Centers buttons vertically
                flexWrap: "wrap", // Ensures wrapping on smaller screens
                width: "100%", // Full width for responsiveness
                width: { xs: "100%", sm: "100%", md: "90%", lg: "70%" },
                mb: "1.5rem",
              }}
            >
              {userData && userData.account && userData.account.role_name !== "System Administrator" && (
                <Button
                  variant='outlined'
                  startIcon={<EditIcon />}
                  onClick={handleOpenOtpModal}
                  sx={{
                    fontWeight: 600,
                    flex: "0 1 auto", // Prevents shrinking too much
                    minWidth: "120px", // Ensures a consistent minimum width
                  }}
                >
                  Change Password
                </Button>
              )}

              {/* OTP Modal */}
              <OtpModal
                email={email}
                open={isOtpModalOpen}
                onClose={handleCloseOtpModal}
                onVerify={handleOtpVerificationSuccess}
                isPasswordReset={true}
              />

              <Button
                variant='outlined'
                startIcon={<EditIcon />}
                onClick={handleOpenModal}
                sx={{
                  fontWeight: 600,
                  flex: "0 1 auto", // Same flexibility as the first button
                  minWidth: "150px",
                }}
              >
                Edit Profile
              </Button>
            </Box>

            <Grid2
              container
              spacing={5}
              sx={{
                width: { xs: "100%", sm: "100%", md: "90%", lg: "70%" },
                margin: "0 auto",
              }}
            >
              {userData ? (
                [
                  {
                    label: "First Name",
                    value: userData.researcher.first_name,
                  },
                  {
                    label: "Middle Name",
                    value: userData.researcher.middle_name || "N/A",
                  },
                  {
                    label: "Last Name",
                    value: userData.researcher.last_name,
                  },
                  {
                    label: "Suffix",
                    value: userData.researcher.suffix || "N/A",
                  },
                  {
                    label: "Account",
                    value: userData.account.email,
                  },
                  {
                    label: "Role",
                    value: userData.account.role_name,
                  },
                  {
                    label: "Department",
                    value: userData.researcher.college_id || "N/A",
                  },
                  {
                    label: "Program",
                    value: userData.researcher.program_id || "N/A",
                  },
                  {
                    label: "Institution",
                    value: userData.researcher.institution,
                  },
                ].map((field, index) => (
                  <Grid2
                    size={{ xs: 12, sm: 4 }}
                    key={index}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Typography
                      variant='body1'
                      sx={{
                        color: "#777",
                        fontWeight: 600,
                        fontSize: { xs: "0.9rem", sm: "1rem" },
                      }}
                    >
                      {field.label}
                    </Typography>
                    <Typography
                      variant='h7'
                      sx={{
                        color: "#001C43",
                        fontWeight: 600,
                        mt: "0.25rem",
                      }}
                    >
                      {field.value}
                    </Typography>
                    <Divider
                      sx={{
                        mt: "0.75rem",
                        mb: "1.5rem",
                        borderColor: "#ccc",
                      }}
                    />
                  </Grid2>
                ))
              ) : (
                <Typography variant='body1'>Loading user data...</Typography>
              )}
            </Grid2>
          </Box>

          <Modal open={isModalOpen} onClose={handleCloseModal}>
            <Box
              sx={{
                ...modalStyle,
                maxHeight: "90vh", // Limit the modal height to 90% of the viewport height
                overflowY: "auto", // Enable vertical scrolling when content overflows
              }}
            >
              <Typography
                variant='h4'
                sx={{ mb: 4, fontWeight: 800, color: "#08397C" }}
              >
                Edit Profile
              </Typography>
              <Grid2 container spacing={2}>
                <Grid2 size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label='First Name'
                    fullWidth
                    name='firstName'
                    value={formValues.firstName}
                    onChange={handleInputChange}
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label='Middle Name'
                    fullWidth
                    name='middleName'
                    value={formValues.middleName}
                    onChange={handleInputChange}
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label='Last Name'
                    fullWidth
                    name='lastName'
                    value={formValues.lastName}
                    onChange={handleInputChange}
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label='Suffix'
                    fullWidth
                    name='suffix'
                    value={formValues.suffix}
                    onChange={handleInputChange}
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label='Account'
                    fullWidth
                    name='email'
                    value={formValues.email}
                    disabled
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label='Role'
                    fullWidth
                    name='role'
                    value={formValues.role}
                    disabled
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6 }}>
                  <InputLabel>Department</InputLabel>
                  <Select
                    value={formValues.department || ""} // Use an empty string as fallback
                    onChange={(e) => {
                      const selectedDepartment = e.target.value;
                      console.log("Selected Department:", selectedDepartment); // Debug
                      handleCollegeChange(e); // Update department value
                      setFormValues((prevValues) => ({
                        ...prevValues,
                        department: selectedDepartment, // Update form state
                        program: "", // Reset program when department changes
                      }));
                    }}
                    label='Department'
                    sx={{
                      width: "100%", // Full width for the parent container
                      maxWidth: { xs: "300px", sm: "400px", md: "500px" }, // Dynamic max width for different screen sizes
                      minWidth: "200px", // Minimum width to ensure usability
                    }}
                    disabled={shouldDisableInputs} // Conditionally disable input based on role
                  >
                    {colleges.map((college) => (
                      <MenuItem
                        key={college.college_id}
                        value={college.college_id}
                      >
                        {college.college_name}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid2>

                <Grid2 size={{ xs: 12, sm: 6 }}>
                  <InputLabel>Program</InputLabel>
                  <Select
                    value={formValues.program || ""} // Use an empty string as fallback
                    onChange={(e) => {
                      const selectedProgram = e.target.value;
                      console.log("Selected Program:", selectedProgram); // Debug
                      setSelectedProgram(selectedProgram); // Update selected program
                      setFormValues((prevValues) => ({
                        ...prevValues,
                        program: selectedProgram, // Update form state
                      }));
                    }}
                    label='Program'
                    sx={{
                      width: "100%", // Full width for the parent container
                      maxWidth: { xs: "300px", sm: "400px", md: "500px" }, // Dynamic max width for different screen sizes
                      minWidth: "200px", // Minimum width to ensure usability
                    }}
                    disabled={shouldDisableInputs || !formValues.department} // Conditionally disable input based on role and department selection
                  >
                    {programs
                      .filter((program) => {
                        const isMatch =
                          program.college_id === formValues.department;
                        console.log("Filtering Programs:", program, isMatch); // Debug
                        return isMatch;
                      })
                      .map((program) => (
                        <MenuItem
                          key={program.program_id}
                          value={program.program_id}
                        >
                          {program.program_name}
                        </MenuItem>
                      ))}
                  </Select>
                </Grid2>
              </Grid2>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "1.5rem",
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
                  onClick={handleSaveUserChanges}
                  sx={{
                    backgroundColor: "#CA031B",
                    color: "#FFF",
                    fontWeight: 600,
                  }}
                >
                  Save Changes
                </Button>
              </Box>
            </Box>
          </Modal>

          {/* Change Password Modal */}
          <Modal
            open={isChangePasswordModalOpen}
            onClose={handleCloseChangePasswordModal}
          >
            <Box
              sx={{
                ...modalStyle,
                maxHeight: "90vh", // Limit the modal height to 90% of the viewport height
                overflowY: "auto", // Enable vertical scrolling when content overflows
              }}
            >
              <Typography
                variant='h4'
                sx={{ mb: 4, fontWeight: 800, color: "#08397C" }}
              >
                Change Password
              </Typography>
              <Grid2 container spacing={2}>
                <Grid2 size={{ xs: 12 }}>
                  <TextField
                    label='New Password'
                    fullWidth
                    name='newPassword'
                    value={passwordValues.newPassword}
                    onChange={handlePasswordInputChange}
                    type='password'
                  />
                </Grid2>
                <Grid2 size={{ xs: 12 }}>
                  <TextField
                    label='Confirm Password'
                    fullWidth
                    name='confirmPassword'
                    value={passwordValues.confirmPassword}
                    onChange={handlePasswordInputChange}
                    type='password'
                  />
                </Grid2>
              </Grid2>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "1.5rem",
                }}
              >
                <Button
                  variant='outlined'
                  onClick={handleCloseChangePasswordModal}
                  sx={{ fontWeight: 600 }}
                >
                  Back
                </Button>
                <Button
                  variant='contained'
                  sx={{
                    backgroundColor: "#CA031B",
                    color: "#FFF",
                    fontWeight: 600,
                  }}
                  onClick={handleSaveNewPassword}
                >
                  Save Changes
                </Button>
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
                    No, Keep Editing
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
                    Yes, Discard
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
        </Box>
      </Box>
    </>
  );
};

export default Profile;
