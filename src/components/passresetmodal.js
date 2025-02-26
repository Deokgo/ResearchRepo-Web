import React, { useState } from "react";
import axios from "axios";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import OtpModal from "./otpmodal";
import { useModalContext } from "../context/modalcontext";

const PasswordResetModal = () => {
  const { isPassresetModalOpen, closePassresetModal } = useModalContext();
  const [email, setEmail] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formValues, setFormValues] = useState({
    email: "",
    newPassword: "",
    confirmPassword: "",
  });

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "40rem",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 5,
    borderRadius: "8px",
    textAlign: 'center'
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // First check if email exists
      const checkResponse = await axios.get(
        `/accounts/check_email?email=${formValues.email}`
      );

      if (!checkResponse.data.exists) {
        setError("Email not found in our records.");
        return;
      }

      // If email exists, send OTP
      await axios.post("/auth/send_otp", {
        email: formValues.email,
        isPasswordReset: true,
      });
      setShowOtpModal(true);
    } catch (error) {
      setError(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Error sending OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerified = (verified) => {
    setIsOtpVerified(verified);
    setShowOtpModal(false);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Add password validation
    if (formValues.newPassword !== formValues.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("/auth/reset_password", {
        email: formValues.email,
        newPassword: formValues.newPassword,
      });

      if (response.status === 200) {
        alert("Password reset successful!");
        closePassresetModal();
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Error resetting password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  return (
    <>
      <Modal open={isPassresetModalOpen} onClose={closePassresetModal}>
        <Box 
          sx={{
            ...modalStyle,
            maxHeight: "90vh", // Limit the modal height to 90% of the viewport height
            overflowY: "auto", // Enable vertical scrolling when content overflows
          }}
        >
          <Typography
            variant='h6'
            color='#0A438F'
            fontWeight='500'
            sx={{
              mb: 1,
              textAlign: { xs: "center", md: "bottom" },
              fontSize: {
                xs: "clamp(0.5rem, 2vw, 0.5rem)",
                sm: "clamp(0.75rem, 3.5vw, 0.75rem)",
                md: "clamp(1rem, 4vw, 1rem)",
              },
            }}
          >
            Mapúa MCL Research Repository
          </Typography>
          <Typography
           variant='h2'
           color='#F40824'
           fontWeight='700'
           paddingBottom={3}
           sx={{
             textAlign: { xs: "center", md: "bottom" },
             fontSize: {
               xs: "clamp(1rem, 2vw, 1rem)",
               sm: "clamp(1.5rem, 3.5vw, 1.5rem)",
               md: "clamp(2.5rem, 3vw, 2.5rem)",
             },
           }}
          >
            Password Reset
          </Typography>

          {!isOtpVerified ? (
            <form onSubmit={handleEmailSubmit}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  mx: { xs: 2, sm: 4 }, // Responsive horizontal margin
                }}
              >
                <TextField
                  label='Email'
                  fullWidth
                  name='email'
                  type='email'
                  value={formValues.email}
                  onChange={handleChange}
                  margin='normal'
                  variant='outlined'
                  error={Boolean(error)}
                  helperText={error}
                  sx={{
                    fontSize: {
                      xs: "0.75rem",
                      md: "0.75rem",
                      lg: "0.8rem",
                    },
                    width: { xs: "90%", sm: "80%", md: "70%" }, // Responsive width
                    margin: "1 auto", // Center the TextField
                  }}
                />
                <Button
                  variant='contained'
                  type='submit'
                  sx={{
                    m: 2,
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
                  {loading ? "Sending OTP..." : "Send OTP"}
                </Button>
              </Box>
            </form>
          ) : (
            <form onSubmit={handlePasswordSubmit}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  mx: { xs: 2, sm: 4 }, // Responsive horizontal margin
                }}
              >
                <TextField
                  label='New Password'
                  fullWidth
                  name='newPassword'
                  type={showPassword ? "text" : "password"}
                  value={formValues.newPassword}
                  onChange={handleChange}
                  margin='normal'
                  variant='outlined'
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  label='Confirm Password'
                  fullWidth
                  name='confirmPassword'
                  type={showConfirmPassword ? "text" : "password"}
                  value={formValues.confirmPassword}
                  onChange={handleChange}
                  margin='normal'
                  variant='outlined'
                  error={Boolean(error)}
                  helperText={error}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
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
                <Button
                  type='submit'
                  variant='contained'
                  disabled={loading}
                  sx={{
                    mt: 2,
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
                  {loading ? "Updating..." : "Update Password"}
                </Button>
              </Box>
            </form>
          )}
        </Box>
      </Modal>

      <OtpModal
        open={showOtpModal}
        onClose={() => setShowOtpModal(false)}
        email={formValues.email}
        onVerify={handleOtpVerified}
        isPasswordReset={true}
      />
    </>
  );
};

export default PasswordResetModal;
