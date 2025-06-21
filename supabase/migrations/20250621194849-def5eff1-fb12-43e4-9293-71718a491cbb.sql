
-- Criar tabela para armazenar os sistemas cadastrados
CREATE TABLE public.systems (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  url TEXT,
  hosting TEXT,
  access_type TEXT,
  responsible TEXT,
  user_management_responsible TEXT,
  password_complexity TEXT,
  onboarding_type TEXT,
  offboarding_type TEXT,
  offboarding_priority TEXT,
  named_users BOOLEAN,
  sso_configuration TEXT,
  integration_type TEXT,
  region_blocking TEXT,
  mfa_configuration TEXT,
  mfa_policy TEXT,
  mfa_sms_policy TEXT,
  logs_status TEXT,
  log_types JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES public.user_idm(id),
  version TEXT
);

-- Habilitar Row Level Security
ALTER TABLE public.systems ENABLE ROW LEVEL SECURITY;

-- Política para permitir que usuários vejam todos os sistemas
CREATE POLICY "Users can view all systems" 
  ON public.systems 
  FOR SELECT 
  USING (true);

-- Política para permitir que usuários criem sistemas
CREATE POLICY "Users can create systems" 
  ON public.systems 
  FOR INSERT 
  WITH CHECK (true);

-- Política para permitir que usuários atualizem sistemas
CREATE POLICY "Users can update systems" 
  ON public.systems 
  FOR UPDATE 
  USING (true);

-- Trigger para atualizar updated_at automaticamente
CREATE TRIGGER update_systems_updated_at
    BEFORE UPDATE ON public.systems
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
