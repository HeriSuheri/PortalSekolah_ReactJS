import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Container,
  Typography,
  Box,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  CircularProgress,
  Tooltip,
  Table,
  TableContainer,
  TableBody,
  TableHead,
  TableCell,
  TableRow,
  Paper,
  TablePagination,
  IconButton,
  Chip,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CachedIcon from "@mui/icons-material/Cached";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import KelasService from "../manajemen/kelas/KelasService";
import HomeService from "../home/HomeServive";
import PopUpModal from "../../components/PopUpModal";
import ConfirmModal from "../../components/DialogPopup";
import EditSiswa from "./editDataCalonSiswa";
import { useDebounce } from "../../hook/UseDebounce";

export default function PPDBRegistrasi() {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [openToast, setOpenToast] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [notRegister, setNotRegister] = useState(false);
  const [errorStatus, setErrorStatus] = useState(null);
  const [errorPembayaran, setErrorPembayaran] = useState(null);
  const [siswaData, setSiswaData] = useState({
    noPendaftaran: null,
    nama: "",
    tanggalLahir: "",
    email: "",
    alamat: "",
    noHandphone: "",
    jumlahDibayar: "",
    statusPembayaran: "",
    status: "",
    catatanValidasi: "",
    jenisKelamin: "",
    namaAyah: "",
    namaIbu: "",
  });
  const [successCreateSiswa, setSuccessCreateSiswa] = useState(false);

  // start tabel siswa
  const currentYear = new Date().getFullYear();
  const [tahun, setTahun] = useState(currentYear);

  // bikin array tahun dari currentYear ke belakang
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

  const [isEditMode, setIsEditMode] = useState(false);
  const [dataTabel, setDataTabel] = useState([]);
  const [page, setPage] = useState(0); // halaman dimulai dari 0
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalSiswa, setTotalSiswa] = useState(0);
  const [idDelete, setIdDelete] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);
  const [dataRow, setDataRow] = useState({});
  const [successAddEditSiswa, setSuccessAddEditSiswa] = useState(false);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  // end tabel siswa

  const handleSave = async () => {
    if (!siswaData?.status || !siswaData?.statusPembayaran) {
      setErrorStatus("Pilihan status belum dipilih");
      return;
    }

    if (!siswaData?.statusPembayaran) {
      setErrorPembayaran("Pilihan status pembayran belum dipilih");
      return;
    }

    setLoading(true);
    try {
      const response = await HomeService.registerPPDBbyAdmin(siswaData);
      console.log("RESPONSE CREATE SISWA:", response);
      if (response.success) {
        setSuccessCreateSiswa(true);
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

  const dropdownStatus = [
    { id: 1, value: "MENUNGGU_VALIDASI", label: "Menunggu Validasi" },
    { id: 2, value: "DITERIMA", label: "Diterima" },
    { id: 3, value: "DIBATALKAN", label: "Dibatalkan" },
  ];

  const dropdownStatusOffline = [
    // { id: 1, value: "MENUNGGU_VALIDASI", label: "Menunggu Validasi" },
    { id: 2, value: "DITERIMA", label: "Diterima" },
  ];

  const dropdownStatusPembayaran = [
    { id: 1, value: "MENUNGGU_PEMBAYARAN", label: "Menunggu Pembayaran" },
    { id: 2, value: "LUNAS", label: "Lunas" },
    { id: 3, value: "BELUM_LUNAS", label: "Belum Lunas" },
  ];

  const dropdownStatusPembayaranOffline = [
    // { id: 1, value: "MENUNGGU_PEMBAYARAN", label: "Menunggu Pembayaran" },
    { id: 2, value: "LUNAS", label: "Lunas" },
    { id: 3, value: "BELUM_LUNAS", label: "Belum Lunas" },
  ];

  // const getClassroom = async () => {
  //   try {
  //     const response = await KelasService.getClassAll();
  //     if (response.success) {
  //       let kelas = response.data.data.map((item) => ({
  //         id: item.id,
  //         name: item.name,
  //       }));

  //       // ✅ custom sort: urutkan berdasarkan angka dulu, lalu huruf
  //       kelas.sort((a, b) => {
  //         const [numA, charA] = [
  //           parseInt(a.name),
  //           a.name.replace(/[0-9]/g, ""),
  //         ];
  //         const [numB, charB] = [
  //           parseInt(b.name),
  //           b.name.replace(/[0-9]/g, ""),
  //         ];

  //         if (numA === numB) {
  //           return charA.localeCompare(charB); // urut huruf A, B, C
  //         }
  //         return numA - numB; // urut angka 10, 11, 12
  //       });

  //       setDataKelas(kelas);
  //     } else {
  //       setErrorMsg(response.message || "Gagal mengambil data classroom");
  //       setOpenToast(true);
  //     }
  //   } catch (err) {
  //     setErrorMsg(err.message || "Terjadi kesalahan tak terduga");
  //     setOpenToast(true);
  //   }
  // };

  // START TABEL SISWA
  const generateData = async () => {
    setLoading(true);
    try {
      const res = await HomeService.getPpdbPaging({
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
        setDataTabel(sortedSiswa);
        setTotalSiswa(res.data.totalItems);
        // if (debouncedSearch.length >= 2 && page === 0) {
        //   setSearchTerm("");
        // }
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
      const response = await HomeService.searchDataCalonSiswa({
        keyword,
        page,
        size: rowsPerPage,
        tahun,
      });
      console.log("RESPONSE DATA SEARCH SISWA:", response);
      if (response.success) {
        setDataTabel(response.data?.data?.items || []);
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

  const handleOpenEdit = (el) => {
    const data = { ...el };
    setDataRow(data);
    setIsEditMode(true);
    setFormData(el);
    setOpenModal(true);
  };

  const handleOpenTambah = (el) => {
    const data = { ...el };
    setDataRow(data);
    setIsEditMode(false);
    setOpenModal(true);
    setFormData(el);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await HomeService.updatePpdb(formData, dataRow);
      console.log("RESPONSE EDIT CALON SISWA:", response);
      if (response.success) {
        setSuccessAddEditSiswa(true);
      } else {
        setErrorMsg(response.message || "Gagal edit data calon siswa");
        setOpenToast(true);
      }
    } catch (err) {
      setOpenToast(true);
      setErrorMsg(err.message || "Terjadi kesalahan tak terduga");
      console.error("Gagal simpan edit calon siswa:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (siswaId) => {
    try {
      const response = await HomeService.deletePpdb(siswaId);
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

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  useEffect(() => {
    if (debouncedSearch.length >= 2) {
      fetchFilteredData(debouncedSearch);
    } else {
      generateData();
    }
  }, [debouncedSearch, page, rowsPerPage, tahun]);

  //  END TABEL SISWA

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  console.log("SISWA DATA:", siswaData);
  console.log("DATA TABEL SISWA:", dataTabel);
  console.log("FORM DATA EDIT:", formData);
  return (
    <Container>
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
      <Box>
        <Typography
          variant="h5"
          fontWeight="bold"
          color="primary"
          sx={{
            fontSize: { xs: "0.75rem", sm: "1rem", md: "1.25rem" }, // responsif
          }}
        >
          Registrasi PPDB
        </Typography>
        {/* <Divider /> */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            fontStyle: "italic",
            fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" }, // mobile lebih kecil
          }}
        >
          Kelola data registrasi PPDB
        </Typography>
      </Box>
      <Box sx={{ bgcolor: "#f5f5f5" }}>
        <Divider
          sx={{
            mb: 1,
            borderColor: "grey",
            borderBottomWidth: 3,
          }}
        />
      </Box>

      <FormControlLabel
        sx={{
          "& .MuiFormControlLabel-label": {
            fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" }, // label responsif
          },
        }}
        control={
          <Checkbox
            checked={notRegister}
            onChange={() => {
              setNotRegister(!notRegister);
              setSiswaData({
                noPendaftaran: null,
                nama: "",
                tanggalLahir: "",
                email: "",
                alamat: "",
                noHandphone: "",
                jumlahDibayar: "",
                statusPembayaran: "",
                status: "",
                catatanValidasi: "",
                jenisKelamin: "",
                namaAyah: "",
                namaIbu: "",
              });
              if (debouncedSearch.length >= 2 || page > 0) {
                setSearchTerm("");
                setPage(0);
              }
            }}
          />
        }
        label="Belum Punya No Pendaftaran"
      />

      {notRegister && (
        <Box
          sx={{
            mt: 2,
            display: "flex",
            flexDirection: "column",
            // justifyContent: "flex-start",
            gap: 2,
            // alignItems: "center",
          }}
        >
          <TextField
            label="Nama"
            value={siswaData?.nama || ""}
            onChange={(e) =>
              setSiswaData({ ...siswaData, nama: e.target.value })
            }
            id="standard-basic"
            variant="standard"
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
            label="Tanggal Lahir"
            type="date"
            value={siswaData?.tanggalLahir || ""}
            InputLabelProps={{ shrink: true }}
            onChange={(e) =>
              setSiswaData({ ...siswaData, tanggalLahir: e.target.value })
            }
            id="standard-basic"
            variant="standard"
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
            value={siswaData?.email || ""}
            onChange={(e) =>
              setSiswaData({ ...siswaData, email: e.target.value })
            }
            id="standard-basic"
            variant="standard"
            fullWidth
            sx={{
              "& .MuiInputLabel-root": {
                fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" }, // label responsif
              },
              "& .MuiInputBase-input": {
                fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" }, // isi input responsif
              },
            }}
            error={siswaData?.email && !isValidEmail(siswaData.email)}
            helperText={
              siswaData?.email && !isValidEmail(siswaData.email)
                ? "Format email tidak valid"
                : ""
            }
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
            <FormLabel
              id="jenisKelamin-label"
              sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" } }}
            >
              Jenis Kelamin
            </FormLabel>
            <RadioGroup
              row
              aria-labelledby="jenisKelamin-label"
              name="jenisKelamin"
              value={siswaData?.jenisKelamin}
              onChange={(e) =>
                setSiswaData({ ...siswaData, jenisKelamin: e.target.value })
              }
            >
              <FormControlLabel
                value="LAKI_LAKI"
                control={<Radio />}
                label="Laki-laki"
                sx={{
                  "& .MuiFormControlLabel-label": {
                    fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" }, // label responsif
                  },
                }}
              />
              <FormControlLabel
                value="PEREMPUAN"
                control={<Radio />}
                label="Perempuan"
                sx={{
                  "& .MuiFormControlLabel-label": {
                    fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" }, // label responsif
                  },
                }}
              />
            </RadioGroup>
          </FormControl>
          <TextField
            label="Nama Ayah"
            value={siswaData?.namaAyah || ""}
            onChange={(e) =>
              setSiswaData({ ...siswaData, namaAyah: e.target.value })
            }
            id="standard-basic"
            variant="standard"
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
            value={siswaData?.namaIbu || ""}
            onChange={(e) =>
              setSiswaData({ ...siswaData, namaIbu: e.target.value })
            }
            id="standard-basic"
            variant="standard"
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
            value={siswaData?.noHandphone || ""}
            onChange={(e) =>
              setSiswaData({ ...siswaData, noHandphone: e.target.value })
            }
            id="standard-basic"
            variant="standard"
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
          {/* <TextField
            label="Jumlah Bayar"
            value={siswaData?.jumlahDibayar || ""}
            onChange={(e) =>
              setSiswaData({ ...siswaData, jumlahDibayar: e.target.value })
            }
            id="standard-basic"
            variant="standard"
            fullWidth
          /> */}
          <TextField
            label="Jumlah Bayar"
            value={
              siswaData?.jumlahDibayar
                ? new Intl.NumberFormat("id-ID").format(
                    siswaData.jumlahDibayar ?? 0,
                  )
                : ""
            }
            onChange={(e) =>
              setSiswaData({
                ...siswaData,
                jumlahDibayar: Number(e.target.value.replace(/\D/g, "")) || 0,
              })
            }
            id="standard-basic"
            variant="standard"
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

          {/* statusPembayaran */}
          <FormControl
            margin="normal"
            sx={{
              width: "50%",
              "& .MuiInputLabel-root": {
                fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" }, // label responsif
              },
              "& .MuiSelect-select": {
                fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" }, // isi select responsif
                // padding: { xs: "6px 8px", sm: "8px 10px", md: "10px 12px" }, // padding responsif
              },
            }}
          >
            <InputLabel id="statusBayar-label">Status Pembayaran</InputLabel>
            <Select
              labelId="statusBayar-label"
              label="Status Pembayaran"
              value={siswaData?.statusPembayaran}
              onChange={(e) => {
                setSiswaData({
                  ...siswaData,
                  statusPembayaran: e.target.value,
                });
                setErrorPembayaran(null);
              }}
            >
              {dropdownStatusPembayaranOffline.map((gl) => (
                <MenuItem key={gl.id} value={gl.value}>
                  {gl.label}
                </MenuItem>
              ))}
            </Select>
            {errorPembayaran && (
              <div className="bg-red-100 text-red-700 p-2 rounded flex justify-between">
                <span>{errorPembayaran}</span>
                <button onClick={() => setErrorPembayaran(null)}>✕</button>
              </div>
            )}
          </FormControl>
          {/* status */}
          <FormControl
            sx={{
              width: "50%",
              "& .MuiInputLabel-root": {
                fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" }, // label responsif
              },
              "& .MuiSelect-select": {
                fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" }, // isi select responsif
                // padding: { xs: "6px 8px", sm: "8px 10px", md: "10px 12px" }, // padding responsif
              },
            }}
            margin="normal"
          >
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              label="Status"
              value={siswaData?.status}
              onChange={(e) => {
                setSiswaData({ ...siswaData, status: e.target.value });
                setErrorStatus(null);
              }}
            >
              {dropdownStatusOffline.map((gl) => (
                <MenuItem key={gl.id} value={gl.value}>
                  {gl.label}
                </MenuItem>
              ))}
            </Select>
            {errorStatus && (
              <div className="bg-red-100 text-red-700 p-2 rounded flex justify-between">
                <span>{errorStatus}</span>
                <button onClick={() => setErrorStatus(null)}>✕</button>
              </div>
            )}
          </FormControl>
          <div style={{ marginBottom: "10px" }}>
            <InputLabel
              id="alamat-label"
              style={{ marginBottom: "4px" }} // atur jarak label ke textarea
              sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" } }}
            >
              Alamat:
            </InputLabel>
            <TextareaAutosize
              id="alamat-label"
              aria-label="Alamat"
              minRows={3}
              placeholder="Input alamat"
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                fontFamily: "inherit",
                outline: "none",
                fontSize: { xs: "0.50rem", sm: "0.65rem", md: "0.85rem" },
              }}
              value={siswaData?.alamat || ""}
              onChange={(e) =>
                setSiswaData({ ...siswaData, alamat: e.target.value })
              }
            />
          </div>
          <div style={{ marginBottom: "0px" }}>
            <InputLabel
              id="catatan-label"
              style={{ marginBottom: "4px" }} // atur jarak label ke textarea
              sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" } }}
            >
              Catatan:
            </InputLabel>
            <TextareaAutosize
              id="catatan-label"
              aria-label="Catatan"
              minRows={3}
              placeholder="Input catatan"
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                fontFamily: "inherit",
                outline: "none",
                fontSize: { xs: "0.50rem", sm: "0.65rem", md: "0.85rem" },
              }}
              value={siswaData?.catatanValidasi || ""}
              onChange={(e) =>
                setSiswaData({ ...siswaData, catatanValidasi: e.target.value })
              }
            />
          </div>

          <Box
            sx={{
              // mt: 2,
              display: "flex",
              justifyContent: "flex-start",
              gap: 2,
              mb: 2,
            }}
          >
            <Button
              variant="contained"
              color="primary"
              startIcon={<CheckRoundedIcon />}
              // sx={{ borderRadius: "16px" }}
              sx={{
                textTransform: "none",
                boxShadow: 2,
                borderRadius: 4,
                // px: { xs: 2, sm: 3, md: 4 }, // padding horizontal menyesuaikan layar
                // py: { xs: 1, sm: 1.5 }, // padding vertical menyesuaikan layar
                fontSize: { xs: "0.50rem", sm: "0.75rem", md: "1rem" }, // font size adaptif
                width: { xs: "20%", sm: "auto" }, // di mobile full width, di desktop auto
              }}
              onClick={handleSave}
              disabled={
                !siswaData.nama ||
                !siswaData.alamat ||
                !siswaData.email ||
                !siswaData.tanggalLahir ||
                !siswaData.jumlahDibayar ||
                !siswaData.statusPembayaran ||
                !siswaData.status ||
                !siswaData.noHandphone ||
                !siswaData.jenisKelamin ||
                !siswaData.namaAyah ||
                !siswaData.namaIbu
              }
            >
              SAVE
            </Button>
            <Button
              variant="contained"
              color="inherit"
              // sx={{ borderRadius: "16px" }}
              sx={{
                textTransform: "none",
                boxShadow: 2,
                borderRadius: 4,
                // px: { xs: 2, sm: 3, md: 4 }, // padding horizontal menyesuaikan layar
                // py: { xs: 1, sm: 1.5 }, // padding vertical menyesuaikan layar
                fontSize: { xs: "0.50rem", sm: "0.75rem", md: "1rem" }, // font size adaptif
                width: { xs: "20%", sm: "auto" }, // di mobile full width, di desktop auto
              }}
              onClick={() => {
                setSiswaData({
                  noPendaftaran: null,
                  nama: "",
                  tanggalLahir: "",
                  email: "",
                  alamat: "",
                  noHandphone: "",
                  jumlahDibayar: "",
                  statusPembayaran: "",
                  status: "",
                  catatanValidasi: "",
                  jenisKelamin: "",
                  namaAyah: "",
                  namaIbu: "",
                });
                setNotRegister(false);
                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                });
              }}
            >
              CANCEL
            </Button>
          </Box>
        </Box>
      )}
      {/* CONTAINER DATA SISWA */}
      <div>
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
                Manajemen Calon Siswa
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
                Kelola data calon siswa
              </Typography>
            </Box>

            <Button
              variant="contained"
              startIcon={<CachedIcon />}
              onClick={generateData}
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
              Generate Data
            </Button>
          </Box>
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
              <InputLabel id="tahun-label">Pilih Tahun PPDB</InputLabel>
              <Select
                labelId="tahun-label"
                label="Pilih Tahun PPDB"
                value={tahun}
                onChange={(e) => setTahun(e.target.value)}
              >
                {years.map((y) => (
                  <MenuItem key={y} value={y}>
                    {y}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Tooltip
              title="Ketik No Pendaftaran atau Nama"
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
                label="No Pendaftaran / Nama"
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
          <Divider sx={{ mb: 2, mt: 2 }} />
          {/* TABEL SISWA */}
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
                    No Pendaftaran
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
                      minWidth: "100px",
                      fontSize: { xs: "0.50rem", sm: "0.65rem", md: "0.85rem" },
                    }}
                  >
                    Alamat
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
                    Jumlah Bayar
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
                    Status Pembayaran
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
                    Status
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
                    Catatan
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
                {dataTabel?.length > 0 ? (
                  dataTabel.map((s, index) => (
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
                        {s.noPendaftaran}
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
                      <TableCell
                        sx={{
                          // fontWeight: "bold",
                          borderRight: "1px solid #ccc",
                          // maxWidth: "40px",
                          textAlign: "right",
                          fontSize: {
                            xs: "0.50rem",
                            sm: "0.65rem",
                            md: "0.85rem",
                          },
                        }}
                      >
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          minimumFractionDigits: 0,
                        }).format(s.jumlahDibayar ?? 0)}
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
                        {/* {s.statusPembayaran} */}
                        {s.statusPembayaran === "MENUNGGU_PEMBAYARAN" ? (
                          <Chip
                            label="MENUNGGU PEMBAYARAN"
                            color="warning"
                            variant="outlined"
                            sx={{
                              fontSize: {
                                xs: "0.50rem",
                                sm: "0.65rem",
                                md: "0.85rem",
                              },
                              height: 24,
                            }}
                          />
                        ) : s.statusPembayaran === "BELUM_LUNAS" ? (
                          <Chip
                            label="BELUM LUNAS"
                            color="error"
                            variant="outlined"
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
                            label={s.statusPembayaran}
                            color="success"
                            variant="outlined"
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
                      <TableCell
                        sx={{
                          borderRight: "1px solid #ccc",
                          textAlign: "center",
                          fontSize: {
                            xs: "0.50rem",
                            sm: "0.65rem",
                            md: "0.85rem",
                          },
                        }}
                      >
                        {s.status === "MENUNGGU_VALIDASI" ? (
                          <Chip
                            label="MENUNGGU VALIDASI"
                            color="warning"
                            sx={{
                              fontSize: {
                                xs: "0.50rem",
                                sm: "0.65rem",
                                md: "0.85rem",
                              },
                              height: 24,
                            }}
                          />
                        ) : s.status === "DITERIMA" ? (
                          <Chip
                            label="DITERIMA"
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
                            label={s.status}
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
                        {s.catatanValidasi}
                      </TableCell>
                      <TableCell>
                        {s.status === "DITERIMA" ? (
                          <>
                            <Tooltip title="Edit">
                              <IconButton
                                color="primary"
                                onClick={() => handleOpenEdit(s)}
                                // disabled={
                                //   user?.nomorInduk !==
                                //   location?.state?.kelas?.waliGuruNip
                                // }
                                // disabled={handleDisabled()}
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            {/* <Tooltip title="Delete">
                              <IconButton
                                color="error"
                                onClick={() => {
                                  setOpenConfirmDelete(true);
                                  setIdDelete(s.id);
                                  // setJumlahSiswa(null);
                                }}
                                disabled
                                // disabled={
                                //   user?.nomorInduk !==
                                //   location?.state?.kelas?.waliGuruNip
                                // }
                                // disabled={handleDisabled()}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip> */}
                          </>
                        ) : (
                          <>
                            <Tooltip title="Tambah">
                              <IconButton
                                color="success"
                                onClick={() => handleOpenTambah(s)}
                              >
                                <AddIcon />
                              </IconButton>
                            </Tooltip>
                            {/* <Tooltip title="Delete">
                              <IconButton
                                color="error"
                                onClick={() => {
                                  setOpenConfirmDelete(true);
                                  setIdDelete(s.id);
                                  // setJumlahSiswa(null);
                                }}
                                disabled
                                // disabled={
                                //   user?.nomorInduk !==
                                //   location?.state?.kelas?.waliGuruNip
                                // }
                                // disabled={handleDisabled()}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip> */}
                          </>
                        )}
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
            {dataTabel.length > 0 && (
              <TablePagination
                component="div"
                count={totalSiswa}
                page={page}
                onPageChange={(e, newPage) => {
                  setPage(newPage);
                  generateData(newPage, rowsPerPage);
                }}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(e) => {
                  const newSize = parseInt(e.target.value, 10);
                  setRowsPerPage(newSize);
                  setPage(0);
                  generateData(0, newSize);
                }}
              />
            )}
          </TableContainer>
        </Box>
      </div>
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
      {/* POP UP SUKSES ADD SISWA OFFLINE*/}
      <PopUpModal
        open={successCreateSiswa}
        title="Berhasil"
        content="Data siswa berhasil ditambahkan."
        onClose={() => {
          setSuccessCreateSiswa(false);
          setSiswaData({
            noPendaftaran: null,
            nama: "",
            tanggalLahir: "",
            email: "",
            alamat: "",
            noHandphone: "",
            jumlahDibayar: "",
            statusPembayaran: "",
            status: "",
            catatanValidasi: "",
            jenisKelamin: "",
            namaAyah: "",
            namaIbu: "",
          });
          if (debouncedSearch.length >= 2 || page > 0) {
            setSearchTerm("");
            setPage(0);
          } else {
            generateData();
          }
        }}
        icon={<CheckCircleOutlinedIcon sx={{ fontSize: 48, color: "green" }} />}
        maxWidth="sm"
        // fullWidth={false}
      />
      {/* DIALOG EDIT SISWA */}
      <EditSiswa
        openModal={openModal}
        setOpenModal={setOpenModal}
        isEditMode={isEditMode}
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
        dropdownStatusPembayaran={dropdownStatusPembayaran}
        dropdownStatus={dropdownStatus}
      />
      {/* POP UP SUKSES EDIT/TAMBAH SISWA */}
      <PopUpModal
        open={successAddEditSiswa}
        title="Berhasil"
        content={
          isEditMode
            ? "Data calon siswa berhasil diupdate."
            : "Berhasil menambahkan calon siswa"
        }
        onClose={() => {
          setSuccessAddEditSiswa(false);
          setFormData({});
          setOpenModal(false);
          if (debouncedSearch.length >= 2 || page > 0) {
            setSearchTerm("");
            setPage(0);
          } else {
            generateData();
          }
        }}
        icon={<CheckCircleOutlinedIcon sx={{ fontSize: 48, color: "green" }} />}
        maxWidth="sm"
        // fullWidth={false}
      />
      {/* POP UP CONFIRM DELETE */}
      <ConfirmModal
        open={openConfirmDelete}
        title="Konfirmasi Hapus"
        question="Apakah Anda yakin ?"
        icon={
          <HelpOutlineOutlinedIcon sx={{ fontSize: 75, color: "#f44336" }} />
        }
        onConfirm={() => {
          handleDelete(idDelete);
          setOpenConfirmDelete(false);
        }}
        onCancel={() => {
          setOpenConfirmDelete(false);
          setIdDelete(null);
        }}
      />
      {/* POP UP DELETE */}
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
            generateData();
          }
        }}
        icon={<CheckCircleOutlinedIcon sx={{ fontSize: 48, color: "green" }} />}
        maxWidth="sm"
        // fullWidth={false}
      />
    </Container>
  );
}
