
-- Criar tabela para configurações da organização
CREATE TABLE public.organization_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_name TEXT NOT NULL DEFAULT 'Empresa LTDA',
  timezone TEXT NOT NULL DEFAULT 'America/Sao_Paulo',
  password_policy JSONB DEFAULT '{
    "min_length": 8,
    "require_uppercase": true,
    "require_lowercase": true,
    "require_numbers": true,
    "require_special_chars": true,
    "expiry_days": 90
  }'::jsonb,
  session_timeout_minutes INTEGER DEFAULT 60,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Inserir registro padrão de configurações
INSERT INTO public.organization_settings (organization_name, timezone) VALUES ('Empresa LTDA', 'America/Sao_Paulo');

-- Habilitar RLS
ALTER TABLE public.organization_settings ENABLE ROW LEVEL SECURITY;

-- Política para permitir que usuários vejam e atualizem configurações
CREATE POLICY "Users can view organization settings" 
  ON public.organization_settings 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can update organization settings" 
  ON public.organization_settings 
  FOR UPDATE 
  USING (true);

-- Trigger para atualizar updated_at automaticamente
CREATE TRIGGER update_organization_settings_updated_at
    BEFORE UPDATE ON public.organization_settings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Criar função para validar política de senhas
CREATE OR REPLACE FUNCTION public.validate_password_policy(p_password text)
RETURNS TABLE(is_valid boolean, errors text[])
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
DECLARE
  settings RECORD;
  error_list text[] := '{}';
BEGIN
  -- Buscar configurações de política de senha
  SELECT password_policy INTO settings 
  FROM public.organization_settings 
  LIMIT 1;
  
  -- Verificar comprimento mínimo
  IF length(p_password) < (settings.password_policy->>'min_length')::integer THEN
    error_list := array_append(error_list, 'Senha deve ter pelo menos ' || (settings.password_policy->>'min_length') || ' caracteres');
  END IF;
  
  -- Verificar maiúscula
  IF (settings.password_policy->>'require_uppercase')::boolean AND p_password !~ '[A-Z]' THEN
    error_list := array_append(error_list, 'Senha deve conter pelo menos uma letra maiúscula');
  END IF;
  
  -- Verificar minúscula
  IF (settings.password_policy->>'require_lowercase')::boolean AND p_password !~ '[a-z]' THEN
    error_list := array_append(error_list, 'Senha deve conter pelo menos uma letra minúscula');
  END IF;
  
  -- Verificar números
  IF (settings.password_policy->>'require_numbers')::boolean AND p_password !~ '[0-9]' THEN
    error_list := array_append(error_list, 'Senha deve conter pelo menos um número');
  END IF;
  
  -- Verificar caracteres especiais
  IF (settings.password_policy->>'require_special_chars')::boolean AND p_password !~ '[^A-Za-z0-9]' THEN
    error_list := array_append(error_list, 'Senha deve conter pelo menos um caractere especial');
  END IF;
  
  RETURN QUERY SELECT (array_length(error_list, 1) IS NULL OR array_length(error_list, 1) = 0), error_list;
END;
$$;

-- Atualizar tabela user_mfa_settings para incluir mais campos
ALTER TABLE public.user_mfa_settings 
ADD COLUMN IF NOT EXISTS mfa_type TEXT DEFAULT 'totp',
ADD COLUMN IF NOT EXISTS phone_number TEXT,
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false;

-- Criar função para gerar código 2FA
CREATE OR REPLACE FUNCTION public.generate_mfa_code(p_user_id uuid)
RETURNS TEXT
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
DECLARE
  code_length INTEGER := 6;
  code TEXT := '';
  i INTEGER;
BEGIN
  -- Gerar código de 6 dígitos
  FOR i IN 1..code_length LOOP
    code := code || floor(random() * 10)::text;
  END LOOP;
  
  -- Armazenar código temporário (válido por 5 minutos)
  INSERT INTO public.temp_mfa_codes (user_id, code, expires_at)
  VALUES (p_user_id, code, now() + interval '5 minutes')
  ON CONFLICT (user_id) DO UPDATE SET
    code = EXCLUDED.code,
    expires_at = EXCLUDED.expires_at;
    
  RETURN code;
END;
$$;

-- Tabela para códigos temporários de MFA
CREATE TABLE IF NOT EXISTS public.temp_mfa_codes (
  user_id UUID PRIMARY KEY REFERENCES public.user_idm(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Habilitar RLS na tabela de códigos temporários
ALTER TABLE public.temp_mfa_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own mfa codes" 
  ON public.temp_mfa_codes 
  USING (user_id = auth.uid());
