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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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
import KelasService from "./KelasService";
import PopUpModal from "../../../components/PopUpModal";
import ConfirmModal from "../../../components/DialogPopup";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "../../../hook/UseDebounce";

export default function ManajemenKelas() {
  const [kelas, setKelas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openToast, setOpenToast] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successCreateEdit, setSuccessCreateEdit] = useState(false);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [idDelete, setIdDelete] = useState(null);
  const [dataGuru, setDataGuru] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    gradeLevelId: null,
    waliGuruId: null,
  });

  const [page, setPage] = useState(0); // halaman dimulai dari 0
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalKelas, setTotalKelas] = useState(0);
  const [dataSiswaKelas, setDataSiswaKelas] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);

  const user = JSON.parse(localStorage.getItem("userLogin"));
  const allowedNomorInduk = ["A0000001", "A0000002"];
  const navigate = useNavigate();

  const handleOpenCreate = () => {
    setIsEditMode(false);
    setFormData({
      id: null,
      name: "",
      gradeLevelId: null,
      waliGuruId: null,
    });
    setOpenModal(true);
  };

  const handleOpenEdit = (el) => {
    setIsEditMode(true);
    setFormData({
      id: el.id,
      name: el.name,
      gradeLevelId: el.gradeLevelId,
      waliGuruId: el.waliGuruId,
    });
    setOpenModal(true);
  };

  const handleSubmit = async () => {
    try {
      if (isEditMode) {
        const response = await KelasService.updateKelas(formData); // kamu bikin endpoint PUT
        console.log("RESPONSE UPDATE KELAS:", response);
        if (response.success) {
          setSuccessCreateEdit(true);
        } else {
          setErrorMsg(response.message || "Gagal update data kelas");
          setOpenToast(true);
        }
      } else {
        const response = await KelasService.createKelas(formData);
        console.log("RESPONSE CREATE KELAS:", response);
        if (response.success) {
          setSuccessCreateEdit(true);
        } else {
          setErrorMsg(response.message || "Gagal tambah data kelas");
          setOpenToast(true);
          setIsSubmitted(false);
        }
      }
    } catch (err) {
      setOpenToast(true);
      setErrorMsg(err.message || "Terjadi kesalahan tak terduga");
      console.error("Gagal simpan kelas:", err);
    }
  };

  const deleteKelas = async (kelasId) => {
    setLoading(true);
    try {
      const response = await KelasService.deleteKls(kelasId);
      console.log("RES DELETE KELAS:", response);
      if (response.success) {
        setLoading(false);
        setOpenDeleteModal(true);
      } else {
        setErrorMsg(response.message || "Gagal hapus kelas");
        setOpenToast(true);
      }
    } catch (err) {
      setOpenToast(true);
      setErrorMsg(err.message || "Terjadi kesalahan tak terduga");
      console.error("Gagal hapus kelas:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchKelas = async () => {
    setLoading(true);
    try {
      const response = await KelasService.getKelas({ page, size: rowsPerPage });
      console.log("RESPONSE DATA KELAS:", response);
      if (response.success) {
        // setGuru(response.data?.content); // asumsi pakai Page<T>
        const sorted = [...(response.data?.content || [])].sort((a, b) => {
          // asumsi nip berupa string seperti "G0001", "G0002"
          // kita ambil angka setelah huruf G untuk dibandingkan
          const numA = parseInt(a.name.replace(/\D/g, ""), 10);
          const numB = parseInt(b.name.replace(/\D/g, ""), 10);
          return numA - numB; // ascending
        });
        setKelas(sorted);
        setTotalKelas(response.data?.totalElements || 0);
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

  const fetchFilteredKelas = async (keyword) => {
    setLoading(true);
    try {
      const response = await KelasService.searchKelas({
        page,
        size: rowsPerPage,
        keyword,
      });
      console.log("RESPONSE DATA SEARCH KELAS:", response);
      if (response.success) {
        setKelas(response.data?.content);
        setTotalKelas(response.data?.totalElements || 0);
      } else {
        setErrorMsg(response.message || "Gagal search data kelas");
        setOpenToast(true);
      }
    } catch (err) {
      setOpenToast(true);
      setErrorMsg(err.message || "Terjadi kesalahan tak terduga");
      console.error("Gagal search data kelas:", err);
    } finally {
      setLoading(false);
    }
  };

  const getGuru = async (keyword) => {
    setLoading(true);
    try {
      const response = await KelasService.getAllGuru();
      console.log("RESPONSE DATA GURU:", response);
      if (response.success) {
        setDataGuru(response.data?.data);
      } else {
        setErrorMsg(response.message || "Gagal mendapatkan data guru");
        setOpenToast(true);
      }
    } catch (err) {
      setOpenToast(true);
      setErrorMsg(err.message || "Terjadi kesalahan tak terduga");
      console.error("Gagal mendapatkan data guru:", err);
    } finally {
      setLoading(false);
    }
  };

  const gradeLevels = [
    { id: 1, name: "10" },
    { id: 2, name: "11" },
    { id: 3, name: "12" },
  ];

  useEffect(() => {
    if (debouncedSearch.length >= 2) {
      fetchFilteredKelas(debouncedSearch);
    } else {
      fetchKelas();
    }
  }, [debouncedSearch, page, rowsPerPage]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    getGuru();
  }, []);

  return (
    <Box sx={{ padding: 4 }}>
      {/* MODAL CREATE - EDIT KELAS */}
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
          {isEditMode ? "Edit Kelas" : "Tambah Kelas"}
        </DialogTitle>
        <Divider />
        <DialogContent>
          <TextField
            label="Nama Kelas"
            fullWidth
            margin="normal"
            value={formData.name}
            onChange={(e) => {
              const raw = e.target.value.toUpperCase(); // konversi ke huruf kapital
              const filtered = raw.replace(/[^A-Z0-9]/g, ""); // hanya A-Z dan 0-9
              setFormData({ ...formData, name: filtered });
            }}
            disabled={
              (isEditMode && user?.role !== "ADMIN") ||
              (isEditMode && !allowedNomorInduk.includes(user?.nomorInduk))
            }
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="gradeLevel-label">Tingkat/Jenjang</InputLabel>
            <Select
              labelId="gradeLevel-label"
              label="Tingkat/Jenjang"
              value={formData.gradeLevelId}
              onChange={(e) =>
                setFormData({ ...formData, gradeLevelId: e.target.value })
              }
            >
              {gradeLevels.map((gl) => (
                <MenuItem key={gl.id} value={gl.id}>
                  {gl.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel id="waliKelas-label">Wali Kelas</InputLabel>
            <Select
              labelId="waliKelas-label"
              label="Wali Kelas"
              value={formData.waliGuruId}
              onChange={(e) =>
                setFormData({ ...formData, waliGuruId: e.target.value })
              }
            >
              {dataGuru.map((gl) => (
                <MenuItem key={gl.id} value={gl.id}>
                  {gl.nama}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
              !formData?.name ||
              !formData?.gradeLevelId ||
              !formData?.waliGuruId
            }
          >
            {isEditMode ? "Simpan Perubahan" : "Simpan"}
          </Button>
        </DialogActions>
      </Dialog>
      {/* END CREATE - EDIT KELAS */}
      {/* POP UP SUCCESS */}
      <PopUpModal
        open={successCreateEdit}
        title="Berhasil"
        content={
          isEditMode
            ? "Data kelas berhasil diperbarui."
            : "Data kelas berhasil ditambahkan."
        }
        onClose={() => {
          setSuccessCreateEdit(false);
          if (debouncedSearch.length >= 2 || page > 0) {
            setSearchTerm("");
            setPage(0);
          } else {
            fetchKelas();
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
          deleteKelas(idDelete);
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
        content="Data kelas berhasil dihapus."
        onClose={() => {
          setOpenDeleteModal(false);
          if (debouncedSearch.length >= 2 || page > 0) {
            setSearchTerm("");
            setPage(0);
          } else {
            fetchKelas();
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
            Manajemen Kelas
          </Typography>
          {/* <Divider /> */}
          <Typography
            variant="body2"
            color="text.secondary"
            style={{ fontStyle: "italic" }}
          >
            Kelola data kelas
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenCreate}
          disabled={!allowedNomorInduk.includes(user.nomorInduk)}
          sx={{ textTransform: "none", boxShadow: 2 }}
        >
          Tambah Kelas
        </Button>
      </Box>
      <Tooltip
        title="Cari Nama Kelas"
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
          label="Cari Kelas"
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
          <Table sx={{ minWidth: 900 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    borderRight: "1px solid #ccc",
                    // mWidth: "40px",
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
                  Nama Kelas
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    borderRight: "1px solid #ccc",
                    // maxWidth: "50px",
                    textAlign: "center",
                  }}
                >
                  Tingkatan/Jenjang
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    borderRight: "1px solid #ccc",
                    textAlign: "center",
                    // maxWidth: "100px",
                  }}
                >
                  Wali Kelas
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    borderRight: "1px solid #ccc",
                    // maxWidth: "40px",
                    textAlign: "center",
                  }}
                >
                  Jumlah Siswa
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    textAlign: "center",
                    minWidth: "40px",
                  }}
                >
                  Aksi
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {kelas.map((kls, index) => (
                <TableRow
                  key={kls.id}
                  sx={{
                    "&:hover": { backgroundColor: "#fafafa" },
                    "& td": { borderBottom: "1px solid #ddd" },
                  }}
                >
                  <TableCell
                    sx={{
                      borderRight: "1px solid #ccc",
                      maxWidth: "40px",
                      // overflow: "hidden",
                      // textOverflow: "ellipsis",
                      // // whiteSpace: "nowrap",
                      // whiteSpace: "normal",
                      // wordBreak: "break-word",
                      textAlign: "center",
                    }}
                  >
                    {page * rowsPerPage + index + 1}
                  </TableCell>
                  <TableCell
                    sx={{
                      borderRight: "1px solid #ccc",
                      // maxWidth: "40px",
                      // overflow: "hidden",
                      // textOverflow: "ellipsis",
                      // // whiteSpace: "nowrap",
                      // whiteSpace: "normal",
                      // wordBreak: "break-word",
                      textAlign: "center",
                    }}
                  >
                    {kls.name}
                  </TableCell>
                  <TableCell
                    sx={{
                      borderRight: "1px solid #ccc",
                      // maxWidth: "50px",
                      // overflow: "hidden",
                      // textOverflow: "ellipsis",
                      // // whiteSpace: "nowrap",
                      // whiteSpace: "normal",
                      // wordBreak: "break-word",
                      textAlign: "center",
                    }}
                  >
                    {kls.gradeLevelName}
                  </TableCell>
                  <TableCell
                    sx={{
                      borderRight: "1px solid #ccc",
                      // maxWidth: "100px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      // whiteSpace: "nowrap",
                      whiteSpace: "normal",
                      wordBreak: "break-word",
                    }}
                  >
                    {kls.waliGuruName}
                  </TableCell>
                  <TableCell
                    sx={{
                      // fontWeight: "bold",
                      borderRight: "1px solid #ccc",
                      // maxWidth: "40px",
                      textAlign: "center",
                    }}
                  >
                    {kls.jumlahSiswa}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center", minWidth: "40px" }}>
                    <Tooltip title="Edit">
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenEdit(kls)}
                        disabled={!allowedNomorInduk.includes(user.nomorInduk)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Delete">
                      <IconButton
                        color="error"
                        disabled={!allowedNomorInduk.includes(user.nomorInduk)}
                        onClick={() => {
                          setOpenConfirmDelete(true);
                          setIdDelete(kls.id);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Detail">
                      <IconButton
                        color="secondary"
                        onClick={() =>
                          navigate(`/manajemen/kelas/${kls.id}`, {
                            state: { kelas: kls },
                          })
                        }
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={totalKelas}
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
