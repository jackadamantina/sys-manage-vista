
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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

const Users = () => {
  const { toast } = useToast();
  const [selectedSystem, setSelectedSystem] = useState<string>('');
  const [filePath, setFilePath] = useState<string>('');
  const [fileLastUpdate, setFileLastUpdate] = useState<string>('');
  const [systems, setSystems] = useState<System[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Mock data for demonstration - in real implementation, this would come from file parsing
  const systemUsersData: SystemUserData[] = [
    {
      systemId: 1,
      systemName: 'Sistema ERP',
      filePath: '/data/systems/erp/users.csv',
      lastUpdate: '21/06/2025 10:30',
      users: [
        { id: 1, name: 'Ricardo Oliveira', email: 'ricardo@empresa.com.br', status: 'Ativo', lastAccess: '21/06/2025' },
        { id: 2, name: 'Fernanda Costa', email: 'fernanda@empresa.com.br', status: 'Ativo', lastAccess: '20/06/2025' },
        { id: 3, name: 'Carlos Silva', email: 'carlos@empresa.com.br', status: 'Inativo', lastAccess: '15/06/2025' },
      ]
    },
    {
      systemId: 2,
      systemName: 'CRM',
      filePath: '/data/systems/crm/user_list.json',
      lastUpdate: '20/06/2025 16:45',
      users: [
        { id: 1, name: 'Fernanda Costa', email: 'fernanda@empresa.com.br', status: 'Ativo', lastAccess: '21/06/2025' },
        { id: 2, name: 'Amanda Rodrigues', email: 'amanda@empresa.com.br', status: 'Ativo', lastAccess: '21/06/2025' },
        { id: 3, name: 'João Santos', email: 'joao@empresa.com.br', status: 'Ativo', lastAccess: '19/06/2025' },
      ]
    }
  ];

  // Load systems from Supabase
  const loadSystems = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('systems')
        .select('id, name, description, url, created_at')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao carregar sistemas:', error);
        toast({
          title: "Erro",
          description: "Erro ao carregar sistemas",
          variant: "destructive"
        });
        return;
      }

      setSystems(data || []);
    } catch (error) {
      console.error('Erro ao carregar sistemas:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao carregar sistemas",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSystems();
  }, []);

  // Check file modification date (mock implementation)
  const checkFileDate = async (path: string) => {
    // In a real implementation, this would make an API call to check file stats
    // For now, we'll simulate with a random recent date
    const mockDate = new Date();
    mockDate.setHours(mockDate.getHours() - Math.floor(Math.random() * 24));
    return mockDate.toLocaleString('pt-BR');
  };

  const selectedSystemData = systemUsersData.find(s => s.systemId.toString() === selectedSystem);

  const handleSystemChange = async (systemId: string) => {
    setSelectedSystem(systemId);
    setFilePath('');
    setFileLastUpdate('');
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
      // In a real implementation, you would save this to a database table
      // For now, we'll just show a success message
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-800">Usuários por Sistema</h2>
      </div>

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

      {/* Users Table */}
      {selectedSystemData && (
        <div className="bg-white rounded shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">
                Usuários - {selectedSystemData.systemName}
              </h3>
              <div className="flex space-x-4">
                <button className="px-4 py-2 bg-green-500 text-white rounded-button flex items-center">
                  <i className="ri-refresh-line mr-2"></i>
                  Atualizar Lista
                </button>
                <button className="px-4 py-2 bg-primary text-white rounded-button flex items-center">
                  <i className="ri-download-line mr-2"></i>
                  Exportar
                </button>
              </div>
            </div>
            {filePath && (
              <div className="mt-2 text-sm text-gray-600">
                <span className="font-medium">Arquivo:</span> {filePath}
                {fileLastUpdate && (
                  <span className="ml-4">
                    <span className="font-medium">Atualizado em:</span> {fileLastUpdate}
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuário
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Último Acesso
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {selectedSystemData.users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
                          {user.name.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.status === 'Ativo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.lastAccess}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Show message when no system is selected */}
      {!selectedSystem && (
        <div className="bg-white rounded shadow p-6">
          <div className="text-center py-8">
            <i className="ri-computer-line text-4xl text-gray-300 mb-4"></i>
            <p className="text-gray-500">Selecione um sistema para visualizar os usuários</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
