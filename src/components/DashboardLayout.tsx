import React from 'react';

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex flex-col h-screen bg-[#1e1e1e] text-[#d4d4d4]">
    {/* Top Bar */}
    <div className="flex items-center h-10 bg-[#23272e] border-b border-[#222] px-4">
      <span className="text-blue-400 font-bold mr-4">RustyClint IDE</span>
      {/* Add menu/status here */}
    </div>
    <div className="flex flex-1">
      {/* Sidebar */}
      <div className="w-14 bg-[#2c2c32] border-r border-[#222] flex flex-col items-center py-2">
        <button className="mb-2 p-2 hover:bg-[#23272e] rounded" title="Explorer">
          <span role="img" aria-label="explorer">📁</span>
        </button>
        <button className="mb-2 p-2 hover:bg-[#23272e] rounded" title="Search">
          <span role="img" aria-label="search">🔍</span>
        </button>
      </div>
      {/* Main Area */}
      <div className="flex-1 flex">
        {children}
      </div>
    </div>
    {/* Status Bar */}
    <div className="h-6 bg-[#23272e] border-t border-[#222] px-4 flex items-center text-xs text-[#bfbfbf]">
      Ln 1, Col 1 {/* You can wire this up to your editor's cursor position */}
    </div>
  </div>
);

export default DashboardLayout;