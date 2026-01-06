import React, { useState, useEffect } from "react";
import {
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Divider,
  Snackbar,
  Alert,
  CircularProgress,
  Paper,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import PopUpModal from "../../components/PopUpModal";
import PrivacyTipTwoToneIcon from "@mui/icons-material/PrivacyTipTwoTone";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import SchoolIcon from "@mui/icons-material/School";
import PeopleIcon from "@mui/icons-material/People";
import ClassIcon from "@mui/icons-material/Class";
import AdminService from "../manajemen/admin/AdminService";
import GuruService from "../manajemen/guru/GuruService";

export default function DashboardPage() {
  const [needChangePassword, setNeedChangePassword] = useState(false);
  const [page] = useState(0);
  const [rowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [openToast, setOpenToast] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [totalAdmins, setTotalAdmins] = useState(0);
  const [totalGuru, setTotalGuru] = useState(0);

  const getAdmins = async () => {
    setLoading(true);
    try {
      const response = await AdminService.getAdmin({ page, size: rowsPerPage });
      if (response.success) {
        setTotalAdmins(response.data?.totalElements || 0);
      } else {
        setErrorMsg(response.message || "Gagal mengambil data admin");
        setOpenToast(true);
      }
    } catch (err) {
      setErrorMsg(err.message || "Terjadi kesalahan tak terduga");
      setOpenToast(true);
    } finally {
      setLoading(false);
    }
  };

  const getGuru = async () => {
    setLoading(true);
    try {
      const response = await GuruService.getGuru({ page, size: rowsPerPage });
      if (response.success) {
        setTotalGuru(response.data?.totalElements || 0);
      } else {
        setErrorMsg(response.message || "Gagal mengambil data guru");
        setOpenToast(true);
      }
    } catch (err) {
      setErrorMsg(err.message || "Terjadi kesalahan tak terduga");
      setOpenToast(true);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    siswa: 850, // nanti ambil dari API
    kelas: 24, // nanti ambil dari API
  };

  const cardData = [
    {
      label: "Admin",
      value: totalAdmins,
      color: "#e3f2fd",
      icon: <SupervisorAccountIcon sx={{ fontSize: 40, color: "#1976d2" }} />,
    },
    {
      label: "Guru",
      value: totalGuru,
      color: "#fce4ec",
      icon: <SchoolIcon sx={{ fontSize: 40, color: "#d81b60" }} />,
    },
    {
      label: "Siswa",
      value: stats.siswa,
      color: "#e8f5e9",
      icon: <PeopleIcon sx={{ fontSize: 40, color: "#388e3c" }} />,
    },
    {
      label: "Kelas",
      value: stats.kelas,
      color: "#fff3e0",
      icon: <ClassIcon sx={{ fontSize: 40, color: "#f57c00" }} />,
    },
  ];

  useEffect(() => {
    getAdmins();
    getGuru();
    window.scrollTo({ top: 0, behavior: "smooth" });
    const loginAwal = localStorage.getItem("loginAwal");
    if (loginAwal === "true") {
      setNeedChangePassword(true);
    }
  }, []);

  return (
    <>
      {/* Toast error */}
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

      {/* Modal ganti password */}
      <PopUpModal
        open={needChangePassword}
        title="Ganti Password"
        content="Untuk keamanan akun Anda, silakan ganti password Anda dari password default."
        onClose={() => {
          setNeedChangePassword(false);
          localStorage.removeItem("loginAwal");
        }}
        icon={<PrivacyTipTwoToneIcon sx={{ fontSize: 48, color: "#f44336" }} />}
        maxWidth="sm"
      />

      {/* Title */}
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Divider sx={{ mb: 3 }} />

      {/* Loading spinner */}
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight={200}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Box display="flex" justifyContent="center">
          <Grid
            container
            spacing={3}
            justifyContent="center"
            alignItems="stretch"
            sx={{ maxWidth: 1200 }}
          >
            {cardData.map((item, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card sx={{ backgroundColor: item.color, height: "100%" }}>
                  <CardContent
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      height: "100%",
                      padding: 3,
                    }}
                  >
                    <Box>
                      <Typography variant="h6" fontSize={18}>
                        {item.label}
                      </Typography>
                      <Typography variant="h3">{item.value}</Typography>
                    </Box>
                    {item.icon}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Section tambahan: Pengumuman */}
      <Divider sx={{ my: 4 }} />
      <Typography variant="h5" gutterBottom>
        Pengumuman Terbaru
      </Typography>
      <Paper sx={{ p: 2 }}>
        <List>
          <ListItem>
            <ListItemText primary="Ujian akhir semester dimulai 10 Desember 2025" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Libur Natal: 24–26 Desember 2025" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Workshop Guru: 15 Januari 2026" />
          </ListItem>
        </List>
      </Paper>
    </>
  );
}
