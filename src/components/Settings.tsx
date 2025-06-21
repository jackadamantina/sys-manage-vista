
import React from 'react';

const Settings = () => {
  const activityLogs = [
    {
      date: '21/06/2025 15:30',
      user: 'Ricardo Oliveira',
      action: 'Alteração de Permissão',
      system: 'Sistema ERP',
      details: 'Alterou permissão do usuário Amanda Rodrigues para Administrador',
    },
    {
      date: '21/06/2025 14:15',
      user: 'Fernanda Costa',
      action: 'Novo Usuário',
      system: 'CRM',
      details: 'Adicionou novo usuário: Carlos Eduardo Silva',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <h2 className="text-2xl font-semibold text-gray-800">Configurações</h2>
        <div className="w-5 h-5 ml-2 text-gray-400 cursor-help flex items-center justify-center" title="Configurações gerais do sistema e logs de atividades">
          <i className="ri-question-line"></i>
        </div>
      </div>

      <div className="bg-white rounded shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center">
            <h3 className="text-lg font-medium text-gray-900">Logs de Atividades</h3>
            <div className="w-4 h-4 ml-2 text-gray-400 cursor-help flex items-center justify-center" title="Registro de todas as ações realizadas pelos usuários">
              <i className="ri-question-line"></i>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Usuário</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary">
                  <option value="">Todos os usuários</option>
                  <option value="1">Ricardo Oliveira</option>
                  <option value="2">Fernanda Costa</option>
                  <option value="3">Roberto Santos</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Atividade</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary">
                  <option value="">Todas as atividades</option>
                  <option value="login">Login</option>
                  <option value="update">Atualização</option>
                  <option value="create">Criação</option>
                  <option value="delete">Exclusão</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data Inicial</label>
                <input type="date" className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data Final</label>
                <input type="date" className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary" />
              </div>
            </div>

            <div className="flex justify-between items-center mb-4">
              <div className="flex space-x-4">
                <input
                  type="text"
                  placeholder="Buscar nos resultados..."
                  className="px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary"
                />
                <button className="px-4 py-2 bg-primary text-white rounded-button flex items-center">
                  <i className="ri-search-line mr-2"></i>
                  Buscar
                </button>
              </div>
              <button className="px-4 py-2 text-primary border border-primary rounded-button flex items-center hover:bg-primary hover:text-white transition-colors">
                <i className="ri-download-line mr-2"></i>
                Exportar
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data/Hora</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuário</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ação</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sistema</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Detalhes</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {activityLogs.map((log, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.user}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.action}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.system}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button className="text-primary hover:text-primary-dark" title={log.details}>
                        <i className="ri-information-line"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
