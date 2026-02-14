import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaGithub, FaArrowRight, FaSearch, FaCode, FaChartPie, FaLightbulb, FaRocket, FaShieldAlt, FaMagic, FaCheckCircle, FaStar, FaQuestionCircle } from 'react-icons/fa';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { HeroGeometric } from '../components/ui/shape-landing-hero';
import SearchComponent from '../components/ui/animated-glowing-search-bar';
import { InteractiveHoverButton } from '../components/ui/interactive-hover-button';
import OrbitingCircles from '../components/ui/orbiting-circles';
import { FaReact, FaNodeJs, FaDocker } from 'react-icons/fa';
import { SiTailwindcss, SiVercel, SiTypescript, SiFramer } from 'react-icons/si';

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
        className="absolute pointer-events-none z-0 opacity-30 hover:opacity-50 transition-opacity duration-500 mix-blend-screen"
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
            transition: { staggerChildren: 0.03, delayChildren: delay * 0.1 },
        }),
    };
    const child = {
        visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
        hidden: { opacity: 0, y: 20, filter: 'blur(10px)' },
    };

    return (
        <motion.span
            variants={container}
            initial="hidden"
            animate="visible"
            className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-gray-200"
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

const StatCard = ({ number, label, suffix = "" }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, type: "spring" }}
        className="text-center p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all duration-300"
    >
        <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 mb-2">
            {number}{suffix}
        </div>
        <div className="text-blue-200 font-medium">{label}</div>
    </motion.div>
);

const TestimonialCard = ({ quote, author, role, image, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay, duration: 0.5 }}
        className="p-8 rounded-3xl bg-[#0d1117] border border-white/10 relative hover:border-blue-500/30 transition-colors duration-300 group"
    >
        <div className="flex gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
                <FaStar key={i} className="text-yellow-500 text-sm" />
            ))}
        </div>
        <p className="text-gray-300 leading-relaxed mb-6 relative z-10 font-light">"{quote}"</p>
        <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                {author.charAt(0)}
            </div>
            <div>
                <div className="font-bold text-white group-hover:text-blue-400 transition-colors">{author}</div>
                <div className="text-xs text-gray-500">{role}</div>
            </div>
        </div>
    </motion.div>
);

const FAQItem = ({ question, answer, isOpen, onClick }) => (
    <motion.div
        initial={false}
        className="border-b border-white/10 last:border-0"
    >
        <button
            className="w-full py-6 flex items-center justify-between text-left group"
            onClick={onClick}
        >
            <span className={`text-lg font-medium transition-colors duration-300 ${isOpen ? 'text-blue-400' : 'text-white group-hover:text-blue-300'}`}>
                {question}
            </span>
            <div className={`w-8 h-8 rounded-full border border-white/10 flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-blue-500/20 rotate-45 border-blue-500/50' : 'bg-transparent group-hover:bg-white/5'}`}>
                <FaArrowRight className={`w-3 h-3 transition-colors duration-300 ${isOpen ? 'text-blue-400' : 'text-gray-400'}`} />
            </div>
        </button>
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                >
                    <p className="pb-6 text-gray-400 leading-relaxed">
                        {answer}
                    </p>
                </motion.div>
            )}
        </AnimatePresence>
    </motion.div>
);

// --- Main Landing Page ---

const Landing = () => {
    const [username, setUsername] = useState('');
    const [openFAQ, setOpenFAQ] = useState(null);
    const navigate = useNavigate();
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const toggleFAQ = (index) => {
        setOpenFAQ(openFAQ === index ? null : index);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (username.trim()) {
            navigate(`/analyze/${username}`);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -20, transition: { duration: 0.3 } }}
            className="min-h-screen flex flex-col relative overflow-hidden bg-[#050505] text-white font-sans selection:bg-blue-500/30"
        >

            {/* Progress Bar */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 origin-left z-50 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                style={{ scaleX }}
            />

            {/* Hero Section with Geometric Background */}
            <HeroGeometric>
                <div className="max-w-7xl mx-auto px-6 w-full py-24 relative z-10">

                    {/* Floating Background Icons */}
                    <FloatingElement delay={0} xOffset={-40} yOffset={40}>
                        <div className="absolute top-0 left-0 text-blue-500/10 text-9xl font-black opacity-20 transform -rotate-12 select-none">
                            &lt;/&gt;
                        </div>
                    </FloatingElement>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-medium mb-6 uppercase tracking-wider shadow-[0_0_15px_rgba(59,130,246,0.15)]"
                        >
                            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
                            AI-Powered Profile Analysis
                        </motion.div>

                        <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter relative z-20 leading-[1.1]">
                            <span className="block text-gray-200">Unlock Your Full</span>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-gradient-x drop-shadow-[0_0_30px_rgba(168,85,247,0.3)]">
                                Developer Potential.
                            </span>
                        </h2>
                        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto font-light mb-12 relative z-20 leading-relaxed">
                            Don't let your hard work go unnoticed. Get <span className="text-white font-medium">data-driven insights</span> and <span className="text-white font-medium">recruiter-ready feedback</span> in seconds.
                        </p>

                        {/* Massive Search Bar */}
                        <div className="w-full max-w-3xl mx-auto relative z-50 py-4">
                            <SearchComponent
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                onSubmit={handleSubmit}
                            />
                        </div>

                        <div className="flex flex-wrap justify-center gap-4 mt-10 text-sm font-medium relative z-20">
                            <span className="text-gray-500 py-1">Trending:</span>
                            {[
                                { name: 'torvalds', color: 'bg-red-500', border: 'border-red-500/20 hover:border-red-500' },
                                { name: 'shadcn', color: 'bg-white', border: 'border-white/20 hover:border-white' }, // Shadcn implies white/black
                                { name: 'leerob', color: 'bg-purple-500', border: 'border-purple-500/20 hover:border-purple-500' },
                                { name: 'btholt', color: 'bg-orange-500', border: 'border-orange-500/20 hover:border-orange-500' }
                            ].map((user) => (
                                <InteractiveHoverButton
                                    key={user.name}
                                    text={user.name}
                                    onClick={() => setUsername(user.name)}
                                    className={`w-auto min-w-[100px] h-8 px-4 py-1 text-xs ${user.border}`}
                                    dotColor={user.color}
                                />
                            ))}
                        </div>

                        <div className="flex justify-center mt-12 gap-6 relative z-20">
                            <a href="#features">
                                <InteractiveHoverButton
                                    text="Explore Features"
                                    className="w-[180px] border-blue-500/20 hover:border-blue-500"
                                    dotColor="bg-blue-600"
                                />
                            </a>
                            <a href="#how-it-works">
                                <InteractiveHoverButton
                                    text="How It Works"
                                    className="w-[180px] bg-transparent border-green-500/20 hover:border-green-500"
                                    dotColor="bg-green-600"
                                />
                            </a>
                        </div>
                    </motion.div>

                    <div id="features" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-20">
                        <FeatureCard
                            icon={FaChartPie}
                            title="Smart Scoring v2.0"
                            desc="Our advanced algorithm evaluates 6 key dimensions including code structure, documentation quality, and community impact."
                            delay={0}
                        />
                        <FeatureCard
                            icon={FaLightbulb}
                            title="Actionable Feedback"
                            desc="Don't just get a todo list. We tell you exactly what to fix to impress recruiters."
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

                    {/* Scroll Down Indicator */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, y: [0, 10, 0] }}
                        transition={{ delay: 1, duration: 1.5, repeat: Infinity, repeatType: "loop" }}
                        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 text-blue-400/50"
                    >
                        <FaArrowRight className="rotate-90 text-2xl" />
                    </motion.div>
                </div>
            </HeroGeometric>

            {/* Stats Section */}
            <section className="py-24 relative z-20 bg-[#050505]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <StatCard number="50k" suffix="+" label="Profiles Analyzed" />
                        <StatCard number="1M" suffix="+" label="Lines Scanned" />
                        <StatCard number="98" suffix="%" label="User Satisfaction" />
                        <StatCard number="24" suffix="/7" label="Real-time Availability" />
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="relative z-10 py-32 bg-gradient-to-b from-transparent to-[#0d1117]">
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
                        <div className="p-6 rounded-2xl bg-blue-500/10 border border-blue-500/20 backdrop-blur-sm hover:bg-blue-500/20 transition-colors">
                            <FaCheckCircle className="text-blue-400 mb-3" size={24} />
                            <p className="text-blue-200 text-sm font-medium">Trusted by developers worldwide to improve their job prospects.</p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={{
                            visible: { transition: { staggerChildren: 0.3 } }
                        }}
                        className="md:w-2/3 max-w-2xl"
                    >
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
                    </motion.div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-24 relative z-10 bg-[#050505]">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-black mb-6">Loved by Developers</h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">See what the community has to say about our analysis tools.</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <TestimonialCard
                            quote="This tool completely changed how I present my GitHub profile to recruiters. The insights are spot on."
                            author="Sarah K."
                            role="Frontend Engineer"
                            delay={0}
                        />
                        <TestimonialCard
                            quote="I didn't realize how much my documentation was lacking until I ran this analysis. Highly recommended!"
                            author="James R."
                            role="Full Stack Dev"
                            delay={0.1}
                        />
                        <TestimonialCard
                            quote="The best part is the actionable feedback. It doesn't just grade you, it teaches you."
                            author="Emily T."
                            role="Open Source Contributor"
                            delay={0.2}
                        />
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-24 relative z-10 bg-gradient-to-b from-[#050505] to-[#0d1117]">
                <div className="max-w-3xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-black mb-6">Frequently Asked Questions</h2>
                    </motion.div>

                    <div className="space-y-2">
                        <FAQItem
                            question="Is this tool free to use?"
                            answer="Yes, the core analysis is completely free for all public GitHub repositories."
                            isOpen={openFAQ === 0}
                            onClick={() => toggleFAQ(0)}
                        />
                        <FAQItem
                            question="Do you store my code?"
                            answer="No, we never store your actual code. We only analyze metadata and metrics in real-time."
                            isOpen={openFAQ === 1}
                            onClick={() => toggleFAQ(1)}
                        />
                        <FAQItem
                            question="How accurate is the scoring?"
                            answer="Our scoring algorithm resembles industry-standard hiring rubrics used by top tech companies."
                            isOpen={openFAQ === 2}
                            onClick={() => toggleFAQ(2)}
                        />
                        <FAQItem
                            question="Can I analyze private repositories?"
                            answer="Currently, we only support public repositories to ensure privacy and security without requiring OAuth tokens."
                            isOpen={openFAQ === 3}
                            onClick={() => toggleFAQ(3)}
                        />
                    </div>
                </div>
            </section>

            {/* Tech Stack Section */}
            <section className="py-24 relative z-10 border-t border-white/5 bg-[#050505] overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-widest mb-12">Powered by Modern Tech</p>

                    <div className="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-background">
                        <span className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-8xl font-semibold leading-none text-transparent dark:from-white dark:to-slate-900/10">
                            Stack
                        </span>

                        {/* Inner Circles */}
                        <OrbitingCircles
                            className="size-[30px] border-none bg-transparent"
                            duration={20}
                            delay={20}
                            radius={80}
                        >
                            <FaReact className="text-4xl text-blue-400" />
                        </OrbitingCircles>
                        <OrbitingCircles
                            className="size-[30px] border-none bg-transparent"
                            duration={20}
                            delay={10}
                            radius={80}
                        >
                            <SiTypescript className="text-4xl text-blue-600" />
                        </OrbitingCircles>

                        {/* Middle Circles */}
                        <OrbitingCircles
                            className="size-[50px] border-none bg-transparent"
                            radius={190}
                            duration={20}
                            reverse
                        >
                            <FaNodeJs className="text-5xl text-green-500" />
                        </OrbitingCircles>
                        <OrbitingCircles
                            className="size-[50px] border-none bg-transparent"
                            radius={190}
                            duration={20}
                            delay={20}
                            reverse
                        >
                            <SiTailwindcss className="text-5xl text-cyan-400" />
                        </OrbitingCircles>

                        {/* Outer Circles */}
                        <OrbitingCircles
                            className="size-[50px] border-none bg-transparent"
                            radius={280}
                            duration={30}
                            delay={20}
                        >
                            <SiFramer className="text-4xl text-white" />
                        </OrbitingCircles>
                        <OrbitingCircles
                            className="size-[50px] border-none bg-transparent"
                            radius={280}
                            duration={30}
                            delay={40}
                        >
                            <SiVercel className="text-4xl text-white" />
                        </OrbitingCircles>
                        <OrbitingCircles
                            className="size-[50px] border-none bg-transparent"
                            radius={280}
                            duration={30}
                            delay={60}
                        >
                            <FaGithub className="text-4xl text-white" />
                        </OrbitingCircles>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-50 py-16 border-t border-white/5 bg-[#020408]">
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
                        <button onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} className="text-gray-400 hover:text-white transition-colors hover:underline bg-transparent border-none cursor-pointer">Features</button>
                        <span className="text-gray-400 hover:text-white transition-colors cursor-default">Pricing</span>
                        <span className="text-gray-400 hover:text-white transition-colors cursor-default">Blog</span>
                    </div>

                    <div className="flex gap-6 relative z-50">
                        <Link to="/privacy" className="text-gray-500 hover:text-white transition-colors">Privacy Policy</Link>
                        <span className="text-gray-500 hover:text-white transition-colors cursor-default">Terms of Service</span>
                    </div>
                </div>
                <div className="text-center mt-12 text-gray-600 text-xs">
                    © 2026 GitHub Portfolio Analyzer.
                </div>
            </footer>

        </motion.div >
    );
};

export default Landing;
