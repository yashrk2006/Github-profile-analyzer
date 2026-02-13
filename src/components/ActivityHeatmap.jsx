import React from 'react';
import { motion } from 'framer-motion';

const ActivityHeatmap = ({ events }) => {
    // Process events into a simple activity intensity map
    // We'll create a 52-week x 7-day grid style logic, or simpler for this view
    // For FUI, we want a "digital signal" look.

    const signalBars = Array.from({ length: 40 }).map((_, i) => {
        // If no events, generate a low-level "standby" signal pattern
        if (!events || events.length === 0) {
            return i % 5 === 0 ? 15 : 5; // Heartbeat pattern
        }

        // Mock intensity based on events presence relative to index
        // In a real app, we would map specific dates
        const hasEvent = events[i % events.length];
        return hasEvent ? Math.random() * 80 + 20 : Math.random() * 20 + 5;
    });

    return (
        <motion.div
            className="fui-panel p-6 border-blue-500/20 relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
        >
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-gray-400 tracking-widest uppercase flex items-center gap-2">
                    Activity Signal
                </h3>
                <div className="text-[10px] text-blue-500 font-mono">LIVE</div>
            </div>

            <div className="flex items-end justify-between h-24 gap-1">
                {signalBars.map((height, i) => (
                    <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ duration: 0.5, delay: i * 0.02 }}
                        className={`w-full rounded-t-sm ${height > 50 ? 'bg-blue-500' : 'bg-blue-900/30'}`}
                    />
                ))}
            </div>

            {/* Grid overlay for FUI look */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-blue-500/30"></div>
        </motion.div>
    );
};

export default ActivityHeatmap;
