
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import UserImport from './UserImport';
import ActiveSessions from './ActiveSessions';
import AuditLogs from './AuditLogs';
import MFASetup from './MFASetup';
import PasswordPolicyConfig from './PasswordPolicyConfig';
import { useOrganizationSettings } from '@/hooks/useOrganizationSettings';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const { settings, loading, updateSettings } = useOrganizationSettings();
  const [formData, setFormData] = useState({
    organization_name: '',
    timezone: '',
    session_timeout_minutes: 60
  });

  // Simular ID do usuário (em um app real, isso viria do contexto de autenticação)
  const currentUserId = 'user-123';

  useEffect(() => {
    if (settings) {
      setFormData({
        organization_name: settings.organization_name,
        timezone: settings.timezone,
        session_timeout_minutes: settings.session_timeout_minutes
      });
    }
  }, [settings]);

  const handleSaveGeneral = async () => {
    await updateSettings(formData);
  };

  if (loading) {
    return <div className="animate-pulse p-6">Carregando configurações...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-800">Configurações</h2>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
          <TabsTrigger value="password-policy">Política de Senhas</TabsTrigger>
          <TabsTrigger value="sessions">Sessões</TabsTrigger>
          <TabsTrigger value="audit">Logs</TabsTrigger>
          <TabsTrigger value="user-import">Importar Usuários</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Gerais</CardTitle>
              <CardDescription>
                Configure as opções gerais do sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="organization">Nome da Organização</Label>
                  <Input
                    id="organization"
                    type="text"
                    value={formData.organization_name}
                    onChange={(e) => setFormData({
                      ...formData,
                      organization_name: e.target.value
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select 
                    value={formData.timezone} 
                    onValueChange={(value) => setFormData({
                      ...formData,
                      timezone: value
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/Sao_Paulo">America/Sao_Paulo</SelectItem>
                      <SelectItem value="America/New_York">America/New_York</SelectItem>
                      <SelectItem value="Europe/London">Europe/London</SelectItem>
                      <SelectItem value="Asia/Tokyo">Asia/Tokyo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="session_timeout">Tempo Limite da Sessão (minutos)</Label>
                <Input
                  id="session_timeout"
                  type="number"
                  min="15"
                  max="480"
                  value={formData.session_timeout_minutes}
                  onChange={(e) => setFormData({
                    ...formData,
                    session_timeout_minutes: parseInt(e.target.value)
                  })}
                />
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSaveGeneral}>
                  Salvar Alterações
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <div className="space-y-6">
            <MFASetup userId={currentUserId} />
            
            <Card>
              <CardHeader>
                <CardTitle>Outras Configurações de Segurança</CardTitle>
                <CardDescription>
                  Configurações adicionais de segurança do sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded">
                  <div>
                    <h4 className="font-medium">Bloqueio por Tentativas de Login</h4>
                    <p className="text-sm text-gray-600">Bloquear após múltiplas tentativas falhadas</p>
                  </div>
                  <Button variant="outline">
                    Configurar
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded">
                  <div>
                    <h4 className="font-medium">Auditoria de Segurança</h4>
                    <p className="text-sm text-gray-600">Monitoramento de atividades suspeitas</p>
                  </div>
                  <Button variant="outline">
                    Configurar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="password-policy">
          <PasswordPolicyConfig />
        </TabsContent>

        <TabsContent value="sessions">
          <ActiveSessions />
        </TabsContent>

        <TabsContent value="audit">
          <AuditLogs />
        </TabsContent>

        <TabsContent value="user-import">
          <UserImport />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
