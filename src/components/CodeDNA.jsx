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
                position: 'bottom',
                labels: {
                    color: '#8b949e',
                    font: {
                        family: 'Inter',
                        size: 10
                    },
                    boxWidth: 8,
                    usePointStyle: true,
                    padding: 15
                }
            },
            tooltip: {
                backgroundColor: 'rgba(22, 27, 34, 0.9)',
                titleColor: '#f0f6fc',
                bodyColor: '#c9d1d9',
                borderColor: 'rgba(48, 54, 61, 0.6)',
                borderWidth: 1,
                padding: 10,
                boxPadding: 4,
            }
        },
        cutout: '70%',
    };

    const totalCommits = Object.values(languages).reduce((a, b) => a + b, 0);


    return (
        <motion.div
            className="fui-panel p-6 h-full flex flex-col justify-center relative items-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
        >
            <div className="absolute top-4 left-6 text-sm font-bold text-gray-500 tracking-widest uppercase">
                Code DNA
            </div>

            <div className="w-full max-w-[300px] relative">
                <Doughnut data={data} options={options} />
                {/* Center text overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-3xl font-black text-white">{Object.keys(languages).length}</span>
                    <span className="text-[10px] text-gray-500 tracking-widest uppercase">Langs</span>
                </div>
            </div>
        </motion.div>
    );
};

export default CodeDNA;
