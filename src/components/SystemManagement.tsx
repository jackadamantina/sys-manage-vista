import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useVersioning } from '@/hooks/useVersioning';

interface System {
  id?: string;
  name: string;
  description: string;
  url: string;
  created_at?: string;
}

const SystemManagement = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { updateVersion } = useVersioning();
  const [systems, setSystems] = useState<System[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<System>({
    name: '',
    description: '',
    url: ''
  });

  const loadSystems = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('systems')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao carregar sistemas:', error);
        toast({
          title: "Erro",
          description: "Erro ao carregar sistemas",
          variant: "destructive"
        });
        return;
      }

      setSystems(data || []);
    } catch (error) {
      console.error('Erro ao carregar sistemas:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao carregar sistemas",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSystems();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Erro",
        description: "Usuário não autenticado",
        variant: "destructive"
      });
      return;
    }

    try {
      if (isEditing && editingId) {
        const { error } = await supabase
          .from('systems')
          .update({
            name: formData.name,
            description: formData.description,
            url: formData.url
          })
          .eq('id', editingId);

        if (error) throw error;

        toast({
          title: "Sucesso",
          description: "Sistema atualizado com sucesso!",
        });
      } else {
        const { error } = await supabase
          .from('systems')
          .insert([{
            name: formData.name,
            description: formData.description,
            url: formData.url,
            user_id: user.id
          }]);

        if (error) throw error;

        toast({
          title: "Sucesso",
          description: "Sistema cadastrado com sucesso!",
        });
      }

      // Update version and reload systems
      updateVersion();
      await loadSystems();
      
      // Reset form
      setFormData({ name: '', description: '', url: '' });
      setIsEditing(false);
      setEditingId(null);
      
    } catch (error) {
      console.error('Erro ao salvar sistema:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar sistema",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (system: System) => {
    setIsEditing(true);
    setEditingId(system.id!);
    setFormData({
      name: system.name,
      description: system.description,
      url: system.url
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este sistema?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('systems')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Sistema excluído com sucesso!",
      });

      updateVersion();
      await loadSystems();
    } catch (error) {
      console.error('Erro ao excluir sistema:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir sistema",
        variant: "destructive"
      });
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData({ name: '', description: '', url: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-800">Gestão de Sistemas</h2>
      </div>

      {/* Form */}
      <div className="bg-white rounded shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          {isEditing ? 'Editar Sistema' : 'Novo Sistema'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nome do Sistema</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">URL</label>
              <input
                type="url"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://exemplo.com"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
            <textarea
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary focus:border-primary"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              className="px-6 py-2 bg-primary text-white rounded-button flex items-center"
            >
              <i className="ri-save-line mr-2"></i>
              {isEditing ? 'Atualizar' : 'Cadastrar'} Sistema
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-6 py-2 bg-gray-500 text-white rounded-button flex items-center"
              >
                <i className="ri-close-line mr-2"></i>
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Systems List */}
      <div className="bg-white rounded shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Sistemas Cadastrados</h3>
        </div>
        
        {loading ? (
          <div className="p-6 text-center">Carregando sistemas...</div>
        ) : systems.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            Nenhum sistema cadastrado ainda.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sistema
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    URL
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Criado em
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {systems.map((system) => (
                  <tr key={system.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{system.name}</div>
                        <div className="text-sm text-gray-500">{system.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {system.url ? (
                        <a href={system.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                          {system.url}
                        </a>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {system.created_at ? new Date(system.created_at).toLocaleDateString('pt-BR') : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleEdit(system)}
                        className="text-primary hover:text-primary-dark"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(system.id!)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemManagement;
