import React from 'react';
import { motion } from 'framer-motion';

const ActivityHeatmap = ({ events }) => {
    // Generate last 365 days (52 weeks + 1 day)
    const today = new Date();
    const daysMap = new Map();
    const boxSize = 10;
    const gap = 3;

    // Initialize last 365 days with 0
    // We want the grid to end on today. 
    // Grid matches GitHub: Columns are weeks, Rows are days (Sun-Sat or Mon-Sun).
    // Let's do 53 weeks to be safe.

    // 1. Create a map of date strings to counts
    events.forEach(event => {
        if (event.created_at) {
            const dateKey = event.created_at.split('T')[0];
            daysMap.set(dateKey, (daysMap.get(dateKey) || 0) + 1);
        }
    });

    // 2. Build the weeks array
    const weeks = [];
    // Start from 365 days ago? Or align to start of week?
    // GitHub aligns to Sunday.
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 364);

    // Adjust start date to previous Sunday
    const startDay = startDate.getDay();
    startDate.setDate(startDate.getDate() - startDay);

    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
        const week = [];
        for (let i = 0; i < 7; i++) {
            const dateStr = currentDate.toISOString().split('T')[0];
            const count = daysMap.get(dateStr) || 0;

            // Determine Level
            let level = 0;
            if (count > 0) level = 1;
            if (count > 2) level = 2;
            if (count > 5) level = 3;
            if (count > 10) level = 4;

            week.push({ date: dateStr, count, level });
            currentDate.setDate(currentDate.getDate() + 1);
        }
        weeks.push(week);
    }

    // Colors for different levels (GitHub Green style but matching our Blue/Cyan theme)
    const getColor = (level) => {
        switch (level) {
            case 0: return 'bg-gray-800/50';
            case 1: return 'bg-blue-900';
            case 2: return 'bg-blue-700';
            case 3: return 'bg-blue-500';
            case 4: return 'bg-blue-300';
            default: return 'bg-gray-800/50';
        }
    };

    return (
        <motion.div
            className="fui-panel p-6 border-blue-500/20 relative overflow-hidden h-full flex flex-col"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
        >
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-gray-200 tracking-widest uppercase flex items-center gap-2">
                    Contribution Signal
                </h3>
                <div className="text-[10px] text-blue-500 font-mono">
                    {events.length >= 200 ? '200+ EVENTS' : `${events.length} EVENTS`}
                </div>
            </div>

            <div className="flex-1 overflow-x-auto overflow-y-hidden scrollbar-hide">
                <div className="flex gap-[3px] min-w-max">
                    {weeks.map((week, wIndex) => (
                        <div key={wIndex} className="flex flex-col gap-[3px]">
                            {week.map((day, dIndex) => (
                                <div
                                    key={day.date}
                                    title={`${day.date}: ${day.count} contributions`}
                                    className={`w-[10px] h-[10px] rounded-[2px] ${getColor(day.level)} hover:border hover:border-white/50 transition-colors`}
                                ></div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-4 flex items-center gap-2 text-[10px] text-gray-400">
                <span>Less</span>
                <div className={`w-[10px] h-[10px] rounded-[2px] ${getColor(0)}`}></div>
                <div className={`w-[10px] h-[10px] rounded-[2px] ${getColor(1)}`}></div>
                <div className={`w-[10px] h-[10px] rounded-[2px] ${getColor(2)}`}></div>
                <div className={`w-[10px] h-[10px] rounded-[2px] ${getColor(3)}`}></div>
                <div className={`w-[10px] h-[10px] rounded-[2px] ${getColor(4)}`}></div>
                <span>More</span>
            </div>

            {/* Grid overlay for FUI look */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none"></div>
        </motion.div>
    );
};

export default ActivityHeatmap;
