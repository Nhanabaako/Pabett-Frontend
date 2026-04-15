import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Box, Typography, Grid } from "@mui/material";

export default function UploadDropzone({ onFiles }) {
  const [previews, setPreviews] = useState([]);

  const onDrop = useCallback((acceptedFiles) => {
    if (!acceptedFiles.length) return;

    onFiles(acceptedFiles);

    const previewUrls = acceptedFiles.map(file =>
      Object.assign(file, {
        preview: URL.createObjectURL(file)
      })
    );

    setPreviews(previewUrls);
  }, [onFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpg", ".png", ".jpeg", ".webp"] },
    multiple: true // ✅ IMPORTANT
  });

  return (
    <>
      <Box
        {...getRootProps()}
        sx={{
          border: "2px dashed",
          borderColor: isDragActive ? "#00B6AD" : "#ccc",
          borderRadius: 2,
          p: 4,
          textAlign: "center",
          cursor: "pointer"
        }}
      >
        <input {...getInputProps()} />
        <Typography>
          Drag & drop multiple images or click to select
        </Typography>
      </Box>

      {/* PREVIEW */}
      <Grid container spacing={2} mt={2}>
        {previews.map((file, i) => (
          <Grid item xs={4} key={i}>
            <img
              src={file.preview}
              alt="preview"
              style={{ width: "100%", borderRadius: 8 }}
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
}