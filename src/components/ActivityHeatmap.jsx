import React from 'react';
import { motion } from 'framer-motion';

const ActivityHeatmap = ({ events }) => {
    // 1. Setup GitHub-like Grid
    // We need 53 weeks to ensure full coverage of the last year
    // Grid: columns = weeks, rows = days (0=Sun, 6=Sat)

    const today = new Date();
    const daysMap = new Map();

    // Process events
    events.forEach(event => {
        if (event.created_at) {
            const dateKey = event.created_at.split('T')[0];
            daysMap.set(dateKey, (daysMap.get(dateKey) || 0) + 1);
        }
    });

    // Calculate start date (365 days ago, adjusted to Sunday)
    const startDate = new Date();
    startDate.setDate(today.getDate() - 365);
    const dayOfWeek = startDate.getDay(); // 0 is Sunday
    startDate.setDate(startDate.getDate() - dayOfWeek); // Start on Sunday

    const weeks = [];
    const monthLabels = [];
    let currentMonth = -1;

    let currentDate = new Date(startDate);

    // Generate 53 weeks
    for (let w = 0; w < 53; w++) {
        const week = [];

        // Check month for label
        const month = currentDate.getMonth();
        if (month !== currentMonth && w < 51) { // Avoid label at very end
            monthLabels.push({ index: w, label: currentDate.toLocaleString('default', { month: 'short' }) });
            currentMonth = month;
        }

        for (let d = 0; d < 7; d++) {
            const dateStr = currentDate.toISOString().split('T')[0];
            // Don't render future days
            if (currentDate > today) {
                week.push(null);
            } else {
                const count = daysMap.get(dateStr) || 0;
                // GitHub Levels: 0, 1-?, mean-?, high-?
                // Simple mapping for now
                let level = 0;
                if (count > 0) level = 1;
                if (count > 2) level = 2;
                if (count > 4) level = 3;
                if (count > 8) level = 4;
                week.push({ date: dateStr, count, level });
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }
        weeks.push(week);
    }

    // GitHub Green Theme
    const getGitHubColor = (level) => {
        switch (level) {
            case 0: return 'bg-[#161b22]'; // Empty dot
            case 1: return 'bg-[#0e4429]'; // L1
            case 2: return 'bg-[#006d32]'; // L2
            case 3: return 'bg-[#26a641]'; // L3
            case 4: return 'bg-[#39d353]'; // L4 (Brightest)
            default: return 'bg-[#161b22]';
        }
    };

    return (
        <motion.div
            className="md:col-span-1 lg:col-span-2 bg-[#0d1117] border border-[#30363d] rounded-xl p-4 md:p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
        >
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-white">
                    {events.length >= 200 ? '200+ contributions' : `${events.length} contributions`} in the last year
                </h3>
                <div className="text-xs text-[#8b949e]">Last Year</div>
            </div>

            <div className="flex flex-col overflow-x-auto scrollbar-hide">
                {/* Month Labels */}
                <div className="flex mb-2 text-[10px] text-[#7d8590] ml-8">
                    {monthLabels.map((m, i) => (
                        <div key={i} style={{ width: `${(m.index - (monthLabels[i - 1]?.index || 0)) * 14}px` }}>
                            {/* Rough spacing calculation */}
                            {i === 0 || (m.index - monthLabels[i - 1].index) > 2 ? m.label : ''}
                        </div>
                    ))}
                    {/* Fallback spacing fix - render absolute? No, simplified loop is safer */}
                </div>

                <div className="flex">
                    {/* Day Labels */}
                    <div className="flex flex-col gap-[3px] mr-2 text-[9px] text-[#7d8590] pt-[15px]">
                        <div className="h-[10px]"></div> {/* Sun */}
                        <div className="h-[10px] leading-[10px]">Mon</div>
                        <div className="h-[10px]"></div>
                        <div className="h-[10px] leading-[10px]">Wed</div>
                        <div className="h-[10px]"></div>
                        <div className="h-[10px] leading-[10px]">Fri</div>
                        <div className="h-[10px]"></div>
                    </div>

                    {/* The Grid */}
                    <div className="flex gap-[3px]">
                        {weeks.map((week, wIndex) => (
                            <div key={wIndex} className="flex flex-col gap-[3px]">
                                {week.map((day, dIndex) => (
                                    day ? (
                                        <div
                                            key={day.date}
                                            title={`${day.count} contributions on ${day.date}`}
                                            className={`w-[10px] h-[10px] rounded-[2px] ${getGitHubColor(day.level)} border border-transparent hover:border-[#8b949e]/50 transition-colors`}
                                        ></div>
                                    ) : (
                                        <div key={dIndex} className="w-[10px] h-[10px]"></div>
                                    )
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Legend */}
            <div className="mt-4 flex items-center justify-end gap-1 text-[10px] text-[#7d8590]">
                <span>Less</span>
                <div className="w-[10px] h-[10px] rounded-[2px] bg-[#161b22]"></div>
                <div className="w-[10px] h-[10px] rounded-[2px] bg-[#0e4429]"></div>
                <div className="w-[10px] h-[10px] rounded-[2px] bg-[#006d32]"></div>
                <div className="w-[10px] h-[10px] rounded-[2px] bg-[#26a641]"></div>
                <div className="w-[10px] h-[10px] rounded-[2px] bg-[#39d353]"></div>
                <span>More</span>
            </div>
        </motion.div>
    );
};

export default ActivityHeatmap;
