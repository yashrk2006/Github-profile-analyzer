import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { motion } from 'framer-motion';

ChartJS.register(ArcElement, Tooltip, Legend);

const CodeDNA = ({ languages }) => {
    const labels = Object.keys(languages).slice(0, 5);
    const dataValues = Object.values(languages).slice(0, 5);

    const data = {
        labels: labels,
        datasets: [
            {
                data: dataValues,
                backgroundColor: [
                    '#2f81f7',
                    '#3fb950',
                    '#a855f7',
                    '#f85149',
                    '#8b949e',
                ],
                borderColor: '#0d1117',
                borderWidth: 4,
                hoverOffset: 4,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: 'right', // Moved to right to fill space in 2x2 grid
                labels: {
                    color: '#c9d1d9',
                    font: {
                        family: 'Inter',
                        size: 11 // Slightly larger font
                    },
                    boxWidth: 10,
                    usePointStyle: true,
                    padding: 20
                }
            },
            tooltip: {
                backgroundColor: 'rgba(22, 27, 34, 0.9)',
                titleColor: '#f0f6fc',
                bodyColor: '#c9d1d9',
                borderColor: 'rgba(48, 54, 61, 0.6)',
                borderWidth: 1,
                padding: 12,
                boxPadding: 4,
            }
        },
        cutout: '75%', // Sligthly thinner ring
    };

    const totalCommits = Object.values(languages).reduce((a, b) => a + b, 0);


    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="h-full p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm relative overflow-hidden hover:border-purple-500/30 transition-all duration-300 flex flex-col"
        >
            <div className="absolute top-4 left-6 text-sm font-bold text-gray-200 tracking-widest uppercase">
                Code DNA
            </div>

            <div className="flex-1 flex items-center justify-center w-full">
                <div className="w-full max-w-[400px] relative flex items-center justify-center">
                    <Doughnut data={data} options={options} />
                    {/* Center text overlay - adjusted for right legend */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pr-[20%]">
                        {/* pr-[20%] offsets the text to align with the ring, since legend pushes ring left */}
                        <span className="text-4xl font-black text-white">{Object.keys(languages).length}</span>
                        <span className="text-xs text-gray-300 tracking-widest uppercase">Langs</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default CodeDNA;
