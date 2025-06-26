import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import StatsCard from './StatsCard';
import SystemStats from './SystemStats';
import RecentAlerts from './RecentAlerts';
import { supabase } from '@/integrations/supabase/client';

interface System {
  id: string;
  name: string;
  mfa_configuration: string | null;
  sso_configuration: string | null;
  logs_status: string | null;
  offboarding_type: string | null;
  password_complexity: string | null;
  named_users: boolean | null;
  created_at: string;
}

const Dashboard = () => {
  const resourceChartRef = useRef<HTMLDivElement>(null);
  const securityChartRef = useRef<HTMLDivElement>(null);
  const [importedUsersCount, setImportedUsersCount] = useState(0);
  const [systems, setSystems] = useState<System[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalSystemUsers, setTotalSystemUsers] = useState(0);

  useEffect(() => {
    fetchImportedUsersCount();
    fetchSystems();
    fetchSystemUsersCount();
  }, []);

  const fetchImportedUsersCount = async () => {
    try {
      const { count, error } = await supabase
        .from('imported_users_idm')
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.error('Erro ao buscar contagem de usuários importados:', error);
        return;
      }

      setImportedUsersCount(count || 0);
    } catch (error) {
      console.error('Erro ao buscar contagem de usuários importados:', error);
    }
  };

  const fetchSystems = async () => {
    try {
      const { data, error } = await supabase
        .from('systems_idm')
        .select('id, name, mfa_configuration, sso_configuration, logs_status, offboarding_type, password_complexity, named_users, created_at');

      if (error) {
        console.error('Erro ao buscar sistemas:', error);
        return;
      }

      setSystems(data || []);
    } catch (error) {
      console.error('Erro ao buscar sistemas:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSystemUsersCount = async () => {
    try {
      const { count, error } = await supabase
        .from('system_users_idm')
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.error('Erro ao buscar contagem de usuários de sistemas:', error);
        return;
      }

      setTotalSystemUsers(count || 0);
    } catch (error) {
      console.error('Erro ao buscar contagem de usuários de sistemas:', error);
    }
  };

  // Calculate statistics from real data - UPDATED
  const totalSystems = systems.length;
  
  // Sistemas COM problemas de segurança (para mostrar percentuais de problemas)
  const systemsWithoutMFA = systems.filter(system => 
    !system.mfa_configuration || 
    system.mfa_configuration.toLowerCase().includes('desabilitado') ||
    system.mfa_configuration.toLowerCase().includes('não configurado')
  ).length;

  const systemsWithoutSSO = systems.filter(system => 
    !system.sso_configuration || 
    system.sso_configuration.toLowerCase() !== 'habilitado'
  ).length;

  const systemsWithoutPasswordComplexity = systems.filter(system => 
    !system.password_complexity || 
    system.password_complexity.toLowerCase().includes('não definida')
  ).length;

  const systemsWithoutNamedUsers = systems.filter(system => 
    system.named_users === null || system.named_users === false
  ).length;

  // Sistemas com configurações adequadas (para gráficos positivos)
  const systemsWithMFA = systems.filter(system => 
    system.mfa_configuration && system.mfa_configuration.toLowerCase().includes('ativo')
  ).length;

  const systemsWithSSO = systems.filter(system => 
    system.sso_configuration && system.sso_configuration.toLowerCase().includes('configurado')
  ).length;

  const systemsWithLogs = systems.filter(system => 
    system.logs_status && system.logs_status.toLowerCase().includes('ativo')
  ).length;

  const systemsWithAutoOffboarding = systems.filter(system => 
    system.offboarding_type && system.offboarding_type.toLowerCase().includes('automático')
  ).length;

  useEffect(() => {
    if (loading || systems.length === 0) return;

    // Resource Distribution Chart - based on systems over months
    if (resourceChartRef.current) {
      const resourceChart = echarts.init(resourceChartRef.current);
      
      // Generate monthly data based on system creation dates
      const monthlyData = generateMonthlySystemData(systems);
      
      const resourceOption = {
        animation: false,
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          textStyle: { color: '#1f2937' }
        },
        legend: {
          data: ['SSO', 'MFA', 'Logs', 'Offboarding Automático'],
          bottom: 0
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '15%',
          top: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
          axisLine: { lineStyle: { color: '#d1d5db' } },
          axisLabel: { color: '#1f2937' }
        },
        yAxis: {
          type: 'value',
          axisLine: { lineStyle: { color: '#d1d5db' } },
          axisLabel: { color: '#1f2937' },
          splitLine: { lineStyle: { color: '#e5e7eb' } }
        },
        series: [
          {
            name: 'SSO',
            type: 'line',
            smooth: true,
            lineStyle: { width: 2, color: 'rgba(87, 181, 231, 1)' },
            areaStyle: {
              color: {
                type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
                colorStops: [
                  { offset: 0, color: 'rgba(87, 181, 231, 0.1)' },
                  { offset: 1, color: 'rgba(87, 181, 231, 0.01)' }
                ]
              }
            },
            data: monthlyData.sso
          },
          {
            name: 'MFA',
            type: 'line',
            smooth: true,
            lineStyle: { width: 2, color: 'rgba(141, 211, 199, 1)' },
            areaStyle: {
              color: {
                type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
                colorStops: [
                  { offset: 0, color: 'rgba(141, 211, 199, 0.1)' },
                  { offset: 1, color: 'rgba(141, 211, 199, 0.01)' }
                ]
              }
            },
            data: monthlyData.mfa
          },
          {
            name: 'Logs',
            type: 'line',
            smooth: true,
            lineStyle: { width: 2, color: 'rgba(251, 191, 114, 1)' },
            areaStyle: {
              color: {
                type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
                colorStops: [
                  { offset: 0, color: 'rgba(251, 191, 114, 0.1)' },
                  { offset: 1, color: 'rgba(251, 191, 114, 0.01)' }
                ]
              }
            },
            data: monthlyData.logs
          },
          {
            name: 'Offboarding Automático',
            type: 'line',
            smooth: true,
            lineStyle: { width: 2, color: 'rgba(252, 141, 98, 1)' },
            areaStyle: {
              color: {
                type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
                colorStops: [
                  { offset: 0, color: 'rgba(252, 141, 98, 0.1)' },
                  { offset: 1, color: 'rgba(252, 141, 98, 0.01)' }
                ]
              }
            },
            data: monthlyData.offboarding
          }
        ]
      };
      resourceChart.setOption(resourceOption);
    }

    // Security Status Chart - UPDATED to show security issues percentages
    if (securityChartRef.current) {
      const securityChart = echarts.init(securityChartRef.current);
      const securityOption = {
        animation: false,
        tooltip: {
          trigger: 'item',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          textStyle: { color: '#1f2937' },
          formatter: function(params: any) {
            const percentage = totalSystems > 0 ? ((params.value / totalSystems) * 100).toFixed(1) : '0';
            return `${params.seriesName}<br/>${params.name}: ${params.value} (${percentage}%)`;
          }
        },
        legend: {
          orient: 'vertical',
          right: 10,
          top: 'center',
          data: ['MFA Desabilitado', 'SSO Não Habilitado', 'Sem Complexidade de Senha', 'Sem Usuários Nomeados']
        },
        series: [{
          name: 'Problemas de Segurança',
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['40%', '50%'],
          avoidLabelOverlap: false,
          itemStyle: { borderRadius: 8, borderColor: '#fff', borderWidth: 2 },
          label: { 
            show: true,
            formatter: function(params: any) {
              const percentage = totalSystems > 0 ? ((params.value / totalSystems) * 100).toFixed(1) : '0';
              return `${percentage}%`;
            }
          },
          emphasis: { label: { show: true, fontSize: '14', fontWeight: 'bold' } },
          labelLine: { show: false },
          data: [
            { 
              value: systemsWithoutMFA, 
              name: 'MFA Desabilitado', 
              itemStyle: { color: 'rgba(239, 68, 68, 1)' } 
            },
            { 
              value: systemsWithoutSSO, 
              name: 'SSO Não Habilitado', 
              itemStyle: { color: 'rgba(245, 158, 11, 1)' } 
            },
            { 
              value: systemsWithoutPasswordComplexity, 
              name: 'Sem Complexidade de Senha', 
              itemStyle: { color: 'rgba(249, 115, 22, 1)' } 
            },
            { 
              value: systemsWithoutNamedUsers, 
              name: 'Sem Usuários Nomeados', 
              itemStyle: { color: 'rgba(156, 163, 175, 1)' } 
            }
          ]
        }]
      };
      securityChart.setOption(securityOption);
    }
  }, [systems, loading, totalSystems, systemsWithoutMFA, systemsWithoutSSO, systemsWithoutPasswordComplexity, systemsWithoutNamedUsers]);

  const generateMonthlySystemData = (systems: System[]) => {
    const currentYear = new Date().getFullYear();
    const monthlyCount = {
      sso: new Array(12).fill(0),
      mfa: new Array(12).fill(0),
      logs: new Array(12).fill(0),
      offboarding: new Array(12).fill(0)
    };

    systems.forEach(system => {
      const createdDate = new Date(system.created_at);
      if (createdDate.getFullYear() === currentYear) {
        const month = createdDate.getMonth();
        
        // Accumulate counts for each month
        for (let i = month; i < 12; i++) {
          if (system.sso_configuration && system.sso_configuration.toLowerCase().includes('configurado')) {
            monthlyCount.sso[i]++;
          }
          if (system.mfa_configuration && system.mfa_configuration.toLowerCase().includes('ativo')) {
            monthlyCount.mfa[i]++;
          }
          if (system.logs_status && system.logs_status.toLowerCase().includes('ativo')) {
            monthlyCount.logs[i]++;
          }
          if (system.offboarding_type && system.offboarding_type.toLowerCase().includes('automático')) {
            monthlyCount.offboarding[i]++;
          }
        }
      }
    });

    return monthlyCount;
  };

  const statsData = [
    {
      title: 'Total de Sistemas',
      value: totalSystems.toString(),
      icon: 'ri-apps-line',
      iconBg: 'bg-blue-100',
      iconColor: 'text-primary',
      change: '+2',
      changeText: 'novos sistemas este mês',
      isPositive: true,
    },
    {
      title: 'Usuários na Base',
      value: importedUsersCount.toLocaleString('pt-BR'),
      icon: 'ri-user-line',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-500',
      change: importedUsersCount > 0 ? 'Base da verdade' : 'Importar usuários',
      changeText: 'usuários importados',
      isPositive: true,
    },
    {
      title: 'Usuários em Sistemas',
      value: totalSystemUsers.toLocaleString('pt-BR'),
      icon: 'ri-computer-line',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-500',
      change: totalSystemUsers > 0 ? 'Dados carregados' : 'Nenhum sistema',
      changeText: 'usuários em sistemas',
      isPositive: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsData.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded shadow p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Distribuição de Recursos</h3>
          </div>
          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="animate-pulse text-gray-500">Carregando dados...</div>
            </div>
          ) : (
            <div ref={resourceChartRef} className="h-64"></div>
          )}
        </div>

        <div className="bg-white rounded shadow p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Problemas de Segurança</h3>
            <div className="text-sm text-gray-600">
              Total de sistemas: {totalSystems}
            </div>
          </div>
          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="animate-pulse text-gray-500">Carregando dados...</div>
            </div>
          ) : (
            <div ref={securityChartRef} className="h-64"></div>
          )}
        </div>
      </div>

      {/* Recent Systems and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SystemStats />
        </div>
        <div>
          <RecentAlerts />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
