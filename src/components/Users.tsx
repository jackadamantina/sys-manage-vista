
import React, { useState } from 'react';

interface SystemUser {
  id: number;
  name: string;
  email: string;
  status: 'Ativo' | 'Inativo';
  lastAccess: string;
}

interface SystemUserData {
  systemId: number;
  systemName: string;
  filePath: string;
  lastUpdate: string;
  users: SystemUser[];
}

const Users = () => {
  const [selectedSystem, setSelectedSystem] = useState<string>('');
  const [filePath, setFilePath] = useState<string>('');
  
  const systems = [
    { id: 1, name: 'Sistema ERP' },
    { id: 2, name: 'CRM' },
    { id: 3, name: 'BI Analytics' },
    { id: 4, name: 'Portal de RH' },
    { id: 5, name: 'Sistema Financeiro' },
  ];

  const systemUsersData: SystemUserData[] = [
    {
      systemId: 1,
      systemName: 'Sistema ERP',
      filePath: '/data/systems/erp/users.csv',
      lastUpdate: '21/06/2025 10:30',
      users: [
        { id: 1, name: 'Ricardo Oliveira', email: 'ricardo@empresa.com.br', status: 'Ativo', lastAccess: '21/06/2025' },
        { id: 2, name: 'Fernanda Costa', email: 'fernanda@empresa.com.br', status: 'Ativo', lastAccess: '20/06/2025' },
        { id: 3, name: 'Carlos Silva', email: 'carlos@empresa.com.br', status: 'Inativo', lastAccess: '15/06/2025' },
      ]
    },
    {
      systemId: 2,
      systemName: 'CRM',
      filePath: '/data/systems/crm/user_list.json',
      lastUpdate: '20/06/2025 16:45',
      users: [
        { id: 1, name: 'Fernanda Costa', email: 'fernanda@empresa.com.br', status: 'Ativo', lastAccess: '21/06/2025' },
        { id: 2, name: 'Amanda Rodrigues', email: 'amanda@empresa.com.br', status: 'Ativo', lastAccess: '21/06/2025' },
        { id: 3, name: 'João Santos', email: 'joao@empresa.com.br', status: 'Ativo', lastAccess: '19/06/2025' },
      ]
    }
  ];

  const selectedSystemData = systemUsersData.find(s => s.systemId.toString() === selectedSystem);

  const handleSystemChange = (systemId: string) => {
    setSelectedSystem(systemId);
    const systemData = systemUsersData.find(s => s.systemId.toString() === systemId);
    if (systemData) {
      setFilePath(systemData.filePath);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-800">Usuários por Sistema</h2>
      </div>

      {/* System Selection */}
      <div className="bg-white rounded shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Seleção de Sistema</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sistema</label>
            <select 
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary"
              value={selectedSystem}
              onChange={(e) => handleSystemChange(e.target.value)}
            >
              <option value="">Selecione um sistema</option>
              {systems.map((system) => (
                <option key={system.id} value={system.id.toString()}>
                  {system.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Path dos Arquivos</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary"
              value={filePath}
              onChange={(e) => setFilePath(e.target.value)}
              placeholder="/path/to/users/file"
            />
          </div>
          <div>
            {selectedSystemData && (
              <div className="text-sm text-gray-600">
                <span className="font-medium">Última atualização:</span>
                <br />
                {selectedSystemData.lastUpdate}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Users Table */}
      {selectedSystemData && (
        <div className="bg-white rounded shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">
                Usuários - {selectedSystemData.systemName}
              </h3>
              <div className="flex space-x-4">
                <button className="px-4 py-2 bg-green-500 text-white rounded-button flex items-center">
                  <i className="ri-refresh-line mr-2"></i>
                  Atualizar Lista
                </button>
                <button className="px-4 py-2 bg-primary text-white rounded-button flex items-center">
                  <i className="ri-download-line mr-2"></i>
                  Exportar
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuário
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Último Acesso
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {selectedSystemData.users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
                          {user.name.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.status === 'Ativo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.lastAccess}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
