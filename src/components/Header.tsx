
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface HeaderProps {
  title: string;
}

const Header = ({ title }: HeaderProps) => {
  const [alertCount, setAlertCount] = useState(0);

  // Mock data de alertas recentes - deve vir do dashboard
  const recentAlerts = [
    {
      title: 'Arquivo de usuários desatualizado',
      description: 'Sistema ERP - 7 dias sem atualização',
      time: '21/06/2025 - 09:45',
      date: new Date('2025-06-21T09:45:00'),
    },
    {
      title: 'MFA não configurado',
      description: 'Sistema de Helpdesk - Configuração pendente',
      time: '20/06/2025 - 14:23',
      date: new Date('2025-06-20T14:23:00'),
    },
    {
      title: 'Usuários inativos detectados',
      description: 'Portal de RH - 12 usuários sem atividade',
      time: '19/06/2025 - 16:10',
      date: new Date('2025-06-19T16:10:00'),
    },
    {
      title: 'Novo sistema adicionado',
      description: 'Sistema de Gestão de Projetos - Aguardando configuração',
      time: '18/06/2025 - 11:35',
      date: new Date('2025-06-18T11:35:00'),
    },
    {
      title: 'Auditoria de logs concluída',
      description: 'Sistema Financeiro - Sem irregularidades',
      time: '17/06/2025 - 17:22',
      date: new Date('2025-06-17T17:22:00'),
    },
  ];

  useEffect(() => {
    // Ordenar alertas por data mais recente e definir contagem
    const sortedAlerts = recentAlerts.sort((a, b) => b.date.getTime() - a.date.getTime());
    setAlertCount(sortedAlerts.length);
  }, []);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex justify-between items-center px-6 py-4">
        <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>
        
        <div className="flex items-center space-x-4">
          {/* Sino de alertas com contador */}
          <div className="relative">
            <button className="p-2 text-gray-500 hover:text-gray-700 relative">
              <i className="ri-notification-3-line text-xl"></i>
              {alertCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {alertCount}
                </span>
              )}
            </button>
          </div>

          {/* Outros elementos do header */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">U</span>
            </div>
            <div className="text-sm">
              <div className="font-medium text-gray-900">Usuário</div>
              <div className="text-gray-500">Administrador</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
