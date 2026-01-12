import { Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <Box sx={{ textAlign: "center", mt: 10 }}>
      <Typography variant="h4" color="error" gutterBottom>
        404 - Halaman tidak ditemukan
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        Maaf, halaman yang Anda cari tidak tersedia atau sudah dipindahkan.
      </Typography>
      <Button variant="contained" onClick={() => navigate("/")}>
        Kembali ke Beranda
      </Button>
    </Box>
  );
}
