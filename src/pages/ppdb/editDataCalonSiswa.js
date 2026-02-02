import { useState } from "react";
import {
  Divider,
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

const EditDataCalonSiswa = ({
  openModal,
  setOpenModal,
  isEditMode,
  formData,
  setFormData,
  handleSubmit,
  dropdownStatusPembayaran,
  dropdownStatus,
}) => {
  const [errorEditStatus, setErrorEditStatus] = useState(null);
  const [errorEditPembayaran, setErrorEditPembayaran] = useState(null);
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
  console.log("FORM DATA KOMPONEN:", formData);
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
        {isEditMode ? "Edit Calon Siswa" : "Tambah Calon Siswa"}
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>
          <TextField
            label="Nama"
            value={formData.nama}
            onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
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
            value={formData.tanggalLahir}
            onChange={(e) =>
              setFormData({ ...formData, tanggalLahir: e.target.value })
            }
            InputLabelProps={{ shrink: true }}
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
            label="Nama Ayah"
            value={formData.namaAyah}
            onChange={(e) =>
              setFormData({ ...formData, namaAyah: e.target.value })
            }
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
            value={formData.namaIbu}
            onChange={(e) =>
              setFormData({ ...formData, namaIbu: e.target.value })
            }
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
              value={formData?.jenisKelamin}
              onChange={(e) =>
                setFormData({ ...formData, jenisKelamin: e.target.value })
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
            label="No Handphone"
            value={formData.noHandphone}
            onChange={(e) =>
              setFormData({ ...formData, noHandphone: e.target.value })
            }
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
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            fullWidth
            sx={{
              "& .MuiInputLabel-root": {
                fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" }, // label responsif
              },
              "& .MuiInputBase-input": {
                fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" }, // isi input responsif
              },
            }}
            error={formData?.email && !isValidEmail(formData.email)}
            helperText={
              formData?.email && !isValidEmail(formData.email)
                ? "Format email tidak valid"
                : ""
            }
          />
          {/* <TextField
            label="Jumlah Bayar"
            value={formData.jumlahDibayar}
            onChange={(e) =>
              setFormData({ ...formData, jumlahDibayar: e.target.value })
            }
            fullWidth
          /> */}
          <TextField
            label="Jumlah Bayar"
            value={
              formData?.jumlahDibayar
                ? new Intl.NumberFormat("id-ID").format(
                    formData.jumlahDibayar ?? 0,
                  )
                : ""
            }
            onChange={(e) =>
              setFormData({
                ...formData,
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
          <FormControl
            fullWidth
            margin="normal"
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
            <InputLabel
              id="statusBayar-label"
              sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" } }}
            >
              Status Pembayaran
            </InputLabel>
            <Select
              labelId="statusBayar-label"
              label="Status Pembayaran"
              value={formData?.statusPembayaran}
              onChange={(e) => {
                setFormData({ ...formData, statusPembayaran: e.target.value });
                setErrorEditPembayaran(null);
              }}
            >
              {dropdownStatusPembayaran.map((gl) => (
                <MenuItem key={gl.id} value={gl.value}>
                  {gl.label}
                </MenuItem>
              ))}
            </Select>
            {errorEditPembayaran && (
              <div className="bg-red-100 text-red-700 p-2 rounded flex justify-between">
                <span>{errorEditPembayaran}</span>
                <button onClick={() => setErrorEditPembayaran(null)}>✕</button>
              </div>
            )}
          </FormControl>
          <FormControl
            fullWidth
            margin="normal"
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
            <InputLabel
              id="status-label"
              sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" } }}
            >
              Status
            </InputLabel>
            <Select
              labelId="status-label"
              label="Status"
              value={formData?.status}
              onChange={(e) => {
                setFormData({ ...formData, status: e.target.value });
                setErrorEditStatus(null);
              }}
            >
              {dropdownStatus.map((gl) => (
                <MenuItem key={gl.id} value={gl.value}>
                  {gl.label}
                </MenuItem>
              ))}
            </Select>
            {errorEditStatus && (
              <div className="bg-red-100 text-red-700 p-2 rounded flex justify-between">
                <span>{errorEditStatus}</span>
                <button onClick={() => setErrorEditStatus(null)}>✕</button>
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
              value={formData?.alamat || ""}
              onChange={(e) =>
                setFormData({ ...formData, alamat: e.target.value })
              }
            />
          </div>
          <div style={{ marginBottom: "16px" }}>
            <InputLabel
              id="catatan-label"
              style={{ marginBottom: "4px" }} // atur jarak label ke textarea
              sx={{ fontSize: { xs: "0.50rem", sm: "0.65rem", md: "0.85rem" } }}
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
              value={formData?.catatanValidasi || ""}
              onChange={(e) =>
                setFormData({ ...formData, catatanValidasi: e.target.value })
              }
            />
          </div>
          {/* <TextField
            label="Catatan"
            value={formData.catatanValidasi}
            onChange={(e) =>
              setFormData({ ...formData, catatanValidasi: e.target.value })
            }
            fullWidth
          /> */}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={() => {
            setOpenModal(false);
            setErrorEditStatus(null);
            setErrorEditPembayaran(null);
            setFormData({});
          }}
          variant="outlined"
          color="secondary"
          sx={{ textTransform: "none" }}
        >
          Batal
        </Button>
        <Button
          onClick={() => {
            if (formData?.statusPembayaran === "MENUNGGU_PEMBAYARAN") {
              setErrorEditPembayaran("Pilihan status pembayaran belum diubah");
              return;
            }
            if (formData?.status === "MENUNGGU_VALIDASI") {
              setErrorEditStatus("Pilihan status belum diubah");
              return;
            }
            setOpenModal(false);
            handleSubmit();
            setErrorEditStatus(null);
            setErrorEditPembayaran(null);
          }} // bikin fungsi handleSubmit untuk POST /api/siswa
          variant="contained"
          color="primary"
          sx={{ textTransform: "none" }}
          disabled={
            !formData?.nama ||
            !formData?.alamat ||
            !formData?.tanggalLahir ||
            !formData?.email ||
            !formData?.noHandphone ||
            !formData?.jumlahDibayar
          }
        >
          Simpan
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditDataCalonSiswa;
