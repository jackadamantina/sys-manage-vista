
import React from 'react';

const UserManagement = () => {
  const users = [
    {
      name: 'Ricardo Oliveira',
      email: 'ricardo@empresa.com.br',
      role: 'Administrador',
      status: 'Ativo',
      lastLogin: '21/06/2025',
    },
    {
      name: 'Fernanda Costa',
      email: 'fernanda@empresa.com.br',
      role: 'Gerente',
      status: 'Ativo',
      lastLogin: '20/06/2025',
    },
    {
      name: 'Roberto Santos',
      email: 'roberto@empresa.com.br',
      role: 'Usuário',
      status: 'Inativo',
      lastLogin: '15/06/2025',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-800">Gestão de Usuários</h2>
        <button className="px-4 py-2 bg-primary text-white rounded-button flex items-center">
          <i className="ri-user-add-line mr-2"></i>
          Novo Usuário
        </button>
      </div>

      <div className="bg-white rounded shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">Lista de Usuários</h3>
            <div className="flex space-x-4">
              <input
                type="text"
                placeholder="Buscar usuários..."
                className="px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary"
              />
              <button className="px-4 py-2 bg-primary text-white rounded-button flex items-center">
                <i className="ri-search-line mr-2"></i>
                Buscar
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
                  Função
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Último Login
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
                        {user.name.charAt(0)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.role}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.status === 'Ativo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.lastLogin}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <button className="text-gray-500 hover:text-primary">
                        <i className="ri-eye-line"></i>
                      </button>
                      <button className="text-gray-500 hover:text-primary">
                        <i className="ri-edit-line"></i>
                      </button>
                      <button className="text-gray-500 hover:text-red-500">
                        <i className="ri-delete-bin-line"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
