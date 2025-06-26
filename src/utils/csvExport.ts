
import { System } from '@/types/system';

export const convertSystemToCSVData = (system: System) => ({
  'Nome do Sistema': system.name,
  'Descrição': system.description || '',
  'URL': system.url || '',
  'Hosting': system.hosting || '',
  'Tipo de Acesso': system.access_type || '',
  'Responsável': system.responsible || '',
  'Responsável pela Gestão de Usuários': system.user_management_responsible || '',
  'Complexidade de Senha': system.password_complexity || '',
  'Tipo de Onboarding': system.onboarding_type || '',
  'Tipo de Offboarding': system.offboarding_type || '',
  'Prioridade de Offboarding': system.offboarding_priority || '',
  'Usuários Nomeados': system.named_users ? 'Sim' : 'Não',
  'Configuração SSO': system.sso_configuration || '',
  'Tipo de Integração': system.integration_type || '',
  'Bloqueio Regional': system.region_blocking || '',
  'Configuração MFA': system.mfa_configuration || '',
  'Política MFA': system.mfa_policy || '',
  'Política MFA SMS': system.mfa_sms_policy || '',
  'Status dos Logs': system.logs_status || '',
  'Tipos de Log': system.log_types ? JSON.stringify(system.log_types) : '',
  'Usuários Integrados': system.integrated_users ? 'Sim' : 'Não',
  'Versão': system.version || '',
  'Data de Cadastro': new Date(system.created_at).toLocaleDateString('pt-BR')
});

export const convertToCSV = (data: any[]) => {
  if (data.length === 0) return '';

  const headers = Object.keys(data[0]);
  const csvRows = [];

  // Adicionar cabeçalhos
  csvRows.push(headers.join(','));

  // Adicionar dados
  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header];
      // Escapar aspas duplas e envolver em aspas se necessário
      if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    });
    csvRows.push(values.join(','));
  }

  return csvRows.join('\n');
};

export const downloadCSV = (csvContent: string, filename: string) => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
