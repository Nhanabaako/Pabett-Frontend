import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Topbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("adminKey");
    navigate("/admin/login");
  };

  return (
    <Box
      sx={{
        height: 70,
        bgcolor: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: 3,
        boxShadow: 1
      }}
    >
      <Typography fontWeight={600}>Admin Dashboard</Typography>

      <Button color="error" onClick={logout}>
        Logout
      </Button>
    </Box>
  );
}