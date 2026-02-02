import { useState } from "react";
import {
  Divider,
  Box,
  TextField,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Autocomplete,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

const AddSiswa = ({
  openModal,
  setOpenModal,
  selectedPpdb,
  setSelectedPpdb,
  handleSubmit,
  dataPpdb,
}) => {
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
  console.log("SELECTED DATA PPDB KOMPONEN:", selectedPpdb);
  console.log("DATA PPDB KOMPONEN:", dataPpdb);
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
      <DialogTitle style={{ fontWeight: "bold" }}>Tambah Siswa</DialogTitle>
      <Divider />
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={1} mb={2}>
          <Autocomplete
            options={dataPpdb || []}
            getOptionLabel={(option) =>
              `${option?.noPendaftaran ?? ""} - ${option?.nama ?? ""}`
            }
            value={selectedPpdb}
            onChange={(event, newValue) => setSelectedPpdb(newValue)}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Cari Calon Siswa"
                variant="outlined"
                size="small"
                sx={{
                  "& .MuiInputLabel-root": {
                    fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" }, // label responsif
                  },
                  "& .MuiInputBase-input": {
                    fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" }, // isi input responsif
                  },
                }}
              />
            )}
            sx={{ width: 300 }}
          />
        </Box>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>
          <TextField
            label="Nama"
            value={selectedPpdb?.nama || ""}
            InputProps={{ readOnly: true }}
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
            label="Tanggal Lahir"
            type="date"
            value={selectedPpdb?.tanggalLahir || ""}
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
            InputProps={{ readOnly: true }} // kalau mau hanya baca
          />
          <TextField
            label="No Handphone"
            value={selectedPpdb?.noHandphone || ""}
            InputLabelProps={{ shrink: true }}
            InputProps={{ readOnly: true }}
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
            value={selectedPpdb?.email || ""}
            InputLabelProps={{ shrink: true }}
            InputProps={{ readOnly: true }}
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
            <FormLabel id="jenisKelamin-label">Jenis Kelamin</FormLabel>
            <RadioGroup
              row
              aria-labelledby="jenisKelamin-label"
              name="jenisKelamin"
              value={selectedPpdb?.jenisKelamin || ""}
              // InputProps={{ readOnly: true }}
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
            value={selectedPpdb?.namaAyah || ""}
            InputLabelProps={{ shrink: true }}
            InputProps={{ readOnly: true }}
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
            value={selectedPpdb?.namaIbu || ""}
            InputLabelProps={{ shrink: true }}
            InputProps={{ readOnly: true }}
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
            label="Alamat"
            value={selectedPpdb?.alamat || ""}
            InputLabelProps={{ shrink: true }}
            InputProps={{ readOnly: true }}
            fullWidth
            sx={{
              "& .MuiInputLabel-root": {
                fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" }, // label responsif
              },
              "& .MuiInputBase-input": {
                fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" }, // isi input responsif
              },
            }}
            error={selectedPpdb?.email && !isValidEmail(selectedPpdb.email)}
            helperText={
              selectedPpdb?.email && !isValidEmail(selectedPpdb.email)
                ? "Format email tidak valid"
                : ""
            }
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={() => {
            setOpenModal(false);
            setSelectedPpdb(null);
          }}
          variant="outlined"
          color="secondary"
          sx={{ textTransform: "none" }}
        >
          Batal
        </Button>
        <Button
          onClick={() => {
            setOpenModal(false);
            handleSubmit();
          }} // bikin fungsi handleSubmit untuk POST /api/siswa
          variant="contained"
          color="primary"
          sx={{ textTransform: "none" }}
          disabled={!selectedPpdb}
          // disabled={
          //   !formData?.nama ||
          //   !formData?.alamat ||
          //   !formData?.tanggalLahir ||
          //   !formData?.email ||
          //   !formData?.noHandphone ||
          //   !formData?.jumlahDibayar
          // }
        >
          Simpan
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddSiswa;
