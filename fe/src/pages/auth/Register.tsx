import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/register', { name, email, password });
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Register gagal');
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
          <button
            onClick={() => navigate('/login')}
            style={{
              width: '50%', padding: '18px',
              backgroundColor: '#e5e7eb', color: '#9ca3af',
              fontWeight: 'bold', letterSpacing: '3px',
              fontSize: '14px', border: 'none', cursor: 'pointer'
            }}>LOGIN</button>
          <button style={{
            width: '50%', padding: '18px',
            backgroundColor: '#8b1e2b', color: 'white',
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

          {/* Name */}
          <div style={{ borderBottom: '1px solid #d1d5db', marginBottom: '24px' }}>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
              style={{
                width: '100%', border: 'none', outline: 'none',
                padding: '8px 0', fontSize: '14px', color: '#374151',
                backgroundColor: 'transparent'
              }}
            />
          </div>

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
            borderBottom: '1px solid #d1d5db', marginBottom: '32px',
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

          {/* Button Register */}
          <button
            onClick={handleRegister}
            disabled={loading}
            style={{
              width: '100%', padding: '16px',
              backgroundColor: name && email && password ? '#8b1e2b' : '#d1d5db',
              color: name && email && password ? 'white' : '#9ca3af',
              fontWeight: 'bold', letterSpacing: '3px',
              fontSize: '14px', border: 'none', cursor: 'pointer'
            }}>
            {loading ? 'LOADING...' : 'REGISTER'}
          </button>

          <p style={{
            textAlign: 'center', fontSize: '13px',
            color: '#6b7280', marginTop: '20px'
          }}>
            Sudah punya akun?{' '}
            <span
              onClick={() => navigate('/login')}
              style={{ color: '#8b1e2b', cursor: 'pointer', fontWeight: 'bold' }}>
              Login di sini
            </span>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Register;