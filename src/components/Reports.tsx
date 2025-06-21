
import React from 'react';

const Reports = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-800">Relatórios</h2>
        <button className="px-4 py-2 bg-primary text-white rounded-button flex items-center">
          <i className="ri-file-chart-line mr-2"></i>
          Gerar Relatório
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded shadow p-6">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <i className="ri-bar-chart-line text-primary text-xl"></i>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-800">Relatório de Sistemas</h3>
              <p className="text-sm text-gray-500">Visão geral dos sistemas cadastrados</p>
            </div>
          </div>
          <button className="w-full px-4 py-2 text-primary border border-primary rounded-button hover:bg-primary hover:text-white transition-colors">
            <i className="ri-download-line mr-2"></i>
            Baixar Relatório
          </button>
        </div>

        <div className="bg-white rounded shadow p-6">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <i className="ri-user-line text-green-500 text-xl"></i>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-800">Relatório de Usuários</h3>
              <p className="text-sm text-gray-500">Estatísticas de usuários ativos</p>
            </div>
          </div>
          <button className="w-full px-4 py-2 text-primary border border-primary rounded-button hover:bg-primary hover:text-white transition-colors">
            <i className="ri-download-line mr-2"></i>
            Baixar Relatório
          </button>
        </div>

        <div className="bg-white rounded shadow p-6">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
              <i className="ri-shield-check-line text-purple-500 text-xl"></i>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-800">Relatório de Segurança</h3>
              <p className="text-sm text-gray-500">Status de segurança dos sistemas</p>
            </div>
          </div>
          <button className="w-full px-4 py-2 text-primary border border-primary rounded-button hover:bg-primary hover:text-white transition-colors">
            <i className="ri-download-line mr-2"></i>
            Baixar Relatório
          </button>
        </div>
      </div>
    </div>
  );
};

export default Reports;
