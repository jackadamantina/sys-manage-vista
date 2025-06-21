
-- Renomear a tabela user_import_files para user_import_files_idm
ALTER TABLE IF EXISTS public.user_import_files RENAME TO user_import_files_idm;

-- Se a tabela não existir ainda, criar com o nome correto
CREATE TABLE IF NOT EXISTS public.user_import_files_idm (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  file_name TEXT NOT NULL,
  file_size INTEGER,
  import_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  imported_by UUID REFERENCES public.user_idm(id),
  total_records INTEGER DEFAULT 0,
  processed_records INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS na tabela corrigida
ALTER TABLE public.user_import_files_idm ENABLE ROW LEVEL SECURITY;

-- Recriar políticas com o nome correto da tabela
DROP POLICY IF EXISTS "Allow authenticated users to manage import files" ON public.user_import_files_idm;
CREATE POLICY "Allow authenticated users to manage import files" 
  ON public.user_import_files_idm 
  FOR ALL 
  TO authenticated 
  USING (true) 
  WITH CHECK (true);

-- Recriar trigger com o nome correto da tabela
DROP TRIGGER IF EXISTS update_user_import_files_updated_at ON public.user_import_files_idm;
CREATE TRIGGER update_user_import_files_idm_updated_at
  BEFORE UPDATE ON public.user_import_files_idm
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Recriar índices com o nome correto da tabela
DROP INDEX IF EXISTS idx_user_import_files_import_date;
DROP INDEX IF EXISTS idx_user_import_files_status;
CREATE INDEX IF NOT EXISTS idx_user_import_files_idm_import_date ON public.user_import_files_idm(import_date);
CREATE INDEX IF NOT EXISTS idx_user_import_files_idm_status ON public.user_import_files_idm(status);
