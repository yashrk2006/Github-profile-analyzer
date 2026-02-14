import React from 'react';
import { FaExclamationTriangle, FaRadiation, FaRegCalendarTimes, FaRegSadTear, FaLayerGroup, FaUserSlash, FaHistory, FaGhost } from 'react-icons/fa';
import { motion } from 'framer-motion';

const iconMap = {
    FaExclamationTriangle: FaExclamationTriangle,
    FaRegCalendarTimes: FaRegCalendarTimes,
    FaRegSadTear: FaRegSadTear,
    FaLayerGroup: FaLayerGroup,
    FaUserSlash: FaUserSlash,
    FaHistory: FaHistory,
    FaGhost: FaGhost,
    default: FaRadiation
};

const RiskPanel = ({ redFlags }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="h-full p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm relative overflow-hidden group hover:border-red-500/30 transition-all duration-500 flex flex-col"
        >
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2 group-hover:bg-red-500/20 transition-all duration-500"></div>
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-red-500 tracking-widest uppercase flex items-center gap-2">
                    <FaExclamationTriangle /> Risk Analysis
                </h3>
                <div className="px-2 py-1 rounded bg-red-500/10 border border-red-500/30 text-[10px] text-red-500 font-mono">
                    ALERTS: {redFlags ? redFlags.length : 0}
                </div>
            </div>

            <div className="space-y-4">
                {redFlags && redFlags.length > 0 ? (
                    redFlags.map((item, index) => {
                        const IconComponent = iconMap[item.icon] || iconMap.default;
                        return (
                            <div key={index} className="fui-panel-red p-4 relative overflow-hidden group">
                                {/* Hover Glow */}
                                <div className="absolute inset-0 bg-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                <div className="flex items-start gap-3 relative z-10">
                                    <IconComponent className="text-red-500 mt-1 shrink-0 animate-pulse" size={14} />
                                    <div>
                                        <h4 className="font-bold text-gray-200 text-sm mb-1">{item.text}</h4>
                                        <p className="text-xs text-red-300/80">Risk factor detected.</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="bg-white/5 border border-white/5 p-4 rounded-xl flex items-start gap-4 hover:bg-white/10 transition-colors">
                        <div className="mt-1 text-green-400 p-2 bg-green-500/10 rounded-lg shrink-0">
                            <FaExclamationTriangle size={14} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-200">No critical risks detected. Clean record.</p>
                        </div>
                    </div>
                )}
            </div>

            {/* FUI Decorative Element */}
            <div className="mt-auto pt-4 border-t border-red-500/20 flex justify-between text-[10px] text-red-400/70 font-mono">
                <span>SEC-03</span>
                <span>SCAN COMPLETE</span>
            </div>
        </motion.div>
    );
};

export default RiskPanel;
