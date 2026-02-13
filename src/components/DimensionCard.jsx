
import React from 'react';
import { motion } from 'framer-motion';

const DimensionCard = ({ title, score, icon: Icon, description }) => {
    const getColor = (s) => {
        if (s >= 80) return 'bg-emerald-500';
        if (s >= 50) return 'bg-amber-400';
        return 'bg-rose-500';
    };

    return (
        <motion.div
            whileHover={{ y: -4, backgroundColor: 'rgba(30,35,45,0.8)' }}
            className="glass-panel p-6 relative overflow-hidden group border border-white/5"
        >
            <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${getColor(score)}/10`}>
                        {Icon && <Icon className={`${getColor(score).replace('bg-', 'text-')}`} size={20} />}
                    </div>
                    <h3 className="font-semibold text-lg text-gray-100 group-hover:text-white transition-colors">{title}</h3>
                </div>
                <div className="flex flex-col items-end">
                    <span className={`text-xl font-bold ${getColor(score).replace('bg-', 'text-')}`}>
                        {score}
                    </span>
                    <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">/100</span>
                </div>
            </div>

            <div className="w-full bg-gray-800/50 h-2 rounded-full overflow-hidden mb-3 backdrop-blur-sm">
                <motion.div
                    className={`h-full ${getColor(score)} shadow-[0_0_10px_rgba(0,0,0,0.3)]`}
                    initial={{ width: 0 }}
                    animate={{ width: `${score}%` }}
                    transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                />
            </div>

            <p className="text-sm text-gray-400 leading-relaxed font-light group-hover:text-gray-300 transition-colors">
                {description}
            </p>

            {/* Decorative Glow */}
            <div
                className={`absolute -right-4 -bottom-4 w-24 h-24 ${getColor(score)} opacity-[0.03] blur-2xl rounded-full group-hover:opacity-[0.08] transition-opacity duration-500`}
            />
        </motion.div>
    );
};

export default DimensionCard;
