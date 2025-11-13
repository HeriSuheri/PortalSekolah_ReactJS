import React, { useEffect } from "react";
import { Typography } from "@mui/material";

export default function Kelas() {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);
  return (
    <>
      <Typography variant="h4" gutterBottom>
        KELAS
      </Typography>
      <Typography>
        Selamat datang di Portal Sekolah! Ini adalah halaman KELAS
      </Typography>
    </>
  );
}
