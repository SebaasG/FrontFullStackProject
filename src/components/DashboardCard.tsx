import React from 'react';
import { TrendingUp } from 'lucide-react';
import { DashboardCard as DashboardCardType } from '../types';

interface DashboardCardProps {
  card: DashboardCardType;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({ card }) => {
  const Icon = card.icon;
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{card.title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
          <div className="flex items-center mt-2">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className={`text-sm font-medium ${
              card.changeType === 'positive' ? 'text-green-600' : 
              card.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
            }`}>
              {card.change}
            </span>
          </div>
        </div>
        <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
};