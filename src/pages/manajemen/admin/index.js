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
  Chip,
  InputLabel,
  FormControlLabel,
  Switch,
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
    isActive: false,
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
      isActive: false,
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
      isActive: admin?.isActive,
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

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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
    <Box>
      {/* MODAL CREATE - EDIT ADMIN */}
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
          {isEditMode ? "Edit Admin" : "Tambah Admin"}
        </DialogTitle>
        <Divider />
        <DialogContent>
          <TextField
            label="Nomor Induk"
            fullWidth
            sx={{
              "& .MuiInputLabel-root": {
                fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" }, // label responsif
              },
              "& .MuiInputBase-input": {
                fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" }, // isi input responsif
              },
            }}
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
            sx={{
              "& .MuiInputLabel-root": {
                fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" }, // label responsif
              },
              "& .MuiInputBase-input": {
                fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" }, // isi input responsif
              },
            }}
            margin="normal"
            value={formData.nama}
            onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
          />
          <TextField
            label="Email"
            type="email"
            fullWidth
            sx={{
              "& .MuiInputLabel-root": {
                fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" }, // label responsif
              },
              "& .MuiInputBase-input": {
                fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" }, // isi input responsif
              },
            }}
            margin="normal"
            value={formData.email}
            onChange={(e) => {
              setFormData({ ...formData, email: e.target.value });
              setIsSubmitted(false);
            }}
            error={formData?.email && !isValidEmail(formData.email)}
            helperText={
              formData?.email && !isValidEmail(formData.email)
                ? "Format email tidak valid"
                : ""
            }
          />
          <TextField
            label="Tanggal Lahir"
            type="date"
            fullWidth
            sx={{
              "& .MuiInputLabel-root": {
                fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" }, // label responsif
              },
              "& .MuiInputBase-input": {
                fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" }, // isi input responsif
              },
            }}
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={formData.tanggalLahir}
            onChange={(e) =>
              setFormData({ ...formData, tanggalLahir: e.target.value })
            }
          />
          <div style={{ marginBottom: "10px" }}>
            <InputLabel
              id="status"
              style={{ marginBottom: "4px" }} // atur jarak label ke textarea
            >
              Status:
            </InputLabel>
            <FormControlLabel
              sx={{
                "& .MuiFormControlLabel-label": {
                  fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" }, // label responsif
                },
              }}
              control={
                <Switch
                  checked={formData?.isActive}
                  onChange={(e) => {
                    const check = e.target.checked;
                    setFormData({ ...formData, isActive: check });
                  }}
                  color="primary"
                />
              }
              label={formData?.isActive ? "Active" : "Non Active"}
            />
          </div>
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
              // setIsSubmitted(true);
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
        question="Apakah Anda yakin ?"
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
          <Typography
            variant="h5"
            fontWeight="bold"
            color="primary"
            sx={{
              fontSize: { xs: "0.95rem", sm: "1,25rem", md: "1.5rem" },
            }}
          >
            Manajemen Admin
          </Typography>
          {/* <Divider /> */}
          <Typography
            variant="body2"
            color="text.secondary"
            style={{
              fontStyle: "italic",
              fontSize: { xs: "0.3rem", sm: "0.65rem", md: "0.75rem" },
            }}
          >
            Kelola data admin
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenCreate}
          disabled={!allowedNomorInduk.includes(user?.nomorInduk)}
          sx={{
            textTransform: "none",
            boxShadow: 2,
            borderRadius: 4,
            // px: { xs: 2, sm: 3, md: 4 }, // padding horizontal menyesuaikan layar
            // py: { xs: 1, sm: 1.5 }, // padding vertical menyesuaikan layar
            fontSize: { xs: "0.50rem", sm: "0.75rem", md: "1rem" }, // font size adaptif
            width: { xs: "40%", sm: "auto" }, // di mobile full width, di desktop auto
          }}
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
              fontSize: { xs: "0.5rem", sm: "0.7rem", md: "0.8rem" },
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
              fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.9rem" },
            },
            fontSize: { xs: "0.5rem", sm: "0.7rem", md: "0.8rem" },
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
                    maxWidth: "70px",
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
                    textAlign: "center",
                    fontSize: { xs: "0.50rem", sm: "0.65rem", md: "0.85rem" },
                  }}
                >
                  Nomor Induk
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    borderRight: "1px solid #ccc",
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
                    textAlign: "center",
                    fontSize: { xs: "0.50rem", sm: "0.65rem", md: "0.85rem" },
                  }}
                >
                  Status
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    textAlign: "center",
                    fontSize: { xs: "0.50rem", sm: "0.65rem", md: "0.85rem" },
                  }}
                >
                  Aksi
                </TableCell>
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
                      fontSize: { xs: "0.50rem", sm: "0.65rem", md: "0.85rem" },
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
                      textAlign: "center",
                      fontSize: { xs: "0.50rem", sm: "0.65rem", md: "0.85rem" },
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
                      textAlign: "left",
                      fontSize: { xs: "0.50rem", sm: "0.65rem", md: "0.85rem" },
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
                      textAlign: "left",
                      fontSize: { xs: "0.50rem", sm: "0.65rem", md: "0.85rem" },
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
                      textAlign: "center",
                      fontSize: { xs: "0.50rem", sm: "0.65rem", md: "0.85rem" },
                    }}
                  >
                    {admin.tanggalLahir}
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
                      textAlign: "center",
                      fontSize: { xs: "0.50rem", sm: "0.65rem", md: "0.85rem" },
                    }}
                  >
                    {admin.isActive ? (
                      <Chip
                        label="AKTIF"
                        color="success"
                        sx={{
                          fontSize: {
                            xs: "0.50rem",
                            sm: "0.65rem",
                            md: "0.85rem",
                          },
                          height: 24,
                        }}
                      />
                    ) : (
                      <Chip
                        label="NON AKTIF"
                        color="error"
                        sx={{
                          fontSize: {
                            xs: "0.50rem",
                            sm: "0.65rem",
                            md: "0.85rem",
                          },
                          height: 24,
                        }}
                      />
                    )}
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

                    {/* <Tooltip title="Delete">
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
                    </Tooltip> */}
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
