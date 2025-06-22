
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UserImport from './UserImport';
import ActiveSessions from './ActiveSessions';
import AuditLogs from './AuditLogs';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-800">Configurações</h2>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome da Organização
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary"
                    defaultValue="Empresa LTDA"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timezone
                  </label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary">
                    <option>America/Sao_Paulo</option>
                    <option>America/New_York</option>
                    <option>Europe/London</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end">
                <button className="px-4 py-2 bg-primary text-white rounded-button">
                  Salvar Alterações
                </button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Segurança</CardTitle>
              <CardDescription>
                Gerencie as configurações de segurança e autenticação
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded">
                  <div>
                    <h4 className="font-medium">Autenticação em Dois Fatores</h4>
                    <p className="text-sm text-gray-600">Adicione uma camada extra de segurança</p>
                  </div>
                  <button className="px-4 py-2 bg-green-500 text-white rounded-button">
                    Ativar 2FA
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded">
                  <div>
                    <h4 className="font-medium">Política de Senhas</h4>
                    <p className="text-sm text-gray-600">Configure requisitos de senha</p>
                  </div>
                  <button className="px-4 py-2 text-primary border border-primary rounded-button">
                    Configurar
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded">
                  <div>
                    <h4 className="font-medium">Tempo de Sessão</h4>
                    <p className="text-sm text-gray-600">Defina tempo limite das sessões</p>
                  </div>
                  <button className="px-4 py-2 text-primary border border-primary rounded-button">
                    Configurar
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
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
