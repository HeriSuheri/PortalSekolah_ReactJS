import Slider from "react-slick";
import { Typography, Box } from "@mui/material";

const KegiatanSlider = ({ content }) => {
  //   let kegiatanData = [];
  //   try {
  //     const kegiatanItem = content.find((c) => c.paramKey === "kegiatan");
  //     kegiatanData = JSON.parse(kegiatanItem?.paramValue || "[]");
  //   } catch {
  //     kegiatanData = [];
  //   }
  const kegiatanItem = content.find((c) => c.paramKey === "kegiatan");
  const kegiatanData = Array.isArray(kegiatanItem?.paramValue)
    ? kegiatanItem.paramValue
    : [];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  console.log("KEGIATAN:", kegiatanData);

  return (
    <Box sx={{ width: "100%", maxWidth: "900px", margin: "0 auto" }}>
      <Slider {...settings}>
        {kegiatanData.map((item, idx) => (
          <div key={idx}>
            <img
              src={item.image}
              alt={item.description}
              style={{
                width: "100%",
                maxWidth: "500px",
                height: "400px",
                objectFit: "cover",
                margin: "0 auto",
                borderRadius: "8px",
              }}
            />
            <p
              style={{
                textAlign: "center",
                marginTop: "12px",
                fontSize: { xs: "0.750rem", md: "1rem" },
                fontWeight: "500",
              }}
            >
              {item.description}
            </p>
          </div>
        ))}
      </Slider>
    </Box>
  );
};

export default KegiatanSlider;
