
-- Criar tabela para armazenar usuários importados (base da verdade)
CREATE TABLE public.imported_users_idm (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  username TEXT,
  department TEXT,
  status TEXT DEFAULT 'active',
  imported_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Adicionar índices para melhor performance nas consultas
CREATE INDEX idx_imported_users_idm_email ON public.imported_users_idm(email);
CREATE INDEX idx_imported_users_idm_username ON public.imported_users_idm(username);
CREATE INDEX idx_imported_users_idm_status ON public.imported_users_idm(status);

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.imported_users_idm ENABLE ROW LEVEL SECURITY;

-- Criar política para permitir acesso aos usuários autenticados
CREATE POLICY "Allow authenticated users to manage imported users" 
  ON public.imported_users_idm 
  FOR ALL 
  TO authenticated 
  USING (true) 
  WITH CHECK (true);

-- Criar trigger para atualizar updated_at automaticamente
CREATE TRIGGER update_imported_users_idm_updated_at
  BEFORE UPDATE ON public.imported_users_idm
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
