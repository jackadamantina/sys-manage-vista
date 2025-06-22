
-- Criar tabela para armazenar usuários específicos de cada sistema
CREATE TABLE public.system_users_idm (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  system_id uuid NOT NULL REFERENCES public.systems_idm(id) ON DELETE CASCADE,
  username text NOT NULL,
  name text,
  email text,
  imported_at timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Índices para melhor performance
CREATE INDEX idx_system_users_system_id ON public.system_users_idm(system_id);
CREATE INDEX idx_system_users_username ON public.system_users_idm(username);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_system_users_idm_updated_at
  BEFORE UPDATE ON public.system_users_idm
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Desabilitar RLS para permitir funcionalidade sem autenticação complexa
ALTER TABLE public.system_users_idm DISABLE ROW LEVEL SECURITY;
