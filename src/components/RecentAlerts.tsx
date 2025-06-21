
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface System {
  id: string;
  name: string;
  mfa_configuration: string | null;
  password_complexity: string | null;
  named_users: boolean | null;
  created_at: string;
}

interface Alert {
  title: string;
  description: string;
  time: string;
  date: Date;
  icon: string;
  iconBg: string;
  iconColor: string;
}

const RecentAlerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSystemsAndGenerateAlerts();
  }, []);

  const fetchSystemsAndGenerateAlerts = async () => {
    try {
      const { data: systems, error } = await supabase
        .from('systems_idm')
        .select('id, name, mfa_configuration, password_complexity, named_users, created_at')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar sistemas:', error);
        return;
      }

      const generatedAlerts: Alert[] = [];

      systems?.forEach((system: System) => {
        const systemDate = new Date(system.created_at);
        
        // Alerta para MFA não configurado
        if (!system.mfa_configuration || system.mfa_configuration.toLowerCase().includes('desabilitado')) {
          generatedAlerts.push({
            title: 'MFA não configurado',
            description: `${system.name} - Configuração de MFA pendente`,
            time: systemDate.toLocaleString('pt-BR'),
            date: systemDate,
            icon: 'ri-shield-keyhole-line',
            iconBg: 'bg-yellow-100',
            iconColor: 'text-yellow-500',
          });
        }

        // Alerta para complexidade de senha não definida
        if (!system.password_complexity) {
          generatedAlerts.push({
            title: 'Complexidade de senha não definida',
            description: `${system.name} - Política de senha não configurada`,
            time: systemDate.toLocaleString('pt-BR'),
            date: systemDate,
            icon: 'ri-lock-password-line',
            iconBg: 'bg-orange-100',
            iconColor: 'text-orange-500',
          });
        }

        // Alerta para usuários nomeados não configurados
        if (system.named_users === null || system.named_users === false) {
          generatedAlerts.push({
            title: 'Usuários nomeados não configurados',
            description: `${system.name} - Configuração de usuários nomeados pendente`,
            time: systemDate.toLocaleString('pt-BR'),
            date: systemDate,
            icon: 'ri-user-unfollow-line',
            iconBg: 'bg-red-100',
            iconColor: 'text-red-500',
          });
        }
      });

      // Adicionar alguns alertas informativos se houver sistemas
      if (systems && systems.length > 0) {
        const latestSystem = systems[0];
        generatedAlerts.push({
          title: 'Novo sistema adicionado',
          description: `${latestSystem.name} - Aguardando configuração completa`,
          time: new Date(latestSystem.created_at).toLocaleString('pt-BR'),
          date: new Date(latestSystem.created_at),
          icon: 'ri-information-line',
          iconBg: 'bg-blue-100',
          iconColor: 'text-blue-500',
        });
      }

      // Ordenar por data mais recente
      const sortedAlerts = generatedAlerts
        .sort((a, b) => b.date.getTime() - a.date.getTime())
        .slice(0, 5); // Mostrar apenas os 5 mais recentes

      setAlerts(sortedAlerts);
    } catch (error) {
      console.error('Erro ao gerar alertas:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDateForDisplay = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      return 'Hoje';
    } else if (diffDays === 2) {
      return 'Ontem';
    } else if (diffDays <= 7) {
      return `${diffDays - 1} dias atrás`;
    } else {
      return date.toLocaleDateString('pt-BR');
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded shadow">
        <div className="p-5 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Alertas Recentes</h3>
        </div>
        <div className="p-5">
          <div className="animate-pulse text-gray-500">Carregando alertas...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded shadow">
      <div className="p-5 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">Alertas Recentes</h3>
          <button className="text-sm text-primary hover:text-primary-dark">Ver todos</button>
        </div>
      </div>
      <div className="p-5 space-y-4">
        {alerts.length === 0 ? (
          <div className="text-center text-gray-500 py-4">
            <i className="ri-check-double-line text-2xl mb-2"></i>
            <p>Nenhum alerta no momento</p>
            <p className="text-sm">Todos os sistemas estão configurados corretamente</p>
          </div>
        ) : (
          alerts.map((alert, index) => (
            <div key={index} className="flex items-start">
              <div className={`w-8 h-8 rounded-full ${alert.iconBg} flex items-center justify-center ${alert.iconColor} mt-1`}>
                <i className={alert.icon}></i>
              </div>
              <div className="ml-3 flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{alert.title}</p>
                    <p className="text-xs text-gray-500">{alert.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">{formatDateForDisplay(alert.date)}</p>
                    <p className="text-xs text-gray-300 mt-1">{alert.time}</p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentAlerts;
