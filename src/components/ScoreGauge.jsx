
import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { motion } from 'framer-motion';

ChartJS.register(ArcElement, Tooltip, Legend);

const ScoreGauge = ({ score }) => {
    const data = {
        labels: ['Score', 'Remaining'],
        datasets: [
            {
                data: [score, 100 - score],
                backgroundColor: [
                    score > 75 ? '#10b981' : score > 50 ? '#f59e0b' : '#ef4444', // Tailwind Emerald, Amber, Red
                    'rgba(255, 255, 255, 0.05)',
                ],
                borderWidth: 0,
                circumference: 250,
                rotation: 235,
                cutout: '85%',
                borderRadius: 30,
            },
        ],
    };

    const options = {
        plugins: {
            legend: { display: false },
            tooltip: { enabled: false },
        },
        animation: {
            duration: 2000,
            easing: 'easeOutQuart',
        },
        cutout: '85%',
        responsive: true,
        maintainAspectRatio: false,
    };

    return (
        <div className="relative w-40 h-40 mx-auto">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-full h-full relative z-10"
            >
                <Doughnut data={data} options={options} />
            </motion.div>

            {/* Glow Effect behind the gauge */}
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full blur-2xl opacity-20 ${score > 75 ? 'bg-emerald-500' : score > 50 ? 'bg-amber-500' : 'bg-red-500'
                }`}></div>

            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20">
                <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.5 }}
                    className="text-4xl font-extrabold text-white tracking-tighter"
                >
                    {score}
                </motion.span>
                <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    className="text-xs text-gray-400 uppercase tracking-[0.2em] font-medium mt-1"
                >
                    Score
                </motion.span>
            </div>
        </div>
    );
};

export default ScoreGauge;
