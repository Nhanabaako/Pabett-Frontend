import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  Box,
  Typography,
  Grid,
  IconButton
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export default function UploadDropzone({
  onChange,
  multiple = false,
  maxFiles = 5,
}) {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");

  const onDrop = useCallback(
    (acceptedFiles) => {
      if (!acceptedFiles.length) return;

      let selected = multiple ? acceptedFiles : [acceptedFiles[0]];

      if (selected.length > maxFiles) {
        setError(`Max ${maxFiles} images allowed`);
        return;
      }

      const mapped = selected.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        id: file.name + Date.now(),
      }));

      setFiles(mapped);
      setError("");

      onChange(multiple ? mapped.map((f) => f.file) : mapped[0].file);
    },
    [multiple, maxFiles, onChange]
  );

  useEffect(() => {
    return () => files.forEach((f) => URL.revokeObjectURL(f.preview));
  }, [files]);

  const removeFile = (id) => {
    const updated = files.filter((f) => f.id !== id);
    setFiles(updated);
    onChange(multiple ? updated.map((f) => f.file) : null);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple,
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp"] },
  });

  return (
    <>
      <Box
        {...getRootProps()}
        sx={{
          border: "2px dashed",
          borderColor: isDragActive ? "#00B6AD" : "#ccc",
          borderRadius: 3,
          p: 4,
          textAlign: "center",
          cursor: "pointer",
          background: "#fafafa",
          transition: "0.2s",
          "&:hover": { borderColor: "#00B6AD" },
        }}
      >
        <input {...getInputProps()} />

        <Typography fontWeight={500}>
          {multiple
            ? "Drag & drop images or click"
            : "Drag & drop image or click"}
        </Typography>
      </Box>

      {error && (
        <Typography color="error" mt={1}>
          {error}
        </Typography>
      )}

      {/* PREVIEW */}
      <Grid container spacing={2} mt={2}>
        {files.map((f) => (
          <Grid item xs={4} key={f.id}>
            <Box position="relative">
              <img
                src={f.preview}
                alt="preview"
                style={{
                  width: "100%",
                  height: 120,
                  objectFit: "cover",
                  borderRadius: 10,
                }}
              />

              <IconButton
                size="small"
                onClick={() => removeFile(f.id)}
                sx={{
                  position: "absolute",
                  top: 5,
                  right: 5,
                  bgcolor: "white",
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          </Grid>
        ))}
      </Grid>
    </>
  );
}