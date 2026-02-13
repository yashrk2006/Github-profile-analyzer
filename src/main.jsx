
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Landing from './pages/Landing.jsx'
import Results from './pages/Results.jsx'
import Header from './components/Header.jsx'
import './index.css'

const AppLayout = () => {
    const location = useLocation();
    // Optional: Hide header on landing if desired, but user asked for "Fixed at the top".
    // Let's keep it visible or maybe make it transparent on Landing.
    // For now, consistent global header as requested.

    return (
        <>
            <Header />
            <div className="pt-16"> {/* Spacer for fixed header */}
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/analyze/:username" element={<Results />} />
                </Routes>
            </div>
        </>
    )
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <AppLayout />
        </BrowserRouter>
    </React.StrictMode>,
)
