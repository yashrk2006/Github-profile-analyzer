import React from 'react';
import { motion } from 'framer-motion';
import { FaShieldAlt, FaLock, FaUserSecret, FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-blue-500/30 py-20 px-6 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-4xl mx-auto relative z-10">
                <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group">
                    <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
                            <FaShieldAlt className="text-blue-400 text-2xl" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                            Privacy Policy
                        </h1>
                    </div>

                    <p className="text-gray-400 text-lg mb-12 leading-relaxed">
                        Last updated: {new Date().toLocaleDateString()}
                    </p>

                    <div className="space-y-12">
                        <div className="p-8 rounded-2xl bg-[#0d1117] border border-white/5 hover:border-blue-500/20 transition-colors">
                            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                                <FaShieldAlt className="text-blue-500/50" size={20} />
                                1. Introduction
                            </h2>
                            <div className="text-gray-300 leading-relaxed font-light">
                                <p>
                                    Welcome to GitHub Portfolio Analyzer. We respect your privacy and are committed to protecting your personal data.
                                    This privacy policy will inform you as to how we look after your data when you visit our website using the GitHub API
                                    and tell you about your privacy rights.
                                </p>
                            </div>
                        </div>

                        <div className="p-8 rounded-2xl bg-[#0d1117] border border-white/5 hover:border-blue-500/20 transition-colors">
                            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                                <FaUserSecret className="text-blue-500/50" size={20} />
                                2. Data We Collect
                            </h2>
                            <div className="text-gray-300 leading-relaxed font-light">
                                <p>
                                    We currently only access <strong>public</strong> data available through the GitHub API. This includes:
                                </p>
                                <ul className="list-disc pl-6 mt-4 space-y-2 text-gray-400">
                                    <li>Public repositories code and metadata.</li>
                                    <li>Commit history and contribution activity.</li>
                                    <li>Public profile information (username, bio, followers).</li>
                                </ul>
                                <p className="mt-4">
                                    We <strong>DO NOT</strong> request or store OAuth tokens for private repository access at this time.
                                    We <strong>DO NOT</strong> store your source code permanently on our servers. The analysis happens in real-time.
                                </p>
                            </div>
                        </div>

                        <div className="p-8 rounded-2xl bg-[#0d1117] border border-white/5 hover:border-blue-500/20 transition-colors">
                            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                                <FaLock className="text-blue-500/50" size={20} />
                                3. How We Use Your Data
                            </h2>
                            <div className="text-gray-300 leading-relaxed font-light">
                                <p>
                                    The data we collect is used solely for the purpose of:
                                </p>
                                <ul className="list-disc pl-6 mt-4 space-y-2 text-gray-400">
                                    <li>Generating your portfolio analysis report.</li>
                                    <li>Calculating scores for code quality, community impact, and activity.</li>
                                    <li>Providing actionable recommendations to improve your profile.</li>
                                </ul>
                                <p className="mt-4">
                                    Once the analysis session is closed, the data is flushed from our temporary memory.
                                </p>
                            </div>
                        </div>

                        <div className="p-8 rounded-2xl bg-[#0d1117] border border-white/5 hover:border-blue-500/20 transition-colors">
                            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                                4. Third-Party Services
                            </h2>
                            <div className="text-gray-300 leading-relaxed font-light">
                                <p>
                                    We use the following third-party services:
                                </p>
                                <ul className="list-disc pl-6 mt-4 space-y-2 text-gray-400">
                                    <li><strong>GitHub API:</strong> To fetch public repository data.</li>
                                    <li><strong>Google Gemini AI:</strong> To generate natural language insights and code reviews. (No personal identifier is shared deeper than necessary).</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="mt-16 pt-8 border-t border-white/10 text-center text-gray-500">
                        <p>If you have any questions about this privacy policy, please contact us via GitHub.</p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
