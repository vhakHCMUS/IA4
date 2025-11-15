import { apiClient } from './axiosInstance';
import { tokenService } from '../utils/tokenService';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/login', credentials);
    
    // Store tokens
    tokenService.setAccessToken(response.data.accessToken);
    tokenService.setRefreshToken(response.data.refreshToken);
    
    return response.data;
  },

  logout: async (): Promise<void> => {
    const refreshToken = tokenService.getRefreshToken();
    
    try {
      await apiClient.post('/logout', { refreshToken });
    } catch (error) {
      // Ignore logout errors
      console.error('Logout error:', error);
    } finally {
      // Always clear tokens
      tokenService.clearAll();
    }
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<User>('/me');
    return response.data;
  },
};
