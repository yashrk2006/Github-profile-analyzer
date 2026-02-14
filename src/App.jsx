import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Landing from './pages/Landing';
import Results from './pages/Results';
import CustomCursor from './components/CustomCursor';

const AnimatedRoutes = () => {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<Landing />} />
                <Route path="/analyze/:username" element={<Results />} />
            </Routes>
        </AnimatePresence>
    );
};

function App() {
    return (
        <Router>
            <CustomCursor />
            <div className="min-h-screen text-white bg-[#0b1015] cursor-none">
                {/* cursor-none hides default cursor so CustomCursor takes over */}
                <AnimatedRoutes />
            </div>
        </Router>
    );
}

export default App;
