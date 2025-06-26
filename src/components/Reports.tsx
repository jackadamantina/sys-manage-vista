
import React from 'react';
import { useVersioning } from '../hooks/useVersioning';
import { useReports } from '../hooks/useReports';
import VersionInfoComponent from './VersionInfo';
import QueryBuilder from './QueryBuilder';
import SystemsTable from './SystemsTable';
import ReportActions from './ReportActions';

const Reports = () => {
  const { currentVersion } = useVersioning();
  const {
    systems,
    filteredSystems,
    loading,
    queryExecuted,
    error,
    queryFilters,
    loadSystems,
    handleFilterChange,
    executeQuery,
    clearFilters
  } = useReports();

  const reportActions = ReportActions({
    systems,
    filteredSystems,
    queryExecuted
  });

  const systemsToDisplay = queryExecuted ? filteredSystems : systems;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-800">Relatórios</h2>
        <button 
          onClick={reportActions.generateCompleteReport}
          className="px-4 py-2 bg-primary text-white rounded-button flex items-center"
        >
          <i className="ri-file-chart-line mr-2"></i>
          Gerar Relatório
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <i className="ri-error-warning-line text-red-400"></i>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Erro ao carregar dados
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
                <button 
                  onClick={loadSystems}
                  className="mt-2 text-sm text-red-600 hover:text-red-500 underline"
                >
                  Tentar carregar novamente
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <VersionInfoComponent versionInfo={currentVersion} />

      <QueryBuilder
        queryFilters={queryFilters}
        onFilterChange={handleFilterChange}
        onExecuteQuery={executeQuery}
        onClearFilters={clearFilters}
        onExportResults={reportActions.exportResultsToCSV}
      />

      <SystemsTable
        systems={systemsToDisplay}
        loading={loading}
        queryExecuted={queryExecuted}
        onRefresh={loadSystems}
      />
    </div>
  );
};

export default Reports;
