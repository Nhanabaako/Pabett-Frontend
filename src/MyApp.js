import Home from "./App/Home";
import Gallery from "./App/Gallery";
import GalleryUpload from './App/GalleryUpload';
import GalleryAdmin from './GalleryAdmin';
import AdminLogin from './App/login';
import Footer from "./App/Footer";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Product from "./App/Product";
import Services from "./App/Services"; 
import Header from "./App/Header";
import About from "./App/About";
import { HelmetProvider } from "react-helmet-async";  // ✅ Add this

export function MyApp() {
  return (
    <HelmetProvider>  {/* ✅ Wrap the whole app here */}
      <Router>
        <Header/>

        <Routes>
          <Route exact path='/' element={<Home />} />
          <Route exact path='/Gallery' element={<Gallery />} />
          <Route path="/admin/gallery" element={<GalleryAdmin />} />
          <Route path="/admin/login" element={<AdminLogin />} />
           <Route path="/upload" element={<GalleryUpload />} />
          <Route exact path='/Product' element={<Product />} />
          <Route exact path='/Services' element={<Services />} />
          <Route exact path='/About' element={<About />} />
        </Routes>  

        <Footer />
      </Router>
    </HelmetProvider>
  );
}

export default MyApp;

