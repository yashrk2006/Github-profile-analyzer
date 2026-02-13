import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaGithub, FaMapMarkerAlt, FaBuilding, FaTwitter, FaUsers, FaArrowLeft, FaExternalLinkAlt } from 'react-icons/fa';
import axios from 'axios';
import StrengthsPanel from '../components/StrengthsPanel';
import RiskPanel from '../components/RiskPanel';
import TechMatrix from '../components/TechMatrix';
import CodeDNA from '../components/CodeDNA';
import ActivityHeatmap from '../components/ActivityHeatmap';
import SystemStatus from '../components/SystemStatus';

const Results = () => {
    const { username } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Determine API URL based on environment
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
            <div className="min-h-screen bg-[#0b1015] flex items-center justify-center p-4">
                <div className="glass-panel p-8 max-w-lg w-full text-center border-red-500/30">
                    <h2 className="text-2xl font-bold text-red-500 mb-4">Scan Failed</h2>
                    <p className="text-gray-400 mb-6">{error}</p>
                    <Link to="/" className="text-blue-400 hover:text-blue-300 flex items-center justify-center gap-2">
                        <FaArrowLeft /> Return to Base
                    </Link>
                </div>
            </div>
        );
    }

    const { profile, scores } = data;

    return (
        <div className="min-h-screen bg-[#0b1015] text-gray-300 font-sans selection:bg-blue-500/30 pt-6 pb-20 px-4 md:px-6 max-w-[1800px] mx-auto overflow-x-hidden">

            <div className="flex flex-col gap-6">
                {/* --- HEADER: Profile Identity & High-Level Metrics --- */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-panel p-6 flex flex-col lg:flex-row items-center lg:items-start justify-between gap-6 border-blue-500/20 relative overflow-hidden"
                >
                    {/* Background Glow */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none"></div>

                    {/* Left: Identity */}
                    <div className="flex flex-col md:flex-row items-center gap-6 relative z-10 w-full lg:w-auto">
                        <div className="relative">
                            <img
                                src={profile.avatar}
                                alt={profile.name}
                                className="w-24 h-24 rounded-full border-2 border-blue-500/50 shadow-[0_0_20px_rgba(47,129,247,0.3)]"
                            />
                            <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-[#0b1015] shadow-lg"></div>
                        </div>
                        <div className="text-center md:text-left">
                            <div className="flex items-center justify-center md:justify-start gap-3 mb-1">
                                <h1 className="text-3xl font-black text-white tracking-tight">{profile.name}</h1>
                                <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 text-[10px] font-bold tracking-wider border border-blue-500/30">PRO TIER</span>
                            </div>
                            <a href={`https://github.com/${username}`} className="text-blue-400 hover:text-blue-300 font-mono text-sm mb-2 block">@{username}</a>
                            <p className="text-gray-400 text-sm max-w-xl font-light leading-relaxed">
                                {profile.bio || "Full Stack Architect focused on scalable systems."}
                            </p>
                        </div>
                    </div>

                    {/* Right: Key Metrics (Rank, Impact, Followers) - FUI Style */}
                    <div className="flex items-center gap-1 md:gap-8 bg-[#0d1117]/50 p-4 rounded-xl border border-[#30363d] relative z-10 w-full lg:w-auto justify-around lg:justify-end shadow-inner">
                        <div className="text-center px-4">
                            <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Rank</div>
                            <div className="text-2xl font-black text-white">TOP {scores.overall > 90 ? '1%' : scores.overall > 80 ? '5%' : '10%'}</div>
                        </div>
                        <div className="w-[1px] h-8 bg-[#30363d]"></div>
                        <div className="text-center px-4">
                            <div className="text-[10px] text-blue-500 uppercase tracking-widest font-bold mb-1 text-glow">Impact</div>
                            <div className="text-2xl font-black text-blue-400">{scores.impact}</div>
                        </div>
                        <div className="w-[1px] h-8 bg-[#30363d]"></div>
                        <div className="text-center px-4">
                            <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Followers</div>
                            <div className="text-2xl font-black text-white">{profile.followers > 1000 ? (profile.followers / 1000).toFixed(1) + 'k' : profile.followers}</div>
                        </div>
                    </div>
                </motion.div>

                {/* --- COMMAND CENTER: 3-Column Grid --- */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto">

                    {/* LEFT FLANK: Strengths (Span 3) */}
                    <div className="lg:col-span-3 h-full">
                        <StrengthsPanel strengths={data.strengths} />
                    </div>

                    {/* CENTER STAGE: Charts & Matrix (Span 6) */}
                    <div className="lg:col-span-6 flex flex-col gap-6 h-full">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[320px]">
                            <TechMatrix languages={data.languages || {}} />
                            <CodeDNA languages={data.languages || {}} />
                        </div>
                        <div className="h-48">
                            <ActivityHeatmap events={data.events || []} />
                        </div>
                    </div>

                    {/* RIGHT FLANK: Risks (Span 3) */}
                    <div className="lg:col-span-3 h-full">
                        <RiskPanel redFlags={data.redFlags} />
                    </div>
                </div>

                {/* --- RECRUITER FEEDBACK SECTION --- */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {data.recommendations && data.recommendations.map((rec, index) => (
                        <div key={index} className={`glass-panel p-5 border-l-4 ${rec.type === 'critical' ? 'border-l-red-500' : rec.type === 'warning' ? 'border-l-yellow-500' : 'border-l-blue-500'} relative overflow-hidden`}>
                            <h4 className={`font-bold text-sm mb-2 uppercase tracking-wider ${rec.type === 'critical' ? 'text-red-400' : rec.type === 'warning' ? 'text-yellow-400' : 'text-blue-400'}`}>
                                {rec.title}
                            </h4>
                            <p className="text-sm text-gray-400 leading-relaxed">
                                {rec.text}
                            </p>
                        </div>
                    ))}
                </motion.div>
            </div>

            <SystemStatus />
        </div>
    );
};

export default Results;
