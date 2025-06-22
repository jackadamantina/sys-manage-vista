
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  target: string;
  changes: any;
  timestamp: string;
}

const AuditLogs = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadAuditLogs();
  }, []);

  const loadAuditLogs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(100);

      if (error) {
        console.error('Erro ao carregar logs:', error);
        toast({
          title: "Erro",
          description: "Erro ao carregar logs de auditoria",
          variant: "destructive"
        });
        return;
      }

      setLogs(data || []);
    } catch (error) {
      console.error('Erro ao carregar logs:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar logs de auditoria",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter(log => 
    log.action.toLowerCase().includes(filter.toLowerCase()) ||
    log.target.toLowerCase().includes(filter.toLowerCase()) ||
    log.user_id.toLowerCase().includes(filter.toLowerCase())
  );

  const getActionIcon = (action: string) => {
    switch (action.toLowerCase()) {
      case 'login':
        return 'ri-login-box-line';
      case 'logout':
        return 'ri-logout-box-line';
      case 'create':
        return 'ri-add-line';
      case 'update':
        return 'ri-edit-line';
      case 'delete':
        return 'ri-delete-bin-line';
      default:
        return 'ri-information-line';
    }
  };

  const getActionColor = (action: string) => {
    switch (action.toLowerCase()) {
      case 'login':
        return 'text-green-600';
      case 'logout':
        return 'text-blue-600';
      case 'create':
        return 'text-green-600';
      case 'update':
        return 'text-yellow-600';
      case 'delete':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-3 text-gray-600">Carregando logs...</span>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <i className="ri-file-list-3-line mr-2"></i>
          Logs de Auditoria
        </CardTitle>
        <CardDescription>
          Visualize todas as atividades registradas no sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <input
              type="text"
              placeholder="Filtrar logs..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary"
            />
            <div className="text-sm text-gray-500">
              {filteredLogs.length} de {logs.length} logs
            </div>
          </div>

          <div className="space-y-3">
            {filteredLogs.map((log) => (
              <div key={log.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className={`${getActionColor(log.action)} mt-1`}>
                      <i className={`${getActionIcon(log.action)} text-lg`}></i>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium capitalize">{log.action}</span>
                        <span className="text-gray-500">•</span>
                        <span className="text-gray-700">{log.target}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        Usuário: {log.user_id}
                      </div>
                      {log.changes && (
                        <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded mt-2">
                          <pre>{JSON.stringify(log.changes, null, 2)}</pre>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatDate(log.timestamp)}
                  </div>
                </div>
              </div>
            ))}
            
            {filteredLogs.length === 0 && (
              <div className="text-center py-8">
                <i className="ri-file-list-3-line text-4xl text-gray-300 mb-4"></i>
                <p className="text-gray-500">
                  {filter ? 'Nenhum log encontrado com o filtro aplicado' : 'Nenhum log de auditoria encontrado'}
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuditLogs;
