import { useState, useEffect, useRef } from "react";
import { Typography, Button, Box } from "@mui/material";
import { HowToReg, AppRegistration } from "@mui/icons-material";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

const HpmePPDB = () => {
  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;
  const tahunAjaran = `${currentYear}/${nextYear}`;

  useEffect(() => {
    AOS.init({
      duration: 1000, // durasi animasi (ms)
      once: true, // animasi jalan sekali saja
      offset: 80,
    });
  }, []);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);
  return (
    <Box
      sx={{
        p: 2,
        minHeight: "100vh",
        // py: { xs: 4, md: 8 }, // padding lebih kecil di mobile
        // py: 8,
        // textAlign: "center",
        backgroundImage: "url('/images/register-profile.jpg')",
        backgroundSize: "cover", // gambar penuh
        backgroundPosition: { xs: "top", md: "center" }, // fokus atas di mobile, center di desktop
        backgroundRepeat: "no-repeat",
        scrollMarginTop: "64px", // biar pas di bawah header saat klik menu
      }}
    >
      <Typography
        variant="h3"
        gutterBottom
        data-aos="fade-up"
        data-aos-delay="100"
        sx={{
          color: "white",
          textShadow: "1px 1px 4px rgba(0,0,0,0.7)",
          textAlign: "center",
          fontSize: "clamp(1.5rem, 4vw, 3rem)",
          //   p: 0,
        }}
      >
        {`Pendaftaran Siswa Baru Tahun Ajaran ${tahunAjaran} telah dibuka...`}
      </Typography>
      <Typography
        variant="h6"
        gutterBottom
        data-aos="fade-up"
        data-aos-delay="200"
        sx={{
          color: "white",
          textShadow: "1px 1px 4px rgba(0,0,0,0.7)",
          textAlign: "left",
          fontSize: "clamp(1rem, 2vw, 2.5rem)",
        }}
      >
        Mari bergabung bersama kami meraih masa depan yang gemilang
      </Typography>
      <Box
        sx={{
          mt: 2,
          display: "flex",
          justifyContent: "flex-start",
          gap: 2,
        }}
      >
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/registerPPDB"
          data-aos="fade-left"
          data-aos-delay="300"
          startIcon={<AppRegistration />}
          sx={{ borderRadius: "16px" }}
        >
          DAFTAR SEKARANG
        </Button>
        <Button
          variant="contained"
          color="inherit"
          component={Link}
          to="/"
          data-aos="fade-right"
          data-aos-delay="300"
          sx={{ borderRadius: "16px" }}
        >
          GO HOME
        </Button>
      </Box>
    </Box>
  );
};

export default HpmePPDB;
