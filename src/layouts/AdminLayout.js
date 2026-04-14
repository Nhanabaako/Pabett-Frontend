import { Box, Drawer, List, ListItemButton } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function AdminLayout({ children }) {
  const nav = useNavigate();

  return (
    <Box sx={{ display: "flex" }}>
      <Drawer variant="permanent">
        <List>
          <ListItemButton onClick={() => nav("/admin")}>Dashboard</ListItemButton>
          <ListItemButton onClick={() => nav("/admin/products")}>Products</ListItemButton>
          <ListItemButton onClick={() => nav("/admin/gallery")}>Gallery</ListItemButton>
        </List>
      </Drawer>

      <Box sx={{ flex: 1, p: 3 }}>{children}</Box>
    </Box>
  );
}