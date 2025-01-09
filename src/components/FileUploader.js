import { Box, Button, IconButton } from "@mui/material";
import React, { useRef, useState } from "react";
import AttachmentIcon from "@mui/icons-material/Attachment";
import DeleteIcon from "@mui/icons-material/Delete";

// Add styles
const styles = {
  fileUploader: {
    width: "100%",
    maxWidth: "500px", // Adjust this value as needed
  },
  fileDiv: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: "4px",
    padding: "8px",
    "&.disabled": {
      backgroundColor: "#f5f5f5",
      cursor: "not-allowed",
    },
  },
  attachmentButton: {
    display: "flex",
    alignItems: "center",
    textTransform: "none",
    flex: 1,
  },
  fileName: {
    marginLeft: "8px",
    maxWidth: "300px", // Adjust this value as needed
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    fontSize: "0.90rem", // Default font size
    fontWeight: 700,
  },
};

function FileUploader(props) {
  const { accept, onFileSelect, onFileDelete, selectedFile, disabled } = props;
  const hiddenFileInput = useRef(null);

  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };

  const handleChange = (event) => {
    if (onFileSelect) {
      onFileSelect(event);
    }
  };

  const handleDelete = () => {
    if (onFileDelete) {
      onFileDelete();
    }
    hiddenFileInput.current.value = null;
  };

  return (
    <Box sx={styles.fileUploader}>
      <Box sx={styles.fileDiv} className={disabled ? "disabled" : ""}>
        <Button
          sx={styles.attachmentButton}
          onClick={handleClick}
          disabled={disabled}
        >
          <AttachmentIcon />
          <input
            type='file'
            id='actual-btn'
            accept={accept}
            ref={hiddenFileInput}
            onChange={handleChange}
            hidden
            disabled={disabled}
            data-testid='file-upload-input'
          />
          <Box sx={styles.fileName}>
            {selectedFile ? selectedFile.name : "CHOOSE FILE"}
          </Box>
        </Button>
        <IconButton
          aria-label='delete'
          disabled={disabled}
          color='primary'
          onClick={handleDelete}
        >
          <DeleteIcon />
        </IconButton>
      </Box>
    </Box>
  );
}

export default FileUploader;
