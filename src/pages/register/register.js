import { useState, useEffect } from "react";
import { useAuth } from "../../internal/AuthContext";
import { useNavigate } from "react-router-dom";
import LoginService from "../login/LoginService";
import { TextField, Button, Typography, Alert } from "@mui/material";

const RegisterPage = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [konfPassword, setKonfPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const payload = { username, password };
      const response = await LoginService.Login(payload);
      console.log("RESPONSE FUNGSI LOGIN:", response);
      if (response?.success) {
        console.log("SATU");
        const { token, role, username } = response.data;

        login(token, role, username); // ⬅ trigger context
        navigate("/dashboard");
      } else {
        console.log("DUA");
        setError(
          response?.message
            ? response?.message
            : "Ada kesalahan username atau password"
        );
      }
    } catch (err) {
      console.log("TIGA");
      console.error("Error Login:", err);
      setError(err.message || "Gagal login");
    }
  };

  // useEffect(() => {
  //   const token = localStorage.getItem("accessToken");
  //   if (token) navigate("/dashboard");
  // }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded p-8 w-full max-w-md">
        <Typography variant="h5" className="mb-4 text-center font-bold">
          Portal Sekolah - Register
        </Typography>

        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded flex justify-between">
            <span>{error}</span>
            <button onClick={() => setError(null)}>✕</button>
          </div>
        )}

        <form onSubmit={handleLogin}>
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setError(null);
            }}
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(null);
            }}
          />
          <TextField
            label="Konfirmasi Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={konfPassword}
            onChange={(e) => {
              setKonfPassword(e.target.value);
              setError(null);
            }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            className="mt-4"
            disabled={!username || !password || !konfPassword}
          >
            Register
          </Button>
        </form>

        <div className="mt-4 text-center">
          Sudah Punya Akun ?
          <a href="/" className="text-blue-600 hover:underline ml-2">
            Kembali ke Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
