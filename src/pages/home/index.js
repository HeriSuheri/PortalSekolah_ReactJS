import { useState, useEffect, useRef } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  IconButton,
  GlobalStyles,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import { Link } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import YouTubeIcon from "@mui/icons-material/YouTube";
import InstagramIcon from "@mui/icons-material/Instagram";
import EmailIcon from "@mui/icons-material/Email";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

import AOS from "aos";
import "aos/dist/aos.css";

// function FadeUpSection({ children, id }) {
//   const ref = useRef(null);
//   const [show, setShow] = useState(false);

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting) setShow(true);
//       },
//       { threshold: 0.1 }
//     );
//     if (ref.current) observer.observe(ref.current);
//     return () => observer.disconnect();
//   }, []);

//   return (
//     <div id={id} ref={ref} className={`fade-up ${show ? "show" : ""}`}>
//       {children}
//     </div>
//   );
// }

function Beranda() {
  const [open, setOpen] = useState(false);

  const menuItems = [
    { text: "Beranda", href: "#beranda" },
    { text: "Tentang", href: "#tentang" },
    { text: "Berita", href: "#berita" },
    { text: "Agenda", href: "#agenda" },
    { text: "Kontak", href: "#kontak" },
    { text: "PPDB", href: "/pendaftaran" },
    { text: "Login", href: "/login" },
  ];

  useEffect(() => {
    AOS.init({
      duration: 1000, // durasi animasi (ms)
      once: true, // animasi jalan sekali saja
      offset: 80,
    });
  }, []);

  return (
    <>
      <GlobalStyles styles={{ html: { scrollBehavior: "smooth" } }} />
      {/* Drawer untuk menu mobile */}
      {/* <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <List>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.text}
              component={item.href.startsWith("/") ? Link : "a"}
              to={item.href.startsWith("/") ? item.href : undefined}
              href={item.href.startsWith("/") ? undefined : item.href}
              onClick={() => setOpen(false)}
            >
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Drawer> */}
      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <List>
          {menuItems.map((item) => {
            const isButton = item.text === "PPDB" || item.text === "Login";

            return (
              <ListItem key={item.text} sx={{ justifyContent: "center" }}>
                {isButton ? (
                  <Button
                    variant="outlined"
                    color="inherit"
                    component={item.href.startsWith("/") ? Link : "a"}
                    to={item.href.startsWith("/") ? item.href : undefined}
                    href={item.href.startsWith("/") ? undefined : item.href}
                    onClick={() => setOpen(false)}
                    // sx={{ borderRadius: "20px", px: 3 }}
                    sx={{
                      borderRadius: "20px",
                      px: 3,
                      transition: "all 0.3s",
                      "&:hover": {
                        bgcolor: "primary.light",
                        borderColor: "primary.dark",
                      },
                    }}
                  >
                    {item.text}
                  </Button>
                ) : (
                  <ListItemText
                    primary={item.text}
                    onClick={() => setOpen(false)}
                    component={item.href.startsWith("/") ? Link : "a"}
                    to={item.href.startsWith("/") ? item.href : undefined}
                    href={item.href.startsWith("/") ? undefined : item.href}
                    sx={{ cursor: "pointer" }}
                  />
                )}
              </ListItem>
            );
          })}
        </List>
      </Drawer>

      {/* Header */}
      <AppBar position="fixed" color="primary">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Portal Sekolah
          </Typography>

          {/* Tombol menu untuk layar besar */}
          {/* <Box sx={{ display: { xs: "none", md: "block" } }}>
            {menuItems.map((item) => (
              <Button
                key={item.text}
                color="inherit"
                component={item.href.startsWith("/") ? Link : "a"}
                to={item.href.startsWith("/") ? item.href : undefined}
                href={item.href.startsWith("/") ? undefined : item.href}
              >
                {item.text}
              </Button>
            ))}
          </Box> */}
          <Box sx={{ display: { xs: "none", md: "block" } }}>
            {menuItems.map((item) => {
              const isButton = item.text === "PPDB" || item.text === "Login";

              return isButton ? (
                <Button
                  key={item.text}
                  variant="outlined"
                  color="inherit"
                  component={item.href.startsWith("/") ? Link : "a"}
                  to={item.href.startsWith("/") ? item.href : undefined}
                  href={item.href.startsWith("/") ? undefined : item.href}
                  // sx={{ borderRadius: "20px", mx: 1 }}
                  sx={{
                    borderRadius: "20px",
                    mx: 1,
                    transition: "all 0.3s",
                    "&:hover": {
                      bgcolor: "primary.light",
                      borderColor: "primary.dark",
                    },
                  }}
                >
                  {item.text}
                </Button>
              ) : (
                <Button
                  key={item.text}
                  color="inherit"
                  component={item.href.startsWith("/") ? Link : "a"}
                  to={item.href.startsWith("/") ? item.href : undefined}
                  href={item.href.startsWith("/") ? undefined : item.href}
                >
                  {item.text}
                </Button>
              );
            })}
          </Box>

          {/* Hamburger menu untuk layar kecil */}
          <Box sx={{ display: { xs: "block", md: "none" } }}>
            <IconButton color="inherit" onClick={() => setOpen(true)}>
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box
        id="beranda"
        // sx={{
        //   bgcolor: "#f5f5f5",
        //   minHeight: "100vh",
        //   py: 8,
        //   textAlign: "center",
        // }}
        sx={{
          minHeight: "100vh",
          // py: { xs: 4, md: 8 }, // padding lebih kecil di mobile
          py: 8,
          textAlign: "center",
          backgroundImage: "url('/images/home-image.jpg')",
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
          sx={{ color: "white", textShadow: "1px 1px 4px rgba(0,0,0,0.7)" }}
        >
          Selamat Datang di Portal Sekolah
        </Typography>
        <Typography
          variant="h6"
          gutterBottom
          data-aos="fade-up"
          data-aos-delay="200"
          sx={{ color: "white", textShadow: "1px 1px 4px rgba(0,0,0,0.7)" }}
        >
          Belajar, Berkembang, Berprestasi
        </Typography>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/pendaftaran"
          data-aos="fade-up"
          data-aos-delay="300"
        >
          Daftar Siswa Baru
        </Button>
      </Box>

      {/* Konten Utama */}
      <Box sx={{ bgcolor: "#f5f5f5", py: 6 }}>
        <Container>
          {/* Tentang */}
          <Box
            id="tentang"
            sx={{
              scrollMarginTop: "64px",
              minHeight: "100vh",
            }}
          >
            <Typography
              variant="h4"
              gutterBottom
              data-aos="fade-up"
              data-aos-delay="100"
            >
              Tentang Sekolah
            </Typography>
            <Typography paragraph data-aos="fade-up" data-aos-delay="100">
              Portal Sekolah adalah sistem informasi akademik untuk siswa, guru,
              dan orang tua.
            </Typography>
            <Typography
              variant="h4"
              gutterBottom
              data-aos="fade-up"
              data-aos-delay="100"
            >
              Program Unggulan
            </Typography>
            <ul data-aos="fade-up" data-aos-delay="100">
              <li>Kelas Unggulan</li>
              <li>Ekstrakurikuler</li>
              <li>Laboratorium Modern</li>
            </ul>
          </Box>
          <Box sx={{ bgcolor: "#f5f5f5" }}>
            <Divider
              // disableGutters
              variant="fullWidth"
              sx={{
                mb: 1,
                borderColor: "grey",
                borderBottomWidth: 3,
              }}
            />
          </Box>
          {/* Kontak */}
          <Box id="berita" sx={{ scrollMarginTop: "64px", minHeight: "100vh" }}>
            <Typography
              variant="h4"
              gutterBottom
              data-aos="fade-up"
              data-aos-delay="100"
            >
              Berita
            </Typography>
            <Typography data-aos="fade-up" data-aos-delay="100">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book. It has
              survived not only five centuries, but also the leap into
              electronic typesetting, remaining essentially unchanged. It was
              popularised in the 1960s with the release of Letraset sheets
              containing Lorem Ipsum passages, and more recently with desktop
              publishing software like Aldus PageMaker including versions of
              Lorem Ipsum. Why do we use it? It is a long established fact that
              a reader will be distracted by the readable content of a page when
              looking at its layout. The point of using Lorem Ipsum is that it
              has a more-or-less normal distribution of letters, as opposed to
              using 'Content here, content here', making it look like readable
              English. Many desktop publishing packages and web page editors now
              use Lorem Ipsum as their default model text, and a search for
              'lorem ipsum' will uncover many web sites still in their infancy.
              Various versions have evolved over the years, sometimes by
              accident, sometimes on purpose (injected humour and the like).
              Where does it come from? Contrary to popular belief, Lorem Ipsum
              is not simply random text. It has roots in a piece of classical
              Latin literature from 45 BC, making it over 2000 years old.
              Richard McClintock, a Latin professor at Hampden-Sydney College in
              Virginia, looked up one of the more obscure Latin words,
              consectetur, from a Lorem Ipsum passage, and going through the
              cites of the word in classical literature, discovered the
              undoubtable source. Lorem Ipsum comes from sections 1.10.32 and
              1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good
              and Evil) by Cicero, written in 45 BC. This book is a treatise on
              the theory of ethics, very popular during the Renaissance. The
              first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes
              from a line in section 1.10.32. The standard chunk of Lorem Ipsum
              used since the 1500s is reproduced below for those interested.
              Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum"
              by Cicero are also reproduced in their exact original form,
              accompanied by English versions from the 1914 translation by H.
              Rackham. Where can I get some? There are many variations of
              passages of Lorem Ipsum available, but the majority have suffered
              alteration in some form, by injected humour, or randomised words
              which don't look even slightly believable. If you are going to use
              a passage of Lorem Ipsum, you need to be sure there isn't anything
              embarrassing hLorem Ipsum is simply dummy text of the printing and
              typesetting industry. Lorem Ipsum has been the industry's standard
              dummy text ever since the 1500s, when an unknown printer took a
              galley of type and scrambled it to make a type specimen book. It
              has survived not only five centuries, but also the leap into
              electronic typesetting, remaining essentially unchanged. It was
              popularised in the 1960s with the release of Letraset sheets
              containing Lorem Ipsum passages, and more recently with desktop
              publishing software like Aldus PageMaker including versions of
              Lorem Ipsum. Why do we use it? It is a long established fact that
              a reader will be distracted by the readable content of a page when
              looking at its layout. The point of using Lorem Ipsum is that it
              has a more-or-less normal distribution of letters, as opposed to
              using 'Content here, content here', making it look like readable
              English. Many desktop publishing packages and web page editors now
              use Lorem Ipsum as their default model text, and a search for
              'lorem ipsum' will uncover many web sites still in their infancy.
              Various versions have evolved over the years, sometimes by
              accident, sometimes on purpose (injected humour and the like).
              Where does it come from? Contrary to popular belief, Lorem Ipsum
              is not simply random text. It has roots in a piece of classical
              Latin literature from 45 BC, making it over 2000 years old.
              Richard McClintock, a Latin professor at Hampden-Sydney College in
              Virginia, looked up one of the more obscure Latin words,
              consectetur, from a Lorem Ipsum passage, and going through the
              cites of the word in classical literature, discovered the
              undoubtable source. Lorem Ipsum comes from sections 1.10.32 and
              1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good
              and Evil) by Cicero, written in 45 BC. This book is a treatise on
              the theory of ethics, very popular during the Renaissance. The
              first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes
              from a line in section 1.10.32. The standard chunk of Lorem Ipsum
              used since the 1500s is reproduced below for those interested.
              Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et
            </Typography>
          </Box>
          <Box sx={{ bgcolor: "#f5f5f5" }}>
            <Divider
              sx={{
                mb: 1,
                borderColor: "grey",
                borderBottomWidth: 3,
              }}
            />
          </Box>
          <Box id="agenda" sx={{ scrollMarginTop: "64px", minHeight: "100vh" }}>
            <Typography
              variant="h4"
              gutterBottom
              data-aos="fade-up"
              data-aos-delay="100"
            >
              Agenda
            </Typography>
            <Typography data-aos="fade-up" data-aos-delay="100">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book. It has
              survived not only five centuries, but also the leap into
              electronic typesetting, remaining essentially unchanged. It was
              popularised in the 1960s with the release of Letraset sheets
              containing Lorem Ipsum passages, and more recently with desktop
              publishing software like Aldus PageMaker including versions of
              Lorem Ipsum. Why do we use it? It is a long established fact that
              a reader will be distracted by the readable content of a page when
              looking at its layout. The point of using Lorem Ipsum is that it
              has a more-or-less normal distribution of letters, as opposed to
              using 'Content here, content here', making it look like readable
              English. Many desktop publishing packages and web page editors now
              use Lorem Ipsum as their default model text, and a search for
              'lorem ipsum' will uncover many web sites still in their infancy.
              Various versions have evolved over the years, sometimes by
              accident, sometimes on purpose (injected humour and the like).
              Where does it come from? Contrary to popular belief, Lorem Ipsum
              is not simply random text. It has roots in a piece of classical
              Latin literature from 45 BC, making it over 2000 years old.
              Richard McClintock, a Latin professor at Hampden-Sydney College in
              Virginia, looked up one of the more obscure Latin words,
              consectetur, from a Lorem Ipsum passage, and going through the
              cites of the word in classical literature, discovered the
              undoubtable source. Lorem Ipsum comes from sections 1.10.32 and
              1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good
              and Evil) by Cicero, written in 45 BC. This book is a treatise on
              the theory of ethics, very popular during the Renaissance. The
              first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes
              from a line in section 1.10.32. The standard chunk of Lorem Ipsum
              used since the 1500s is reproduced below for those interested.
              Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum"
              by Cicero are also reproduced in their exact original form,
              accompanied by English versions from the 1914 translation by H.
              Rackham. Where can I get some? There are many variations of
              passages of Lorem Ipsum available, but the majority have suffered
              alteration in some form, by injected humour, or randomised words
              which don't look even slightly believable. If you are going to use
              a passage of Lorem Ipsum, you need to be sure there isn't anything
              embarrassing hLorem Ipsum is simply dummy text of the printing and
              typesetting industry. Lorem Ipsum has been the industry's standard
              dummy text ever since the 1500s, when an unknown printer took a
              galley of type and scrambled it to make a type specimen book. It
              has survived not only five centuries, but also the leap into
              electronic typesetting, remaining essentially unchanged. It was
              popularised in the 1960s with the release of Letraset sheets
              containing Lorem Ipsum passages, and more recently with desktop
              publishing software like Aldus PageMaker including versions of
              Lorem Ipsum. Why do we use it? It is a long established fact that
              a reader will be distracted by the readable content of a page when
              looking at its layout. The point of using Lorem Ipsum is that it
              has a more-or-less normal distribution of letters, as opposed to
              using 'Content here, content here', making it look like readable
              English. Many desktop publishing packages and web page editors now
              use Lorem Ipsum as their default model text, and a search for
              'lorem ipsum' will uncover many web sites still in their infancy.
              Various versions have evolved over the years, sometimes by
              accident, sometimes on purpose (injected humour and the like).
              Where does it come from? Contrary to popular belief, Lorem Ipsum
              is not simply random text. It has roots in a piece of classical
              Latin literature from 45 BC,
            </Typography>
          </Box>
        </Container>
      </Box>
      {/* Footer */}
      <Box
        id="kontak"
        sx={{ bgcolor: "#1976d2", color: "white", py: 4, textAlign: "center" }}
      >
        <Typography data-aos="fade-up" data-aos-delay="100">
          Portal Sekolah
        </Typography>
        <Typography data-aos="fade-up" data-aos-delay="100">
          Jl. Pendidikan No. 123, Jakarta
        </Typography>

        {/* Email & WhatsApp posisi di tengah tapi isi rata kiri */}
        <Box
          sx={{
            mt: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              width: "200px",
              gap: 1,
            }}
          >
            <EmailIcon />
            <Typography data-aos="fade-up" data-aos-delay="100">
              portalSekolah@gmail.com
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              width: "200px",
              gap: 1,
            }}
          >
            <WhatsAppIcon />
            <Typography data-aos="fade-up" data-aos-delay="100">
              085214210194
            </Typography>
          </Box>
        </Box>

        {/* Icon Media Sosial dengan label, rata kiri layar */}
        <Box
          sx={{
            mt: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 1,
            pl: 4,
          }}
        >
          <Typography data-aos="fade-up" data-aos-delay="100">
            Connect with us:
          </Typography>
          <Box
            component="a"
            href="https://facebook.com/herry.ricardo.18"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              textDecoration: "none",
              color: "inherit",
              transition: "all 0.3s",
              "&:hover": {
                textDecoration: "none",
                bgcolor: "primary.dark", // teks & icon berubah warna saat hover
                color: "white",
                boxShadow: 3,
                transform: "translateY(-2px) scale(1.05)", // sedikit naik
              },
            }}
          >
            <FacebookIcon />
            <Typography
              data-aos="fade-up"
              data-aos-delay="100"
              sx={{
                fontWeight: 500,
                position: "relative",
                textDecoration: "none",
                // "&:hover::after": {
                //   textDecoration: "none",
                //   content: '""',
                //   position: "absolute",
                //   left: 0,
                //   bottom: -2,
                //   width: "100%",
                //   height: "2px",
                //   bgcolor: "white",
                //   // boxShadow: 3, // bayangan saat hover
                //   // transform: "scale(1.05)",
                // },
              }}
            >
              Facebook
            </Typography>
          </Box>
          <Box
            component="a"
            href="https://twitter.com/portalSekolah"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              textDecoration: "none",
              color: "inherit",
              transition: "all 0.3s",
              "&:hover": {
                textDecoration: "none",
                bgcolor: "primary.dark", // teks & icon berubah warna saat hover
                color: "white",
                boxShadow: 3,
                transform: "translateY(-2px) scale(1.05)", // sedikit naik
              },
            }}
          >
            <TwitterIcon />
            <Typography
              data-aos="fade-up"
              data-aos-delay="100"
              sx={{
                fontWeight: 500,
                position: "relative",
                textDecoration: "none",
              }}
            >
              Twitter
            </Typography>
          </Box>
          <Box
            component="a"
            href="https://youtube.com/portalSekolah"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              textDecoration: "none",
              color: "inherit",
              transition: "all 0.3s",
              "&:hover": {
                textDecoration: "none",
                bgcolor: "primary.dark", // teks & icon berubah warna saat hover
                color: "white",
                boxShadow: 3,
                transform: "translateY(-2px) scale(1.05)", // sedikit naik
              },
            }}
          >
            <YouTubeIcon />
            <Typography
              data-aos="fade-up"
              data-aos-delay="100"
              sx={{
                fontWeight: 500,
                position: "relative",
                textDecoration: "none",
              }}
            >
              Youtube
            </Typography>
          </Box>
          <Box
            component="a"
            href="https://instagram.com/herysuhery22"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              textDecoration: "none",
              color: "inherit",
              transition: "all 0.3s",
              "&:hover": {
                textDecoration: "none",
                bgcolor: "primary.dark", // teks & icon berubah warna saat hover
                color: "white",
                boxShadow: 3,
                transform: "translateY(-2px) scale(1.05)", // sedikit naik
              },
            }}
          >
            <InstagramIcon />
            <Typography
              data-aos="fade-up"
              data-aos-delay="100"
              sx={{
                fontWeight: 500,
                position: "relative",
                textDecoration: "none",
              }}
            >
              Instagram
            </Typography>
          </Box>
        </Box>
        {/* Divider putih */}
        <Divider sx={{ mt: 2, borderColor: "white" }} />

        {/* Teks di bawah Divider, rata kiri */}
        <Typography
          sx={{ color: "white", textAlign: "left", mt: 1, pl: 4 }}
          data-aos="fade-up"
          data-aos-delay="100"
        >
          © 2026 Portal Sekolah | All Right Reserved
        </Typography>
      </Box>
    </>
  );
}

export default Beranda;
