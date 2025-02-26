import React, { useState } from "react";
import { Button, CircularProgress } from "@mui/material";

const StatusUpdateButton = ({
  apiUrl,
  statusToUpdate,
  disabled,
  onStatusUpdate,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (onStatusUpdate) {
        await onStatusUpdate(statusToUpdate);
        setSuccess(true);
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Failed to update status. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <Button
        variant='contained'
        color='primary'
        onClick={handleClick}
        disabled={loading || disabled} // Button is disabled based on loading state or if 'disabled' is true
        sx={{
          backgroundColor: "#d40821",
          color: "#FFF",
          fontFamily: "Montserrat, sans-serif",
          fontWeight: 600,
          textTransform: "none",
          fontSize: { xs: "0.65rem", md: "0.8rem", lg: "1rem" },
          borderRadius: "100px",
          maxHeight: "3rem",
          "&:hover": {
            backgroundColor: "#A30417",
            color: "#FFF",
          },
        }}
      >
        {loading ? (
          <CircularProgress size={24} color='inherit' />
        ) : statusToUpdate === "COMPLETED" ? (
          "COMPLETED"
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
