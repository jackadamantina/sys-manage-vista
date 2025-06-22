import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Search } from 'lucide-react';
import { Input } from './ui/input';

interface System {
  id: string;
  name: string;
  description: string | null;
  url: string | null;
}

interface SearchResult {
  systemId: string;
  systemName: string;
  filePath: string;
  matches: {
    field: string;
    value: string;
    matchedText: string;
  }[];
}

const GlobalUserSearch = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [systems, setSystems] = useState<System[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSystems = async () => {
    try {
      console.log('Carregando sistemas para busca global...');
      setError(null);
      
      const { data, error } = await supabase
        .from('systems_idm')
        .select('id, name, description, url')
        .order('name', { ascending: true });

      console.log('Sistemas carregados para busca:', { data, error });

      if (error) {
        console.error('Erro ao carregar sistemas:', error);
        setError(`Erro ao carregar sistemas: ${error.message}`);
        return;
      }

      setSystems(data || []);
    } catch (error) {
      console.error('Erro ao carregar sistemas:', error);
      setError('Erro inesperado ao carregar sistemas');
    }
  };

  useEffect(() => {
    loadSystems();
  }, []);

  const performSearch = async () => {
    if (!searchTerm.trim()) {
      toast({
        title: "Aviso",
        description: "Digite um termo para buscar",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    setHasSearched(true);
    
    try {
      console.log('Iniciando busca por:', searchTerm);
      const results: SearchResult[] = [];
      const searchLower = searchTerm.toLowerCase();

      // Buscar em usuários importados gerais
      const { data: importedUsers, error: importedError } = await supabase
        .from('imported_users_idm')
        .select('*');

      if (importedError) {
        console.error('Erro ao buscar usuários importados:', importedError);
        throw importedError;
      }

      console.log('Usuários importados encontrados:', importedUsers?.length || 0);

      // Processar usuários importados gerais
      if (importedUsers && importedUsers.length > 0) {
        const generalMatches: { field: string; value: string; matchedText: string; }[] = [];

        importedUsers.forEach(user => {
          // Buscar em todos os campos do usuário
          Object.entries(user).forEach(([field, value]) => {
            if (typeof value === 'string' && value.toLowerCase().includes(searchLower)) {
              generalMatches.push({
                field: field === 'name' ? 'Nome' : 
                       field === 'email' ? 'Email' : 
                       field === 'username' ? 'Usuário' : 
                       field === 'department' ? 'Departamento' : field,
                value: value,
                matchedText: value
              });
            }
          });
        });

        if (generalMatches.length > 0) {
          results.push({
            systemId: 'general',
            systemName: 'Usuários Importados (Geral)',
            filePath: '/data/imported_users/general.csv',
            matches: generalMatches
          });
        }
      }

      // Buscar em usuários específicos de sistemas
      const { data: systemUsers, error: systemUsersError } = await supabase
        .from('system_users_idm')
        .select(`
          *,
          systems_idm!inner(name)
        `);

      if (systemUsersError) {
        console.error('Erro ao buscar usuários de sistemas:', systemUsersError);
        throw systemUsersError;
      }

      console.log('Usuários de sistemas encontrados:', systemUsers?.length || 0);

      // Agrupar usuários por sistema
      const usersBySystem = systemUsers?.reduce((acc, user) => {
        const systemId = user.system_id;
        const systemName = user.systems_idm?.name || 'Sistema Desconhecido';
        
        if (!acc[systemId]) {
          acc[systemId] = {
            systemName,
            users: []
          };
        }
        acc[systemId].users.push(user);
        return acc;
      }, {} as Record<string, { systemName: string; users: any[] }>) || {};

      // Processar usuários de cada sistema
      Object.entries(usersBySystem).forEach(([systemId, systemData]) => {
        const matches: { field: string; value: string; matchedText: string; }[] = [];

        systemData.users.forEach(user => {
          // Buscar em todos os campos do usuário
          Object.entries(user).forEach(([field, value]) => {
            if (typeof value === 'string' && value.toLowerCase().includes(searchLower)) {
              // Pular campos internos
              if (['id', 'system_id', 'created_at', 'updated_at', 'imported_at'].includes(field)) {
                return;
              }
              
              matches.push({
                field: field === 'name' ? 'Nome' : 
                       field === 'email' ? 'Email' : 
                       field === 'username' ? 'Usuário' : field,
                value: value,
                matchedText: value
              });
            }
          });
        });

        if (matches.length > 0) {
          results.push({
            systemId: systemId,
            systemName: systemData.systemName,
            filePath: `/data/systems/${systemData.systemName.toLowerCase().replace(/\s+/g, '_')}/users.csv`,
            matches: matches
          });
        }
      });

      console.log('Resultados da busca:', results);
      setSearchResults(results);

      toast({
        title: "Busca Concluída",
        description: `Encontrados ${results.length} sistema(s) com correspondências`,
      });

    } catch (error) {
      console.error('Erro na busca:', error);
      toast({
        title: "Erro",
        description: "Erro ao executar a busca",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
    setHasSearched(false);
  };

  const highlightMatch = (text: string, searchTerm: string) => {
    if (!searchTerm) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <span key={index} className="bg-yellow-200 font-semibold">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-800">Busca Global de Usuários</h2>
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

      {/* Campo de Busca */}
      <div className="bg-white rounded shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Buscar Usuários em Todos os Sistemas</h3>
        <div className="flex space-x-4">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Digite o nome, email ou qualquer informação do usuário..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && performSearch()}
              className="w-full"
            />
          </div>
          <button
            onClick={performSearch}
            disabled={loading}
            className="px-6 py-2 bg-primary text-white rounded-button disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <Search className="w-4 h-4 mr-2" />
            {loading ? 'Buscando...' : 'Buscar'}
          </button>
          {hasSearched && (
            <button
              onClick={clearSearch}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-button hover:bg-gray-50 transition-colors"
            >
              Limpar
            </button>
          )}
        </div>
      </div>

      {/* Resultados da Busca */}
      {hasSearched && (
        <div className="bg-white rounded shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">
              Resultados da Busca
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {searchResults.length > 0 
                ? `${searchResults.length} sistema(s) encontrado(s) com correspondências para "${searchTerm}"`
                : `Nenhum resultado encontrado para "${searchTerm}"`
              }
            </p>
          </div>

          <div className="p-6">
            {searchResults.length === 0 ? (
              <div className="text-center py-8">
                <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Nenhum usuário encontrado com os termos buscados</p>
                <p className="text-sm text-gray-400 mt-2">
                  Tente usar termos diferentes ou verifique se há usuários importados
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {searchResults.map((result, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">
                          {result.systemName}
                        </h4>
                        <p className="text-sm text-gray-500">
                          <span className="font-medium">Arquivo:</span> {result.filePath}
                        </p>
                      </div>
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        {result.matches.length} correspondência(s)
                      </span>
                    </div>

                    <div className="space-y-2">
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Correspondências encontradas:</h5>
                      {result.matches.map((match, matchIndex) => (
                        <div key={matchIndex} className="bg-gray-50 p-3 rounded border-l-4 border-blue-400">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <span className="text-sm font-medium text-gray-600 capitalize">
                                {match.field}:
                              </span>
                              <div className="text-sm text-gray-900 mt-1">
                                {highlightMatch(match.value, searchTerm)}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Informações sobre a Busca */}
      {!hasSearched && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <i className="ri-information-line text-blue-400"></i>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Como usar a busca global
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <ul className="list-disc pl-5 space-y-1">
                  <li>Digite qualquer termo (nome, email, usuário, etc.)</li>
                  <li>A busca será feita em todos os usuários importados</li>
                  <li>Os resultados mostrarão onde cada correspondência foi encontrada</li>
                  <li>Use termos parciais (ex: "joão" para encontrar "João Silva", etc.)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GlobalUserSearch;
