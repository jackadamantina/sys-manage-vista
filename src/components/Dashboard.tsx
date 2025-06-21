import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import StatsCard from './StatsCard';
import RecentSystems from './RecentSystems';
import RecentAlerts from './RecentAlerts';
import { supabase } from '@/integrations/supabase/client';

interface System {
  id: string;
  name: string;
  mfa_configuration: string | null;
  sso_configuration: string | null;
  logs_status: string | null;
  offboarding_type: string | null;
  created_at: string;
}

const Dashboard = () => {
  const resourceChartRef = useRef<HTMLDivElement>(null);
  const securityChartRef = useRef<HTMLDivElement>(null);
  const [importedUsersCount, setImportedUsersCount] = useState(0);
  const [systems, setSystems] = useState<System[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchImportedUsersCount();
    fetchSystems();
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
        .select('id, name, mfa_configuration, sso_configuration, logs_status, offboarding_type, created_at');

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

  // Calculate statistics from real data
  const totalSystems = systems.length;
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

    // Security Status Chart - based on real system data
    if (securityChartRef.current) {
      const securityChart = echarts.init(securityChartRef.current);
      const securityOption = {
        animation: false,
        tooltip: {
          trigger: 'item',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          textStyle: { color: '#1f2937' },
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          right: 10,
          top: 'center',
          data: ['MFA Ativo', 'SSO Configurado', 'Logs Ativos', 'Offboarding Automático']
        },
        series: [{
          name: 'Status de Segurança',
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['40%', '50%'],
          avoidLabelOverlap: false,
          itemStyle: { borderRadius: 8, borderColor: '#fff', borderWidth: 2 },
          label: { show: false, position: 'center' },
          emphasis: { label: { show: true, fontSize: '14', fontWeight: 'bold' } },
          labelLine: { show: false },
          data: [
            { value: systemsWithMFA, name: 'MFA Ativo', itemStyle: { color: 'rgba(87, 181, 231, 1)' } },
            { value: systemsWithSSO, name: 'SSO Configurado', itemStyle: { color: 'rgba(141, 211, 199, 1)' } },
            { value: systemsWithLogs, name: 'Logs Ativos', itemStyle: { color: 'rgba(251, 191, 114, 1)' } },
            { value: systemsWithAutoOffboarding, name: 'Offboarding Automático', itemStyle: { color: 'rgba(252, 141, 98, 1)' } }
          ]
        }]
      };
      securityChart.setOption(securityOption);
    }
  }, [systems, loading]);

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
      title: 'Usuários Ativos',
      value: importedUsersCount.toLocaleString('pt-BR'),
      icon: 'ri-user-line',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-500',
      change: importedUsersCount > 0 ? 'Base da verdade' : 'Importar usuários',
      changeText: 'usuários na base de dados',
      isPositive: true,
    },
    {
      title: 'Sistemas com MFA',
      value: systemsWithMFA.toString(),
      icon: 'ri-shield-check-line',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-500',
      change: totalSystems > 0 ? `${Math.round((systemsWithMFA / totalSystems) * 100)}%` : '0%',
      changeText: 'dos sistemas totais',
      isPositive: true,
    },
    {
      title: 'Discrepâncias de Usuários',
      value: '3',
      icon: 'ri-error-warning-line',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-500',
      change: '',
      changeText: 'sistemas precisam análise',
      isPositive: false,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded shadow p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Distribuição de Recursos</h3>
            <div className="flex space-x-2">
              <button className="text-xs px-3 py-1 bg-gray-100 text-gray-600 rounded-full">
                Mensal
              </button>
              <button className="text-xs px-3 py-1 bg-primary text-white rounded-full">
                Anual
              </button>
            </div>
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
            <h3 className="text-lg font-semibold text-gray-800">Status de Segurança</h3>
            <div className="flex space-x-2">
              <button className="text-xs px-3 py-1 bg-gray-100 text-gray-600 rounded-full">
                Trimestral
              </button>
              <button className="text-xs px-3 py-1 bg-primary text-white rounded-full">
                Atual
              </button>
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
          <RecentSystems />
        </div>
        <div>
          <RecentAlerts />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
