import React from 'react';
import { QuickAction } from '../types';

interface QuickActionsProps {
  actions: QuickAction[];
}

export const QuickActions: React.FC<QuickActionsProps> = ({ actions }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Acciones Rápidas</h3>
      </div>
      <div className="p-6">
        <div className="space-y-3">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <button 
                key={action.id}
                className="w-full flex items-center space-x-3 p-3 text-left rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="font-medium text-gray-900">{action.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};