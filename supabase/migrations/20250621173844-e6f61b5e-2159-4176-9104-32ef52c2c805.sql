
-- Criar tabela específica para usuários do IDM
CREATE TABLE public.user_idm (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  username TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS na tabela user_idm
ALTER TABLE public.user_idm ENABLE ROW LEVEL SECURITY;

-- Política para permitir que usuários vejam apenas seus próprios dados
CREATE POLICY "Users can view their own data" 
  ON public.user_idm 
  FOR SELECT 
  USING (auth.uid()::text = id::text);

-- Política para permitir inserção de novos usuários (necessário para registro)
CREATE POLICY "Allow user registration" 
  ON public.user_idm 
  FOR INSERT 
  WITH CHECK (true);

-- Política para permitir atualização dos próprios dados
CREATE POLICY "Users can update their own data" 
  ON public.user_idm 
  FOR UPDATE 
  USING (auth.uid()::text = id::text);

-- Função para autenticação personalizada usando a nova tabela
CREATE OR REPLACE FUNCTION public.authenticate_idm_user(
  p_email TEXT,
  p_password TEXT
)
RETURNS TABLE(
  user_id UUID,
  email TEXT,
  username TEXT,
  full_name TEXT,
  role TEXT,
  success BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id,
    u.email,
    u.username,
    u.full_name,
    u.role,
    (u.password = p_password AND u.is_active = true) as success
  FROM public.user_idm u
  WHERE u.email = p_email;
END;
$$;

-- Inserir usuário administrador padrão
INSERT INTO public.user_idm (email, password, username, full_name, role)
VALUES ('admin@idm.com', 'admin123', 'admin', 'Administrador', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Inserir usuário padrão para teste
INSERT INTO public.user_idm (email, password, username, full_name, role) 
VALUES ('ricardo@idm.com', '123456', 'ricardo', 'Ricardo Oliveira', 'user')
ON CONFLICT (email) DO NOTHING;

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_idm_updated_at 
    BEFORE UPDATE ON public.user_idm 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
