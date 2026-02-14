
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTerminal, FaCode, FaGithubAlt, FaServer, FaShieldAlt } from 'react-icons/fa';

const TerminalLoader = () => {
    const [lines, setLines] = useState([
        "Initializing scan sequence...",
        "Connecting to GitHub API v3..."
    ]);

    useEffect(() => {
        const steps = [
            "Authenticating secure handshake...",
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
                    if (newLines.length > 7) newLines.shift(); // Keep only last 7 lines
                    return newLines;
                });
                i++;
            } else {
                clearInterval(interval);
            }
        }, 350);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] w-full max-w-4xl mx-auto px-4 relative overflow-hidden">

            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] animate-pulse pointer-events-none"></div>

            {/* Holographic Scanner Effect */}
            <div className="relative w-40 h-40 mb-12 group">
                <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl group-hover:bg-blue-400/30 transition-all duration-500"></div>

                {/* Core */}
                <div className="relative z-10 w-full h-full bg-[#0d1117] rounded-full border border-blue-500/30 flex items-center justify-center overflow-hidden shadow-2xl shadow-blue-500/20">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 bg-gradient-to-tr from-transparent via-blue-500/10 to-transparent"
                    />
                    <FaGithubAlt size={64} className="text-gray-100 relative z-20 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]" />

                    {/* Scanning Laser */}
                    <motion.div
                        className="absolute w-full h-[2px] bg-blue-400 shadow-[0_0_20px_rgba(59,130,246,1)] z-30"
                        animate={{ top: ['0%', '100%', '0%'], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                </div>

                {/* Orbiting Elements */}
                <svg className="absolute inset-[-40px] w-[calc(100%+80px)] h-[calc(100%+80px)] pointer-events-none animate-[spin_10s_linear_infinite]">
                    <circle cx="50%" cy="50%" r="48%" fill="none" stroke="rgba(59, 130, 246, 0.2)" strokeWidth="1" strokeDasharray="4 4" />
                </svg>
                <svg className="absolute inset-[-20px] w-[calc(100%+40px)] h-[calc(100%+40px)] pointer-events-none animate-[spin_15s_linear_infinite_reverse]">
                    <circle cx="50%" cy="50%" r="48%" fill="none" stroke="rgba(168, 85, 247, 0.2)" strokeWidth="1" strokeDasharray="10 10" />
                </svg>

                {/* Orbiting Icons */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-[-30px]"
                >
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-[#0d1117] rounded-full border border-blue-500/30 flex items-center justify-center shadow-[0_0_10px_rgba(59,130,246,0.4)] transform rotate-[-0deg]">
                        <FaCode size={12} className="text-blue-400" />
                    </div>
                </motion.div>
                <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-[-30px]"
                >
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-8 h-8 bg-[#0d1117] rounded-full border border-purple-500/30 flex items-center justify-center shadow-[0_0_10px_rgba(168,85,247,0.4)] transform rotate-[0deg]">
                        <FaServer size={12} className="text-purple-400" />
                    </div>
                </motion.div>
            </div>

            {/* Terminal Window */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-xl bg-[#0d1117]/80 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl font-mono text-xs md:text-sm relative z-10"
            >
                {/* Window Controls */}
                <div className="bg-white/5 px-4 py-2 flex items-center gap-2 border-b border-white/5">
                    <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
                    </div>
                    <div className="ml-auto text-xs text-gray-500 flex items-center gap-1.5 bg-black/20 px-2 py-0.5 rounded border border-white/5">
                        <FaTerminal size={9} />
                        <span className="tracking-wider">ANALYZER_DAEMON.EXE</span>
                    </div>
                </div>

                {/* Console Output */}
                <div className="p-6 h-56 flex flex-col justify-end items-start text-left bg-gradient-to-b from-[#0d1117] to-[#010409]">
                    <AnimatePresence mode='popLayout'>
                        {lines.map((line, index) => (
                            <motion.div
                                layout
                                key={`${index}-${line}`}
                                initial={{ opacity: 0, x: -10, filter: 'blur(4px)' }}
                                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.2 }}
                                className="text-gray-300/90 mb-1.5 flex items-center gap-2 w-full"
                            >
                                <span className="text-blue-500/80 font-bold">➜</span>
                                {line.includes("successful") || line.includes("Insights") ? (
                                    <span className="text-green-400 font-semibold drop-shadow-[0_0_8px_rgba(74,222,128,0.3)]">{line}</span>
                                ) : line.includes("Calculating") || line.includes("Analyzing") ? (
                                    <span className="text-yellow-400/90">{line}</span>
                                ) : line.includes("Connecting") ? (
                                    <span className="text-blue-300">{line}</span>
                                ) : (
                                    <span>{line}</span>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    <div className="flex items-center gap-2 mt-2 opacity-50">
                        <motion.div
                            animate={{ opacity: [1, 0, 1] }}
                            transition={{ duration: 0.8, repeat: Infinity }}
                            className="w-2 h-4 bg-blue-500"
                        />
                    </div>
                </div>

                {/* Bottom Status Bar */}
                <div className="bg-blue-500/5 px-4 py-1.5 border-t border-blue-500/10 flex justify-between items-center text-[10px] text-blue-400/60 uppercase tracking-widest">
                    <span>Mem: 42MB</span>
                    <span className="animate-pulse">Processing...</span>
                    <span>v2.1.0</span>
                </div>
            </motion.div>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-8 text-gray-500 text-[10px] uppercase tracking-[0.3em] font-medium"
            >
                Secure Connection Established
            </motion.p>
        </div>
    );
};

export default TerminalLoader;
