
import React, { useState, useEffect } from 'react';
import { useVersioning } from '../hooks/useVersioning';
import VersionInfoComponent from './VersionInfo';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

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
    <TooltipProvider>
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
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="w-4 h-4 ml-1 text-gray-400 cursor-help flex items-center justify-center">
                          <i className="ri-question-line"></i>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Nome único que identifica o sistema</p>
                      </TooltipContent>
                    </Tooltip>
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
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="w-4 h-4 ml-1 text-gray-400 cursor-help flex items-center justify-center">
                            <i className="ri-question-line"></i>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Ambiente onde o sistema está hospedado</p>
                        </TooltipContent>
                      </Tooltip>
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
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="w-4 h-4 ml-1 text-gray-400 cursor-help flex items-center justify-center">
                            <i className="ri-question-line"></i>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Tipo de acesso disponível para o sistema</p>
                        </TooltipContent>
                      </Tooltip>
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
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="w-4 h-4 ml-2 text-gray-400 cursor-help flex items-center justify-center">
                          <i className="ri-question-line"></i>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Gerencie os usuários e seus acessos ao sistema</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <button type="button" className="flex items-center text-primary hover:text-primary-dark text-sm">
                    <i className="ri-add-line mr-1"></i> Adicionar Campo de Acesso
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <div className="flex items-center mb-2">
                      <label className="block text-sm font-medium text-gray-700">Responsável pelo sistema</label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="w-4 h-4 ml-1 text-gray-400 cursor-help flex items-center justify-center">
                            <i className="ri-question-line"></i>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Pessoa responsável pela gestão do sistema</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder="Nome do responsável pelo sistema"
                    />
                  </div>

                  <div>
                    <div className="flex items-center mb-2">
                      <label className="block text-sm font-medium text-gray-700">Gestão de usuários</label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="w-4 h-4 ml-1 text-gray-400 cursor-help flex items-center justify-center">
                            <i className="ri-question-line"></i>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Pessoa ou time, responsável pela criação, atualização ou deleção dos usuários.</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder="Nome do responsável pela gestão de usuários"
                    />
                  </div>

                  <div>
                    <div className="flex items-center mb-2">
                      <label className="block text-sm font-medium text-gray-700">Complexidade de Senhas</label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="w-4 h-4 ml-1 text-gray-400 cursor-help flex items-center justify-center">
                            <i className="ri-question-line"></i>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Define se o sistema aplica regras de complexidade de senhas</p>
                        </TooltipContent>
                      </Tooltip>
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
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="w-4 h-4 ml-1 text-gray-400 cursor-help flex items-center justify-center">
                              <i className="ri-question-line"></i>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Método utilizado para criar novos acessos</p>
                          </TooltipContent>
                        </Tooltip>
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
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="w-4 h-4 ml-1 text-gray-400 cursor-help flex items-center justify-center">
                                <i className="ri-question-line"></i>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Método utilizado para remover acessos</p>
                            </TooltipContent>
                          </Tooltip>
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
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="w-4 h-4 ml-1 text-gray-400 cursor-help flex items-center justify-center">
                                <i className="ri-question-line"></i>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Define a urgência da desativação do acesso</p>
                            </TooltipContent>
                          </Tooltip>
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
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="w-4 h-4 ml-1 text-gray-400 cursor-help flex items-center justify-center">
                              <i className="ri-question-line"></i>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Define se o sistema utiliza contas de usuário individuais</p>
                          </TooltipContent>
                        </Tooltip>
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
                        <label className="block text-sm font-medium text-gray-700">Configuração de SSO</label>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="w-4 h-4 ml-1 text-gray-400 cursor-help flex items-center justify-center">
                              <i className="ri-question-line"></i>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Status da configuração de Single Sign-On</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <select className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary">
                        <option value="">Selecione o status</option>
                        <option value="desenvolver">Desenvolver</option>
                        <option value="aplicado">Aplicado</option>
                        <option value="nao-aplicado">Não Aplicado</option>
                        <option value="upgrade-licenca">Upgrade de Licença</option>
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

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <div className="flex items-center mb-2">
                        <label className="block text-sm font-medium text-gray-700">Bloqueio por Região</label>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="w-4 h-4 ml-1 text-gray-400 cursor-help flex items-center justify-center">
                              <i className="ri-question-line"></i>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Define se o sistema bloqueia acessos por região geográfica</p>
                          </TooltipContent>
                        </Tooltip>
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
                        <label className="block text-sm font-medium text-gray-700">Configuração de MFA</label>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="w-4 h-4 ml-1 text-gray-400 cursor-help flex items-center justify-center">
                              <i className="ri-question-line"></i>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Define se o sistema utiliza autenticação multifator (MFA)</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <select className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary">
                        <option value="">Selecione o status</option>
                        <option value="applied">Aplicado</option>
                        <option value="not-applied">Não Aplicado</option>
                        <option value="not-available">Não Disponível</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <div className="flex items-center mb-2">
                        <label className="block text-sm font-medium text-gray-700">Política de MFA</label>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="w-4 h-4 ml-1 text-gray-400 cursor-help flex items-center justify-center">
                              <i className="ri-question-line"></i>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Define a política de autenticação multifator</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <select className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary">
                        <option value="">Selecione a política</option>
                        <option value="habilitado">Habilitado</option>
                        <option value="sem-possibilidade">Sem possibilidade</option>
                      </select>
                    </div>

                    <div>
                      <div className="flex items-center mb-2">
                        <label className="block text-sm font-medium text-gray-700">Política de MFA por SMS</label>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="w-4 h-4 ml-1 text-gray-400 cursor-help flex items-center justify-center">
                              <i className="ri-question-line"></i>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Define a política de MFA via SMS</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <select className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary">
                        <option value="">Selecione a política</option>
                        <option value="habilitado">Habilitado</option>
                        <option value="nao-habilitado">Não habilitado</option>
                        <option value="nao-possui-opcao">Não possui opção</option>
                      </select>
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
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="w-4 h-4 ml-1 text-gray-400 cursor-help flex items-center justify-center">
                            <i className="ri-question-line"></i>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Define se o sistema possui ou não sistema de logs</p>
                        </TooltipContent>
                      </Tooltip>
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
                        <div className="flex items-center mb-4">
                          <label className="block text-sm font-medium text-gray-700">Tipos de Logs e Retenção</label>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="w-4 h-4 ml-1 text-gray-400 cursor-help flex items-center justify-center">
                                <i className="ri-question-line"></i>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Selecione os tipos de logs e sua respectiva retenção</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 border border-gray-300 rounded">
                            <div className="flex items-center">
                              <input type="checkbox" name="log_types" value="system" className="mr-3" />
                              <span className="text-sm text-gray-700">Logs do Sistema</span>
                            </div>
                            <select className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-primary focus:border-primary">
                              <option value="">Selecione retenção</option>
                              <option value="15-less">15 dias ou menos</option>
                              <option value="15-30">15 dias à 30 dias</option>
                              <option value="30-60">30 dias à 60 dias</option>
                              <option value="60-plus">Acima de 60 dias</option>
                            </select>
                          </div>
                          <div className="flex items-center justify-between p-4 border border-gray-300 rounded">
                            <div className="flex items-center">
                              <input type="checkbox" name="log_types" value="application" className="mr-3" />
                              <span className="text-sm text-gray-700">Logs da Aplicação</span>
                            </div>
                            <select className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-primary focus:border-primary">
                              <option value="">Selecione retenção</option>
                              <option value="15-less">15 dias ou menos</option>
                              <option value="15-30">15 dias à 30 dias</option>
                              <option value="30-60">30 dias à 60 dias</option>
                              <option value="60-plus">Acima de 60 dias</option>
                            </select>
                          </div>
                          <div className="flex items-center justify-between p-4 border border-gray-300 rounded">
                            <div className="flex items-center">
                              <input type="checkbox" name="log_types" value="access" className="mr-3" />
                              <span className="text-sm text-gray-700">Logs de Acesso</span>
                            </div>
                            <select className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-primary focus:border-primary">
                              <option value="">Selecione retenção</option>
                              <option value="15-less">15 dias ou menos</option>
                              <option value="15-30">15 dias à 30 dias</option>
                              <option value="30-60">30 dias à 60 dias</option>
                              <option value="60-plus">Acima de 60 dias</option>
                            </select>
                          </div>
                        </div>
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
    </TooltipProvider>
  );
};

export default SystemManagement;
