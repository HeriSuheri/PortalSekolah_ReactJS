import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
  Typography,
  Box,
} from "@mui/material";

function MyPopupModal({
  open,
  onClose,
  title,
  content,
  icon,
  maxWidth = "sm",
  fullWidth = true,
}) {
  return (
    <Dialog
      open={open}
      // onClose={onClose}
      onClose={(event, reason) => {
        // blok kalau close karena klik backdrop atau tekan ESC
        if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
          onClose();
        }
      }}
      disableEscapeKeyDown
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      sx={{
        "& .MuiPaper-root": {
          borderRadius: 3,
          border: "2px solid #1976d2",
          padding: 2,
        },
      }}
    >
      <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>
        {title}
      </DialogTitle>
      <Divider sx={{ mb: 2 }} /> {/* garis tebal di bawah title */}
      <DialogContent>
        <Box sx={{ textAlign: "center" }}>
          {icon && <Box sx={{ mb: 2 }}>{icon}</Box>}
          <Typography variant="body1">{content}</Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center" }}>
        <Button
          onClick={onClose}
          variant="contained"
          color="primary"
          sx={{ borderRadius: 2 }}
        >
          Tutup
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default MyPopupModal;
