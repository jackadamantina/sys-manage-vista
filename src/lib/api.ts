
// Usar Supabase como backend temporário até o deploy on-premises
import { supabase } from '@/integrations/supabase/client';

class ApiClient {
  private getAuthHeaders() {
    const token = localStorage.getItem('idm_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  // Auth methods usando Supabase
  async login(email: string, password: string) {
    try {
      console.log('Attempting login with Supabase:', email);
      
      // Usar a função de autenticação do Supabase
      const { data, error } = await supabase.rpc('authenticate_idm_user', {
        p_email: email,
        p_password: password
      });

      if (error) throw error;

      if (data && data.length > 0 && data[0].success) {
        const user = data[0];
        
        // Simular token JWT para compatibilidade
        const token = btoa(JSON.stringify({ 
          userId: user.user_id, 
          email: user.email, 
          exp: Date.now() + 24*60*60*1000 
        }));

        return {
          token,
          user: {
            id: user.user_id,
            email: user.email,
            username: user.username,
            full_name: user.full_name,
            role: user.role
          }
        };
      } else {
        throw new Error('Credenciais inválidas');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.message || 'Erro ao fazer login');
    }
  }

  async register(email: string, password: string, username: string, fullName: string) {
    try {
      console.log('Attempting registration:', email, username);
      
      // Verificar se usuário já existe
      const { data: existingUser } = await supabase
        .from('user_idm')
        .select('id')
        .or(`email.eq.${email},username.eq.${username}`)
        .single();

      if (existingUser) {
        throw new Error('Email ou nome de usuário já existem');
      }

      // Criar novo usuário
      const { error } = await supabase
        .from('user_idm')
        .insert([{
          email,
          password, // Em produção, use hash bcrypt
          username,
          full_name: fullName,
          role: 'user'
        }]);

      if (error) throw error;

      return { message: 'Usuário criado com sucesso' };
    } catch (error: any) {
      console.error('Registration error:', error);
      throw new Error(error.message || 'Erro ao criar conta');
    }
  }

  // Systems methods
  async getSystems() {
    try {
      const { data, error } = await supabase
        .from('systems_idm')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error('Get systems error:', error);
      throw new Error(error.message || 'Erro ao buscar sistemas');
    }
  }

  async createSystem(systemData: any) {
    try {
      const { data, error } = await supabase
        .from('systems_idm')
        .insert([systemData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Create system error:', error);
      throw new Error(error.message || 'Erro ao criar sistema');
    }
  }

  async updateSystem(id: string, systemData: any) {
    try {
      const { data, error } = await supabase
        .from('systems_idm')
        .update(systemData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Update system error:', error);
      throw new Error(error.message || 'Erro ao atualizar sistema');
    }
  }

  async deleteSystem(id: string) {
    try {
      const { error } = await supabase
        .from('systems_idm')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { message: 'Sistema deletado com sucesso' };
    } catch (error: any) {
      console.error('Delete system error:', error);
      throw new Error(error.message || 'Erro ao deletar sistema');
    }
  }

  // Users methods
  async getImportedUsersCount() {
    try {
      const { count, error } = await supabase
        .from('imported_users_idm')
        .select('*', { count: 'exact', head: true });

      if (error) throw error;
      return { count: count || 0 };
    } catch (error: any) {
      console.error('Get imported users count error:', error);
      throw new Error(error.message || 'Erro ao buscar contagem de usuários');
    }
  }

  async getSystemUsersCount() {
    try {
      const { count, error } = await supabase
        .from('system_users_idm')
        .select('*', { count: 'exact', head: true });

      if (error) throw error;
      return { count: count || 0 };
    } catch (error: any) {
      console.error('Get system users count error:', error);
      throw new Error(error.message || 'Erro ao buscar contagem de usuários de sistemas');
    }
  }

  async getImportedUsers() {
    try {
      const { data, error } = await supabase
        .from('imported_users_idm')
        .select('*')
        .order('imported_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error('Get imported users error:', error);
      throw new Error(error.message || 'Erro ao buscar usuários importados');
    }
  }

  // Settings methods
  async getOrganizationSettings() {
    try {
      const { data, error } = await supabase
        .from('organization_settings')
        .select('*')
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (!data) {
        // Criar configurações padrão
        const { data: newSettings, error: insertError } = await supabase
          .from('organization_settings')
          .insert([{
            organization_name: 'IDM Experience',
            timezone: 'America/Sao_Paulo'
          }])
          .select()
          .single();

        if (insertError) throw insertError;
        return newSettings;
      }

      return data;
    } catch (error: any) {
      console.error('Get settings error:', error);
      throw new Error(error.message || 'Erro ao buscar configurações');
    }
  }

  async updateOrganizationSettings(settings: any) {
    try {
      const { data, error } = await supabase
        .from('organization_settings')
        .update(settings)
        .eq('id', settings.id || (await this.getOrganizationSettings()).id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Update settings error:', error);
      throw new Error(error.message || 'Erro ao atualizar configurações');
    }
  }
}

export const apiClient = new ApiClient();
