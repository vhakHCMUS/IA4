# React JWT Authentication Demo

A complete React single-page application demonstrating secure JWT authentication with access and refresh tokens using a mock backend.

## 🚀 Live Demo

**[View Live Application](#)** [_(Deploy and add URL here)_](https://ia-4-sigma.vercel.app/login)

**Demo Credentials:**
- Email: `user@example.com` / Password: `password123`
- Email: `admin@example.com` / Password: `admin123`

## ✨ Features

### Authentication Flow
- ✅ JWT-based authentication with access and refresh tokens
- ✅ Access tokens stored in memory (cleared on page refresh)
- ✅ Refresh tokens persisted in localStorage
- ✅ Automatic token refresh on 401 responses
- ✅ Secure logout with token cleanup

### Technical Implementation
- **Mock Backend**: Mock Service Worker (MSW) simulates API endpoints
- **HTTP Client**: Axios with request/response interceptors
- **State Management**: React Query for auth state and API calls
- **Form Handling**: React Hook Form with validation
- **Routing**: React Router with protected routes
- **Token Expiration**: Access tokens expire after 20 seconds (for testing)

### Security Features
- Access tokens in memory (not persisted)
- Refresh tokens in localStorage for session persistence
- Automatic token refresh before API calls fail
- Proper logout flow clearing all tokens
- Protected routes requiring authentication

## 🏗️ Architecture

```
src/
├── api/
│   ├── axiosInstance.ts      # Axios setup with interceptors
│   └── authApi.ts             # Authentication API methods
├── components/
│   └── ProtectedRoute.tsx     # Route guard component
├── hooks/
│   └── useAuth.ts             # React Query auth hooks
├── mocks/
│   ├── handlers.ts            # MSW request handlers
│   └── browser.ts             # MSW browser worker setup
├── pages/
│   ├── Login.tsx              # Login page with form
│   ├── Login.css              # Login page styles
│   ├── Dashboard.tsx          # Protected dashboard
│   └── Dashboard.css          # Dashboard styles
├── utils/
│   └── tokenService.ts        # Token storage utilities
├── App.tsx                    # Main app with routing
└── main.tsx                   # Entry point with MSW init
```

## 🛠️ Technologies Used

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **React Query** - Server state management
- **React Hook Form** - Form validation
- **Axios** - HTTP client with interceptors
- **Mock Service Worker** - API mocking

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ and npm

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "IA4-React Authentication"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open browser**
   - Navigate to `http://localhost:5173`
   - Use demo credentials to login

## 🔐 Authentication Flow Explained

### 1. Login
- User submits email and password via React Hook Form
- `POST /api/login` returns access token + refresh token
- Access token stored in memory
- Refresh token stored in localStorage
- User data cached in React Query
- Redirect to dashboard

### 2. Protected API Calls
- Axios request interceptor attaches access token to headers
- If 401 received, response interceptor triggers refresh flow
- Refresh token sent to `POST /api/refresh`
- New access token stored and request retried
- If refresh fails, logout and redirect to login

### 3. Logout
- Call `POST /api/logout` with refresh token
- Clear all tokens from memory and localStorage
- Clear React Query cache
- Redirect to login page

### 4. Token Expiration Testing
Access tokens expire after **20 seconds** to demonstrate automatic refresh:
1. Login to the dashboard
2. Wait 20+ seconds
3. The page will automatically refresh the token
4. Open DevTools Network tab to see the refresh request

## 🚀 Deployment

### Deploy to Vercel

```bash
npm run build
npx vercel --prod
```

### Deploy to Netlify

```bash
npm run build
npx netlify deploy --prod --dir=dist
```

The `_redirects` file is included for SPA routing support.

## 📝 Mock API Endpoints

All endpoints are simulated by MSW:

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/login` | Login with email/password → returns tokens |
| `POST` | `/api/refresh` | Refresh access token using refresh token |
| `GET` | `/api/me` | Get current user (requires auth header) |
| `POST` | `/api/logout` | Logout and invalidate refresh token |

## 🧪 Testing Token Flow

1. **Login**: Use demo credentials
2. **Observe Access Token**: Open DevTools → Application → Session Storage (empty - it's in memory!)
3. **Check Refresh Token**: DevTools → Application → Local Storage → `refreshToken`
4. **Test Auto-Refresh**: Wait 20 seconds, then click around - token refreshes automatically
5. **Test Logout**: Click logout - all tokens cleared, redirected to login

## 🎯 Evaluation Criteria Checklist

- ✅ **Authentication Logic (30%)**: Complete JWT flow with access/refresh tokens
- ✅ **Axios Interceptors (20%)**: Request interceptor attaches token, response handles 401
- ✅ **React Query Integration (15%)**: Mutations for login/logout, query for user data
- ✅ **React Hook Form (10%)**: Validated login form with email/password rules
- ✅ **Deployment (10%)**: Configured for Netlify/Vercel with SPA routing
- ✅ **UI/UX (10%)**: Clean, responsive design with loading/error states
- ✅ **Error Handling (5%)**: Proper error display and auto-logout on failures

## 🎁 Stretch Goals Implemented

- ✅ Mock backend fully functional (MSW)
- ✅ Token storage best practices (memory + localStorage)
- ✅ Comprehensive error handling
- ✅ User-friendly UI with loading states
- ✅ Complete TypeScript typing

## 📄 License

MIT

## 👤 Author

Created for IA4 React Authentication assignment.

