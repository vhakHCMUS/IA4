import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../api/authApi';
import type { LoginCredentials, User } from '../api/authApi';
import { tokenService } from '../utils/tokenService';
import { useNavigate } from 'react-router-dom';

// Query keys
export const AUTH_KEYS = {
  user: ['user'] as const,
};

// Hook for login
export const useLogin = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
    onSuccess: (data) => {
      // Set user data in cache
      queryClient.setQueryData(AUTH_KEYS.user, data.user);
      // Navigate to dashboard
      navigate('/dashboard');
    },
  });
};

// Hook for logout
export const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      // Clear all queries
      queryClient.clear();
      // Navigate to login
      navigate('/login');
    },
  });
};

// Hook to get current user
export const useUser = () => {
  return useQuery<User>({
    queryKey: AUTH_KEYS.user,
    queryFn: () => authApi.getCurrentUser(),
    enabled: !!tokenService.getAccessToken(),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to check if user is authenticated
export const useAuth = () => {
  const { data: user, isLoading, error } = useUser();
  
  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
  };
};
