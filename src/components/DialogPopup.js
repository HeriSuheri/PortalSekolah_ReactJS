import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from "@mui/material";

function ConfirmModal({
  icon,
  open,
  onConfirm,
  onCancel,
  title,
  question,
  useText = false,
  textCancel,
  textSubmit,
}) {
  return (
    <Dialog
      open={open}
      // onClose={onCancel}
      onClose={(event, reason) => {
        // blok kalau close karena klik backdrop atau tekan ESC
        if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
          onCancel();
        }
      }}
      maxWidth="sm"
      fullWidth
      sx={{
        "& .MuiPaper-root": {
          borderRadius: 3,
          border: "2px solid #1976d2",
          padding: 2,
        },
      }}
    >
      <Box sx={{ textAlign: "center", mb: 1 }}>
        {icon && <Box sx={{ mb: 1 }}>{icon}</Box>}
      </Box>
      <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>
        {title}
      </DialogTitle>
      <DialogContent>
        <Typography align="center">{question}</Typography>
        {/* <Box sx={{ textAlign: "center", mb: 2 }}>
          {icon && <Box sx={{ mb: 2 }}>{icon}</Box>}
        </Box> */}
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", gap: 2 }}>
        {useText ? (
          <>
            <Typography
              variant="body1"
              color="textSecondary"
              sx={{ cursor: "pointer", fontWeight: "bold" }}
              onClick={onCancel}
            >
              {textCancel}
            </Typography>
            <Typography
              variant="body1"
              color="primary"
              sx={{ cursor: "pointer", fontWeight: "bold" }}
              onClick={onConfirm}
            >
              {textSubmit}
            </Typography>
          </>
        ) : (
          <>
            <Button variant="outlined" onClick={onCancel}>
              Tidak
            </Button>
            <Button variant="contained" color="primary" onClick={onConfirm}>
              Ya
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmModal;
