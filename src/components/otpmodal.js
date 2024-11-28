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

const OtpModal = ({ email, onVerify, open, onClose }) => {
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(300); // 5 minutes = 300 seconds
  const [isVerified, setIsVerified] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
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
        intervalRef.current = setInterval(() => {
          setTimer((prevTimer) => {
            if (prevTimer <= 1) {
              clearInterval(intervalRef.current);
              return 0;
            }
            return prevTimer - 1;
          });
        }, 1000);
      } catch (error) {
        setErrorMessage("Failed to generate OTP. Please try again.");
      }
    };

    fetchOtp();

    return () => {
      clearInterval(intervalRef.current); // Cleanup timer
    };
  }, [email, open]);

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const verifyOtp = async () => {
    if (loading || timer === 0) return;
  
    setLoading(true);
    try {
      const response = await axios.post(OTP_VERIFY_API, { email, otp });
  
      if (response.status === 200 && response.data.message) {
        // OTP verified successfully
        setIsVerified(true);
        onVerify(true); // Notify parent component of success
        setErrorMessage("");
      } else {
        // In case the server returns 400 but no clear error
        setErrorMessage("Invalid OTP. Please try again.");
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage("Verification failed. Please try again.");
      }
    } finally {
      setLoading(false);
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
        }}
      >
        <Typography variant="h6" component="h2" gutterBottom>
          Verify OTP
        </Typography>
        <Typography>Email: {email}</Typography>
        <Typography>Time Left: {formatTime(timer)}</Typography>

        <TextField
          label="Enter OTP"
          variant="outlined"
          fullWidth
          value={otp}
          onChange={handleOtpChange}
          inputProps={{ maxLength: 6 }}
          margin="normal"
          placeholder="Enter 6-digit OTP"
        />

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

        <Box sx={{ mt: 2, position: "relative" }}>
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
