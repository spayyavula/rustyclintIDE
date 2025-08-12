import React from 'react';

type Tab = {
  id: string | number;
  name: string;
};

type TabBarProps = {
  tabs?: Tab[];
  activeTab: string | number;
  onTabSelect: (id: string | number) => void;
  onTabClose: (id: string | number) => void;
};

const TabBar: React.FC<TabBarProps> = ({ tabs = [], activeTab, onTabSelect, onTabClose }) => (
  <div className="flex bg-[#23272e] border-b border-[#222] h-10">
    {(tabs || []).map(tab => (
      <div
        key={tab.id}
        className={`flex items-center px-4 h-full cursor-pointer border-r border-[#222] ${
          tab.id === activeTab ? 'bg-[#1e1e1e] text-white' : 'text-[#bfbfbf] hover:bg-[#252526]'
        }`}
        onClick={() => onTabSelect(tab.id)}
        role="tab"
        aria-selected={tab.id === activeTab}
      >
        <span className="mr-2">📄</span>
        <span>{tab.name}</span>
        <button
          className="ml-2 text-xs text-[#bfbfbf] hover:text-red-400"
          onClick={e => { e.stopPropagation(); onTabClose(tab.id); }}
          title="Close"
        >
          ×
        </button>
      </div>
    ))}
  </div>
);

export default TabBar;