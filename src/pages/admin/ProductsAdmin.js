import React, { useState, useEffect } from "react";
import UploadDropzone from "../../components/UploadDropzone";
import {
  Box,
  Button,
  TextField,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CircularProgress,
  Paper,
} from "@mui/material";

const BASE_URL = "http://localhost:5000";

export default function ProductsAdmin() {
  const [products, setProducts] = useState([]);
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // ✅ FETCH PRODUCTS
  const fetchProducts = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/products`);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
      alert("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ✅ UPLOAD PRODUCT
  const uploadProduct = async () => {
    if (!file || !name || !price) {
      return alert("Please fill all fields and select image");
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("name", name);
      formData.append("price", price);

      const res = await fetch(`${BASE_URL}/api/products`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      // reset form
      setFile(null);
      setName("");
      setPrice("");

      await fetchProducts();

      alert("✅ Product uploaded");
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  // ✅ DELETE PRODUCT
  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      await fetch(`${BASE_URL}/api/products/${id}`, {
        method: "DELETE",
      });

      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* 🔥 HEADER */}
      <Typography variant="h4" mb={3} fontWeight={700}>
        🛍️ Product Admin
      </Typography>

      {/* 📦 UPLOAD SECTION */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
        <Typography variant="h6" mb={2}>
          Upload New Product
        </Typography>

        <UploadDropzone onFile={setFile} />

        <Box mt={2} display="flex" gap={2} flexWrap="wrap">
          <TextField
            label="Product Name"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <TextField
            label="Price (Ghc)"
            fullWidth
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </Box>

        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={uploadProduct}
          disabled={uploading}
        >
          {uploading ? <CircularProgress size={20} /> : "Upload Product"}
        </Button>
      </Paper>

      {/* 🛒 PRODUCTS LIST */}
      {loading ? (
        <Box textAlign="center">
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {products.map((p) => (
            <Grid item xs={12} sm={6} md={4} key={p._id}>
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: 3,
                  overflow: "hidden",
                }}
              >
                <CardMedia
                  component="img"
                  height="220"
                  image={`${BASE_URL}${p.image}`}
                  alt={p.name}
                />

                <CardContent>
                  <Typography fontWeight={600}>{p.name}</Typography>
                  <Typography color="primary">
                    Ghc {p.price}
                  </Typography>

                  <Button
                    fullWidth
                    color="error"
                    variant="contained"
                    sx={{ mt: 2 }}
                    onClick={() => deleteProduct(p._id)}
                  >
                    Delete
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}