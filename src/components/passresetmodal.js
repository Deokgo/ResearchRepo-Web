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
    width: { xs: "90%", sm: "80%", md: "600px" }, // Responsive width
    bgcolor: "background.paper",
    boxShadow: 24,
    p: { xs: 2, sm: 3, md: 4 }, // Responsive padding
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
          <Typography
            variant="h6"
            sx={{
              color: "#0A438F",
              fontWeight: "500",
              fontSize: { xs: "16px", sm: "18px", md: "20px" }, // Responsive font size
            }}
          >
            Mapúa MCL Research Repository
          </Typography>
          <Typography
            variant="h3"
            sx={{
              color: "#F40824",
              fontWeight: "700",
              padding: { xs: 1, sm: 2, md: 3 }, // Responsive padding
              fontSize: { xs: "24px", sm: "28px", md: "32px" }, // Responsive font size
              textAlign: "center",
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
                  label="Email"
                  fullWidth
                  name="email"
                  type="email"
                  value={formValues.email}
                  onChange={handleChange}
                  margin="normal"
                  variant="outlined"
                  error={Boolean(error)}
                  helperText={error}
                  sx={{
                    width: { xs: "90%", sm: "80%", md: "70%" }, // Responsive width
                    margin: "0 auto", // Center the TextField
                  }}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  sx={{
                    maxWidth: { xs: "150px", sm: "200px" }, // Responsive max width
                    marginTop: "20px",
                    padding: { xs: "10px", sm: "15px" }, // Responsive padding
                    fontSize: { xs: "14px", sm: "16px" }, // Responsive font size
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
                  mx: { xs: 2, sm: 4 }, // Responsive horizontal margin
                }}
              >
                <TextField
                  label="New Password"
                  fullWidth
                  name="newPassword"
                  type={showPassword ? "text" : "password"}
                  value={formValues.newPassword}
                  onChange={handleChange}
                  margin="normal"
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
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
                  label="Confirm Password"
                  fullWidth
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formValues.confirmPassword}
                  onChange={handleChange}
                  margin="normal"
                  variant="outlined"
                  error={Boolean(error)}
                  helperText={error}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
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
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  sx={{
                    maxWidth: { xs: "150px", sm: "200px" }, // Responsive max width
                    marginTop: "20px",
                    padding: { xs: "10px", sm: "15px" }, // Responsive padding
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
