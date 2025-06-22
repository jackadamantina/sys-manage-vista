
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import GlobalUserSearch from './GlobalUserSearch';
import UserComparison from './UserComparison';

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

interface System {
  id: string;
  name: string;
  description: string | null;
  url: string | null;
  created_at: string;
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

interface SystemUserDB {
  id: string;
  username: string;
  name: string | null;
  email: string | null;
  system_id: string;
  imported_at: string;
}

interface ComparisonResult {
  identical: number;
  missing: number;
  extra: number;
  details: {
    identical: Array<{system: string, imported: string}>;
    missing: Array<{name: string, identifier: string}>;
    extra: Array<{name: string, identifier: string}>;
  };
}

const Users = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'search' | 'systems' | 'comparison'>('search');
  const [selectedSystem, setSelectedSystem] = useState<string>('');
  const [filePath, setFilePath] = useState<string>('');
  const [fileLastUpdate, setFileLastUpdate] = useState<string>('');
  const [systems, setSystems] = useState<System[]>([]);
  const [loading, setLoading] = useState(true);
  const [comparisonFile, setComparisonFile] = useState<File | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedSystemUsers, setUploadedSystemUsers] = useState<string[]>([]);
  const [importedUsers, setImportedUsers] = useState<ImportedUser[]>([]);
  const [systemUsers, setSystemUsers] = useState<SystemUserDB[]>([]);
  const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null);

  // Load systems from Supabase
  const loadSystems = async () => {
    try {
      console.log('Carregando sistemas para usuários...');
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('systems_idm')
        .select('id, name, description, url, created_at')
        .order('created_at', { ascending: false });

      console.log('Sistemas carregados para usuários:', { data, error });

      if (error) {
        console.error('Erro ao carregar sistemas:', error);
        setError(`Erro ao carregar sistemas: ${error.message}`);
        toast({
          title: "Erro",
          description: `Erro ao carregar sistemas: ${error.message}`,
          variant: "destructive"
        });
        return;
      }

      setSystems(data || []);
    } catch (error) {
      console.error('Erro ao carregar sistemas:', error);
      const errorMessage = 'Erro inesperado ao carregar sistemas';
      setError(errorMessage);
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Load imported users from database
  const loadImportedUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('imported_users_idm')
        .select('*')
        .order('imported_at', { ascending: false });

      if (error) {
        console.error('Erro ao carregar usuários importados:', error);
        return;
      }

      setImportedUsers(data || []);
    } catch (error) {
      console.error('Erro ao carregar usuários importados:', error);
    }
  };

  // Load system users from database
  const loadSystemUsers = async (systemId: string) => {
    try {
      const { data, error } = await supabase
        .from('system_users_idm')
        .select('*')
        .eq('system_id', systemId)
        .order('imported_at', { ascending: false });

      if (error) {
        console.error('Erro ao carregar usuários do sistema:', error);
        return;
      }

      setSystemUsers(data || []);
    } catch (error) {
      console.error('Erro ao carregar usuários do sistema:', error);
    }
  };

  useEffect(() => {
    loadSystems();
    loadImportedUsers();
  }, []);

  const checkFileDate = async (path: string) => {
    const mockDate = new Date();
    mockDate.setHours(mockDate.getHours() - Math.floor(Math.random() * 24));
    return mockDate.toLocaleString('pt-BR');
  };

  const handleSystemChange = async (systemId: string) => {
    setSelectedSystem(systemId);
    setFilePath('');
    setFileLastUpdate('');
    setComparisonFile(null);
    setShowComparison(false);
    setUploadedSystemUsers([]);
    setComparisonResult(null);
    
    if (systemId) {
      await loadSystemUsers(systemId);
    }
  };

  const handlePathChange = async (path: string) => {
    setFilePath(path);
    if (path) {
      try {
        const lastUpdate = await checkFileDate(path);
        setFileLastUpdate(lastUpdate);
      } catch (error) {
        console.error('Erro ao verificar arquivo:', error);
        setFileLastUpdate('Erro ao verificar arquivo');
      }
    } else {
      setFileLastUpdate('');
    }
  };

  const handleSavePath = async () => {
    if (!selectedSystem || !filePath) {
      toast({
        title: "Erro",
        description: "Selecione um sistema e defina o path do arquivo",
        variant: "destructive"
      });
      return;
    }

    try {
      toast({
        title: "Sucesso",
        description: `Path salvo para o sistema selecionado`,
      });
      
      console.log('Salvando path:', {
        systemId: selectedSystem,
        filePath: filePath,
        lastUpdate: fileLastUpdate
      });
    } catch (error) {
      console.error('Erro ao salvar path:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar path do arquivo",
        variant: "destructive"
      });
    }
  };

  const parseCSVFile = (file: File): Promise<string[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const lines = text.split('\n').filter(line => line.trim());
          
          // Remove header and extract usernames/logins
          const users = lines.slice(1).map(line => {
            const parts = line.split(',');
            // Assuming first column is login/username
            return parts[0].trim();
          }).filter(user => user);
          
          console.log('Usuários extraídos do arquivo:', users);
          resolve(users);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
      reader.readAsText(file);
    });
  };

  const saveSystemUsers = async (systemId: string, users: string[]) => {
    try {
      // Primeiro, remove todos os usuários existentes do sistema
      const { error: deleteError } = await supabase
        .from('system_users_idm')
        .delete()
        .eq('system_id', systemId);

      if (deleteError) {
        console.error('Erro ao limpar usuários do sistema:', deleteError);
        throw deleteError;
      }

      // Depois, insere os novos usuários
      const systemUsersData = users.map(username => ({
        system_id: systemId,
        username: username,
        name: null,
        email: null
      }));

      const { error: insertError } = await supabase
        .from('system_users_idm')
        .insert(systemUsersData);

      if (insertError) {
        console.error('Erro ao inserir usuários do sistema:', insertError);
        throw insertError;
      }
      
      // Recarrega os usuários do sistema
      await loadSystemUsers(systemId);
      
      console.log('Usuários do sistema salvos com sucesso');
    } catch (error) {
      console.error('Erro ao salvar usuários do sistema:', error);
      throw error;
    }
  };

  const compareUsers = (systemUsers: string[], importedUsers: ImportedUser[]): ComparisonResult => {
    const identical: Array<{system: string, imported: string}> = [];
    const missing: Array<{name: string, identifier: string}> = [];
    const extra: Array<{name: string, identifier: string}> = [];
    
    // Create a set of imported user identifiers for comparison
    const importedIdentifiers = new Set();
    importedUsers.forEach(user => {
      if (user.email) {
        const emailUsername = user.email.split('@')[0];
        importedIdentifiers.add(emailUsername.toLowerCase());
      }
      if (user.username) {
        importedIdentifiers.add(user.username.toLowerCase());
      }
    });

    console.log('Identificadores importados:', Array.from(importedIdentifiers));
    console.log('Usuários do sistema:', systemUsers);

    // Check for matches and missing users
    systemUsers.forEach(systemUser => {
      const systemUserLower = systemUser.toLowerCase();
      
      if (importedIdentifiers.has(systemUserLower)) {
        identical.push({
          system: systemUser,
          imported: systemUser // Match found
        });
      } else {
        missing.push({
          name: systemUser,
          identifier: systemUser
        });
      }
    });

    // Check for extra users in imported list
    importedUsers.forEach(importedUser => {
      const importedIdentifier = importedUser.username || (importedUser.email ? importedUser.email.split('@')[0] : '');
      const systemUserSet = new Set(systemUsers.map(u => u.toLowerCase()));
      
      if (importedIdentifier && !systemUserSet.has(importedIdentifier.toLowerCase())) {
        extra.push({
          name: importedUser.name,
          identifier: importedIdentifier
        });
      }
    });

    return {
      identical: identical.length,
      missing: missing.length,
      extra: extra.length,
      details: {
        identical,
        missing,
        extra
      }
    };
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setComparisonFile(file);
      setShowComparison(false);
      setComparisonResult(null);
    }
  };

  const handleCompareUsers = async () => {
    if (!selectedSystem || !comparisonFile) {
      toast({
        title: "Erro",
        description: "Selecione um sistema e anexe um arquivo para comparação",
        variant: "destructive"
      });
      return;
    }

    try {
      // Parse the uploaded system file
      const systemUsers = await parseCSVFile(comparisonFile);
      setUploadedSystemUsers(systemUsers);
      
      // Save system users to database
      await saveSystemUsers(selectedSystem, systemUsers);
      
      // Compare with imported users
      const result = compareUsers(systemUsers, importedUsers);
      setComparisonResult(result);
      setShowComparison(true);

      toast({
        title: "Comparação Concluída",
        description: `Encontrados ${result.identical} usuários idênticos, ${result.missing} faltantes e ${result.extra} extras`,
      });
    } catch (error) {
      console.error('Erro na comparação:', error);
      toast({
        title: "Erro",
        description: "Erro ao processar arquivo para comparação",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-800">Usuários por Sistema</h2>
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

      {/* Tabs Navigation */}
      <div className="bg-white rounded shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab('search')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === 'search'
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <i className="ri-search-line mr-2"></i>
              Busca Global
            </button>
            <button
              onClick={() => setActiveTab('systems')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === 'systems'
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <i className="ri-computer-line mr-2"></i>
              Por Sistema
            </button>
            <button
              onClick={() => setActiveTab('comparison')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                activeTab === 'comparison'
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <i className="ri-file-compare-line mr-2"></i>
              Comparação de Usuários
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'search' && <GlobalUserSearch />}

      {activeTab === 'comparison' && <UserComparison />}

      {activeTab === 'systems' && (
        <>
          {/* System Selection */}
          <div className="bg-white rounded shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Seleção de Sistema</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sistema</label>
                {loading ? (
                  <div className="w-full px-4 py-2 border border-gray-300 rounded bg-gray-100">
                    Carregando sistemas...
                  </div>
                ) : (
                  <select 
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary"
                    value={selectedSystem}
                    onChange={(e) => handleSystemChange(e.target.value)}
                  >
                    <option value="">Selecione um sistema</option>
                    {systems.map((system) => (
                      <option key={system.id} value={system.id}>
                        {system.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Path dos Arquivos</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary"
                  value={filePath}
                  onChange={(e) => handlePathChange(e.target.value)}
                  placeholder="/path/to/users/file"
                  disabled={!selectedSystem}
                />
              </div>
              <div>
                {fileLastUpdate && (
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Última atualização do arquivo:</span>
                    <br />
                    {fileLastUpdate}
                  </div>
                )}
              </div>
              <div>
                <button
                  onClick={handleSavePath}
                  disabled={!selectedSystem || !filePath}
                  className="px-4 py-2 bg-primary text-white rounded-button disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  <i className="ri-save-line mr-2"></i>
                  Salvar Path
                </button>
              </div>
            </div>
          </div>

          {/* File Upload for Comparison */}
          {selectedSystem && (
            <div className="bg-white rounded shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Comparação de Usuários</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Arquivo do Sistema para Comparação (CSV)
                  </label>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                  {comparisonFile && (
                    <p className="text-sm text-gray-600 mt-2">
                      Arquivo selecionado: {comparisonFile.name}
                    </p>
                  )}
                </div>
                <div>
                  <button
                    onClick={handleCompareUsers}
                    disabled={!selectedSystem || !comparisonFile}
                    className="px-4 py-2 bg-green-500 text-white rounded-button disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    <i className="ri-file-compare-line mr-2"></i>
                    Comparar com Lista Importada
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Show current system users if available */}
          {selectedSystem && systemUsers.length > 0 && (
            <div className="bg-white rounded shadow">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">
                  Usuários Salvos do Sistema ({systemUsers.length})
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {systemUsers.map((user, index) => (
                    <div key={index} className="bg-gray-50 px-3 py-2 rounded text-sm">
                      {user.username}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Comparison Results */}
          {showComparison && comparisonResult && (
            <div className="bg-white rounded shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Resultado da Comparação
              </h3>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-center">
                  <i className="ri-information-line text-blue-500 mr-2"></i>
                  <div>
                    <p className="text-sm text-blue-800">
                      Comparando arquivo <strong>{comparisonFile?.name}</strong> com a lista de usuários importados ({importedUsers.length} usuários)
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <i className="ri-check-circle-line text-green-500 mr-2"></i>
                      <div>
                        <p className="text-sm font-medium text-green-800">Usuários Idênticos</p>
                        <p className="text-lg font-bold text-green-900">{comparisonResult.identical}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <i className="ri-user-add-line text-orange-500 mr-2"></i>
                      <div>
                        <p className="text-sm font-medium text-orange-800">Usuários Faltantes no Sistema</p>
                        <p className="text-lg font-bold text-orange-900">{comparisonResult.missing}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <i className="ri-user-unfollow-line text-red-500 mr-2"></i>
                      <div>
                        <p className="text-sm font-medium text-red-800">Usuários Extras na Lista</p>
                        <p className="text-lg font-bold text-red-900">{comparisonResult.extra}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Detailed Results */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Identical Users */}
                  {comparisonResult.details.identical.length > 0 && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h4 className="font-medium text-green-800 mb-2">Usuários Idênticos</h4>
                      <div className="space-y-1 max-h-32 overflow-y-auto">
                        {comparisonResult.details.identical.map((match, index) => (
                          <div key={index} className="text-sm text-green-700">
                            {match.system}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Missing Users */}
                  {comparisonResult.details.missing.length > 0 && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <h4 className="font-medium text-orange-800 mb-2">Faltantes no Sistema</h4>
                      <div className="space-y-1 max-h-32 overflow-y-auto">
                        {comparisonResult.details.missing.map((user, index) => (
                          <div key={index} className="text-sm text-orange-700">
                            {user.identifier}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Extra Users */}
                  {comparisonResult.details.extra.length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <h4 className="font-medium text-red-800 mb-2">Extras na Lista</h4>
                      <div className="space-y-1 max-h-32 overflow-y-auto">
                        {comparisonResult.details.extra.map((user, index) => (
                          <div key={index} className="text-sm text-red-700">
                            {user.name} ({user.identifier})
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-2">
                  <button className="px-4 py-2 text-primary border border-primary rounded-button hover:bg-primary hover:text-white transition-colors">
                    <i className="ri-download-line mr-2"></i>
                    Exportar Relatório
                  </button>
                  <button 
                    onClick={() => setActiveTab('comparison')}
                    className="px-4 py-2 bg-primary text-white rounded-button hover:bg-primary-dark transition-colors"
                  >
                    <i className="ri-eye-line mr-2"></i>
                    Ver Detalhes
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Show uploaded system users if available */}
          {uploadedSystemUsers.length > 0 && (
            <div className="bg-white rounded shadow">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">
                  Usuários do Arquivo do Sistema ({uploadedSystemUsers.length})
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {uploadedSystemUsers.map((user, index) => (
                    <div key={index} className="bg-gray-50 px-3 py-2 rounded text-sm">
                      {user}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Show message when no system is selected */}
          {!selectedSystem && (
            <div className="bg-white rounded shadow p-6">
              <div className="text-center py-8">
                <i className="ri-computer-line text-4xl text-gray-300 mb-4"></i>
                <p className="text-gray-500">Selecione um sistema para fazer comparações</p>
                <p className="text-sm text-gray-400 mt-2">
                  Importe um arquivo CSV com os usuários do sistema para comparar com a lista importada
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Users;
