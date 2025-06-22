
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import CreateUserModal from './CreateUserModal';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type UserRole = 'admin' | 'user' | 'viewer';

interface SystemUser {
  id: string;
  email: string;
  username: string;
  full_name: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
}

interface ImportedUser {
  id: string;
  name: string;
  email: string | null;
  username: string | null;
  department: string | null;
  status: string | null;
  imported_at: string;
}

const UserManagement = () => {
  const { user: currentUser } = useAuth();
  const [systemUsers, setSystemUsers] = useState<SystemUser[]>([]);
  const [importedUsers, setImportedUsers] = useState<ImportedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [activeTab, setActiveTab] = useState('system');
  
  const isAdmin = currentUser?.role === 'admin';

  // Fetch system users
  const fetchSystemUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('user_idm')
        .select('id, email, username, full_name, role, is_active, created_at')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar usuários do sistema:', error);
        toast.error('Erro ao carregar usuários do sistema');
        return;
      }

      const typedUsers = (data || []).map(user => ({
        ...user,
        role: user.role as UserRole
      }));

      setSystemUsers(typedUsers);
    } catch (error) {
      console.error('Erro ao buscar usuários do sistema:', error);
      toast.error('Erro ao carregar usuários do sistema');
    }
  };

  // Fetch imported users
  const fetchImportedUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('imported_users_idm')
        .select('*')
        .order('imported_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar usuários importados:', error);
        toast.error('Erro ao carregar usuários importados');
        return;
      }

      setImportedUsers(data || []);
    } catch (error) {
      console.error('Erro ao buscar usuários importados:', error);
      toast.error('Erro ao carregar usuários importados');
    }
  };

  useEffect(() => {
    const loadAllUsers = async () => {
      setLoading(true);
      await Promise.all([fetchSystemUsers(), fetchImportedUsers()]);
      setLoading(false);
    };
    
    loadAllUsers();
  }, []);

  // Filter system users
  const filteredSystemUsers = systemUsers.filter(user => {
    const matchesSearch = user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === '' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Filter imported users
  const filteredImportedUsers = importedUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (user.username && user.username.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'user':
        return 'Usuário';
      case 'viewer':
        return 'Visualizador';
      default:
        return role;
    }
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'user':
        return 'bg-blue-100 text-blue-800';
      case 'viewer':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-3 text-gray-600">Carregando usuários...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-800">Gestão de Usuários</h2>
        {isAdmin && (
          <button 
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-primary text-white rounded-button flex items-center"
          >
            <i className="ri-user-add-line mr-2"></i>
            Novo Usuário
          </button>
        )}
      </div>

      {!isAdmin && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <div className="flex">
            <i className="ri-information-line text-yellow-400 mr-3 mt-0.5"></i>
            <div>
              <h3 className="text-sm font-medium text-yellow-800">Acesso Limitado</h3>
              <p className="text-sm text-yellow-700 mt-1">
                Apenas administradores podem criar e gerenciar usuários do sistema.
              </p>
            </div>
          </div>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="system">
            Usuários do Sistema ({systemUsers.length})
          </TabsTrigger>
          <TabsTrigger value="imported">
            Usuários Importados ({importedUsers.length})
          </TabsTrigger>
        </TabsList>

        <div className="flex justify-between items-center">
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="Buscar usuários..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary"
            />
            {activeTab === 'system' && (
              <select 
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="">Todos os perfis</option>
                <option value="admin">Administrador</option>
                <option value="user">Usuário</option>
                <option value="viewer">Visualizador</option>
              </select>
            )}
          </div>
        </div>

        <TabsContent value="system">
          <div className="bg-white rounded shadow">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">
                Usuários do Sistema ({filteredSystemUsers.length})
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Usuário
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Perfil
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data de Cadastro
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredSystemUsers.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
                            {user.full_name.charAt(0).toUpperCase()}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.full_name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                            <div className="text-xs text-gray-400">@{user.username}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleColor(user.role)}`}>
                          {getRoleLabel(user.role)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {user.is_active ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(user.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-2">
                          <button className="text-gray-500 hover:text-primary">
                            <i className="ri-eye-line"></i>
                          </button>
                          {isAdmin && (
                            <>
                              <button className="text-gray-500 hover:text-primary">
                                <i className="ri-edit-line"></i>
                              </button>
                              <button className="text-gray-500 hover:text-red-500">
                                <i className="ri-delete-bin-line"></i>
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredSystemUsers.length === 0 && (
                <div className="text-center py-8">
                  <i className="ri-user-line text-4xl text-gray-300 mb-4"></i>
                  <p className="text-gray-500">Nenhum usuário do sistema encontrado</p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="imported">
          <div className="bg-white rounded shadow">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">
                Usuários Importados ({filteredImportedUsers.length})
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nome
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Usuário
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Departamento
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data de Importação
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredImportedUsers.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm">
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
              
              {filteredImportedUsers.length === 0 && (
                <div className="text-center py-8">
                  <i className="ri-database-line text-4xl text-gray-300 mb-4"></i>
                  <p className="text-gray-500">Nenhum usuário importado encontrado</p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Modal para criar usuário */}
      {showCreateModal && isAdmin && (
        <CreateUserModal
          isOpen={showCreateModal}
          onClose={() => {
            setShowCreateModal(false);
            fetchSystemUsers(); // Refresh the list when modal closes
          }}
        />
      )}
    </div>
  );
};

export default UserManagement;
