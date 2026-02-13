
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaBook, FaCode, FaChartLine, FaSitemap, FaGlobe, FaLayerGroup,
    FaArrowLeft, FaMapMarkerAlt, FaUsers, FaKey, FaGithub,
    FaExternalLinkAlt, FaLightbulb, FaCheckCircle, FaExclamationTriangle
} from 'react-icons/fa';
import axios from 'axios';

import LoadingScreen from '../components/LoadingScreen';
import ScoreGauge from '../components/ScoreGauge';
import DimensionCard from '../components/DimensionCard';
import RepoCard from '../components/RepoCard';
import RecommendationCard from '../components/RecommendationCard';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { type: "spring", stiffness: 50, damping: 20 }
    }
};

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
                    // Safely handle error object to prevent React #31
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
            <AnimatePresence>
                {showApiKeyTip && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="fixed bottom-8 left-1/2 -translate-x-1/2 glass-panel px-6 py-3 flex items-center gap-3 text-sm text-gray-300 z-50 border-blue-500/30"
                    >
                        <FaKey className="text-blue-400" />
                        <span>Tip: Add <strong>GITHUB_TOKEN</strong> to .env for 50x faster analysis.</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );

    if (error) return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-panel p-8 max-w-md border-rose-500/30"
            >
                <h2 className="text-3xl font-bold text-rose-500 mb-4">Profile Not Found</h2>
                <p className="text-gray-400 mb-6">{error}</p>
                <Link to="/" className="btn-primary w-full shadow-lg shadow-rose-900/20 bg-rose-600 hover:bg-rose-500">Try Another Profile</Link>
            </motion.div>
        </div>
    );

    const { profile, scores, repos, recommendations } = data;

    return (
        <motion.div
            className="max-w-7xl mx-auto p-4 md:p-8 pb-32"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <Link to="/" className="inline-flex items-center text-gray-500 hover:text-white mb-8 transition group">
                <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Search
            </Link>

            {/* Header Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
                <motion.div variants={itemVariants} className="lg:col-span-2 glass-panel p-8 flex flex-col md:flex-row items-center md:items-start gap-8 relative overflow-hidden group">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-500/10 transition-colors duration-700"></div>

                    <motion.div
                        whileHover={{ scale: 1.05, rotate: 2 }}
                        className="relative"
                    >
                        <img
                            src={profile.avatar}
                            alt={profile.name}
                            className="w-32 h-32 rounded-full border-4 border-gray-800 shadow-2xl relative z-10"
                        />
                        <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-xl"></div>
                    </motion.div>

                    <div className="text-center md:text-left relative z-10 w-full">
                        <h1 className="text-4xl font-bold mb-1 tracking-tight text-white">{profile.name}</h1>
                        <a
                            href={`https://github.com/${username}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xl text-blue-400 hover:text-blue-300 flex items-center justify-center md:justify-start gap-2 mb-4 group/link"
                        >
                            @{username}
                            <FaExternalLinkAlt size={12} className="opacity-0 group-hover/link:opacity-100 transition-opacity translate-y-[1px]" />
                        </a>

                        <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-400 font-medium">
                            {profile.location && (
                                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/5 backdrop-blur-md">
                                    <FaMapMarkerAlt className="text-rose-400" /> {profile.location}
                                </span>
                            )}
                            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/5 backdrop-blur-md">
                                <FaUsers className="text-amber-400" /> <strong className="text-white">{profile.followers}</strong> followers
                            </span>
                            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/5 backdrop-blur-md">
                                <FaBook className="text-emerald-400" /> <strong className="text-white">{profile.public_repos}</strong> repos
                            </span>
                        </div>
                        {profile.bio && <p className="mt-4 text-gray-300 leading-relaxed max-w-2xl font-light">{profile.bio}</p>}
                    </div>
                </motion.div>

                <motion.div variants={itemVariants} className="glass-panel p-8 flex items-center justify-center flex-col relative overflow-hidden border-t-4 border-t-purple-500/50">
                    <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent pointer-events-none"></div>
                    <h3 className="text-gray-400 font-semibold mb-6 uppercase tracking-widest text-xs">Portfolio Score</h3>
                    <ScoreGauge score={scores.overall} />
                </motion.div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Dimensions */}
                <div className="space-y-6">
                    <motion.h2 variants={itemVariants} className="text-xl font-bold text-gray-200 flex items-center gap-2">
                        <FaChartLine className="text-blue-400" /> Performance
                    </motion.h2>
                    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
                        <DimensionCard
                            title="Documentation"
                            score={scores.breakdown.documentation}
                            icon={FaBook}
                            description="README quality & wiki presence."
                        />
                        <DimensionCard
                            title="Code Structure"
                            score={scores.breakdown.codeStructure}
                            icon={FaCode}
                            description="Project layout & naming."
                        />
                        <DimensionCard
                            title="Activity"
                            score={scores.breakdown.activity}
                            icon={FaChartLine}
                            description="Commit consistency."
                        />
                        <DimensionCard
                            title="Organization"
                            score={scores.breakdown.organization}
                            icon={FaSitemap}
                            description="Profile completeness."
                        />
                        <DimensionCard
                            title="Impact"
                            score={scores.breakdown.impact}
                            icon={FaGlobe}
                            description="Community engagement."
                        />
                        <DimensionCard
                            title="Technical"
                            score={scores.breakdown.technical}
                            icon={FaLayerGroup}
                            description="Tech stack diversity."
                        />
                    </motion.div>
                </div>

                {/* Right Column: Recommendations & Repos */}
                <div className="lg:col-span-2 space-y-10">

                    {/* Recommendations */}
                    <motion.div variants={itemVariants}>
                        <h2 className="text-xl font-bold mb-6 text-gray-200 flex items-center gap-2">
                            <FaLightbulb className="text-amber-400" /> Recruiter Feedback
                        </h2>
                        <div className="grid gap-4">
                            {recommendations.length > 0 ? (
                                recommendations.map((rec, i) => (
                                    <RecommendationCard key={i} {...rec} />
                                ))
                            ) : (
                                <div className="glass-panel p-8 text-center border-t-4 border-t-emerald-500">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4"
                                    >
                                        <FaCheckCircle className="text-emerald-500" size={32} />
                                    </motion.div>
                                    <h3 className="text-xl font-bold text-white mb-2">Outstanding Profile!</h3>
                                    <p className="text-gray-400">We couldn't find any major red flags. You are ready to apply.</p>
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Repository Analysis */}
                    <motion.div variants={itemVariants}>
                        <h2 className="text-xl font-bold mb-6 text-gray-200 flex items-center gap-2">
                            <FaGithub className="text-white" /> Top Repositories
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {repos.map((repo, i) => (
                                <motion.div
                                    key={repo.name}
                                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    transition={{ delay: 0.4 + (i * 0.1) }}
                                    className="h-full"
                                >
                                    <RepoCard repo={repo} />
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                </div>
            </div>
        </motion.div>
    );
};

export default Results;
