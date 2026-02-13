
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaGithub, FaSearch, FaCode, FaMoon, FaSun } from 'react-icons/fa';

const Header = () => {
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);
    const [username, setUsername] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (username.trim()) {
            navigate(`/analyze/${username}`);
            setUsername('');
            setIsSearchExpanded(false);
        }
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-[#0d1117]/80 backdrop-blur-md border-b border-[#30363d] flex items-center justify-between px-4 md:px-8">
            {/* Left: Logo */}
            <Link to="/" className="flex items-center gap-2 group">
                <div className="w-8 h-8 rounded-lg bg-[#21262d] flex items-center justify-center border border-[#30363d] group-hover:border-blue-500/50 transition-colors">
                    <FaCode className="text-blue-400" />
                </div>
                <span className="font-bold text-lg tracking-tight text-white group-hover:text-blue-400 transition-colors">
                    GitFolio <span className="text-gray-500 font-light">Analyzer</span>
                </span>
            </Link>

            {/* Center/Right: Search & Actions */}
            <div className="flex items-center gap-4">

                {/* Collapsed Search */}
                <div className={`relative flex items-center transition-all duration-300 ${isSearchExpanded ? 'w-64' : 'w-10'}`}>
                    <form onSubmit={handleSearch} className="w-full">
                        <input
                            type="text"
                            placeholder="Search username..."
                            className={`bg-[#0d1117] border border-[#30363d] rounded-full py-1.5 pl-10 pr-4 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-300 w-full ${isSearchExpanded ? 'opacity-100 cursor-text' : 'opacity-0 cursor-pointer pointer-events-none'}`}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            onBlur={() => !username && setIsSearchExpanded(false)}
                        />
                    </form>
                    <button
                        onClick={() => setIsSearchExpanded(true)}
                        className={`absolute left-0 w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-white transition-colors ${isSearchExpanded ? 'pointer-events-none' : ''}`}
                    >
                        <FaSearch size={14} />
                    </button>
                </div>

                {/* Theme Toggle (Mock) */}
                <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#21262d] text-gray-400 hover:text-white transition-colors">
                    <FaMoon size={16} />
                </button>

                {/* GitHub Link */}
                <a
                    href="https://github.com/yashrk2006/Github-profile-analyzer"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#21262d] text-gray-400 hover:text-white transition-colors"
                >
                    <FaGithub size={18} />
                </a>
            </div>
        </header>
    );
};

export default Header;
