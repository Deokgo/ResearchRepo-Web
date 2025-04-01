import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import WarningIcon from "@mui/icons-material/Warning";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DownloadIcon from "@mui/icons-material/Download";
import api from "../services/api";

const BulkUploadPaperModal = ({ isOpen, handleClose, onPapersAdded }) => {
  const [file, setFile] = useState(null);
  const [hasFile, setHasFile] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");
  const [isWarningDialogOpen, setIsWarningDialogOpen] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile);
      setHasFile(true);
    } else {
      setWarningMessage("Please upload a valid CSV file.");
      setIsWarningDialogOpen(true);
      setFile(null);
      setHasFile(false);
    }
  };

  const handleUpload = async () => {
    try {
      if (!file) {
        setWarningMessage("Please select a CSV file to upload.");
        setIsWarningDialogOpen(true);
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post("/paper/bulk_upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccessMessage("Papers uploaded successfully!");
      setIsSuccessDialogOpen(true);
      onPapersAdded();
      handleClose();
    } catch (error) {
      setWarningMessage(
        error.response?.data?.error || "Error uploading papers"
      );
      setIsWarningDialogOpen(true);
    }
  };

  const handleFileRemove = () => {
    setFile(null);
    setHasFile(false);
  };

  const handleDownloadTemplate = async () => {
    try {
      const response = await api.get("/paper/get_template", {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "paper_upload_template.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      setWarningMessage("Error downloading template");
      setIsWarningDialogOpen(true);
    }
  };

  return (
    <>
      <Modal
        open={isOpen}
        onClose={handleClose}
        aria-labelledby='bulk-upload-modal'
        aria-describedby='bulk-upload-papers-description'
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            borderRadius: "15px",
            boxShadow: 24,
            p: 4,
            width: { xs: "90%", sm: "80%", md: "40%", lg: "30%" },
            maxWidth: "450px",
            minHeight: "300px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography
            variant='h3'
            color='#08397C'
            fontWeight='700'
            mb={4}
            sx={{
              textAlign: { xs: "left", md: "bottom" },
              fontSize: {
                xs: "clamp(1rem, 2vw, 1rem)",
                sm: "clamp(1rem, 3.5vw, 1rem)",
                md: "clamp(1.5rem, 4vw, 1.75rem)",
              },
            }}
          >
            Bulk Upload Papers
          </Typography>

          <Button
            variant='outlined'
            onClick={handleDownloadTemplate}
            startIcon={<DownloadIcon />}
            sx={{
              mb: 3,
              color: "#08397C",
              borderColor: "#08397C",
              fontFamily: "Montserrat, sans-serif",
              textTransform: "none",
              fontWeight: 600,
              "&:hover": {
                borderColor: "#072d61",
                backgroundColor: "rgba(8, 57, 124, 0.04)",
              },
            }}
          >
            Download CSV Template
          </Button>

          <Box
            sx={{
              width: "100%",
              height: "150px",
              border: "2px dashed #08397C",
              borderRadius: "15px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              backgroundColor: "rgba(8, 57, 124, 0.04)",
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "rgba(8, 57, 124, 0.08)",
              },
              mb: 1,
            }}
            component='label'
          >
            <input
              type='file'
              accept='.csv'
              hidden
              onChange={handleFileChange}
            />
            <CloudUploadIcon sx={{ fontSize: 40, color: "#08397C", mb: 1 }} />
            <Typography
              sx={{
                fontFamily: "Montserrat, sans-serif",
                color: "#08397C",
                fontWeight: 500,
                textAlign: "center",
              }}
            >
              {hasFile ? file.name : "Click to upload CSV file"}
            </Typography>
            <Typography
              variant='body2'
              sx={{
                fontFamily: "Montserrat, sans-serif",
                color: "#666",
                mt: 0.5,
              }}
            >
              {hasFile ? "File selected" : "Only CSV files are accepted"}
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 2,
              mt: "auto",
              pt: 2,
            }}
          >
            <Button
              variant='text'
              onClick={(e) => {
                handleFileRemove();
                handleClose();
              }}
              sx={{
                mb: 1,
                color: "#CA031B",
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 600,
                textTransform: "none",
                borderRadius: "8px",
                padding: "5px 15px",
                "&:hover": {
                  color: "#A00216",
                },
              }}
            >
              Cancel
            </Button>
            <Button
              variant='contained'
              onClick={handleUpload}
              disabled={!hasFile}
              sx={{
                backgroundColor: "#08397C",
                color: "#FFF",
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 600,
                textTransform: "none",
                borderRadius: "100px",
                px: 3,
                "&:hover": {
                  backgroundColor: "#072d61",
                },
                "&:disabled": {
                  backgroundColor: "#ccc",
                },
              }}
            >
              Upload Papers
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Warning Dialog */}
      <Dialog
        open={isWarningDialogOpen}
        onClose={() => setIsWarningDialogOpen(false)}
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
            color: "#CA031B",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Box
            component='span'
            sx={{
              backgroundColor: "#FFEAEA",
              borderRadius: "50%",
              padding: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <WarningIcon />
          </Box>
          Warning
        </DialogTitle>
        <DialogContent>
          <Typography
            sx={{
              fontFamily: "Montserrat, sans-serif",
              color: "#666",
              mt: 1,
            }}
          >
            {warningMessage}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setIsWarningDialogOpen(false)}
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
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Dialog */}
      <Dialog
        open={isSuccessDialogOpen}
        onClose={() => setIsSuccessDialogOpen(false)}
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
            color: "#4CAF50",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Box
            component='span'
            sx={{
              backgroundColor: "#E8F5E9",
              borderRadius: "50%",
              padding: "8px",
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
            {successMessage}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setIsSuccessDialogOpen(false)}
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
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BulkUploadPaperModal;
