
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ActiveSession {
  id: string;
  user_email: string;
  ip_address: string;
  user_agent: string;
  created_at: string;
  last_seen: string;
  is_current: boolean;
}

const ActiveSessions = () => {
  const [sessions, setSessions] = useState<ActiveSession[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadActiveSessions();
  }, []);

  const loadActiveSessions = async () => {
    try {
      setLoading(true);
      
      // Mock data para demonstração - em produção isso viria de uma tabela de sessões
      const mockSessions: ActiveSession[] = [
        {
          id: '1',
          user_email: 'admin@sistema.com',
          ip_address: '192.168.1.100',
          user_agent: 'Chrome/120.0.0.0',
          created_at: new Date(Date.now() - 3600000).toISOString(),
          last_seen: new Date().toISOString(),
          is_current: true
        },
        {
          id: '2',
          user_email: 'user@sistema.com',
          ip_address: '192.168.1.101',
          user_agent: 'Firefox/119.0',
          created_at: new Date(Date.now() - 7200000).toISOString(),
          last_seen: new Date(Date.now() - 300000).toISOString(),
          is_current: false
        }
      ];
      
      setSessions(mockSessions);
    } catch (error) {
      console.error('Erro ao carregar sessões ativas:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar sessões ativas",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const revokeSession = async (sessionId: string) => {
    try {
      // Em produção, aqui faria a revogação da sessão
      setSessions(prev => prev.filter(s => s.id !== sessionId));
      toast({
        title: "Sucesso",
        description: "Sessão revogada com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao revogar sessão",
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-3 text-gray-600">Carregando sessões...</span>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <i className="ri-computer-line mr-2"></i>
          Sessões Ativas
        </CardTitle>
        <CardDescription>
          Visualize e gerencie todas as sessões ativas no sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sessions.map((session) => (
            <div key={session.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{session.user_email}</span>
                    {session.is_current && (
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                        Sessão Atual
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>IP: {session.ip_address}</div>
                    <div>Navegador: {session.user_agent}</div>
                    <div>Criada em: {formatDate(session.created_at)}</div>
                    <div>Última atividade: {formatDate(session.last_seen)}</div>
                  </div>
                </div>
                {!session.is_current && (
                  <Button
                    onClick={() => revokeSession(session.id)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 border-red-300 hover:bg-red-50"
                  >
                    <i className="ri-logout-box-line mr-1"></i>
                    Revogar
                  </Button>
                )}
              </div>
            </div>
          ))}
          
          {sessions.length === 0 && (
            <div className="text-center py-8">
              <i className="ri-computer-line text-4xl text-gray-300 mb-4"></i>
              <p className="text-gray-500">Nenhuma sessão ativa encontrada</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActiveSessions;
