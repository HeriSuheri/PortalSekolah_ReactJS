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
import HomeService from "../home/HomeServive";
import KelasService from "../manajemen/kelas/KelasService";
import ConfirmModal from "../../components/DialogPopup";
import { useAuth } from "../../internal/AuthContext";

export default function DashboardPage() {
  const { setOpenModalChangePass } = useAuth();
  const [needChangePassword, setNeedChangePassword] = useState(false);
  const [page] = useState(0);
  const [rowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [openToast, setOpenToast] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [totalAdmins, setTotalAdmins] = useState(0);
  const [totalGuru, setTotalGuru] = useState(0);
  const [totalSiswa, setTotalSiswa] = useState(0);
  const [totalKelas, setTotalKelas] = useState(0);
  const [content, setDataContent] = useState([]);

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

  const getSiswa = async () => {
    setLoading(true);
    try {
      const response = await KelasService.getSiswaAll();
      if (response.success) {
        setTotalSiswa(response.data.data.length || 0);
      } else {
        setErrorMsg(response.message || "Gagal mengambil data siswa");
        setOpenToast(true);
      }
    } catch (err) {
      setErrorMsg(err.message || "Terjadi kesalahan tak terduga");
      setOpenToast(true);
    } finally {
      setLoading(false);
    }
  };

  const getClassroom = async () => {
    setLoading(true);
    try {
      const response = await KelasService.getClassAll();
      if (response.success) {
        setTotalKelas(response.data.data.length || 0);
      } else {
        setErrorMsg(response.message || "Gagal mengambil data classroom");
        setOpenToast(true);
      }
    } catch (err) {
      setErrorMsg(err.message || "Terjadi kesalahan tak terduga");
      setOpenToast(true);
    } finally {
      setLoading(false);
    }
  };

  const getDataContent = async () => {
    try {
      const response = await HomeService.getContent();
      if (response.success) {
        // sort ascending berdasarkan id
        const sortedData = [...(response?.data || [])].sort(
          (a, b) => a.id - b.id,
        );
        setDataContent(sortedData);
      } else {
        setErrorMsg(response.message || "Gagal get data");
        setOpenToast(true);
      }
    } catch (err) {
      setOpenToast(true);
      setErrorMsg(err.message || "Terjadi kesalahan tak terduga");
    } finally {
      setLoading(false);
    }
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
      value: totalSiswa,
      color: "#e8f5e9",
      icon: <PeopleIcon sx={{ fontSize: 40, color: "#388e3c" }} />,
    },
    {
      label: "Kelas",
      value: totalKelas,
      color: "#fff3e0",
      icon: <ClassIcon sx={{ fontSize: 40, color: "#f57c00" }} />,
    },
  ];

  useEffect(() => {
    getAdmins();
    getGuru();
    getSiswa();
    getClassroom();
    getDataContent();
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
      {/* <PopUpModal
        open={needChangePassword}
        title="Ganti Password"
        content="Untuk keamanan akun Anda, silakan ganti password Anda dari password default."
        onClose={() => {
          setNeedChangePassword(false);
          localStorage.removeItem("loginAwal");
        }}
        icon={<PrivacyTipTwoToneIcon sx={{ fontSize: 48, color: "#f44336" }} />}
        maxWidth="sm"
      /> */}
      <ConfirmModal
        open={needChangePassword}
        title="Ganti Password Anda"
        question="Untuk keamanan akun Anda, silakan ganti password Anda dari password default."
        icon={<PrivacyTipTwoToneIcon sx={{ fontSize: 48, color: "#f44336" }} />}
        useText={true}
        textCancel="Nanti aja!"
        textSubmit="Ok, Ubah sekarang"
        onConfirm={() => {
          setOpenModalChangePass(true);
          setNeedChangePassword(false);
          localStorage.removeItem("loginAwal");
        }}
        onCancel={() => {
          setNeedChangePassword(false);
          localStorage.removeItem("loginAwal");
        }}
      />

      {/* Title */}
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontSize: "clamp(1.25rem, 2.5vw, 2.5rem)",
          fontWeight: "bold",
        }}
      >
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
      <Typography
        variant="h5"
        fontWeight="bold"
        gutterBottom
        sx={{ fontSize: { xs: "0.85rem", sm: "1rem", md: "1.25rem" } }}
      >
        Pengumuman Terbaru
      </Typography>
      <Paper sx={{ p: 2, borderRadius: 4 }}>
        {(() => {
          const agenda = content.find(
            (c) => c.paramKey === "agenda",
          )?.paramValue;
          try {
            let arr;
            try {
              arr = JSON.parse(agenda);
            } catch {
              arr = agenda;
            }
            return (
              <Box
                sx={{
                  // bgcolor: "background.default", // warna agak gelap
                  // color: "white", // teks putih biar kontras
                  borderRadius: 4, // sudut melengkung
                  p: 2, // padding dalam box
                  mb: 2, // jarak antar berita
                  border: "1.5px solid #1976d2",
                  // minHeight: "80vh"
                }}
              >
                <List
                  sx={{
                    fontSize: { xs: "0.875rem", md: "1rem" },
                    listStyleType: "decimal", // nomor otomatis
                    pl: 3,
                  }}
                >
                  {arr.map((item, idx) => (
                    <ListItem
                      key={idx}
                      sx={{ display: "list-item", py: 0.5 }} // biar nomor muncul & jarak rapat
                    >
                      <ListItemText
                        primary={item}
                        sx={{
                          "& .MuiListItemText-primary": {
                            fontSize: { xs: "0.750rem", md: "1rem" },
                          },
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            );
          } catch {
            return null;
          }
        })()}
      </Paper>
    </>
  );
}
