import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LockKeyhole, LogIn, Mail, User, UserPlus } from 'lucide-react';
import BrandLogo from '../../components/BrandLogo';
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
    } catch (err: unknown) {
      const response = (err as { response?: { data?: { message?: string } } }).response;
      setError(response?.data?.message || 'Register gagal');
    } finally {
      setLoading(false);
    }
  };

  const canSubmit = Boolean(name && email && password);

  return (
    <div style={{
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden',
      background:
        'linear-gradient(150deg, #b93652 0%, #ed9aac 43%, #f8d8df 55%, #c63855 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px 18px',
      fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      color: '#1f2937'
    }}>
      <div style={{
        position: 'absolute',
        inset: 0,
        background:
          'radial-gradient(circle at 78% 9%, rgba(255,255,255,0.78) 0 1px, transparent 3px), radial-gradient(circle at 6% 22%, rgba(255,255,255,0.76) 0 1px, transparent 3px), radial-gradient(circle at 29% 96%, rgba(255,255,255,0.74) 0 1px, transparent 3px)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        width: '112%',
        height: '42%',
        left: '-18%',
        bottom: '-19%',
        borderTop: '2px solid rgba(255,255,255,0.58)',
        borderRadius: '50% 50% 0 0',
        transform: 'rotate(8deg)',
        background: 'linear-gradient(180deg, rgba(255,255,255,0.18), rgba(164,18,49,0.2))',
        boxShadow: '0 -22px 80px rgba(255,255,255,0.22)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        width: '66%',
        height: '54%',
        right: '-36%',
        top: '7%',
        borderLeft: '2px solid rgba(255,255,255,0.62)',
        borderRadius: '50%',
        transform: 'rotate(17deg)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        width: '62%',
        height: '34%',
        right: '-10%',
        bottom: '-11%',
        borderRadius: '50% 50% 0 0',
        background: 'linear-gradient(140deg, rgba(255,255,255,0.42), rgba(190,28,58,0.08) 52%, rgba(154,16,43,0.42))',
        border: '1px solid rgba(255,255,255,0.28)',
        filter: 'blur(0.2px)',
        pointerEvents: 'none'
      }} />

      <main style={{
        position: 'relative',
        zIndex: 1,
        width: '100%',
        maxWidth: '560px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <header style={{
          textAlign: 'center',
          marginBottom: '30px',
          color: '#9f1239'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '12px'
          }}>
            <BrandLogo width={240} style={{ borderRadius: '10px' }} />
          </div>
          <p style={{
            margin: 0,
            color: '#5f6067',
            fontSize: '15px',
            fontWeight: 500
          }}>
            Mulai perjalanan seminarmu!
          </p>
        </header>

        <section style={{
          width: '100%',
          maxWidth: '472px',
          borderRadius: '26px',
          border: '1px solid rgba(255,255,255,0.82)',
          background: 'rgba(255,255,255,0.82)',
          boxShadow: '0 24px 65px rgba(127, 16, 43, 0.22), inset 0 1px 0 rgba(255,255,255,0.95)',
          backdropFilter: 'blur(18px)',
          padding: '42px 46px 36px'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <h2 style={{
              margin: '0 0 8px',
              color: '#111827',
              fontSize: '22px',
              fontWeight: 800
            }}>
              Buat Akun Baru
            </h2>
            <p style={{
              margin: 0,
              color: '#70737d',
              fontSize: '13px',
              fontWeight: 500
            }}>
              Daftar untuk mengakses SeminarHub
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '8px',
            padding: '4px',
            marginBottom: '26px',
            borderRadius: '8px',
            background: 'rgba(239,220,224,0.62)'
          }}>
            <button
              type="button"
              onClick={() => navigate('/login')}
              style={{
                height: '44px',
                border: 'none',
                borderRadius: '7px',
                background: 'transparent',
                color: '#6b7280',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <LogIn size={15} />
              Masuk
            </button>
            <button
              type="button"
              style={{
                height: '44px',
                border: 'none',
                borderRadius: '7px',
                background: '#fff7f8',
                color: '#a51231',
                boxShadow: '0 8px 18px rgba(177, 23, 54, 0.14)',
                fontSize: '12px',
                fontWeight: 800,
                cursor: 'default',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <UserPlus size={15} />
              Daftar
            </button>
          </div>

          {error && (
            <div style={{
              backgroundColor: '#fff1f2',
              color: '#be123c',
              padding: '11px 14px',
              borderRadius: '8px',
              marginBottom: '18px',
              fontSize: '13px',
              fontWeight: 600,
              border: '1px solid rgba(190,18,60,0.15)'
            }}>
              {error}
            </div>
          )}

          <button
            type="button"
            style={{
              width: '100%',
              height: '46px',
              display: 'flex',
              alignItems: 'center',
              border: '1px solid #e7d8dc',
              borderRadius: '7px',
              padding: '0 18px',
              backgroundColor: 'rgba(255,255,255,0.96)',
              cursor: 'pointer',
              marginBottom: '24px',
              color: '#171923',
              boxShadow: '0 3px 10px rgba(127, 16, 43, 0.04)'
            }}
          >
            <svg style={{ width: '20px', height: '20px', flex: '0 0 auto' }} viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.1 0 5.8 1.1 8 2.9l6-6C34.5 3.1 29.6 1 24 1 14.8 1 7 6.7 3.7 14.6l7 5.4C12.5 13.6 17.8 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.6 3-2.3 5.5-4.8 7.2l7.4 5.7c4.3-4 6.8-9.9 6.8-16.9z" />
              <path fill="#FBBC05" d="M10.7 28.6A14.5 14.5 0 0 1 9.5 24c0-1.6.3-3.2.7-4.6l-7-5.4A23.9 23.9 0 0 0 .5 24c0 3.9.9 7.6 2.7 10.8l7.5-6.2z" />
              <path fill="#34A853" d="M24 47c5.6 0 10.3-1.8 13.7-5l-7.4-5.7c-1.8 1.2-4.1 2-6.3 2-6.2 0-11.5-4.1-13.3-9.7l-7.5 6.2C7 41.3 14.8 47 24 47z" />
            </svg>
            <span style={{
              flex: 1,
              textAlign: 'center',
              fontWeight: 800,
              fontSize: '12px'
            }}>
              Daftar dengan Google
            </span>
          </button>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '23px',
            color: '#8b8f99',
            fontSize: '11px',
            fontWeight: 500
          }}>
            <span style={{ height: '1px', flex: 1, background: '#e6d9dd' }} />
            atau daftar dengan email
            <span style={{ height: '1px', flex: 1, background: '#e6d9dd' }} />
          </div>

          <label style={{
            display: 'block',
            color: '#111827',
            fontSize: '12px',
            fontWeight: 800,
            marginBottom: '8px'
          }}>
            Nama Lengkap
          </label>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            height: '49px',
            border: '1px solid #decfd4',
            borderRadius: '7px',
            background: 'rgba(255,255,255,0.78)',
            padding: '0 15px',
            marginBottom: '18px'
          }}>
            <User size={18} color="#9ca3af" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan nama lengkap"
              style={{
                width: '100%',
                minWidth: 0,
                border: 'none',
                outline: 'none',
                fontSize: '13px',
                color: '#374151',
                backgroundColor: 'transparent',
                fontWeight: 500
              }}
            />
          </div>

          <label style={{
            display: 'block',
            color: '#111827',
            fontSize: '12px',
            fontWeight: 800,
            marginBottom: '8px'
          }}>
            Email
          </label>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            height: '49px',
            border: '1px solid #decfd4',
            borderRadius: '7px',
            background: 'rgba(255,255,255,0.78)',
            padding: '0 15px',
            marginBottom: '18px'
          }}>
            <Mail size={18} color="#9ca3af" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Masukkan email kamu"
              style={{
                width: '100%',
                minWidth: 0,
                border: 'none',
                outline: 'none',
                fontSize: '13px',
                color: '#374151',
                backgroundColor: 'transparent',
                fontWeight: 500
              }}
            />
          </div>

          <label style={{
            display: 'block',
            color: '#111827',
            fontSize: '12px',
            fontWeight: 800,
            marginBottom: '8px'
          }}>
            Password
          </label>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            height: '49px',
            border: '1px solid #decfd4',
            borderRadius: '7px',
            background: 'rgba(255,255,255,0.78)',
            padding: '0 15px',
            marginBottom: '24px'
          }}>
            <LockKeyhole size={18} color="#9ca3af" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password kamu"
              style={{
                flex: 1,
                minWidth: 0,
                border: 'none',
                outline: 'none',
                fontSize: '13px',
                color: '#374151',
                backgroundColor: 'transparent',
                fontWeight: 500
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
              style={{
                width: '24px',
                height: '24px',
                border: 'none',
                background: 'transparent',
                color: '#7b808b',
                cursor: 'pointer',
                display: 'grid',
                placeItems: 'center',
                padding: 0
              }}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button
            type="button"
            onClick={handleRegister}
            disabled={loading || !canSubmit}
            style={{
              width: '100%',
              height: '52px',
              backgroundColor: canSubmit ? '#a51231' : '#d8a3af',
              color: 'white',
              fontWeight: 800,
              fontSize: '14px',
              border: 'none',
              borderRadius: '7px',
              cursor: loading || !canSubmit ? 'not-allowed' : 'pointer',
              boxShadow: canSubmit ? '0 12px 24px rgba(165,18,49,0.2)' : 'none'
            }}
          >
            {loading ? 'Memproses...' : 'Daftar'}
          </button>

          <p style={{
            textAlign: 'center',
            fontSize: '13px',
            color: '#6b7280',
            margin: '22px 0 0',
            fontWeight: 500
          }}>
            Sudah punya akun?{' '}
            <span
              onClick={() => navigate('/login')}
              style={{ color: '#a51231', cursor: 'pointer', fontWeight: 800 }}
            >
              Masuk di sini
            </span>
          </p>
        </section>

        <p style={{
          margin: '28px 0 0',
          color: 'rgba(255,255,255,0.9)',
          fontSize: '12px',
          fontWeight: 500,
          textShadow: '0 1px 10px rgba(91, 13, 35, 0.24)'
        }}>
          &copy; 2026. All rights reserved.
        </p>
      </main>
    </div>
  );
};

export default Register;