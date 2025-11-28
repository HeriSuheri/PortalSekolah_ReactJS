import React, { useState, useEffect } from "react";
import {
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Divider,
} from "@mui/material";
import PopUpModal from "../../components/PopUpModal";
import PrivacyTipTwoToneIcon from "@mui/icons-material/PrivacyTipTwoTone";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import SchoolIcon from "@mui/icons-material/School";
import PeopleIcon from "@mui/icons-material/People";
import ClassIcon from "@mui/icons-material/Class";

export default function DashboardPage() {
  const [needChangePassword, setNeedChangePassword] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const loginAwal = localStorage.getItem("loginAwal");
    if (loginAwal === "true") {
      setNeedChangePassword(true);
    }
  }, []);

  const stats = {
    admin: 5,
    guru: 120,
    siswa: 850,
    kelas: 24,
  };

  const cardData = [
    {
      label: "Admin",
      value: stats.admin,
      color: "#e3f2fd",
      icon: <SupervisorAccountIcon sx={{ fontSize: 40, color: "#1976d2" }} />,
    },
    {
      label: "Guru",
      value: stats.guru,
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

  return (
    <>
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

      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Divider sx={{ mb: 3 }} />
      <Box display="flex" justifyContent="center">
        <Grid container spacing={3} justifyContent="center" maxWidth="lg">
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
    </>
  );
}
