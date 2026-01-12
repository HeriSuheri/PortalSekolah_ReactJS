import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginService from "../LoginService";
import { TextField, Button, Typography } from "@mui/material";
import PopupModal from "../../../components/PopUpModal";
import CircularProgress from "@mui/material/CircularProgress";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";

const ResetPasswordPage = () => {
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get("token");
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      setError("Token tidak ditemukan di URL.");
    }
  }, []);

  const handleReset = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (newPassword !== confirmPassword) {
      setError("Password dan konfirmasi tidak cocok.");
      setIsLoading(false);
      return;
    }

    try {
      const payload = { token, newPassword };
      const response = await LoginService.resetPassword(payload);
      console.log("RESPONSE RESET:", response);

      if (response?.success) {
        setOpenSuccess(true);
      } else {
        setError(response?.message || "Gagal reset password.");
      }
    } catch (err) {
      console.error("Error Reset:", err);
      setError(err.message || "Gagal reset password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <PopupModal
        open={openSuccess}
        title="Berhasil"
        content="Password Anda telah berhasil direset. Silakan login kembali dengan password baru."
        onClose={() => {
          setOpenSuccess(false);
          navigate("/");
        }}
        icon={<CheckCircleOutlinedIcon sx={{ fontSize: 48, color: "green" }} />}
        maxWidth="sm"
      />
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md border-t-4 border-green-500 border border-solid">
        <Typography variant="h5" className="mb-4 text-center font-bold">
          Reset Password
        </Typography>

        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded flex justify-between">
            <span>{error}</span>
            <button onClick={() => setError(null)}>✕</button>
          </div>
        )}

        <form onSubmit={handleReset}>
          <TextField
            label="Password Baru"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              setError(null);
            }}
          />
          <TextField
            label="Konfirmasi Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setError(null);
            }}
          />
          <Button
            type="submit"
            variant="contained"
            color="success"
            fullWidth
            className="mt-12"
            disabled={!newPassword || !confirmPassword}
          >
            {isLoading ? "Mengirim..." : "Submit"}
          </Button>
          {isLoading && (
            <div className="flex justify-center mt-4">
              <CircularProgress size={24} />
            </div>
          )}
          <div className="mb-2 mt-3 text-right text-xs">
            <a href="/login" className="text-green-600 hover:underline ml-2">
              Back to Login ?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
