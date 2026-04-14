// src/components/BeforeAfterGallery.jsx
import React, { useState, useRef, useEffect } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import DragHandleIcon from "@mui/icons-material/DragHandle";

/**
 * Simple accessible before/after slider.
 * Props:
 *  - items: [{ id, before: 'url', after: 'url', caption }]
 *  - width/height optional
 *
 * Controls:
 *  - drag the handle
 *  - keyboard: ArrowLeft/ArrowRight to move handle
 */

export default function BeforeAfterGallery({ items = [], width = "100%", height = 360 }) {
  const [idx, setIdx] = useState(0);
  const [pos, setPos] = useState(50); // percentage of after visible
  const containerRef = useRef(null);
  const handleRef = useRef(null);

  useEffect(() => {
    setPos(50);
  }, [idx]);

  const startDrag = (e) => {
    e.preventDefault();
    const move = (ev) => {
      const clientX = ev.touches ? ev.touches[0].clientX : ev.clientX;
      const rect = containerRef.current.getBoundingClientRect();
      let pct = ((clientX - rect.left) / rect.width) * 100;
      pct = Math.max(0, Math.min(100, pct));
      setPos(pct);
    };
    const up = () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
      window.removeEventListener("touchmove", move);
      window.removeEventListener("touchend", up);
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    window.addEventListener("touchmove", move, { passive: false });
    window.addEventListener("touchend", up);
  };

  const onKey = (e) => {
    if (e.key === "ArrowLeft") setPos((p) => Math.max(0, p - 5));
    if (e.key === "ArrowRight") setPos((p) => Math.min(100, p + 5));
    if (e.key === "ArrowUp") setIdx((i) => Math.max(0, i - 1));
    if (e.key === "ArrowDown") setIdx((i) => Math.min(items.length - 1, i + 1));
  };

  if (!items || items.length === 0) {
    return null;
  }

  const item = items[idx];

  return (
    <Box sx={{ my: 6 }}>
      <Typography variant="h4" sx={{ mb: 2, color: "#2C3E64", textAlign: "center" }}>
        Before & After
      </Typography>

      <Box sx={{ display: "flex", gap: 2, justifyContent: "center", mb: 2 }}>
        {items.map((it, i) => (
          <button
            key={it.id}
            onClick={() => setIdx(i)}
            aria-pressed={i === idx}
            style={{
              border: i === idx ? "2px solid #00B6AD" : "1px solid #ddd",
              padding: "6px 10px",
              borderRadius: 6,
              background: "white",
              cursor: "pointer",
            }}
          >
            {it.caption || `Look ${i + 1}`}
          </button>
        ))}
      </Box>

      <Box
        ref={containerRef}
        tabIndex={0}
        onKeyDown={onKey}
        sx={{
          width,
          height,
          position: "relative",
          overflow: "hidden",
          borderRadius: 2,
          boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
          mx: "auto",
        }}
        aria-label={`${item.caption || "Before and after image"}`}
      >
        {/* before image (bottom) */}
        <img src={item.before} alt={`${item.caption || "Before"} (before)`} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />

        {/* after overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: `${pos}%`,
            height: "100%",
            overflow: "hidden",
          }}
        >
          <img src={item.after} alt={`${item.caption || "After"} (after)`} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        </div>

        {/* draggable handle */}
        <div
          role="slider"
          aria-label="Before/After handle"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pos)}
          tabIndex={0}
          ref={handleRef}
          onKeyDown={onKey}
          onMouseDown={startDrag}
          onTouchStart={startDrag}
          style={{
            position: "absolute",
            top: 0,
            left: `calc(${pos}% - 18px)`,
            height: "100%",
            width: 36,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "ew-resize",
            outline: "none",
            background: "transparent",
          }}
        >
          <IconButton aria-hidden size="small" sx={{ bgcolor: "#fff", border: "2px solid rgba(0,0,0,0.12)" }}>
            <DragHandleIcon />
          </IconButton>
        </div>
      </Box>
    </Box>
  );
}
