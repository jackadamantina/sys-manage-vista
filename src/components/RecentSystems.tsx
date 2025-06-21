
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface System {
  id: string;
  name: string;
  url: string | null;
  responsible: string | null;
  created_at: string;
  updated_at: string;
}

const RecentSystems = () => {
  const [systems, setSystems] = useState<System[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentSystems();
  }, []);

  const fetchRecentSystems = async () => {
    try {
      const { data, error } = await supabase
        .from('systems_idm')
        .select('id, name, url, responsible, created_at, updated_at')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Erro ao buscar sistemas recentes:', error);
        return;
      }

      setSystems(data || []);
    } catch (error) {
      console.error('Erro ao buscar sistemas recentes:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const getSystemIcon = (index: number) => {
    const icons = [
      { icon: 'ri-database-2-line', bg: 'bg-blue-100', color: 'text-primary' },
      { icon: 'ri-customer-service-2-line', bg: 'bg-purple-100', color: 'text-purple-500' },
      { icon: 'ri-file-chart-line', bg: 'bg-green-100', color: 'text-green-500' },
      { icon: 'ri-settings-3-line', bg: 'bg-orange-100', color: 'text-orange-500' },
      { icon: 'ri-computer-line', bg: 'bg-indigo-100', color: 'text-indigo-500' },
    ];
    return icons[index % icons.length];
  };

  if (loading) {
    return (
      <div className="bg-white rounded shadow">
        <div className="p-5 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Sistemas Recentes</h3>
        </div>
        <div className="p-5">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mt-2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded shadow">
      <div className="p-5 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">Sistemas Recentes</h3>
          <button className="text-sm text-primary hover:text-primary-dark">Ver todos</button>
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
                Responsável
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Criado em
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {systems.map((system, index) => {
              const iconConfig = getSystemIcon(index);
              return (
                <tr key={system.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full ${iconConfig.bg} flex items-center justify-center ${iconConfig.color}`}>
                        <i className={iconConfig.icon}></i>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{system.name}</div>
                        {system.url && (
                          <div className="text-xs text-gray-500">{system.url}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {system.responsible || 'Não definido'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Ativo
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(system.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <button className="text-gray-500 hover:text-primary">
                        <i className="ri-eye-line"></i>
                      </button>
                      <button className="text-gray-500 hover:text-primary">
                        <i className="ri-edit-line"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {systems.length === 0 && (
        <div className="p-5 text-center text-gray-500">
          <i className="ri-database-line text-3xl mb-2"></i>
          <p>Nenhum sistema encontrado</p>
        </div>
      )}
    </div>
  );
};

export default RecentSystems;
