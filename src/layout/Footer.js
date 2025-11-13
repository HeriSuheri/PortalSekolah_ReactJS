import { Box, Typography } from "@mui/material";

export default function Footer() {
  return (
    <Box
      sx={{
        mt: 4,
        py: 2,
        textAlign: "center",
        borderTop: "5px solid #A9A9A9",
        color: "text.secondary",
        fontSize: "0.975rem",
        fontWeight: 500,
        fontFamily: "Roboto, sans-serif",
        // backgroundColor: "#C0C0C0",
        // position: "fixed",
        bottom: 0,
        width: "100%",
      }}
    >
      <Typography variant="body2">
        &copy; {new Date().getFullYear()} Portal Sekolah SMU. All rights
        reserved.
      </Typography>
    </Box>
  );
}
