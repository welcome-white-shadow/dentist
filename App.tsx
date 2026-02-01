
import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppFloating from './components/WhatsAppFloating';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import Appointment from './pages/Appointment';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Route protection component
const ProtectedRoute = ({ children }: { children?: React.ReactNode }) => {
  const isAuth = localStorage.getItem('clips_admin_auth') === 'true';
  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

// Layout component
const Layout = ({ children }: { children?: React.ReactNode }) => {
  const location = useLocation();
  const isAdminArea = location.pathname.startsWith('/admin') || location.pathname === '/login';

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {!isAdminArea && <Navbar />}
      <main className="flex-grow">
        {children}
      </main>
      {!isAdminArea && <Footer />}
      {!isAdminArea && <WhatsAppFloating />}
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <ScrollToTop />
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/book" element={<Appointment />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          
          {/* Admin Gateway */}
          <Route path="/login" element={<Login />} />
          
          {/* Protected Admin Routes */}
          <Route 
            path="/admin/*" 
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
