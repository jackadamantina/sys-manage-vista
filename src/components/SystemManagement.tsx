
import React, { useState, useEffect } from 'react';
import { useVersioning } from '../hooks/useVersioning';
import VersionInfoComponent from './VersionInfo';

const SystemManagement = () => {
  const { currentVersion, updateVersion } = useVersioning();
  const [logsStatus, setLogsStatus] = useState('');

  const handleSave = () => {
    const newVersion = updateVersion();
    console.log('Sistema salvo com nova versão:', newVersion);
    // Aqui seria implementada a lógica de salvamento real
  };

  const handleLogsStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLogsStatus(e.target.value);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">Gestão de Sistemas</h2>
        <div className="flex space-x-3">
          <button 
            onClick={handleSave}
            className="px-4 py-2 bg-green-500 text-white rounded-button flex items-center"
          >
            <i className="ri-save-line mr-2"></i>
            Salvar Alterações
          </button>
          <button className="px-4 py-2 bg-primary text-white rounded-button flex items-center">
            <i className="ri-add-line mr-2"></i>
            Novo Sistema
          </button>
        </div>
      </div>

      {/* Informações de Versão */}
      <VersionInfoComponent versionInfo={currentVersion} showDetailed={true} />

      <div className="bg-white rounded shadow">
        <form className="p-8 space-y-8">
          {/* Informações Básicas */}
          <section>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-gray-900">Informações Básicas</h3>
              <button type="button" className="flex items-center text-primary hover:text-primary-dark text-sm">
                <i className="ri-add-line mr-1"></i> Adicionar Campo Customizado
              </button>
            </div>
            
            <div className="space-y-6">
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary"
                  rows={4}
                  placeholder="Descreva o sistema"
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
                    <option value="cloud">Cloud</option>
                    <option value="cloudstack">Cloudstack</option>
                  </select>
                </div>

                <div>
                  <div className="flex items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">Acesso ao Sistema</label>
                    <div className="w-4 h-4 ml-1 text-gray-400 cursor-help flex items-center justify-center" title="Tipo de acesso disponível para o sistema">
                      <i className="ri-question-line"></i>
                    </div>
                  </div>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary">
                    <option value="">Selecione o acesso</option>
                    <option value="interno">Interno</option>
                    <option value="externo">Externo</option>
                  </select>
                </div>
              </div>
            </div>
          </section>

          {/* Gestão de Acesso */}
          <section>
            <div className="border-t border-gray-200 pt-8">
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

              <div className="space-y-6">
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

                <div>
                  <div className="flex items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">Complexidade de Senhas</label>
                    <div className="w-4 h-4 ml-1 text-gray-400 cursor-help flex items-center justify-center" title="Define se o sistema aplica regras de complexidade de senhas">
                      <i className="ri-question-line"></i>
                    </div>
                  </div>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary">
                    <option value="">Selecione</option>
                    <option value="applied">Aplicado</option>
                    <option value="not-applied">Não Aplicado</option>
                    <option value="not-available">Não Possui</option>
                  </select>
                </div>

                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Configurações de Onboarding</h4>
                  <div>
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
                </div>

                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Configurações de Offboarding</h4>
                  <div className="grid grid-cols-2 gap-6">
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
              </div>
            </div>
          </section>

          {/* Segurança de Acesso */}
          <section>
            <div className="border-t border-gray-200 pt-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-900">Configurações de Segurança</h3>
                <button type="button" className="flex items-center text-primary hover:text-primary-dark text-sm">
                  <i className="ri-add-line mr-1"></i> Adicionar Campo de Segurança
                </button>
              </div>

              <div className="space-y-6">
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
                      <div className="w-4 h-4 ml-1 text-gray-400 cursor-help flex items-center justify-center" title="Status da disponibilidade de Single Sign-On">
                        <i className="ri-question-line"></i>
                      </div>
                    </div>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary">
                      <option value="">Selecione o status</option>
                      <option value="available">Disponível</option>
                      <option value="not-available">Não Disponível</option>
                      <option value="in-development">A Desenvolver</option>
                      <option value="license-upgrade">Upgrade de Licença</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center mb-2">
                      <label className="block text-sm font-medium text-gray-700">Bloqueio por Região</label>
                      <div className="w-4 h-4 ml-1 text-gray-400 cursor-help flex items-center justify-center" title="Define se o sistema bloqueia acessos por região geográfica">
                        <i className="ri-question-line"></i>
                      </div>
                    </div>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary">
                      <option value="">Selecione o status</option>
                      <option value="applied">Aplicado</option>
                      <option value="not-applied">Não Aplicado</option>
                      <option value="not-available">Não Disponível</option>
                    </select>
                  </div>

                  <div>
                    <div className="flex items-center mb-2">
                      <label className="block text-sm font-medium text-gray-700">MFA Aplicado</label>
                      <div className="w-4 h-4 ml-1 text-gray-400 cursor-help flex items-center justify-center" title="Define se o sistema utiliza autenticação multifator (MFA)">
                        <i className="ri-question-line"></i>
                      </div>
                    </div>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary">
                      <option value="">Selecione o status</option>
                      <option value="applied">Aplicado</option>
                      <option value="not-applied">Não Aplicado</option>
                      <option value="not-available">Não Disponível</option>
                    </select>
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
              </div>
            </div>
          </section>

          {/* Logs */}
          <section>
            <div className="border-t border-gray-200 pt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Configurações de Logs</h3>

              <div className="space-y-6">
                <div>
                  <div className="flex items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">Status dos Logs</label>
                    <div className="w-4 h-4 ml-1 text-gray-400 cursor-help flex items-center justify-center" title="Define se o sistema possui ou não sistema de logs">
                      <i className="ri-question-line"></i>
                    </div>
                  </div>
                  <div className="flex space-x-4 mb-4">
                    <label className="flex items-center">
                      <input 
                        type="radio" 
                        name="logs_status" 
                        value="enabled" 
                        className="mr-2"
                        onChange={handleLogsStatusChange}
                      />
                      <span className="text-sm text-gray-700">Possui Logs</span>
                    </label>
                    <label className="flex items-center">
                      <input 
                        type="radio" 
                        name="logs_status" 
                        value="disabled" 
                        className="mr-2"
                        onChange={handleLogsStatusChange}
                      />
                      <span className="text-sm text-gray-700">Sem Logs</span>
                    </label>
                  </div>
                </div>

                {logsStatus === 'enabled' && (
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center mb-2">
                        <label className="block text-sm font-medium text-gray-700">Tipos de Logs</label>
                        <div className="w-4 h-4 ml-1 text-gray-400 cursor-help flex items-center justify-center" title="Selecione os tipos de logs que deseja monitorar">
                          <i className="ri-question-line"></i>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input type="checkbox" name="log_types" value="system" className="mr-2" />
                          <span className="text-sm text-gray-700">Logs do Sistema</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" name="log_types" value="application" className="mr-2" />
                          <span className="text-sm text-gray-700">Logs da Aplicação</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" name="log_types" value="access" className="mr-2" />
                          <span className="text-sm text-gray-700">Logs de Acesso</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center mb-2">
                        <label className="block text-sm font-medium text-gray-700">Retenção</label>
                        <div className="w-4 h-4 ml-1 text-gray-400 cursor-help flex items-center justify-center" title="Período de retenção dos logs em dias">
                          <i className="ri-question-line"></i>
                        </div>
                      </div>
                      <select className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary">
                        <option value="">Selecione o período</option>
                        <option value="30">30 dias</option>
                        <option value="60">60 dias</option>
                        <option value="90">90 dias</option>
                        <option value="180">180 dias</option>
                        <option value="365">1 ano</option>
                        <option value="custom">Personalizado</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          <div className="flex justify-end border-t border-gray-200 pt-6">
            <button 
              type="button" 
              onClick={handleSave}
              className="px-6 py-2 bg-primary text-white rounded-button flex items-center"
            >
              <i className="ri-save-line mr-2"></i>
              Salvar Sistema
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SystemManagement;
