
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ApiClient {
  private getAuthHeaders() {
    const token = localStorage.getItem('idm_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Auth methods
  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(email: string, password: string, username: string, fullName: string) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, username, fullName }),
    });
  }

  // Systems methods
  async getSystems() {
    return this.request('/systems');
  }

  async createSystem(systemData: any) {
    return this.request('/systems', {
      method: 'POST',
      body: JSON.stringify(systemData),
    });
  }

  async updateSystem(id: string, systemData: any) {
    return this.request(`/systems/${id}`, {
      method: 'PUT',
      body: JSON.stringify(systemData),
    });
  }

  async deleteSystem(id: string) {
    return this.request(`/systems/${id}`, {
      method: 'DELETE',
    });
  }

  // Users methods
  async getImportedUsersCount() {
    return this.request('/users/imported/count');
  }

  async getSystemUsersCount() {
    return this.request('/users/system/count');
  }

  async getImportedUsers() {
    return this.request('/users/imported');
  }

  // Settings methods
  async getOrganizationSettings() {
    return this.request('/settings');
  }

  async updateOrganizationSettings(settings: any) {
    return this.request('/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  }
}

export const apiClient = new ApiClient();
