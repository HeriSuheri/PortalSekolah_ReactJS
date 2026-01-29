import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Grid,
  TextField,
  Button,
  Box,
  Typography,
  Chip,
  Link,
  Alert,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import PopupModal from "../../components/PopUpModal";
import HomeService from "./HomeServive";
import axios from "axios";

export default function PpdbRegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nama: "",
    tanggalLahir: "",
    alamat: "",
    noHandphone: "",
    email: "",
  });
  const [response, setResponse] = useState(null);
  const [successRegister, setSuccessRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openToast, setOpenToast] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await HomeService.registerPPDB(form);
      console.log("RES REGISTER PPDB:", response);
      if (response.success) {
        setResponse(response?.data);
        setLoading(false);
        setSuccessRegister(true);
      } else {
        setErrorMsg(response.message || "Gagal register");
        setOpenToast(true);
      }
    } catch (err) {
      setOpenToast(true);
      setErrorMsg(err.message || "Terjadi kesalahan tak terduga");
      console.error("Gagal register:", err);
    } finally {
      setLoading(false);
    }
  };

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  return (
    <>
      <Box sx={{ pt: 2, pl: 5 }}>
        Telah mendaftar ?{" "}
        <Link href="cekRegisterPPDB" color="primary" underline="hover">
          Cek disini...
        </Link>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          minHeight: "100vh",
          alignItems: "center",
          p: 2,
          backgroundColor: loading ? "grey.300" : "background.default",
        }}
      >
        <Box sx={{ flex: 1, p: 3 }}>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              mb: 1,
              fontSize: "clamp(1.25rem, 2.5vw, 2.5rem)",
              // fontWeight: "bold",
            }}
          >
            PPDB PORTAL SEKOLAH 2025
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontSize: "clamp(0.5rem, 1.5vw, 1rem)", fontStyle: "italic" }}
          >
            “Penerimaan Peserta Didik Baru Tahun Ajaran 2025/2026 – Daftar
            sekarang dan dapatkan nomor pendaftaran otomatis.”
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TextField
              fullWidth
              label="Nama"
              name="nama"
              value={form.nama}
              onChange={handleChange}
              margin="normal"
              id="standard-basic"
              variant="standard"
            />
            <TextField
              fullWidth
              type="date"
              value={form.tanggalLahir}
              InputLabelProps={{ shrink: true }}
              name="tanggalLahir"
              onChange={handleChange}
              margin="normal"
              id="standard-basic"
              variant="standard"
              label="Tanggal Lahir"
              //   placeholder="Tanggal Lahir"
            />
            <TextField
              fullWidth
              label="Alamat"
              name="alamat"
              value={form.alamat}
              onChange={handleChange}
              margin="normal"
              id="standard-basic"
              variant="standard"
            />
            <TextField
              fullWidth
              label="No HP"
              name="noHandphone"
              value={form.noHandphone}
              onChange={handleChange}
              margin="normal"
              id="standard-basic"
              variant="standard"
            />
            <TextField
              fullWidth
              type="email"
              label="Email"
              name="email"
              value={form.email}
              onChange={handleChange}
              margin="normal"
              id="standard-basic"
              variant="standard"
              error={form?.email && !isValidEmail(form.email)}
              helperText={
                form?.email && !isValidEmail(form.email)
                  ? "Format email tidak valid"
                  : ""
              }
            />
            <Box
              sx={{
                mt: 2,
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: "flex-start",
                gap: 2,
              }}
            >
              <Button
                type="submit"
                variant="contained"
                sx={{ borderRadius: "16px" }}
                disabled={
                  !form?.nama ||
                  !form?.alamat ||
                  !form?.tanggalLahir ||
                  !form?.noHandphone ||
                  !form?.email
                }
              >
                DAFTAR
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => {
                  navigate("/");
                  setResponse(null);
                }}
                sx={{ borderRadius: "16px" }}
              >
                GO HOME
              </Button>
            </Box>

            {response && (
              <Box sx={{ mt: 3 }}>
                <Box display="flex" alignItems="center" mb={1}>
                  <Typography variant="subtitle1" sx={{ width: 170 }}>
                    Nomor Pendaftaran
                  </Typography>
                  <Typography variant="subtitle1" sx={{ width: 20 }}>
                    :
                  </Typography>
                  <Typography variant="subtitle1">
                    {response?.noPendaftaran}
                  </Typography>
                </Box>

                <Box display="flex" alignItems="center" mb={1}>
                  <Typography variant="subtitle1" sx={{ width: 170 }}>
                    Status
                  </Typography>
                  <Typography variant="subtitle1" sx={{ width: 20 }}>
                    :
                  </Typography>
                  <Chip
                    label={
                      response?.status === "MENUNGGU_VALIDASI"
                        ? "Menunggu Validasi"
                        : response?.status === "DITERIMA"
                          ? "Diterima"
                          : "Ditolak"
                    }
                    color={
                      response?.status === "MENUNGGU_VALIDASI"
                        ? "warning"
                        : response?.status === "DITERIMA"
                          ? "success"
                          : "error"
                    }
                    variant="outlined"
                  />
                </Box>

                <Box display="flex" alignItems="center" mb={1}>
                  <Typography variant="subtitle1" sx={{ width: 170 }}>
                    Status Pembayaran
                  </Typography>
                  <Typography variant="subtitle1" sx={{ width: 20 }}>
                    :
                  </Typography>
                  <Chip
                    label={
                      response?.statusPembayaran === "MENUNGGU_PEMBAYARAN"
                        ? "Menunggu Pembayaran"
                        : response?.statusPembayaran === "LUNAS"
                          ? "Lunas"
                          : "Belum Lunas"
                    }
                    color={
                      response?.statusPembayaran === "MENUNGGU_PEMBAYARAN"
                        ? "warning"
                        : response?.statusPembayaran === "LUNAS"
                          ? "success"
                          : "error"
                    }
                    variant="outlined"
                  />
                </Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  style={{ fontStyle: "italic", color: "red" }}
                >
                  *Mohon periksa email anda dan segera datang ke sekolah untuk
                  melakukan pendaftaran ulang dengan menunjukan nomor
                  pendaftaran dan membawa berkas yang di perlukan.
                </Typography>
              </Box>
            )}
          </Box>
        </Box>

        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            backgroundImage: `url(/images/register-image.jpg)`,
            backgroundSize: "cover", // biar gambar penuh
            backgroundPosition: "center", // biar center
            borderRadius: "100px", // kalau mau rounded corner
            minHeight: "350px",
          }}
        >
          {/* <img
            src="/images/register-image.jpg"
            alt="PPDB Banner"
            style={{ maxWidth: "100%", borderRadius: "50%", margin: "0 auto" }}
          /> */}
        </Box>
      </Box>
      <PopupModal
        open={successRegister}
        title="Pendaftaran Berhasil"
        content="Anda telah berhasil melakukan pendaftaran, mohon periksa segera email anda."
        onClose={() => {
          setSuccessRegister(false);
          setForm({
            ...form,
            nama: "",
            tanggalLahir: "",
            alamat: "",
            noHandphone: "",
            email: "",
          });
        }}
        icon={<CheckCircleOutlinedIcon sx={{ fontSize: 48, color: "green" }} />}
        maxWidth="sm"
        // fullWidth={false}
      />
      <Snackbar
        open={openToast}
        autoHideDuration={3000}
        onClose={() => setOpenToast(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="error" onClose={() => setOpenToast(false)}>
          {errorMsg}
        </Alert>
      </Snackbar>
      {loading && (
        <Box
          sx={{
            position: "fixed", // atau "absolute" kalau mau relatif ke parent
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            bgcolor: "rgba(255,255,255,0.7)", // semi transparan background
            zIndex: 1300, // lebih tinggi dari konten biasa
          }}
        >
          <CircularProgress />
        </Box>
      )}
    </>
  );
}
