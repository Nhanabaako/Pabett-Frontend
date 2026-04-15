import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CircularProgress,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import UploadDropzone from "../../components/UploadDropzone";

const BASE_URL = "http://localhost:5000";

export default function GalleryAdmin() {
  const navigate = useNavigate();
  const adminKey = localStorage.getItem("adminKey");

  const [images, setImages] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // 🔐 PROTECT ROUTE
  useEffect(() => {
    if (!adminKey) {
      navigate("/admin/login");
    } else {
      fetchImages();
    }
  }, [adminKey, navigate]);

  // 📸 FETCH IMAGES
  const fetchImages = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/gallery`);
      const data = await res.json();
      setImages(data.images || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load gallery");
    } finally {
      setLoading(false);
    }
  };

  // ⬆️ MULTIPLE IMAGE UPLOAD
  const uploadImages = async () => {
    if (!files.length) return alert("Select images");

    setUploading(true);

    try {
      for (let file of files) {
        const formData = new FormData();
        formData.append("image", file);

        await fetch(`${BASE_URL}/api/gallery/upload`, {
          method: "POST",
          headers: {
            "x-admin-key": adminKey,
          },
          body: formData,
        });
      }

      setFiles([]);
      await fetchImages();

      alert("✅ Images uploaded successfully");
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  // ❌ DELETE IMAGE
  const deleteImage = async (id) => {
    if (!window.confirm("Delete this image?")) return;

    try {
      await fetch(`${BASE_URL}/api/gallery/${id}`, {
        method: "DELETE",
        headers: {
          "x-admin-key": adminKey,
        },
      });

      setImages((prev) => prev.filter((img) => img._id !== id));
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} mb={3}>
        🖼️ Gallery Manager
      </Typography>

      {/* 📤 UPLOAD SECTION */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
        <Typography variant="h6" mb={2}>
          Upload Multiple Images
        </Typography>

        {/* ✅ FIXED: MULTIPLE FILE HANDLER */}
        <UploadDropzone onFiles={setFiles} />

        {/* PREVIEW */}
        {files.length > 0 && (
          <Grid container spacing={2} mt={2}>
            {files.map((file, index) => (
              <Grid item xs={4} key={index}>
                <img
                  src={URL.createObjectURL(file)}
                  alt="preview"
                  style={{
                    width: "100%",
                    borderRadius: 8,
                  }}
                />
              </Grid>
            ))}
          </Grid>
        )}

        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={uploadImages}
          disabled={uploading}
        >
          {uploading ? (
            <CircularProgress size={20} />
          ) : (
            "Upload Images"
          )}
        </Button>
      </Paper>

      {/* 🖼️ GALLERY */}
      {loading ? (
        <Box textAlign="center">
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {images.map((img) => (
            <Grid item xs={12} sm={6} md={4} key={img._id}>
              <Card sx={{ borderRadius: 3 }}>
                <CardMedia
                  component="img"
                  height="220"
                  image={`${BASE_URL}${img.url}`}
                  alt="gallery"
                />

                <CardContent>
                  <Button
                    fullWidth
                    color="error"
                    variant="contained"
                    onClick={() => deleteImage(img._id)}
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