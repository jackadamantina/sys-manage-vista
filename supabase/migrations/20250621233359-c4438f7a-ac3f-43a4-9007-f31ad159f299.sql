
-- Verificar e corrigir as políticas RLS para user_import_files_idm
DROP POLICY IF EXISTS "Allow authenticated users to manage import files" ON public.user_import_files_idm;

-- Criar políticas mais específicas para a tabela user_import_files_idm
CREATE POLICY "Users can view their own import files" 
  ON public.user_import_files_idm 
  FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Users can insert import files" 
  ON public.user_import_files_idm 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

CREATE POLICY "Users can update their own import files" 
  ON public.user_import_files_idm 
  FOR UPDATE 
  TO authenticated 
  USING (true);

-- Verificar e corrigir as políticas RLS para imported_users_idm
ALTER TABLE public.imported_users_idm ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view imported users" 
  ON public.imported_users_idm 
  FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Users can insert imported users" 
  ON public.imported_users_idm 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (true);
