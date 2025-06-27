
import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';
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
      const data = await apiClient.getOrganizationSettings();

      // Parse password_policy if it's a string
      const parsedSettings: OrganizationSettings = {
        ...data,
        password_policy: typeof data.password_policy === 'string' 
          ? JSON.parse(data.password_policy) 
          : data.password_policy as unknown as PasswordPolicy
      };

      setSettings(parsedSettings);
    } catch (error: any) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (updatedSettings: Partial<OrganizationSettings>) => {
    try {
      await apiClient.updateOrganizationSettings(updatedSettings);
      await fetchSettings();
      toast({
        title: "Sucesso",
        description: "Configurações salvas com sucesso",
      });
      return true;
    } catch (error: any) {
      console.error('Error updating settings:', error);
      toast({
        title: "Erro", 
        description: error.message || "Não foi possível salvar as configurações",
        variant: "destructive",
      });
      return false;
    }
  };

  const validatePassword = async (password: string) => {
    // For now, implement client-side validation
    // You can implement server-side validation later if needed
    const errors: string[] = [];
    
    if (!settings?.password_policy) {
      return { is_valid: false, errors: ['Política de senha não configurada'] };
    }

    const policy = settings.password_policy;
    
    if (password.length < policy.min_length) {
      errors.push(`Senha deve ter pelo menos ${policy.min_length} caracteres`);
    }
    
    if (policy.require_uppercase && !/[A-Z]/.test(password)) {
      errors.push('Senha deve conter pelo menos uma letra maiúscula');
    }
    
    if (policy.require_lowercase && !/[a-z]/.test(password)) {
      errors.push('Senha deve conter pelo menos uma letra minúscula');
    }
    
    if (policy.require_numbers && !/\d/.test(password)) {
      errors.push('Senha deve conter pelo menos um número');
    }
    
    if (policy.require_special_chars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Senha deve conter pelo menos um caractere especial');
    }

    return {
      is_valid: errors.length === 0,
      errors
    };
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
