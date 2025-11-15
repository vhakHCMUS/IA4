import { useAuth, useLogout } from '../hooks/useAuth';
import './Dashboard.css';

export const Dashboard = () => {
  const { user } = useAuth();
  const { mutate: logout, isPending } = useLogout();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <div className="nav-content">
          <h2>React Auth Demo</h2>
          <button 
            onClick={handleLogout} 
            disabled={isPending}
            className="logout-button"
          >
            {isPending ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      </nav>

      <main className="dashboard-main">
        <div className="welcome-card">
          <div className="avatar">
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <h1>Welcome, {user?.name}!</h1>
          <p className="email">{user?.email}</p>
        </div>

        <div className="info-grid">
          <div className="info-card">
            <div className="info-icon">👤</div>
            <h3>User ID</h3>
            <p>{user?.id}</p>
          </div>

          <div className="info-card">
            <div className="info-icon">📧</div>
            <h3>Email</h3>
            <p>{user?.email}</p>
          </div>

          <div className="info-card">
            <div className="info-icon">🎭</div>
            <h3>Role</h3>
            <p className="role-badge">{user?.role}</p>
          </div>

          <div className="info-card">
            <div className="info-icon">✅</div>
            <h3>Status</h3>
            <p className="status-badge">Authenticated</p>
          </div>
        </div>

        <div className="features-card">
          <h2>✨ Authentication Features</h2>
          <ul>
            <li>
              <strong>JWT Access Tokens:</strong> Short-lived (20s) access tokens stored in memory
            </li>
            <li>
              <strong>Refresh Tokens:</strong> Long-lived tokens stored in localStorage for session persistence
            </li>
            <li>
              <strong>Automatic Token Refresh:</strong> Seamless token refresh on 401 responses via Axios interceptors
            </li>
            <li>
              <strong>Protected Routes:</strong> Route guards that redirect unauthenticated users
            </li>
            <li>
              <strong>React Query Integration:</strong> Efficient state management and caching
            </li>
            <li>
              <strong>React Hook Form:</strong> Validated login form with email/password validation
            </li>
            <li>
              <strong>Mock Service Worker:</strong> Complete backend simulation without a real server
            </li>
          </ul>
        </div>

        <div className="test-section">
          <h3>🧪 Test Token Expiration</h3>
          <p>Access tokens expire after 20 seconds. Wait and try refreshing the page to see automatic token refresh in action!</p>
          <p className="note">Watch the Network tab to see the refresh token flow when the access token expires.</p>
        </div>
      </main>
    </div>
  );
};
