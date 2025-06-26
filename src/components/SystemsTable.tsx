
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { System } from '@/types/system';

interface SystemsTableProps {
  systems: System[];
  loading: boolean;
  queryExecuted: boolean;
  onRefresh: () => void;
}

const SystemsTable: React.FC<SystemsTableProps> = ({
  systems,
  loading,
  queryExecuted,
  onRefresh
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-gray-500">Carregando sistemas...</div>
      </div>
    );
  }

  if (systems.length === 0) {
    return (
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
    );
  }

  return (
    <div className="bg-white rounded shadow">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              {queryExecuted ? 'Resultados da Consulta' : 'Sistemas Cadastrados'}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {queryExecuted 
                ? `${systems.length} sistema(s) encontrado(s) com os filtros aplicados`
                : 'Lista completa de todos os sistemas registrados no portal'
              }
            </p>
          </div>
          <button 
            onClick={onRefresh}
            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded flex items-center"
          >
            <i className="ri-refresh-line mr-1"></i>
            Atualizar
          </button>
        </div>
      </div>
      <div className="p-6">
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
            {systems.map((system) => (
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
      </div>
    </div>
  );
};

export default SystemsTable;
