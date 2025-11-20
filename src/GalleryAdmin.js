// src/pages/GalleryAdmin.js
import React, { useState, useEffect } from 'react';
import {
  Box, Button, Typography, TextField,
  Grid, CardMedia, CircularProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const API_URL = 'http://localhost:5000/api/gallery';
const ADMIN_KEY = 'yourSecretAdminKey123'; // match your backend .env key

export default function GalleryAdmin() {
  const [images, setImages] = useState([]);
  const [file, setFile] = useState(null);
  const [altText, setAltText] = useState('');
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchImages = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setImages(data.images || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchImages(); }, []);

  const handleUpload = async () => {
    if (!file) return alert('Select a file!');
    const formData = new FormData();
    formData.append('image', file);
    formData.append('altText', altText);
    formData.append('caption', caption);

    const res = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      headers: { 'x-admin-key': ADMIN_KEY },
      body: formData,
    });

    const data = await res.json();
    if (res.ok) {
      alert('✅ Uploaded!');
      setFile(null); setAltText(''); setCaption('');
      fetchImages();
    } else alert(data.error || 'Upload failed');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this image?')) return;
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: { 'x-admin-key': ADMIN_KEY },
    });
    const data = await res.json();
    if (res.ok) {
      alert('🗑️ Deleted!');
      fetchImages();
    } else alert(data.error || 'Delete failed');
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" mb={2}>Admin Gallery Upload</Typography>

      <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <TextField label="Alt Text" value={altText} onChange={e => setAltText(e.target.value)} />
        <TextField label="Caption" value={caption} onChange={e => setCaption(e.target.value)} />
        <Button variant="contained" onClick={handleUpload}>Upload</Button>
      </Box>

      {loading ? <CircularProgress /> : (
        <Grid container spacing={2}>
          {images.map(img => (
            <Grid item xs={12} sm={6} md={4} key={img._id}>
              <Box sx={{ position: 'relative' }}>
                <CardMedia
                  component="img"
                  image={img.url.startsWith('http') ? img.url : `http://localhost:5000${img.url}`}
                  alt={img.altText}
                  sx={{ height: 200, objectFit: 'cover', borderRadius: 2 }}
                />
                <Button
                  onClick={() => handleDelete(img._id)}
                  sx={{
                    position: 'absolute', top: 8, right: 8,
                    bgcolor: 'rgba(255,0,0,0.8)', color: 'white',
                    '&:hover': { bgcolor: 'red' }
                  }}
                >
                  <DeleteIcon />
                </Button>
              </Box>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
