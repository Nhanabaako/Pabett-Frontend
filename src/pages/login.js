// src/pages/AdminLogin.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Add this
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Initialize navigate

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Double-check this port (5000 is standard for Node backends)
      const res = await fetch("http://localhost:5000/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Invalid credentials");

      // 2. Consistent key storage
      localStorage.setItem("adminKey", data.adminKey);

      showSnackbar("✅ Login successful!", "success");

      // 3. Use navigate for a smoother React transition
      setTimeout(() => {
      navigate("/admin/Dashboard"); // Redirect to the dashboard home
      }, 1000);

    } catch (err) {
      console.error(err);
      showSnackbar(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        mt: 10,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "70vh",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 3,
          width: "100%",
          textAlign: "center",
          bgcolor: "#fafafa",
        }}
      >
        <Typography variant="h4" fontWeight={700} gutterBottom sx={{ color: "#00B6AD" }}>
          🔐 Admin Login
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Enter your credentials to access the Pabett Dashboard
        </Typography>

        <Box component="form" onSubmit={handleLogin} sx={{ textAlign: "left" }}>
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
          />

          <Button
            fullWidth
            variant="contained"
            type="submit"
            size="large"
            disabled={loading}
            sx={{ 
              mt: 4, 
              py: 1.5,
              fontWeight: 'bold',
              bgcolor: "#00B6AD",
              "&:hover": { bgcolor: "#009c94" }
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Login to Dashboard"}
          </Button>
        </Box>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%", borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}