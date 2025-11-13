import { Box, Typography } from "@mui/material";

export default function PageWrapper({ title, children }) {
  return (
    <Box sx={{ p: 2 , backgroundColor: "#f9f9f9", minHeight: "80vh" , borderRadius: 4 }}>
      {title && (
        <Typography variant="h4" gutterBottom>
          {title}
        </Typography>
      )}
      <Box sx={{ mt: 1 }}>{children}</Box>
    </Box>
  );
}
