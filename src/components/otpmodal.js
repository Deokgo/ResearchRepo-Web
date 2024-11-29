import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";

const OtpModal = ({ email, formData, onVerify, open, onClose }) => {
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(300); // 5 minutes = 300 seconds
  const [isVerified, setIsVerified] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendClicked, setResendClicked] = useState(false);
  const intervalRef = useRef(null);

  // API endpoint URLs
  const OTP_GENERATE_API = "/auth/send_otp";
  const OTP_VERIFY_API = "/auth/verify_otp";

  // Fetch OTP on modal open
  useEffect(() => {
    if (!open) return;

    const fetchOtp = async () => {
      try {
        const response = await axios.post(OTP_GENERATE_API, { email });
        console.log("Generated OTP (for demo purposes):", response.data.otp);

        // Start timer
        startTimer();
      } catch (error) {
        setErrorMessage("Failed to generate OTP. Please try again.");
      }
    };

    fetchOtp();

    return () => {
      clearInterval(intervalRef.current); // Cleanup timer
    };
  }, [email, open]);

  const startTimer = () => {
    setTimer(300); // Reset timer to 5 minutes
    clearInterval(intervalRef.current); // Clear any existing interval
    setResendClicked(false); // Reset resendClicked state

    intervalRef.current = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(intervalRef.current);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const verifyOtp = async () => {
    if (loading || timer === 0) return;

    setLoading(true);
    try {
      const verifyResponse = await axios.post(OTP_VERIFY_API, { email, otp });

      if (verifyResponse.status === 200) {
        const signupResponse = await axios.post("/auth/signup", {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          institution: formData.institution,
          reason: formData.reason,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          middleName: formData.middleName,
          suffix: formData.suffix,
        });

        if (signupResponse.status === 201) {
          setIsVerified(true);
          onVerify(true, signupResponse.data); // Pass the signup response data
          setErrorMessage("");
          onClose(); // Close the OTP modal after successful signup
        }
      }
    } catch (error) {
      if (error.response?.data?.error) {
        setErrorMessage(error.response.data.error);
      } else if (error.response?.data?.message) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("Verification failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    if (resendLoading) return;

    setResendLoading(true);
    setResendClicked(true); // Hide the Verify button
    try {
      await axios.post(OTP_GENERATE_API, { email });
      setErrorMessage("");
      startTimer();
    } catch (error) {
      setErrorMessage("Failed to resend OTP. Please try again.");
    } finally {
      setResendLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? `0${secs}` : secs}`;
  };

  return (
    <Modal open={open} onClose={onClose}>
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
      borderRadius: 2,
      textAlign: "center", // Center all text inside this Box
    }}
  >
    <Typography variant="h6" component="h2" gutterBottom>
      Verify your Email Address
    </Typography>
    <Typography>
      Please enter the 6-digit verification code that was sent to {email}
    </Typography>
    <TextField
      label="Enter OTP"
      variant="outlined"
      fullWidth
      value={otp}
      onChange={handleOtpChange}
      inputProps={{ maxLength: 6 }}
      margin="normal"
      placeholder="Enter 6-digit OTP"
      sx={{ textAlign: "center" }} // Align input placeholder and label
    />
    <Typography>
      Resend verification code in {formatTime(timer)}
    </Typography>

    {isVerified && (
      <Typography color="success.main" sx={{ mt: 1 }}>
        OTP Verified Successfully!
      </Typography>
    )}

    {errorMessage && (
      <Typography color="error" sx={{ mt: 1 }}>
        {errorMessage}
      </Typography>
    )}

    {timer === 0 && !isVerified && (
      <Typography color="error" sx={{ mt: 1 }}>
        OTP Expired. Please request a new one.
      </Typography>
    )}

    {!resendClicked && (
      <Box sx={{ mt: 2, position: "relative", textAlign: "center" }}>
        <Button
          onClick={verifyOtp}
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading || timer === 0}
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </Button>
        {loading && (
          <CircularProgress
            size={24}
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              marginTop: "-12px",
              marginLeft: "-12px",
            }}
          />
        )}
      </Box>
    )}

    {timer === 0 && (
      <Button
        onClick={resendOtp}
        variant="text"
        color="primary"
        fullWidth
        disabled={resendLoading}
        sx={{ mt: 2 }}
      >
        {resendLoading ? "Resending..." : "Resend OTP"}
      </Button>
    )}

    <Button
      onClick={onClose}
      variant="text"
      color="secondary"
      fullWidth
      sx={{ mt: 1 }}
    >
      Close
    </Button>
  </Box>
</Modal>
  );
};

export default OtpModal;
