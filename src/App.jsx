import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Landing from './pages/Landing';
import Results from './pages/Results';
import PrivacyPolicy from './pages/PrivacyPolicy';
import CustomCursor from './components/CustomCursor';
import ScrollToTop from './components/ScrollToTop';

const AnimatedRoutes = () => {
    const location = useLocation();

    return (
        <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Landing />} />
            <Route path="/analyze/:username" element={<Results />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
        </Routes>
    );
};

function App() {
    return (
        <Router>
            {/* <ScrollToTop /> */}
            <CustomCursor />
            <div className="min-h-screen text-white bg-[#0b1015] cursor-none">
                {/* cursor-none hides default cursor so CustomCursor takes over */}
                <AnimatedRoutes />
            </div>
        </Router>
    );
}

export default App;
