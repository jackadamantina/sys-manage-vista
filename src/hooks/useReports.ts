import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { System, QueryFilters } from '@/types/system';

export const useReports = () => {
  const [systems, setSystems] = useState<System[]>([]);
  const [filteredSystems, setFilteredSystems] = useState<System[]>([]);
  const [loading, setLoading] = useState(true);
  const [queryExecuted, setQueryExecuted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const [queryFilters, setQueryFilters] = useState<QueryFilters>({
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

  const loadSystems = async () => {
    try {
      console.log('Loading systems for reports...');
      setLoading(true);
      setError(null);
      
      const data = await apiClient.getSystems();

      console.log('Systems loaded for reports:', data);
      setSystems(data || []);
      if (!queryExecuted) {
        setFilteredSystems(data || []);
      }
    } catch (error: any) {
      console.error('Error loading systems:', error);
      const errorMessage = error.message || 'Unexpected error loading systems';
      setError(errorMessage);
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field: string, value: any) => {
    setQueryFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const executeQuery = () => {
    console.log('Executing query with filters:', queryFilters);
    
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

  useEffect(() => {
    loadSystems();
  }, []);

  return {
    systems,
    filteredSystems,
    loading,
    queryExecuted,
    error,
    queryFilters,
    loadSystems,
    handleFilterChange,
    executeQuery,
    clearFilters
  };
};
