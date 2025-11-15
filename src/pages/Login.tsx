import { useForm } from 'react-hook-form';
import { useLogin } from '../hooks/useAuth';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { tokenService } from '../utils/tokenService';
import './Login.css';

interface LoginFormData {
  email: string;
  password: string;
}

export const Login = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();
  const { mutate: login, isPending, error } = useLogin();

  // Redirect if already authenticated
  useEffect(() => {
    if (tokenService.getAccessToken()) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const onSubmit = (data: LoginFormData) => {
    login(data);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Welcome Back</h1>
        <p className="subtitle">Sign in to your account</p>

        <form onSubmit={handleSubmit(onSubmit)} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
              placeholder="user@example.com"
              className={errors.email ? 'error' : ''}
            />
            {errors.email && (
              <span className="error-message">{errors.email.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
              placeholder="••••••••"
              className={errors.password ? 'error' : ''}
            />
            {errors.password && (
              <span className="error-message">{errors.password.message}</span>
            )}
          </div>

          {error && (
            <div className="error-banner">
              {error.message || 'Invalid email or password'}
            </div>
          )}

          <button type="submit" disabled={isPending} className="login-button">
            {isPending ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="demo-credentials">
          <p><strong>Demo Credentials:</strong></p>
          <p>Email: <code>user@example.com</code></p>
          <p>Password: <code>password123</code></p>
          <p style={{ marginTop: '10px' }}>Or try admin account:</p>
          <p>Email: <code>admin@example.com</code></p>
          <p>Password: <code>admin123</code></p>
        </div>
      </div>
    </div>
  );
};
