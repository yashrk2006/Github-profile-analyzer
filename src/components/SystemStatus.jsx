import React from 'react';

const SystemStatus = () => {
    return (
        <div className="w-full border-t border-[#30363d] bg-[#0d1117]/80 backdrop-blur text-[10px] font-mono text-gray-500 py-2 px-6 flex justify-between items-center fixed bottom-0 left-0 z-50">
            <div className="flex items-center gap-4">
                <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    SYSTEM ONLINE
                </span>
                <span>LAST SCAN: {new Date().toLocaleTimeString()} UTC</span>
            </div>
            <div className="flex items-center gap-4">
                <span>ID: #8821-XAE</span>
                <span className="text-blue-500">v2.4.0-FUI</span>
            </div>
        </div>
    );
};

export default SystemStatus;
