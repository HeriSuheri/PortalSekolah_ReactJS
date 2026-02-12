import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  Snackbar,
  Alert,
  IconButton,
  Avatar,
} from "@mui/material";
import LoginService from "../login/LoginService";
import PopUpModal from "../../components/PopUpModal";
import { ArrowBack } from "@mui/icons-material";
import Tooltip from "@mui/material/Tooltip";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";

const EditProfile = () => {
  const navigate = useNavigate();
  const [foto, setFoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [fotoUrl, setFotoUrl] = useState(null);
  const [successEditFoto, setSuccessEditFoto] = useState(false);
  const [nama, setNama] = useState("");
  const [role, setRole] = useState("");
  const [tanggalLahir, setTanggalLahir] = useState("");
  const [email, setEmail] = useState("");
  const [nomorInduk, setNomorInduk] = useState("");
  const [roleOptions, setRoleOptions] = useState([]);
  const [openToast, setOpenToast] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    console.log("FILE TERPILIH:", file);
    setFoto(file);
    setPreview(URL.createObjectURL(file));
  };

  const getInitials = (name) => {
    if (!name) return "";
    const parts = name.trim().split(" ");
    // Ambil huruf pertama dari maksimal 2 kata
    const initials = parts
      .slice(0, 2)
      .map((p) => p[0].toUpperCase())
      .join("");
    return initials;
  };

  const getRoles = async () => {
    try {
      const response = await LoginService.getRole();
      console.log("RESPONSE GET ROLE:", response);

      if (response?.success) {
        setRoleOptions(response.data || []);
      } else {
        setErrorMsg("Gagal update profil");
        setOpenToast(true);
      }
    } catch (err) {
      console.error("Error get role:", err);
      setErrorMsg(err);
      setOpenToast(true);
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userLogin"));
    console.log("USER DATA:", user);

    setNama(user?.nama || "");
    setRole(user?.role || "");
    setTanggalLahir(user?.tglLahir || ""); // ⬅️ perhatikan key-nya
    setNomorInduk(user?.nomorInduk || "");
    setEmail(user?.email || "");
    setFotoUrl(user?.fotoProfil || ""); // ⬅️ perhatikan key-nya
  }, []);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    getRoles();
  }, []);

  const handleSubmit = async () => {
    if (!foto) return;

    const maxSize = 1 * 1024 * 1024; // 1MB
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];

    if (foto.size > maxSize) {
      setErrorMsg("Ukuran foto maksimal 1MB");
      setOpenToast(true);
      return;
    }

    if (!allowedTypes.includes(foto.type)) {
      setErrorMsg("Tipe foto harus JPG, JPEG, PNG, atau GIF");
      setOpenToast(true);
      return;
    }

    const formData = new FormData();
    formData.append("foto", foto);

    try {
      const response = await LoginService.uploadFoto(formData, nomorInduk);
      console.log("RESPONSE UPLOAD:", response);
      if (response?.success) {
        setFotoUrl(response?.data?.foto_url);
        const user = JSON.parse(localStorage.getItem("userLogin"));
        const dataUser = {
          ...user,
          fotoProfil: response?.data?.foto_url,
        };
        localStorage.setItem("userLogin", JSON.stringify(dataUser));
        setPreview(null);
        setSuccessEditFoto(true);
      } else {
        setErrorMsg("Gagal upload foto");
        setOpenToast(true);
      }
    } catch (err) {
      console.error("Gagal upload foto:", err);
      setErrorMsg("Gagal upload foto");
      setOpenToast(true);
    }
  };

  console.log("Tanggal Lahir:", tanggalLahir);
  console.log("ROLE:", role);
  console.log("FOTO URL:", fotoUrl);
  console.log("PREVIEW:", preview);

  return (
    <>
      <PopUpModal
        open={successEditFoto}
        title="Berhasil"
        content="Foto profil berhasil diubah."
        onClose={() => {
          setSuccessEditFoto(false);
          navigate("/dashboard");
        }}
        icon={<CheckCircleOutlinedIcon sx={{ fontSize: 48, color: "green" }} />}
        maxWidth="sm"
        // fullWidth={false}
      />
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
      <Box
        sx={{
          maxWidth: 500,
          mx: "auto",
          mt: 4,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Tooltip title="Kembali">
            <IconButton
              onClick={() => navigate(-1)}
              color="primary"
              aria-label="kembali"
            >
              <ArrowBack />
            </IconButton>
          </Tooltip>
          <Typography variant="h6">Profile</Typography>
        </Box>

        {/* buatkan disini field untuk foto nya */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
          }}
        >
          {/* <Typography variant="subtitle2">Foto Profil</Typography> */}

          <Box sx={{ mb: 1 }}>
            <img
              // src={`http://localhost:8080${fotoUrl}` || preview || "/default-avatar.png"}
              src={
                preview
                  ? preview
                  : `http://localhost:8080${fotoUrl}` || "/default-avatar.png"
              }
              alt="Preview Foto"
              style={{
                width: "120px",
                height: "120px",
                objectFit: "cover",
                borderRadius: "50%", // bulat
                border: "2px solid #ccc",
              }}
            />
            {/* jika hanya pakai Initial name */}
            {/* <Avatar
              sx={{
                width: 120,
                height: 120,
                bgcolor: "#1976d2",
                fontSize: "2.5rem",
                fontWeight: "bold",
              }}
            >
              {getInitials(nama)}
            </Avatar> */}
          </Box>

          <Button variant="outlined" component="label">
            Edit Foto
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleFotoChange}
            />
          </Button>
        </Box>

        <TextField label="Nomor Induk" value={nomorInduk} disabled fullWidth />
        <TextField
          label="Nama"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          fullWidth
          disabled
        />
        <TextField
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          disabled
        />
        <TextField
          label="Role"
          select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          fullWidth
          disabled
        >
          {roleOptions.map((r) => (
            <MenuItem key={r} value={r}>
              {r}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Tanggal Lahir"
          type="date"
          value={tanggalLahir}
          placeholder="YYYY-MM-DD"
          onChange={(e) => setTanggalLahir(e.target.value)}
          disabled
          fullWidth
        />

        <Button variant="contained" onClick={handleSubmit} disabled={!foto}>
          Simpan Perubahan
        </Button>
      </Box>
    </>
  );
};

export default EditProfile;
