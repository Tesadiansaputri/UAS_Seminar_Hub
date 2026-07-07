import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Lock, Check, X } from 'lucide-react';
import api from '../../services/api';

const Profile = () => {
  const { user, login } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ nama: '', email: '' });
  const [passwordForm, setPasswordForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [stats, setStats] = useState({ totalEvent: 0, aktif: 0, batal: 0 });

  useEffect(() => {
    if (user) {
      setForm({ nama: user.name, email: user.email });
    }
    fetchStats();
  }, [user]);

  const fetchStats = async () => {
    try {
      const res = await api.get('/registrations/my');
      setStats({
        totalEvent: res.data.length,
        aktif: res.data.filter((r: any) => r.status === 'Aktif').length,
        batal: res.data.filter((r: any) => r.status === 'Batal').length,
      });
    } catch (err) {
      console.error('Gagal fetch stats:', err);
    }
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');
    try {
      const res = await api.put(`/users/${user?.id}`, { nama: form.nama, email: form.email });
      login(localStorage.getItem('token') || '', {
        ...user!,
        name: res.data.nama,
        email: res.data.email,
      });
      setSuccessMsg('Profil berhasil diupdate!');
      setEditMode(false);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || 'Gagal update profil');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setErrorMsg('Password baru tidak cocok!');
      setLoading(false);
      return;
    }

    try {
      await api.put(`/users/${user?.id}/password`, {
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
      });
      setSuccessMsg('Password berhasil diubah!');
      setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordForm(false);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || 'Gagal ubah password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto' }}>

      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1f2937', marginBottom: '4px' }}>
          Profil Saya
        </h1>
        <p style={{ color: '#6b7280', fontSize: '14px' }}>
          Kelola informasi akun kamu
        </p>
      </div>

      {/* Alert */}
      {successMsg && (
        <div style={{
          backgroundColor: '#dcfce7', color: '#16a34a',
          padding: '12px 16px', borderRadius: '8px',
          marginBottom: '16px', fontSize: '13px',
          display: 'flex', alignItems: 'center', gap: '8px'
        }}>
          <Check size={16} /> {successMsg}
        </div>
      )}
      {errorMsg && (
        <div style={{
          backgroundColor: '#fee2e2', color: '#ef4444',
          padding: '12px 16px', borderRadius: '8px',
          marginBottom: '16px', fontSize: '13px',
          display: 'flex', alignItems: 'center', gap: '8px'
        }}>
          <X size={16} /> {errorMsg}
        </div>
      )}

      {/* Profile Card */}
      <div style={{
        backgroundColor: 'white', borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '20px',
        overflow: 'hidden'
      }}>
        {/* Avatar Section */}
        <div style={{
          background: 'linear-gradient(135deg, #8b1e2b 0%, #b5293a 100%)',
          padding: '32px', textAlign: 'center'
        }}>
          <div style={{
            width: '80px', height: '80px', borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 12px', fontWeight: 'bold', fontSize: '32px', color: 'white'
          }}>
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div style={{ color: 'white', fontWeight: 'bold', fontSize: '18px' }}>{user?.name}</div>
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '13px', marginTop: '4px' }}>{user?.email}</div>
          <div style={{
            display: 'inline-block', marginTop: '8px',
            backgroundColor: 'rgba(255,255,255,0.2)',
            padding: '2px 12px', borderRadius: '10px',
            fontSize: '11px', color: 'white', fontWeight: '600', letterSpacing: '1px'
          }}>
            {user?.role}
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', borderBottom: '1px solid #f3f4f6' }}>
          {[
            { label: 'Total Event', value: stats.totalEvent },
            { label: 'Aktif', value: stats.aktif },
            { label: 'Batal', value: stats.batal },
          ].map((s, i) => (
            <div key={i} style={{
              padding: '20px', textAlign: 'center',
              borderRight: i < 2 ? '1px solid #f3f4f6' : 'none'
            }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#8b1e2b' }}>{s.value}</div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Form Info */}
        <div style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ fontWeight: 'bold', fontSize: '15px', color: '#1f2937' }}>Informasi Akun</div>
            {!editMode && (
              <button
                onClick={() => setEditMode(true)}
                style={{
                  padding: '8px 16px', borderRadius: '8px',
                  border: '1px solid #8b1e2b', backgroundColor: 'white',
                  cursor: 'pointer', fontWeight: '600', fontSize: '13px', color: '#8b1e2b'
                }}>
                Edit Profil
              </button>
            )}
          </div>

          {/* Nama */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <User size={14} color="#8b1e2b" /> Nama Lengkap
              </div>
            </label>
            {editMode ? (
              <input
                value={form.nama}
                onChange={e => setForm({ ...form, nama: e.target.value })}
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: '8px',
                  border: '1px solid #8b1e2b', fontSize: '14px', outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            ) : (
              <div style={{
                padding: '10px 14px', borderRadius: '8px',
                backgroundColor: '#f9fafb', fontSize: '14px', color: '#374151'
              }}>
                {user?.name}
              </div>
            )}
          </div>

          {/* Email */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Mail size={14} color="#8b1e2b" /> Email
              </div>
            </label>
            {editMode ? (
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: '8px',
                  border: '1px solid #8b1e2b', fontSize: '14px', outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            ) : (
              <div style={{
                padding: '10px 14px', borderRadius: '8px',
                backgroundColor: '#f9fafb', fontSize: '14px', color: '#374151'
              }}>
                {user?.email}
              </div>
            )}
          </div>

          {editMode && (
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => { setEditMode(false); setErrorMsg(''); }}
                style={{
                  flex: 1, padding: '10px', borderRadius: '8px',
                  border: '1px solid #d1d5db', backgroundColor: 'white',
                  cursor: 'pointer', fontWeight: '600', fontSize: '13px', color: '#374151'
                }}>
                Batal
              </button>
              <button
                onClick={handleSaveProfile}
                disabled={loading}
                style={{
                  flex: 1, padding: '10px', borderRadius: '8px',
                  border: 'none', backgroundColor: '#8b1e2b',
                  cursor: 'pointer', fontWeight: '600', fontSize: '13px', color: 'white'
                }}>
                {loading ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Ganti Password */}
      <div style={{
        backgroundColor: 'white', borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflow: 'hidden'
      }}>
        <div style={{
          padding: '20px 24px', borderBottom: showPasswordForm ? '1px solid #f3f4f6' : 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', fontSize: '15px', color: '#1f2937' }}>
            <Lock size={16} color="#8b1e2b" /> Ganti Password
          </div>
          <button
            onClick={() => { setShowPasswordForm(!showPasswordForm); setErrorMsg(''); }}
            style={{
              padding: '8px 16px', borderRadius: '8px',
              border: '1px solid #8b1e2b', backgroundColor: 'white',
              cursor: 'pointer', fontWeight: '600', fontSize: '13px', color: '#8b1e2b'
            }}>
            {showPasswordForm ? 'Batal' : 'Ubah Password'}
          </button>
        </div>

        {showPasswordForm && (
          <div style={{ padding: '24px' }}>
            {[
              { label: 'Password Lama', key: 'oldPassword', placeholder: '••••••••' },
              { label: 'Password Baru', key: 'newPassword', placeholder: '••••••••' },
              { label: 'Konfirmasi Password Baru', key: 'confirmPassword', placeholder: '••••••••' },
            ].map(field => (
              <div key={field.key} style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>
                  {field.label}
                </label>
                <input
                  type="password"
                  value={passwordForm[field.key as keyof typeof passwordForm]}
                  onChange={e => setPasswordForm({ ...passwordForm, [field.key]: e.target.value })}
                  placeholder={field.placeholder}
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: '8px',
                    border: '1px solid #d1d5db', fontSize: '14px', outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            ))}

            <button
              onClick={handleChangePassword}
              disabled={loading}
              style={{
                width: '100%', padding: '10px', borderRadius: '8px',
                border: 'none', backgroundColor: '#8b1e2b',
                cursor: 'pointer', fontWeight: '600', fontSize: '14px', color: 'white'
              }}>
              {loading ? 'Menyimpan...' : 'Simpan Password'}
            </button>
          </div>
        )}
      </div>

    </div>
  );
};

export default Profile;