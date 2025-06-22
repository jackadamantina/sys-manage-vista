
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface HeaderProps {
  title: string;
}

const Header = ({ title }: HeaderProps) => {
  const [alertCount, setAlertCount] = useState(0);

  useEffect(() => {
    fetchAlertsCount();
  }, []);

  const fetchAlertsCount = async () => {
    try {
      const { data: systems, error } = await supabase
        .from('systems_idm')
        .select('id, name, mfa_configuration, password_complexity, named_users, created_at');

      if (error) {
        console.error('Erro ao buscar sistemas para alertas:', error);
        return;
      }

      let alertsCount = 0;

      systems?.forEach((system) => {
        // Alerta para MFA não configurado
        if (!system.mfa_configuration || system.mfa_configuration.toLowerCase().includes('desabilitado')) {
          alertsCount++;
        }

        // Alerta para complexidade de senha não definida
        if (!system.password_complexity) {
          alertsCount++;
        }

        // Alerta para usuários nomeados não configurados
        if (system.named_users === null || system.named_users === false) {
          alertsCount++;
        }
      });

      // Adicionar alerta informativo se houver sistemas
      if (systems && systems.length > 0) {
        alertsCount++; // Alerta de novo sistema
      }

      setAlertCount(Math.min(alertsCount, 99)); // Máximo 99 para exibição
    } catch (error) {
      console.error('Erro ao calcular alertas:', error);
    }
  };

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
