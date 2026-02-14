import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { motion } from 'framer-motion';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const CommitChart = ({ events }) => {
    // Process events for commit activity
    const commitData = {};
    const today = new Date();

    // Init last 30 days (increased from 14)
    for (let i = 29; i >= 0; i--) {
        const d = new Date();
        d.setDate(today.getDate() - i);
        commitData[d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })] = 0;
    }

    if (events) {
        events.forEach(event => {
            if (event.type === 'PushEvent') {
                const date = new Date(event.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                if (commitData[date] !== undefined) {
                    commitData[date] += event.payload.size || 1;
                }
            }
        });
    }

    const data = {
        labels: Object.keys(commitData),
        datasets: [
            {
                label: 'Commits',
                data: Object.values(commitData),
                fill: true,
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderColor: 'rgba(59, 130, 246, 0.8)',
                borderWidth: 2,
                tension: 0.4,
                pointBackgroundColor: 'rgba(59, 130, 246, 1)',
                pointBorderColor: '#0b1015',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: 'rgba(13, 17, 23, 0.9)',
                titleColor: '#fff',
                bodyColor: '#cbd5e1',
                borderColor: 'rgba(59, 130, 246, 0.3)',
                borderWidth: 1,
                padding: 10,
                displayColors: false,
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(255, 255, 255, 0.05)',
                },
                ticks: {
                    color: '#94a3b8',
                    font: { size: 10 }
                },
                border: { display: false }
            },
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    color: '#64748b',
                    font: { size: 10 }
                },
                border: { display: false }
            },
        },
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full h-full p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm relative overflow-hidden hover:border-blue-500/30 transition-all duration-300"
        >
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold text-gray-200 tracking-widest uppercase flex items-center gap-2">
                    Event Frequency
                </h3>
            </div>
            <div className="flex-grow relative w-full h-full min-h-[200px]">
                <Line data={data} options={options} />
            </div>
        </motion.div>
    );
};

export default CommitChart;
