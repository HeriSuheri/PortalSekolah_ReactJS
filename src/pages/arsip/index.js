import React, { useState } from "react";
import { Tabs, Tab, Box, Typography } from "@mui/material";
import TabelBerhenti from "./DataBerhenti";
import TableLulus from "./DataLulus";

export default function SiswaTabs() {
  const [tabIndex, setTabIndex] = useState(0);

  const handleChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      {/* Tabs Header */}
      <Tabs
        value={tabIndex}
        onChange={handleChange}
        indicatorColor="primary"
        textColor="primary"
        // centered
      >
        <Tab
          sx={{
            fontSize: { xs: "0.65rem", sm: "0.85rem", md: "1.25rem" },
            fontWeight: "bold",
          }}
          label="BERHENTI"
        />
        <Tab
          label="LULUS"
          sx={{
            fontSize: { xs: "0.65rem", sm: "0.85rem", md: "1.25rem" },
            fontWeight: "bold",
          }}
        />
      </Tabs>

      {/* Tab Content */}
      <Box sx={{ mt: 3 }}>
        {tabIndex === 0 && (
          <Box>
            {/* <Typography
              variant="h5"
              gutterBottom
              sx={{
                fontSize: { xs: "0.75rem", sm: "1rem", md: "1.25rem" }, // responsif
              }}
            >
              Daftar Siswa Berhenti
            </Typography> */}
            <TabelBerhenti />
          </Box>
        )}
        {tabIndex === 1 && (
          <Box>
            {/* <Typography
              variant="h5"
              gutterBottom
              sx={{
                fontSize: { xs: "0.75rem", sm: "1rem", md: "1.25rem" }, // responsif
              }}
            >
              Daftar Siswa Lulus
            </Typography> */}
            <TableLulus />
          </Box>
        )}
      </Box>
    </Box>
  );
}
