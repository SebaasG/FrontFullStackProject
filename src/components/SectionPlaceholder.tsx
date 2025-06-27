import React from 'react';
import { Home } from 'lucide-react';
import { NavItem } from '../types';

interface SectionPlaceholderProps {
  activeSection: string;
  navItems: NavItem[];
}

export const SectionPlaceholder: React.FC<SectionPlaceholderProps> = ({ activeSection, navItems }) => {
  const selectedItem = navItems.find(item => item.id === activeSection);
  const Icon = selectedItem?.icon || Home;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon className="w-8 h-8 text-gray-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {selectedItem?.label}
        </h3>
        <p className="text-gray-600">
          Esta sección está en desarrollo. Aquí se mostrará el contenido de {selectedItem?.label.toLowerCase()}.
        </p>
      </div>
    </div>
  );
};