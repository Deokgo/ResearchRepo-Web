import React, { useState } from "react";
import { Box, Button, TextField, Typography, Modal } from "@mui/material";
import { useModalContext } from "./modalcontext";
import { Link } from "react-router-dom";

const PasswordResetModal = () => {
  const { isPassresetModalOpen, closePassresetModal, openLoginModal } =
    useModalContext();

  const [formValues, setFormValues] = useState({
    email: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

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

  // Handle form submission
  const handleReset = async (e) => {
    e.preventDefault();
    
  };

  return (
    <>
      {/*Password Reset Modal*/}
      <Modal open={isPassresetModalOpen} onClose={closePassresetModal}>
        <Box sx={modalStyle}>
          <Typography
            variant='h6'
            color='#0A438F'
            fontWeight='500'
            sx={{
              textAlign: { xs: "center", md: "bottom" },
            }}
          >
            Mapúa MCL Research Repository
          </Typography>
          <Typography
            variant='h3'
            color='#F40824'
            fontWeight='700'
            padding={3}
            sx={{
              textAlign: { xs: "center", md: "bottom" },
            }}
          >
            Password Reset
          </Typography>
          <form onSubmit={handleReset}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginLeft: "4rem",
                marginRight: "4rem",
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
              />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  marginTop: "20px",
                }}
              >
                <Typography sx={{ marginTop: "20px" }}>
                  Did not receive the OTP?{" "}
                    <a
                        href='#'
                        onClick={(e) => {
                        e.preventDefault();
                        }}
                        style={{ color: "#3393EA" }}
                    >
                    Resend OTP
                    </a>
                </Typography>
                <Button
                  type='submit'
                  fullWidth
                  variant='contained'
                  sx={{
                    maxWidth: "200px",
                    marginTop: "20px",
                    padding: "15px",
                    backgroundColor: "#EC1F28",
                  }}
                >
                  Send OTP
                </Button>
              </Box>
            </Box>
          </form>
        </Box>
      </Modal>
    </>
  );
};

export default PasswordResetModal;
