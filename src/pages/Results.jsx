import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaGithub, FaMapMarkerAlt, FaBuilding, FaTwitter, FaUsers, FaArrowLeft, FaExternalLinkAlt, FaStar, FaCodeBranch, FaHistory, FaEye, FaSearch } from 'react-icons/fa';
import axios from 'axios';
import StrengthsPanel from '../components/StrengthsPanel';
import RiskPanel from '../components/RiskPanel';
import TechMatrix from '../components/TechMatrix';
import CodeDNA from '../components/CodeDNA';
import ActivityHeatmap from '../components/ActivityHeatmap';
import SystemStatus from '../components/SystemStatus';
import CommitChart from '../components/CommitChart';

const StatBox = ({ icon: Icon, label, value, color, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
        className="bg-[#0d1117] border border-[#30363d] p-4 rounded-xl flex items-center gap-4 hover:border-blue-500/30 transition-colors group"
    >
        <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform`}>
            <Icon className={color.replace('bg-', 'text-').replace('/10', '')} />
        </div>
        <div>
            <div className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">{label}</div>
            <div className="text-xl font-mono text-white font-bold">{value}</div>
        </div>
    </motion.div>
);

const Results = () => {
    const { username } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const apiUrl = import.meta.env.PROD
                    ? `/api/analyze/${username}`
                    : `http://localhost:3004/api/analyze/${username}`;

                const response = await axios.get(apiUrl);
                setData(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Analysis Error:", err);
                setError(err.response?.data?.error || "Failed to analyze profile. Please try again.");
                setLoading(false);
            }
        };

        if (username) fetchData();
    }, [username]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0b1015] flex flex-col items-center justify-center text-blue-500 font-mono">
                <div className="w-24 h-24 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-8"></div>
                <div className="text-xl tracking-widest animate-pulse">INITIALIZING SCAN...</div>
                <div className="text-xs text-blue-500/50 mt-2">TARGET: {username}</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#0b1015] flex items-center justify-center p-4 relative overflow-hidden">
                {/* Background Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-500/10 rounded-full blur-[100px] pointer-events-none"></div>

                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="glass-panel p-8 max-w-lg w-full text-center border-red-500/30 relative z-10"
                >
                    <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
                        <FaGithub className="text-red-500 text-4xl" />
                    </div>

                    <h2 className="text-3xl font-black text-white mb-2 tracking-tight">User Not Found</h2>
                    <p className="text-gray-400 mb-8 text-lg">
                        We couldn't locate <span className="text-red-400 font-mono font-bold">@{username}</span> on GitHub.
                    </p>

                    <div className="bg-[#0d1117] p-4 rounded-lg border border-[#30363d] mb-8 text-left">
                        <h4 className="text-gray-500 text-xs uppercase tracking-wider font-bold mb-2">Troubleshooting:</h4>
                        <ul className="text-sm text-gray-400 space-y-2 list-disc pl-4">
                            <li>Check for typos (e.g. <span className="text-gray-300">"john-doe"</span> vs <span className="text-gray-300">"johndoe"</span>)</li>
                            <li>Ensure the account is public</li>
                            <li>Verify the username explicitly on github.com</li>
                        </ul>
                    </div>

                    <Link
                        to="/"
                        className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-red-600 hover:bg-red-500 text-white rounded-full font-bold transition-all hover:scale-105 shadow-[0_0_20px_rgba(220,38,38,0.4)] w-full"
                    >
                        <FaSearch /> Search Again
                    </Link>
                </motion.div>
            </div>
        );
    }

    const { profile, scores, repos, events } = data;
    const totalStars = (repos || []).reduce((acc, repo) => acc + (repo.stargazers_count || 0), 0);
    const pushEvents = events ? events.filter(e => e.type === 'PushEvent').length : 0;
    const lastActive = events && events.length > 0
        ? new Date(events[0].created_at).toLocaleDateString()
        : 'N/A';

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
            className="min-h-screen bg-[#0b1015] text-gray-300 font-sans selection:bg-blue-500/30 pt-4 pb-12 px-4 md:px-6 max-w-[1800px] mx-auto overflow-x-hidden"
        >

            <div className="flex flex-col gap-4">
                {/* --- HEADER: Profile Identity & High-Level Metrics --- */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-panel p-5 flex flex-col lg:flex-row items-center lg:items-start justify-between gap-5 border-blue-500/20 relative overflow-hidden"
                >
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none"></div>
                    <div className="flex flex-col md:flex-row items-center gap-5 relative z-10 w-full lg:w-auto">
                        <div className="relative">
                            <img src={profile.avatar} alt={profile.name} className="w-20 h-20 rounded-full border-2 border-blue-500/50 shadow-[0_0_20px_rgba(47,129,247,0.3)]" />
                            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-[#0b1015]"></div>
                        </div>
                        <div className="text-center md:text-left">
                            <div className="flex items-center justify-center md:justify-start gap-3 mb-1">
                                <h1 className="text-2xl font-black text-white tracking-tight">{profile.name}</h1>
                                <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 text-[10px] font-bold tracking-wider border border-blue-500/30">PRO TIER</span>
                            </div>
                            <a href={`https://github.com/${username}`} className="text-blue-400 hover:text-blue-300 font-mono text-sm mb-1 block">@{username}</a>
                            <p className="text-gray-400 text-sm max-w-xl font-light leading-relaxed">{profile.bio || "Full Stack Architect focused on scalable systems."}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 md:gap-6 bg-[#0d1117]/50 p-3 rounded-xl border border-[#30363d] relative z-10 w-full lg:w-auto justify-around lg:justify-end">
                        <div className="text-center px-3">
                            <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Rank</div>
                            <div className="text-xl font-black text-white">
                                TOP {Math.max(100 - scores.overall, 1)}%
                            </div>
                        </div>
                        <div className="w-[1px] h-7 bg-[#30363d]"></div>
                        <div className="text-center px-3">
                            <div className="text-[10px] text-blue-500 uppercase tracking-widest font-bold mb-1 text-glow">Impact</div>
                            <div className="text-xl font-black text-blue-400">{scores.impact}</div>
                        </div>
                        <div className="w-[1px] h-7 bg-[#30363d]"></div>
                        <div className="text-center px-3">
                            <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Followers</div>
                            <div className="text-xl font-black text-white">{profile.followers > 1000 ? (profile.followers / 1000).toFixed(1) + 'k' : profile.followers}</div>
                        </div>
                    </div>
                </motion.div>

                {/* --- STATS GRID (no extra margin, parent gap handles it) --- */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <StatBox icon={FaStar} label="Total Stars" value={totalStars} color="bg-yellow-500/10" delay={0.1} />
                    <StatBox icon={FaCodeBranch} label="Recent Pushes" value={pushEvents} color="bg-blue-500/10" delay={0.15} />
                    <StatBox icon={FaHistory} label="Last Active" value={lastActive} color="bg-green-500/10" delay={0.2} />
                    <StatBox icon={FaEye} label="Analyzed Repos" value={(repos || []).length} color="bg-purple-500/10" delay={0.25} />
                </div>

                {/* --- AI INSIGHTS BANNER --- */}
                {data.ai_insight && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="glass-panel p-4 border-l-4 border-l-purple-500">
                            <div className="flex items-center gap-2 mb-1.5">
                                <span className="bg-purple-500/20 text-purple-400 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse"></span>
                                    AI Recruiter Tip
                                </span>
                            </div>
                            <p className="text-gray-300 text-sm leading-relaxed">"{data.ai_insight.recruiter_tip}"</p>
                        </div>
                        <div className="glass-panel p-4 border-l-4 border-l-green-500">
                            <div className="flex items-center gap-2 mb-1.5">
                                <span className="bg-green-500/20 text-green-400 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
                                    <FaUsers className="text-xs" /> Key Strength
                                </span>
                            </div>
                            <p className="text-gray-300 text-sm leading-relaxed">"{data.ai_insight.key_strength}"</p>
                        </div>
                    </div>
                )}

                {/* --- ROW 1: Strengths | Tech Matrix + Code DNA | Risks --- */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                    <div className="lg:col-span-3">
                        <StrengthsPanel strengths={data.strengths} />
                    </div>
                    <div className="lg:col-span-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
                            <TechMatrix languages={data.languages || {}} />
                            <CodeDNA languages={data.languages || {}} />
                        </div>
                    </div>
                    <div className="lg:col-span-3">
                        <RiskPanel redFlags={data.redFlags} />
                    </div>
                </div>

                {/* --- ROW 2: Commit Chart + Activity Signal (full width) --- */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="h-[280px]">
                        <CommitChart events={data.events || []} />
                    </div>
                    <div className="h-[280px]">
                        <ActivityHeatmap events={data.events || []} />
                    </div>
                </div>

                {/* --- RECRUITER FEEDBACK SECTION --- */}
                {data.recommendations && data.recommendations.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                    >
                        {data.recommendations.map((rec, index) => (
                            <div key={index} className={`glass-panel p-4 border-l-4 ${rec.type === 'critical' ? 'border-l-red-500' : rec.type === 'warning' ? 'border-l-yellow-500' : 'border-l-blue-500'}`}>
                                <h4 className={`font-bold text-sm mb-1.5 uppercase tracking-wider ${rec.type === 'critical' ? 'text-red-400' : rec.type === 'warning' ? 'text-yellow-400' : 'text-blue-400'}`}>
                                    {rec.title}
                                </h4>
                                <p className="text-sm text-gray-400 leading-relaxed">{rec.text}</p>
                            </div>
                        ))}
                    </motion.div>
                )}
            </div>

            <SystemStatus />
        </motion.div>
    );
};

export default Results;
