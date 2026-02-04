import { useState, useEffect } from "react";
import { useDebounce } from "../../hook/UseDebounce";
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
  FormControl,
  MenuItem,
  Select,
  Tooltip,
  FormControlLabel,
  Switch,
  TextField,
} from "@mui/material";
import ReplayIcon from "@mui/icons-material/Replay";
import PrivacyTipTwoToneIcon from "@mui/icons-material/PrivacyTipTwoTone";
import KelasService from "../manajemen/kelas/KelasService";
import ConfirmModal from "../../components/DialogPopup";
import SnackBarAlert from "../../components/SnackbarAlert";

const DataLulus = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0); // halaman dimulai dari 0
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [openToast, setOpenToast] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [totalSiswa, setTotalSiswa] = useState(0);
  const [undo, setUndo] = useState(false);
  const [selectedSiswa, setSelectedSiswa] = useState(null);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastSeverity, setToastSeverity] = useState("success");

  const currentYear = new Date().getFullYear();
  const [tahun, setTahun] = useState(currentYear);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);

  // bikin array tahun dari currentYear ke belakang
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

  const generateData = async () => {
    // setLoading(true);
    try {
      const res = await KelasService.getSiswaPagingLulus({
        page,
        size: rowsPerPage,
        tahun,
      });
      console.log("RESPONSE GET SISWA:", res);
      if (res.success) {
        // const dataFilter = res.data.items.filter(
        //   (el) => el.status === "DITERIMA",
        // );
        const siswaContent = res?.data?.items || [];
        // sort ascending berdasarkan nama
        const sortedSiswa = [...siswaContent].sort((a, b) =>
          a.nama.localeCompare(b.nama, "id", { sensitivity: "base" }),
        );
        setData(sortedSiswa);
        setTotalSiswa(res.data.totalItems);
        // if (debouncedSearch.length >= 2 && page === 0) {
        //   setSearchTerm("");
        // }
      } else {
        setErrorMsg(res.message || "Data siswa tidak ditemukan");
        setOpenToast(true);
      }
    } catch (err) {
      console.error("Error fetch classroom detail:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFilteredData = async (keyword) => {
    // setLoading(true);
    try {
      const response = await KelasService.searchDataSiswaLulus({
        keyword,
        page,
        size: rowsPerPage,
        tahun,
      });
      console.log("RESPONSE DATA SEARCH SISWA:", response);
      if (response.success) {
        setData(response.data?.data?.items || []);
        setTotalSiswa(response.data?.data?.totalItems || 0);
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

  const handleUndo = async (data) => {
    setLoading(true);
    try {
      const response = await KelasService.undoLulus(data);
      console.log("RESPONSE DATA UNDO SISWA:", response);
      if (response.success) {
        setToastMessage("Siswa berhasil dikembalikan ke kelas");
        setToastSeverity("success");
        setToastOpen(true);
        if (debouncedSearch.length >= 2 || page > 0) {
          setSearchTerm("");
          setPage(0);
        } else {
          generateData();
        }
      } else {
        setErrorMsg(response.message || "Gagal undo siswa");
        setOpenToast(true);
      }
    } catch (err) {
      setOpenToast(true);
      setErrorMsg(err.message || "Terjadi kesalahan tak terduga");
      console.error("Gagal undo siswa:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (debouncedSearch.length >= 2) {
      fetchFilteredData(debouncedSearch);
    } else {
      generateData();
    }
  }, [debouncedSearch, page, rowsPerPage, tahun]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);
  return (
    <>
      {loading && (
        <Box
          sx={{
            position: "fixed", // atau "absolute" kalau mau relatif ke parent
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            bgcolor: "rgba(255,255,255,0.7)", // semi transparan background
            zIndex: 1300, // lebih tinggi dari konten biasa
          }}
        >
          <CircularProgress />
        </Box>
      )}
      <Box
        sx={{
          // display: "flex",
          // flexDirection: "row",
          minHeight: "100vh",
          // alignItems: "center",
          // p: 2,
          pt: 2,
          pl: 2,
          pr: 2,
          mt: 3,
          backgroundColor: loading ? "grey.300" : "background.default",
          borderRadius: 4,
          borderWidth: 2,
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={1}
          px={1}
        >
          <Box>
            <Typography
              variant="h5"
              fontWeight="bold"
              color="primary"
              sx={{
                fontSize: { xs: "0.75rem", sm: "1rem", md: "1.25rem" }, // responsif
              }}
            >
              Manajemen Arsip
            </Typography>
            {/* <Divider /> */}
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                fontStyle: "italic",
                fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" },
              }}
            >
              Kelola data arsip alumni
            </Typography>
          </Box>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Box
          display="flex"
          flexDirection={"column"}
          width={250}
          // justifyContent="space-between"
          // alignItems="center"
          mb={3}
          px={1}
        >
          <FormControl margin="normal">
            <InputLabel id="tahun-label">Pilih Tahun Angkatan</InputLabel>
            <Select
              labelId="tahun-label"
              label="Pilih Tahun Angkatan"
              value={tahun}
              onChange={(e) => {
                setTahun(e.target.value);
                if (debouncedSearch.length >= 2 || page > 0) {
                  setSearchTerm("");
                  setPage(0);
                }
              }}
            >
              {years.map((y) => (
                <MenuItem key={y} value={y}>
                  {y}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Tooltip
            title="Ketik Nama"
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
              label="Nama"
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
                  fontSize: { xs: "0.75rem", sm: "0.80rem", md: "0.8rem" },
                },
                fontSize: { xs: "0.5rem", sm: "0.7rem", md: "0.8rem" },
              }}
            />
          </Tooltip>
        </Box>
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
                    // maxWidth: "70px",
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
                  Kelas
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
                  No Handphone
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
                  Tanggal Kelulusan
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    borderRight: "1px solid #ccc",
                    textAlign: "center",
                    fontSize: { xs: "0.50rem", sm: "0.65rem", md: "0.85rem" },
                  }}
                >
                  Catatan
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
              {data.length > 0 ? (
                data.map((admin, index) => (
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
                        //   maxWidth: "70px",
                        //   overflow: "hidden",
                        //   textOverflow: "ellipsis",
                        //   // whiteSpace: "nowrap",
                        //   whiteSpace: "normal",
                        //   wordBreak: "break-word",
                        textAlign: "center",
                        fontSize: {
                          xs: "0.50rem",
                          sm: "0.65rem",
                          md: "0.85rem",
                        },
                      }}
                    >
                      {page * rowsPerPage + index + 1}
                    </TableCell>
                    <TableCell
                      sx={{
                        borderRight: "1px solid #ccc",
                        //   maxWidth: "150px",
                        //   overflow: "hidden",
                        //   textOverflow: "ellipsis",
                        //   // whiteSpace: "nowrap",
                        //   whiteSpace: "normal",
                        //   wordBreak: "break-word",
                        textAlign: "center",
                        fontSize: {
                          xs: "0.50rem",
                          sm: "0.65rem",
                          md: "0.85rem",
                        },
                      }}
                    >
                      {admin.nis}
                    </TableCell>
                    <TableCell
                      sx={{
                        borderRight: "1px solid #ccc",
                        //   maxWidth: "150px",
                        //   overflow: "hidden",
                        //   textOverflow: "ellipsis",
                        //   // whiteSpace: "nowrap",
                        //   whiteSpace: "normal",
                        //   wordBreak: "break-word",
                        textAlign: "center",
                        fontSize: {
                          xs: "0.50rem",
                          sm: "0.65rem",
                          md: "0.85rem",
                        },
                      }}
                    >
                      {admin.classroomName}
                    </TableCell>
                    <TableCell
                      sx={{
                        borderRight: "1px solid #ccc",
                        //   maxWidth: "150px",
                        //   overflow: "hidden",
                        //   textOverflow: "ellipsis",
                        //   // whiteSpace: "nowrap",
                        //   whiteSpace: "normal",
                        //   wordBreak: "break-word",
                        textAlign: "left",
                        fontSize: {
                          xs: "0.50rem",
                          sm: "0.65rem",
                          md: "0.85rem",
                        },
                      }}
                    >
                      {admin.nama}
                    </TableCell>
                    <TableCell
                      sx={{
                        borderRight: "1px solid #ccc",
                        //   maxWidth: "150px",
                        //   overflow: "hidden",
                        //   textOverflow: "ellipsis",
                        //   // whiteSpace: "nowrap",
                        //   whiteSpace: "normal",
                        //   wordBreak: "break-word",
                        textAlign: "left",
                        fontSize: {
                          xs: "0.50rem",
                          sm: "0.65rem",
                          md: "0.85rem",
                        },
                      }}
                    >
                      {admin.email}
                    </TableCell>
                    <TableCell
                      sx={{
                        borderRight: "1px solid #ccc",
                        //   maxWidth: "150px",
                        //   overflow: "hidden",
                        //   textOverflow: "ellipsis",
                        //   // whiteSpace: "nowrap",
                        //   whiteSpace: "normal",
                        //   wordBreak: "break-word",
                        textAlign: "center",
                        fontSize: {
                          xs: "0.50rem",
                          sm: "0.65rem",
                          md: "0.85rem",
                        },
                      }}
                    >
                      {admin.noHandphone}
                    </TableCell>
                    <TableCell
                      sx={{
                        borderRight: "1px solid #ccc",
                        //   maxWidth: "150px",
                        //   overflow: "hidden",
                        //   textOverflow: "ellipsis",
                        //   // whiteSpace: "nowrap",
                        //   whiteSpace: "normal",
                        //   wordBreak: "break-word",
                        textAlign: "center",
                        fontSize: {
                          xs: "0.50rem",
                          sm: "0.65rem",
                          md: "0.85rem",
                        },
                      }}
                    >
                      {admin.tanggalLahir}
                    </TableCell>
                    <TableCell
                      sx={{
                        borderRight: "1px solid #ccc",
                        //   maxWidth: "150px",
                        //   overflow: "hidden",
                        //   textOverflow: "ellipsis",
                        //   // whiteSpace: "nowrap",
                        //   whiteSpace: "normal",
                        //   wordBreak: "break-word",
                        textAlign: "center",
                        fontSize: {
                          xs: "0.50rem",
                          sm: "0.65rem",
                          md: "0.85rem",
                        },
                      }}
                    >
                      {admin.graduatedAt}
                    </TableCell>
                    <TableCell
                      sx={{
                        borderRight: "1px solid #ccc",
                        //   maxWidth: "150px",
                        //   overflow: "hidden",
                        //   textOverflow: "ellipsis",
                        //   // whiteSpace: "nowrap",
                        //   whiteSpace: "normal",
                        //   wordBreak: "break-word",
                        textAlign: "center",
                        fontSize: {
                          xs: "0.50rem",
                          sm: "0.65rem",
                          md: "0.85rem",
                        },
                      }}
                    >
                      {admin.catatan}
                    </TableCell>
                    <TableCell
                      sx={{
                        borderRight: "1px solid #ccc",
                        //   maxWidth: "150px",
                        //   overflow: "hidden",
                        //   textOverflow: "ellipsis",
                        //   // whiteSpace: "nowrap",
                        //   whiteSpace: "normal",
                        //   wordBreak: "break-word",
                        textAlign: "center",
                        fontSize: {
                          xs: "0.50rem",
                          sm: "0.65rem",
                          md: "0.85rem",
                        },
                      }}
                    >
                      {admin.statusSiswa === "AKTIF" ? (
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
                      ) : admin?.statusSiswa === "LULUS" ? (
                        <Chip
                          label="LULUS"
                          color="info"
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
                        ""
                      )}
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Undo">
                        <IconButton
                          color="primary"
                          onClick={() => {
                            setUndo(true);
                            setSelectedSiswa(admin);
                          }}
                          // disabled={!allowedNomorInduk.includes(user?.nomorInduk)}
                        >
                          <ReplayIcon />
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
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    Masih belum ada data alumni
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={totalSiswa}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0); // reset ke halaman pertama
            }}
          />
        </TableContainer>
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
        <ConfirmModal
          open={undo}
          title="Kembalikan Siswa"
          question="Apakah anda yakin akan mengembalikan siswa yang sudah lulus ini"
          icon={
            <PrivacyTipTwoToneIcon sx={{ fontSize: 48, color: "#f44336" }} />
          }
          useText={true}
          textCancel="Ngga jadi deh!"
          textSubmit="Ya, Balikin aja"
          onConfirm={() => {
            setUndo(false);
            handleUndo(selectedSiswa);
          }}
          onCancel={() => {
            setUndo(false);
          }}
        />
        <SnackBarAlert
          open={toastOpen}
          setOpen={setToastOpen}
          message={toastMessage}
          setMessage={setToastMessage}
          severity={toastSeverity}
          setSeverity={setToastSeverity}
          handleClose={(event, reason) => {
            if (reason === "clickaway") return;
            setSelectedSiswa(null);
            setToastOpen(false);
          }}
          // onCloseIcon={() => {
          //   setOpenToast(false);
          //   setSelectedSiswa(null);
          // }}
        />
      </Box>
    </>
  );
};

export default DataLulus;
