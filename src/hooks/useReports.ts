
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
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
      console.log('Carregando sistemas para relatórios...');
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('systems_idm')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('Sistemas carregados para relatórios:', { data, error });

      if (error) {
        console.error('Erro ao carregar sistemas:', error);
        setError(`Erro ao carregar sistemas: ${error.message}`);
        toast({
          title: "Erro",
          description: `Erro ao carregar sistemas: ${error.message}`,
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
      const errorMessage = 'Erro inesperado ao carregar sistemas';
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
    console.log('Executando query com filtros:', queryFilters);
    
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
