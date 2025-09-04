
import React from 'react';
import { HashRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Portfolio } from './pages/Portfolio';
import { Writings } from './pages/Writings';
import { Contact } from './pages/Contact';
import { Admin } from './pages/Admin';
import { AuthProvider, useAuth } from './contexts/AuthContext';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const auth = useAuth();
    if (!auth.isAuthenticated) {
        return <Navigate to="/" replace />;
    }
    return <>{children}</>;
};

const AnimatedRoutes: React.FC = () => {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/writings" element={<Writings />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/admin" element={
                    <ProtectedRoute>
                        <Admin />
                    </ProtectedRoute>
                } />
            </Routes>
        </AnimatePresence>
    );
}

const App: React.FC = () => {
  return (
    <HashRouter>
      <AuthProvider>
        <div className="bg-[#0B0B0C] text-[#F5F7FA] min-h-screen flex flex-col font-body">
          <Header />
          <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24 md:pt-32">
              <AnimatedRoutes />
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </HashRouter>
  );
};

export default App;
