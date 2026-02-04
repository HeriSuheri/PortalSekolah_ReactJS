import React, { useState } from "react";
import { Snackbar, Alert, Button } from "@mui/material";

export default function ToastExample({
  open,
  setOpen,
  message,
  setMessage,
  severity,
  setSeverity,
  handleClose,
  // onCloseIcon,
}) {
  //   const [open, setOpen] = useState(false);
  //   const [message, setMessage] = useState("");
  //   const [severity, setSeverity] = useState("success"); // "success" | "error" | "warning" | "info"

  const handleClick = (type) => {
    setMessage(
      type === "success"
        ? "Siswa berhasil diarsipkan!"
        : "Terjadi error saat arsip!",
    );
    setSeverity(type);
    setOpen(true);
  };

  //   const handleClose = (event, reason) => {
  //     if (reason === "clickaway") return;
  //     setOpen(false);
  //   };

  return (
    <>
      {/* <Button variant="contained" onClick={() => handleClick("success")}>
        Simulasi Success
      </Button>
      <Button
        variant="outlined"
        color="error"
        onClick={() => handleClick("error")}
      >
        Simulasi Error
      </Button> */}

      <Snackbar
        open={open}
        autoHideDuration={5000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }} // pojok kanan atas
      >
        <Alert severity={severity} sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
    </>
  );
}
