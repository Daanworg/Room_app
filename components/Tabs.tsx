
import React from 'react';
import { Tab } from '../types';

interface TabsProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

const TabButton: React.FC<{
    icon: string;
    label: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => {
    const activeClasses = 'text-indigo-600 border-b-3 border-indigo-600';
    const inactiveClasses = 'text-gray-700 hover:text-indigo-600';
    return (
        <button
            onClick={onClick}
            className={`flex-1 py-3 px-4 text-center font-medium transition relative z-10 ${isActive ? activeClasses : inactiveClasses}`}
        >
            <i className={`fas ${icon} mr-2`}></i>{label}
        </button>
    );
};


const Tabs: React.FC<TabsProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex border-b border-gray-200 relative">
      <TabButton
        icon="fa-plus-circle"
        label="Add Expense"
        isActive={activeTab === 'add'}
        onClick={() => setActiveTab('add')}
      />
      <TabButton
        icon="fa-history"
        label="Expense History"
        isActive={activeTab === 'history'}
        onClick={() => setActiveTab('history')}
      />
      <TabButton
        icon="fa-scale-balanced"
        label="Balances"
        isActive={activeTab === 'balance'}
        onClick={() => setActiveTab('balance')}
      />
    </div>
  );
};

export default Tabs;
