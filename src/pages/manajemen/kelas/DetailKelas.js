import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
  Divider,
  Grid,
  Button,
  TextField,
  FormControl,
  MenuItem,
  Select,
  InputLabel,
  FormLabel,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import KelasService from "./KelasService";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArchiveIcon from "@mui/icons-material/Archive";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import { useDebounce } from "../../../hook/UseDebounce";
import PopUpModal from "../../../components/PopUpModal";
import ConfirmModal from "../../../components/DialogPopup";
import AddNewSiswa from "./AddNewSiswa";

export default function DetailKelas() {
  const navigate = useNavigate();
  const location = useLocation();
  console.log("LOCATION:", location);
  const user = JSON.parse(localStorage.getItem("userLogin"));
  const allowedNomorInduk = ["A0000001", "A0000002"];
  console.log("USERLOGIN:", user);
  const { id } = useParams(); // ambil classroomId dari URL
  const [loading, setLoading] = useState(true);
  const [openToast, setOpenToast] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [kelasDetail, setKelasDetail] = useState([]);
  const [page, setPage] = useState(0); // halaman dimulai dari 0
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalSiswa, setTotalSiswa] = useState(0);
  const [dataSiswa, setDataSiswa] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);
  const [dataKelas, setDataKelas] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [dataPpdb, setDataPpdb] = useState([]);
  const [selectedPpdb, setSelectedPpdb] = useState(null);
  const [openModalAddNew, setOpenModalAddNew] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    nama: "",
    nis: "",
    tanggalLahir: "",
    alamat: "",
    namaAyah: "",
    namaIbu: "",
    noHandphone: "",
    jenisKelamin: null,
    classroomId: null,
    email: "",
  });
  const [errorChangeClass, setErrorChangeClass] = useState(null);
  const [successCreateEdit, setSuccessCreateEdit] = useState(false);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [idDelete, setIdDelete] = useState(null);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await KelasService.getKelasDetail({
        id,
        page,
        size: rowsPerPage,
      });
      console.log("RESPONSE DETAIL:", res);
      if (res.success) {
        setKelasDetail(res?.data.data);
        // setDataSiswa(res.data.data.siswa.content);
        // ambil content siswa
        const siswaContent = res.data.data.siswa.content || [];
        // sort ascending berdasarkan nama
        const sortedSiswa = [...siswaContent].sort((a, b) =>
          a.nama.localeCompare(b.nama, "id", { sensitivity: "base" }),
        );
        setDataSiswa(sortedSiswa);
        setTotalSiswa(res.data.data.siswa?.totalElements);
      } else {
        setErrorMsg(res.message || "Data kelas tidak ditemukan");
        setOpenToast(true);
      }
    } catch (err) {
      console.error("Error fetch classroom detail:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFilteredData = async (keyword) => {
    setLoading(true);
    try {
      const response = await KelasService.searchSiswa({
        id,
        page,
        size: rowsPerPage,
        keyword,
      });
      console.log("RESPONSE DATA SEARCH SISWA:", response);
      if (response.success) {
        setDataSiswa(response.data?.data.siswa.content);
        setTotalSiswa(response.data?.data.siswa.totalElements || 0);
      } else {
        setErrorMsg(response.message || "Gagal search data siswa");
        setOpenToast(true);
      }
    } catch (err) {
      setOpenToast(true);
      setErrorMsg(err.message || "Terjadi kesalahan tak terduga");
      console.error("Gagal search data siswa:", err);
    } finally {
      setLoading(false);
    }
  };

  const getClassroom = async () => {
    try {
      const response = await KelasService.getClassAll();
      if (response.success) {
        let kelas = response.data.data.map((item) => ({
          id: item.id,
          name: item.name,
          isActive: item?.isActive,
        }));

        // ✅ custom sort: urutkan berdasarkan angka dulu, lalu huruf
        kelas.sort((a, b) => {
          const [numA, charA] = [
            parseInt(a.name),
            a.name.replace(/[0-9]/g, ""),
          ];
          const [numB, charB] = [
            parseInt(b.name),
            b.name.replace(/[0-9]/g, ""),
          ];

          if (numA === numB) {
            return charA.localeCompare(charB); // urut huruf A, B, C
          }
          return numA - numB; // urut angka 10, 11, 12
        });

        setDataKelas(kelas);
      } else {
        setErrorMsg(response.message || "Gagal mengambil data classroom");
        setOpenToast(true);
      }
    } catch (err) {
      setErrorMsg(err.message || "Terjadi kesalahan tak terduga");
      setOpenToast(true);
    }
  };

  const handleOpenCreate = () => {
    setSelectedPpdb(null);
    setOpenModalAddNew(true);
  };

  const handleOpenEdit = (el) => {
    setIsEditMode(true);
    setFormData({
      id: el.id,
      nama: el.nama,
      nis: el.nis,
      tanggalLahir: el.tanggalLahir,
      alamat: el.alamat,
      namaAyah: el.namaAyah,
      namaIbu: el.namaIbu,
      noHandphone: el.noHandphone,
      jenisKelamin: el?.jenisKelamin,
      classroomId: el.classroomId,
      email: el.email,
    });
    setOpenModal(true);
  };

  const handleSubmit = async () => {
    try {
      if (isEditMode) {
        const response = await KelasService.updateSiswa(formData);
        console.log("RESPONSE UPDATE SISWA:", response);
        if (response.success) {
          setSuccessCreateEdit(true);
        } else {
          setErrorMsg(response.message || "Gagal update siswa");
          setOpenToast(true);
        }
      }
      // else {
      //   const response = await KelasService.createSiswa(formData);
      //   console.log("RESPONSE CREATE SISWA:", response);
      //   if (response.success) {
      //     setSuccessCreateEdit(true);
      //   } else {
      //     setErrorMsg(response.message || "Gagal tambah data siswa");
      //     setOpenToast(true);
      //   }
      // }
    } catch (err) {
      setOpenToast(true);
      setErrorMsg(err.message || "Terjadi kesalahan tak terduga");
      console.error("Gagal simpan siswa:", err);
    }
  };

  const deleteSiswa = async (siswaId) => {
    try {
      const response = await KelasService.deleteSiswa(siswaId);
      console.log("RES DELETE SISWA:", response);
      if (response.success) {
        setOpenDeleteModal(true);
      } else {
        setErrorMsg(response.message || "Gagal hapus siswa");
        setOpenToast(true);
      }
    } catch (err) {
      setOpenToast(true);
      setErrorMsg(err.message || "Terjadi kesalahan tak terduga");
      console.error("Gagal hapus siswa:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDisabledEdit = () => {
    if (user?.role === "ADMIN") {
      if (!allowedNomorInduk.includes(user?.nomorInduk)) {
        return true;
      } else {
        return false;
      }
    } else if (user?.role === "GURU") {
      if (user?.nomorInduk !== kelasDetail?.waliGuruNip) {
        return true;
      } else {
        return false;
      }
    }

    return true;
  };

  const handleDisabledDelete = () => {
    if (user?.role === "ADMIN") {
      if (!allowedNomorInduk.includes(user?.nomorInduk)) {
        return true;
      } else {
        return false;
      }
    } else if (user?.role === "GURU") {
      // if (user?.nomorInduk !== kelasDetail?.waliGuruNip) {
      //   return true;
      // } else {
      //   return false;
      // }
      return true;
    }

    return true;
  };

  const getDataPpdb = async () => {
    try {
      const response = await KelasService.getDataPpdb();
      console.log("RESPONSE DATA PPDB:", response);
      if (response.success) {
        const data = response.data?.data.filter(
          (el) => el.status === "DITERIMA" && el.hasClassroom === false,
        );
        setDataPpdb(data);
      } else {
        setErrorMsg(response.message || "Gagal mendapatkan data PPDB");
        setOpenToast(true);
      }
    } catch (err) {
      setOpenToast(true);
      setErrorMsg(err.message || "Terjadi kesalahan tak terduga");
      console.error("Gagal mendapatkan data PPDB:", err);
    }
  };

  const handleArsipClick = (el) => {};

  const handleSubmitAddNew = async () => {
    setLoading(true);
    try {
      const payload = {
        nama: selectedPpdb?.nama,
        email: selectedPpdb?.email,
        tanggalLahir: selectedPpdb?.tanggalLahir,
        alamat: selectedPpdb?.alamat,
        noHandphone: selectedPpdb?.noHandphone,
        namaAyah: selectedPpdb?.namaAyah,
        namaIbu: selectedPpdb?.namaIbu,
        jenisKelamin: selectedPpdb?.jenisKelamin,
        classroomId: id,
        ppdbRegistrationId: selectedPpdb?.id,
      };
      const response = await KelasService.createSiswaPpdb(payload);
      console.log("RESPONSE CREATE SISWA:", response);
      if (response.success) {
        getDataPpdb();
        setSuccessCreateEdit(true);
      } else {
        setErrorMsg(response.message || "Gagal tambah data siswa");
        setOpenToast(true);
      }
    } catch (err) {
      setOpenToast(true);
      setErrorMsg(err.message || "Terjadi kesalahan tak terduga");
      console.error("Gagal simpan siswa:", err);
    } finally {
      setLoading(false);
    }
  };

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  useEffect(() => {
    if (debouncedSearch.length >= 2) {
      fetchFilteredData(debouncedSearch);
    } else {
      fetchData();
    }
  }, [id, debouncedSearch, page, rowsPerPage]);

  useEffect(() => {
    getClassroom();
    getDataPpdb();
  }, []);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

  console.log("DETAIL KELAS:", kelasDetail);
  console.log("FORM DATA SISWA:", formData);
  console.log("ID:", id);
  console.log("SELECTED PPDB:", selectedPpdb);
  console.log("DATA PPDB:", dataPpdb);

  return (
    <Box>
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

      {/* add/edit siswa */}
      <Dialog
        open={openModal}
        onClose={(event, reason) => {
          // blok kalau close karena klik backdrop atau tekan ESC
          if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
            setOpenModal(false);
          }
        }}
        disableEscapeKeyDown
        fullWidth
        maxWidth="sm"
        sx={{
          "& .MuiPaper-root": {
            borderRadius: 3,
            border: "2px solid #1976d2",
            padding: 2,
          },
        }}
      >
        <DialogTitle style={{ fontWeight: "bold" }}>
          {isEditMode ? "Edit Siswa" : "Tambah Siswa"}
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField
              label="Nama"
              value={formData.nama}
              onChange={(e) =>
                setFormData({ ...formData, nama: e.target.value })
              }
              fullWidth
              sx={{
                "& .MuiInputLabel-root": {
                  fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" }, // label responsif
                },
                "& .MuiInputBase-input": {
                  fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" }, // isi input responsif
                },
              }}
            />
            <TextField
              label="NIS"
              value={formData.nis}
              onChange={(e) =>
                setFormData({ ...formData, nis: e.target.value })
              }
              fullWidth
              sx={{
                "& .MuiInputLabel-root": {
                  fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" }, // label responsif
                },
                "& .MuiInputBase-input": {
                  fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" }, // isi input responsif
                },
              }}
              disabled
            />
            <FormControl
              fullWidth
              margin="normal"
              sx={{
                "& .MuiInputLabel-root": {
                  fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" }, // label responsif
                },
                "& .MuiSelect-select": {
                  fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" }, // isi select responsif
                  // padding: { xs: "6px 8px", sm: "8px 10px", md: "10px 12px" }, // padding responsif
                },
              }}
            >
              <InputLabel id="kelas-label">Assign Kelas</InputLabel>
              <Select
                labelId="kelas-label"
                label="Assign Kelas"
                value={formData?.classroomId}
                onChange={(e) => {
                  const target = e.target.value;
                  const nonActiveClass = dataKelas.find(
                    (el) => el?.id === target,
                  );
                  if (nonActiveClass && nonActiveClass?.isActive === false) {
                    setErrorChangeClass(
                      "Kelas yang dipilih tidak aktif, silahkan aktifkan terlebih dulu",
                    );
                    return;
                  }
                  setFormData({ ...formData, classroomId: target });
                }}
              >
                {dataKelas.map((gl) => (
                  <MenuItem key={gl.id} value={gl.id}>
                    {gl.name}
                  </MenuItem>
                ))}
              </Select>
              {errorChangeClass && (
                <div className="bg-red-100 text-red-700 p-2 rounded flex justify-between">
                  <span>{errorChangeClass}</span>
                  <button onClick={() => setErrorChangeClass(null)}>✕</button>
                </div>
              )}
            </FormControl>
            <TextField
              label="Tanggal Lahir"
              type="date"
              value={formData.tanggalLahir}
              onChange={(e) =>
                setFormData({ ...formData, tanggalLahir: e.target.value })
              }
              InputLabelProps={{ shrink: true }}
              fullWidth
              sx={{
                "& .MuiInputLabel-root": {
                  fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" }, // label responsif
                },
                "& .MuiInputBase-input": {
                  fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" }, // isi input responsif
                },
              }}
            />
            <FormControl
              sx={{
                "& .MuiInputLabel-root": {
                  fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" }, // label responsif
                },
                "& .MuiSelect-select": {
                  fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" }, // isi select responsif
                  // padding: { xs: "6px 8px", sm: "8px 10px", md: "10px 12px" }, // padding responsif
                },
              }}
            >
              <FormLabel id="jenisKelamin-label">Jenis Kelamin</FormLabel>
              <RadioGroup
                row
                aria-labelledby="jenisKelamin-label"
                name="jenisKelamin"
                value={formData?.jenisKelamin || ""}
                onChange={(e) =>
                  setFormData({ ...formData, jenisKelamin: e.target.value })
                }
              >
                <FormControlLabel
                  sx={{
                    "& .MuiFormControlLabel-label": {
                      fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" }, // label responsif
                    },
                  }}
                  value="LAKI_LAKI"
                  control={<Radio />}
                  label="Laki-laki"
                />
                <FormControlLabel
                  sx={{
                    "& .MuiFormControlLabel-label": {
                      fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" }, // label responsif
                    },
                  }}
                  value="PEREMPUAN"
                  control={<Radio />}
                  label="Perempuan"
                />
              </RadioGroup>
            </FormControl>
            <TextField
              label="Nama Ayah"
              value={formData.namaAyah}
              onChange={(e) =>
                setFormData({ ...formData, namaAyah: e.target.value })
              }
              fullWidth
              sx={{
                "& .MuiInputLabel-root": {
                  fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" }, // label responsif
                },
                "& .MuiInputBase-input": {
                  fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" }, // isi input responsif
                },
              }}
            />
            <TextField
              label="Nama Ibu"
              value={formData.namaIbu}
              onChange={(e) =>
                setFormData({ ...formData, namaIbu: e.target.value })
              }
              fullWidth
              sx={{
                "& .MuiInputLabel-root": {
                  fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" }, // label responsif
                },
                "& .MuiInputBase-input": {
                  fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" }, // isi input responsif
                },
              }}
            />
            <TextField
              label="No Handphone"
              value={formData.noHandphone}
              onChange={(e) =>
                setFormData({ ...formData, noHandphone: e.target.value })
              }
              fullWidth
              sx={{
                "& .MuiInputLabel-root": {
                  fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" }, // label responsif
                },
                "& .MuiInputBase-input": {
                  fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" }, // isi input responsif
                },
              }}
            />
            <TextField
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              fullWidth
              sx={{
                "& .MuiInputLabel-root": {
                  fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" }, // label responsif
                },
                "& .MuiInputBase-input": {
                  fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" }, // isi input responsif
                },
              }}
              error={formData?.email && !isValidEmail(formData.email)}
              helperText={
                formData?.email && !isValidEmail(formData.email)
                  ? "Format email tidak valid"
                  : ""
              }
            />
            <TextField
              label="Alamat"
              value={formData.alamat}
              onChange={(e) =>
                setFormData({ ...formData, alamat: e.target.value })
              }
              fullWidth
              sx={{
                "& .MuiInputLabel-root": {
                  fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" }, // label responsif
                },
                "& .MuiInputBase-input": {
                  fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" }, // isi input responsif
                },
              }}
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => setOpenModal(false)}
            variant="outlined"
            color="secondary"
            sx={{ textTransform: "none" }}
          >
            Batal
          </Button>
          <Button
            onClick={handleSubmit} // bikin fungsi handleSubmit untuk POST /api/siswa
            variant="contained"
            color="primary"
            sx={{ textTransform: "none" }}
            disabled={
              !formData?.nama ||
              !formData?.alamat ||
              !formData?.nis ||
              !formData?.tanggalLahir ||
              !formData?.email ||
              !formData?.namaAyah ||
              !formData?.namaIbu ||
              !formData?.noHandphone ||
              !formData?.jenisKelamin
            }
          >
            Simpan
          </Button>
        </DialogActions>
      </Dialog>

      {/* pop up add/edit sukses */}
      <PopUpModal
        open={successCreateEdit}
        title="Berhasil"
        content={
          isEditMode
            ? "Data siswa berhasil diperbarui."
            : "Data siswa berhasil ditambahkan."
        }
        onClose={() => {
          setSuccessCreateEdit(false);
          if (debouncedSearch.length >= 2 || page > 0) {
            setSearchTerm("");
            setPage(0);
          } else {
            fetchData();
          }
          setOpenModal(false);
        }}
        icon={<CheckCircleOutlinedIcon sx={{ fontSize: 48, color: "green" }} />}
        maxWidth="sm"
        // fullWidth={false}
      />

      {/* CONFIRM DELETE */}
      <ConfirmModal
        open={openConfirmDelete}
        title="Konfirmasi Hapus"
        question="Apakah Anda yakin ?"
        icon={
          <HelpOutlineOutlinedIcon sx={{ fontSize: 75, color: "#f44336" }} />
        }
        onConfirm={() => {
          deleteSiswa(idDelete);
          setOpenConfirmDelete(false);
        }}
        onCancel={() => {
          setOpenConfirmDelete(false);
          setIdDelete(null);
        }}
      />

      {/* POP UP SUKSES DELETE */}
      <PopUpModal
        open={openDeleteModal}
        title="Berhasil"
        content="Data siswa berhasil dihapus."
        onClose={() => {
          setOpenDeleteModal(false);
          if (debouncedSearch.length >= 2 || page > 0) {
            setSearchTerm("");
            setPage(0);
          } else {
            fetchData();
          }
        }}
        icon={<CheckCircleOutlinedIcon sx={{ fontSize: 48, color: "green" }} />}
        maxWidth="sm"
        // fullWidth={false}
      />

      <Box mb={1}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/manajemen/kelas")}
          sx={{
            textTransform: "none",
            boxShadow: 2,
            borderRadius: 4,
            // px: { xs: 2, sm: 3, md: 4 }, // padding horizontal menyesuaikan layar
            // py: { xs: 1, sm: 1.5 }, // padding vertical menyesuaikan layar
            fontSize: { xs: "0.50rem", sm: "0.75rem", md: "1rem" }, // font size adaptif
            width: { xs: "20%", sm: "auto" }, // di mobile full width, di desktop auto
          }}
        >
          Kembali
        </Button>
      </Box>

      <Typography
        variant="h5"
        gutterBottom
        sx={{
          fontSize: { xs: "0.75rem", sm: "1rem", md: "1.25rem" }, // responsif
        }}
      >
        Detail Kelas
      </Typography>
      <Box>
        <Box display="flex" alignItems="center" mb={1}>
          <Typography
            variant="subtitle1"
            sx={{
              width: 120,
              fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" },
            }}
          >
            Nama Kelas
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              width: 20,
              fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" },
            }}
          >
            :
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" } }}
          >
            {kelasDetail.name}
          </Typography>
        </Box>

        <Box display="flex" alignItems="center" mb={1}>
          <Typography
            variant="subtitle1"
            sx={{
              width: 120,
              fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" },
            }}
          >
            Tingkatan
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              width: 20,
              fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" },
            }}
          >
            :
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" } }}
          >
            {kelasDetail.gradeLevelName}
          </Typography>
        </Box>

        <Box display="flex" alignItems="center" mb={1}>
          <Typography
            variant="subtitle1"
            sx={{
              width: 120,
              fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" },
            }}
          >
            Wali Kelas
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              width: 20,
              fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" },
            }}
          >
            :
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" } }}
          >
            {kelasDetail.waliGuruName}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ mb: 1, mt: 1 }} />
      <Box sx={{ textAlign: "center" }}>
        <Typography
          variant="h5"
          fontWeight="bold"
          color="primary"
          sx={{
            fontSize: { xs: "0.95rem", sm: "1,25rem", md: "1.5rem" },
          }}
        >
          Daftar Siswa {kelasDetail.name}
        </Typography>
      </Box>
      <Box mt={1}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
          px={1}
        >
          {/* Kiri: Cari Siswa */}
          <Tooltip
            title="Cari Nama Siswa"
            placement="bottom"
            arrow
            enterDelay={300}
            leaveDelay={200}
            componentsProps={{
              tooltip: {
                sx: {
                  bgcolor: "#333",
                  color: "#fff",
                  fontSize: { xs: "0.5rem", sm: "0.7rem", md: "0.8rem" },
                  borderRadius: "4px",
                  boxShadow: 3,
                },
              },
            }}
          >
            <TextField
              label="Cari Siswa"
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(0);
              }}
              sx={{
                "& .MuiInputLabel-root": {
                  color: "rgba(0, 0, 0, 0.3)",
                  fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.9rem" },
                },
                fontSize: { xs: "0.5rem", sm: "0.7rem", md: "0.8rem" },
                width: "170px",
              }}
            />
          </Tooltip>

          {/* Kanan: Tambah Siswa Baru */}
          {kelasDetail?.gradeLevelId === 1 && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenCreate}
              // sx={{ textTransform: "none", boxShadow: 2, width: "auto" }}
              sx={{
                textTransform: "none",
                boxShadow: 2,
                borderRadius: 4,
                // px: { xs: 2, sm: 3, md: 4 }, // padding horizontal menyesuaikan layar
                // py: { xs: 1, sm: 1.5 }, // padding vertical menyesuaikan layar
                fontSize: { xs: "0.50rem", sm: "0.75rem", md: "1rem" }, // font size adaptif
                width: { xs: "40%", sm: "auto" }, // di mobile full width, di desktop auto
              }}
              disabled={handleDisabledEdit()}
            >
              Tambah Siswa Baru
            </Button>
          )}
        </Box>
        <TableContainer
          component={Paper}
          elevation={3}
          sx={{ mt: 2, overflowX: "auto" }}
        >
          <Table sx={{ minWidth: 900 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    borderRight: "1px solid #ccc",
                    // maxWidth: "40px",
                    textAlign: "center",
                    fontSize: { xs: "0.50rem", sm: "0.65rem", md: "0.85rem" },
                  }}
                >
                  Nomor
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    borderRight: "1px solid #ccc",
                    // maxWidth: "40px",
                    textAlign: "center",
                    fontSize: { xs: "0.50rem", sm: "0.65rem", md: "0.85rem" },
                  }}
                >
                  Nama
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    borderRight: "1px solid #ccc",
                    // maxWidth: "40px",
                    textAlign: "center",
                    fontSize: { xs: "0.50rem", sm: "0.65rem", md: "0.85rem" },
                  }}
                >
                  NIS
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    borderRight: "1px solid #ccc",
                    // maxWidth: "40px",
                    textAlign: "center",
                    fontSize: { xs: "0.50rem", sm: "0.65rem", md: "0.85rem" },
                  }}
                >
                  Email
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    borderRight: "1px solid #ccc",
                    // maxWidth: "40px",
                    textAlign: "center",
                    fontSize: { xs: "0.50rem", sm: "0.65rem", md: "0.85rem" },
                  }}
                >
                  Tanggal Lahir
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    borderRight: "1px solid #ccc",
                    // maxWidth: "40px",
                    textAlign: "center",
                    fontSize: { xs: "0.50rem", sm: "0.65rem", md: "0.85rem" },
                  }}
                >
                  No Telepon
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    borderRight: "1px solid #ccc",
                    // maxWidth: "40px",
                    textAlign: "center",
                    fontSize: { xs: "0.50rem", sm: "0.65rem", md: "0.85rem" },
                  }}
                >
                  Jenis Kelamin
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    borderRight: "1px solid #ccc",
                    // maxWidth: "40px",
                    textAlign: "center",
                    fontSize: { xs: "0.50rem", sm: "0.65rem", md: "0.85rem" },
                  }}
                >
                  Nama Ayah
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    borderRight: "1px solid #ccc",
                    // maxWidth: "40px",
                    textAlign: "center",
                    fontSize: { xs: "0.50rem", sm: "0.65rem", md: "0.85rem" },
                  }}
                >
                  Nama Ibu
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    borderRight: "1px solid #ccc",
                    // maxWidth: "40px",
                    textAlign: "center",
                    minWidth: "100px",
                    fontSize: { xs: "0.50rem", sm: "0.65rem", md: "0.85rem" },
                  }}
                >
                  Alamat
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    // borderRight: "1px solid #ccc",
                    maxWidth: "40px",
                    textAlign: "center",
                    fontSize: { xs: "0.50rem", sm: "0.65rem", md: "0.85rem" },
                  }}
                >
                  Aksi
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dataSiswa.length > 0 ? (
                dataSiswa.map((s, index) => (
                  <TableRow
                    key={s.id}
                    sx={{
                      "&:hover": { backgroundColor: "#fafafa" },
                      "& td": { borderBottom: "1px solid #ddd" },
                    }}
                  >
                    <TableCell
                      sx={{
                        // fontWeight: "bold",
                        borderRight: "1px solid #ccc",
                        // maxWidth: "40px",
                        textAlign: "center",
                        fontSize: {
                          xs: "0.50rem",
                          sm: "0.65rem",
                          md: "0.85rem",
                        },
                      }}
                    >
                      {index + 1}
                    </TableCell>
                    <TableCell
                      sx={{
                        // fontWeight: "bold",
                        borderRight: "1px solid #ccc",
                        // maxWidth: "40px",
                        textAlign: "left",
                        fontSize: {
                          xs: "0.50rem",
                          sm: "0.65rem",
                          md: "0.85rem",
                        },
                      }}
                    >
                      {s.nama}
                    </TableCell>
                    <TableCell
                      sx={{
                        // fontWeight: "bold",
                        borderRight: "1px solid #ccc",
                        // maxWidth: "40px",
                        textAlign: "center",
                        fontSize: {
                          xs: "0.50rem",
                          sm: "0.65rem",
                          md: "0.85rem",
                        },
                      }}
                    >
                      {s.nis}
                    </TableCell>
                    <TableCell
                      sx={{
                        // fontWeight: "bold",
                        borderRight: "1px solid #ccc",
                        // maxWidth: "40px",
                        textAlign: "left",
                        fontSize: {
                          xs: "0.50rem",
                          sm: "0.65rem",
                          md: "0.85rem",
                        },
                      }}
                    >
                      {s.email}
                    </TableCell>
                    <TableCell
                      sx={{
                        // fontWeight: "bold",
                        borderRight: "1px solid #ccc",
                        // maxWidth: "40px",
                        textAlign: "center",
                        fontSize: {
                          xs: "0.50rem",
                          sm: "0.65rem",
                          md: "0.85rem",
                        },
                      }}
                    >
                      {s.tanggalLahir}
                    </TableCell>
                    <TableCell
                      sx={{
                        // fontWeight: "bold",
                        borderRight: "1px solid #ccc",
                        // maxWidth: "40px",
                        textAlign: "center",
                        fontSize: {
                          xs: "0.50rem",
                          sm: "0.65rem",
                          md: "0.85rem",
                        },
                      }}
                    >
                      {s.noHandphone}
                    </TableCell>
                    <TableCell
                      sx={{
                        // fontWeight: "bold",
                        borderRight: "1px solid #ccc",
                        // maxWidth: "40px",
                        textAlign: "center",
                        fontSize: {
                          xs: "0.50rem",
                          sm: "0.65rem",
                          md: "0.85rem",
                        },
                      }}
                    >
                      {s.jenisKelamin === "LAKI_LAKI" ? "L" : "P"}
                    </TableCell>
                    <TableCell
                      sx={{
                        // fontWeight: "bold",
                        borderRight: "1px solid #ccc",
                        // maxWidth: "40px",
                        textAlign: "left",
                        fontSize: {
                          xs: "0.50rem",
                          sm: "0.65rem",
                          md: "0.85rem",
                        },
                      }}
                    >
                      {s.namaAyah}
                    </TableCell>
                    <TableCell
                      sx={{
                        // fontWeight: "bold",
                        borderRight: "1px solid #ccc",
                        // maxWidth: "40px",
                        textAlign: "left",
                        fontSize: {
                          xs: "0.50rem",
                          sm: "0.65rem",
                          md: "0.85rem",
                        },
                      }}
                    >
                      {s.namaIbu}
                    </TableCell>
                    <TableCell
                      sx={{
                        // fontWeight: "bold",
                        borderRight: "1px solid #ccc",
                        // maxWidth: "40px",
                        textAlign: "left",
                        minWidth: "200px",
                        fontSize: {
                          xs: "0.50rem",
                          sm: "0.65rem",
                          md: "0.85rem",
                        },
                      }}
                    >
                      {s.alamat}
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Edit">
                        <IconButton
                          color="primary"
                          onClick={() => handleOpenEdit(s)}
                          // disabled={
                          //   user?.nomorInduk !==
                          //   location?.state?.kelas?.waliGuruNip
                          // }
                          disabled={handleDisabledEdit()}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Arsip">
                        <IconButton
                          color="primary"
                          onClick={() => handleArsipClick(s)}
                          disabled={handleDisabledEdit()}
                        >
                          <ArchiveIcon />
                        </IconButton>
                      </Tooltip>

                      {/* <Tooltip title="Delete">
                        <IconButton
                          color="error"
                          onClick={() => {
                            setOpenConfirmDelete(true);
                            setIdDelete(s.id);
                          }}
                          // disabled={
                          //   user?.nomorInduk !==
                          //   location?.state?.kelas?.waliGuruNip
                          // }
                          // disabled={handleDisabledDelete()}
                          // disabled
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip> */}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    Tidak ada siswa di kelas ini
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          {dataSiswa.length > 0 && (
            <TablePagination
              component="div"
              count={totalSiswa}
              page={page}
              onPageChange={(e, newPage) => {
                setPage(newPage);
                fetchData(newPage, rowsPerPage);
              }}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(e) => {
                const newSize = parseInt(e.target.value, 10);
                setRowsPerPage(newSize);
                setPage(0);
                fetchData(0, newSize);
              }}
            />
          )}
        </TableContainer>
      </Box>
      <AddNewSiswa
        openModal={openModalAddNew}
        dataPpdb={dataPpdb}
        setOpenModal={setOpenModalAddNew}
        selectedPpdb={selectedPpdb}
        setSelectedPpdb={setSelectedPpdb}
        handleSubmit={handleSubmitAddNew}
      />
    </Box>
  );
}
