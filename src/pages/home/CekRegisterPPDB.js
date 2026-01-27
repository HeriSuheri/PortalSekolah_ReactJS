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
  Divider,
  Alert,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import HomeService from "./HomeServive";

export default function CekRegisterPPDB() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    noPendaftaran: "",
  });
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openToast, setOpenToast] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const submit = async () => {
    setLoading(true);
    try {
      const response = await HomeService.cekRegisterPPDB(form?.noPendaftaran);
      console.log("RES CEK REGISTER PPDB:", response);
      if (response.success) {
        setResponse(response?.data);
        setLoading(false);
      } else {
        setErrorMsg(response.message || "Gagal cek register");
        setOpenToast(true);
      }
    } catch (err) {
      setOpenToast(true);
      setErrorMsg(err.message || "Terjadi kesalahan tak terduga");
      console.error("Gagal cek register:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  console.log("FORM:", form);

  return (
    <>
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
      <Box
        sx={{
          // display: "flex",
          // flexDirection: "row",
          minHeight: "100vh",
          alignItems: "center",
          p: 2,
          backgroundColor: loading ? "grey.300" : "background.default",
        }}
      >
        <Box sx={{ flex: 1, pt: 1 }}>
          <Typography
            variant="h4"
            component="h1"
            sx={{ mb: 1, fontSize: "clamp(1.25rem, 2.5vw, 2.5rem)" }}
          >
            PPDB PORTAL SEKOLAH 2025
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontSize: "clamp(0.5rem, 1.5vw, 1rem)", fontStyle: "italic" }}
          >
            “Penerimaan Peserta Didik Baru Tahun Ajaran 2025/2026 – Cek data
            pendaftaran.”
          </Typography>
          <Divider
            // disableGutters
            variant="fullWidth"
            sx={{
              mb: 1,
              borderColor: "grey",
              borderBottomWidth: 3,
            }}
          />
          <Box sx={{ p: 3 }}>
            {/* Input + Label */}
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Typography sx={{ mr: 2 }}>Input Nomor Pendaftaran</Typography>
              <TextField
                label="Nomor Pendaftaran"
                variant="outlined"
                size="small"
                value={form.noPendaftaran || ""}
                onChange={(e) => {
                  setForm({
                    ...form,
                    noPendaftaran: e.target.value.toUpperCase(),
                  });
                  setResponse(null);
                }}
              />
            </Box>

            {/* Tombol Submit + Cancel */}
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="contained"
                onClick={submit}
                sx={{ borderRadius: "16px" }}
                disabled={!form?.noPendaftaran}
              >
                CEK
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => {
                  navigate("/");
                  setForm({
                    noPendaftaran: "",
                  });
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
                {response?.status === "MENUNGGU_VALIDASI" && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    style={{ fontStyle: "italic", color: "red" }}
                  >
                    *Segera datang ke sekolah untuk melakukan pendaftaran ulang
                    dengan menunjukan nomor pendaftaran dan membawa berkas yang
                    di perlukan.
                  </Typography>
                )}
              </Box>
            )}
          </Box>
        </Box>
      </Box>
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
    </>
  );
}
