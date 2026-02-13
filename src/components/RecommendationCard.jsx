
import React from 'react';
import { FaExclamationTriangle, FaCheckCircle, FaInfoCircle, FaLightbulb } from 'react-icons/fa';
import { motion } from 'framer-motion';

const RecommendationCard = ({ type, title, text }) => {
    const getStyles = () => {
        switch (type) {
            case 'critical': return { icon: FaExclamationTriangle, color: 'text-rose-500', bg: 'bg-rose-500/10', border: 'border-l-rose-500' };
            case 'warning': return { icon: FaLightbulb, color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-l-amber-400' };
            case 'easy-win': return { icon: FaCheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-l-emerald-500' };
            default: return { icon: FaInfoCircle, color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-l-blue-400' };
        }
    };

    const style = getStyles();
    const Icon = style.icon;

    return (
        <motion.div
            whileHover={{ x: 4 }}
            className={`p-5 rounded-r-xl border-l-4 ${style.border} ${style.bg} mb-4 flex gap-4 items-start backdrop-blur-sm transition-all hover:bg-opacity-20`}
        >
            <div className={`mt-1 p-2 rounded-lg bg-black/20 ${style.color}`}>
                <Icon size={18} />
            </div>
            <div>
                <h4 className="font-bold text-gray-100 text-base mb-1">{title}</h4>
                <p className="text-sm text-gray-400 leading-relaxed">{text}</p>
            </div>
        </motion.div>
    );
};

export default RecommendationCard;
