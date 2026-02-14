import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaGithub, FaMapMarkerAlt, FaBuilding, FaTwitter, FaUsers, FaArrowLeft, FaExternalLinkAlt, FaStar, FaCodeBranch, FaHistory, FaEye, FaSearch, FaLightbulb } from 'react-icons/fa';
import axios from 'axios';
import StrengthsPanel from '../components/StrengthsPanel';
import RiskPanel from '../components/RiskPanel';
import TechMatrix from '../components/TechMatrix';
import CodeDNA from '../components/CodeDNA';
import ActivityHeatmap from '../components/ActivityHeatmap';
import SystemStatus from '../components/SystemStatus';
import CommitChart from '../components/CommitChart';
import { InteractiveHoverButton } from '../components/ui/interactive-hover-button';
import { BorderBeam } from '../components/ui/border-beam';

const StatBox = ({ icon: Icon, label, value, color, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.5 }}
        className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 hover:border-blue-500/30 transition-all duration-300 group hover:-translate-y-1 hover:shadow-lg"
    >
        <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${color.replace('text-', 'bg-')}/10 group-hover:scale-110 transition-transform duration-300`}>
                <Icon className={`text-2xl ${color}`} />
            </div>
            <div>
                <div className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">{label}</div>
                <div className="text-2xl font-bold text-white tracking-tight">{value}</div>
            </div>
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

    // --- Terminal Loading Component ---
    const TerminalLoading = () => {
        const [lines, setLines] = useState([]);
        const steps = [
            "Initializing connection to GitHub API...",
            `Targeting user: ${username}...`,
            "Fetching public repositories...",
            "Analyzing commit history...",
            "Calculating code quality metrics...",
            "Generating profile insights...",
            "Finalizing report..."
        ];

        useEffect(() => {
            let delay = 0;
            steps.forEach((step, index) => {
                setTimeout(() => {
                    setLines(prev => [...prev, step]);
                }, delay);
                delay += 800; // Add delay between steps
            });
        }, []);

        return (
            <div className="min-h-screen bg-[#0b1015] flex items-center justify-center p-6 font-mono">
                <div className="w-full max-w-lg bg-[#0d1117] rounded-lg border border-[#30363d] shadow-2xl overflow-hidden">
                    <div className="bg-[#161b22] px-4 py-2 border-b border-[#30363d] flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="ml-2 text-xs text-gray-400">analysis_tool.exe</span>
                    </div>
                    <div className="p-6 h-64 overflow-y-auto custom-scrollbar">
                        {lines.map((line, i) => (
                            <div key={i} className="text-green-400 text-sm mb-2 font-mono">
                                <span className="text-blue-400 mr-2">➜</span>
                                {line}
                            </div>
                        ))}
                        <div className="text-green-400 text-sm animate-pulse">
                            <span className="text-blue-400 mr-2">➜</span>
                            _<span className="opacity-0">_</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    if (loading) return <TerminalLoading />;

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

                    <Link to="/">
                        <InteractiveHoverButton
                            text="Search Again"
                            className="w-full bg-red-600 hover:bg-red-500 border-red-500 text-white"
                            dotColor="bg-white"
                        />
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
        <div className="min-h-screen bg-[#050505] text-white selection:bg-blue-500/30 font-sans">
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/5 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/5 blur-[120px]" />
            </div>

            <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-16 relative p-8 rounded-3xl bg-white/5 border border-white/10 overflow-hidden"
                >
                    <BorderBeam size={250} duration={12} delay={9} />
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
                    <div className="flex flex-col gap-3 w-full lg:w-auto">
                        <div className="flex items-center gap-1 md:gap-6 bg-[#0d1117]/50 p-3 rounded-xl border border-[#30363d] relative z-10 w-full justify-around lg:justify-end">
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
                        <Link to="/" className="w-full">
                            <InteractiveHoverButton
                                text="New Scan"
                                className="w-full border-blue-500/30 hover:border-blue-500"
                                dotColor="bg-blue-500"
                            />
                        </Link>
                    </div>
                </motion.div>

                {/* --- STRATEGIC RECOMMENDATIONS (PRIORITY) --- */}
                {data.recommendations && data.recommendations.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mb-12"
                    >
                        <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-2">
                            <span className="w-2 h-8 bg-blue-500 rounded-full"></span>
                            Strategic Recommendations
                            <span className="text-sm font-normal text-gray-500 ml-2 border border-gray-700 px-2 py-0.5 rounded-full">High Priority</span>
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {data.recommendations.map((rec, index) => (
                                <div key={index} className={`relative group p-6 rounded-2xl bg-[#0d1117] border border-white/5 hover:border-white/10 transition-all duration-300 hover:-translate-y-1 shadow-lg overflow-hidden`}>
                                    {/* Gradient Glow based on type */}
                                    <div className={`absolute top-0 left-0 w-full h-1 opacity-50 ${rec.type === 'critical' ? 'bg-gradient-to-r from-red-500 to-orange-500' : rec.type === 'warning' ? 'bg-gradient-to-r from-yellow-500 to-orange-500' : 'bg-gradient-to-r from-blue-500 to-cyan-500'}`}></div>

                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`p-2 rounded-lg ${rec.type === 'critical' ? 'bg-red-500/10 text-red-400' : rec.type === 'warning' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-blue-500/10 text-blue-400'}`}>
                                            {rec.type === 'critical' ? <FaExternalLinkAlt size={16} /> : rec.type === 'warning' ? <FaHistory size={16} /> : <FaLightbulb size={16} />}
                                        </div>
                                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-white/5 ${rec.type === 'critical' ? 'text-red-400' : rec.type === 'warning' ? 'text-yellow-400' : 'text-blue-400'}`}>
                                            {rec.type}
                                        </span>
                                    </div>

                                    <h3 className="font-bold text-lg text-white mb-2 group-hover:text-blue-200 transition-colors">
                                        {rec.title}
                                    </h3>
                                    <p className="text-sm text-gray-400 leading-relaxed font-light">
                                        {rec.text}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* --- STATS GRID --- */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
                    <StatBox icon={FaStar} label="Total Stars" value={totalStars} color="bg-yellow-500/10" delay={0.1} />
                    <StatBox icon={FaCodeBranch} label="Recent Pushes" value={pushEvents} color="bg-blue-500/10" delay={0.15} />
                    <StatBox icon={FaHistory} label="Last Active" value={lastActive} color="bg-green-500/10" delay={0.2} />
                    <StatBox icon={FaEye} label="Analyzed Repos" value={(repos || []).length} color="bg-purple-500/10" delay={0.25} />
                </div>

                {/* --- AI INSIGHTS BANNER --- */}
                {data.ai_insight && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <div className="glass-panel p-6 border-l-4 border-l-purple-500">
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
                {/* --- MAIN DASHBOARD GRID (2x2 Layout) --- */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: { opacity: 0 },
                        visible: {
                            opacity: 1,
                            transition: {
                                staggerChildren: 0.15
                            }
                        }
                    }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
                >
                    {/* Row 1: Core Strengths & Risk Analysis */}
                    <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="h-full">
                        <StrengthsPanel strengths={data.strengths} />
                    </motion.div>
                    <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="h-full">
                        <RiskPanel redFlags={data.redFlags} />
                    </motion.div>

                    {/* Row 2: Tech Matrix & Code DNA */}
                    <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="h-full">
                        <TechMatrix languages={data.languages || {}} />
                    </motion.div>
                    <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="h-full">
                        <CodeDNA languages={data.languages || {}} />
                    </motion.div>
                </motion.div>

                {/* --- ROW 2: Commit Chart + Activity Signal (full width) --- */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <div className="h-[320px]">
                        <CommitChart events={data.events || []} />
                    </div>
                    <div className="h-[320px]">
                        <ActivityHeatmap events={data.events || []} contributionCalendar={data.contributionCalendar} />
                    </div>
                </div>


            </div>

            <SystemStatus />
        </div>
    );
};

export default Results;
