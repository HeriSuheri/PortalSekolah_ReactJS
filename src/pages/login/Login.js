import { useState } from "react";
import { useAuth } from "../../internal/AuthContext";
import { useNavigate } from "react-router-dom";
import LoginService from "./LoginService";
import CircularProgress from "@mui/material/CircularProgress";
import { TextField, Button, Typography } from "@mui/material";
import "./Login.css";

const LoginPage = () => {
  const { login } = useAuth();
  const [nomorInduk, setNomorInduk] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const payload = {
        nomorInduk,
        password, // kirim sebagai string "YYYY-MM-DD"
      };
      const response = await LoginService.Login(payload);
      console.log("RESPONSE FUNGSI LOGIN:", response);

      if (response?.success) {
        const { loginAwal } = response.data;
        localStorage.setItem("userLogin", JSON.stringify(response?.data));
        localStorage.setItem("loginAwal", loginAwal);
        login(JSON.stringify(response?.data));
        navigate("/dashboard");
      } else {
        setError(
          response?.message
            ? response?.message
            : "Nomor Induk atau tanggal lahir salah"
        );
      }
    } catch (err) {
      console.error("Error Login:", err);
      setError(err.message || "Gagal login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 login-page">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md border-t-4 border-blue-500 border border-solid">
        <Typography variant="h5" className="mb-4 text-center font-bold">
          Portal Sekolah - Login
        </Typography>

        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded flex justify-between">
            <span>{error}</span>
            <button onClick={() => setError(null)}>✕</button>
          </div>
        )}

        <form onSubmit={handleLogin}>
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
            label="Password"
            type="text"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(null);
            }}
          />
          <div className="mb-2 text-right text-xs">
            <a
              href="/forgot-password"
              className="text-blue-600 hover:underline ml-2"
            >
              Forgot Password ?
            </a>
          </div>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            className="mt-4"
            disabled={!nomorInduk || !password}
          >
            {isLoading ? "..." : "Login"}
          </Button>
          {isLoading && (
            <div className="flex justify-center mt-4">
              <CircularProgress size={24} />
            </div>
          )}
        </form>
        <p
          style={{
            color: "red",
            fontSize: "10px",
            fontFamily: "monospace",
            fontStyle: "italic",
          }}
          className="mt-2"
        >
          Untuk pertama login silahkan gunakan Tanggal Lahir sebagai Password,{" "}
          <br />
          dengan format YYYY-MM-DD. <br />
        </p>


        <div className="mb-2 mt-4 text-left text-xs">
            <a href="/" className="text-blue-600 hover:underline">
              Back to Home...
            </a>
        </div>

        {/* <div className="mt-4 text-center">
          Belum punya akun ?
          <a href="/register" className="text-blue-600 hover:underline ml-2">
            Daftar di sini
          </a>
        </div> */}
      </div>
    </div>

    // <div className="login-page">
    //   <div className="wrapper">
    //     <form action="">
    //       <h1>Login</h1>
    //       <div class="input-box">
    //         <input type="text" placeholder="Username" required />
    //         <i className="bx bxs-user"></i>
    //       </div>
    //       <div class="input-box">
    //         <input type="password" placeholder="Password" required />
    //         <i class="bx bxs-lock-alt"></i>
    //       </div>
    //       <div class="remember-forgot">
    //         <label>
    //           <input type="checkbox" />
    //           Remember Me
    //         </label>
    //         <a href="#">Forgot Password</a>
    //       </div>
    //       <button type="submit" class="btn">
    //         Login
    //       </button>
    //       <div class="register-link">
    //         <p>
    //           Dont have an account? <a href="#">Register</a>
    //         </p>
    //       </div>
    //     </form>
    //   </div>
    // </div>
  );
};

export default LoginPage;
