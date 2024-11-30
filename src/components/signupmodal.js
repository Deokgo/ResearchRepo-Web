// signupmodal.js
import React, { useState } from "react";
import OtpModal from "./otpmodal";
import { useModalContext } from "./modalcontext"; // Import the ModalContext
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
} from "@mui/material";
import {
  Clear as ClearIcon,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import axios from "axios";
const SignUpModal = () => {
  const { isSignupModalOpen, closeSignupModal, openLoginModal } =
    useModalContext(); // Use context
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState([]);
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
    width: "auto",
    height: "auto",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: "10px",
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
        closeSignupModal(); // Close signup modal

        // Reset all states
        resetFields();
        setPasswordErrors([]);
        setReasonError("");
        setIsVerified(false);
        setSignupTriggered(false);

        // Show success message and open login modal
        alert("Account created successfully! Please login to continue.");
        openLoginModal();
      } catch (error) {
        console.error("Error during verification handling:", error);
        alert(
          "There was an error completing your registration. Please try again."
        );
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
      const emailCheckResponse = await axios.get(
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

      // Send OTP
      const otpResponse = await axios.post("/auth/send_otp", {
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

  return (
    <>
      <Modal open={isSignupModalOpen} onClose={handleModalClose}>
        <Box sx={modalStyle}>
          <Typography
            variant='h6'
            color='#0A438F'
            fontWeight='500'
            sx={{
              textAlign: { xs: "center", md: "bottom" },
            }}
          >
            Mapúa MCL Research Repository
          </Typography>
          <Typography
            variant='h2'
            color='#F40824'
            fontWeight='700'
            paddingTop='1rem'
            sx={{
              textAlign: { xs: "center", md: "bottom" },
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
                    margin='normal'
                    variant='outlined'
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton onClick={() => clearField("firstName")}>
                            <ClearIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  ></TextField>
                </Grid2>
                <Grid2 item size={{ xs: 12, md: 4 }}>
                  <TextField
                    fullWidth
                    label='Middle Initial'
                    name='middleName'
                    value={formData.middleName}
                    onChange={handleChange}
                    margin='normal'
                    variant='outlined'
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton onClick={() => clearField("middleName")}>
                            <ClearIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid2>
                <Grid2 item size={{ xs: 12, md: 4 }}>
                  <TextField
                    fullWidth
                    label='Last Name'
                    name='lastName'
                    value={formData.lastName}
                    onChange={handleChange}
                    margin='normal'
                    variant='outlined'
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton onClick={() => clearField("lastName")}>
                            <ClearIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
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
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton onClick={() => clearField("suffix")}>
                            <ClearIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
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
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton onClick={() => clearField("email")}>
                            <ClearIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
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
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton onClick={() => clearField("institution")}>
                        <ClearIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
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
                            {showPassword ? <VisibilityOff /> : <Visibility />}
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
                              <VisibilityOff />
                            ) : (
                              <Visibility />
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
                  marginTop: "20px",
                }}
              >
                <Button
                  fullWidth
                  variant='contained'
                  type='submit'
                  sx={{
                    maxWidth: "200px",
                    marginTop: "20px",
                    padding: "15px",
                    backgroundColor: "#EC1F28",
                  }}
                >
                  Create Account
                </Button>
                <Typography sx={{ marginTop: "20px" }}>
                  Already a member?{" "}
                  <a
                    href='#'
                    onClick={(e) => {
                      e.preventDefault();
                      resetFields();
                      closeSignupModal();
                      openLoginModal();
                    }}
                    style={{ color: "#3393EA" }}
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
          </form>
        </Box>
      </Modal>
    </>
  );
};

export default SignUpModal;
