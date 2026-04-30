import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { lazy, Suspense } from "react";
import { CircularProgress, Box } from "@mui/material";

import CartProvider      from "./context/CartContext";
import { AuthProvider }  from "./context/AuthContext";
import AdminLayout       from "./layouts/AdminLayout";
import ProtectedRoute    from "./components/ProtectedRoute";
import SuperAdminRoute   from "./components/SuperAdminRoute";
import Header            from "./components/Header";
import Footer            from "./components/Footer";

// Public pages
import Home            from "./pages/Home";
import Gallery         from "./pages/Gallery";
import Product         from "./pages/Product";
import Services        from "./pages/Services";
import About           from "./pages/About";
import GalleryUpload   from "./pages/GalleryUpload";
import AdminLogin      from "./pages/login";

// Admin pages — always-ready
import Dashboard       from "./pages/admin/Dashboard";
import GalleryAdmin    from "./pages/admin/GalleryAdmin";
import ProductsAdmin   from "./pages/admin/ProductsAdmin";

// Admin pages — lazy loaded
const BookingsAdmin     = lazy(() => import("./pages/admin/BookingsAdmin"));
const AvailabilityAdmin = lazy(() => import("./pages/admin/AvailabilityAdmin"));
const ServicesAdmin     = lazy(() => import("./pages/admin/ServicesAdmin"));
const TestimonialsAdmin = lazy(() => import("./pages/admin/TestimonialsAdmin"));
const TeamAdmin         = lazy(() => import("./pages/admin/TeamAdmin"));
const FAQsAdmin         = lazy(() => import("./pages/admin/FAQsAdmin"));
const MilestonesAdmin   = lazy(() => import("./pages/admin/MilestonesAdmin"));
const SettingsAdmin     = lazy(() => import("./pages/admin/SettingsAdmin"));

// Superadmin pages — lazy loaded
const AdminsAdmin  = lazy(() => import("./pages/admin/AdminsAdmin"));
const AuditLogs    = lazy(() => import("./pages/admin/AuditLogs"));
const SystemAdmin  = lazy(() => import("./pages/admin/SystemAdmin"));

const Spinner = () => (
  <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 300 }}>
    <CircularProgress sx={{ color: "#00B6AD" }} />
  </Box>
);

// Wraps a page in AdminLayout + ProtectedRoute + Suspense
const Admin = ({ children }) => (
  <ProtectedRoute>
    <AdminLayout>
      <Suspense fallback={<Spinner />}>{children}</Suspense>
    </AdminLayout>
  </ProtectedRoute>
);

// Same but also requires superadmin role
const SuperAdmin = ({ children }) => (
  <ProtectedRoute>
    <AdminLayout>
      <SuperAdminRoute>
        <Suspense fallback={<Spinner />}>{children}</Suspense>
      </SuperAdminRoute>
    </AdminLayout>
  </ProtectedRoute>
);

function AppShell() {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith("/admin");
  return (
    <>
      {!isAdmin && <Header />}
      <Routes>
            {/* ── Public ─────────────────────────────────── */}
            <Route path="/"         element={<Home />} />
            <Route path="/gallery"  element={<Gallery />} />
            <Route path="/product"  element={<Product />} />
            <Route path="/services" element={<Services />} />
            <Route path="/about"    element={<About />} />
            <Route path="/upload"   element={<GalleryUpload />} />

            {/* ── Auth ───────────────────────────────────── */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* ── Admin (all protected) ──────────────────── */}
            <Route path="/admin/dashboard"    element={<Admin><Dashboard /></Admin>} />
            <Route path="/admin/bookings"     element={<Admin><BookingsAdmin /></Admin>} />
            <Route path="/admin/availability" element={<Admin><AvailabilityAdmin /></Admin>} />
            <Route path="/admin/products"     element={<Admin><ProductsAdmin /></Admin>} />
            <Route path="/admin/gallery"      element={<Admin><GalleryAdmin /></Admin>} />
            <Route path="/admin/services"     element={<Admin><ServicesAdmin /></Admin>} />
            <Route path="/admin/testimonials" element={<Admin><TestimonialsAdmin /></Admin>} />
            <Route path="/admin/team"         element={<Admin><TeamAdmin /></Admin>} />
            <Route path="/admin/faqs"         element={<Admin><FAQsAdmin /></Admin>} />
            <Route path="/admin/milestones"   element={<Admin><MilestonesAdmin /></Admin>} />
            <Route path="/admin/settings"     element={<Admin><SettingsAdmin /></Admin>} />

            {/* ── Superadmin (role-gated) ────────────── */}
            <Route path="/admin/superadmin/admins" element={<SuperAdmin><AdminsAdmin /></SuperAdmin>} />
            <Route path="/admin/superadmin/logs"   element={<SuperAdmin><AuditLogs /></SuperAdmin>} />
            <Route path="/admin/superadmin/system" element={<SuperAdmin><SystemAdmin /></SuperAdmin>} />
          </Routes>
      {!isAdmin && <Footer />}
    </>
  );
}

export default function MyApp() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <CartProvider>
          <Router>
            <AppShell />
          </Router>
        </CartProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}
