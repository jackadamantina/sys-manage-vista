
import React, { useState } from 'react';

const SystemManagement = () => {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', label: 'Gestão Geral' },
    { id: 'access', label: 'Gestão de Acesso' },
    { id: 'security', label: 'Segurança de Acesso' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">Gestão de Sistemas</h2>
        <button className="px-4 py-2 bg-primary text-white rounded-button flex items-center">
          <i className="ri-add-line mr-2"></i>
          Novo Sistema
        </button>
      </div>

      <div className="bg-white rounded shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex space-x-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`tab-button px-4 py-2 text-sm font-medium ${
                  activeTab === tab.id ? 'active' : ''
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'general' && <GeneralTab />}
          {activeTab === 'access' && <AccessTab />}
          {activeTab === 'security' && <SecurityTab />}
        </div>
      </div>
    </div>
  );
};

const GeneralTab = () => (
  <form className="space-y-6">
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-lg font-medium text-gray-900">Informações Básicas</h3>
      <button type="button" className="flex items-center text-primary hover:text-primary-dark text-sm">
        <i className="ri-add-line mr-1"></i> Adicionar Campo Customizado
      </button>
    </div>
    
    <div className="grid grid-cols-2 gap-6">
      <div>
        <div className="flex items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">Nome do Sistema</label>
          <div className="w-4 h-4 ml-1 text-gray-400 cursor-help flex items-center justify-center" title="Nome único que identifica o sistema">
            <i className="ri-question-line"></i>
          </div>
        </div>
        <input
          type="text"
          className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary"
          placeholder="Digite o nome do sistema"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">URL</label>
        <input
          type="url"
          className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary"
          placeholder="https://"
        />
      </div>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
      <textarea
        className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary"
        rows={4}
        placeholder="Descreva o sistema"
      />
    </div>

    <div className="grid grid-cols-2 gap-6">
      <div>
        <div className="flex items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">Hosting</label>
          <div className="w-4 h-4 ml-1 text-gray-400 cursor-help flex items-center justify-center" title="Ambiente onde o sistema está hospedado">
            <i className="ri-question-line"></i>
          </div>
        </div>
        <select className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary">
          <option value="">Selecione o hosting</option>
          <option value="on-premises">On-premises</option>
          <option value="cloudstack">Cloudstack</option>
          <option value="aws">AWS</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Acesso</label>
        <div className="flex space-x-4">
          <label className="flex items-center">
            <input type="radio" name="access" value="internal" className="mr-2" />
            <span className="text-sm text-gray-700">Interno</span>
          </label>
          <label className="flex items-center">
            <input type="radio" name="access" value="public" className="mr-2" />
            <span className="text-sm text-gray-700">Público</span>
          </label>
        </div>
      </div>
    </div>
  </form>
);

const AccessTab = () => (
  <form className="space-y-6">
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center">
        <h3 className="text-lg font-medium text-gray-900">Gestão de Acesso</h3>
        <div className="w-4 h-4 ml-2 text-gray-400 cursor-help flex items-center justify-center" title="Gerencie os usuários e seus acessos ao sistema">
          <i className="ri-question-line"></i>
        </div>
      </div>
      <button type="button" className="flex items-center text-primary hover:text-primary-dark text-sm">
        <i className="ri-add-line mr-1"></i> Adicionar Campo de Acesso
      </button>
    </div>

    <div>
      <div className="flex items-center mb-2">
        <label className="block text-sm font-medium text-gray-700">Responsável</label>
        <div className="w-4 h-4 ml-1 text-gray-400 cursor-help flex items-center justify-center" title="Pessoa responsável pela gestão do sistema">
          <i className="ri-question-line"></i>
        </div>
      </div>
      <input
        type="text"
        className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary"
        placeholder="Nome do responsável"
      />
    </div>

    <div className="mt-8">
      <h4 className="text-md font-medium text-gray-900 mb-4">Configurações de Onboarding</h4>
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">Tipo de Criação</label>
          <div className="w-4 h-4 ml-1 text-gray-400 cursor-help flex items-center justify-center" title="Método utilizado para criar novos acessos">
            <i className="ri-question-line"></i>
          </div>
        </div>
        <select className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary">
          <option value="">Selecione o tipo</option>
          <option value="automatic">Automático</option>
          <option value="manual">Manual</option>
          <option value="hybrid">Híbrido</option>
        </select>
      </div>

      <h4 className="text-md font-medium text-gray-900 mb-4">Configurações de Offboarding</h4>
      <div className="space-y-6">
        <div>
          <div className="flex items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">Tipo de Desativação</label>
            <div className="w-4 h-4 ml-1 text-gray-400 cursor-help flex items-center justify-center" title="Método utilizado para remover acessos">
              <i className="ri-question-line"></i>
            </div>
          </div>
          <select className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary">
            <option value="">Selecione o tipo</option>
            <option value="automatic">Automático</option>
            <option value="manual">Manual</option>
            <option value="hybrid">Híbrido</option>
          </select>
        </div>

        <div>
          <div className="flex items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">Prioridade de Desativação</label>
            <div className="w-4 h-4 ml-1 text-gray-400 cursor-help flex items-center justify-center" title="Define a urgência da desativação do acesso">
              <i className="ri-question-line"></i>
            </div>
          </div>
          <select className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary">
            <option value="">Selecione a prioridade</option>
            <option value="high">Alta</option>
            <option value="medium">Média</option>
            <option value="low">Baixa</option>
          </select>
        </div>
      </div>
    </div>
  </form>
);

const SecurityTab = () => (
  <form className="space-y-6">
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-lg font-medium text-gray-900">Configurações de Segurança</h3>
      <div className="flex space-x-3">
        <button type="button" className="flex items-center text-primary hover:text-primary-dark text-sm">
          <i className="ri-add-line mr-1"></i> Adicionar Campo de Segurança
        </button>
        <button type="button" className="px-4 py-2 bg-primary text-white rounded-button flex items-center">
          <i className="ri-save-line mr-2"></i> Salvar
        </button>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-6">
      <div>
        <div className="flex items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">Usuários Nomeados</label>
          <div className="w-4 h-4 ml-1 text-gray-400 cursor-help flex items-center justify-center" title="Define se o sistema utiliza contas de usuário individuais">
            <i className="ri-question-line"></i>
          </div>
        </div>
        <div className="flex space-x-4">
          <label className="flex items-center">
            <input type="radio" name="named_users" value="yes" className="mr-2" />
            <span className="text-sm text-gray-700">Sim</span>
          </label>
          <label className="flex items-center">
            <input type="radio" name="named_users" value="no" className="mr-2" />
            <span className="text-sm text-gray-700">Não</span>
          </label>
        </div>
      </div>

      <div>
        <div className="flex items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">SSO Disponível</label>
          <div className="w-4 h-4 ml-1 text-gray-400 cursor-help flex items-center justify-center" title="Indica se o sistema suporta autenticação via Single Sign-On">
            <i className="ri-question-line"></i>
          </div>
        </div>
        <div className="flex space-x-4">
          <label className="flex items-center">
            <input type="radio" name="sso_available" value="yes" className="mr-2" />
            <span className="text-sm text-gray-700">Sim</span>
          </label>
          <label className="flex items-center">
            <input type="radio" name="sso_available" value="no" className="mr-2" />
            <span className="text-sm text-gray-700">Não</span>
          </label>
        </div>
      </div>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Integração</label>
      <div className="grid grid-cols-2 gap-4">
        <label className="flex items-center p-4 border border-gray-300 rounded cursor-pointer hover:bg-gray-50">
          <input type="radio" name="integration" value="sso" className="mr-3" />
          <div>
            <span className="block text-sm font-medium text-gray-700">SSO</span>
            <span className="text-xs text-gray-500">Single Sign-On</span>
          </div>
        </label>
        <label className="flex items-center p-4 border border-gray-300 rounded cursor-pointer hover:bg-gray-50">
          <input type="radio" name="integration" value="internal" className="mr-3" />
          <div>
            <span className="block text-sm font-medium text-gray-700">Internos</span>
            <span className="text-xs text-gray-500">Usuários internos do sistema</span>
          </div>
        </label>
        <label className="flex items-center p-4 border border-gray-300 rounded cursor-pointer hover:bg-gray-50">
          <input type="radio" name="integration" value="single" className="mr-3" />
          <div>
            <span className="block text-sm font-medium text-gray-700">Usuário Único</span>
            <span className="text-xs text-gray-500">Acesso compartilhado</span>
          </div>
        </label>
        <label className="flex items-center p-4 border border-gray-300 rounded cursor-pointer hover:bg-gray-50">
          <input type="radio" name="integration" value="none" className="mr-3" />
          <div>
            <span className="block text-sm font-medium text-gray-700">Sem Usuários</span>
            <span className="text-xs text-gray-500">Acesso sem autenticação</span>
          </div>
        </label>
      </div>
    </div>
  </form>
);

export default SystemManagement;
