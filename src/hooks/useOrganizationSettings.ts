
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PasswordPolicy {
  min_length: number;
  require_uppercase: boolean;
  require_lowercase: boolean;
  require_numbers: boolean;
  require_special_chars: boolean;
  expiry_days: number;
}

interface OrganizationSettings {
  id: string;
  organization_name: string;
  timezone: string;
  password_policy: PasswordPolicy;
  session_timeout_minutes: number;
}

export const useOrganizationSettings = () => {
  const [settings, setSettings] = useState<OrganizationSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('organization_settings')
        .select('*')
        .single();

      if (error) {
        console.error('Erro ao buscar configurações:', error);
        return;
      }

      // Converter Json para PasswordPolicy
      const parsedSettings: OrganizationSettings = {
        ...data,
        password_policy: typeof data.password_policy === 'string' 
          ? JSON.parse(data.password_policy) 
          : data.password_policy as unknown as PasswordPolicy
      };

      setSettings(parsedSettings);
    } catch (error) {
      console.error('Erro ao buscar configurações:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (updatedSettings: Partial<OrganizationSettings>) => {
    try {
      // Convert PasswordPolicy back to JSON for database storage
      const dbSettings = {
        ...updatedSettings,
        ...(updatedSettings.password_policy && {
          password_policy: updatedSettings.password_policy as any
        })
      };

      const { error } = await supabase
        .from('organization_settings')
        .update(dbSettings)
        .eq('id', settings?.id);

      if (error) {
        console.error('Erro ao atualizar configurações:', error);
        toast({
          title: "Erro",
          description: "Não foi possível salvar as configurações",
          variant: "destructive",
        });
        return false;
      }

      await fetchSettings();
      toast({
        title: "Sucesso",
        description: "Configurações salvas com sucesso",
      });
      return true;
    } catch (error) {
      console.error('Erro ao atualizar configurações:', error);
      toast({
        title: "Erro", 
        description: "Não foi possível salvar as configurações",
        variant: "destructive",
      });
      return false;
    }
  };

  const validatePassword = async (password: string) => {
    try {
      const { data, error } = await supabase.rpc('validate_password_policy', {
        p_password: password
      });

      if (error) {
        console.error('Erro ao validar senha:', error);
        return { is_valid: false, errors: ['Erro ao validar senha'] };
      }

      return data[0];
    } catch (error) {
      console.error('Erro ao validar senha:', error);
      return { is_valid: false, errors: ['Erro ao validar senha'] };
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return {
    settings,
    loading,
    updateSettings,
    validatePassword,
    refetchSettings: fetchSettings
  };
};
