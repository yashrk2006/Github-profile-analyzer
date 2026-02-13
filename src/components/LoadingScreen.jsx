
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTerminal, FaCode, FaGithubAlt, FaServer } from 'react-icons/fa';

const TerminalLoader = () => {
    const [lines, setLines] = useState([
        "Initializing scan sequence...",
        "Connecting to GitHub API v3...",
        "Authenticating secure handshake..."
    ]);

    useEffect(() => {
        const steps = [
            "Fetching public repositories...",
            "Analyzing commit frequency...",
            "Clone successful: 'portfolio-v1'",
            "Scanning for README.md...",
            "Evaluating code complexity...",
            "Calculating impact score...",
            "Detecting language composition...",
            "Generating recruiter insights...",
            "Finalizing report..."
        ];

        let i = 0;
        const interval = setInterval(() => {
            if (i < steps.length) {
                setLines(prev => {
                    const newLines = [...prev, steps[i]];
                    if (newLines.length > 6) newLines.shift(); // Keep only last 6 lines
                    return newLines;
                });
                i++;
            } else {
                clearInterval(interval);
            }
        }, 400); // Add a new line every 400ms

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] w-full max-w-2xl mx-auto px-4">

            {/* Holographic Scanner Effect */}
            <div className="relative w-32 h-32 mb-10 group">
                <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl group-hover:bg-blue-400/30 transition-all duration-500 animate-pulse"></div>
                <div className="relative z-10 w-full h-full bg-[#0d1117] rounded-full border border-blue-500/30 flex items-center justify-center overflow-hidden">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 bg-gradient-to-tr from-transparent via-blue-500/10 to-transparent"
                    />
                    <FaGithubAlt size={48} className="text-gray-200 relative z-20" />

                    {/* Ring Scanner */}
                    <motion.div
                        className="absolute w-full h-[2px] bg-blue-400/80 shadow-[0_0_15px_rgba(59,130,246,0.8)]"
                        animate={{ top: ['0%', '100%', '0%'] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                </div>

                {/* Orbiting Icons */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-[-20px]"
                >
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-[#0d1117] rounded-full border border-white/10 flex items-center justify-center shadow-lg transform rotate-[-0deg]">
                        <FaCode size={12} className="text-green-400" />
                    </div>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-8 h-8 bg-[#0d1117] rounded-full border border-white/10 flex items-center justify-center shadow-lg transform rotate-[-180deg]">
                        <FaServer size={12} className="text-purple-400" />
                    </div>
                </motion.div>
            </div>

            {/* Terminal Window */}
            <div className="w-full bg-[#0d1117]/90 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden shadow-2xl font-mono text-sm relative">
                {/* Window Controls */}
                <div className="bg-white/5 px-4 py-2 flex items-center gap-2 border-b border-white/5">
                    <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                    <span className="ml-auto text-xs text-gray-500 flex items-center gap-1">
                        <FaTerminal size={10} /> analyzer.exe
                    </span>
                </div>

                {/* Console Output */}
                <div className="p-6 h-48 flex flex-col justify-end items-start text-left">
                    <AnimatePresence>
                        {lines.map((line, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="text-gray-300 mb-1 flex items-center gap-2"
                            >
                                <span className="text-blue-500">➜</span>
                                {line.includes("successful") ? (
                                    <span className="text-green-400">{line}</span>
                                ) : line.includes("Calculating") ? (
                                    <span className="text-yellow-400">{line}</span>
                                ) : (
                                    <span>{line}</span>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    <motion.div
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                        className="w-2 h-4 bg-blue-500 mt-1"
                    />
                </div>
            </div>

            <p className="mt-6 text-gray-500 text-xs uppercase tracking-[0.2em] animate-pulse">
                System Processing
            </p>
        </div>
    );
};

export default TerminalLoader;
