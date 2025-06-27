import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardCard } from './components/DashboardCard';
import { RecentOrders } from './components/RecentOrders';
import { QuickActions } from './components/QuickActions';
import { SectionPlaceholder } from './components/SectionPlaceholder';
import { OrderList } from './components/orders/OrderList';
import { ClienteList } from './components/clients/ClienteList';
import {
  navItems,
  dashboardCards,
  recentOrders,
  quickActions,
} from './data/dummyData';

function App() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar
        navItems={navItems}
        activeSection={activeSection}
        sidebarOpen={sidebarOpen}
        onSectionChange={setActiveSection}
        onSidebarClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header onSidebarOpen={() => setSidebarOpen(true)} />

        <main className="flex-1 p-6 overflow-auto">
          {activeSection === 'dashboard' && (
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
                  <p className="text-gray-600 mt-1">Resumen general del taller automotriz</p>
                </div>
                <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-all duration-200 transform hover:scale-105 shadow-lg">
                  <Plus className="w-5 h-5" />
                  <span>Nueva Orden</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {dashboardCards.map((card, index) => (
                  <DashboardCard key={index} card={card} />
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <RecentOrders orders={recentOrders} />
                <QuickActions actions={quickActions} />
              </div>
            </div>
          )}

          {activeSection === 'clients' && (
            <div className="max-w-7xl mx-auto">
              <ClienteList />
            </div>
          )}
          {activeSection === 'orders' && (
            <div className="max-w-7xl mx-auto">
              <OrderList />
            </div>
          )}
          {/* Fallback para otras secciones */}
          {activeSection !== 'dashboard' && activeSection !== 'clients' &&  activeSection !== 'orders' && (
            <SectionPlaceholder activeSection={activeSection} navItems={navItems} />
          )}
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}

export default App;
