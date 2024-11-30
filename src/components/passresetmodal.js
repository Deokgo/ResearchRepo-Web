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
import { useModalContext } from "./modalcontext";

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
    width: 600,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: "10px",
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
        <Box sx={modalStyle}>
          <Typography variant='h6' color='#0A438F' fontWeight='500'>
            Mapúa MCL Research Repository
          </Typography>
          <Typography variant='h3' color='#F40824' fontWeight='700' padding={3}>
            Password Reset
          </Typography>

          {!isOtpVerified ? (
            <form onSubmit={handleEmailSubmit}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  mx: "4rem",
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
                />
                <Button
                  type='submit'
                  fullWidth
                  variant='contained'
                  disabled={loading}
                  sx={{
                    maxWidth: "200px",
                    marginTop: "20px",
                    padding: "15px",
                    backgroundColor: "#EC1F28",
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
                  mx: "4rem",
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
                  fullWidth
                  variant='contained'
                  disabled={loading}
                  sx={{
                    maxWidth: "200px",
                    marginTop: "20px",
                    padding: "15px",
                    backgroundColor: "#EC1F28",
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
