
import React from 'react';
import { QueryFilters } from '@/types/system';

interface QueryBuilderProps {
  queryFilters: QueryFilters;
  onFilterChange: (field: string, value: any) => void;
  onExecuteQuery: () => void;
  onClearFilters: () => void;
  onExportResults: () => void;
}

const QueryBuilder: React.FC<QueryBuilderProps> = ({
  queryFilters,
  onFilterChange,
  onExecuteQuery,
  onClearFilters,
  onExportResults
}) => {
  return (
    <div className="bg-white rounded shadow p-6">
      <div className="flex items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Construtor de Consultas</h3>
        <div className="w-4 h-4 ml-2 text-gray-400 cursor-help flex items-center justify-center" title="Use os filtros abaixo para criar consultas personalizadas com versionamento">
          <i className="ri-question-line"></i>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Filtros de Versionamento */}
        <div className="md:col-span-3">
          <h4 className="text-md font-medium text-gray-900 mb-4">Filtros de Versionamento</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Versão A Partir De</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Ex: 1.0.0"
                value={queryFilters.versionFrom}
                onChange={(e) => onFilterChange('versionFrom', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Versão Até</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Ex: 2.0.0"
                value={queryFilters.versionTo}
                onChange={(e) => onFilterChange('versionTo', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Filtros Existentes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sistema</label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary"
            placeholder="Nome do sistema"
            value={queryFilters.system}
            onChange={(e) => onFilterChange('system', e.target.value)}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Responsável</label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary"
            placeholder="Nome do responsável"
            value={queryFilters.responsible}
            onChange={(e) => onFilterChange('responsible', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Hosting</label>
          <select 
            className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary"
            value={queryFilters.hosting}
            onChange={(e) => onFilterChange('hosting', e.target.value)}
          >
            <option value="">Todos</option>
            <option value="on-premises">On-premises</option>
            <option value="cloudstack">Cloudstack</option>
            <option value="aws">AWS</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Acessível</label>
          <select 
            className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary"
            value={queryFilters.access}
            onChange={(e) => onFilterChange('access', e.target.value)}
          >
            <option value="">Todos</option>
            <option value="interno">Interno</option>
            <option value="publico">Público</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Usuários Nomeados</label>
          <select 
            className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary"
            value={queryFilters.namedUsers}
            onChange={(e) => onFilterChange('namedUsers', e.target.value)}
          >
            <option value="">Todos</option>
            <option value="yes">Sim</option>
            <option value="no">Não</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">SSO Disponível</label>
          <select 
            className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary"
            value={queryFilters.sso}
            onChange={(e) => onFilterChange('sso', e.target.value)}
          >
            <option value="">Todos</option>
            <option value="available">Disponível</option>
            <option value="not-available">Não Disponível</option>
            <option value="in-development">A Desenvolver</option>
            <option value="license-upgrade">Upgrade de Licença</option>
          </select>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          <button 
            onClick={onExecuteQuery}
            className="px-6 py-2 bg-primary text-white rounded-button flex items-center"
          >
            <i className="ri-search-line mr-2"></i>
            Executar Consulta
          </button>
          <button 
            onClick={onClearFilters}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-button flex items-center hover:bg-gray-50 transition-colors"
          >
            <i className="ri-refresh-line mr-2"></i>
            Limpar Filtros
          </button>
        </div>
        <button 
          onClick={onExportResults}
          className="px-4 py-2 text-primary border border-primary rounded-button flex items-center hover:bg-primary hover:text-white transition-colors"
        >
          <i className="ri-download-line mr-2"></i>
          Exportar Resultados
        </button>
      </div>
    </div>
  );
};

export default QueryBuilder;
