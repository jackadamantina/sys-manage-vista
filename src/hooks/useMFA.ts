
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface MFASettings {
  id: string;
  user_id: string;
  mfa_enabled: boolean;
  mfa_type: string;
  phone_number?: string;
  is_verified: boolean;
}

export const useMFA = (userId?: string) => {
  const [mfaSettings, setMfaSettings] = useState<MFASettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [verificationCode, setVerificationCode] = useState('');
  const { toast } = useToast();

  const fetchMFASettings = async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('user_mfa_settings')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Erro ao buscar configurações MFA:', error);
        return;
      }

      setMfaSettings(data);
    } catch (error) {
      console.error('Erro ao buscar configurações MFA:', error);
    } finally {
      setLoading(false);
    }
  };

  const enableMFA = async (mfaType: string = 'sms', phoneNumber?: string) => {
    if (!userId) return false;

    try {
      const { data, error } = await supabase
        .from('user_mfa_settings')
        .upsert({
          user_id: userId,
          mfa_enabled: true,
          mfa_type: mfaType,
          phone_number: phoneNumber,
          is_verified: false
        })
        .select()
        .single();

      if (error) {
        console.error('Erro ao ativar MFA:', error);
        toast({
          title: "Erro",
          description: "Não foi possível ativar o 2FA",
          variant: "destructive",
        });
        return false;
      }

      setMfaSettings(data);
      toast({
        title: "Sucesso",
        description: "2FA ativado com sucesso",
      });
      return true;
    } catch (error) {
      console.error('Erro ao ativar MFA:', error);
      return false;
    }
  };

  const disableMFA = async () => {
    if (!userId || !mfaSettings) return false;

    try {
      const { error } = await supabase
        .from('user_mfa_settings')
        .update({ mfa_enabled: false, is_verified: false })
        .eq('user_id', userId);

      if (error) {
        console.error('Erro ao desativar MFA:', error);
        toast({
          title: "Erro",
          description: "Não foi possível desativar o 2FA",
          variant: "destructive",
        });
        return false;
      }

      await fetchMFASettings();
      toast({
        title: "Sucesso",
        description: "2FA desativado com sucesso",
      });
      return true;
    } catch (error) {
      console.error('Erro ao desativar MFA:', error);
      return false;
    }
  };

  const generateMFACode = async () => {
    if (!userId) return null;

    try {
      const { data, error } = await supabase.rpc('generate_mfa_code', {
        p_user_id: userId
      });

      if (error) {
        console.error('Erro ao gerar código MFA:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Erro ao gerar código MFA:', error);
      return null;
    }
  };

  const verifyMFACode = async (code: string) => {
    if (!userId) return false;

    try {
      const { data, error } = await supabase
        .from('temp_mfa_codes')
        .select('*')
        .eq('user_id', userId)
        .eq('code', code)
        .gte('expires_at', new Date().toISOString())
        .single();

      if (error || !data) {
        toast({
          title: "Erro",
          description: "Código inválido ou expirado",
          variant: "destructive",
        });
        return false;
      }

      // Marcar como verificado
      await supabase
        .from('user_mfa_settings')
        .update({ is_verified: true })
        .eq('user_id', userId);

      // Remover código temporário
      await supabase
        .from('temp_mfa_codes')
        .delete()
        .eq('user_id', userId);

      await fetchMFASettings();
      toast({
        title: "Sucesso",
        description: "2FA verificado com sucesso",
      });
      return true;
    } catch (error) {
      console.error('Erro ao verificar código MFA:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchMFASettings();
  }, [userId]);

  return {
    mfaSettings,
    loading,
    enableMFA,
    disableMFA,
    generateMFACode,
    verifyMFACode,
    verificationCode,
    setVerificationCode,
    refetchMFASettings: fetchMFASettings
  };
};
