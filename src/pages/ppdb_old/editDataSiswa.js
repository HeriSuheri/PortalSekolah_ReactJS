import React, { useEffect, useState } from "react";
import {
  Divider,
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import KelasService from "../manajemen/kelas/KelasService";

const EditData = ({
  openModal,
  setOpenModal,
  isEditMode,
  formData,
  setFormData,
  handleSubmit,
  dropdownStatusPembayaran,
  dropdownStatus,
  dataKelas,
}) => {
  const [jumlahSiswaEdit, setJumlahSiswaEdit] = useState(null);
  const getJumlahSiswa = async (id) => {
    try {
      const response = await KelasService.getJumlahSiswa(id);
      console.log("RESPONSE GET DETAIL SISWA KELAS:", response);
      if (response.success) {
        setJumlahSiswaEdit(response.data?.data?.siswa.length);
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
  return (
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
            onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
            fullWidth
          />
          <TextField
            label="NIS"
            value={formData.nis}
            onChange={(e) => setFormData({ ...formData, nis: e.target.value })}
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
          <TextField
            label="Jumlah Bayar"
            value={formData.jumlahBayar}
            onChange={(e) =>
              setFormData({ ...formData, jumlahBayar: e.target.value })
            }
            fullWidth
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="statusBayar-label">Status Pembayaran</InputLabel>
            <Select
              labelId="statusBayar-label"
              label="Status Pembayaran"
              value={formData?.statusPembayaran}
              onChange={(e) =>
                setFormData({ ...formData, statusPembayaran: e.target.value })
              }
            >
              {dropdownStatusPembayaran.map((gl) => (
                <MenuItem key={gl.id} value={gl.value}>
                  {gl.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              label="Status"
              value={formData?.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
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
              value={formData?.classroomId}
              onChange={(e) => {
                setFormData({ ...formData, classroomId: e.target.value });
                getJumlahSiswa(e.target.value);
              }}
              sx={{ mb: 1 }}
            >
              {dataKelas.map((gl) => (
                <MenuItem key={gl.id} value={gl.id}>
                  {gl.name}
                </MenuItem>
              ))}
            </Select>
            {jumlahSiswaEdit !== null && (
              <Chip
                label={`Jumlah Siswa di kelas ini ${jumlahSiswaEdit} siswa`}
                color="warning"
                variant="outlined"
              />
            )}
          </FormControl>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={() => {
            setOpenModal(false);
            setJumlahSiswaEdit(null);
          }}
          variant="outlined"
          color="secondary"
          sx={{ textTransform: "none" }}
        >
          Batal
        </Button>
        <Button
          onClick={() => {
            handleSubmit();
            setJumlahSiswaEdit(null);
          }} // bikin fungsi handleSubmit untuk POST /api/siswa
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
  );
};

export default EditData;
