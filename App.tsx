
import React from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Portfolio } from './pages/Portfolio';
import { Writings } from './pages/Writings';
import { Contact } from './pages/Contact';
import { Login } from './pages/Login';

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
                <Route path="/login" element={<Login />} />
            </Routes>
        </AnimatePresence>
    );
}

const Layout: React.FC = () => {
  const location = useLocation();
  const showBackground = location.pathname === '/' || location.pathname === '/login';

  return (
    <div className="bg-[#0B0B0C] text-[#F5F7FA] min-h-screen flex flex-col font-body relative">
      {showBackground && <SimpleBackground />}
      <div className="relative z-10 flex flex-col flex-grow">
        <Header />
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24 md:pt-32">
          <AnimatedRoutes />
        </main>
        <Footer />
      </div>
    </div>
  );
}

const App: React.FC = () => {
  return (
    <HashRouter>
      <Layout />
    </HashRouter>
  );
};

export default App;
