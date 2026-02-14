import React from 'react';
import { motion } from 'framer-motion';

const ActivityHeatmap = ({ events, contributionCalendar }) => {
    // If no contribution data, fallback to old method or show empty state
    // But we expect contributionCalendar to be populated now

    // transform contributionCalendar data if available
    // Structure: { total: { "2025": 123 }, contributions: [ { date: "2025-01-01", count: 5, level: 2 }, ... ] }

    const today = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(today.getFullYear() - 1);

    let heatmapData = [];

    if (contributionCalendar && contributionCalendar.contributions) {
        // Filter for last 365 days
        heatmapData = contributionCalendar.contributions.filter(day => {
            const date = new Date(day.date);
            return date >= oneYearAgo && date <= today;
        });
    } else {
        // Fallback to events if no calendar data (though server should provide it)
        // ... (keep old logic or just empty?)
        // Let's implement robust fallback using events if calendar is missing
        const daysMap = new Map();
        events.forEach(event => {
            if (event.created_at) {
                const dateKey = event.created_at.split('T')[0];
                daysMap.set(dateKey, (daysMap.get(dateKey) || 0) + 1);
            }
        });

        let currentDate = new Date(oneYearAgo);
        while (currentDate <= today) {
            const dateStr = currentDate.toISOString().split('T')[0];
            const count = daysMap.get(dateStr) || 0;
            let level = 0;
            if (count > 0) level = 1;
            if (count > 2) level = 2;
            if (count > 4) level = 3;
            if (count > 8) level = 4;

            heatmapData.push({ date: dateStr, count, level });
            currentDate.setDate(currentDate.getDate() + 1);
        }
    }

    // Now organize heatmapData into weeks
    const weeks = [];
    const monthLabels = [];
    let currentMonth = -1;
    let currentWeek = [];

    // Alignment: We need to start the grid carefully.
    // GitHub starts column 0 with the day of the week of oneYearAgo? 
    // Usually it's a 53-column grid. Column 0 might be partial.
    // Let's iterate day by day and push to weeks.

    // We need to pad the beginning to align with Sunday
    const startDate = new Date(heatmapData[0]?.date || oneYearAgo);
    const startDayOfWeek = startDate.getDay(); // 0=Sun

    // Pad start
    for (let i = 0; i < startDayOfWeek; i++) {
        currentWeek.push(null);
    }

    heatmapData.forEach((day, index) => {
        currentWeek.push(day);

        // Month Label Logic
        const date = new Date(day.date);
        const month = date.getMonth();
        if (month !== currentMonth) {
            // Only add label if it's the first week of the month appearing in the grid
            if (currentWeek.length === startDayOfWeek + 1 || (currentWeek.length === 1 && weeks.length > 0)) {
                monthLabels.push({ index: weeks.length, label: date.toLocaleString('default', { month: 'short' }) });
                currentMonth = month;
            }
            // Actually, simplified logic: if first day of month, mark the week index
            // Let's stick to a simpler approximation for labels
            if (weeks.length > 0 && currentWeek.length === 1 && month !== currentMonth) {
                monthLabels.push({ index: weeks.length, label: date.toLocaleString('default', { month: 'short' }) });
                currentMonth = month;
            } else if (index === 0) {
                monthLabels.push({ index: 0, label: date.toLocaleString('default', { month: 'short' }) });
                currentMonth = month;
            }
        }

        if (currentWeek.length === 7) {
            weeks.push(currentWeek);
            currentWeek = [];
        }
    });

    // Push remaining
    if (currentWeek.length > 0) {
        weeks.push(currentWeek);
    }

    // GitHub Green Theme
    const getGitHubColor = (level) => {
        switch (level) {
            case 0: return 'bg-[#161b22]'; // Empty
            case 1: return 'bg-[#0e4429]'; // L1
            case 2: return 'bg-[#006d32]'; // L2
            case 3: return 'bg-[#26a641]'; // L3
            case 4: return 'bg-[#39d353]'; // L4
            default: return 'bg-[#161b22]';
        }
    };

    // Calculate total contributions
    // Calculate total contributions

    // Better total calculation: use the fetched 'total' for the "last year" if possible, 
    // or sum the heatmapData count.
    const totalContributions = heatmapData.reduce((acc, day) => acc + (day ? day.count : 0), 0);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full h-full p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm relative overflow-hidden hover:border-green-500/30 transition-all duration-300"
        >
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-white">
                    {totalContributions} contributions in the last year
                </h3>
                <div className="text-xs text-[#8b949e]">Contribution Settings</div>
            </div>

            <div className="flex flex-col overflow-x-auto scrollbar-hide">
                {/* Month Labels */}
                <div className="flex mb-2 text-[10px] text-[#7d8590] ml-0 relative h-4">
                    {monthLabels.map((m, i) => (
                        <div key={i} className="absolute" style={{ left: `${m.index * 13}px` }}>
                            {m.label}
                        </div>
                    ))}
                </div>

                <div className="flex">
                    {/* Day Labels */}
                    <div className="flex flex-col gap-[3px] mr-2 text-[9px] text-[#7d8590] pt-[0px]">
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
                                        // Empty slot (padding)
                                        <div key={`empty-${dIndex}`} className="w-[10px] h-[10px]"></div>
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
