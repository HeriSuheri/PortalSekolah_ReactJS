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
import ListItemIcon from "@mui/material/ListItemIcon";
import StarBorderTwoToneIcon from "@mui/icons-material/StarBorderTwoTone";

import MenuIcon from "@mui/icons-material/Menu";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import YouTubeIcon from "@mui/icons-material/YouTube";
import InstagramIcon from "@mui/icons-material/Instagram";
import EmailIcon from "@mui/icons-material/Email";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import HomeService from "./HomeServive";
import KegiatanSlider from "./KegiatanSlider";

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
  const [menu, setMenu] = useState([]);
  const [content, setDataContent] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openToast, setOpenToast] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const menuItems = [
    { text: "Beranda", href: "#beranda" },
    { text: "Tentang", href: "#tentang" },
    { text: "Berita", href: "#berita" },
    { text: "Agenda", href: "#agenda" },
    { text: "Kegiatan", href: "#kegiatan" },
    { text: "Kontak", href: "#kontak" },
    { text: "PPDB", href: "/homePPDB" },
    { text: "Login", href: "/login" },
  ];

  const menuItemsNoPPDB = [
    { text: "Beranda", href: "#beranda" },
    { text: "Tentang", href: "#tentang" },
    { text: "Berita", href: "#berita" },
    { text: "Agenda", href: "#agenda" },
    { text: "Kegiatan", href: "#kegiatan" },
    { text: "Kontak", href: "#kontak" },
    { text: "Login", href: "/login" },
  ];

  const getDataContent = async (param) => {
    if (!param) {
      setLoading(true);
    }
    try {
      const response = await HomeService.getContent();
      if (response.success) {
        // sort ascending berdasarkan id
        const sortedData = [...(response?.data || [])].sort(
          (a, b) => a.id - b.id,
        );
        setDataContent(sortedData);

        const isPpdbOpen = response?.data.find(
          (el) => el.paramKey === "ppdb_menu",
        );
        if (isPpdbOpen.isActive) {
          setMenu(menuItems);
        } else {
          setMenu(menuItemsNoPPDB);
        }
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

  console.log("MENU:", menu);

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

  useEffect(() => {
    getDataContent();
  }, []);

  return (
    <>
      <Box>
        <GlobalStyles styles={{ html: { scrollBehavior: "smooth" } }} />
        <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
          <List>
            {menu.map((item) => {
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
            <Box sx={{ display: { xs: "none", md: "block" } }}>
              {menu.map((item) => {
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

        {/* <Container
          maxWidth="lg" // bisa "sm", "md", "lg", "xl"
          sx={{
            mt: 4,
            // px: { xs: 2, sm: 3, md: 4 }, // padding responsif
          }}
        > */}
        {/* CONTENT */}
        <Box
          id="beranda"
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
            sx={{
              color: "white",
              textShadow: "1px 1px 4px rgba(0,0,0,0.7)",
              fontSize: "clamp(1.5rem, 4vw, 3rem)",
            }}
          >
            Selamat Datang di Portal Sekolah
          </Typography>
          <Typography
            variant="h6"
            gutterBottom
            data-aos="fade-up"
            data-aos-delay="200"
            sx={{
              color: "white",
              textShadow: "1px 1px 4px rgba(0,0,0,0.7)",
              fontSize: "clamp(1rem, 2vw, 2.5rem)",
            }}
          >
            Belajar, Berkembang, Berprestasi
          </Typography>
        </Box>

        <Box sx={{ bgcolor: "#f5f5f5" }}>
          <Container>
            {/* Tentang */}
            <Box
              id="tentang"
              sx={{
                scrollMarginTop: "64px",
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography
                variant="h4"
                gutterBottom
                data-aos="fade-up"
                data-aos-delay="100"
                sx={{
                  fontSize: "clamp(1.25rem, 2.5vw, 2.5rem)",
                  fontWeight: "bold",
                }} // 20px–40px
              >
                Tentang Sekolah
              </Typography>

              <Typography
                paragraph
                variant="subtitle1"
                data-aos="fade-up"
                data-aos-delay="100"
                sx={{
                  fontSize: "clamp(0.875rem, 2vw, 1rem)",
                  textAlign: "justify", // rata kiri kanan
                  textIndent: "2cm", // awal paragraf menjorok 5cm
                  wordBreak: "break-word", // biar kata panjang tetap wrap
                }} // 14px–20px
              >
                {
                  content.find((c) => c.paramKey === "tentang_sekolah")
                    ?.paramValue
                }
              </Typography>
              <Typography
                variant="h4"
                gutterBottom
                data-aos="fade-up"
                data-aos-delay="100"
                sx={{ fontSize: "clamp(1.25rem, 2vw, 2rem)" }}
              >
                Program Unggulan
              </Typography>
              <List
                dense
                data-aos="fade-up"
                data-aos-delay="100"
                sx={{
                  fontSize: {
                    xs: "0.875rem", // mobile
                    sm: "1rem", // tablet
                    md: "1rem", // desktop
                  },
                  py: 0.5,
                  mt: "-5px",
                }}
              >
                {(() => {
                  const unggulan = content.find(
                    (c) => c.paramKey === "program_unggulan",
                  )?.paramValue;
                  try {
                    const arr = JSON.parse(unggulan);
                    return arr.map((item, idx) => (
                      <ListItem key={idx} sx={{ py: 0.5, mt: "-5px" }}>
                        <ListItemIcon
                          sx={{
                            minWidth: {
                              xs: 32, // lebih kecil di mobile
                              md: 48, // lebih besar di desktop
                            },
                          }}
                        >
                          <StarBorderTwoToneIcon
                            sx={{
                              fontSize: {
                                xs: "1rem", // mobile
                                md: "1.5rem", // desktop
                              },
                            }}
                            color="inherit"
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={item}
                          sx={{
                            "& .MuiListItemText-primary": {
                              fontSize: {
                                xs: "0.875rem", // mobile
                                md: "1rem", // desktop
                              },
                            },
                          }}
                        />
                      </ListItem>
                    ));
                  } catch {
                    return null;
                  }
                })()}
              </List>
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
            {/* berita */}
            <Box id="berita" sx={{ scrollMarginTop: "64px" }}>
              <Typography
                variant="h4"
                gutterBottom
                data-aos="fade-up"
                data-aos-delay="100"
                sx={{
                  fontSize: "clamp(1.25rem, 2.5vw, 2.5rem)",
                  fontWeight: "bold",
                }}
              >
                Berita
              </Typography>

              {(() => {
                const berita = content.find(
                  (c) => c.paramKey === "berita",
                )?.paramValue;
                try {
                  const arr = JSON.parse(berita); // array of string
                  return arr.map((item, idx) => (
                    <Box
                      key={idx}
                      data-aos="fade-up"
                      data-aos-delay="100"
                      sx={{
                        bgcolor: "background.default", // warna agak gelap
                        // color: "white", // teks putih biar kontras
                        borderRadius: 4, // sudut melengkung
                        p: 2, // padding dalam box
                        mb: 2, // jarak antar berita
                        border: "1.5px solid #1976d2",
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "clamp(0.875rem, 2vw, 1rem)",
                          textAlign: "justify", // rata kiri kanan
                          textIndent: "2rem", // awal paragraf menjorok
                          wordBreak: "break-word", // pecah kata panjang
                        }}
                      >
                        {item}
                      </Typography>
                    </Box>
                  ));
                } catch {
                  return null;
                }
              })()}
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
            {/* agenda */}
            <Box id="agenda" sx={{ scrollMarginTop: "64px" }}>
              <Typography
                variant="h4"
                gutterBottom
                data-aos="fade-up"
                data-aos-delay="100"
                sx={{
                  fontSize: "clamp(1.25rem, 2.5vw, 2.5rem)",
                  fontWeight: "bold",
                }}
              >
                Agenda
              </Typography>
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
                  // pastikan param_value di DB berupa JSON array
                  return (
                    <Box
                      data-aos="fade-up"
                      data-aos-delay="100"
                      sx={{
                        bgcolor: "background.default", // warna agak gelap
                        // color: "white", // teks putih biar kontras
                        borderRadius: 4, // sudut melengkung
                        p: 2, // padding dalam box
                        mb: 2, // jarak antar berita
                        border: "1.5px solid #1976d2",
                        // minHeight: "80vh"
                      }}
                    >
                      <List
                        data-aos="fade-up"
                        data-aos-delay="100"
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
                                  fontSize: { xs: "0.875rem", md: "1rem" },
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
            {/* kegiatan */}
            <Box id="kegiatan" sx={{ scrollMarginTop: "64px" }}>
              <Typography
                variant="h4"
                gutterBottom
                data-aos="fade-up"
                data-aos-delay="100"
                sx={{
                  fontSize: "clamp(1.25rem, 2.5vw, 2.5rem)",
                  fontWeight: "bold",
                }}
              >
                Kegiatan
              </Typography>
              <Box sx={{ p: 4, backgroundColor: "#A9A9A9", borderRadius: 4, mb: 0.5 }}>
                <KegiatanSlider content={content} />
              </Box>
            </Box>
          </Container>
        </Box>
        {/* </Container> */}
        {/* Footer */}
        <Box
          id="kontak"
          sx={{
            bgcolor: "#1976d2",
            color: "white",
            py: 4,
            textAlign: "center",
          }}
        >
          <Typography
            data-aos="fade-right"
            data-aos-delay="100"
            sx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}
          >
            Portal Sekolah
          </Typography>
          <Typography
            data-aos="fade-right"
            data-aos-delay="100"
            sx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}
          >
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
              <EmailIcon
                sx={{
                  fontSize: { xs: "1rem", md: "1.5rem" },
                }}
              />
              <Typography
                data-aos="fade-right"
                data-aos-delay="100"
                sx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}
              >
                portalSekolah@gmail.com
              </Typography>
            </Box>
            <Box
              component="a"
              href="https://wa.me/6285214210194"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                // width: "200px",
                gap: { xs: 0.5, sm: 1 },
                transition: "all 0.3s",
                "&:hover": {
                  textDecoration: "none",
                  bgcolor: "primary.dark", // teks & icon berubah warna saat hover
                  color: "white",
                  boxShadow: 3,
                  transform: "translateY(-2px) scale(1.05)", // sedikit naik
                },
                p: { xs: 0.5, md: 1 },
                borderRadius: 2,
              }}
            >
              <WhatsAppIcon
                sx={{
                  fontSize: { xs: "1rem", md: "1.5rem" },
                }}
              />
              <Typography
                data-aos="fade-right"
                data-aos-delay="100"
                sx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}
              >
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
            <Typography
              data-aos="fade-left"
              data-aos-delay="100"
              sx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}
            >
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
                gap: { xs: 0.5, sm: 1 },
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
                p: { xs: 0.5, md: 1 },
                borderRadius: 2,
              }}
            >
              <FacebookIcon
                sx={{
                  fontSize: { xs: "1rem", md: "1.5rem" },
                }}
              />
              <Typography
                data-aos="fade-left"
                data-aos-delay="100"
                sx={{
                  fontWeight: 500,
                  position: "relative",
                  textDecoration: "none",
                  fontSize: { xs: "0.875rem", md: "1rem" },
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
                gap: { xs: 0.5, sm: 1 },
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
                p: { xs: 0.5, md: 1 },
                borderRadius: 2,
              }}
            >
              <TwitterIcon
                sx={{
                  fontSize: { xs: "1rem", md: "1.5rem" },
                }}
              />
              <Typography
                data-aos="fade-left"
                data-aos-delay="100"
                sx={{
                  fontWeight: 500,
                  position: "relative",
                  textDecoration: "none",
                  fontSize: { xs: "0.875rem", md: "1rem" },
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
                gap: { xs: 0.5, sm: 1 },
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
                p: { xs: 0.5, md: 1 },
                borderRadius: 2,
              }}
            >
              <YouTubeIcon
                sx={{
                  fontSize: { xs: "1rem", md: "1.5rem" },
                }}
              />
              <Typography
                data-aos="fade-left"
                data-aos-delay="100"
                sx={{
                  fontWeight: 500,
                  position: "relative",
                  textDecoration: "none",
                  fontSize: { xs: "0.875rem", md: "1rem" },
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
                gap: { xs: 0.5, sm: 1 },
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
                p: { xs: 0.5, md: 1 },
                borderRadius: 2,
              }}
            >
              <InstagramIcon
                sx={{
                  fontSize: { xs: "1rem", md: "1.5rem" }, // icon lebih kecil di mobile
                }}
              />
              <Typography
                data-aos="fade-left"
                data-aos-delay="100"
                sx={{
                  fontWeight: 500,
                  position: "relative",
                  textDecoration: "none",
                  fontSize: { xs: "0.875rem", md: "1rem" },
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
            sx={{
              color: "white",
              textAlign: "left",
              mt: 1,
              pl: 4,
              fontSize: { xs: "0.875rem", md: "1rem" },
            }}
            // data-aos="fade-up"
            // data-aos-delay="100"
          >
            © 2026 Portal Sekolah | All Right Reserved
          </Typography>
        </Box>
      </Box>
    </>
  );
}

export default Beranda;
