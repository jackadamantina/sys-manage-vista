
import React from 'react';

const RecentAlerts = () => {
  const alerts = [
    {
      title: 'Arquivo de usuários desatualizado',
      description: 'Sistema ERP - 7 dias sem atualização',
      time: '21/06/2025 - 09:45',
      icon: 'ri-error-warning-line',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-500',
    },
    {
      title: 'MFA não configurado',
      description: 'Sistema de Helpdesk - Configuração pendente',
      time: '20/06/2025 - 14:23',
      icon: 'ri-shield-keyhole-line',
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-500',
    },
    {
      title: 'Usuários inativos detectados',
      description: 'Portal de RH - 12 usuários sem atividade',
      time: '19/06/2025 - 16:10',
      icon: 'ri-user-unfollow-line',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-500',
    },
    {
      title: 'Novo sistema adicionado',
      description: 'Sistema de Gestão de Projetos - Aguardando configuração',
      time: '18/06/2025 - 11:35',
      icon: 'ri-information-line',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-500',
    },
    {
      title: 'Auditoria de logs concluída',
      description: 'Sistema Financeiro - Sem irregularidades',
      time: '17/06/2025 - 17:22',
      icon: 'ri-check-double-line',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-500',
    },
  ];

  return (
    <div className="bg-white rounded shadow">
      <div className="p-5 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">Alertas Recentes</h3>
          <button className="text-sm text-primary hover:text-primary-dark">Ver todos</button>
        </div>
      </div>
      <div className="p-5 space-y-4">
        {alerts.map((alert, index) => (
          <div key={index} className="flex items-start">
            <div className={`w-8 h-8 rounded-full ${alert.iconBg} flex items-center justify-center ${alert.iconColor} mt-1`}>
              <i className={alert.icon}></i>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{alert.title}</p>
              <p className="text-xs text-gray-500">{alert.description}</p>
              <p className="text-xs text-gray-400 mt-1">{alert.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentAlerts;
