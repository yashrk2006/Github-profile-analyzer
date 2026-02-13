import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGithub, FaArrowRight, FaSearch } from 'react-icons/fa';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';

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

// --- Main Landing Page ---

const Landing = () => {
    const [username, setUsername] = useState('');
    const navigate = useNavigate();
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const y2 = useTransform(scrollY, [0, 500], [0, -150]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (username.trim()) {
            navigate(`/analyze/${username}`);
        }
    };

    return (
        <div className="min-h-screen flex flex-col relative overflow-hidden bg-[#0d1117] text-white font-sans selection:bg-blue-500/30">

            {/* Dynamic Background with Floating Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">

                {/* Animated Orbs */}
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 8, repeat: Infinity }}
                    className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-blue-600/20 blur-[100px] rounded-full mix-blend-screen"
                />
                <motion.div
                    animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 10, repeat: Infinity, delay: 1 }}
                    className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-purple-600/20 blur-[100px] rounded-full mix-blend-screen"
                />

                {/* Floating Code Snippets */}
                <FloatingElement delay={0} xOffset={-30} yOffset={40}>
                    <div className="top-[15%] left-[10%] font-mono text-xs text-blue-400/30 bg-black/20 p-2 rounded border border-blue-500/10 backdrop-blur-sm">
                        git commit -m "feat: initial commit"
                    </div>
                </FloatingElement>
                <FloatingElement delay={2} xOffset={40} yOffset={-30}>
                    <div className="top-[25%] right-[15%] font-mono text-xs text-green-400/30 bg-black/20 p-2 rounded border border-green-500/10 backdrop-blur-sm">
                        npm install react-framer-motion
                    </div>
                </FloatingElement>
                <FloatingElement delay={4} xOffset={-20} yOffset={-50}>
                    <div className="bottom-[20%] left-[20%] font-mono text-xs text-purple-400/30 bg-black/20 p-2 rounded border border-purple-500/10 backdrop-blur-sm">
                        const score = analyze(repo);
                    </div>
                </FloatingElement>
                <FloatingElement delay={1} xOffset={50} yOffset={20}>
                    <div className="bottom-[30%] right-[10%] font-mono text-xs text-pink-400/30 bg-black/20 p-2 rounded border border-pink-500/10 backdrop-blur-sm">
                        while(coding) drinkCoffee();
                    </div>
                </FloatingElement>

            </div>

            {/* Main Content */}
            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 w-full max-w-7xl mx-auto">

                {/* Hero Section */}
                <motion.div
                    style={{ y: y1 }}
                    className="text-center max-w-5xl mx-auto mt-[-5vh]"
                >
                    {/* Logo Icon */}
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 260, damping: 20 }}
                        className="w-20 h-20 bg-gradient-to-br from-gray-800 to-black rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-2xl border border-white/10 relative group"
                    >
                        <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <FaGithub size={48} className="text-white relative z-10" />
                    </motion.div>

                    {/* Headline */}
                    <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tight leading-[1.1]">
                        <span className="block text-white mb-2">GitHub Profile</span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 animate-gradient-x">
                            <TypewriterText text="Analyzer" delay={5} />
                        </span>
                    </h1>

                    {/* Subheadline typing effect */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.5, duration: 0.8 }}
                        className="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed font-light"
                    >
                        Turn your code into <span className="text-white font-medium">career proof</span>.
                        Get recruiter-level insights and actionable feedback.
                    </motion.p>

                    {/* Interaction Area */}
                    <motion.form
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 2, duration: 0.5 }}
                        onSubmit={handleSubmit}
                        className="w-full max-w-xl mx-auto relative group z-50"
                    >
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200 animate-pulse"></div>

                        <div className="relative flex items-center bg-[#0d1117]/90 backdrop-blur-xl rounded-2xl p-2 border border-white/10 shadow-2xl transition-all transform hover:scale-[1.02] hover:border-white/20">
                            <FaSearch className="text-gray-500 ml-4 group-focus-within:text-blue-400 transition-colors" size={20} />

                            <input
                                type="text"
                                placeholder="github.com/username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value.replace('https://github.com/', ''))}
                                className="bg-transparent border-none text-white text-xl w-full px-4 py-4 focus:ring-0 placeholder-gray-600 font-light"
                                autoFocus
                            />

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                type="submit"
                                className="bg-gradient-to-r from-[#238636] to-[#2ea043] hover:from-[#2ea043] hover:to-[#3fb950] text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-green-500/30 flex items-center gap-2 whitespace-nowrap overflow-hidden relative"
                            >
                                <motion.span
                                    initial={{ x: 0 }}
                                    whileHover={{ x: 5 }}
                                >
                                    Analyze
                                </motion.span>
                                <FaArrowRight />

                                {/* Shine effect on button */}
                                <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 group-hover:animate-shine" />
                            </motion.button>
                        </div>
                    </motion.form>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 2.5 }}
                        className="flex justify-center gap-6 mt-8 text-sm text-gray-500 font-medium"
                    >
                        <span>Try popular profiles:</span>
                        {['torvalds', 'sindresorhus', 'shadcn'].map((user, i) => (
                            <button
                                key={user}
                                type="button"
                                onClick={() => setUsername(user)}
                                className="text-blue-400 hover:text-blue-300 transition-all hover:scale-105 active:scale-95"
                            >
                                {user}
                            </button>
                        ))}
                    </motion.div>

                </motion.div>

                {/* Feature Highlights (Parallax Scroll) */}
                <motion.div
                    style={{ y: y2 }}
                    className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl px-4"
                >
                    {[
                        { title: "AI Scoring", desc: "Deep metrics analysis.", color: "from-blue-500/20 to-blue-600/5" },
                        { title: "Recruiter Vision", desc: "See what hiring managers see.", color: "from-purple-500/20 to-purple-600/5" },
                        { title: "Action Plan", desc: "Steps to level up instantly.", color: "from-pink-500/20 to-pink-600/5" }
                    ].map((feat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.8 }}
                            whileHover={{ y: -10, scale: 1.02 }}
                            className={`p-8 rounded-3xl border border-white/5 bg-gradient-to-br ${feat.color} backdrop-blur-md hover:border-white/20 transition-all duration-300 relative overflow-hidden group`}
                        >
                            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <h3 className="font-bold text-2xl mb-2 text-white relative z-10">{feat.title}</h3>
                            <p className="text-gray-400 font-light relative z-10">{feat.desc}</p>
                        </motion.div>
                    ))}
                </motion.div>

            </div>

        </div>
    );
};

export default Landing;
