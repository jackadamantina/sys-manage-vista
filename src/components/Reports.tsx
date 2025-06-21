
import React, { useState, useEffect } from 'react';
import { useVersioning } from '../hooks/useVersioning';
import VersionInfoComponent from './VersionInfo';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface System {
  id: string;
  name: string;
  description: string | null;
  url: string | null;
  created_at: string;
  hosting: string | null;
  access_type: string | null;
  responsible: string | null;
  sso_configuration: string | null;
}

const Reports = () => {
  const [systems, setSystems] = useState<System[]>([]);
  const [filteredSystems, setFilteredSystems] = useState<System[]>([]);
  const [loading, setLoading] = useState(true);
  const [queryExecuted, setQueryExecuted] = useState(false);
  const { toast } = useToast();
  
  const [queryFilters, setQueryFilters] = useState({
    system: '',
    responsible: '',
    hosting: '',
    access: '',
    namedUsers: '',
    sso: '',
    integration: '',
    logTypes: [],
    retention: '',
    versionFrom: '',
    versionTo: ''
  });

  const { currentVersion } = useVersioning();

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
      if (!queryExecuted) {
        setFilteredSystems(data || []);
      }
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

  const handleFilterChange = (field: string, value: any) => {
    setQueryFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const executeQuery = () => {
    console.log('Executando query com filtros:', queryFilters);
    console.log('Versão do sistema no momento da consulta:', currentVersion);
    
    let filtered = [...systems];

    // Aplicar filtros
    if (queryFilters.system.trim()) {
      filtered = filtered.filter(system => 
        system.name.toLowerCase().includes(queryFilters.system.toLowerCase()) ||
        (system.description && system.description.toLowerCase().includes(queryFilters.system.toLowerCase()))
      );
    }

    if (queryFilters.responsible.trim()) {
      filtered = filtered.filter(system => 
        system.responsible && system.responsible.toLowerCase().includes(queryFilters.responsible.toLowerCase())
      );
    }

    if (queryFilters.hosting) {
      filtered = filtered.filter(system => system.hosting === queryFilters.hosting);
    }

    if (queryFilters.access) {
      filtered = filtered.filter(system => system.access_type === queryFilters.access);
    }

    if (queryFilters.sso) {
      filtered = filtered.filter(system => {
        if (queryFilters.sso === 'available') {
          return system.sso_configuration === 'disponível';
        } else if (queryFilters.sso === 'not-available') {
          return system.sso_configuration === 'não disponível';
        } else if (queryFilters.sso === 'in-development') {
          return system.sso_configuration === 'desenvolver';
        } else if (queryFilters.sso === 'license-upgrade') {
          return system.sso_configuration === 'upgrade de licença';
        }
        return true;
      });
    }

    setFilteredSystems(filtered);
    setQueryExecuted(true);

    toast({
      title: "Consulta Executada",
      description: `Encontrados ${filtered.length} sistema(s) com os filtros aplicados`,
    });
  };

  const clearFilters = () => {
    setQueryFilters({
      system: '',
      responsible: '',
      hosting: '',
      access: '',
      namedUsers: '',
      sso: '',
      integration: '',
      logTypes: [],
      retention: '',
      versionFrom: '',
      versionTo: ''
    });
    setFilteredSystems(systems);
    setQueryExecuted(false);
  };

  const systemsToDisplay = queryExecuted ? filteredSystems : systems;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-800">Relatórios</h2>
        <button className="px-4 py-2 bg-primary text-white rounded-button flex items-center">
          <i className="ri-file-chart-line mr-2"></i>
          Gerar Relatório
        </button>
      </div>

      {/* Versão do Sistema para Relatórios */}
      <VersionInfoComponent versionInfo={currentVersion} />

      {/* Query Builder */}
      <div className="bg-white rounded shadow p-6">
        <div className="flex items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-800">Construtor de Consultas</h3>
          <div className="w-4 h-4 ml-2 text-gray-400 cursor-help flex items-center justify-center" title="Use os filtros abaixo para criar consultas personalizadas com versionamento">
            <i className="ri-question-line"></i>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Filtros de Versionamento */}
          <div className="md:col-span-3">
            <h4 className="text-md font-medium text-gray-900 mb-4">Filtros de Versionamento</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Versão A Partir De</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Ex: 1.0.0"
                  value={queryFilters.versionFrom}
                  onChange={(e) => handleFilterChange('versionFrom', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Versão Até</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Ex: 2.0.0"
                  value={queryFilters.versionTo}
                  onChange={(e) => handleFilterChange('versionTo', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Filtros Existentes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sistema</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="Nome do sistema"
              value={queryFilters.system}
              onChange={(e) => handleFilterChange('system', e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Responsável</label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="Nome do responsável"
              value={queryFilters.responsible}
              onChange={(e) => handleFilterChange('responsible', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hosting</label>
            <select 
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary"
              value={queryFilters.hosting}
              onChange={(e) => handleFilterChange('hosting', e.target.value)}
            >
              <option value="">Todos</option>
              <option value="on-premises">On-premises</option>
              <option value="cloudstack">Cloudstack</option>
              <option value="aws">AWS</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Acessível</label>
            <select 
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary"
              value={queryFilters.access}
              onChange={(e) => handleFilterChange('access', e.target.value)}
            >
              <option value="">Todos</option>
              <option value="interno">Interno</option>
              <option value="publico">Público</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Usuários Nomeados</label>
            <select 
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary"
              value={queryFilters.namedUsers}
              onChange={(e) => handleFilterChange('namedUsers', e.target.value)}
            >
              <option value="">Todos</option>
              <option value="yes">Sim</option>
              <option value="no">Não</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SSO Disponível</label>
            <select 
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary"
              value={queryFilters.sso}
              onChange={(e) => handleFilterChange('sso', e.target.value)}
            >
              <option value="">Todos</option>
              <option value="available">Disponível</option>
              <option value="not-available">Não Disponível</option>
              <option value="in-development">A Desenvolver</option>
              <option value="license-upgrade">Upgrade de Licença</option>
            </select>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex space-x-4">
            <button 
              onClick={executeQuery}
              className="px-6 py-2 bg-primary text-white rounded-button flex items-center"
            >
              <i className="ri-search-line mr-2"></i>
              Executar Consulta
            </button>
            <button 
              onClick={clearFilters}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-button flex items-center hover:bg-gray-50 transition-colors"
            >
              <i className="ri-refresh-line mr-2"></i>
              Limpar Filtros
            </button>
          </div>
          <button className="px-4 py-2 text-primary border border-primary rounded-button flex items-center hover:bg-primary hover:text-white transition-colors">
            <i className="ri-download-line mr-2"></i>
            Exportar Resultados
          </button>
        </div>
      </div>

      {/* Listagem de Sistemas */}
      <div className="bg-white rounded shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                {queryExecuted ? 'Resultados da Consulta' : 'Sistemas Cadastrados'}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {queryExecuted 
                  ? `${filteredSystems.length} sistema(s) encontrado(s) com os filtros aplicados`
                  : 'Lista completa de todos os sistemas registrados no portal'
                }
              </p>
            </div>
            <button 
              onClick={loadSystems}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded flex items-center"
            >
              <i className="ri-refresh-line mr-1"></i>
              Atualizar
            </button>
          </div>
        </div>
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-gray-500">Carregando sistemas...</div>
            </div>
          ) : systemsToDisplay.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <i className="ri-database-line text-4xl text-gray-300 mb-2"></i>
                <p className="text-gray-500">
                  {queryExecuted ? 'Nenhum sistema encontrado com os filtros aplicados' : 'Nenhum sistema cadastrado'}
                </p>
                <p className="text-sm text-gray-400">
                  {queryExecuted ? 'Tente ajustar os filtros da consulta' : 'Cadastre um sistema na página de Gestão de Sistemas'}
                </p>
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome do Sistema</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead>Hosting</TableHead>
                  <TableHead>Responsável</TableHead>
                  <TableHead>Data de Cadastro</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {systemsToDisplay.map((system) => (
                  <TableRow key={system.id}>
                    <TableCell className="font-medium">{system.name}</TableCell>
                    <TableCell>{system.description || '-'}</TableCell>
                    <TableCell>
                      {system.url ? (
                        <a 
                          href={system.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:text-primary-dark hover:underline"
                        >
                          {system.url}
                        </a>
                      ) : '-'}
                    </TableCell>
                    <TableCell>
                      <span className="capitalize">{system.hosting || '-'}</span>
                    </TableCell>
                    <TableCell>{system.responsible || '-'}</TableCell>
                    <TableCell>{new Date(system.created_at).toLocaleDateString('pt-BR')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
