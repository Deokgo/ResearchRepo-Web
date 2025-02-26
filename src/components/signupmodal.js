// signupmodal.js
import React, { useEffect, useState } from "react";
import OtpModal from "./otpmodal";
import { useModalContext } from "../context/modalcontext"; // Import the ModalContext
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import {
  Box,
  Button,
  IconButton,
  TextField,
  Typography,
  Modal,
  Grid2,
  InputAdornment,
  Divider,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import {
  Clear as ClearIcon,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import api from "../services/api";
const SignUpModal = () => {
  const { isSignupModalOpen, closeSignupModal, openLoginModal } =
    useModalContext(); // Use context
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [openErrorDialog, setOpenErrorDialog] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    institution: "",
    email: "",
    reason: "",
    password: "",
    confirmPassword: "",
    middleName: "",
    suffix: "",
  });

  const resetFields = () => {
    setFormData({
      firstName: "",
      lastName: "",
      institution: "",
      email: "",
      reason: "",
      password: "",
      confirmPassword: "",
      middleName: "",
      suffix: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const clearField = (fieldName) => {
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: "",
    }));
  };

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "40rem",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: "8px",
  };
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const [isModalOpen, setIsModalOpen] = useState(false); // Controls OTP modal visibility
  const [isVerified, setIsVerified] = useState(false); // Tracks if OTP is verified
  const [signupTriggered, setSignupTriggered] = useState(false);

  const handleVerification = async (verified, signupData) => {
    if (verified && signupData) {
      try {
        // Close both modals
        setIsModalOpen(false); // Close OTP modal

        // Reset all states
        resetFields();
        setPasswordErrors([]);
        setReasonError("");
        setIsVerified(false);
        setSignupTriggered(false);

        // Show success message and open login modal
        setIsSuccessDialogOpen(true);
      } catch (error) {
        console.error("Error during verification handling:", error);
        setOpenErrorDialog(true);
      }
    }
  };

  const validatePassword = (password) => {
    const errors = [];

    // Always check length first
    if (password.length < 8) {
      errors.push("Must be at least 8 characters long");
      return errors; // Return early if length requirement isn't met
    }

    // Only check other requirements if length is 8 or more
    if (!/[A-Z]/.test(password)) {
      errors.push("Must contain an uppercase letter");
    }
    if (!/[a-z]/.test(password)) {
      errors.push("Must contain a lowercase letter");
    }
    if (!/[0-9]/.test(password)) {
      errors.push("Must contain a number");
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push("Must contain a special character");
    }

    return errors;
  };
  const [reasonError, setReasonError] = useState("");

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const [institutionError, setInstitutionError] = useState("");

  const handleSignup = async (e) => {
    if (e) e.preventDefault();

    // Reset errors
    setPasswordErrors([]);
    setReasonError("");
    setInstitutionError("");

    // Validate institution and reason
    if (!formData.institution || !formData.institution.trim()) {
      setInstitutionError("Institution is required");
      return;
    }

    if (!formData.reason || !formData.reason.trim()) {
      setReasonError("Reason is required");
      return;
    }

    // Validate email format
    if (!validateEmail(formData.email)) {
      alert("Invalid email format.");
      return;
    }

    try {
      // Check if email exists
      const emailCheckResponse = await api.get(
        `/accounts/check_email?email=${formData.email}`
      );

      if (emailCheckResponse.data.exists) {
        alert("This email is already registered.");
        return;
      }

      // Validate password
      const passwordValidationErrors = validatePassword(formData.password);
      if (passwordValidationErrors.length > 0) {
        setPasswordErrors(passwordValidationErrors);
        return;
      }

      // Verify passwords match
      if (formData.password !== formData.confirmPassword) {
        setPasswordErrors(["Passwords do not match"]);
        return;
      }

      setIsSubmitting(true);

      // Send OTP
      const otpResponse = await api.post("/auth/send_otp", {
        email: formData.email,
        isPasswordReset: false,
      });

      if (otpResponse.status === 200) {
        setSignupTriggered(true);
        setIsModalOpen(true);
      }
    } catch (error) {
      if (error.response) {
        alert(
          error.response.data.error || "An error occurred. Please try again."
        );
      } else {
        alert("Network error. Please try again.");
      }
    }
  };

  // Create a handler for modal close
  const handleModalClose = () => {
    resetFields(); // Clear all fields
    setPasswordErrors([]); // Clear password errors
    setReasonError(""); // Clear reason error
    setIsVerified(false); // Reset verification status
    setSignupTriggered(false); // Reset signup trigger
    setIsModalOpen(false); // Close OTP modal
    closeSignupModal(); // Close signup modal
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
    "& .MuiInputLabel-root": {
      fontSize: {
        xs: "0.6em", // Mobile
        sm: "0.7rem", // Small devices
        md: "0.8rem", // Medium devices
        lg: "0.9rem", // Large devices
      },
    },
  });

  useEffect(() => {
    if (!isModalOpen) {
      setIsSubmitting(false);
    }
  });

  return (
    <>
      <Modal open={isSignupModalOpen} onClose={handleModalClose}>
        <Box
          sx={{
            ...modalStyle,
            maxHeight: "95vh", // Limit the modal height to 90% of the viewport height
            overflowY: "auto", // Enable vertical scrolling when content overflows
          }}
        >
          <Typography
            variant='h6'
            color='#0A438F'
            fontWeight='500'
            sx={{
              textAlign: { xs: "center", md: "bottom" },
              fontSize: {
                xs: "clamp(0.5rem, 2vw, 0.5rem)",
                sm: "clamp(0.75rem, 3.5vw, 0.75rem)",
                md: "clamp(0.9rem, 4vw, 0.9rem)",
              },
            }}
          >
            Mapúa MCL Research Repository
          </Typography>
          <Typography
            variant='h2'
            color='#F40824'
            fontWeight='700'
            sx={{
              py: 0.5,
              pb: 1.5,
              textAlign: { xs: "center", md: "bottom" },
              fontSize: {
                xs: "clamp(1rem, 2vw, 1rem)",
                sm: "clamp(2rem, 3.5vw, 2rem)",
                md: "clamp(2.5rem, 4vw, 2.5rem)",
              },
            }}
          >
            Sign Up
          </Typography>
          <form onSubmit={handleSignup}>
            <Box
              sx={{
                width: "auto",
                justifyContent: "center",
                padding: "1em",
              }}
            >
              <Grid2 container spacing={{ xs: 0, md: 2 }}>
                <Grid2 item size={{ xs: 12, md: 4 }}>
                  <TextField
                    fullWidth
                    label='First Name'
                    name='firstName'
                    value={formData.firstName}
                    onChange={handleChange}
                    variant='outlined'
                    sx={createTextFieldStyles()}
                  ></TextField>
                </Grid2>
                <Grid2 item size={{ xs: 12, md: 4 }}>
                  <TextField
                    fullWidth
                    label='Middle Initial'
                    name='middleName'
                    value={formData.middleName}
                    onChange={handleChange}
                    variant='outlined'
                    sx={createTextFieldStyles()}
                  />
                </Grid2>
                <Grid2 item size={{ xs: 12, md: 4 }}>
                  <TextField
                    fullWidth
                    label='Last Name'
                    name='lastName'
                    value={formData.lastName}
                    onChange={handleChange}
                    variant='outlined'
                    sx={createTextFieldStyles()}
                  ></TextField>
                </Grid2>
                <Grid2 item size={{ xs: 12, md: 4 }}>
                  <TextField
                    fullWidth
                    label='Suffix'
                    name='suffix'
                    value={formData.suffix}
                    onChange={handleChange}
                    variant='outlined'
                    sx={createTextFieldStyles()}
                  ></TextField>
                </Grid2>
                <Grid2 item size={{ xs: 12, md: 8 }}>
                  <TextField
                    fullWidth
                    label='Email'
                    name='email'
                    type='email'
                    value={formData.email}
                    onChange={handleChange}
                    variant='outlined'
                    sx={createTextFieldStyles()}
                  ></TextField>
                </Grid2>
              </Grid2>

              <TextField
                fullWidth
                label='Institution'
                name='institution'
                type='institution'
                value={formData.institution}
                onChange={handleChange}
                margin='normal'
                variant='outlined'
                sx={createTextFieldStyles()}
                required
                error={Boolean(institutionError)}
                helperText={institutionError}
              />
              <TextField
                fullWidth
                label='Reason'
                name='reason'
                type='reason'
                value={formData.reason}
                onChange={handleChange}
                margin='normal'
                multiline
                maxRows={1}
                variant='outlined'
                required
                error={Boolean(reasonError)}
                sx={createTextFieldStyles()}
                helperText={reasonError || `${formData.reason.length}/${100}`}
                inputProps={{
                  maxLength: 100,
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton onClick={() => clearField("reason")}>
                        <ClearIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              ></TextField>
              <Divider orientation='horizontal' flexItem />
              <Grid2 container spacing={{ xs: 0, md: 2 }}>
                <Grid2 size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label='Password'
                    name='password'
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    sx={createTextFieldStyles()}
                    onChange={(e) => {
                      handleChange(e);
                      // Update password errors in real-time
                      setPasswordErrors(validatePassword(e.target.value));
                    }}
                    margin='normal'
                    variant='outlined'
                    error={
                      passwordErrors.length > 0 && formData.password.length >= 8
                    }
                    helperText={
                      !formData.password
                        ? "Enter your password"
                        : formData.password.length < 8
                        ? "Password must contain: 8+ characters, uppercase, lowercase, number, and special character"
                        : passwordErrors.length > 0
                        ? passwordErrors.join(", ")
                        : "Password meets all requirements"
                    }
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton onClick={togglePasswordVisibility}>
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid2>
                <Grid2 size={{ xs: 12, md: 6 }}>
                  <TextField
                    fullWidth
                    label='Confirm Password'
                    name='confirmPassword'
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    margin='normal'
                    variant='outlined'
                    sx={createTextFieldStyles()}
                    error={
                      formData.password.length >= 8 &&
                      formData.confirmPassword.length >= 8 &&
                      formData.password !== formData.confirmPassword
                    }
                    helperText={
                      formData.password.length >= 8 &&
                      formData.confirmPassword.length >= 8 &&
                      formData.password !== formData.confirmPassword
                        ? "Passwords do not match"
                        : ""
                    }
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton onClick={toggleConfirmPasswordVisibility}>
                            {showConfirmPassword ? (
                              <Visibility />
                            ) : (
                              <VisibilityOff />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid2>
              </Grid2>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  p: 1,
                }}
              >
                <Button
                  variant='contained'
                  type='submit'
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
                  {isSubmitting ? (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <CircularProgress size={20} color='#08397C' />
                      loading...
                    </Box>
                  ) : (
                    "Create Account"
                  )}
                </Button>
                <Typography
                  sx={{
                    mt: 1,
                    textAlign: { xs: "center", md: "bottom" },
                    fontFamily: "Montserrat, sans-serif",
                    fontSize: {
                      xs: "clamp(0.5rem, 2vw, 0.5rem)",
                      sm: "clamp(0.75rem, 3.5vw, 0.75rem)",
                      md: "clamp(0.9rem, 3vw, 0.9rem)",
                    },
                  }}
                >
                  Already a user?{" "}
                  <a
                    href='#'
                    onClick={(e) => {
                      e.preventDefault();
                      resetFields();
                      closeSignupModal();
                      openLoginModal();
                    }}
                    style={{
                      color: "#08397C",
                      fontFamily: "Montserrat, sans-serif",
                    }}
                  >
                    Login
                  </a>
                </Typography>
                <OtpModal
                  open={isModalOpen}
                  email={formData.email}
                  formData={formData}
                  onVerify={handleVerification}
                  onClose={() => setIsModalOpen(false)}
                  isPasswordReset={false}
                />
              </Box>
            </Box>
            {/* Add loading overlay */}
            {isSubmitting && (
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "rgba(255, 255, 255, 0.7)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 9999,
                }}
              >
                <Box sx={{ textAlign: "center" }}>
                  <CircularProgress />
                  <Typography sx={{ mt: 2, fontSize: "1.25rem" }}>
                    Sending OTP...
                  </Typography>
                </Box>
              </Box>
            )}
          </form>
          {/* Add Success Dialog */}
          <Dialog
            open={isSuccessDialogOpen}
            PaperProps={{
              sx: {
                borderRadius: "15px",
                padding: "1rem",
              },
            }}
          >
            <DialogTitle
              sx={{
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 600,
                color: "#008000",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Box
                component='span'
                sx={{
                  backgroundColor: "#E8F5E9",
                  borderRadius: "75%",
                  padding: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CheckCircleIcon />
              </Box>
              Success
            </DialogTitle>
            <DialogContent>
              <Typography
                sx={{
                  fontFamily: "Montserrat, sans-serif",
                  color: "#666",
                  mt: 1,
                }}
              >
                Your account has been created successfully!
              </Typography>
            </DialogContent>
            <DialogActions sx={{ padding: "1rem" }}>
              <Button
                onClick={() => {
                  setIsSuccessDialogOpen(false);
                  closeSignupModal();
                  openLoginModal();
                }}
                sx={{
                  backgroundColor: "#08397C",
                  color: "#FFF",
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: 600,
                  textTransform: "none",
                  borderRadius: "100px",
                  padding: "0.75rem",
                  "&:hover": {
                    backgroundColor: "#072d61",
                  },
                }}
              >
                Proceed
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog
            open={openErrorDialog}
            onClose={() => setOpenErrorDialog(false)}
            PaperProps={{
              sx: {
                borderRadius: "15px",
                padding: "1rem",
              },
            }}
          >
            <DialogTitle
              sx={{
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 600,
                color: "#008000",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Box
                component='span'
                sx={{
                  backgroundColor: "#E8F5E9",
                  borderRadius: "75%",
                  padding: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <PriorityHighIcon />
              </Box>
              &nbsp;Error
            </DialogTitle>
            <DialogContent>
              <DialogContentText
                sx={{
                  fontFamily: "Montserrat, sans-serif",
                  color: "error.main",
                }}
              >
                There was an error completing your registration. Please try
                again.
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
        </Box>
      </Modal>
    </>
  );
};

export default SignUpModal;
