
import React from 'react';
import { motion } from 'framer-motion';

const LoadingScreen = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="relative w-24 h-24 mb-8">
                <motion.div
                    className="absolute inset-0 border-4 border-t-transparent border-l-transparent border-r-transparent border-b-[#58a6ff] rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                    className="absolute inset-2 border-4 border-t-transparent border-l-transparent border-r-transparent border-b-[#bc8cff] rounded-full"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />
            </div>
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#58a6ff] to-[#bc8cff]">
                Analyzing GitHub Profile...
            </h2>
            <p className="text-gray-400 mt-2">Checking repos, commits, and code quality</p>
        </div>
    );
};

export default LoadingScreen;
