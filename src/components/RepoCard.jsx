
import React from 'react';
import { FaStar, FaCodeBranch, FaCircle, FaExternalLinkAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

const RepoCard = ({ repo }) => {
    return (
        <motion.a
            href={`https://github.com/${repo.name}`} // simplistic url construction
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -4, scale: 1.01 }}
            className="glass-panel p-5 flex flex-col h-full border-l-4 border-l-blue-500/80 hover:border-l-blue-400 transition-all group relative overflow-hidden"
        >
            <div className="flex justify-between items-start mb-3 relative z-10">
                <h3 className="text-blue-400 font-semibold text-lg truncate pr-4 group-hover:text-blue-300 transition-colors flex items-center gap-2">
                    {repo.name}
                    <FaExternalLinkAlt size={12} className="opacity-0 group-hover:opacity-100 transition-opacity -translate-y-0.5" />
                </h3>
                <span className="text-xs text-gray-500 font-mono whitespace-nowrap bg-black/20 px-2 py-1 rounded">
                    {new Date(repo.updated_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: '2-digit' })}
                </span>
            </div>

            <p className="text-sm text-gray-400 mb-6 flex-grow line-clamp-2 leading-relaxed font-light group-hover:text-gray-300 transition-colors">
                {repo.description || 'No description provided.'}
            </p>

            <div className="flex items-center gap-4 text-xs text-gray-500 mt-auto border-t border-white/5 pt-3">
                {repo.language && (
                    <div className="flex items-center gap-1.5">
                        <FaCircle className="text-amber-400" size={8} />
                        <span className="font-medium text-gray-400">{repo.language}</span>
                    </div>
                )}
                <div className="flex items-center gap-1.5">
                    <FaStar size={12} className={repo.stars > 0 ? 'text-yellow-400' : ''} />
                    <span className="font-medium">{repo.stars}</span>
                </div>
                <div className="ml-auto flex items-center gap-2">
                    <div className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${repo.scores.doc > 80 ? 'bg-green-500/10 text-green-400' :
                            repo.scores.doc > 50 ? 'bg-yellow-500/10 text-yellow-400' : 'bg-red-500/10 text-red-400'
                        }`}>
                        Doc {repo.scores.doc}
                    </div>
                </div>
            </div>

            {/* Background Hover Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-colors duration-500" />
        </motion.a>
    );
};

export default RepoCard;
