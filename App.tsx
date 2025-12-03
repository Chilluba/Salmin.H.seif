
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
import { ContentProvider, useContent } from './contexts/ContentContext';
import { ProjectDetail } from './pages/ProjectDetail';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const auth = useAuth();
    if (!auth.isAuthenticated) {
        return <Navigate to="/" replace />;
    }
    return <>{children}</>;
};

const AppRoutes: React.FC = () => {
    const { isLoaded } = useContent();
    const location = useLocation();

    if (!isLoaded) {
        return <div className="flex justify-center items-center h-screen"><p>Loading Content...</p></div>;
    }
    
    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/portfolio/:projectId" element={<ProjectDetail />} />
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
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <AuthProvider>
        <ContentProvider>
          <div className="bg-[#0B0B0C] text-[#F5F7FA] min-h-screen flex flex-col font-body">
            <Header />
            <main className="flex-grow relative">
              <AppRoutes />
            </main>
            <Footer />
          </div>
        </ContentProvider>
      </AuthProvider>
    </HashRouter>
  );
};

export default App;
