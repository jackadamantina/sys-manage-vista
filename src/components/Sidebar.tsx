
import React from 'react';

interface SidebarProps {
  activePage: string;
  onPageChange: (page: string) => void;
}

const Sidebar = ({ activePage, onPageChange }: SidebarProps) => {
  const navigationItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'ri-dashboard-line',
    },
    {
      id: 'system-management',
      label: 'Gestão de Sistemas',
      icon: 'ri-apps-line',
    },
    {
      id: 'reports',
      label: 'Relatórios',
      icon: 'ri-file-chart-line',
    },
    {
      id: 'user-management',
      label: 'Gestão de Usuários',
      icon: 'ri-user-settings-line',
    },
    {
      id: 'settings',
      label: 'Configurações',
      icon: 'ri-settings-3-line',
    },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200 flex items-center">
        <span className="text-2xl font-pacifico text-primary">logo</span>
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
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
            <i className="ri-user-line"></i>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-700">Ricardo Oliveira</p>
            <p className="text-xs text-gray-500">Administrador</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
