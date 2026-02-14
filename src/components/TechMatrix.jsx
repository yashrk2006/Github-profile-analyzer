import React from 'react';
import { motion } from 'framer-motion';

const TechMatrix = ({ languages }) => {
    const totalBytes = Object.values(languages).reduce((a, b) => a + b, 0);
    const sortedLangs = Object.entries(languages)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 8); // Top 8

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="h-full p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm relative overflow-hidden hover:border-blue-500/30 transition-all duration-300 flex flex-col"
        >    <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-blue-400 tracking-widest uppercase flex items-center gap-2">
                    Tech Matrix
                </h3>
            </div>

            <div className="grid grid-cols-2 gap-2 h-[240px] overflow-y-auto pr-2 custom-scrollbar">
                {sortedLangs.map(([lang, bytes], index) => {
                    const percentage = ((bytes / totalBytes) * 100).toFixed(1);
                    return (
                        <div key={lang} className="bg-[#0d1117] border border-[#30363d] p-3 rounded group hover:border-blue-500/50 transition-colors relative flex flex-col justify-between">
                            <div className="flex justify-between items-start mb-1">
                                <span className="text-[10px] text-gray-400 font-mono">REQ-{index + 1}</span>
                                <span className="text-[10px] text-blue-500 font-mono">{percentage}%</span>
                            </div>

                            <div className="font-mono text-sm font-bold text-gray-200 group-hover:text-white group-hover:text-glow-blue transition-all truncate" title={lang}>
                                {lang}
                            </div>

                            {/* Corner Accents */}
                            <div className="absolute top-0 left-0 w-1 h-1 border-t border-l border-blue-500/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="absolute bottom-0 right-0 w-1 h-1 border-b border-r border-blue-500/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>
                    );
                })}
            </div>
        </motion.div>
    );
};

export default TechMatrix;
