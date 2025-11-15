// Token storage service
// Access token: in-memory (cleared on refresh)
// Refresh token: localStorage (persists across sessions)

let accessToken: string | null = null;

const REFRESH_TOKEN_KEY = 'refreshToken';

export const tokenService = {
  // Access token (in-memory)
  getAccessToken: (): string | null => {
    return accessToken;
  },

  setAccessToken: (token: string): void => {
    accessToken = token;
  },

  clearAccessToken: (): void => {
    accessToken = null;
  },

  // Refresh token (localStorage)
  getRefreshToken: (): string | null => {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  setRefreshToken: (token: string): void => {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  },

  clearRefreshToken: (): void => {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  // Clear all tokens
  clearAll: (): void => {
    accessToken = null;
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
};
