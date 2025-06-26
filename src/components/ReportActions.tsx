
import React from 'react';
import { useToast } from '@/hooks/use-toast';
import { System } from '@/types/system';
import { convertSystemToCSVData, convertToCSV, downloadCSV } from '@/utils/csvExport';

interface ReportActionsProps {
  systems: System[];
  filteredSystems: System[];
  queryExecuted: boolean;
}

const ReportActions: React.FC<ReportActionsProps> = ({
  systems,
  filteredSystems,
  queryExecuted
}) => {
  const { toast } = useToast();

  const generateCompleteReport = () => {
    console.log('Gerando relatório completo com todos os campos...');
    
    const reportData = systems.map(convertSystemToCSVData);

    // Gerar e baixar CSV
    const csvContent = convertToCSV(reportData);
    downloadCSV(csvContent, `relatorio_completo_sistemas_${new Date().toISOString().split('T')[0]}.csv`);

    toast({
      title: "Relatório Gerado",
      description: `Relatório completo com ${reportData.length} sistema(s) foi gerado e baixado`,
    });
  };

  const exportResultsToCSV = () => {
    console.log('Exportando resultados para CSV...');
    
    const dataToExport = queryExecuted ? filteredSystems : systems;
    const exportData = dataToExport.map(convertSystemToCSVData);

    const csvContent = convertToCSV(exportData);
    const fileName = queryExecuted 
      ? `resultados_consulta_${new Date().toISOString().split('T')[0]}.csv`
      : `todos_sistemas_${new Date().toISOString().split('T')[0]}.csv`;
    
    downloadCSV(csvContent, fileName);

    toast({
      title: "Dados Exportados",
      description: `${exportData.length} sistema(s) exportado(s) para CSV`,
    });
  };

  return {
    generateCompleteReport,
    exportResultsToCSV
  };
};

export default ReportActions;
