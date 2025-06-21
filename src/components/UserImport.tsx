
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface ImportedUser {
  id: string;
  name: string;
  email: string | null;
  username: string | null;
  department: string | null;
  status: string | null;
  imported_at: string;
}

interface ImportFile {
  id: string;
  file_name: string;
  file_size: number | null;
  import_date: string;
  total_records: number | null;
  processed_records: number | null;
  status: string | null;
}

const UserImport = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [importedUsers, setImportedUsers] = useState<ImportedUser[]>([]);
  const [importFiles, setImportFiles] = useState<ImportFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Carregar usuários importados
  const loadImportedUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('imported_users_idm')
        .select('*')
        .order('imported_at', { ascending: false });

      if (error) {
        console.error('Erro ao carregar usuários importados:', error);
        toast({
          title: "Erro",
          description: "Erro ao carregar usuários importados",
          variant: "destructive"
        });
        return;
      }

      setImportedUsers(data || []);
    } catch (error) {
      console.error('Erro ao carregar usuários importados:', error);
    }
  };

  const loadImportFiles = async () => {
    try {
      const { data, error } = await supabase
        .from('user_import_files_idm')
        .select('*')
        .order('import_date', { ascending: false });

      if (error) {
        console.error('Erro ao carregar histórico de importações:', error);
        return;
      }

      setImportFiles(data || []);
    } catch (error) {
      console.error('Erro ao carregar histórico de importações:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([loadImportedUsers(), loadImportFiles()]);
      setLoading(false);
    };
    
    loadData();
  }, []);

  // Função corrigida para processar arquivo CSV/Excel
  const processFile = (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const lines = text.split('\n').filter(line => line.trim());
          
          if (lines.length === 0) {
            reject(new Error('Arquivo vazio'));
            return;
          }

          console.log('Processando arquivo com', lines.length, 'linhas');
          
          // Primeira linha são os cabeçalhos
          const headerLine = lines[0];
          const headers = headerLine.split(',').map(h => h.trim().toLowerCase());
          
          console.log('Cabeçalhos encontrados:', headers);
          
          const users = [];
          
          // Processar as linhas de dados (pular a primeira linha que é o cabeçalho)
          for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            
            const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
            console.log('Processando linha:', values);
            
            const user: any = {};
            
            // Mapear valores baseado nos cabeçalhos
            headers.forEach((header, index) => {
              const value = values[index] || '';
              
              if (header.includes('nome') || header.includes('name')) {
                user.name = value;
              } else if (header.includes('email')) {
                user.email = value;
              } else if (header.includes('usuario') || header.includes('username')) {
                user.username = value;
              } else if (header.includes('departamento') || header.includes('department')) {
                user.department = value;
              }
            });
            
            // Verificar se pelo menos o nome foi preenchido
            if (user.name && user.name.trim()) {
              users.push(user);
              console.log('Usuário adicionado:', user);
            }
          }
          
          console.log('Total de usuários processados:', users.length);
          resolve(users);
        } catch (error) {
          console.error('Erro ao processar arquivo:', error);
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
      reader.readAsText(file);
    });
  };

  // Fazer upload e processar arquivo
  const handleFileUpload = async () => {
    if (!selectedFile || !user) {
      console.log('Erro: arquivo não selecionado ou usuário não logado', { selectedFile, user });
      toast({
        title: "Erro",
        description: "Selecione um arquivo e certifique-se de estar logado",
        variant: "destructive"
      });
      return;
    }

    console.log('Iniciando upload do arquivo:', selectedFile.name);
    console.log('Usuário logado:', user);
    
    setUploading(true);
    try {
      console.log('Processando arquivo...');
      // Processar o arquivo
      const users = await processFile(selectedFile);
      console.log('Usuários processados:', users);
      
      if (users.length === 0) {
        console.log('Nenhum usuário válido encontrado');
        toast({
          title: "Aviso",
          description: "Nenhum usuário válido encontrado no arquivo",
          variant: "destructive"
        });
        return;
      }

      console.log('Registrando arquivo de importação...');
      // Registrar o arquivo de importação
      const { data: importFileData, error: fileError } = await supabase
        .from('user_import_files_idm')
        .insert([{
          file_name: selectedFile.name,
          file_size: selectedFile.size,
          imported_by: user.id,
          total_records: users.length,
          processed_records: 0,
          status: 'processing'
        }])
        .select()
        .single();

      if (fileError) {
        console.error('Erro ao registrar arquivo:', fileError);
        console.error('Dados que tentamos inserir:', {
          file_name: selectedFile.name,
          file_size: selectedFile.size,
          imported_by: user.id,
          total_records: users.length,
          processed_records: 0,
          status: 'processing'
        });
        throw fileError;
      }

      console.log('Arquivo registrado com sucesso:', importFileData);

      console.log('Inserindo usuários importados...');
      // Inserir usuários importados
      const usersToInsert = users.map(user => ({
        ...user,
        status: 'active'
      }));

      console.log('Dados dos usuários a serem inseridos:', usersToInsert);

      const { error: usersError, data: insertedUsers } = await supabase
        .from('imported_users_idm')
        .insert(usersToInsert)
        .select();

      if (usersError) {
        console.error('Erro ao inserir usuários:', usersError);
        console.error('Dados que tentamos inserir:', usersToInsert);
        throw usersError;
      }

      console.log('Usuários inseridos com sucesso:', insertedUsers);

      console.log('Atualizando status do arquivo...');
      // Atualizar status do arquivo
      const { error: updateError } = await supabase
        .from('user_import_files_idm')
        .update({
          processed_records: users.length,
          status: 'completed'
        })
        .eq('id', importFileData.id);

      if (updateError) {
        console.error('Erro ao atualizar status do arquivo:', updateError);
        throw updateError;
      }

      console.log('Importação concluída com sucesso!');
      toast({
        title: "Sucesso",
        description: `${users.length} usuários importados com sucesso`,
      });

      // Recarregar dados
      await Promise.all([loadImportedUsers(), loadImportFiles()]);
      setSelectedFile(null);

    } catch (error) {
      console.error('Erro durante importação (catch block):', error);
      console.error('Stack trace:', error instanceof Error ? error.stack : 'N/A');
      toast({
        title: "Erro",
        description: `Erro durante a importação: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-3 text-gray-600">Carregando dados de importação...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Upload de Arquivo */}
      <div className="bg-white rounded shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Importar Lista de Usuários</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Arquivo CSV/Excel
            </label>
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary"
            />
            <p className="text-sm text-gray-500 mt-1">
              Formatos aceitos: CSV, Excel. O arquivo deve conter colunas: Nome, Email (opcional), Usuário (opcional), Departamento (opcional)
            </p>
          </div>
          
          {selectedFile && (
            <div className="bg-blue-50 border border-blue-200 rounded p-3">
              <p className="text-sm text-blue-800">
                <strong>Arquivo selecionado:</strong> {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
              </p>
            </div>
          )}

          <div className="flex justify-end">
            <button
              onClick={handleFileUpload}
              disabled={!selectedFile || uploading}
              className="px-6 py-2 bg-primary text-white rounded-button disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processando...
                </>
              ) : (
                <>
                  <i className="ri-upload-line mr-2"></i>
                  Importar Usuários
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Histórico de Importações */}
      <div className="bg-white rounded shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Histórico de Importações</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Arquivo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Registros</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {importFiles.map((file) => (
                <tr key={file.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{file.file_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(file.import_date)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {file.processed_records}/{file.total_records}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      file.status === 'completed' ? 'bg-green-100 text-green-800' :
                      file.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {file.status === 'completed' ? 'Concluído' :
                       file.status === 'processing' ? 'Processando' : 'Erro'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {importFiles.length === 0 && (
            <div className="text-center py-8">
              <i className="ri-file-line text-4xl text-gray-300 mb-4"></i>
              <p className="text-gray-500">Nenhuma importação realizada ainda</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">
            Usuários Importados ({importedUsers.length})
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuário</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Departamento</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data de Importação</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {importedUsers.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.email || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.username || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.department || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(user.imported_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status === 'active' ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {importedUsers.length === 0 && (
            <div className="text-center py-8">
              <i className="ri-user-line text-4xl text-gray-300 mb-4"></i>
              <p className="text-gray-500">Nenhum usuário importado ainda</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserImport;
