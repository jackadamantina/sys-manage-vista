
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

  // Mock data para demonstração - dados dos usuários por sistema
  const systemUsersData = [
    {
      systemId: '1',
      systemName: 'Sistema ERP',
      filePath: '/data/systems/erp/users.csv',
      users: [
        { id: 1, name: 'Ricardo Oliveira', email: 'ricardo@empresa.com.br', department: 'TI' },
        { id: 2, name: 'Fernanda Costa', email: 'fernanda@empresa.com.br', department: 'Vendas' },
        { id: 3, name: 'Carlos Silva', email: 'carlos@empresa.com.br', department: 'RH' },
        { id: 4, name: 'Rodrigo Santos', email: 'rodrigo@empresa.com.br', department: 'Financeiro' },
      ]
    },
    {
      systemId: '2',
      systemName: 'CRM',
      filePath: '/data/systems/crm/user_list.json',
      users: [
        { id: 1, name: 'Fernanda Costa', email: 'fernanda@empresa.com.br', role: 'Manager' },
        { id: 2, name: 'Amanda Rodrigues', email: 'amanda@empresa.com.br', role: 'Sales' },
        { id: 3, name: 'João Santos', email: 'joao@empresa.com.br', role: 'Support' },
        { id: 4, name: 'Pedro Rodriguez', email: 'pedro@empresa.com.br', role: 'Admin' },
      ]
    },
    {
      systemId: '3',
      systemName: 'Sistema de Ponto',
      filePath: '/data/systems/timetrack/employees.xml',
      users: [
        { id: 1, name: 'Maria Rodriguez', email: 'maria.rodriguez@empresa.com.br', sector: 'Produção' },
        { id: 2, name: 'José Rodrigues', email: 'jose.rodrigues@empresa.com.br', sector: 'Logística' },
        { id: 3, name: 'Ana Clara', email: 'ana@empresa.com.br', sector: 'Qualidade' },
      ]
    }
  ];

  const loadSystems = async () => {
    try {
      const { data, error } = await supabase
        .from('systems_idm')
        .select('id, name, description, url')
        .order('name', { ascending: true });

      if (error) {
        console.error('Erro ao carregar sistemas:', error);
        return;
      }

      setSystems(data || []);
    } catch (error) {
      console.error('Erro ao carregar sistemas:', error);
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
      // Simular busca nos arquivos dos sistemas
      const results: SearchResult[] = [];
      const searchLower = searchTerm.toLowerCase();

      systemUsersData.forEach(systemData => {
        const matches: { field: string; value: string; matchedText: string; }[] = [];

        systemData.users.forEach(user => {
          // Buscar em todos os campos do usuário
          Object.entries(user).forEach(([field, value]) => {
            if (typeof value === 'string' && value.toLowerCase().includes(searchLower)) {
              matches.push({
                field: field,
                value: value,
                matchedText: value
              });
            }
          });
        });

        if (matches.length > 0) {
          results.push({
            systemId: systemData.systemId,
            systemName: systemData.systemName,
            filePath: systemData.filePath,
            matches: matches
          });
        }
      });

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
                  Tente usar termos diferentes ou verifique se há sistemas configurados
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
                  <li>Digite qualquer termo (nome, email, departamento, etc.)</li>
                  <li>A busca será feita em todos os sistemas configurados</li>
                  <li>Os resultados mostrarão onde cada correspondência foi encontrada</li>
                  <li>Use termos parciais (ex: "rodr" para encontrar "Rodrigo", "Rodriguez", etc.)</li>
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
