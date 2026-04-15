import React from "react";
import { Box, Typography, List, ListItemButton } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        width: 240,
        height: "100vh",
        bgcolor: "#2C3E64",
        color: "#fff",
        p: 2
      }}
    >
      <Typography variant="h5" mb={4} fontWeight={700}>
        Pabett Admin
      </Typography>

      <List>
        <ListItemButton onClick={() => navigate("/admin/dashboard")}>
          Dashboard
        </ListItemButton>

        <ListItemButton onClick={() => navigate("/admin/products")}>
          Products
        </ListItemButton>

        <ListItemButton onClick={() => navigate("/admin/gallery")}>
          Gallery
        </ListItemButton>
      </List>
    </Box>
  );
}