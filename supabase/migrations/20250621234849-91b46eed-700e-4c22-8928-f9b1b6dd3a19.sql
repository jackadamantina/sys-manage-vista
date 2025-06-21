
-- Fix the RLS policies for user_import_files_idm table
DROP POLICY IF EXISTS "Users can view their own import files" ON public.user_import_files_idm;
DROP POLICY IF EXISTS "Users can insert import files" ON public.user_import_files_idm;
DROP POLICY IF EXISTS "Users can update their own import files" ON public.user_import_files_idm;

-- Create new policies that work with the custom auth system
-- Since this app uses custom authentication (not Supabase auth), we need different policies

-- Allow authenticated users to view all import files (you can restrict this later if needed)
CREATE POLICY "Allow authenticated users to view import files" 
  ON public.user_import_files_idm 
  FOR SELECT 
  TO authenticated 
  USING (true);

-- Allow authenticated users to insert import files
CREATE POLICY "Allow authenticated users to insert import files" 
  ON public.user_import_files_idm 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

-- Allow authenticated users to update import files
CREATE POLICY "Allow authenticated users to update import files" 
  ON public.user_import_files_idm 
  FOR UPDATE 
  TO authenticated 
  USING (true);

-- Temporary: Disable RLS entirely for this table to test
-- ALTER TABLE public.user_import_files_idm DISABLE ROW LEVEL SECURITY;
