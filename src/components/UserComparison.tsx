
import React, { useState } from 'react';

interface UserDiscrepancy {
  system: string;
  issue: 'missing' | 'extra' | 'mismatch';
  userName: string;
  userEmail: string;
  description: string;
  matchType?: 'exact' | 'partial' | 'domain';
  similarity?: number;
}

const UserComparison = () => {
  const [importedUsers, setImportedUsers] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [importedData, setImportedData] = useState<any[]>([]);

  // Função para comparação inteligente de usuários
  const compareUsers = (systemUser: string, importedUser: string): { match: boolean; type: string; similarity: number } => {
    // Normalizar strings (remover espaços, converter para minúsculas)
    const normalizeString = (str: string) => str.toLowerCase().trim();
    
    const normalizedSystem = normalizeString(systemUser);
    const normalizedImported = normalizeString(importedUser);
    
    // Comparação exata
    if (normalizedSystem === normalizedImported) {
      return { match: true, type: 'exact', similarity: 100 };
    }
    
    // Comparação por domínio de email
    if (normalizedImported.includes('@')) {
      const importedUsername = normalizedImported.split('@')[0];
      if (normalizedSystem === importedUsername) {
        return { match: true, type: 'domain', similarity: 95 };
      }
      
      // Verificar se o usuário do sistema contém parte do email importado
      if (importedUsername.includes(normalizedSystem) || normalizedSystem.includes(importedUsername)) {
        const similarity = Math.max(
          (normalizedSystem.length / importedUsername.length) * 100,
          (importedUsername.length / normalizedSystem.length) * 100
        );
        if (similarity >= 70) {
          return { match: true, type: 'partial', similarity: Math.round(similarity) };
        }
      }
    }
    
    // Comparação parcial (substring)
    if (normalizedSystem.includes(normalizedImported) || normalizedImported.includes(normalizedSystem)) {
      const similarity = Math.min(normalizedSystem.length, normalizedImported.length) / 
                        Math.max(normalizedSystem.length, normalizedImported.length) * 100;
      if (similarity >= 60) {
        return { match: true, type: 'partial', similarity: Math.round(similarity) };
      }
    }
    
    // Comparação por similaridade de caracteres (Levenshtein simplificado)
    const calculateSimilarity = (str1: string, str2: string): number => {
      const longer = str1.length > str2.length ? str1 : str2;
      const shorter = str1.length > str2.length ? str2 : str1;
      
      if (longer.length === 0) return 100;
      
      const editDistance = levenshteinDistance(longer, shorter);
      return Math.round(((longer.length - editDistance) / longer.length) * 100);
    };
    
    const similarity = calculateSimilarity(normalizedSystem, normalizedImported);
    if (similarity >= 70) {
      return { match: true, type: 'partial', similarity };
    }
    
    return { match: false, type: 'none', similarity: 0 };
  };

  // Função auxiliar para calcular distância de Levenshtein
  const levenshteinDistance = (str1: string, str2: string): number => {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  };

  // Dados de exemplo com comparações mais inteligentes
  const discrepancies: UserDiscrepancy[] = [
    {
      system: 'Sistema ERP',
      issue: 'mismatch',
      userName: 'ro.oliveira',
      userEmail: 'ro.oliveira@allin.com.br',
      description: 'Usuário encontrado com correspondência parcial por domínio de email',
      matchType: 'domain',
      similarity: 95
    },
    {
      system: 'CRM',
      issue: 'mismatch',
      userName: 'pedro.silva',
      userEmail: 'p.silva@empresa.com.br',
      description: 'Correspondência parcial encontrada - possível mesmo usuário',
      matchType: 'partial',
      similarity: 80
    },
    {
      system: 'BI Analytics',
      issue: 'missing',
      userName: 'Ana Costa',
      userEmail: 'ana@empresa.com.br',
      description: 'Usuário existe na lista importada mas não foi encontrado no sistema',
      matchType: 'exact',
      similarity: 0
    }
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Sobrescrever dados anteriores
      setImportedUsers(file);
      setImportedData([]);
      setAnalysisComplete(false);
      console.log('Arquivo anterior foi sobrescrito com:', file.name);
    }
  };

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    
    // Simulação de processamento do arquivo
    setTimeout(() => {
      // Simular dados importados (sobrescrever dados anteriores)
      const newImportedData = [
        { name: 'ro.oliveira@allin.com.br', system: 'Arquivo Importado' },
        { name: 'p.silva@empresa.com.br', system: 'Arquivo Importado' },
        { name: 'ana@empresa.com.br', system: 'Arquivo Importado' }
      ];
      
      setImportedData(newImportedData);
      setIsAnalyzing(false);
      setAnalysisComplete(true);
      
      console.log('Dados anteriores foram sobrescritos. Novos dados importados:', newImportedData);
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
        return 'Correspondência';
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

  const getMatchTypeLabel = (matchType?: string) => {
    switch (matchType) {
      case 'exact':
        return 'Correspondência Exata';
      case 'domain':
        return 'Correspondência por Domínio';
      case 'partial':
        return 'Correspondência Parcial';
      default:
        return 'Sem Correspondência';
    }
  };

  const getMatchTypeBadgeColor = (matchType?: string) => {
    switch (matchType) {
      case 'exact':
        return 'bg-green-100 text-green-800';
      case 'domain':
        return 'bg-blue-100 text-blue-800';
      case 'partial':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
              <div className="mt-2 space-y-1">
                <p className="text-sm text-gray-600">
                  Arquivo selecionado: {importedUsers.name}
                </p>
                <p className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
                  <i className="ri-information-line mr-1"></i>
                  Este arquivo irá sobrescrever os dados anteriores
                </p>
              </div>
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
                  Analisando e Sobrescrevendo...
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
                Análise concluída - Dados sobrescritos
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
                Correspondências Encontradas ({discrepancies.length})
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
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuário
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Correspondência
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getMatchTypeBadgeColor(discrepancy.matchType)}`}>
                          {getMatchTypeLabel(discrepancy.matchType)}
                        </span>
                        {discrepancy.similarity !== undefined && discrepancy.similarity > 0 && (
                          <div className="text-xs text-gray-500">
                            Similaridade: {discrepancy.similarity}%
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {discrepancy.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-800" title="Visualizar detalhes">
                          <i className="ri-eye-line"></i>
                        </button>
                        <button className="text-green-600 hover:text-green-800" title="Confirmar correspondência">
                          <i className="ri-check-line"></i>
                        </button>
                        <button className="text-red-600 hover:text-red-800" title="Rejeitar correspondência">
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
