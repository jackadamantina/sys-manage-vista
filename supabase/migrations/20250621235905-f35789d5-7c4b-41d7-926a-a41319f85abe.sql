
-- Desabilitar RLS temporariamente para a tabela user_import_files_idm
-- Isso permite que o sistema funcione com autenticação customizada
ALTER TABLE public.user_import_files_idm DISABLE ROW LEVEL SECURITY;

-- Remover as políticas existentes já que não são mais necessárias
DROP POLICY IF EXISTS "Allow authenticated users to view import files" ON public.user_import_files_idm;
DROP POLICY IF EXISTS "Allow authenticated users to insert import files" ON public.user_import_files_idm;
DROP POLICY IF EXISTS "Allow authenticated users to update import files" ON public.user_import_files_idm;

-- Fazer o mesmo para a tabela imported_users_idm para consistência
ALTER TABLE public.imported_users_idm DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view imported users" ON public.imported_users_idm;
DROP POLICY IF EXISTS "Users can insert imported users" ON public.imported_users_idm;
