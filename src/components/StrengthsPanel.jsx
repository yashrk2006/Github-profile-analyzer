import React from 'react';
import { FaCheckCircle, FaBolt, FaBook, FaStar, FaFire, FaCode, FaUsers, FaLaptop } from 'react-icons/fa';
import { motion } from 'framer-motion';

const iconMap = {
    FaBook: FaBook,
    FaStar: FaStar,
    FaFire: FaFire,
    FaCode: FaCode,
    FaUsers: FaUsers,
    FaLaptop: FaLaptop,
    default: FaBolt
};

const StrengthsPanel = ({ strengths }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col gap-4 h-full"
        >
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-green-500 tracking-widest uppercase flex items-center gap-2">
                    <FaCheckCircle /> Core Strengths
                </h3>
                <div className="px-2 py-1 rounded bg-green-500/10 border border-green-500/30 text-[10px] text-green-400 font-mono">
                    SIGNAL: STRONG
                </div>
            </div>

            <div className="space-y-4">
                {strengths && strengths.length > 0 ? (
                    strengths.map((item, index) => {
                        const IconComponent = iconMap[item.icon] || iconMap.default;
                        return (
                            <div key={index} className="fui-panel-green p-4 relative overflow-hidden group">
                                {/* Hover Glow */}
                                <div className="absolute inset-0 bg-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                <div className="flex items-start gap-4 relative z-10">
                                    <div className="mt-1 p-2 rounded-full bg-green-500/10 text-green-400 shadow-[0_0_10px_rgba(74,222,128,0.2)]">
                                        <IconComponent size={12} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white text-sm mb-1">{item.text}</h4>
                                        <p className="text-xs text-gray-400">Verified by algorithmic analysis.</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-gray-500 text-sm italic p-4">Analyzing patterns...</div>
                )}
            </div>

            {/* FUI Decorative Element */}
            <div className="mt-auto pt-4 border-t border-green-500/20 flex justify-between text-[10px] text-green-500/40 font-mono">
                <span>SEC-01</span>
                <span>CONFIDENCE: 99.8%</span>
            </div>
        </motion.div>
    );
};

export default StrengthsPanel;
