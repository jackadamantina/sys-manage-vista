
import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import StatsCard from './StatsCard';
import RecentSystems from './RecentSystems';
import RecentAlerts from './RecentAlerts';

const Dashboard = () => {
  const resourceChartRef = useRef<HTMLDivElement>(null);
  const securityChartRef = useRef<HTMLDivElement>(null);

  // Mock data for systems - in real app this would come from API/database
  const systems = [
    {
      id: 1,
      name: 'Sistema de RH',
      description: 'Sistema para gestão de recursos humanos da empresa',
      url: 'https://rh.empresa.com',
      createdAt: '2024-01-15',
      totalUsers: 145,
      mfaEnabled: true
    },
    {
      id: 2,
      name: 'Portal Financeiro',
      description: 'Portal para controle e gestão financeira',
      url: 'https://financeiro.empresa.com',
      createdAt: '2024-02-20',
      totalUsers: 89,
      mfaEnabled: true
    },
    {
      id: 3,
      name: 'Sistema de Vendas',
      description: 'Plataforma para gerenciamento de vendas e CRM',
      url: 'https://vendas.empresa.com',
      createdAt: '2024-03-10',
      totalUsers: 234,
      mfaEnabled: false
    },
    {
      id: 4,
      name: 'Portal do Cliente',
      description: 'Portal de autoatendimento para clientes',
      url: 'https://cliente.empresa.com',
      createdAt: '2024-03-25',
      totalUsers: 567,
      mfaEnabled: true
    },
    {
      id: 5,
      name: 'Sistema de Estoque',
      description: 'Sistema para controle de estoque e inventário',
      url: 'https://estoque.empresa.com',
      createdAt: '2024-04-10',
      totalUsers: 78,
      mfaEnabled: false
    },
    {
      id: 6,
      name: 'Portal de Comunicação',
      description: 'Portal interno para comunicação empresarial',
      url: 'https://comunicacao.empresa.com',
      createdAt: '2024-04-22',
      totalUsers: 141,
      mfaEnabled: true
    }
  ];

  // Calculate statistics
  const totalSystems = systems.length;
  const totalUsers = systems.reduce((sum, system) => sum + system.totalUsers, 0);
  const systemsWithMFA = systems.filter(system => system.mfaEnabled).length;

  useEffect(() => {
    // Resource Distribution Chart
    if (resourceChartRef.current) {
      const resourceChart = echarts.init(resourceChartRef.current);
      const resourceOption = {
        animation: false,
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          textStyle: { color: '#1f2937' }
        },
        legend: {
          data: ['SSO', 'MFA', 'Logs', 'Integração'],
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
            data: [12, 15, 18, 20, 22, 25, 28, 30, 32, 35, 38, 40]
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
            data: [10, 12, 15, 18, 20, 22, 25, 28, 30, 32, 33, 35]
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
            data: [8, 10, 12, 15, 18, 20, 22, 25, 27, 29, 30, 32]
          },
          {
            name: 'Integração',
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
            data: [5, 8, 10, 12, 15, 18, 20, 22, 24, 25, 26, 28]
          }
        ]
      };
      resourceChart.setOption(resourceOption);
    }

    // Security Status Chart
    if (securityChartRef.current) {
      const securityChart = echarts.init(securityChartRef.current);
      const securityOption = {
        animation: false,
        tooltip: {
          trigger: 'item',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          textStyle: { color: '#1f2937' }
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
            { value: 78, name: 'MFA Ativo', itemStyle: { color: 'rgba(87, 181, 231, 1)' } },
            { value: 65, name: 'SSO Configurado', itemStyle: { color: 'rgba(141, 211, 199, 1)' } },
            { value: 92, name: 'Logs Ativos', itemStyle: { color: 'rgba(251, 191, 114, 1)' } },
            { value: 42, name: 'Offboarding Automático', itemStyle: { color: 'rgba(252, 141, 98, 1)' } }
          ]
        }]
      };
      securityChart.setOption(securityOption);
    }
  }, []);

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
      value: totalUsers.toLocaleString('pt-BR'),
      icon: 'ri-user-line',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-500',
      change: '+8%',
      changeText: 'desde o mês passado',
      isPositive: true,
    },
    {
      title: 'Sistemas com MFA',
      value: systemsWithMFA.toString(),
      icon: 'ri-shield-check-line',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-500',
      change: `${Math.round((systemsWithMFA / totalSystems) * 100)}%`,
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
          <div ref={resourceChartRef} className="h-64"></div>
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
          <div ref={securityChartRef} className="h-64"></div>
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
