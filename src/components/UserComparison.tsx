import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UserDiscrepancy {
  system: string;
  issue: 'missing' | 'extra' | 'mismatch';
  userName: string;
  userEmail: string;
  description: string;
  matchType?: 'exact' | 'partial' | 'domain';
  similarity?: number;
}

interface ImportedUser {
  id: string;
  name: string;
  email: string | null;
  username: string | null;
  department: string | null;
  status: string | null;
  imported_at: string;
}

const UserComparison = () => {
  const [importedUsers, setImportedUsers] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [importedData, setImportedData] = useState<ImportedUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchImportedUsers();
  }, []);

  const fetchImportedUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('imported_users_idm')
        .select('*')
        .order('imported_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar usuários importados:', error);
        return;
      }

      setImportedData(data || []);
    } catch (error) {
      console.error('Erro ao buscar usuários importados:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveImportedUsers = async (users: any[]) => {
    try {
      // Primeiro, deletar todos os usuários existentes para sobrescrever
      const { error: deleteError } = await supabase
        .from('imported_users_idm')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Deletar todos

      if (deleteError) {
        console.error('Erro ao limpar usuários existentes:', deleteError);
        return false;
      }

      // Inserir novos usuários
      const usersToInsert = users.map(user => ({
        name: user.name || user.email || 'Usuário sem nome',
        email: user.email || null,
        username: user.username || null,
        department: user.department || null,
        status: 'active'
      }));

      const { error: insertError } = await supabase
        .from('imported_users_idm')
        .insert(usersToInsert);

      if (insertError) {
        console.error('Erro ao salvar usuários:', insertError);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erro ao salvar usuários importados:', error);
      return false;
    }
  };

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
      setImportedUsers(file);
      setAnalysisComplete(false);
      console.log('Arquivo selecionado:', file.name);
    }
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    
    try {
      // Simular processamento do arquivo e criação de dados de exemplo
      const newImportedData = [
        { 
          name: 'Ricardo Oliveira', 
          email: 'ro.oliveira@allin.com.br',
          username: 'ro.oliveira',
          department: 'TI'
        },
        { 
          name: 'Pedro Silva', 
          email: 'p.silva@empresa.com.br',
          username: 'p.silva',
          department: 'Vendas'
        },
        { 
          name: 'Ana Costa', 
          email: 'ana@empresa.com.br',
          username: 'ana.costa',
          department: 'RH'
        }
      ];
      
      // Salvar no banco de dados (sobrescrever dados anteriores)
      const success = await saveImportedUsers(newImportedData);
      
      if (success) {
        // Buscar dados atualizados do banco
        await fetchImportedUsers();
        setAnalysisComplete(true);
        console.log('Usuários importados e salvos no banco de dados com sucesso');
      } else {
        console.error('Erro ao salvar usuários no banco de dados');
      }
    } catch (error) {
      console.error('Erro durante a análise:', error);
    } finally {
      setIsAnalyzing(false);
    }
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

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-pulse text-gray-500">Carregando...</div>
      </div>
    );
  }

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
                  Este arquivo irá sobrescrever os dados anteriores no banco de dados
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
                  Processando e Salvando...
                </>
              ) : (
                <>
                  <i className="ri-upload-line mr-2"></i>
                  Importar e Salvar Usuários
                </>
              )}
            </button>

            {analysisComplete && (
              <div className="text-sm text-green-600 flex items-center">
                <i className="ri-check-line mr-1"></i>
                Usuários salvos no banco de dados
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mostrar usuários importados do banco de dados */}
      <div className="bg-white rounded shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">
              Usuários Importados ({importedData.length})
            </h3>
            <div className="text-sm text-gray-500">
              Base da verdade para comparações
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuário
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Departamento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Importado em
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {importedData.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {user.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.email || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.username || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.department || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.imported_at).toLocaleDateString('pt-BR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {importedData.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            <i className="ri-user-line text-3xl mb-2"></i>
            <p>Nenhum usuário importado ainda</p>
            <p className="text-sm">Importe um arquivo para começar</p>
          </div>
        )}
      </div>

      {/* Seção de discrepâncias (mantida para compatibilidade) */}
      {analysisComplete && (
        <div className="bg-white rounded shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">
              Análise de Discrepâncias
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Comparação entre usuários importados e sistemas existentes
            </p>
          </div>
          <div className="p-6">
            <div className="text-center text-gray-500">
              <i className="ri-search-line text-3xl mb-2"></i>
              <p>Funcionalidade de comparação será implementada em breve</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserComparison;
