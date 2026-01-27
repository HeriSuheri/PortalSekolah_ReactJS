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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import CachedIcon from "@mui/icons-material/Cached";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import KelasService from "../manajemen/kelas/KelasService";
import HomeService from "../home/HomeServive";
import PopUpModal from "../../components/PopUpModal";
import ConfirmModal from "../../components/DialogPopup";
import EditSiswa from "./editDataSiswa";
import { useDebounce } from "../../hook/UseDebounce";

export default function PPDBRegistrasi() {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [openToast, setOpenToast] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [mode, setMode] = useState(null); // "online" atau "offline"
  const [noPendaftaran, setNoPendaftaran] = useState("");
  const [jumlahSiswa, setJumlahSiswa] = useState(null);
  const [siswaData, setSiswaData] = useState({
    noPendaftaran: null,
    nama: "",
    tanggalLahir: "",
    email: "",
    namaAyah: "",
    namaIbu: "",
    alamat: "",
    noHandphone: "",
    jumlahDibayar: "",
    statusPembayaran: "",
    status: "",
    classroomId: "",
  });
  const [dataKelas, setDataKelas] = useState([]);
  const [successCreateSiswa, setSuccessCreateSiswa] = useState(false);

  // start tabel siswa
  const [dataTabel, setDataTabel] = useState([]);
  const [page, setPage] = useState(0); // halaman dimulai dari 0
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalSiswa, setTotalSiswa] = useState(0);
  const [idDelete, setIdDelete] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  // const [formData, setFormData] = useState({
  //   id: null,
  //   noPendaftaran: null,
  //   nama: "",
  //   nis: "",
  //   tanggalLahir: "",
  //   email: "",
  //   namaAyah: "",
  //   namaIbu: "",
  //   alamat: "",
  //   noHandphone: "",
  //   jumlahDiBayar: "",
  //   statusPembayaran: "",
  //   status: "",
  //   classroomId: "",
  // });
  const [formData, setFormData] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);
  const [successEditSiswa, setSuccessEditSiswa] = useState(false);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  // end tabel siswa

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await HomeService.cekSiswaRegisterPPDB(noPendaftaran);
      console.log("RES CEK REGISTER PPDB:", response);
      if (response.success) {
        setSiswaData(response?.data?.data);
        setLoading(false);
      } else {
        setErrorMsg(response.message || "Gagal cek register");
        setOpenToast(true);
      }
    } catch (err) {
      setOpenToast(true);
      setErrorMsg(err.message || "Terjadi kesalahan tak terduga");
      console.error("Gagal cek register:", err);
    } finally {
      setLoading(false);
    }
  };

  const getJumlahSiswa = async (id) => {
    try {
      const response = await KelasService.getJumlahSiswa(id);
      console.log("RESPONSE GET DETAIL SISWA KELAS:", response);
      if (response.success) {
        setJumlahSiswa(response.data?.data?.siswa.length);
      } else {
        console.error("gagal dapatkan detail siswa kelas");
        // setErrorMsg(response.message || "Gagal tambah data siswa");
        // setOpenToast(true);
      }
    } catch (err) {
      // setOpenToast(true);
      // setErrorMsg(err.message || "Terjadi kesalahan tak terduga");
      console.error("Gagal get detail siswa:", err);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await KelasService.createSiswa(siswaData);
      console.log("RESPONSE CREATE SISWA:", response);
      if (response.success) {
        setSuccessCreateSiswa(true);
        setJumlahSiswa(null);
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
    // { id: 3, value: "DITOLAK", label: "Ditolak" },
  ];

  const dropdownStatusPembayaran = [
    { id: 1, value: "MENUNGGU_PEMBAYARAN", label: "Menunggu Pembayaran" },
    { id: 2, value: "LUNAS", label: "Lunas" },
    { id: 3, value: "BELUM_LUNAS", label: "Belum Lunas" },
  ];

  const getClassroom = async () => {
    try {
      const response = await KelasService.getClassAll();
      if (response.success) {
        let kelas = response.data.data.map((item) => ({
          id: item.id,
          name: item.name,
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

  useEffect(() => {
    getClassroom();
  }, []);

  // START TABEL SISWA
  const generateData = async () => {
    setLoading(true);
    try {
      const res = await KelasService.getSiswaPaging({
        page,
        size: rowsPerPage,
      });
      console.log("RESPONSE GET SISWA:", res);
      if (res.success) {
        // ambil content siswa
        const siswaContent = res.data.items || [];
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
      const response = await KelasService.searchDataSiswa({
        keyword,
        page,
        size: rowsPerPage,
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
    // setFormData({
    //   id: el.id,
    //   nama: el.nama,
    //   nis: el.nis,
    //   tanggalLahir: el.tanggalLahir,
    //   alamat: el.alamat,
    //   namaAyah: el.namaAyah,
    //   namaIbu: el.namaIbu,
    //   noHandphone: el.noHandphone,
    //   classroomId: id,
    //   email: el.email,
    // });
    // setJumlahSiswa(null);
    setFormData(el);
    setOpenModal(true);
  };

  const handleSubmitEdit = async () => {
    setLoading(true);
    try {
      const response = await KelasService.updateSiswa(formData);
      console.log("RESPONSE EDIT SISWA:", response);
      if (response.success) {
        setSuccessEditSiswa(true);
      } else {
        setErrorMsg(response.message || "Gagal edit data siswa");
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

  const handleDelete = async (siswaId) => {
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

  useEffect(() => {
    if (debouncedSearch.length >= 2) {
      fetchFilteredData(debouncedSearch);
    } else {
      generateData();
    }
  }, [debouncedSearch, page, rowsPerPage]);

  //  END TABEL SISWA

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
        <Typography variant="h5" fontWeight="bold" color="primary">
          Registrasi PPDB
        </Typography>
        {/* <Divider /> */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontStyle: "italic" }}
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

      {/* Checkbox pilihan */}
      <FormControlLabel
        control={
          <Checkbox
            checked={mode === "online"}
            onChange={() => {
              setMode("online");
              setSiswaData({
                noPendaftaran: null,
                nama: "",
                tanggalLahir: "",
                email: "",
                namaAyah: "",
                namaIbu: "",
                alamat: "",
                noHandphone: "",
                jumlahDibayar: "",
                statusPembayaran: "",
                status: "",
                classroomId: "",
              });
            }}
          />
        }
        label="Punya No Pendaftaran"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={mode === "offline"}
            onChange={() => {
              setMode("offline");
              setSiswaData({
                noPendaftaran: null,
                nama: "",
                tanggalLahir: "",
                email: "",
                namaAyah: "",
                namaIbu: "",
                alamat: "",
                noHandphone: "",
                jumlahDibayar: "",
                statusPembayaran: "",
                status: "",
                classroomId: "",
              });
              if (debouncedSearch.length >= 2 || page > 0) {
                setSearchTerm("");
                setPage(0);
              }
              setJumlahSiswa(null);
            }}
          />
        }
        label="Belum Register"
      />

      {/* Jika online, tampilkan input No Pendaftaran + Search */}
      {mode === "online" && (
        <Box
          sx={{
            mt: 2,
            display: "flex",
            justifyContent: "flex-start",
            gap: 2,
            alignItems: "center",
          }}
        >
          <TextField
            fullWidth
            label="No Pendaftaran"
            value={noPendaftaran}
            onChange={(e) => setNoPendaftaran(e.target.value.toUpperCase())}
            id="standard-basic"
            variant="standard"
          />
          <Button
            variant="contained"
            onClick={handleSearch}
            sx={{ borderRadius: "16px" }}
          >
            Search
          </Button>
        </Box>
      )}

      {/* Field siswa muncul kalau offline, atau online setelah search berhasil */}
      {(mode === "offline" || siswaData.nama) && (
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
          />
          {mode === "online" && (
            <TextField
              label="No Pendaftaran"
              value={siswaData?.noPendaftaran || ""}
              onChange={(e) =>
                setSiswaData({ ...siswaData, noPendaftaran: e.target.value })
              }
              id="standard-basic"
              variant="standard"
              fullWidth
              disabled={mode === "offline"}
            />
          )}
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
          />

          <TextField
            label="Nama Ayah"
            value={siswaData?.namaAyah || ""}
            onChange={(e) =>
              setSiswaData({ ...siswaData, namaAyah: e.target.value })
            }
            id="standard-basic"
            variant="standard"
            fullWidth
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
          />

          <TextField
            label="Alamat"
            value={siswaData?.alamat || ""}
            onChange={(e) =>
              setSiswaData({ ...siswaData, alamat: e.target.value })
            }
            id="standard-basic"
            variant="standard"
            fullWidth
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
          />
          <TextField
            label="Jumlah Bayar"
            value={siswaData?.jumlahDibayar || ""}
            onChange={(e) =>
              setSiswaData({ ...siswaData, jumlahDibayar: e.target.value })
            }
            id="standard-basic"
            variant="standard"
            fullWidth
          />
          {/* statusPembayaran */}
          <FormControl fullWidth margin="normal">
            <InputLabel id="statusBayar-label">Status Pembayaran</InputLabel>
            <Select
              labelId="statusBayar-label"
              label="Status Pembayaran"
              value={siswaData?.statusPembayaran}
              onChange={(e) =>
                setSiswaData({ ...siswaData, statusPembayaran: e.target.value })
              }
            >
              {dropdownStatusPembayaran.map((gl) => (
                <MenuItem key={gl.id} value={gl.value}>
                  {gl.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {/* status */}
          <FormControl fullWidth margin="normal">
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              label="Status"
              value={siswaData?.status}
              onChange={(e) =>
                setSiswaData({ ...siswaData, status: e.target.value })
              }
            >
              {dropdownStatus.map((gl) => (
                <MenuItem key={gl.id} value={gl.value}>
                  {gl.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel id="kelas-label">Assign Kelas</InputLabel>
            <Select
              labelId="kelas-label"
              label="Assign Kelas"
              value={siswaData?.classroomId}
              onChange={(e) => {
                setSiswaData({ ...siswaData, classroomId: e.target.value });
                getJumlahSiswa(e.target.value);
              }}
              sx={{ mb:1}}
            >
              {dataKelas.map((gl) => (
                <MenuItem key={gl.id} value={gl.id}>
                  {gl.name}
                </MenuItem>
              ))}
            </Select>
            {jumlahSiswa !== null && (
            <Chip
              label={`Jumlah Siswa di kelas ini ${jumlahSiswa} siswa`}
              color="warning"
              variant="outlined"
            />
          )}
          </FormControl>
          
          {/* classroomId */}
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
              sx={{ borderRadius: "16px" }}
              onClick={handleSave}
              disabled={
                !siswaData.nama ||
                !siswaData.alamat ||
                !siswaData.email ||
                !siswaData.tanggalLahir ||
                !siswaData.namaAyah ||
                !siswaData.namaIbu ||
                !siswaData.jumlahDibayar ||
                !siswaData.statusPembayaran ||
                !siswaData.status ||
                !siswaData.noHandphone ||
                !siswaData.classroomId
              }
            >
              SAVE
            </Button>
            <Button
              variant="contained"
              color="inherit"
              sx={{ borderRadius: "16px" }}
              onClick={() => {
                setSiswaData({
                  noPendaftaran: null,
                  nama: "",
                  tanggalLahir: "",
                  email: "",
                  namaAyah: "",
                  namaIbu: "",
                  alamat: "",
                  noHandphone: "",
                  jumlahDibayar: "",
                  statusPembayaran: "",
                  status: "",
                  classroomId: "",
                });
                setJumlahSiswa(null);
              }}
            >
              CANCEL
            </Button>
          </Box>
        </Box>
      )}
      {/* CONTAINER DATA SISWA */}
      {/* {(mode === "online" || siswaData.nama) && ( */}
      <div
      // style={{
      //   marginTop: mode === "online" && dataTabel.length > 0 ? "50px" : "",
      // }}
      >
        {/* <Divider
          // disableGutters
          variant="fullWidth"
          sx={{
            mb: 1,
            borderColor: "grey",
            borderBottomWidth: 3,
          }}
        /> */}
        <Box
          sx={{
            // display: "flex",
            // flexDirection: "row",
            minHeight: "100vh",
            // alignItems: "center",
            p: 2,
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
            mb={3}
            px={1}
          >
            <Box>
              <Typography variant="h5" fontWeight="bold" color="primary">
                Manajemen Siswa
              </Typography>
              {/* <Divider /> */}
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontStyle: "italic" }}
              >
                Kelola data siswa
              </Typography>
            </Box>

            <Button
              variant="contained"
              startIcon={<CachedIcon />}
              onClick={generateData}
              // disabled={!allowedNomorInduk.includes(user.nomorInduk)}
              sx={{ textTransform: "none", boxShadow: 2, borderRadius: 4 }}
            >
              Generate Data
            </Button>
          </Box>
          <Tooltip
            title="Cari Nama Siswa"
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
              }}
            />
          </Tooltip>
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
                      // maxWidth: "40px",
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
                    Nama Kelas
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
                      minWidth: "100px",
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
                    }}
                  >
                    Status
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
                          textAlign: "center",
                        }}
                      >
                        {s.classroomName}
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
                          minWidth: "200px",
                        }}
                      >
                        {s.alamat}
                      </TableCell>
                      <TableCell
                        sx={{
                          // fontWeight: "bold",
                          borderRight: "1px solid #ccc",
                          // maxWidth: "40px",
                          textAlign: "center",
                        }}
                      >
                        {s.jumlahBayar}
                      </TableCell>
                      <TableCell
                        sx={{
                          // fontWeight: "bold",
                          borderRight: "1px solid #ccc",
                          // maxWidth: "40px",
                          textAlign: "center",
                        }}
                      >
                        {s.statusPembayaran}
                      </TableCell>
                      <TableCell
                        sx={{
                          // fontWeight: "bold",
                          borderRight: "1px solid #ccc",
                          // maxWidth: "40px",
                          textAlign: "center",
                        }}
                      >
                        {s.status}
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
                            // disabled={handleDisabled()}
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
                              // setJumlahSiswa(null);
                            }}
                            // disabled={
                            //   user?.nomorInduk !==
                            //   location?.state?.kelas?.waliGuruNip
                            // }
                            // disabled={handleDisabled()}
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
      {/* )} */}
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
      {/* POP UP SUKSES ADD SISWA */}
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
            namaAyah: "",
            namaIbu: "",
            alamat: "",
            noHandphone: "",
            jumlahDibayar: "",
            statusPembayaran: "",
            status: "",
            classroomId: "",
          });
          setNoPendaftaran("");
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
        isEditMode={true}
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmitEdit}
        dropdownStatusPembayaran={dropdownStatusPembayaran}
        dropdownStatus={dropdownStatus}
        dataKelas={dataKelas}
      />
      {/* POP UP SUKSES EDIT SISWA */}
      <PopUpModal
        open={successEditSiswa}
        title="Berhasil"
        content="Data siswa berhasil diupdate."
        onClose={() => {
          setSuccessEditSiswa(false);
          setFormData({});
          setOpenModal(false);
          // setFormData({
          //   id: null,
          //   noPendaftaran: null,
          //   nama: "",
          //   nis: "",
          //   tanggalLahir: "",
          //   email: "",
          //   namaAyah: "",
          //   namaIbu: "",
          //   alamat: "",
          //   noHandphone: "",
          //   jumlahDiBayar: "",
          //   statusPembayaran: "",
          //   status: "",
          //   classroomId: "",
          // });
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
