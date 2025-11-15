import { http, HttpResponse, delay } from 'msw';

// Mock user database
const USERS = {
  'user@example.com': {
    id: '1',
    email: 'user@example.com',
    password: 'password123',
    name: 'John Doe',
    role: 'user',
  },
  'admin@example.com': {
    id: '2',
    email: 'admin@example.com',
    password: 'admin123',
    name: 'Jane Admin',
    role: 'admin',
  },
};

// Store active refresh tokens (in real app, this would be in database)
const activeRefreshTokens = new Set<string>();

// Generate mock JWT tokens
const generateAccessToken = (userId: string, email: string): string => {
  const payload = {
    userId,
    email,
    type: 'access',
    exp: Date.now() + 20000, // 20 seconds (short for testing)
  };
  return btoa(JSON.stringify(payload));
};

const generateRefreshToken = (userId: string): string => {
  const payload = {
    userId,
    type: 'refresh',
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  };
  return btoa(JSON.stringify(payload));
};

// Verify token
const verifyToken = (token: string, type: 'access' | 'refresh'): { userId: string; email?: string } | null => {
  try {
    const payload = JSON.parse(atob(token));
    if (payload.type !== type) return null;
    if (payload.exp < Date.now()) return null;
    return { userId: payload.userId, email: payload.email };
  } catch {
    return null;
  }
};

export const handlers = [
  // Login endpoint
  http.post('/api/login', async ({ request }) => {
    await delay(500); // Simulate network delay

    const body = await request.json() as { email: string; password: string };
    const { email, password } = body;

    const user = USERS[email as keyof typeof USERS];

    if (!user || user.password !== password) {
      return HttpResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const accessToken = generateAccessToken(user.id, user.email);
    const refreshToken = generateRefreshToken(user.id);

    // Store refresh token
    activeRefreshTokens.add(refreshToken);

    return HttpResponse.json({
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  }),

  // Refresh token endpoint
  http.post('/api/refresh', async ({ request }) => {
    await delay(300);

    const body = await request.json() as { refreshToken: string };
    const { refreshToken } = body;

    if (!refreshToken || !activeRefreshTokens.has(refreshToken)) {
      return HttpResponse.json(
        { message: 'Invalid refresh token' },
        { status: 401 }
      );
    }

    const payload = verifyToken(refreshToken, 'refresh');
    if (!payload) {
      activeRefreshTokens.delete(refreshToken);
      return HttpResponse.json(
        { message: 'Refresh token expired' },
        { status: 401 }
      );
    }

    // Find user by ID
    const user = Object.values(USERS).find((u) => u.id === payload.userId);
    if (!user) {
      return HttpResponse.json(
        { message: 'User not found' },
        { status: 401 }
      );
    }

    const newAccessToken = generateAccessToken(user.id, user.email);

    return HttpResponse.json({
      accessToken: newAccessToken,
    });
  }),

  // Get current user endpoint
  http.get('/api/me', async ({ request }) => {
    await delay(200);

    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json(
        { message: 'No token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const payload = verifyToken(token, 'access');

    if (!payload) {
      return HttpResponse.json(
        { message: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    const user = Object.values(USERS).find((u) => u.id === payload.userId);
    if (!user) {
      return HttpResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    return HttpResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });
  }),

  // Logout endpoint (optional - clears refresh token)
  http.post('/api/logout', async ({ request }) => {
    await delay(200);

    const body = await request.json() as { refreshToken?: string };
    const { refreshToken } = body;

    if (refreshToken) {
      activeRefreshTokens.delete(refreshToken);
    }

    return HttpResponse.json({ message: 'Logged out successfully' });
  }),
];
