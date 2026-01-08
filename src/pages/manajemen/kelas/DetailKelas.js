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
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import { useDebounce } from "../../../hook/UseDebounce";
import PopUpModal from "../../../components/PopUpModal";
import ConfirmModal from "../../../components/DialogPopup";

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
  const [openModal, setOpenModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    nama: "",
    nis: "",
    tanggalLahir: "",
    alamat: "",
    namaAyah: "",
    namaIbu: "",
    noHandphone: "",
    classroomId: id,
    email: "",
  });
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
          a.nama.localeCompare(b.nama, "id", { sensitivity: "base" })
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

  const handleOpenCreate = () => {
    setIsEditMode(false);
    setFormData({
      id: null,
      nama: "",
      nis: "",
      tanggalLahir: "",
      alamat: "",
      namaAyah: "",
      namaIbu: "",
      noHandphone: "",
      classroomId: id,
      email: "",
    });
    setOpenModal(true);
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
      classroomId: id,
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
      } else {
        const response = await KelasService.createSiswa(formData);
        console.log("RESPONSE CREATE SISWA:", response);
        if (response.success) {
          setSuccessCreateEdit(true);
        } else {
          setErrorMsg(response.message || "Gagal tambah data siswa");
          setOpenToast(true);
        }
      }
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

  const handleDisabled = () => {
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

  useEffect(() => {
    if (debouncedSearch.length >= 2) {
      fetchFilteredData(debouncedSearch);
    } else {
      fetchData();
    }
  }, [id, debouncedSearch, page, rowsPerPage]);

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
            />
            <TextField
              label="NIS"
              value={formData.nis}
              onChange={(e) =>
                setFormData({ ...formData, nis: e.target.value })
              }
              fullWidth
            />
            <TextField
              label="Tanggal Lahir"
              type="date"
              value={formData.tanggalLahir}
              onChange={(e) =>
                setFormData({ ...formData, tanggalLahir: e.target.value })
              }
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              label="Alamat"
              value={formData.alamat}
              onChange={(e) =>
                setFormData({ ...formData, alamat: e.target.value })
              }
              fullWidth
            />
            <TextField
              label="Nama Ayah"
              value={formData.namaAyah}
              onChange={(e) =>
                setFormData({ ...formData, namaAyah: e.target.value })
              }
              fullWidth
            />
            <TextField
              label="Nama Ibu"
              value={formData.namaIbu}
              onChange={(e) =>
                setFormData({ ...formData, namaIbu: e.target.value })
              }
              fullWidth
            />
            <TextField
              label="No Handphone"
              value={formData.noHandphone}
              onChange={(e) =>
                setFormData({ ...formData, noHandphone: e.target.value })
              }
              fullWidth
            />
            <TextField
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              fullWidth
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
              !formData?.noHandphone
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
          sx={{ textTransform: "none" }}
        >
          Kembali
        </Button>
      </Box>

      <Typography variant="h5" gutterBottom>
        Detail Kelas
      </Typography>
      <Box>
        <Box display="flex" alignItems="center" mb={1}>
          <Typography variant="subtitle1" sx={{ width: 120 }}>
            Nama Kelas
          </Typography>
          <Typography variant="subtitle1" sx={{ width: 20 }}>
            :
          </Typography>
          <Typography variant="subtitle1">{kelasDetail.name}</Typography>
        </Box>

        <Box display="flex" alignItems="center" mb={1}>
          <Typography variant="subtitle1" sx={{ width: 120 }}>
            Tingkatan
          </Typography>
          <Typography variant="subtitle1" sx={{ width: 20 }}>
            :
          </Typography>
          <Typography variant="subtitle1">
            {kelasDetail.gradeLevelName}
          </Typography>
        </Box>

        <Box display="flex" alignItems="center" mb={1}>
          <Typography variant="subtitle1" sx={{ width: 120 }}>
            Wali Kelas
          </Typography>
          <Typography variant="subtitle1" sx={{ width: 20 }}>
            :
          </Typography>
          <Typography variant="subtitle1">
            {kelasDetail.waliGuruName}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ mb: 1, mt: 1 }} />
      <Box sx={{ textAlign: "center" }}>
        <Typography variant="h5" fontWeight="bold" color="primary">
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
          <Box
            display="flex"
            flexDirection="column"
            alignItems="flex-end"
            gap={1}
          >
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenCreate}
              // disabled={
              //   user?.nomorInduk !== location?.state?.kelas?.waliGuruNip
              // }
              disabled={handleDisabled()}
              sx={{ textTransform: "none", boxShadow: 2, width: "170px" }}
            >
              Tambah Siswa
            </Button>
            <Tooltip
              title="Cari Nama Siswa"
              placement="bottom"
              arrow
              enterDelay={300}
              leaveDelay={200}
              componentsProps={{
                tooltip: {
                  sx: {
                    bgcolor: "#333", // warna background
                    color: "#fff", // warna teks
                    fontSize: "0.8rem",
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
                  // if (page > 0) {
                  //   setPage(0);
                  // }
                }}
                sx={{
                  "& .MuiInputLabel-root": {
                    color: "rgba(0, 0, 0, 0.3)",
                  },
                  width: "170px",
                }}
              />
            </Tooltip>
          </Box>
        </Box>
        <TableContainer
          component={Paper}
          elevation={3}
          sx={{ mt: 2, overflowX: "auto" }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    borderRight: "1px solid #ccc",
                    // maxWidth: "40px",
                    textAlign: "center",
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
                  }}
                >
                  Nama
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    borderRight: "1px solid #ccc",
                    maxWidth: "40px",
                    textAlign: "center",
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
                      }}
                    >
                      {s.noHandphone}
                    </TableCell>
                    <TableCell
                      sx={{
                        // fontWeight: "bold",
                        borderRight: "1px solid #ccc",
                        // maxWidth: "40px",
                        textAlign: "left",
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
                          disabled={handleDisabled()}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
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
                          disabled={handleDisabled()}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
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
    </Box>
  );
}
