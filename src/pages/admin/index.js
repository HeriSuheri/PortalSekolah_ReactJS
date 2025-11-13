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
import PopUpModal from "../../components/PopUpModal";
import ConfirmModal from "../../components/DialogPopup";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";

export default function ManajemenAdmin() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openToast, setOpenToast] = useState(false);
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
        setAdmins(response.data?.content); // asumsi pakai Page<T>
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

  useEffect(() => {
    fetchAdmins();
  }, [page, rowsPerPage]);

  return (
    <Box sx={{ padding: 4 }}>
      {/* MODAL CREATE - EDIT ADMIN */}
      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
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
            onChange={(e) =>
              setFormData({ ...formData, nomorInduk: e.target.value })
            }
            disabled={isEditMode}
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
            fullWidth
            margin="normal"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
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
          <Button onClick={() => setOpenModal(false)}>Batal</Button>
          <Button variant="contained" onClick={() => handleSubmit()}>
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
          fetchAdmins();
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
          fetchAdmins();
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
            Kelola akun admin
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

      <Divider sx={{ mb: 2 }} />

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
                  sx={{ fontWeight: "bold", borderRight: "1px solid #ccc" }}
                >
                  Nomor Induk
                </TableCell>
                <TableCell
                  sx={{ fontWeight: "bold", borderRight: "1px solid #ccc" }}
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
              {admins.map((admin) => (
                <TableRow
                  key={admin.id}
                  sx={{
                    "&:hover": { backgroundColor: "#fafafa" },
                    "& td": { borderBottom: "1px solid #ddd" },
                  }}
                >
                  <TableCell sx={{ borderRight: "1px solid #ccc" }}>
                    {admin.nomorInduk}
                  </TableCell>
                  <TableCell sx={{ borderRight: "1px solid #ccc" }}>
                    {admin.nama}
                  </TableCell>
                  <TableCell sx={{ borderRight: "1px solid #ccc" }}>
                    {admin.email}
                  </TableCell>
                  <TableCell sx={{ borderRight: "1px solid #ccc" }}>
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
