
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Logo from './Logo';
import { Button } from '@/components/ui/button';

type ActivePage = 'dashboard' | 'system-management' | 'reports' | 'user-management' | 'users' | 'settings';

interface SidebarProps {
  activePage: ActivePage;
  onPageChange: (page: ActivePage) => void;
}

const Sidebar = ({ activePage, onPageChange }: SidebarProps) => {
  const { user, logout } = useAuth();

  const navigationItems = [
    {
      id: 'dashboard' as ActivePage,
      label: 'Dashboard',
      icon: 'ri-dashboard-line',
    },
    {
      id: 'system-management' as ActivePage,
      label: 'Gestão de Sistemas',
      icon: 'ri-apps-line',
    },
    {
      id: 'reports' as ActivePage,
      label: 'Relatórios',
      icon: 'ri-file-chart-line',
    },
    {
      id: 'user-management' as ActivePage,
      label: 'Gestão de Usuários',
      icon: 'ri-user-settings-line',
    },
    {
      id: 'users' as ActivePage,
      label: 'Usuários',
      icon: 'ri-group-line',
    },
    {
      id: 'settings' as ActivePage,
      label: 'Configurações',
      icon: 'ri-settings-3-line',
    },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <Logo size="md" />
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-2">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={`sidebar-link w-full flex items-center px-3 py-3 text-sm font-medium rounded-md transition-colors ${
                activePage === item.id
                  ? 'active'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div className="w-6 h-6 flex items-center justify-center mr-3">
                <i className={`${item.icon} ${activePage === item.id ? 'text-primary' : 'text-gray-500'}`}></i>
              </div>
              {item.label}
            </button>
          ))}
        </nav>
      </div>
      
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center mb-3">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
            <i className="ri-user-line"></i>
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-700">{user?.full_name}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
          </div>
        </div>
        <Button 
          onClick={handleLogout}
          variant="outline" 
          size="sm" 
          className="w-full"
        >
          <i className="ri-logout-box-line mr-2"></i>
          Sair
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
