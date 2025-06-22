
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SystemStat {
  id: string;
  name: string;
  totalUsers: number;
  importedUsers: number;
  discrepancies: number;
  lastUpdate: string;
}

const SystemStats = () => {
  const [systemStats, setSystemStats] = useState<SystemStat[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSystemStats = async () => {
    try {
      setLoading(true);
      
      // Buscar sistemas
      const { data: systems, error: systemsError } = await supabase
        .from('systems_idm')
        .select('id, name, created_at');

      if (systemsError) {
        console.error('Erro ao carregar sistemas:', systemsError);
        return;
      }

      // Buscar total de usuários importados
      const { count: totalImportedUsers, error: importedError } = await supabase
        .from('imported_users_idm')
        .select('*', { count: 'exact', head: true });

      if (importedError) {
        console.error('Erro ao carregar usuários importados:', importedError);
        return;
      }

      // Para cada sistema, buscar estatísticas
      const statsPromises = systems.map(async (system) => {
        // Contar usuários do sistema
        const { count: systemUserCount, error: systemUserError } = await supabase
          .from('system_users_idm')
          .select('*', { count: 'exact', head: true })
          .eq('system_id', system.id);

        if (systemUserError) {
          console.error(`Erro ao carregar usuários do sistema ${system.name}:`, systemUserError);
        }

        // Buscar usuários do sistema para comparação
        const { data: systemUsers, error: systemUsersError } = await supabase
          .from('system_users_idm')
          .select('username')
          .eq('system_id', system.id);

        // Buscar usuários importados para comparação
        const { data: importedUsers, error: importedUsersError } = await supabase
          .from('imported_users_idm')
          .select('username, email');

        let discrepancies = 0;
        
        if (!systemUsersError && !importedUsersError && systemUsers && importedUsers) {
          // Calcular discrepâncias
          const systemUsernames = systemUsers.map(u => u.username.toLowerCase());
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

          // Contar usuários que não estão na lista importada
          discrepancies = systemUsernames.filter(username => 
            !importedIdentifiers.has(username)
          ).length;

          // Adicionar usuários extras da lista importada
          const systemUsernameSet = new Set(systemUsernames);
          importedUsers.forEach(user => {
            const identifier = user.username || (user.email ? user.email.split('@')[0] : '');
            if (identifier && !systemUsernameSet.has(identifier.toLowerCase())) {
              discrepancies++;
            }
          });
        }

        return {
          id: system.id,
          name: system.name,
          totalUsers: systemUserCount || 0,
          importedUsers: totalImportedUsers || 0,
          discrepancies: discrepancies,
          lastUpdate: new Date(system.created_at).toLocaleDateString('pt-BR')
        };
      });

      const stats = await Promise.all(statsPromises);
      setSystemStats(stats);
    } catch (error) {
      console.error('Erro ao carregar estatísticas dos sistemas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSystemStats();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Sistemas Recentes</h3>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Sistemas Recentes</h3>
        <span className="text-sm text-gray-500">{systemStats.length} sistemas</span>
      </div>
      
      <div className="space-y-4">
        {systemStats.slice(0, 5).map((system) => (
          <div key={system.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <div className="flex-1">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium mr-3">
                  {system.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">{system.name}</h4>
                  <p className="text-xs text-gray-500">Atualizado em {system.lastUpdate}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 text-sm">
              <div className="text-center">
                <div className="font-medium text-gray-900">{system.totalUsers}</div>
                <div className="text-xs text-gray-500">Usuários Sistema</div>
              </div>
              
              <div className="text-center">
                <div className="font-medium text-blue-600">{system.importedUsers}</div>
                <div className="text-xs text-gray-500">Usuários Base</div>
              </div>
              
              <div className="text-center">
                <div className={`font-medium ${system.discrepancies > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {system.discrepancies}
                </div>
                <div className="text-xs text-gray-500">Discrepâncias</div>
              </div>
              
              {system.discrepancies > 0 && (
                <div className="flex items-center">
                  <i className="ri-error-warning-line text-red-500 text-lg"></i>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {systemStats.length === 0 && (
          <div className="text-center py-8">
            <i className="ri-computer-line text-4xl text-gray-300 mb-4"></i>
            <p className="text-gray-500">Nenhum sistema encontrado</p>
            <p className="text-sm text-gray-400">Crie um sistema para começar</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemStats;
