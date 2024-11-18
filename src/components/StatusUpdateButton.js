import React, { useState } from "react";
import { Button, CircularProgress } from "@mui/material";
import axios from "axios";

const StatusUpdateButton = ({ apiUrl, statusToUpdate, disabled }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await axios.post(apiUrl, { status: statusToUpdate });
      if (response.status === 200) {
        setSuccess(true);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to update status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <Button
        variant="contained"
        color="primary"
        onClick={handleClick}
        disabled={loading || disabled} // Button is disabled based on loading state or if 'disabled' is true
        sx={{
          backgroundColor: "#d40821",
          color: "#FFF",
          fontFamily: "Montserrat, sans-serif",
          fontWeight: 600,
          textTransform: "none",
          fontSize: { xs: "0.875rem", md: "1.275rem" },
          padding: { xs: "0.5rem 1rem", md: "1.5rem" },
          marginTop: "1rem",
          width: "auto",
          borderRadius: "100px",
          maxHeight: "3rem",
          "&:hover": {
            backgroundColor: "#A30417",
            color: "#FFF",
          },
        }}
      >
        {loading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          `Update Status to: ${statusToUpdate}`
        )}
      </Button>
      {success && (
        <div style={{ color: "green", marginTop: "1rem" }}>
          Status updated successfully!
        </div>
      )}
      {error && <div style={{ color: "red", marginTop: "1rem" }}>{error}</div>}
    </div>
  );
};

export default StatusUpdateButton;
