import React from 'react';
import { Wrench, X } from 'lucide-react';
import { NavItem } from '../types';

interface SidebarProps {
  navItems: NavItem[];
  activeSection: string;
  sidebarOpen: boolean;
  onSectionChange: (section: string) => void;
  onSidebarClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  navItems,
  activeSection,
  sidebarOpen,
  onSectionChange,
  onSidebarClose
}) => {
  return (
    <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
      <div className="flex items-center justify-between h-16 px-6 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
            <Wrench className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold">AutoTaller</h1>
        </div>
        <button 
          onClick={onSidebarClose}
          className="lg:hidden text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
      
      <nav className="mt-8 px-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => {
                onSectionChange(item.id);
                onSidebarClose();
              }}
              className={`w-full flex items-center justify-between px-4 py-3 mb-2 rounded-lg text-left transition-all duration-200 group ${
                isActive 
                  ? 'bg-orange-500 text-white shadow-lg' 
                  : 'text-gray-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                <span className="font-medium">{item.label}</span>
              </div>
              {item.badge && (
                <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};