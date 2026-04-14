import { Box, Typography } from "@mui/material";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";

export default function UploadDropzone({ onFile }) {
  const onDrop = useCallback((acceptedFiles) => {
    onFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <Box
      {...getRootProps()}
      sx={{
        border: "2px dashed #00B6AD",
        p: 4,
        textAlign: "center",
        cursor: "pointer"
      }}
    >
      <input {...getInputProps()} />
      <Typography>Drag & drop image or click</Typography>
    </Box>
  );
}