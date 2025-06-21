
-- Create RPC function to handle import file insertion
CREATE OR REPLACE FUNCTION public.insert_import_file(
  p_file_name TEXT,
  p_file_size INTEGER,
  p_imported_by UUID,
  p_total_records INTEGER
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_file_id UUID;
BEGIN
  INSERT INTO public.user_import_files_idm (
    file_name,
    file_size,
    imported_by,
    total_records,
    processed_records,
    status
  )
  VALUES (
    p_file_name,
    p_file_size,
    p_imported_by,
    p_total_records,
    0,
    'processing'
  )
  RETURNING id INTO new_file_id;
  
  RETURN new_file_id;
END;
$$;
