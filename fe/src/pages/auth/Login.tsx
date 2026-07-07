import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/login', { email, password });
       const role = res.data.user.role;
      login(res.data.token, res.data.user);
      if (role === "SUPER_ADMIN") {
        navigate("/super-admin/dashboard");
      }
      else if (role === "ADMIN") {
        navigate("/admin/dashboard");
      }
      else {
        navigate("/home");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login gagal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f3f4f6',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'sans-serif'
    }}>
      <div style={{
        backgroundColor: 'white',
        width: '100%',
        maxWidth: '460px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        borderRadius: '4px',
        overflow: 'hidden'
      }}>

        {/* Tab */}
        <div style={{ display: 'flex' }}>
          <button style={{
            width: '50%', padding: '18px',
            backgroundColor: '#8b1e2b', color: 'white',
            fontWeight: 'bold', letterSpacing: '3px',
            fontSize: '14px', border: 'none', cursor: 'pointer'
          }}>LOGIN</button>
          <button
            onClick={() => navigate('/register')}
            style={{
              width: '50%', padding: '18px',
              backgroundColor: '#e5e7eb', color: '#9ca3af',
              fontWeight: 'bold', letterSpacing: '3px',
              fontSize: '14px', border: 'none', cursor: 'pointer'
            }}>REGISTER</button>
        </div>

        <div style={{ padding: '40px' }}>

          {/* Error */}
          {error && (
            <div style={{
              backgroundColor: '#fee2e2', color: '#ef4444',
              padding: '10px 16px', borderRadius: '6px',
              marginBottom: '16px', fontSize: '13px'
            }}>{error}</div>
          )}

          {/* Google */}
          <p style={{ textAlign: 'center', color: '#6b7280', fontSize: '14px', marginBottom: '16px' }}>
            Login using one of your social media account
          </p>

          <button style={{
            width: '100%', display: 'flex', alignItems: 'center',
            border: '1px solid #d1d5db', padding: '12px',
            backgroundColor: 'white', cursor: 'pointer',
            marginBottom: '24px'
          }}>
            <div style={{ paddingRight: '16px', borderRight: '1px solid #d1d5db' }}>
              <svg style={{ width: '20px', height: '20px' }} viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.1 0 5.8 1.1 8 2.9l6-6C34.5 3.1 29.6 1 24 1 14.8 1 7 6.7 3.7 14.6l7 5.4C12.5 13.6 17.8 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.6 3-2.3 5.5-4.8 7.2l7.4 5.7c4.3-4 6.8-9.9 6.8-16.9z" />
                <path fill="#FBBC05" d="M10.7 28.6A14.5 14.5 0 0 1 9.5 24c0-1.6.3-3.2.7-4.6l-7-5.4A23.9 23.9 0 0 0 .5 24c0 3.9.9 7.6 2.7 10.8l7.5-6.2z" />
                <path fill="#34A853" d="M24 47c5.6 0 10.3-1.8 13.7-5l-7.4-5.7c-1.8 1.2-4.1 2-6.3 2-6.2 0-11.5-4.1-13.3-9.7l-7.5 6.2C7 41.3 14.8 47 24 47z" />
              </svg>
            </div>
            <span style={{
              flex: 1, textAlign: 'center', fontWeight: 'bold',
              letterSpacing: '3px', fontSize: '14px', color: '#374151'
            }}>GOOGLE</span>
          </button>

          {/* Divider */}
          <p style={{ textAlign: 'center', color: '#9ca3af', fontSize: '14px', marginBottom: '24px' }}>
            or login with email & password
          </p>

          {/* Email */}
          <div style={{ borderBottom: '1px solid #d1d5db', marginBottom: '24px' }}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              style={{
                width: '100%', border: 'none', outline: 'none',
                padding: '8px 0', fontSize: '14px', color: '#374151',
                backgroundColor: 'transparent'
              }}
            />
          </div>

          {/* Password */}
          <div style={{
            borderBottom: '1px solid #d1d5db', marginBottom: '8px',
            display: 'flex', alignItems: 'center'
          }}>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              style={{
                flex: 1, border: 'none', outline: 'none',
                padding: '8px 0', fontSize: '14px', color: '#374151',
                backgroundColor: 'transparent'
              }}
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              style={{
                border: 'none', background: 'none', cursor: 'pointer',
                fontWeight: 'bold', fontSize: '12px',
                letterSpacing: '2px', color: '#374151'
              }}>
              {showPassword ? 'HIDE' : 'SHOW'}
            </button>
          </div>

          {/* Forgot Password */}
          <div style={{ textAlign: 'right', marginBottom: '32px' }}>
            <a href="#" style={{ fontSize: '13px', color: '#6b7280', textDecoration: 'none' }}>
              Forgot Password
            </a>
          </div>

          {/* Button Login */}
          <button
            onClick={handleLogin}
            disabled={loading}
            style={{
              width: '100%', padding: '16px',
              backgroundColor: email && password ? '#8b1e2b' : '#d1d5db',
              color: email && password ? 'white' : '#9ca3af',
              fontWeight: 'bold', letterSpacing: '3px',
              fontSize: '14px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer'
            }}>
            {loading ? 'LOADING...' : 'LOGIN'}
          </button>

        </div>
      </div>
    </div>
  );
};

export default Login;