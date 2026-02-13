import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaBook, FaCode, FaChartLine, FaSitemap, FaGlobe, FaLayerGroup,
    FaArrowLeft, FaMapMarkerAlt, FaUsers, FaKey, FaGithub,
    FaExternalLinkAlt, FaLightbulb, FaCheckCircle, FaExclamationTriangle,
    FaShareAlt, FaDownload, FaStar, FaCodeBranch, FaHistory, FaBuilding, FaTwitter
} from 'react-icons/fa';
import axios from 'axios';
import { Doughnut, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    Title
} from 'chart.js';

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    Title
);

import LoadingScreen from '../components/LoadingScreen';

// --- Sub-Components for Dashboard ---

const StatCard = ({ title, value, icon: Icon, color = "blue" }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-6 flex items-start justify-between relative overflow-hidden group"
    >
        <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-${color}-500`}>
            <Icon size={48} />
        </div>
        <div>
            <h3 className="text-gray-400 text-sm font-medium mb-1">{title}</h3>
            <div className="text-3xl font-bold text-white tracking-tight">{value}</div>
        </div>
    </motion.div>
);

const RepoCard = ({ repo }) => (
    <motion.a
        href={repo.html_url}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ y: -4 }}
        className="glass-panel p-5 border border-[#30363d] hover:border-blue-500/50 block group transition-all"
    >
        <div className="flex items-center justify-between mb-2">
            <h4 className="font-bold text-blue-400 group-hover:underline truncate pr-4">{repo.name}</h4>
            <span className="text-xs border border-gray-700 rounded-full px-2 py-0.5 text-gray-400">
                {repo.fork ? 'Fork' : 'Source'}
            </span>
        </div>
        <p className="text-sm text-gray-400 mb-4 line-clamp-2 h-10">
            {repo.description || "No description provided."}
        </p>
        <div className="flex items-center gap-4 text-xs text-gray-500">
            {repo.language && (
                <span className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                    {repo.language}
                </span>
            )}
            <span className="flex items-center gap-1 hover:text-yellow-400 transition-colors">
                <FaStar /> {repo.stargazers_count}
            </span>
            <span className="flex items-center gap-1 hover:text-blue-400 transition-colors">
                <FaCodeBranch /> {repo.forks_count}
            </span>
        </div>
    </motion.a>
);

const Results = () => {
    const { username } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showApiKeyTip, setShowApiKeyTip] = useState(false);

    useEffect(() => {
        let isMounted = true;
        const fetchData = async () => {
            const tipTimer = setTimeout(() => setShowApiKeyTip(true), 4000);
            try {
                const response = await axios.get(`/api/analyze/${username}`);
                if (isMounted) {
                    setData(response.data);
                    setLoading(false);
                    clearTimeout(tipTimer);
                }
            } catch (err) {
                if (isMounted) {
                    const msg = err.response?.data?.error || err.message || 'Failed to analyze profile';
                    setError(typeof msg === 'object' ? JSON.stringify(msg) : String(msg));
                    setLoading(false);
                    clearTimeout(tipTimer);
                }
            }
        };
        fetchData();
        return () => isMounted = false;
    }, [username]);

    if (loading) return (
        <>
            <LoadingScreen />
            {/* Tip reused from before */}
            <AnimatePresence>
                {showApiKeyTip && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="fixed bottom-8 left-1/2 -translate-x-1/2 glass-panel px-6 py-3 flex items-center gap-3 text-sm text-gray-300 z-50 border-blue-500/30 w-max"
                    >
                        <FaKey className="text-blue-400" />
                        <span>Tip: Add <strong>GITHUB_TOKEN</strong> to .env for higher rate limits.</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );

    if (error) return (
        <div className="min-h-screen pt-20 flex flex-col items-center justify-center text-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-panel p-8 max-w-md border-rose-500/30"
            >
                <h2 className="text-3xl font-bold text-rose-500 mb-4">
                    {error.includes('Rate Limit') ? 'Rate Limit Exceeded' : 'Analysis Failed'}
                </h2>
                <p className="text-gray-400 mb-6">{error}</p>
                <Link to="/" className="btn-primary inline-block px-6 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white transition">Try Another Profile</Link>
            </motion.div>
        </div>
    );

    const { profile, scores, repos } = data;

    // Mock data for charts if not fully available from backend
    const languageData = {
        labels: ['JavaScript', 'HTML', 'CSS', 'Python', 'TypeScript'],
        datasets: [{
            data: [40, 20, 15, 15, 10], // In a real app, calculate from repos
            backgroundColor: ['#f1e05a', '#e34c26', '#563d7c', '#3572A5', '#2b7489'],
            borderWidth: 0,
        }]
    };

    const activityData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
            label: 'Commits',
            data: [12, 19, 3, 5, 2, 30], // Mock
            backgroundColor: '#3fb950',
            borderRadius: 4,
        }]
    };

    return (
        <div className="min-h-screen bg-[#0d1117] text-gray-300 font-sans selection:bg-blue-500/30 pt-6 pb-20 px-4 md:px-8 max-w-[1600px] mx-auto">

            <div className="flex flex-col lg:flex-row gap-8">

                {/* --- Section A: Sidebar Profile --- */}
                <motion.aside
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="lg:w-80 shrink-0"
                >
                    <div className="sticky top-24 space-y-6">
                        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
                            <div className="relative mb-4 group">
                                <img
                                    src={profile.avatar}
                                    alt={profile.name}
                                    className="w-48 h-48 rounded-full border-4 border-[#30363d] shadow-2xl relative z-10 group-hover:border-blue-500/50 transition-colors"
                                />
                                <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-2xl opacity-50 group-hover:opacity-80 transition-opacity"></div>
                            </div>

                            <h1 className="text-3xl font-bold text-white tracking-tight">{profile.name}</h1>
                            <a href={`https://github.com/${username}`} className="text-xl text-gray-400 hover:text-blue-400 transition-colors mb-4 block">@{username}</a>

                            <p className="text-sm text-gray-400 leading-relaxed mb-6">
                                {profile.bio || "No bio available."}
                            </p>

                            <div className="flex flex-wrap gap-2 mb-6 justify-center lg:justify-start">
                                {profile.location && (
                                    <span className="px-3 py-1 rounded-full bg-[#21262d] border border-[#30363d] text-xs flex items-center gap-1.5">
                                        <FaMapMarkerAlt className="text-gray-400" /> {profile.location}
                                    </span>
                                )}
                                {profile.company && (
                                    <span className="px-3 py-1 rounded-full bg-[#21262d] border border-[#30363d] text-xs flex items-center gap-1.5">
                                        <FaBuilding className="text-gray-400" /> {profile.company}
                                    </span>
                                )}
                                {profile.twitter_username && (
                                    <span className="px-3 py-1 rounded-full bg-[#21262d] border border-[#30363d] text-xs flex items-center gap-1.5">
                                        <FaTwitter className="text-blue-400" /> @{profile.twitter_username}
                                    </span>
                                )}
                            </div>

                            <div className="flex gap-6 mb-8 w-full justify-center lg:justify-start border-t border-[#30363d] pt-6">
                                <div className="text-center lg:text-left">
                                    <div className="text-2xl font-bold text-white">{profile.followers}</div>
                                    <div className="text-xs text-gray-500 uppercase tracking-wider">Followers</div>
                                </div>
                                <div className="text-center lg:text-left">
                                    <div className="text-2xl font-bold text-white">{profile.following}</div>
                                    <div className="text-xs text-gray-500 uppercase tracking-wider">Following</div>
                                </div>
                            </div>

                            <a
                                href={`https://github.com/${username}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full py-2.5 rounded-lg bg-[#21262d] border border-[#30363d] hover:bg-[#30363d] hover:border-gray-500 text-white font-medium transition-all text-center flex items-center justify-center gap-2 group"
                            >
                                <FaGithub /> View on GitHub
                                <FaExternalLinkAlt size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                            </a>
                        </div>
                    </div>
                </motion.aside>

                {/* --- Main Content Area --- */}
                <main className="flex-1 min-w-0">

                    {/* Section B: Key Metrics Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <StatCard
                            title="Total Stars"
                            value={repos.reduce((acc, repo) => acc + repo.stargazers_count, 0)}
                            icon={FaStar}
                            color="yellow"
                        />
                        <StatCard
                            title="Total Forks"
                            value={repos.reduce((acc, repo) => acc + repo.forks_count, 0)}
                            icon={FaCodeBranch}
                            color="blue"
                        />
                        <StatCard
                            title="Public Repos"
                            value={profile.public_repos}
                            icon={FaBook}
                            color="green"
                        />
                        <StatCard
                            title="Total Score"
                            value={scores.overall}
                            icon={FaChartLine}
                            color="purple"
                        />
                    </div>

                    {/* Section C: Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="glass-panel p-6"
                        >
                            <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                                <FaCode className="text-blue-400" /> Languages
                            </h3>
                            <div className="h-64 flex items-center justify-center">
                                <Doughnut
                                    data={languageData}
                                    options={{
                                        maintainAspectRatio: false,
                                        plugins: { legend: { position: 'right', labels: { color: '#8b949e', font: { family: 'Inter' } } } },
                                        borderWidth: 0
                                    }}
                                />
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="glass-panel p-6"
                        >
                            <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                                <FaHistory className="text-green-400" /> Activity (Simulated)
                            </h3>
                            <div className="h-64">
                                <Bar
                                    data={activityData}
                                    options={{
                                        maintainAspectRatio: false,
                                        plugins: { legend: { display: false } },
                                        scales: {
                                            y: { grid: { color: '#30363d' }, ticks: { color: '#8b949e' } },
                                            x: { grid: { display: false }, ticks: { color: '#8b949e' } }
                                        }
                                    }}
                                />
                            </div>
                        </motion.div>
                    </div>

                    {/* Section D: Top Repositories */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-white">Top Repositories</h2>
                            {/* Visual sort option mock */}
                            <select className="bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-1 text-sm text-gray-400 focus:outline-none focus:border-blue-500">
                                <option>Most Stars</option>
                                <option>Most Forks</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {repos.map((repo) => (
                                <RepoCard key={repo.id} repo={repo} />
                            ))}
                        </div>
                    </motion.div>

                </main>
            </div>
        </div>
    );
};

export default Results;
