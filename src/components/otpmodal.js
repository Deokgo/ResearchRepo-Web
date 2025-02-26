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

const OtpModal = ({
  email,
  onVerify,
  open,
  onClose,
  isPasswordReset = false,
  formData = null,
}) => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const inputRefs = useRef([]);
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
    console.log("OtpModal Props:", { email, open, isPasswordReset });
    if (!open) return;

    // Only start the timer, don't send OTP (it's already sent by SignupModal)
    startTimer();

    return () => {
      clearInterval(intervalRef.current);
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

   // Handles digit input
   const handleChange = (index, e) => {
    const value = e.target.value.replace(/\D/, ""); // Allow only numbers
    if (!value) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move focus to the next input field if available
    if (index < 5 && value) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handles backspace and arrow navigation
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const newOtp = [...otp];
      newOtp[index - 1] = "";
      setOtp(newOtp);
      inputRefs.current[index - 1].focus();
    }
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
    if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const verifyOtp = async () => {
    const otpCode = otp.join(""); // Combine all digits
    if (loading || timer === 0) return;

    setLoading(true);
    try {
      const verifyResponse = await axios.post(OTP_VERIFY_API, { email, otp: otpCode });

      if (verifyResponse.status === 200) {
        setIsVerified(true);

        // Check if formData prop exists (for signup case)
        if (formData !== null) {
          try {
            const signupResponse = await axios.post("/auth/signup", formData);
            if (
              signupResponse.status === 200 ||
              signupResponse.status === 201
            ) {
              // Call onVerify with the signup response data
              onVerify(true, signupResponse.data);

              // Close this modal immediately after successful verification
              onClose();
            }
          } catch (error) {
            setErrorMessage(
              error.response?.data?.error ||
                "Failed to create account. Please try again."
            );
          }
        } else {
          // For password reset or other cases
          onVerify(true);
          onClose();
        }
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Verification failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    if (resendLoading) {
      console.log("Resend already in progress, exiting...");
      return;
    }
  
    setResendLoading(true);
    setResendClicked(true);
  
  
    try {
      const response = await axios.post(OTP_GENERATE_API, {
        email,
        isPasswordReset: isPasswordReset,
      });
  
      console.log("OTP resend response:", response.data);
  
      setErrorMessage("");
      startTimer();
    } catch (error) {
      console.error("Error resending OTP:", error);
  
      setErrorMessage(
        error.response?.data?.error || "Failed to resend OTP. Please try again."
      );
    } finally {
      console.log("Resetting resendLoading...");
      setResendLoading(false);
    }
  };
  

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? `0${secs}` : secs}`;
  };

  return (
    <Modal open={open}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", sm: "80%", md: "600px" }, // Responsive width
          bgcolor: "background.paper",
          boxShadow: 24,
          p: { xs: 2, sm: 3, md: 4 }, // Responsive padding
          borderRadius: "10px",
          textAlign: "center", // Center all text inside this Box
        }}
      >
        <Typography 
        variant='h2'
            color='#08397C'
            fontWeight='700'
            sx={{
              py: 0.5,
              pb: 1.5,
              textAlign: { xs: "center", md: "bottom" },
              fontSize: {
                xs: "clamp(1rem, 2vw, 1rem)",
                sm: "clamp(1.5rem, 3.5vw, 1.5rem)",
                md: "clamp(2rem, 4vw, 2rem)",
              },
            }}>
          Verify your Email Address
        </Typography>
        <Typography 
        sx={{
          fontFamily: "Montserrat, sans-serif",
          color: "#666",
          mt: 1,
      }}>
          Please enter the 6-digit verification code that was sent to <strong>{email}</strong>
        </Typography>
        <Box display="flex" justifyContent="center" gap={1} mt={2}>
          {otp.map((digit, index) => (
            <TextField
              key={index}
              inputRef={(el) => (inputRefs.current[index] = el)}
              value={digit}
              onChange={(e) => handleChange(index, e)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              variant="outlined"
              inputProps={{
                maxLength: 1,
                style: { textAlign: "center", fontSize: "1.5rem", fontWeight: 600 },
              }}
              sx={{ width: "4rem" }}
            />
          ))}
        </Box>
        {!isVerified && (
          <Typography 
          sx={{
            fontFamily: "Montserrat, sans-serif",
            fontSize: {
              xs: "0.75rem",
              md: "0.75rem",
              lg: "0.8rem",
              },
            color: "#F40824",
            mt: 1,
          }}>Resend verification code in <strong>{formatTime(timer)}</strong></Typography>
        )}

        {isVerified && (
          <Typography color='success.main' sx={{ mt: 1 }}>
            OTP Verified Successfully!
          </Typography>
        )}

        {errorMessage && (
          <Typography color='error' sx={{ mt: 1 }}>
            {errorMessage}
          </Typography>
        )}

        {timer === 0 && !isVerified && (
          <Typography color='error' sx={{ mt: 1 }}>
            OTP Expired. Please request a new one.
          </Typography>
        )}

        {!resendClicked && (
          <Box sx={{ mt: 2, position: "relative", textAlign: "center" }}>
            <Button
              onClick={verifyOtp}
              variant='contained'
              color='primary'
              disabled={loading || timer === 0}
              sx={{
                mt: 2,
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
            variant='text'
            color='primary'
            fullWidth
            disabled={resendLoading}
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
            {resendLoading ? "Resending..." : "Resend OTP"}
          </Button>
        )}

        <Button
          onClick={() => {
            onClose();
            setOtp(new Array(6).fill(""));
            setErrorMessage("");
            setIsVerified(false);
          }}
          variant='text'
          color='secondary'
          fullWidth
          sx={{
            color: "#CA031B",
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 600,
            textTransform: "none",
            fontSize: { xs: "0.875rem", md: "1rem" },
            padding: { xs: "0.5rem 1rem", md: "1.25rem" },
            borderRadius: "100px",
            maxHeight: "3rem",
            "&:hover": {
                color: "#A30417",
            },
            }}
        >
          Close
        </Button>
      </Box>
    </Modal>
  );
};

export default OtpModal;
