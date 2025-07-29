import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './components/Toast';
import ScrollToTop from './components/ScrollToTop';
import Header from './components/Header';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import ServicesPage from './pages/ServicesPage';
import FAQPage from './pages/FAQPage';
import ContactPage from './pages/ContactPage';
import BlogPage from './pages/BlogPage';
import GalleryPage from './pages/GalleryPage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import SupabaseTest from './pages/SupabaseTest';

function App() {
  return (
    <ToastProvider>
      <Router>
        <ScrollToTop />
        <div className="min-h-screen parallax-bg">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              {/* <Route path="/test-gallery" element={<TestGallery />} /> */}
              <Route path="/supabase-test" element={<SupabaseTest />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ToastProvider>
  );
}

export default App;