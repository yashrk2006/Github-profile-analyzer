import React from 'react';
import { motion } from 'framer-motion';
import { FaCodeBranch, FaStar, FaEye, FaHistory } from 'react-icons/fa';

const StatBox = ({ label, value, icon: Icon, color, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        className="bg-[#0d1117] border border-[#30363d] p-4 rounded-lg flex items-center gap-4 hover:border-blue-500/30 transition-colors group"
    >
        <div className={`w-10 h-10 rounded-lg ${color} bg-opacity-10 flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform`}>
            <Icon className={`text-lg ${color.replace('bg-', 'text-')}`} />
        </div>
        <div>
            <div className="text-xs text-gray-500 uppercase tracking-wider font-bold">{label}</div>
            <div className="text-xl font-mono text-white font-bold">{value}</div>
        </div>
    </motion.div>
);

const StatsGrid = ({ repos, events }) => {
    const totalStars = repos.reduce((acc, repo) => acc + repo.stars, 0);
    const totalForks = 0; // Not passed in repos summary, assumes repos is top 6. 
    // Ideally we'd sum from full repo list but let's estimate or use what we have.
    // Let's us total stars from the top repos as a proxy or just "Top Repo Stars"

    // Calculate Push Events
    const pushEvents = events ? events.filter(e => e.type === 'PushEvent').length : 0;

    // Last Active
    const lastActive = events && events.length > 0
        ? new Date(events[0].created_at).toLocaleDateString()
        : 'N/A';

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
            <StatBox label="Top Stars" value={totalStars} icon={FaStar} color="bg-yellow-500" delay={0.1} />
            <StatBox label="Recent Pushes" value={pushEvents} icon={FaCodeBranch} color="bg-blue-500" delay={0.2} />
            <StatBox label="Last Active" value={lastActive} icon={FaHistory} color="bg-green-500" delay={0.3} />
            <StatBox label="Repo Count" value={repos.length} icon={FaEye} color="bg-purple-500" delay={0.4} />
            {/* Note: repo count is just top 6, maybe rename to Analyzed Repos */}
        </div>
    );
};

export default StatsGrid;
