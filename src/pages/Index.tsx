
import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Dashboard from '../components/Dashboard';
import SystemManagement from '../components/SystemManagement';
import Settings from '../components/Settings';
import Reports from '../components/Reports';
import UserManagement from '../components/UserManagement';
import Users from '../components/Users';

type ActivePage = 'dashboard' | 'system-management' | 'reports' | 'user-management' | 'users' | 'settings';

const Index = () => {
  const [activePage, setActivePage] = useState<ActivePage>('dashboard');

  const renderContent = () => {
    switch (activePage) {
      case 'system-management':
        return <SystemManagement />;
      case 'reports':
        return <Reports />;
      case 'user-management':
        return <UserManagement />;
      case 'users':
        return <Users />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  const getPageTitle = () => {
    switch (activePage) {
      case 'system-management':
        return 'Gestão de Sistemas';
      case 'reports':
        return 'Relatórios';
      case 'user-management':
        return 'Gestão de Usuários';
      case 'users':
        return 'Usuários e Sistemas';
      case 'settings':
        return 'Configurações';
      default:
        return 'Dashboard';
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activePage={activePage} onPageChange={setActivePage} />
      <div className="flex-1 flex flex-col">
        <Header title={getPageTitle()} />
        <main className="flex-1 overflow-y-auto p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Index;
