
import React, { useState } from 'react';

interface UserDiscrepancy {
  system: string;
  issue: 'missing' | 'extra' | 'mismatch';
  userName: string;
  userEmail: string;
  description: string;
}

const UserComparison = () => {
  const [importedUsers, setImportedUsers] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  const discrepancies: UserDiscrepancy[] = [
    {
      system: 'Sistema ERP',
      issue: 'missing',
      userName: 'Maria Santos',
      userEmail: 'maria@empresa.com.br',
      description: 'Usuário existe na lista importada mas não foi encontrado no sistema'
    },
    {
      system: 'CRM',
      issue: 'extra',
      userName: 'Pedro Silva',
      userEmail: 'pedro@empresa.com.br',
      description: 'Usuário existe no sistema mas não está na lista importada'
    },
    {
      system: 'BI Analytics',
      issue: 'mismatch',
      userName: 'Ana Costa',
      userEmail: 'ana@empresa.com.br',
      description: 'Status do usuário diferente entre lista importada e sistema'
    }
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImportedUsers(file);
    }
  };

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisComplete(true);
    }, 3000);
  };

  const getIssueIcon = (issue: string) => {
    switch (issue) {
      case 'missing':
        return 'ri-user-add-line text-orange-500';
      case 'extra':
        return 'ri-user-unfollow-line text-red-500';
      case 'mismatch':
        return 'ri-error-warning-line text-yellow-500';
      default:
        return 'ri-information-line text-blue-500';
    }
  };

  const getIssueLabel = (issue: string) => {
    switch (issue) {
      case 'missing':
        return 'Usuário Faltante';
      case 'extra':
        return 'Usuário Extra';
      case 'mismatch':
        return 'Divergência';
      default:
        return 'Desconhecido';
    }
  };

  const getIssueBadgeColor = (issue: string) => {
    switch (issue) {
      case 'missing':
        return 'bg-orange-100 text-orange-800';
      case 'extra':
        return 'bg-red-100 text-red-800';
      case 'mismatch':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Importar Lista de Usuários</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Arquivo de Usuários (CSV, Excel, JSON)
            </label>
            <input
              type="file"
              accept=".csv,.xlsx,.xls,.json"
              onChange={handleFileUpload}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary"
            />
            {importedUsers && (
              <p className="text-sm text-gray-600 mt-2">
                Arquivo selecionado: {importedUsers.name}
              </p>
            )}
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={handleAnalyze}
              disabled={!importedUsers || isAnalyzing}
              className="px-4 py-2 bg-primary text-white rounded-button flex items-center disabled:bg-gray-400"
            >
              {isAnalyzing ? (
                <>
                  <i className="ri-loader-4-line mr-2 animate-spin"></i>
                  Analisando...
                </>
              ) : (
                <>
                  <i className="ri-search-eye-line mr-2"></i>
                  Analisar Discrepâncias
                </>
              )}
            </button>

            {analysisComplete && (
              <div className="text-sm text-green-600 flex items-center">
                <i className="ri-check-line mr-1"></i>
                Análise concluída
              </div>
            )}
          </div>
        </div>
      </div>

      {analysisComplete && (
        <div className="bg-white rounded shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">
                Discrepâncias Encontradas ({discrepancies.length})
              </h3>
              <div className="flex space-x-2">
                <button className="px-4 py-2 text-primary border border-primary rounded-button flex items-center hover:bg-primary hover:text-white transition-colors">
                  <i className="ri-download-line mr-2"></i>
                  Exportar Relatório
                </button>
                <button className="px-4 py-2 bg-green-500 text-white rounded-button flex items-center">
                  <i className="ri-check-double-line mr-2"></i>
                  Resolver Todas
                </button>
              </div>
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
                    Tipo de Problema
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuário
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descrição
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {discrepancies.map((discrepancy, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {discrepancy.system}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <i className={`${getIssueIcon(discrepancy.issue)} mr-2`}></i>
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getIssueBadgeColor(discrepancy.issue)}`}>
                          {getIssueLabel(discrepancy.issue)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{discrepancy.userName}</div>
                        <div className="text-sm text-gray-500">{discrepancy.userEmail}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {discrepancy.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-800">
                          <i className="ri-eye-line"></i>
                        </button>
                        <button className="text-green-600 hover:text-green-800">
                          <i className="ri-check-line"></i>
                        </button>
                        <button className="text-red-600 hover:text-red-800">
                          <i className="ri-close-line"></i>
                        </button>
                      </div>
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

export default UserComparison;
