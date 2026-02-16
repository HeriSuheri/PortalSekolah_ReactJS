// import { useState, useEffect, useRef } from "react";
// import {
//   AppBar,
//   Toolbar,
//   Typography,
//   Button,
//   Container,
//   Box,
//   CircularProgress,
//   Snackbar,
//   Alert,
//   IconButton,
//   Grid,
//   Switch,
//   TextField,
// } from "@mui/material";
// import HomeService from "../../home/HomeServive";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";

// const Content = () => {
//   const [content, setDataContent] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [openToast, setOpenToast] = useState(false);
//   const [errorMsg, setErrorMsg] = useState("");
//   const [editIndex, setEditIndex] = useState(null);
//   const [editValue, setEditValue] = useState("");

//   const getDataContent = async () => {
//     setLoading(true);
//     try {
//       const response = await HomeService.getContent();
//       console.log("RES DATA CONTENT:", response);
//       if (response.success) {
//         setDataContent(response?.data);
//       } else {
//         setErrorMsg(response.message || "Gagal get content");
//         setOpenToast(true);
//       }
//     } catch (err) {
//       setOpenToast(true);
//       setErrorMsg(err.message || "Terjadi kesalahan tak terduga");
//       console.error("Gagal get content:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleToggle = (paramKey, checked) => {
//     // TODO: panggil API PUT untuk update isActive
//     console.log("Toggle:", paramKey, checked);
//   };

//   const handleDelete = (paramKey, index) => {
//     // TODO: panggil API PUT dengan array baru tanpa item index
//     console.log("Delete:", paramKey, index);
//   };

//   const handleEdit = (paramKey, index, value) => {
//     setEditIndex(`${paramKey}-${index}`);
//     setEditValue(value);
//   };

//   const handleSaveEdit = (paramKey, index) => {
//     // TODO: panggil API PUT dengan array baru (replace item index dengan editValue)
//     console.log("Save:", paramKey, index, editValue);
//     setEditIndex(null);
//     setEditValue("");
//   };

//   useEffect(() => {
//     getDataContent();
//   }, []);

//   useEffect(() => {
//     window.scrollTo({
//       top: 0,
//       behavior: "smooth",
//     });
//   }, []);

//   return (
//     <>
//       {loading && (
//         <Box
//           sx={{
//             position: "fixed", // atau "absolute" kalau mau relatif ke parent
//             top: 0,
//             left: 0,
//             width: "100%",
//             height: "100%",
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             bgcolor: "rgba(255,255,255,0.7)", // semi transparan background
//             zIndex: 1300, // lebih tinggi dari konten biasa
//           }}
//         >
//           <CircularProgress />
//         </Box>
//       )}
//       {/* LOOPING DI BUNGKUS BOX */}
//       <Box sx={{ p: 2, borderRadius: 4, borderWidth: 2 }}>
//         {content.map((item) => (
//           <Grid
//             container
//             key={item.paramKey}
//             spacing={2}
//             alignItems="center"
//             sx={{ mb: 2 }}
//           >
//             <Grid item xs={4}>
//               <Typography variant="subtitle1">{item.paramKey}</Typography>
//               <Typography variant="body2" color="text.secondary">
//                 {item.description}
//               </Typography>
//             </Grid>

//             <Grid item xs={8}>
//               {item.paramKey === "ppdb_menu" ? (
//                 <Switch
//                   checked={item.isActive}
//                   onChange={(e) =>
//                     handleToggle(item.paramKey, e.target.checked)
//                   }
//                 />
//               ) : Array.isArray(item.paramValue) ? (
//                 <Box>
//                   {item.paramValue.map((val, idx) => (
//                     <Box
//                       key={idx}
//                       sx={{
//                         display: "flex",
//                         alignItems: "center",
//                         mb: 1,
//                       }}
//                     >
//                       {editIndex === `${item.paramKey}-${idx}` ? (
//                         <>
//                           <TextField
//                             size="small"
//                             value={editValue}
//                             onChange={(e) => setEditValue(e.target.value)}
//                           />
//                           <Button
//                             onClick={() => handleSaveEdit(item.paramKey, idx)}
//                           >
//                             Save
//                           </Button>
//                         </>
//                       ) : (
//                         <>
//                           <Typography sx={{ flexGrow: 1 }}>{val}</Typography>
//                           <IconButton
//                             onClick={() => handleEdit(item.paramKey, idx, val)}
//                           >
//                             <EditIcon />
//                           </IconButton>
//                           <IconButton
//                             onClick={() => handleDelete(item.paramKey, idx)}
//                           >
//                             <DeleteIcon />
//                           </IconButton>
//                         </>
//                       )}
//                     </Box>
//                   ))}
//                 </Box>
//               ) : (
//                 <Typography>{item.paramValue}</Typography>
//               )}
//             </Grid>
//           </Grid>
//         ))}
//       </Box>

//       <Snackbar
//         open={openToast}
//         autoHideDuration={3000}
//         onClose={() => setOpenToast(false)}
//         anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
//       >
//         <Alert severity="error" onClose={() => setOpenToast(false)}>
//           {errorMsg}
//         </Alert>
//       </Snackbar>
//     </>
//   );
// };

// export default Content;

import {
  Box,
  CircularProgress,
  Snackbar,
  Alert,
  Grid,
  Typography,
  Switch,
  IconButton,
  TextField,
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  FormControlLabel,
  ListItemText,
  Divider,
  Tooltip,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import { useState, useEffect } from "react";
import HomeService from "../../home/HomeServive";
import SnackBarAlert from "../../../components/SnackbarAlert";

const Content = () => {
  const [content, setDataContent] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openToast, setOpenToast] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [addingKey, setAddingKey] = useState(null);
  const [newValue, setNewValue] = useState("");
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastSeverity, setToastSeverity] = useState("success");
  const [newFile, setNewFile] = useState(null); // file image yang dipilih
  const [newDescription, setNewDescription] = useState(""); // deskripsi acara baru
  const [editFile, setEditFile] = useState(null); // file baru saat edit
  const [previewImage, setPreviewImage] = useState(null);
  const [editPreview, setEditPreview] = useState({});
  const [isEdit, setIsEdit] = useState(false);

  // const [openConfirm, setOpenConfirm] = useState(false);
  // const [deleteTarget, setDeleteTarget] = useState(null);

  const getDataContent = async (param) => {
    if (!param) {
      setLoading(true);
    }
    try {
      const response = await HomeService.getContent();
      if (response.success) {
        // sort ascending berdasarkan id
        const sortedData = [...(response?.data || [])].sort(
          (a, b) => a.id - b.id,
        );
        setDataContent(sortedData);
      } else {
        setErrorMsg(response.message || "Gagal get data");
        setOpenToast(true);
      }
    } catch (err) {
      setOpenToast(true);
      setErrorMsg(err.message || "Terjadi kesalahan tak terduga");
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (paramKey, checked) => {
    setLoading(true);
    try {
      const payload = { isActive: checked };
      const response = await HomeService.saveEditContent(paramKey, payload);

      if (response.success) {
        getDataContent("param");
        setToastMessage("Content berhasil disimpan");
        setToastSeverity("success");
        setToastOpen(true);
      } else {
        setErrorMsg(response.message || "Gagal save content");
        setOpenToast(true);
      }
    } catch (err) {
      console.error("Toggle failed:", err);
      setErrorMsg("Gagal update");
      setOpenToast(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (paramKey, index, item) => {
    try {
      let parsedValue;
      try {
        parsedValue = JSON.parse(item.paramValue);
      } catch {
        parsedValue = item.paramValue;
      }

      let payload;
      if (Array.isArray(parsedValue)) {
        // hapus item array sesuai index
        const updatedArray = parsedValue.filter((_, i) => i !== index);
        payload = { paramValue: updatedArray };
      } else {
        // untuk single value → bisa kosongkan string
        payload = { paramValue: "" };
      }

      const response = await HomeService.saveEditContent(paramKey, payload);

      if (response.success) {
        getDataContent("param");
        // reset edit mode
        setEditIndex(null);
        setEditValue("");
        setToastMessage("Content berhasil dihapus");
        setToastSeverity("success");
        setToastOpen(true);
        setIsEdit(false);
      } else {
        setErrorMsg(response.message || "Gagal hapus content");
        setOpenToast(true);
      }
    } catch (err) {
      console.error("Delete failed:", err);
      setErrorMsg("Gagal hapus content");
      setOpenToast(true);
    }
  };

  //   const handleAddNew = async (paramKey) => {
  //     try {
  //       let parsedValue;
  //       try {
  //         parsedValue = JSON.parse(
  //           content.find((c) => c.paramKey === paramKey).paramValue,
  //         );
  //       } catch {
  //         parsedValue = [];
  //       }

  //       const updatedArray = [...parsedValue, newValue];
  //       const payload = { paramValue: updatedArray };

  //       const response = await HomeService.saveEditContent(paramKey, payload);
  //       if (response.success) {
  //         getDataContent("param");
  //         setAddingKey(null);
  //         setNewValue("");
  //       } else {
  //         setErrorMsg(response.message || "Gagal save content");
  //         setOpenToast(true);
  //       }
  //     } catch (err) {
  //       setErrorMsg("Gagal tambah data");
  //       setOpenToast(true);
  //     }
  //   };

  //   const handleAddNew = async (paramKey) => {
  //     try {
  //       let parsedValue;
  //       try {
  //         parsedValue = JSON.parse(
  //           content.find((c) => c.paramKey === paramKey).paramValue,
  //         );
  //       } catch {
  //         parsedValue = [];
  //       }

  //       const updatedArray = [...parsedValue, newValue];

  //       // kalau Entity/DTO di BE masih String → stringify
  //       const payload = { paramValue: JSON.stringify(updatedArray) };

  //       // kalau Entity/DTO sudah JsonNode/List<String> → langsung array
  //       // const payload = { paramValue: updatedArray };

  //       const response = await HomeService.saveEditContent(paramKey, payload);
  //       if (response.success) {
  //         getDataContent("param");
  //         setAddingKey(null);
  //         setNewValue("");
  //       } else {
  //         setErrorMsg(response.message || "Gagal save content");
  //         setOpenToast(true);
  //       }
  //     } catch (err) {
  //       setErrorMsg("Gagal tambah data");
  //       setOpenToast(true);
  //     }
  //   };

  const handleAddNew = async (paramKey) => {
    try {
      let parsedValue;
      try {
        parsedValue = JSON.parse(
          content.find((c) => c.paramKey === paramKey).paramValue,
        );
      } catch {
        // kalau gagal parse, jangan langsung []
        // cek apakah value sebenarnya string biasa
        parsedValue =
          content.find((c) => c.paramKey === paramKey).paramValue || [];
      }

      // pastikan parsedValue array
      if (!Array.isArray(parsedValue)) {
        parsedValue = [parsedValue];
      }

      const updatedArray = [...parsedValue, newValue];

      // kalau BE masih String
      const payload = { paramValue: JSON.stringify(updatedArray) };

      // kalau BE sudah JsonNode/List<String>
      // const payload = { paramValue: updatedArray };

      const response = await HomeService.saveEditContent(paramKey, payload);
      if (response.success) {
        getDataContent("param");
        setAddingKey(null);
        setNewValue("");
        setToastMessage("Content berhasil ditambahkan");
        setToastSeverity("success");
        setToastOpen(true);
      } else {
        setErrorMsg(response.message || "Gagal save content");
        setOpenToast(true);
      }
    } catch (err) {
      setErrorMsg("Gagal tambah data");
      setOpenToast(true);
    }
  };

  const handleEdit = (paramKey, index, value) => {
    console.log("Edit clicked:", paramKey, index, value);
    setEditIndex(`${paramKey}-${index}`);
    setEditValue(value);
    setEditFile(null);
  };

  const handleCancelEdit = () => {
    setEditIndex(null);
    setEditValue("");
    setEditPreview({});
    setIsEdit(false);
  };

  //   const handleSaveEdit = async (paramKey, index, item) => {
  //     try {
  //       // siapkan payload
  //       let parsedValue;
  //       try {
  //         parsedValue = JSON.parse(item.paramValue);
  //       } catch {
  //         parsedValue = item.paramValue;
  //       }

  //       let payload;
  //       if (Array.isArray(parsedValue)) {
  //         const updatedArray = [...parsedValue];
  //         updatedArray[index] = editValue;
  //         payload = { paramValue: updatedArray };
  //       } else {
  //         payload = { paramValue: editValue };
  //       }

  //       // hit API PUT
  //       const res = await HomeService.saveEditContent(paramKey, payload);

  //       console.log("Update success:", res.data);
  //       // update state FE biar langsung reflect
  //       // setDataContent((prev) =>
  //       //   prev.map((item) =>
  //       //     item.paramKey === paramKey
  //       //       ? { ...item, paramValue: payload.paramValue }
  //       //       : item
  //       //   )
  //       // );
  //       getDataContent();

  //       // reset edit mode
  //       setEditIndex(null);
  //       setEditValue("");
  //     } catch (err) {
  //       console.error("Update failed:", err);
  //       setErrorMsg("Gagal update data");
  //       setOpenToast(true);
  //     }
  //   };

  const handleSaveEdit = async (paramKey, index, item) => {
    try {
      let parsedValue;
      try {
        parsedValue = JSON.parse(item.paramValue);
      } catch {
        parsedValue = item.paramValue;
      }

      let payload;
      if (Array.isArray(parsedValue)) {
        const updatedArray = [...parsedValue];
        updatedArray[index] = editValue;
        payload = { paramValue: updatedArray }; // langsung array, jangan stringify
      } else {
        payload = { paramValue: editValue }; // langsung string, jangan stringify
      }

      const response = await HomeService.saveEditContent(paramKey, payload);
      if (response.success) {
        getDataContent("param");
        // setDataContent((prev) =>
        //   prev.map((item) =>
        //     item.paramKey === paramKey
        //       ? { ...item, paramValue: payload.paramValue }
        //       : item
        //   )
        // );
        // reset edit mode
        setEditIndex(null);
        setEditValue("");
        setToastMessage("Content berhasil disimpan");
        setToastSeverity("success");
        setToastOpen(true);
      } else {
        setErrorMsg(response.message || "Gagal save content");
        setOpenToast(true);
      }
    } catch (err) {
      setErrorMsg("Gagal save content");
      setOpenToast(true);
    }
  };

  // add acara
  const handleAddAcara = async (paramKey) => {
    if (!newFile || !newDescription) {
      setErrorMsg("Image dan deskripsi wajib diisi");
      setOpenToast(true);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const newItem = {
        image: reader.result,
        description: newDescription,
      };

      let parsedValue = [];
      try {
        const currentItem = content.find((c) => c.paramKey === paramKey);
        parsedValue = JSON.parse(currentItem?.paramValue || "[]");
      } catch {
        parsedValue =
          content.find((c) => c.paramKey === paramKey).paramValue || [];
      }

      parsedValue.push(newItem);

      // sesuaikan dengan format backend
      // const payload = { paramValue: JSON.stringify(parsedValue) };
      const payload = { paramValue: parsedValue };

      try {
        const response = await HomeService.saveEditContent(paramKey, payload);
        if (response.success) {
          getDataContent("param");
          setAddingKey(null);
          setNewFile(null);
          setNewDescription("");
          setPreviewImage(null);
          setToastMessage("Kegiatan berhasil ditambahkan");
          setToastSeverity("success");
          setToastOpen(true);
        } else {
          setErrorMsg(response.message || "Gagal save kegiatan");
          setOpenToast(true);
        }
      } catch (err) {
        setErrorMsg(err.message || "Terjadi kesalahan");
        setOpenToast(true);
      }
    };
    reader.readAsDataURL(newFile);
  };

  // edit acara
  const handleSaveEditAcara = async (paramKey, idx) => {
    console.log("save");
    try {
      let parsedValue = [];
      const currentItem = content.find((c) => c.paramKey === paramKey);
      if (currentItem?.paramValue) {
        try {
          parsedValue = JSON.parse(currentItem.paramValue);
        } catch {
          parsedValue = Array.isArray(currentItem.paramValue)
            ? currentItem.paramValue
            : [];
        }
      }

      console.log("PARSED VALUE:", parsedValue);

      if (parsedValue[idx]) {
        parsedValue[idx].description = editValue;

        if (editFile) {
          const reader = new FileReader();
          reader.onloadend = async () => {
            parsedValue[idx].image = reader.result;

            const payload = { paramValue: parsedValue };
            console.log("PAYLOAD:", payload);
            const response = await HomeService.saveEditContent(
              paramKey,
              payload,
            );

            if (response.success) {
              getDataContent("param");
              setEditIndex(null);
              setEditValue("");
              setEditFile(null);
              setToastMessage("Kegiatan berhasil diupdate");
              setToastSeverity("success");
              setToastOpen(true);
              setEditPreview(null);
            } else {
              setErrorMsg(response.message || "Gagal update kegiatan");
              setOpenToast(true);
            }
          };
          reader.readAsDataURL(editFile);
        } else {
          const payload = { paramValue: parsedValue };
          const response = await HomeService.saveEditContent(paramKey, payload);

          if (response.success) {
            getDataContent("param");
            setEditIndex(null);
            setEditValue("");
            setToastMessage("Kegiatan berhasil diupdate");
            setToastSeverity("success");
            setToastOpen(true);
          } else {
            setErrorMsg(response.message || "Gagal update kegiatan");
            setOpenToast(true);
          }
        }
        setIsEdit(false);
      }
    } catch (err) {
      setErrorMsg(err.message || "Terjadi kesalahan");
      setOpenToast(true);
    }
  };

  useEffect(() => {
    getDataContent();
  }, []);

  console.log("DATA CONTENT:", content);
  console.log("EDIT FILE:", editFile);
  console.log("EDIT VALUE", editValue);
  console.log("NEW FILE:", newFile);
  console.log("NEW DESCRIPTION:", newDescription);

  return (
    <>
      {loading && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            bgcolor: "rgba(255,255,255,0.7)",
            zIndex: 1300,
          }}
        >
          <CircularProgress />
        </Box>
      )}
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
              fontSize: { xs: "0.75rem", sm: "1rem", md: "1.25rem" }, // responsif
            }}
          >
            Manajemen Content
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
            Kelola data content
          </Typography>
        </Box>
      </Box>
      <Divider sx={{ mb: 2, mt: 2 }} />

      <Grid container spacing={2} direction="column">
        {content.map((item) => (
          <Grid item xs={12} key={item.paramKey}>
            <Card variant="outlined" sx={{ borderRadius: 4 }}>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontSize: { xs: "0.75rem", sm: "1rem", md: "1.25rem" }, // responsif
                    }}
                  >
                    {item.paramKey}
                  </Typography>
                </Box>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    fontStyle: "italic",
                    fontSize: { xs: "0.50rem", sm: "0.75rem", md: "0.90rem" }, // mobile lebih kecil
                  }}
                >
                  {item.description}
                </Typography>

                {item.paramKey === "ppdb_menu" ? (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "right",
                      alignItems: "center",
                    }}
                  >
                    <FormControlLabel
                      sx={{
                        "& .MuiFormControlLabel-label": {
                          fontSize: {
                            xs: "0.75rem",
                            sm: "0.875rem",
                            md: "1rem",
                          }, // label responsif
                        },
                        mr: 3,
                      }}
                      control={
                        <Tooltip title="Update">
                          <Switch
                            checked={item.isActive}
                            onChange={(e) =>
                              handleToggle(item.paramKey, e.target.checked)
                            }
                          />
                        </Tooltip>
                      }
                      label={
                        item?.isActive
                          ? "PPDB sedang di buka"
                          : "PPDB sudah di tutup"
                      }
                      labelPlacement="start" // label di kiri, switch di kanan
                    />
                  </Box>
                ) : item.paramKey === "kegiatan" ? (
                  (() => {
                    let parsedValueAcara;
                    try {
                      parsedValueAcara = JSON.parse(item.paramValue);
                    } catch {
                      parsedValueAcara = item.paramValue;
                    }
                    return (
                      Array.isArray(parsedValueAcara) && (
                        <List dense>
                          {parsedValueAcara.map((val, idx) => (
                            <ListItem
                              key={idx}
                              sx={{
                                display: "flex",
                                flexDirection: "row",
                                gap: 3,
                                mb: 4,
                              }}
                            >
                              <Box
                                sx={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                  gap: 1,
                                  width: "60%"
                                }}
                              >
                                {/* Image preview, klik untuk upload */}
                                <Button
                                  variant="outlined"
                                  component="label"
                                  sx={{ width: "100%" }}
                                  disabled={!isEdit}
                                >
                                  <img
                                    src={
                                      editPreview?.[
                                        `${item.paramKey}-${idx}`
                                      ] || val.image
                                    }
                                    alt={val.description}
                                    style={{
                                      width: "200px",
                                      height: "190px",
                                      borderRadius: 8,
                                    }}
                                  />
                                  <input
                                    type="file"
                                    hidden
                                    onChange={(e) => {
                                      const file = e.target.files[0];
                                      if (!file) return;

                                      // Validasi ukuran
                                      if (file.size > 2 * 1024 * 1024) {
                                        setErrorMsg("Ukuran file maksimal 2MB");
                                        setOpenToast(true);
                                        return;
                                      }

                                      // Validasi tipe
                                      if (!file.type.startsWith("image/")) {
                                        setErrorMsg("File harus berupa gambar");
                                        setOpenToast(true);
                                        return;
                                      }

                                      // Kalau lolos validasi → simpan ke state
                                      setEditFile(file);

                                      // Preview langsung
                                      const reader = new FileReader();
                                      reader.onloadend = () => {
                                        setEditPreview((prev) => ({
                                          ...prev,
                                          [`${item.paramKey}-${idx}`]:
                                            reader.result,
                                        }));
                                      };
                                      reader.readAsDataURL(file);
                                    }}
                                  />
                                </Button>

                                {/* Description field */}
                                {editIndex === `${item.paramKey}-${idx}` ? (
                                  <>
                                    <TextField
                                      size="small"
                                      value={editValue}
                                      onChange={(e) =>
                                        setEditValue(e.target.value)
                                      }
                                      fullWidth
                                      placeholder="Masukkan deskripsi kegiatan"
                                      multiline
                                      minRows={1} // jumlah baris minimal
                                      maxRows={1}
                                      inputProps={{ maxLength: 50 }}
                                      sx={{
                                        "& .MuiInputLabel-root": {
                                          fontSize: {
                                            xs: "0.50rem",
                                            sm: "0.750rem",
                                            md: "1rem",
                                          }, // label responsif
                                        },
                                        "& .MuiInputBase-input": {
                                          fontSize: {
                                            xs: "0.50rem",
                                            sm: "0.750rem",
                                            md: "1rem",
                                          }, // isi input responsif
                                        },
                                      }}
                                    />
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        position: "absolute",
                                        right: 8,
                                        bottom: -20,
                                        color: "red",
                                        fontSize: {
                                          xs: "0.50rem",
                                          sm: "0.75rem",
                                          md: "0.90rem",
                                        },
                                      }}
                                    >
                                      {`Maksimal input deskripsi ${editValue.length}/50`}
                                    </Typography>
                                  </>
                                ) : (
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      fontSize: {
                                        xs: "0.50rem",
                                        sm: "0.75rem",
                                        md: "0.90rem",
                                      },
                                    }}
                                  >
                                    {val.description}
                                  </Typography>
                                )}
                              </Box>

                              {/* Action buttons */}
                              <Box sx={{ display: "flex", gap: 1 }}>
                                {editIndex === `${item.paramKey}-${idx}` ? (
                                  <>
                                    <Tooltip title="Save">
                                      <IconButton
                                        color="success"
                                        onClick={() =>
                                          handleSaveEditAcara(
                                            item.paramKey,
                                            idx,
                                          )
                                        }
                                      >
                                        <CheckIcon />
                                      </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Cancel">
                                      <IconButton
                                        color="error"
                                        onClick={handleCancelEdit}
                                      >
                                        <CloseIcon />
                                      </IconButton>
                                    </Tooltip>
                                  </>
                                ) : (
                                  <>
                                    <Tooltip title="Edit">
                                      <IconButton
                                        onClick={() => {
                                          handleEdit(
                                            item.paramKey,
                                            idx,
                                            val.description,
                                          );
                                          setIsEdit(true);
                                        }}
                                        color="primary"
                                      >
                                        <EditIcon />
                                      </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete">
                                      <IconButton
                                        onClick={() =>
                                          handleDelete(item.paramKey, idx, item)
                                        }
                                        color="error"
                                      >
                                        <DeleteIcon />
                                      </IconButton>
                                    </Tooltip>
                                  </>
                                )}
                              </Box>
                            </ListItem>
                          ))}

                          {/* Add new acara */}
                          <>
                            <Tooltip title="Add">
                              <IconButton
                                onClick={() => {
                                  if (item?.paramValue.length === 10) {
                                    setErrorMsg(
                                      "Konten kegiatan maximal 5 items",
                                    );
                                    setOpenToast(true);
                                    return;
                                  }
                                  setAddingKey(item.paramKey);
                                }}
                                color="primary"
                              >
                                <AddIcon />
                              </IconButton>
                            </Tooltip>
                            {addingKey === item.paramKey && (
                              <ListItem
                                sx={{ flexDirection: "column", gap: 1 }}
                              >
                                <Button
                                  variant="outlined"
                                  component="label"
                                  sx={{ width: "100%" }}
                                >
                                  {previewImage ? (
                                    <img
                                      src={previewImage}
                                      alt="Preview"
                                      style={{
                                        width: "190px",
                                        borderRadius: 8,
                                        height: "200px", // tinggi otomatis
                                      }}
                                    />
                                  ) : (
                                    "Upload Image"
                                  )}
                                  <input
                                    type="file"
                                    hidden
                                    onChange={(e) => {
                                      const file = e.target.files[0];
                                      if (!file) return;

                                      if (file.size > 2 * 1024 * 1024) {
                                        setErrorMsg("Ukuran file maksimal 2MB");
                                        setOpenToast(true);
                                        return;
                                      }

                                      if (!file.type.startsWith("image/")) {
                                        setErrorMsg("File harus berupa gambar");
                                        setOpenToast(true);
                                        return;
                                      }

                                      setNewFile(file);

                                      const reader = new FileReader();
                                      reader.onloadend = () => {
                                        setPreviewImage(reader.result);
                                      };
                                      reader.readAsDataURL(file);
                                    }}
                                  />
                                </Button>
                                <TextField
                                  size="small"
                                  value={newDescription}
                                  onChange={(e) =>
                                    setNewDescription(e.target.value)
                                  }
                                  fullWidth
                                  placeholder="Masukkan deskripsi kegiatan"
                                  multiline
                                  minRows={1} // jumlah baris minimal
                                  maxRows={1}
                                  inputProps={{ maxLength: 50 }}
                                  sx={{
                                    "& .MuiInputLabel-root": {
                                      fontSize: {
                                        xs: "0.50rem",
                                        sm: "0.750rem",
                                        md: "1rem",
                                      }, // label responsif
                                    },
                                    "& .MuiInputBase-input": {
                                      fontSize: {
                                        xs: "0.50rem",
                                        sm: "0.750rem",
                                        md: "1rem",
                                      }, // isi input responsif
                                    },
                                  }}
                                />
                                <Typography
                                  variant="caption"
                                  sx={{
                                    position: "absolute",
                                    right: 8,
                                    bottom: -20,
                                    color: "red",
                                    fontSize: {
                                      xs: "0.50rem",
                                      sm: "0.75rem",
                                      md: "0.90rem",
                                    },
                                  }}
                                >
                                  {`Maksimal input deskripsi ${newDescription.length}/50`}
                                </Typography>
                                <Box sx={{ display: "flex", gap: 1 }}>
                                  <Tooltip title="Save">
                                    <IconButton
                                      color="success"
                                      onClick={() =>
                                        handleAddAcara(item.paramKey)
                                      }
                                    >
                                      <CheckIcon />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Cancel">
                                    <IconButton
                                      color="error"
                                      onClick={() => {
                                        setAddingKey(null);
                                        setNewFile(null);
                                        setNewDescription("");
                                        setPreviewImage(null);
                                      }}
                                    >
                                      <CloseIcon />
                                    </IconButton>
                                  </Tooltip>
                                </Box>
                              </ListItem>
                            )}
                          </>
                        </List>
                      )
                    );
                  })()
                ) : (
                  (() => {
                    let parsedValue;
                    try {
                      parsedValue = JSON.parse(item.paramValue);
                    } catch {
                      parsedValue = item.paramValue;
                    }

                    return Array.isArray(parsedValue) ? (
                      <List dense>
                        {parsedValue.map((val, idx) => (
                          <ListItem
                            key={idx}
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              width: "100%", // batasi lebar
                              overflow: "hidden",
                            }}
                          >
                            {editIndex === `${item.paramKey}-${idx}` ? (
                              <>
                                <TextField
                                  size="small"
                                  value={editValue}
                                  onChange={(e) => setEditValue(e.target.value)}
                                  sx={{
                                    "& .MuiInputLabel-root": {
                                      fontSize: {
                                        xs: "0.75rem",
                                        sm: "0.875rem",
                                        md: "1rem",
                                      }, // label responsif
                                    },
                                    "& .MuiInputBase-input": {
                                      fontSize: {
                                        xs: "0.75rem",
                                        sm: "0.875rem",
                                        md: "1rem",
                                      }, // isi input responsif
                                      wordWrap: "break-word",
                                    },
                                    flexGrow: 1,
                                    mr: 1,
                                  }}
                                  multiline
                                  minRows={3} // jumlah baris minimal
                                  maxRows={6} // opsional, biar nggak terlalu tinggi
                                />
                                <Tooltip title="Save">
                                  <IconButton
                                    color="success"
                                    onClick={() =>
                                      handleSaveEdit(item.paramKey, idx, item)
                                    }
                                    sx={{ mr: 1 }}
                                  >
                                    <CheckIcon />
                                  </IconButton>
                                </Tooltip>

                                <Tooltip title="Cancel">
                                  <IconButton
                                    color="error"
                                    onClick={handleCancelEdit}
                                  >
                                    <CloseIcon />
                                  </IconButton>
                                </Tooltip>
                              </>
                            ) : (
                              <Typography
                                sx={{
                                  fontSize: {
                                    xs: "0.50rem",
                                    sm: "0.75rem",
                                    md: "0.90rem",
                                  }, // responsif
                                  whiteSpace: "pre-wrap", // biar newline tetap muncul
                                  wordBreak: "break-word",
                                  width: "90%",
                                }}
                              >
                                {val}
                              </Typography>
                            )}

                            <Box>
                              <Tooltip title="Edit">
                                <IconButton
                                  onClick={() =>
                                    handleEdit(item.paramKey, idx, val)
                                  }
                                  color="primary"
                                >
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete">
                                <IconButton
                                  onClick={() =>
                                    handleDelete(item.paramKey, idx, item)
                                  }
                                  color="error"
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </ListItem>
                        ))}
                        {Array.isArray(parsedValue) && (
                          <>
                            <Tooltip title="Add">
                              <IconButton
                                onClick={() => setAddingKey(item.paramKey)}
                                color="primary"
                              >
                                <AddIcon />
                              </IconButton>
                            </Tooltip>

                            {addingKey === item.paramKey && (
                              <ListItem
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                }}
                              >
                                <TextField
                                  size="small"
                                  value={newValue}
                                  onChange={(e) => setNewValue(e.target.value)}
                                  sx={{
                                    "& .MuiInputLabel-root": {
                                      fontSize: {
                                        xs: "0.75rem",
                                        sm: "0.875rem",
                                        md: "1rem",
                                      }, // label responsif
                                    },
                                    "& .MuiInputBase-input": {
                                      fontSize: {
                                        xs: "0.75rem",
                                        sm: "0.875rem",
                                        md: "1rem",
                                      }, // isi input responsif
                                    },
                                    flexGrow: 1,
                                    mr: 1,
                                  }}
                                  multiline
                                  minRows={3} // jumlah baris minimal
                                  maxRows={6} // opsional, biar nggak terlalu tinggi
                                  placeholder="Masukkan item baru"
                                />
                                <Tooltip title="Save">
                                  <IconButton
                                    color="success"
                                    onClick={() => handleAddNew(item.paramKey)}
                                    sx={{ mr: 1 }}
                                  >
                                    <CheckIcon />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Cancel">
                                  <IconButton
                                    color="error"
                                    onClick={() => {
                                      setAddingKey(null);
                                      setNewValue("");
                                    }}
                                  >
                                    <CloseIcon />
                                  </IconButton>
                                </Tooltip>
                              </ListItem>
                            )}
                          </>
                        )}
                      </List>
                    ) : (
                      <List dense>
                        <ListItem
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            width: "100%", // batasi lebar
                            overflow: "hidden",
                          }}
                        >
                          {editIndex === `${item.paramKey}-single` ? (
                            <>
                              <TextField
                                size="small"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                sx={{
                                  "& .MuiInputLabel-root": {
                                    fontSize: {
                                      xs: "0.75rem",
                                      sm: "0.875rem",
                                      md: "1rem",
                                    }, // label responsif
                                  },
                                  "& .MuiInputBase-input": {
                                    fontSize: {
                                      xs: "0.75rem",
                                      sm: "0.875rem",
                                      md: "1rem",
                                    }, // isi input responsif
                                    wordWrap: "break-word",
                                  },
                                  flexGrow: 1,
                                  mr: 1,
                                }}
                                multiline
                                minRows={3} // jumlah baris minimal
                                maxRows={60} // opsional, biar nggak terlalu tinggi
                              />
                              <Tooltip title="Save">
                                <IconButton
                                  color="success"
                                  onClick={() =>
                                    handleSaveEdit(
                                      item.paramKey,
                                      "single",
                                      item,
                                    )
                                  }
                                  sx={{ mr: 1 }}
                                >
                                  <CheckIcon />
                                </IconButton>
                              </Tooltip>

                              <Tooltip title="Cancel">
                                <IconButton
                                  color="error"
                                  onClick={handleCancelEdit}
                                >
                                  <CloseIcon />
                                </IconButton>
                              </Tooltip>
                            </>
                          ) : (
                            <Typography
                              sx={{
                                fontSize: {
                                  xs: "0.50rem",
                                  sm: "0.75rem",
                                  md: "0.90rem",
                                },
                                whiteSpace: "pre-wrap", // biar newline tetap muncul
                                wordBreak: "break-word",
                                width: "90%",
                              }}
                            >
                              {parsedValue}
                            </Typography>
                          )}
                          <Box>
                            <Tooltip title="Edit">
                              <IconButton
                                onClick={() =>
                                  handleEdit(
                                    item.paramKey,
                                    "single",
                                    parsedValue,
                                  )
                                }
                                color="primary"
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton
                                onClick={() =>
                                  handleDelete(item.paramKey, "single", item)
                                }
                                color="error"
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </ListItem>
                      </List>
                    );
                  })()
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

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

      <SnackBarAlert
        open={toastOpen}
        setOpen={setToastOpen}
        message={toastMessage}
        setMessage={setToastMessage}
        severity={toastSeverity}
        setSeverity={setToastSeverity}
        handleClose={(event, reason) => {
          if (reason === "clickaway") return;
          setToastOpen(false);
        }}
      />
    </>
  );
};

export default Content;
