import React, { useEffect } from "react";
import { Typography } from "@mui/material";

export default function Mapel() {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);
  return (
    <>
      <Typography variant="h4" gutterBottom>
        MATA PELAJARAN
      </Typography>
      <Typography>
        Selamat datang di Portal Sekolah! Ini adalah halaman MATA PELAJARAN
      </Typography>
    </>
  );
}
