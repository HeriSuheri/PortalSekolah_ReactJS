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
import AdminService from "./AdminService";
import PopUpModal from "../../../components/PopUpModal";
import ConfirmModal from "../../../components/DialogPopup";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import { useDebounce } from "../../../hook/UseDebounce";

export default function ManajemenAdmin() {
  const [admins, setAdmins] = useState([]);
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
    nomorInduk: "",
    nama: "",
    email: "",
    tanggalLahir: "",
  });

  const [page, setPage] = useState(0); // halaman dimulai dari 0
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalAdmins, setTotalAdmins] = useState(0);

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);

  const user = JSON.parse(localStorage.getItem("userLogin"));
  const allowedNomorInduk = ["A0000001", "A0000002"];

  const handleOpenCreate = () => {
    setIsEditMode(false);
    setFormData({
      id: null,
      nomorInduk: "",
      nama: "",
      email: "",
      tanggalLahir: "",
    });
    setOpenModal(true);
  };

  const handleOpenEdit = (admin) => {
    setIsEditMode(true);
    setFormData({
      id: admin.id,
      nomorInduk: admin.nomorInduk,
      nama: admin.nama,
      email: admin.email,
      tanggalLahir: admin.tanggalLahir,
    });
    setOpenModal(true);
  };

  const handleSubmit = async () => {
    if (!formData?.email.includes("@")) {
      return;
    }
    try {
      if (isEditMode) {
        const response = await AdminService.updateAdmin(formData); // kamu bikin endpoint PUT
        console.log("RESPONSE UPDATE ADMIN:", response);
        if (response.success) {
          setSuccessCreateEdit(true);
        } else {
          setErrorMsg(response.message || "Gagal update data admin");
          setOpenToast(true);
        }
      } else {
        const response = await AdminService.createAdmin(formData);
        console.log("RESPONSE CREATE ADMIN:", response);
        if (response.success) {
          setSuccessCreateEdit(true);
        } else {
          setErrorMsg(response.message || "Gagal tambah data admin");
          setOpenToast(true);
          setIsSubmitted(false);
        }
      }
    } catch (err) {
      setOpenToast(true);
      setErrorMsg(err.message || "Terjadi kesalahan tak terduga");
      console.error("Gagal simpan admin:", err);
    }
  };

  const deleteAdmin = async (adminId) => {
    setLoading(true);
    try {
      const response = await AdminService.deleteAdm(adminId);
      console.log("RES DELETE ADMIN:", response);
      if (response.success) {
        setLoading(false);
        setOpenDeleteModal(true);
      } else {
        setErrorMsg(response.message || "Gagal hapus admin");
        setOpenToast(true);
      }
    } catch (err) {
      setOpenToast(true);
      setErrorMsg(err.message || "Terjadi kesalahan tak terduga");
      console.error("Gagal hapus admin:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const response = await AdminService.getAdmin({ page, size: rowsPerPage });
      console.log("RESPONSE DATA ADMIN:", response);
      if (response.success) {
        // setAdmins(response.data?.content); // asumsi pakai Page<T>
        const sorted = [...(response.data?.content || [])].sort((a, b) => {
          // asumsi nip berupa string seperti "G0001", "G0002"
          // kita ambil angka setelah huruf G untuk dibandingkan
          const numA = parseInt(a.nomorInduk.replace(/\D/g, ""), 10);
          const numB = parseInt(b.nomorInduk.replace(/\D/g, ""), 10);
          return numA - numB; // ascending
        });
        setAdmins(sorted);
        setTotalAdmins(response.data?.totalElements || 0);
      } else {
        setErrorMsg(response.message || "Gagal mengambil data admin");
        setOpenToast(true);
      }
    } catch (err) {
      setOpenToast(true);
      setErrorMsg(err.message || "Terjadi kesalahan tak terduga");
      console.error("Gagal ambil data admin:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFilteredAdmins = async (keyword) => {
    setLoading(true);
    try {
      const response = await AdminService.searchAdmin({
        page,
        size: rowsPerPage,
        keyword,
      });
      console.log("RESPONSE DATA SEARCH ADMIN:", response);
      if (response.success) {
        setAdmins(response.data?.content);
        setTotalAdmins(response.data?.totalElements || 0);
      } else {
        setErrorMsg(response.message || "Gagal search data admin");
        setOpenToast(true);
      }
    } catch (err) {
      setOpenToast(true);
      setErrorMsg(err.message || "Terjadi kesalahan tak terduga");
      console.error("Gagal search data admin:", err);
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
      fetchFilteredAdmins(debouncedSearch);
    } else {
      fetchAdmins();
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
      {/* MODAL CREATE - EDIT ADMIN */}
      <Dialog
        open={openModal}
        onClose={() => {
          setOpenModal(false);
        }}
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
          {isEditMode ? "Edit Admin" : "Tambah Admin"}
        </DialogTitle>
        <Divider />
        <DialogContent>
          <TextField
            label="Nomor Induk"
            fullWidth
            margin="normal"
            value={formData.nomorInduk}
            onChange={(e) => {
              const raw = e.target.value.toUpperCase(); // konversi ke huruf kapital
              const filtered = raw.replace(/[^A-Z0-9]/g, ""); // hanya A-Z dan 0-9
              setFormData({ ...formData, nomorInduk: filtered });
            }}
            disabled={
              isEditMode && !allowedNomorInduk.includes(user?.nomorInduk)
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
              !formData?.nomorInduk ||
              !formData?.nama ||
              !formData?.email ||
              !formData?.tanggalLahir
            }
          >
            {isEditMode ? "Simpan Perubahan" : "Simpan"}
          </Button>
        </DialogActions>
      </Dialog>
      {/* END CREATE - EDIT ADMIN */}
      {/* POP UP SUCCESS */}
      <PopUpModal
        open={successCreateEdit}
        title="Berhasil"
        content={
          isEditMode
            ? "Data admin berhasil diperbarui."
            : "Data admin berhasil ditambahkan."
        }
        onClose={() => {
          setSuccessCreateEdit(false);
          if (debouncedSearch.length >= 2 || page > 0) {
            setSearchTerm("");
            setPage(0);
          } else {
            fetchAdmins();
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
        content="Apakah Anda yakin ?"
        icon={
          <HelpOutlineOutlinedIcon sx={{ fontSize: 75, color: "#f44336" }} />
        }
        onConfirm={() => {
          deleteAdmin(idDelete);
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
        content="Data admin berhasil dihapus."
        onClose={() => {
          setOpenDeleteModal(false);
          if (debouncedSearch.length >= 2 || page > 0) {
            setSearchTerm("");
            setPage(0);
          } else {
            fetchAdmins();
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
            Manajemen Admin
          </Typography>
          {/* <Divider /> */}
          <Typography
            variant="body2"
            color="text.secondary"
            style={{ fontStyle: "italic" }}
          >
            Kelola data admin
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenCreate}
          disabled={!allowedNomorInduk.includes(user?.nomorInduk)}
          sx={{ textTransform: "none", boxShadow: 2 }}
        >
          Tambah Admin
        </Button>
      </Box>
      <Tooltip
        title="Cari Nama Admin"
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
          label="Cari Admin"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(0);
            // if (page >= 0) {
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
                  Nomor Induk
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
              {admins.map((admin, index) => (
                <TableRow
                  key={admin.id}
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
                    {admin.nomorInduk}
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
                    {admin.nama}
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
                    {admin.email}
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
                    {admin.tanggalLahir}
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Edit">
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenEdit(admin)}
                        disabled={!allowedNomorInduk.includes(user?.nomorInduk)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Delete">
                      <IconButton
                        color="error"
                        disabled={!allowedNomorInduk.includes(user?.nomorInduk)}
                        onClick={() => {
                          setOpenConfirmDelete(true);
                          setIdDelete(admin.id);
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
            count={totalAdmins}
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
