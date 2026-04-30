import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box, Button, CircularProgress, IconButton,
  InputAdornment, TextField, Typography,
} from "@mui/material";
import VisibilityIcon    from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const API_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5001"
    : process.env.REACT_APP_API_URL || "";

const FEATURES = [
  { icon: "📅", label: "Bookings & Availability" },
  { icon: "🖼️", label: "Gallery & Products" },
  { icon: "✨", label: "Team & Services" },
  { icon: "⚙️", label: "Studio Settings" },
];

export default function AdminLogin() {
  const navigate = useNavigate();
  const [form,         setForm]         = useState({ email: "", password: "" });
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.email || !form.password) return setError("Please fill all fields");

    setLoading(true);
    try {
      const res  = await fetch(`${API_URL}/api/admin/login`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || data.error || "Login failed");
      if (data.token)    localStorage.setItem("token",    data.token);
      if (data.adminKey) localStorage.setItem("adminKey", data.adminKey);
      if (data.role)     localStorage.setItem("adminRole", data.role);
      const dest = data.role === "superadmin" ? "/admin/superadmin/system" : "/admin/dashboard";
      navigate(dest, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* ── Left panel (hidden on mobile) ─────────────────────────────── */}
      <Box
        sx={{
          width: "42%",
          background: "#1E2D4F",
          display: { xs: "none", sm: "flex" },
          flexDirection: "column",
          justifyContent: "center",
          px: "52px",
          py: "60px",
          color: "#fff",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative blobs */}
        <Box sx={{
          position: "absolute", width: 320, height: 320,
          borderRadius: "50%", background: "rgba(43,181,168,0.12)",
          top: -80, right: -80, pointerEvents: "none",
        }} />
        <Box sx={{
          position: "absolute", width: 200, height: 200,
          borderRadius: "50%", background: "rgba(43,181,168,0.08)",
          bottom: -40, left: -40, pointerEvents: "none",
        }} />

        <Typography sx={{
          fontSize: "0.68rem", letterSpacing: "0.22em",
          textTransform: "uppercase", color: "rgba(255,255,255,0.45)",
          mb: 3.5, fontFamily: "'JetBrains Mono', monospace",
        }}>
          Pabett Beauty — Admin
        </Typography>

        <Typography variant="h3" sx={{
          fontFamily: "'Cormorant Garamond', serif",
          fontWeight: 400, lineHeight: 1.2,
          mb: 2.5, color: "#fff", letterSpacing: "-0.02em",
        }}>
          Your studio,<br />
          <em>your</em> control.
        </Typography>

        <Typography sx={{
          color: "rgba(255,255,255,0.6)", fontSize: "0.9375rem",
          lineHeight: 1.7, mb: 6,
          fontFamily: "'Inter', sans-serif",
        }}>
          Manage bookings, gallery, team, products, and everything that
          makes your studio shine — all in one place.
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.75 }}>
          {FEATURES.map(({ icon, label }) => (
            <Box key={label} sx={{
              display: "flex", alignItems: "center", gap: 1.5,
              color: "rgba(255,255,255,0.72)", fontSize: "0.875rem",
              fontFamily: "'Inter', sans-serif",
            }}>
              <Box component="span" sx={{ fontSize: "1rem", width: 20, textAlign: "center" }}>{icon}</Box>
              {label}
            </Box>
          ))}
        </Box>
      </Box>

      {/* ── Right panel ────────────────────────────────────────────────── */}
      <Box sx={{
        flex: 1,
        background: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: { xs: 3, sm: 5 },
        py: { xs: 5, sm: 6 },
      }}>
        <Box sx={{ width: "100%", maxWidth: 380 }}>

          <Box sx={{ mb: 5 }}>
            <Typography variant="h4" sx={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 400, color: "#1E2D4F",
              mb: 1, letterSpacing: "-0.02em",
            }}>
              Welcome back
            </Typography>
            <Typography sx={{ color: "#7E8AA8", fontSize: "0.9rem", fontFamily: "'Inter', sans-serif" }}>
              Sign in to your admin portal
            </Typography>
          </Box>

          {error && (
            <Box sx={{
              background: "#FEE2E2", color: "#991B1B", borderRadius: 2,
              px: 2, py: 1.375, fontSize: "0.875rem", mb: 3,
              fontFamily: "'Inter', sans-serif",
            }}>
              {error}
            </Box>
          )}

          <Box component="form" onSubmit={handleLogin} sx={{ display: "flex", flexDirection: "column", gap: 3.75 }}>
            <TextField
              label="Email Address"
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              placeholder="admin@pabett.com"
              variant="standard"
              fullWidth
              sx={{
                '& .MuiInput-underline:after': { borderBottomColor: '#2BB5A8' },
                '& label.Mui-focused': { color: '#2BB5A8' },
              }}
            />

            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              name="password"
              required
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
              placeholder="••••••••"
              variant="standard"
              fullWidth
              sx={{
                '& .MuiInput-underline:after': { borderBottomColor: '#2BB5A8' },
                '& label.Mui-focused': { color: '#2BB5A8' },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => setShowPassword((v) => !v)}
                      edge="end"
                      sx={{ color: "#7E8AA8" }}
                    >
                      {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              fullWidth
              size="large"
              sx={{
                mt: 0.5,
                background: loading
                  ? "#7E8AA8"
                  : "linear-gradient(135deg, #2BB5A8 0%, #1F9A8E 100%)",
                borderRadius: "999px",
                py: 1.75,
                fontFamily: "'Inter', sans-serif",
                fontWeight: 700,
                fontSize: "1rem",
                boxShadow: "none",
                "&:hover": {
                  background: "linear-gradient(135deg, #1F9A8E 0%, #178078 100%)",
                  boxShadow: "none",
                },
              }}
            >
              {loading ? <CircularProgress size={22} sx={{ color: "#fff" }} /> : "Sign In"}
            </Button>
          </Box>

          <Typography sx={{
            textAlign: "center", color: "#7E8AA8", fontSize: "0.72rem",
            mt: 5.5, fontFamily: "'Inter', sans-serif",
          }}>
            Authorised personnel only · Pabett Beauty © {new Date().getFullYear()}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
