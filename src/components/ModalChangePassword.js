import { Modal, Box, TextField, Button, Typography } from "@mui/material";
import { useState } from "react";
import LoginService from "../pages/login/LoginService";

const ChangePasswordModal = ({ open, close, success }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (newPassword !== confirmPassword) {
      setError("Password baru dan konfirmasi tidak cocok");
      return;
    }

    const nomor = JSON.parse(localStorage.getItem("userLogin"));

    try {
      const payload = {
        nomorInduk: nomor?.nomorInduk,
        oldPassword,
        newPassword,
      };
      const response = await LoginService.ChangePassword(payload);
      console.log("RESPONSE FUNC CHANGE PASSWORD:", response);

      if (response?.success) {
        success();
        close();
      } else {
        setError(response?.message ? response?.message : "Gagal ubah password");
      }
    } catch (err) {
      setError("Terjadi kesalahan");
    }
  };

  console.log("OLD PASSWORD:", oldPassword);
  console.log("NEW PASSWORD:", newPassword);
  console.log("CONFIRM PASSWORD:", confirmPassword);

  return (
    <>
      {/* <Button onClick={handleOpen}>Change Password</Button> */}
      <Modal open={open} onClose={close}>
        <Box
          sx={{
            width: 400,
            bgcolor: "background.paper",
            p: 4,
            mx: "auto",
            mt: "10%",
            borderRadius: 2,
            boxShadow: 24,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
          className="rounded-lg max-w-md border-t-4 border-blue-500 border border-solid"
        >
          <Typography variant="h6" textAlign="center">
            Ubah Password
          </Typography>
          <TextField
            label="Password Lama"
            type="password"
            value={oldPassword}
            onChange={(e) => {
              setOldPassword(e.target.value);
              setError("");
            }}
            fullWidth
          />
          <TextField
            label="Password Baru"
            type="password"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              setError("");
            }}
            fullWidth
          />
          <TextField
            label="Konfirmasi Password Baru"
            type="password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setError("");
            }}
            fullWidth
          />
          {error && (
            <div className="bg-red-100 text-red-700 p-2 rounded flex justify-between">
              <span>{error}</span>
              <button onClick={() => setError(null)}>✕</button>
            </div>
          )}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              gap: 1,
              mt: 1,
            }}
          >
            <Button variant="outlined" onClick={close}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleSubmit}>
              Submit
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default ChangePasswordModal;
