
-- Renomear a tabela systems para systems_idm
ALTER TABLE public.systems RENAME TO systems_idm;

-- Adicionar a coluna integrated_users que estava faltando
ALTER TABLE public.systems_idm 
ADD COLUMN integrated_users BOOLEAN;
