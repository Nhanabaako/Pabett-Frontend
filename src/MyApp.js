import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

// CONTEXT
import CartProvider from "./context/CartContext";

// LAYOUT
import AdminLayout from "./layouts/AdminLayout";

// ADMIN PAGES
import Dashboard from "./pages/admin/Dashboard";
import GalleryAdmin from "./pages/admin/GalleryAdmin";
import ProductsAdmin from "./pages/admin/ProductsAdmin";
import AdminLogin from "./pages/login";

// PUBLIC PAGES
import Home from "./pages/Home";
import Gallery from "./pages/Gallery";
import Product from "./pages/Product";
import Services from "./pages/Services";
import About from "./pages/About";
import GalleryUpload from "./pages/GalleryUpload";

// COMPONENTS
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function MyApp() {
  return (
    <HelmetProvider>
      <CartProvider>
        <Router>
          <Header />

          <Routes>
            {/* ================= PUBLIC ================= */}
            <Route path="/" element={<Home />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/product" element={<Product />} />
            <Route path="/services" element={<Services />} />
            <Route path="/about" element={<About />} />

           <Route path="/admin/login" element={<AdminLogin />} />

<Route path="/admin/dashboard" element={
  <AdminLayout>
    <Dashboard />
  </AdminLayout>
} />

<Route path="/admin/gallery" element={
  <AdminLayout>
    <GalleryAdmin />
  </AdminLayout>
} />

<Route path="/admin/products" element={
  <AdminLayout>
    <ProductsAdmin />
  </AdminLayout>
} />
            {/* ================= UPLOAD (OPTIONAL) ================= */}
            <Route path="/upload" element={<GalleryUpload />} />
          </Routes>

          <Footer />
        </Router>
      </CartProvider>
    </HelmetProvider>
  );
}