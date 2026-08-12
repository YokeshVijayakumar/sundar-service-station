import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import Testimonials from './components/Testimonials';
import Blog from './components/Blog';
import Contact from './components/Contact';
import Footer from './components/Footer';
import { SiteConfigProvider } from './context/SiteConfigContext';
import { AuthProvider, useAuthContext } from './context/AuthContext';

// Admin imports
import AdminLayout from './admin/AdminLayout';
import LoginPage from './admin/pages/LoginPage';
import DashboardPage from './admin/pages/DashboardPage';
import ServicesPage from './admin/pages/ServicesPage';
import BlogPostsPage from './admin/pages/BlogPostsPage';
import TestimonialsPage from './admin/pages/TestimonialsPage';
import BookingsPage from './admin/pages/BookingsPage';
import NewsletterPage from './admin/pages/NewsletterPage';
import SiteConfigPage from './admin/pages/SiteConfigPage';

// Public Landing Page Component
function PublicSite() {
  const [activeSection, setActiveSection] = useState('home');
  const [selectedService, setSelectedService] = useState('');

  const handleNavigate = (section: string) => {
    setActiveSection(section);
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleBookService = (serviceName: string) => {
    setSelectedService(serviceName);
    handleNavigate('contact');
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Header activeSection={activeSection} onNavigate={handleNavigate} />
      
      <main>
        <section id="home">
          <Hero onBookNow={() => handleNavigate('services')} />
        </section>
        
        <section id="services">
          <Services onBookService={handleBookService} />
        </section>
        
        <section id="testimonials">
          <Testimonials />
        </section>
        
        <section id="blog">
          <Blog />
        </section>
        
        <section id="contact">
          <Contact selectedService={selectedService} />
        </section>
      </main>
      
      <Footer />
    </div>
  );
}

// Protected Route Wrapper for Admin Portal
function ProtectedAdminRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuthContext();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SiteConfigProvider>
          <Routes>
            {/* Public Web Application */}
            <Route path="/" element={<PublicSite />} />

            {/* Admin Login */}
            <Route path="/admin/login" element={<LoginPage />} />

            {/* Protected Admin Portal */}
            <Route
              path="/admin"
              element={
                <ProtectedAdminRoute>
                  <AdminLayout />
                </ProtectedAdminRoute>
              }
            >
              <Route index element={<DashboardPage />} />
              <Route path="services" element={<ServicesPage />} />
              <Route path="blog-posts" element={<BlogPostsPage />} />
              <Route path="testimonials" element={<TestimonialsPage />} />
              <Route path="bookings" element={<BookingsPage />} />
              <Route path="newsletter" element={<NewsletterPage />} />
              <Route path="site-config" element={<SiteConfigPage />} />
            </Route>

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </SiteConfigProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;