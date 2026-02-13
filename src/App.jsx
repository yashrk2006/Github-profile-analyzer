
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Results from './pages/Results';

function App() {
    return (
        <Router>
            <div className="min-h-screen text-white">
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/analyze/:username" element={<Results />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
