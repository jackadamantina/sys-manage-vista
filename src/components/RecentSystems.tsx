
import React from 'react';

const RecentSystems = () => {
  const systems = [
    {
      name: 'Sistema ERP',
      url: 'erp.empresa.com.br',
      responsible: 'Marcelo Almeida',
      status: 'Ativo',
      lastUpdate: '20/06/2025',
      icon: 'ri-database-2-line',
      iconBg: 'bg-blue-100',
      iconColor: 'text-primary',
      statusColor: 'bg-green-100 text-green-800',
    },
    {
      name: 'CRM',
      url: 'crm.empresa.com.br',
      responsible: 'Fernanda Costa',
      status: 'Ativo',
      lastUpdate: '19/06/2025',
      icon: 'ri-customer-service-2-line',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-500',
      statusColor: 'bg-green-100 text-green-800',
    },
    {
      name: 'BI Analytics',
      url: 'bi.empresa.com.br',
      responsible: 'Roberto Santos',
      status: 'Manutenção',
      lastUpdate: '18/06/2025',
      icon: 'ri-file-chart-line',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-500',
      statusColor: 'bg-yellow-100 text-yellow-800',
    },
  ];

  return (
    <div className="bg-white rounded shadow">
      <div className="p-5 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">Sistemas Recentes</h3>
          <button className="text-sm text-primary hover:text-primary-dark">Ver todos</button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sistema
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Responsável
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Última Atualização
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {systems.map((system, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full ${system.iconBg} flex items-center justify-center ${system.iconColor}`}>
                      <i className={system.icon}></i>
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">{system.name}</div>
                      <div className="text-xs text-gray-500">{system.url}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{system.responsible}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${system.statusColor}`}>
                    {system.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {system.lastUpdate}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-2">
                    <button className="text-gray-500 hover:text-primary">
                      <i className="ri-eye-line"></i>
                    </button>
                    <button className="text-gray-500 hover:text-primary">
                      <i className="ri-edit-line"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentSystems;
