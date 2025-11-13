import React, { useEffect } from "react";
import { Typography } from "@mui/material";

export default function Siswa() {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);
  return (
    <>
      <Typography variant="h4" gutterBottom>
        SISWA
      </Typography>
      <Typography>
        Selamat datang di Portal Sekolah! Ini adalah halaman SISWA
      </Typography>
    </>
  );
}
