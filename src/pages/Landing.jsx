
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGithub, FaArrowRight, FaSearch, FaCode, FaChartPie, FaLightbulb, FaRocket, FaShieldAlt, FaMagic, FaCheckCircle } from 'react-icons/fa';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

// --- Components ---

const FloatingElement = ({ children, delay = 0, xOffset = 50, yOffset = 50 }) => (
    <motion.div
        animate={{
            y: [0, yOffset, 0],
            x: [0, xOffset, 0],
            rotate: [0, 5, -5, 0],
        }}
        transition={{
            duration: 10 + Math.random() * 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: delay
        }}
        className="absolute pointer-events-none z-0 opacity-20 hover:opacity-40 transition-opacity duration-500"
    >
        {children}
    </motion.div>
);

const TypewriterText = ({ text, delay = 0 }) => {
    const letters = Array.from(text);
    const container = {
        hidden: { opacity: 0 },
        visible: (i = 1) => ({
            opacity: 1,
            transition: { staggerChildren: 0.05, delayChildren: delay * 0.1 },
        }),
    };
    const child = {
        visible: { opacity: 1, y: 0 },
        hidden: { opacity: 0, y: 20 },
    };

    return (
        <motion.span
            variants={container}
            initial="hidden"
            animate="visible"
            className="inline-block"
        >
            {letters.map((letter, index) => (
                <motion.span variants={child} key={index} className="inline-block">
                    {letter === " " ? "\u00A0" : letter}
                </motion.span>
            ))}
        </motion.span>
    );
};

const FeatureCard = ({ icon: Icon, title, desc, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ delay, duration: 0.5, ease: "easeOut" }}
        whileHover={{ y: -8, boxShadow: "0 20px 40px -20px rgba(59,130,246,0.3)" }}
        className="p-8 rounded-3xl bg-white/5 border border-white/5 backdrop-blur-md hover:bg-white/10 hover:border-blue-500/30 transition-all duration-300 group"
    >
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-white/5">
            <Icon className="text-blue-400 group-hover:text-white transition-colors" size={28} />
        </div>
        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">{title}</h3>
        <p className="text-gray-400 leading-relaxed text-sm font-light">{desc}</p>
    </motion.div>
);

const StepCard = ({ number, title, desc }) => (
    <motion.div
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="flex gap-8 items-start relative pb-16 last:pb-0 group"
    >
        {/* Connecting Line */}
        <div className="absolute left-[23px] top-12 bottom-0 w-[2px] bg-gradient-to-b from-blue-500/50 to-transparent last:hidden"></div>

        <div className="w-12 h-12 rounded-full bg-[#0d1117] border-2 border-blue-500 flex items-center justify-center font-bold text-lg text-white shrink-0 shadow-[0_0_20px_rgba(59,130,246,0.5)] z-10 group-hover:scale-110 transition-transform duration-300">
            {number}
        </div>
        <div className="pt-1">
            <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
            <p className="text-gray-400 leading-relaxed text-lg font-light">{desc}</p>
        </div>
    </motion.div>
);

// --- Main Landing Page ---

const Landing = () => {
    const [username, setUsername] = useState('');
    const navigate = useNavigate();
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (username.trim()) {
            navigate(`/analyze/${username}`);
        }
    };

    return (
        <div className="min-h-screen flex flex-col relative overflow-hidden bg-[#050505] text-white font-sans selection:bg-blue-500/30">

            {/* Progress Bar */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 origin-left z-50"
                style={{ scaleX }}
            />

            {/* Dynamic Background with Floating Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none fixed">
                {/* Animated Orbs */}
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.3, 0.15] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[-20%] left-[-20%] w-[70vw] h-[70vw] bg-blue-600/10 blur-[150px] rounded-full mix-blend-screen"
                />
                <motion.div
                    animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.2, 0.1] }}
                    transition={{ duration: 18, repeat: Infinity, delay: 2, ease: "easeInOut" }}
                    className="absolute bottom-[-20%] right-[-20%] w-[70vw] h-[70vw] bg-purple-600/10 blur-[150px] rounded-full mix-blend-screen"
                />

                {/* Floating Code Snippets */}
                <FloatingElement delay={0} xOffset={-40} yOffset={60}>
                    <div className="top-[15%] left-[5%] font-mono text-xs text-blue-400/20 bg-black/40 p-3 rounded-lg border border-blue-500/10 backdrop-blur-sm shadow-xl">
                        git commit -m "feat: initial commit"
                    </div>
                </FloatingElement>
                <FloatingElement delay={3} xOffset={50} yOffset={-40}>
                    <div className="top-[25%] right-[10%] font-mono text-xs text-green-400/20 bg-black/40 p-3 rounded-lg border border-green-500/10 backdrop-blur-sm shadow-xl">
                        npm install react-framer-motion
                    </div>
                </FloatingElement>
                <FloatingElement delay={5} xOffset={-30} yOffset={-60}>
                    <div className="bottom-[20%] left-[15%] font-mono text-xs text-purple-400/20 bg-black/40 p-3 rounded-lg border border-purple-500/10 backdrop-blur-sm shadow-xl">
                        const score = analyze(repo);
                    </div>
                </FloatingElement>
            </div>

            {/* Hero Section */}
            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 w-full max-w-7xl mx-auto pt-20">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="text-center max-w-5xl mx-auto"
                >
                    {/* Logo Icon */}
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                        className="w-24 h-24 bg-gradient-to-br from-[#161b22] to-black rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-2xl border border-white/10 relative group"
                    >
                        <div className="absolute inset-0 bg-blue-500/30 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        <FaGithub size={56} className="text-white relative z-10 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]" />
                    </motion.div>

                    {/* Headline */}
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 tracking-tight leading-[1.05]">
                        <span className="block text-white mb-2 drop-shadow-lg">GitHub Profile</span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-gradient-x pb-4">
                            <TypewriterText text="Analyzer" delay={5} />
                        </span>
                    </h1>

                    {/* Subheadline */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2, duration: 0.8 }}
                        className="text-xl md:text-2xl text-gray-400 mb-14 max-w-2xl mx-auto leading-relaxed font-light"
                    >
                        Turn your code into <span className="text-white font-medium border-b border-blue-500/50">career proof</span>.
                        Get recruiter-level insights and actionable feedback in seconds.
                    </motion.p>

                    {/* Interaction Area */}
                    <motion.form
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.5, duration: 0.6 }}
                        onSubmit={handleSubmit}
                        className="w-full max-w-xl mx-auto relative group z-50 mb-24"
                    >
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl blur-lg opacity-40 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 animate-pulse"></div>

                        <div className="relative flex items-center bg-[#0d1117]/80 backdrop-blur-xl rounded-2xl p-2 border border-white/10 shadow-2xl transition-all transform hover:scale-[1.01] hover:border-white/30">
                            <FaSearch className="text-gray-500 ml-5 group-focus-within:text-blue-400 transition-colors" size={22} />

                            <input
                                type="text"
                                placeholder="github.com/username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value.replace('https://github.com/', ''))}
                                className="bg-transparent border-none text-white text-xl w-full px-5 py-5 focus:ring-0 placeholder-gray-600 font-light"
                                autoFocus
                            />

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                type="submit"
                                className="bg-gradient-to-r from-[#238636] to-[#2ea043] hover:from-[#2ea043] hover:to-[#3fb950] text-white px-8 py-4 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(46,160,67,0.4)] hover:shadow-[0_0_30px_rgba(46,160,67,0.6)] flex items-center gap-3 whitespace-nowrap overflow-hidden relative"
                            >
                                <motion.span>Analyze</motion.span>
                                <FaArrowRight />
                                <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 group-hover:animate-shine" />
                            </motion.button>
                        </div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 2 }}
                            className="flex justify-center gap-6 mt-6 text-sm text-gray-500 font-medium tracking-wide"
                        >
                            <span>Try popular profiles:</span>
                            {['torvalds', 'sindresorhus', 'shadcn'].map((user) => (
                                <button
                                    key={user}
                                    type="button"
                                    onClick={() => setUsername(user)}
                                    className="text-blue-400 hover:text-blue-300 transition-all hover:scale-105 active:scale-95 hover:underline decoration-blue-500/30 underline-offset-4"
                                >
                                    {user}
                                </button>
                            ))}
                        </motion.div>
                    </motion.form>
                </motion.div>
            </div>

            {/* Features Grid Section */}
            <section className="relative z-10 py-32 bg-[#0d1117]/30 border-t border-white/5">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-20"
                    >
                        <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">Why Analyze?</h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto font-light">Stand out in a competitive job market with data-driven insights.</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={FaChartPie}
                            title="Smart Scoring v2.0"
                            desc="Our advanced algorithm evaluates 6 key dimensions including code structure, documentation quality, and community impact."
                            delay={0}
                        />
                        <FeatureCard
                            icon={FaLightbulb}
                            title="Actionable Feedback"
                            desc="Don't just get a score. Get a todo list. We tell you exactly what to fix to impress recruiters."
                            delay={0.1}
                        />
                        <FeatureCard
                            icon={FaRocket}
                            title="Recruiter Vision"
                            desc="See your profile through the lens of a hiring manager. Spot red flags before they do."
                            delay={0.2}
                        />
                        <FeatureCard
                            icon={FaShieldAlt}
                            title="Private & Secure"
                            desc="We only analyze public data. Your code remains yours. No data is stored permanently."
                            delay={0.3}
                        />
                        <FeatureCard
                            icon={FaCode}
                            title="Code Quality Check"
                            desc="We check for best practices, language diversity, and project organization consistency."
                            delay={0.4}
                        />
                        <FeatureCard
                            icon={FaMagic}
                            title="Instant Results"
                            desc="Stop guessing. Get a comprehensive report in seconds with our optimized analysis engine."
                            delay={0.5}
                        />
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="relative z-10 py-32 bg-gradient-to-b from-transparent to-[#0d1117]">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row gap-16 items-start">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="md:w-1/3 sticky top-32"
                    >
                        <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tight leading-tight">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">How It Works</span>
                        </h2>
                        <p className="text-gray-400 text-lg leading-relaxed mb-8">
                            Three simple steps to level up your engineering portfolio. Our process is designed to be fast, accurate, and insightful.
                        </p>
                        <div className="p-6 rounded-2xl bg-blue-500/10 border border-blue-500/20 backdrop-blur-sm">
                            <FaCheckCircle className="text-blue-400 mb-3" size={24} />
                            <p className="text-blue-200 text-sm font-medium">Trusted by developers worldwide to improve their job prospects.</p>
                        </div>
                    </motion.div>

                    <div className="md:w-2/3 max-w-2xl">
                        <StepCard
                            number="1"
                            title="Enter Username"
                            desc="Simply type in any GitHub username. No login or authorization required for public analysis. We respect your privacy."
                        />
                        <StepCard
                            number="2"
                            title="Deep System Scan"
                            desc="Our engine fetches repositories, commits, and activity data using the GitHub API in real-time, parsing thousands of data points."
                        />
                        <StepCard
                            number="3"
                            title="Get Strategic Insights"
                            desc="Receive a detailed breakdown of your strengths, weaknesses, and a checklist for improvement. Export and share your results."
                        />
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 py-16 border-t border-white/5 bg-[#020408]">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex flex-col items-center md:items-start gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/10 rounded-lg">
                                <FaGithub size={20} className="text-white" />
                            </div>
                            <span className="font-bold text-2xl tracking-tight">Analyzer</span>
                        </div>
                        <p className="text-gray-500 text-sm max-w-xs text-center md:text-left">
                            Empowering developers to build better portfolios and land their dream jobs.
                        </p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-8 text-sm font-medium">
                        <a href="#" className="text-gray-400 hover:text-white transition-colors hover:underline">Features</a>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors hover:underline">Pricing</a>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors hover:underline">Blog</a>
                    </div>

                    <div className="flex gap-6">
                        <a href="#" className="text-gray-500 hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="text-gray-500 hover:text-white transition-colors">Terms of Service</a>
                    </div>
                </div>
                <div className="text-center mt-12 text-gray-600 text-xs">
                    © 2026 GitHub Portfolio Analyzer. Built with ❤️ for the dev community.
                </div>
            </footer>

        </div>
    );
};

export default Landing;
