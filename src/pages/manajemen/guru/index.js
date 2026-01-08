import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
  IconButton,
  Button,
  Box,
  Divider,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import GuruService from "./GuruService";
import PopUpModal from "../../../components/PopUpModal";
import ConfirmModal from "../../../components/DialogPopup";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import { useDebounce } from "../../../hook/UseDebounce";

export default function ManajemenGuru() {
  const [guru, setGuru] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openToast, setOpenToast] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successCreateEdit, setSuccessCreateEdit] = useState(false);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [idDelete, setIdDelete] = useState(null);

  const [openModal, setOpenModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    nip: "",
    nama: "",
    tanggalLahir: null,
    email: "",
  });

  const [page, setPage] = useState(0); // halaman dimulai dari 0
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalGuru, setTotalGuru] = useState(0);

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);

  const user = JSON.parse(localStorage.getItem("userLogin"));
  const allowedNomorInduk = ["A0000001", "A0000002"];

  const handleOpenCreate = () => {
    setIsEditMode(false);
    setFormData({
      id: null,
      nip: "",
      nama: "",
      tanggalLahir: null,
      email: "",
    });
    setOpenModal(true);
  };

  const handleOpenEdit = (guru) => {
    setIsEditMode(true);
    setFormData({
      id: guru.id,
      nip: guru.nip,
      nama: guru.nama,
      tanggalLahir: guru.tanggalLahir,
      email: guru.email,
    });
    setOpenModal(true);
  };

  const handleSubmit = async () => {
    if (!formData?.email.includes("@")) {
      return;
    }
    try {
      if (isEditMode) {
        const response = await GuruService.updateGuru(formData); // kamu bikin endpoint PUT
        console.log("RESPONSE UPDATE GURU:", response);
        if (response.success) {
          setSuccessCreateEdit(true);
        } else {
          setErrorMsg(response.message || "Gagal update data guru");
          setOpenToast(true);
        }
      } else {
        const response = await GuruService.createGuru(formData);
        console.log("RESPONSE CREATE GURU:", response);
        if (response.success) {
          setSuccessCreateEdit(true);
        } else {
          setErrorMsg(response.message || "Gagal tambah data guru");
          setOpenToast(true);
          setIsSubmitted(false);
        }
      }
    } catch (err) {
      setOpenToast(true);
      setErrorMsg(err.message || "Terjadi kesalahan tak terduga");
      console.error("Gagal simpan guru:", err);
    }
  };

  const deleteGuru = async (guruId) => {
    setLoading(true);
    try {
      const response = await GuruService.deleteGr(guruId);
      console.log("RES DELETE ADMIN:", response);
      if (response.success) {
        setLoading(false);
        setOpenDeleteModal(true);
      } else {
        setErrorMsg(response.message || "Gagal hapus guru");
        setOpenToast(true);
      }
    } catch (err) {
      setOpenToast(true);
      setErrorMsg(err.message || "Terjadi kesalahan tak terduga");
      console.error("Gagal hapus guru:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchGuru = async () => {
    setLoading(true);
    try {
      const response = await GuruService.getGuru({ page, size: rowsPerPage });
      console.log("RESPONSE DATA GURU:", response);
      if (response.success) {
        // setGuru(response.data?.content); // asumsi pakai Page<T>
        const sorted = [...(response.data?.content || [])].sort((a, b) => {
          // asumsi nip berupa string seperti "G0001", "G0002"
          // kita ambil angka setelah huruf G untuk dibandingkan
          const numA = parseInt(a.nip.replace(/\D/g, ""), 10);
          const numB = parseInt(b.nip.replace(/\D/g, ""), 10);
          return numA - numB; // ascending
        });
        setGuru(sorted);
        setTotalGuru(response.data?.totalElements || 0);
      } else {
        setErrorMsg(response.message || "Gagal mengambil data guru");
        setOpenToast(true);
      }
    } catch (err) {
      setOpenToast(true);
      setErrorMsg(err.message || "Terjadi kesalahan tak terduga");
      console.error("Gagal ambil data guru:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFilteredGuru = async (keyword) => {
    setLoading(true);
    try {
      const response = await GuruService.searchGuru({
        page,
        size: rowsPerPage,
        keyword,
      });
      console.log("RESPONSE DATA SEARCH GURU:", response);
      if (response.success) {
        setGuru(response.data?.content);
        setTotalGuru(response.data?.totalElements || 0);
      } else {
        setErrorMsg(response.message || "Gagal search data guru");
        setOpenToast(true);
      }
    } catch (err) {
      setOpenToast(true);
      setErrorMsg(err.message || "Terjadi kesalahan tak terduga");
      console.error("Gagal search data guru:", err);
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   window.scrollTo({
  //     top: 0,
  //     behavior: "smooth",
  //   });
  //   fetchAdmins();
  // }, [page, rowsPerPage]);

  useEffect(() => {
    if (debouncedSearch.length >= 2) {
      fetchFilteredGuru(debouncedSearch);
    } else {
      fetchGuru();
    }
  }, [debouncedSearch, page, rowsPerPage]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  return (
    <Box sx={{ padding: 4 }}>
      {/* MODAL CREATE - EDIT GURU */}
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
          {isEditMode ? "Edit Guru" : "Tambah Guru"}
        </DialogTitle>
        <Divider />
        <DialogContent>
          <TextField
            label="NIP"
            fullWidth
            margin="normal"
            value={formData.nip}
            onChange={(e) => {
              const raw = e.target.value.toUpperCase(); // konversi ke huruf kapital
              const filtered = raw.replace(/[^A-Z0-9]/g, ""); // hanya A-Z dan 0-9
              setFormData({ ...formData, nip: filtered });
            }}
            disabled={
              (isEditMode && user?.role !== "ADMIN") ||
              (isEditMode && !allowedNomorInduk.includes(user?.nomorInduk))
            }
          />
          <TextField
            label="Nama"
            fullWidth
            margin="normal"
            value={formData.nama}
            onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
          />
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={formData.email}
            onChange={(e) => {
              setFormData({ ...formData, email: e.target.value });
              setIsSubmitted(false);
            }}
            error={isSubmitted && !formData.email.includes("@")}
            helperText={
              isSubmitted && !formData.email.includes("@")
                ? "Email harus mengandung @"
                : ""
            }
            disabled={
              (isEditMode && user?.role !== "ADMIN") ||
              (isEditMode && !allowedNomorInduk.includes(user?.nomorInduk))
            }
          />
          <TextField
            label="Tanggal Lahir"
            type="date"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={formData.tanggalLahir}
            onChange={(e) =>
              setFormData({ ...formData, tanggalLahir: e.target.value })
            }
            disabled={
              (isEditMode && user?.role !== "ADMIN") ||
              (isEditMode && !allowedNomorInduk.includes(user?.nomorInduk))
            }
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenModal(false);
              setIsSubmitted(false);
            }}
          >
            Batal
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              handleSubmit();
              setIsSubmitted(true);
            }}
            disabled={
              !formData?.nip ||
              !formData?.nama ||
              !formData?.email ||
              !formData?.tanggalLahir
            }
          >
            {isEditMode ? "Simpan Perubahan" : "Simpan"}
          </Button>
        </DialogActions>
      </Dialog>
      {/* END CREATE - EDIT GURU */}
      {/* POP UP SUCCESS */}
      <PopUpModal
        open={successCreateEdit}
        title="Berhasil"
        content={
          isEditMode
            ? "Data guru berhasil diperbarui."
            : "Data guru berhasil ditambahkan."
        }
        onClose={() => {
          setSuccessCreateEdit(false);
          if (debouncedSearch.length >= 2 || page > 0) {
            setSearchTerm("");
            setPage(0);
          } else {
            fetchGuru();
          }
          setOpenModal(false);
          setIsSubmitted(false);
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
          deleteGuru(idDelete);
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
        content="Data guru berhasil dihapus."
        onClose={() => {
          setOpenDeleteModal(false);
          if (debouncedSearch.length >= 2 || page > 0) {
            setSearchTerm("");
            setPage(0);
          } else {
            fetchGuru();
          }
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
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
        px={1}
      >
        <Box>
          <Typography variant="h5" fontWeight="bold" color="primary">
            Manajemen Guru
          </Typography>
          {/* <Divider /> */}
          <Typography
            variant="body2"
            color="text.secondary"
            style={{ fontStyle: "italic" }}
          >
            Kelola data guru
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenCreate}
          disabled={user?.role !== "ADMIN"}
          sx={{ textTransform: "none", boxShadow: 2 }}
        >
          Tambah Guru
        </Button>
      </Box>
      <Tooltip
        title="Cari Nama Guru"
        placement="top"
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
          label="Cari Guru"
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
          }}
        />
      </Tooltip>
      <Divider sx={{ mb: 2, mt: 2 }} />
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="200px"
        >
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer
          component={Paper}
          elevation={3}
          sx={{ overflowX: "auto" }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    borderRight: "1px solid #ccc",
                    maxWidth: "70px",
                    textAlign: "center",
                  }}
                >
                  Nomor
                </TableCell>
                <TableCell
                  sx={{ fontWeight: "bold", borderRight: "1px solid #ccc" }}
                >
                  Nomor Induk Pegawai
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    borderRight: "1px solid #ccc",
                  }}
                >
                  Nama
                </TableCell>
                <TableCell
                  sx={{ fontWeight: "bold", borderRight: "1px solid #ccc" }}
                >
                  Email
                </TableCell>
                <TableCell
                  sx={{ fontWeight: "bold", borderRight: "1px solid #ccc" }}
                >
                  Tanggal Lahir
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Aksi</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {guru.map((guru, index) => (
                <TableRow
                  key={guru.id}
                  sx={{
                    "&:hover": { backgroundColor: "#fafafa" },
                    "& td": { borderBottom: "1px solid #ddd" },
                  }}
                >
                  <TableCell
                    sx={{
                      borderRight: "1px solid #ccc",
                      maxWidth: "70px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      // whiteSpace: "nowrap",
                      whiteSpace: "normal",
                      wordBreak: "break-word",
                      textAlign: "center",
                    }}
                  >
                    {page * rowsPerPage + index + 1}
                  </TableCell>
                  <TableCell
                    sx={{
                      borderRight: "1px solid #ccc",
                      maxWidth: "150px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      // whiteSpace: "nowrap",
                      whiteSpace: "normal",
                      wordBreak: "break-word",
                    }}
                  >
                    {guru.nip}
                  </TableCell>
                  <TableCell
                    sx={{
                      borderRight: "1px solid #ccc",
                      maxWidth: "150px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      // whiteSpace: "nowrap",
                      whiteSpace: "normal",
                      wordBreak: "break-word",
                    }}
                  >
                    {guru.nama}
                  </TableCell>
                  <TableCell
                    sx={{
                      borderRight: "1px solid #ccc",
                      maxWidth: "150px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      // whiteSpace: "nowrap",
                      whiteSpace: "normal",
                      wordBreak: "break-word",
                    }}
                  >
                    {guru.email}
                  </TableCell>
                  <TableCell
                    sx={{
                      borderRight: "1px solid #ccc",
                      maxWidth: "150px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      // whiteSpace: "nowrap",
                      whiteSpace: "normal",
                      wordBreak: "break-word",
                    }}
                  >
                    {guru.tanggalLahir}
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Edit">
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenEdit(guru)}
                        disabled={user?.role !== "ADMIN"}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Delete">
                      <IconButton
                        color="error"
                        disabled={user?.role !== "ADMIN"}
                        onClick={() => {
                          setOpenConfirmDelete(true);
                          setIdDelete(guru.id);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={totalGuru}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0); // reset ke halaman pertama
            }}
          />
        </TableContainer>
      )}
    </Box>
  );
}
