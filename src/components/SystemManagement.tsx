import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';

interface System {
  id?: string;
  name: string;
  description: string;
  url: string;
  hosting: string;
  access_type: string;
  responsible: string;
  user_management_responsible: string;
  password_complexity: string;
  onboarding_type: string;
  offboarding_type: string;
  offboarding_priority: string;
  named_users: string;
  integrated_users: boolean;
  sso_configuration: string;
  region_blocking: string;
  mfa_configuration: string;
  mfa_policy: string;
  mfa_sms_policy: string;
  logs_status: string;
  log_types: any;
  created_at?: string;
}

const SystemManagement = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [systems, setSystems] = useState<System[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const form = useForm<System>({
    defaultValues: {
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
      named_users: '',
      integrated_users: false,
      sso_configuration: '',
      region_blocking: '',
      mfa_configuration: '',
      mfa_policy: '',
      mfa_sms_policy: '',
      logs_status: '',
      log_types: {}
    }
  });

  const watchMfaConfiguration = form.watch('mfa_configuration');

  const loadSystems = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('systems_idm')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao carregar sistemas:', error);
        toast({
          title: "Erro",
          description: "Erro ao carregar sistemas",
          variant: "destructive"
        });
        return;
      }

      setSystems(data || []);
    } catch (error) {
      console.error('Erro ao carregar sistemas:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao carregar sistemas",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSystems();
  }, []);

  const onSubmit = async (data: System) => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Usuário não autenticado",
        variant: "destructive"
      });
      return;
    }

    try {
      if (isEditing && editingId) {
        const { error } = await supabase
          .from('systems_idm')
          .update(data)
          .eq('id', editingId);

        if (error) throw error;

        toast({
          title: "Sucesso",
          description: "Sistema atualizado com sucesso!",
        });
      } else {
        const { error } = await supabase
          .from('systems_idm')
          .insert([{
            ...data,
            user_id: user.id
          }]);

        if (error) throw error;

        toast({
          title: "Sucesso",
          description: "Sistema cadastrado com sucesso!",
        });
      }

      await loadSystems();
      form.reset();
      setIsEditing(false);
      setEditingId(null);
      
    } catch (error) {
      console.error('Erro ao salvar sistema:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar sistema",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (system: System) => {
    setIsEditing(true);
    setEditingId(system.id!);
    form.reset(system);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este sistema?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('systems_idm')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Sistema excluído com sucesso!",
      });

      await loadSystems();
    } catch (error) {
      console.error('Erro ao excluir sistema:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir sistema",
        variant: "destructive"
      });
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingId(null);
    form.reset();
  };

  const logRetentionOptions = [
    { value: '30-days', label: '30 dias' },
    { value: '90-days', label: '90 dias' },
    { value: '180-days', label: '180 dias' },
    { value: '1-year', label: '1 ano' },
    { value: '2-years', label: '2 anos' },
    { value: '5-years', label: '5 anos' },
    { value: 'indefinite', label: 'Indefinido' }
  ];

  const logTypes = [
    { key: 'login_logs', label: 'Logs de Login' },
    { key: 'access_logs', label: 'Logs de Acesso' },
    { key: 'audit_logs', label: 'Logs de Auditoria' },
    { key: 'security_logs', label: 'Logs de Segurança' },
    { key: 'system_logs', label: 'Logs do Sistema' },
    { key: 'error_logs', label: 'Logs de Erro' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-800">Gestão de Sistemas</h2>
      </div>

      {/* Form */}
      <div className="bg-white rounded shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          {isEditing ? 'Editar Sistema' : 'Novo Sistema'}
        </h3>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Informações Básicas */}
            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-700 border-b pb-2">Informações Básicas</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Sistema</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome do sistema" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://exemplo.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Descrição do sistema" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="hosting"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hospedagem</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo de hospedagem" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="cloud">Cloud</SelectItem>
                          <SelectItem value="on-premise">On-Premise</SelectItem>
                          <SelectItem value="hybrid">Híbrido</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="access_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Acesso</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo de acesso" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="public">Público</SelectItem>
                          <SelectItem value="private">Privado</SelectItem>
                          <SelectItem value="restricted">Restrito</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Responsabilidades */}
            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-700 border-b pb-2">Responsabilidades</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="responsible"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Responsável pelo Sistema</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome do responsável" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="user_management_responsible"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Responsável pela Gestão de Usuários</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome do responsável" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Segurança e Autenticação */}
            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-700 border-b pb-2">Segurança e Autenticação</h4>
              
              <FormField
                control={form.control}
                name="named_users"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Usuários Nomeados</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Usuários nomeados" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="sim">Sim</SelectItem>
                        <SelectItem value="nao">Não</SelectItem>
                        <SelectItem value="sem-autenticacao">Sem Autenticação</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="sso_configuration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Configuração SSO</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Configuração SSO" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="habilitado">Habilitado</SelectItem>
                        <SelectItem value="desabilitado">Desabilitado</SelectItem>
                        <SelectItem value="desenvolver">Desenvolver</SelectItem>
                        <SelectItem value="upgrade-licenca">Upgrade de Licença</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="region_blocking"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bloqueio de acesso por região</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Bloqueio de acesso por região" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="aplicado">Aplicado</SelectItem>
                        <SelectItem value="nao-aplicado">Não Aplicado</SelectItem>
                        <SelectItem value="sem-possibilidade">Sem Possibilidade</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Gestão de Usuários */}
            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-700 border-b pb-2">Gestão de Usuários</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="onboarding_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Onboarding</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Onboarding" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="automatizado">Automatizado</SelectItem>
                          <SelectItem value="manual">Manual</SelectItem>
                          <SelectItem value="semi-automatizado">Semi-automatizado</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="integrated_users"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Usuários Integrados</FormLabel>
                      <Select onValueChange={(value) => field.onChange(value === 'sim')} defaultValue={field.value ? 'sim' : 'nao'}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Usuários integrados" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="sim">Sim</SelectItem>
                          <SelectItem value="nao">Não</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="offboarding_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Offboarding</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Offboarding" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="automatizado">Automatizado</SelectItem>
                          <SelectItem value="manual">Manual</SelectItem>
                          <SelectItem value="semi-automatizado">Semi-automatizado</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="offboarding_priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prioridade Offboarding</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Prioridade" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="alta">Alta</SelectItem>
                          <SelectItem value="media">Média</SelectItem>
                          <SelectItem value="baixa">Baixa</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Logs e Auditoria */}
            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-700 border-b pb-2">Logs e Auditoria</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="logs_status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status dos Logs</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Status dos logs" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ativo">Ativo</SelectItem>
                          <SelectItem value="inativo">Inativo</SelectItem>
                          <SelectItem value="parcial">Parcial</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="log_types"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Política Geral de Retenção</FormLabel>
                      <Select onValueChange={(value) => field.onChange({ ...field.value, general_retention: value })} defaultValue={field.value?.general_retention}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Política geral" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {logRetentionOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Tipos de Logs com Retenção Individual */}
              <div className="space-y-4">
                <FormLabel>Tipos de Logs e Retenção Individual</FormLabel>
                <div className="space-y-4 border rounded-lg p-4">
                  {logTypes.map((logType) => (
                    <div key={logType.key} className="flex items-center justify-between space-x-4 p-3 border rounded">
                      <div className="flex items-center space-x-3">
                        <FormField
                          control={form.control}
                          name="log_types"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.[logType.key]?.enabled || false}
                                  onCheckedChange={(checked) => {
                                    const currentValue = field.value || {};
                                    field.onChange({
                                      ...currentValue,
                                      [logType.key]: {
                                        ...currentValue[logType.key],
                                        enabled: checked
                                      }
                                    });
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-medium">
                                {logType.label}
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="flex-1 max-w-xs">
                        <FormField
                          control={form.control}
                          name="log_types"
                          render={({ field }) => (
                            <FormItem>
                              <Select 
                                onValueChange={(value) => {
                                  const currentValue = field.value || {};
                                  field.onChange({
                                    ...currentValue,
                                    [logType.key]: {
                                      ...currentValue[logType.key],
                                      retention: value
                                    }
                                  });
                                }} 
                                defaultValue={field.value?.[logType.key]?.retention}
                                disabled={!field.value?.[logType.key]?.enabled}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Retenção" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {logRetentionOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Configurações Adicionais de Logs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="log_types"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Formato dos Logs</FormLabel>
                      <Select onValueChange={(value) => field.onChange({ ...field.value, log_format: value })} defaultValue={field.value?.log_format}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Formato dos logs" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="json">JSON</SelectItem>
                          <SelectItem value="csv">CSV</SelectItem>
                          <SelectItem value="txt">Texto</SelectItem>
                          <SelectItem value="syslog">Syslog</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="log_types"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Frequência de Backup</FormLabel>
                      <Select onValueChange={(value) => field.onChange({ ...field.value, backup_frequency: value })} defaultValue={field.value?.backup_frequency}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Frequência de backup" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="daily">Diário</SelectItem>
                          <SelectItem value="weekly">Semanal</SelectItem>
                          <SelectItem value="monthly">Mensal</SelectItem>
                          <SelectItem value="quarterly">Trimestral</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Configurações MFA - movidas para o final antes de Complexidade de Senha */}
            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-700 border-b pb-2">Configurações MFA</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="mfa_configuration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Configuração MFA</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="MFA" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="habilitado">Habilitado</SelectItem>
                          <SelectItem value="desabilitado">Desabilitado</SelectItem>
                          <SelectItem value="opcional">Opcional</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="mfa_policy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Política MFA</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        disabled={watchMfaConfiguration === 'desabilitado'}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Política MFA" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="obrigatorio">Obrigatório</SelectItem>
                          <SelectItem value="opcional">Opcional</SelectItem>
                          <SelectItem value="condicional">Condicional</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="mfa_sms_policy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Política MFA SMS</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        disabled={watchMfaConfiguration === 'desabilitado'}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="MFA SMS" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="habilitado">Habilitado</SelectItem>
                          <SelectItem value="desabilitado">Desabilitado</SelectItem>
                          <SelectItem value="backup-only">Apenas Backup</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Complexidade de Senha - último item */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="password_complexity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Complexidade de Senha</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a complexidade" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Baixa</SelectItem>
                        <SelectItem value="medium">Média</SelectItem>
                        <SelectItem value="high">Alta</SelectItem>
                        <SelectItem value="very-high">Muito Alta</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex space-x-4">
              <Button type="submit" className="flex items-center">
                <i className="ri-save-line mr-2"></i>
                {isEditing ? 'Atualizar' : 'Cadastrar'} Sistema
              </Button>
              {isEditing && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancelEdit}
                  className="flex items-center"
                >
                  <i className="ri-close-line mr-2"></i>
                  Cancelar
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>

      {/* Systems List */}
      <div className="bg-white rounded shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Sistemas Cadastrados</h3>
        </div>
        
        {loading ? (
          <div className="p-6 text-center">Carregando sistemas...</div>
        ) : systems.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            Nenhum sistema cadastrado ainda.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sistema
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    URL/Hospedagem
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Segurança
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usuários
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Criado em
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {systems.map((system) => (
                  <tr key={system.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{system.name}</div>
                        <div className="text-sm text-gray-500">{system.description}</div>
                        <div className="text-xs text-gray-400">Responsável: {system.responsible}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {system.url && (
                        <a href={system.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline block">
                          {system.url}
                        </a>
                      )}
                      <div className="text-xs text-gray-400">Hospedagem: {system.hosting}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="space-y-1">
                        <div className="text-xs">MFA: {system.mfa_configuration}</div>
                        <div className="text-xs">SSO: {system.sso_configuration}</div>
                        <div className="text-xs">Bloqueio Regional: {system.region_blocking}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="space-y-1">
                        <div className="text-xs">Nomeados: {system.named_users === 'sim' ? 'Sim' : system.named_users === 'nao' ? 'Não' : system.named_users === 'sem-autenticacao' ? 'Sem Autenticação' : '-'}</div>
                        <div className="text-xs">Integrados: {system.integrated_users ? 'Sim' : 'Não'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {system.created_at ? new Date(system.created_at).toLocaleDateString('pt-BR') : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleEdit(system)}
                        className="text-primary hover:text-primary-dark"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(system.id!)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemManagement;
