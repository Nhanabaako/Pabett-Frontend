import { Box } from "@mui/material";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function MainLayout({ children }) {
  return (
    <Box>
      <Header />
      <Box minHeight="80vh">{children}</Box>
      <Footer />
    </Box>
  );
}