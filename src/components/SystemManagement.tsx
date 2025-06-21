import React, { useState, useEffect } from 'react';
import { useVersioning } from '../hooks/useVersioning';
import VersionInfoComponent from './VersionInfo';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SystemForm {
  name: string;
  description: string;
  url: string;
  hosting: 'on-premises' | 'cloudstack' | 'aws' | '';
  access_type: 'internal' | 'public' | '';
  responsible: string;
  user_management_responsible: string;
  password_complexity: 'basic' | 'medium' | 'complex' | '';
  onboarding_type: 'manual' | 'automated' | 'hybrid' | '';
  offboarding_type: 'manual' | 'automated' | 'hybrid' | '';
  offboarding_priority: 'low' | 'medium' | 'high' | '';
  named_users: boolean;
  sso_configuration: 'available' | 'not-available' | 'in-development' | 'license-upgrade' | '';
  integration_type: 'api' | 'database' | 'file' | 'manual' | '';
  region_blocking: 'enabled' | 'disabled' | '';
  mfa_configuration: 'required' | 'optional' | 'not-supported' | '';
  mfa_policy: 'app-based' | 'sms-based' | 'hardware-token' | '';
  mfa_sms_policy: 'enabled' | 'disabled' | '';
  logs_status: 'active' | 'inactive' | 'configured' | '';
  log_types: string[];
}

const SystemManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { currentVersion, incrementVersion } = useVersioning();
  
  const [formData, setFormData] = useState<SystemForm>({
    name: '',
    description: '',
    url: '',
    hosting: '',
    access_type: '',
    responsible: '',
    user_management_responsible: '',
    password_complexity: '',
    onboarding_type: '',
    offboarding_type: '',
    offboarding_priority: '',
    named_users: false,
    sso_configuration: '',
    integration_type: '',
    region_blocking: '',
    mfa_configuration: '',
    mfa_policy: '',
    mfa_sms_policy: '',
    logs_status: '',
    log_types: []
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Erro",
        description: "Usuário não autenticado",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      const newVersion = incrementVersion();
      
      const systemData = {
        ...formData,
        version: newVersion.version,
        created_by: user.id
      };

      const { data, error } = await supabase
        .from('systems')
        .insert([systemData])
        .select();

      if (error) {
        console.error('Erro ao salvar sistema:', error);
        toast({
          title: "Erro",
          description: "Erro ao salvar sistema",
          variant: "destructive"
        });
        return;
      }

      console.log('Sistema salvo com sucesso:', data);
      toast({
        title: "Sucesso",
        description: "Sistema cadastrado com sucesso",
      });

      // Reset form
      setFormData({
        name: '',
        description: '',
        url: '',
        hosting: '',
        access_type: '',
        responsible: '',
        user_management_responsible: '',
        password_complexity: '',
        onboarding_type: '',
        offboarding_type: '',
        offboarding_priority: '',
        named_users: false,
        sso_configuration: '',
        integration_type: '',
        region_blocking: '',
        mfa_configuration: '',
        mfa_policy: '',
        mfa_sms_policy: '',
        logs_status: '',
        log_types: []
      });

    } catch (error) {
      console.error('Erro ao salvar sistema:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao salvar sistema",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof SystemForm) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleSelectChange = (field: keyof SystemForm) => (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleCheckboxChange = (field: keyof SystemForm) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.checked
    }));
  };

  const handleLogTypesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const isChecked = e.target.checked;
    
    setFormData(prev => ({
      ...prev,
      log_types: isChecked 
        ? [...prev.log_types, value]
        : prev.log_types.filter(type => type !== value)
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-800">Gestão de Sistemas</h2>
      </div>

      <VersionInfoComponent versionInfo={currentVersion} />

      <form onSubmit={handleSubmit} className="bg-white rounded shadow p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nome do Sistema *</label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary"
              value={formData.name}
              onChange={handleInputChange('name')}
              placeholder="Ex: Sistema ERP"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">URL do Sistema</label>
            <input
              type="url"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary"
              value={formData.url}
              onChange={handleInputChange('url')}
              placeholder="https://sistema.empresa.com.br"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Responsável pelo Sistema</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary"
              value={formData.responsible}
              onChange={handleInputChange('responsible')}
              placeholder="Nome do responsável"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Responsável pela Gestão de Usuários</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary"
              value={formData.user_management_responsible}
              onChange={handleInputChange('user_management_responsible')}
              placeholder="Nome do responsável"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Hosting</label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary"
              value={formData.hosting}
              onChange={handleSelectChange('hosting')}
            >
              <option value="">Selecione...</option>
              <option value="on-premises">On-premises</option>
              <option value="cloudstack">Cloudstack</option>
              <option value="aws">AWS</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Acessível</label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary"
              value={formData.access_type}
              onChange={handleSelectChange('access_type')}
            >
              <option value="">Selecione...</option>
              <option value="internal">Interno</option>
              <option value="public">Público</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
          <textarea
            className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary"
            rows={3}
            value={formData.description}
            onChange={handleInputChange('description')}
            placeholder="Descrição detalhada do sistema"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Complexidade da Senha</label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary"
              value={formData.password_complexity}
              onChange={handleSelectChange('password_complexity')}
            >
              <option value="">Selecione...</option>
              <option value="basic">Básica</option>
              <option value="medium">Média</option>
              <option value="complex">Complexa</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Onboarding</label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary"
              value={formData.onboarding_type}
              onChange={handleSelectChange('onboarding_type')}
            >
              <option value="">Selecione...</option>
              <option value="manual">Manual</option>
              <option value="automated">Automático</option>
              <option value="hybrid">Híbrido</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Offboarding</label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary"
              value={formData.offboarding_type}
              onChange={handleSelectChange('offboarding_type')}
            >
              <option value="">Selecione...</option>
              <option value="manual">Manual</option>
              <option value="automated">Automático</option>
              <option value="hybrid">Híbrido</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Prioridade de Offboarding</label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary"
              value={formData.offboarding_priority}
              onChange={handleSelectChange('offboarding_priority')}
            >
              <option value="">Selecione...</option>
              <option value="low">Baixa</option>
              <option value="medium">Média</option>
              <option value="high">Alta</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Configuração de SSO</label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary"
              value={formData.sso_configuration}
              onChange={handleSelectChange('sso_configuration')}
            >
              <option value="">Selecione...</option>
              <option value="available">Disponível</option>
              <option value="not-available">Não Disponível</option>
              <option value="in-development">Em Desenvolvimento</option>
              <option value="license-upgrade">Upgrade de Licença</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Integração</label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary"
              value={formData.integration_type}
              onChange={handleSelectChange('integration_type')}
            >
              <option value="">Selecione...</option>
              <option value="api">API</option>
              <option value="database">Banco de Dados</option>
              <option value="file">Arquivo</option>
              <option value="manual">Manual</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bloqueio de Região</label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary"
              value={formData.region_blocking}
              onChange={handleSelectChange('region_blocking')}
            >
              <option value="">Selecione...</option>
              <option value="enabled">Habilitado</option>
              <option value="disabled">Desabilitado</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Configuração de MFA</label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary"
              value={formData.mfa_configuration}
              onChange={handleSelectChange('mfa_configuration')}
            >
              <option value="">Selecione...</option>
              <option value="required">Obrigatório</option>
              <option value="optional">Opcional</option>
              <option value="not-supported">Não Suportado</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Política de MFA</label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary"
              value={formData.mfa_policy}
              onChange={handleSelectChange('mfa_policy')}
            >
              <option value="">Selecione...</option>
              <option value="app-based">App-Based</option>
              <option value="sms-based">SMS-Based</option>
              <option value="hardware-token">Hardware Token</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Política de SMS para MFA</label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary"
              value={formData.mfa_sms_policy}
              onChange={handleSelectChange('mfa_sms_policy')}
            >
              <option value="">Selecione...</option>
              <option value="enabled">Habilitado</option>
              <option value="disabled">Desabilitado</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status dos Logs</label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary"
              value={formData.logs_status}
              onChange={handleSelectChange('logs_status')}
            >
              <option value="">Selecione...</option>
              <option value="active">Ativo</option>
              <option value="inactive">Inativo</option>
              <option value="configured">Configurado</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tipos de Logs</label>
          <div className="flex flex-wrap gap-2">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 text-primary rounded focus:ring-2 focus:ring-primary"
                value="login"
                checked={formData.log_types.includes('login')}
                onChange={handleLogTypesChange}
              />
              <span className="ml-2 text-gray-700">Login</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 text-primary rounded focus:ring-2 focus:ring-primary"
                value="access"
                checked={formData.log_types.includes('access')}
                onChange={handleLogTypesChange}
              />
              <span className="ml-2 text-gray-700">Acesso</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 text-primary rounded focus:ring-2 focus:ring-primary"
                value="error"
                checked={formData.log_types.includes('error')}
                onChange={handleLogTypesChange}
              />
              <span className="ml-2 text-gray-700">Erro</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 text-primary rounded focus:ring-2 focus:ring-primary"
                value="security"
                checked={formData.log_types.includes('security')}
                onChange={handleLogTypesChange}
              />
              <span className="ml-2 text-gray-700">Segurança</span>
            </label>
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            className="form-checkbox h-5 w-5 text-primary rounded focus:ring-2 focus:ring-primary"
            checked={formData.named_users}
            onChange={handleCheckboxChange('named_users')}
          />
          <label className="ml-2 text-sm font-medium text-gray-700">Usuários Nomeados</label>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            className="px-6 py-2 text-gray-600 border border-gray-300 rounded-button hover:bg-gray-50"
            onClick={() => setFormData({
              name: '',
              description: '',
              url: '',
              hosting: '',
              access_type: '',
              responsible: '',
              user_management_responsible: '',
              password_complexity: '',
              onboarding_type: '',
              offboarding_type: '',
              offboarding_priority: '',
              named_users: false,
              sso_configuration: '',
              integration_type: '',
              region_blocking: '',
              mfa_configuration: '',
              mfa_policy: '',
              mfa_sms_policy: '',
              logs_status: '',
              log_types: []
            })}
          >
            Limpar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-primary text-white rounded-button hover:bg-primary-dark disabled:opacity-50 flex items-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Salvando...
              </>
            ) : (
              <>
                <i className="ri-save-line mr-2"></i>
                Salvar Sistema
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SystemManagement;
