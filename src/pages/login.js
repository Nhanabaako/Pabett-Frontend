// src/pages/AdminLogin.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Box, Button, TextField, Typography,
  Paper, CircularProgress, Snackbar, Alert,
  InputAdornment, IconButton, Divider, Stack,
} from "@mui/material";
import EmailOutlinedIcon   from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon    from "@mui/icons-material/LockOutlined";
import Visibility          from "@mui/icons-material/Visibility";
import VisibilityOff       from "@mui/icons-material/VisibilityOff";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

const API_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000"
    : process.env.REACT_APP_API_URL;

const THEME = {
  primary:  "#00B6AD",
  dark:     "#009688",
  darkText: "#2C3E64",
  gradient: "linear-gradient(135deg, #2C3E64 0%, #1a2a4a 100%)",
};

export default function AdminLogin() {
  const navigate = useNavigate();

  const [form,         setForm]         = useState({ email: "", password: "" });
  const [loading,      setLoading]      = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [snackbar,     setSnackbar]     = useState({ open: false, message: "", severity: "info" });

  const showToast = (message, severity = "info") =>
    setSnackbar({ open: true, message, severity });

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return showToast("Please fill all fields", "warning");

    setLoading(true);
    try {
      const res  = await fetch(`${API_URL}/api/admin/login`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || "Login failed");

      // Store whichever token key the backend returns
      if (data.token)    localStorage.setItem("token",    data.token);
      if (data.adminKey) localStorage.setItem("adminKey", data.adminKey);

      showToast("Login successful ✅", "success");
      setTimeout(() => navigate("/admin/dashboard"), 800);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: THEME.gradient,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      {/* Decorative blurred circles */}
      <Box sx={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        <Box sx={{
          position: "absolute", width: 320, height: 320,
          borderRadius: "50%", bgcolor: "rgba(0,182,173,0.12)",
          top: "-80px", right: "-80px", filter: "blur(60px)",
        }} />
        <Box sx={{
          position: "absolute", width: 260, height: 260,
          borderRadius: "50%", bgcolor: "rgba(0,182,173,0.08)",
          bottom: "-60px", left: "-60px", filter: "blur(50px)",
        }} />
      </Box>

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{ width: "100%", maxWidth: 440, position: "relative" }}
      >
        <Paper
          elevation={0}
          sx={{
            borderRadius: 4,
            overflow: "hidden",
            boxShadow: "0 24px 60px rgba(0,0,0,0.35)",
          }}
        >
          {/* ── Coloured header band ── */}
          <Box
            sx={{
              background: `linear-gradient(135deg, ${THEME.primary} 0%, ${THEME.dark} 100%)`,
              py: 4, px: 4, textAlign: "center",
            }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.15, type: "spring", stiffness: 200 }}
            >
              <Box
                sx={{
                  width: 68, height: 68, bgcolor: "rgba(255,255,255,0.15)",
                  borderRadius: "50%", display: "flex",
                  alignItems: "center", justifyContent: "center",
                  mx: "auto", mb: 1.5,
                  border: "2px solid rgba(255,255,255,0.3)",
                }}
              >
                <AdminPanelSettingsIcon sx={{ fontSize: 36, color: "#fff" }} />
              </Box>
            </motion.div>

            <Typography variant="h5" fontWeight={800} color="#fff" mb={0.5}>
              Admin Portal
            </Typography>
            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.75)" }}>
              PABETT Beauty Management
            </Typography>
          </Box>

          {/* ── Form body ── */}
          <Box
            component="form"
            onSubmit={handleLogin}
            sx={{ px: 4, py: 4, bgcolor: "#fff" }}
          >
            <Stack spacing={2.5}>
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                autoComplete="email"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlinedIcon sx={{ color: THEME.primary, fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    "&:hover fieldset": { borderColor: THEME.primary },
                    "&.Mui-focused fieldset": { borderColor: THEME.primary },
                  },
                  "& .MuiInputLabel-root.Mui-focused": { color: THEME.primary },
                }}
              />

              <TextField
                fullWidth
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon sx={{ color: THEME.primary, fontSize: 20 }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword((v) => !v)}
                        edge="end"
                        size="small"
                        tabIndex={-1}
                      >
                        {showPassword
                          ? <VisibilityOff sx={{ fontSize: 18 }} />
                          : <Visibility   sx={{ fontSize: 18 }} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    "&:hover fieldset": { borderColor: THEME.primary },
                    "&.Mui-focused fieldset": { borderColor: THEME.primary },
                  },
                  "& .MuiInputLabel-root.Mui-focused": { color: THEME.primary },
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  py: 1.5,
                  borderRadius: "999px",
                  fontWeight: 700,
                  fontSize: "1rem",
                  background: `linear-gradient(135deg, ${THEME.primary} 0%, ${THEME.dark} 100%)`,
                  boxShadow: "0 4px 18px rgba(0,182,173,0.4)",
                  "&:hover": { opacity: 0.9, boxShadow: "0 6px 22px rgba(0,182,173,0.5)" },
                  "&:disabled": { opacity: 0.7 },
                }}
              >
                {loading ? (
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CircularProgress size={20} sx={{ color: "#fff" }} />
                    <span>Signing in…</span>
                  </Stack>
                ) : (
                  "Sign In"
                )}
              </Button>
            </Stack>

            <Divider sx={{ my: 3 }} />

            <Typography
              variant="caption"
              color="text.disabled"
              display="block"
              textAlign="center"
            >
              Authorised personnel only · PABETT Beauty © {new Date().getFullYear()}
            </Typography>
          </Box>
        </Paper>
      </motion.div>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          sx={{ borderRadius: 2, fontWeight: 600 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}