import React, { useEffect } from "react";
import { Typography } from "@mui/material";

export default function JadwalPelajaran() {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);
  return (
    <>
      <Typography variant="h4" gutterBottom>
        JADWAL PELAJARAN
      </Typography>
      <Typography>
        Selamat datang di Portal Sekolah! Ini adalah halaman JADWAL PELAJARAN
      </Typography>
    </>
  );
}
