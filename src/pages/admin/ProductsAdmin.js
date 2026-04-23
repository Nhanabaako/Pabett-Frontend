import React, { useState, useEffect, useCallback } from "react";
import UploadDropzone from "../../components/UploadDropzone";
import {
  Box, Button, TextField, Grid, Card, CardMedia, CardContent,
  Typography, CircularProgress, Paper, FormControl,
  InputLabel, Select, MenuItem, InputAdornment,
  Snackbar, Alert, IconButton
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SearchIcon from "@mui/icons-material/Search";

const BASE_URL = "http://localhost:5000";

export default function ProductsAdmin() {
  const token = localStorage.getItem("token");

  const [products, setProducts] = useState([]);
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Hair Products");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    msg: "",
    severity: "success"
  });

  const toast = (msg, severity = "success") => {
    setSnackbar({ open: true, msg, severity });
  };

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/products`);
      const data = await res.json();
      setProducts(data);
    } catch {
      toast("Failed to load products", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const uploadProduct = async () => {
    if (!token) {
      toast("Login required", "warning");
      window.location.href = "/admin/login";
      return;
    }

    if (!file || !name.trim() || !price) {
      return toast("Fill all fields", "warning");
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("name", name);
      formData.append("price", price);
      formData.append("category", category);

      const res = await fetch(`${BASE_URL}/api/products`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem("token");
        window.location.href = "/admin/login";
        return;
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast("Uploaded successfully ✅");

      setFile(null);
      setName("");
      setPrice("");

      fetchProducts();
    } catch (err) {
      toast(err.message || "Upload failed", "error");
    } finally {
      setUploading(false);
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete?")) return;

    try {
      const res = await fetch(`${BASE_URL}/api/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem("token");
        window.location.href = "/admin/login";
        return;
      }

      setProducts((prev) => prev.filter((p) => p._id !== id));
      toast("Deleted");
    } catch {
      toast("Delete failed", "error");
    }
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box p={3}>
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography>Add Product</Typography>

        <UploadDropzone onChange={setFile} multiple={false} />

        <TextField fullWidth label="Name" value={name} onChange={(e) => setName(e.target.value)} sx={{ mt: 2 }} />
        <TextField
          fullWidth
          label="Price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          sx={{ mt: 2 }}
          InputProps={{
            startAdornment: <InputAdornment position="start">₵</InputAdornment>,
          }}
        />

        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>Category</InputLabel>
          <Select value={category} onChange={(e) => setCategory(e.target.value)}>
            <MenuItem value="hair_oil">Hair Oil</MenuItem>
            <MenuItem value="hair_care">Hair Care</MenuItem>
          </Select>
        </FormControl>

        <Button onClick={uploadProduct} sx={{ mt: 2 }}>
          {uploading ? <CircularProgress size={20} /> : "Upload"}
        </Button>
      </Paper>

      <TextField
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        InputProps={{ startAdornment: <SearchIcon /> }}
      />

      {loading ? <CircularProgress /> : (
        <Grid container spacing={2}>
          {filtered.map((p) => (
            <Grid item xs={12} sm={6} md={4} key={p._id}>
              <Card>
                <CardMedia component="img" height="200" image={`${BASE_URL}${p.image}`} />
                <CardContent>
                  <Typography>{p.name}</Typography>
                  <Typography>₵{p.price}</Typography>
                  <IconButton onClick={() => deleteProduct(p._id)}>
                    <DeleteOutlineIcon />
                  </IconButton>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Snackbar open={snackbar.open} onClose={() => setSnackbar(s => ({ ...s, open: false }))}>
        <Alert severity={snackbar.severity}>{snackbar.msg}</Alert>
      </Snackbar>
    </Box>
  );
}