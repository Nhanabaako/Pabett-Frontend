import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

// Pages
import Home from "./pages/Home";
import Gallery from "./pages/Gallery";
import GalleryUpload from "./pages/GalleryUpload";
import GalleryAdmin from "./pages/admin/GalleryAdmin";
import AdminLogin from "./pages/login";
import Product from "./pages/Product";
import Services from "./pages/Services";
import About from "./pages/About";
import CartProvider from "./context/CartContext"; // Note: This was a default export in your file

// Components
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function MyApp() {
  return (
    <HelmetProvider>
      <CartProvider> 
        <Router>
          <Header /> {/* 2. Now Header is INSIDE the provider */}

          <Routes>
            {/* PUBLIC */}
            <Route path="/" element={<Home />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/product" element={<Product />} />
            <Route path="/services" element={<Services />} />
            <Route path="/about" element={<About />} />

            {/* ADMIN */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/gallery" element={<GalleryAdmin />} />

            {/* UPLOAD */}
            <Route path="/upload" element={<GalleryUpload />} />
          </Routes>

          <Footer />
        </Router>
      </CartProvider>
    </HelmetProvider>
  );
}