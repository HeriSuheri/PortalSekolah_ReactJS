import { useState } from "react";
import { useAuth } from "../../../internal/AuthContext";
import { useNavigate } from "react-router-dom";
import LoginService from "../LoginService";
import { TextField, Button, Typography } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import PopupModal from "../../../components/PopUpModal";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
// import "../Login.css";

const ForgotPage = () => {
  const { tokenForgot, setTokenForgot } = useAuth();
  const [nomorInduk, setNomorInduk] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [openSuccess, setOpenSuccess] = useState(false);
  const navigate = useNavigate();

  const handleForgot = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const payload = {
        nomorInduk,
        email,
      };
      const response = await LoginService.forgotPassword(payload);
      console.log("RESPONSE FUNGSI FORGOT PASS:", response);

      if (response?.success) {
        setOpenSuccess(true);
      } else {
        setError(
          response?.message ? response?.message : "Nomor Induk atau Email salah"
        );
      }
    } catch (err) {
      console.error("Error Forgot:", err);
      setError(err.message || "Gagal Forgot");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <PopupModal
        open={openSuccess}
        title="Berhasil"
        content="Token Reset Password telah dikirim ke email anda, silahkan buka email anda segera sebelum 2 menit."
        onClose={() => {
          setOpenSuccess(false);
          setError(null);
          setTimeout(() => navigate("/"), 3000);
        }}
        icon={<CheckCircleOutlinedIcon sx={{ fontSize: 48, color: "green" }} />}
        maxWidth="sm"
        // fullWidth={false}
      />
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md border-t-4 border-blue-500 border border-solid">
        <Typography variant="h5" className="mb-4 text-center font-bold">
          Forgot Password
        </Typography>

        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded flex justify-between">
            <span>{error}</span>
            <button onClick={() => setError(null)}>✕</button>
          </div>
        )}

        <form onSubmit={handleForgot}>
          <TextField
            label="Nomor Induk"
            variant="outlined"
            fullWidth
            margin="normal"
            value={nomorInduk}
            onChange={(e) => {
              const raw = e.target.value.toUpperCase(); // konversi ke huruf kapital
              const filtered = raw.replace(/[^A-Z0-9]/g, ""); // hanya A-Z dan 0-9
              setNomorInduk(filtered);
              setError(null);
            }}
          />
          <TextField
            label="Email"
            type="email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError(null);
            }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            className="mt-12"
            disabled={!nomorInduk || !email || isLoading}
          >
            {isLoading ? "Mengirim..." : "Submit"}
          </Button>

          {isLoading && (
            <div className="flex justify-center mt-4">
              <CircularProgress size={24} />
            </div>
          )}
          <div className="mb-2 mt-3 text-right text-xs">
            <a href="/login" className="text-blue-600 hover:underline ml-2">
              Back to Login ?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPage;
