import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  CalendarDays, ScrollText, User, LogOut,
  LayoutDashboard
} from 'lucide-react';

const userMenus = [
  { icon: <LayoutDashboard size={16} />, label: 'Dashboard', path: '/home' },
  { icon: <CalendarDays size={16} />, label: 'Event', path: '/events' },
  { icon: <ScrollText size={16} />, label: 'Pendaftaran Saya', path: '/my-registration' },
  { icon: <User size={16} />, label: 'Profil', path: '/profile' },
];

const UserLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', fontFamily: 'sans-serif' }}>

      {/* NAVBAR */}
      <nav style={{
        backgroundColor: 'white',
        boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
        position: 'sticky', top: 0, zIndex: 50
      }}>
        <div style={{
          maxWidth: '1200px', margin: '0 auto',
          padding: '0 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          height: '64px'
        }}>

          {/* Logo */}
          <div
            onClick={() => navigate('/home')}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              cursor: 'pointer', fontWeight: 'bold', fontSize: '18px', color: '#8b1e2b'
            }}>
            <CalendarDays size={22} color="#8b1e2b" />
            SeminarKu
          </div>

          {/* Menu Desktop */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {userMenus.map((menu, i) => {
              const isActive = location.pathname === menu.path;
              return (
                <button key={i}
                  onClick={() => navigate(menu.path)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '8px 16px', borderRadius: '8px',
                    border: 'none', cursor: 'pointer', fontSize: '13px',
                    fontWeight: isActive ? 'bold' : '500',
                    backgroundColor: isActive ? '#fdf2f3' : 'transparent',
                    color: isActive ? '#8b1e2b' : '#6b7280',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.backgroundColor = '#f9fafb' }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.backgroundColor = 'transparent' }}
                >
                  {menu.icon}
                  {menu.label}
                </button>
              );
            })}
          </div>

          {/* User Info & Logout */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%',
                backgroundColor: '#fdf2f3',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 'bold', fontSize: '13px', color: '#8b1e2b'
              }}>
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: '#1f2937' }}>{user?.name}</div>
                <div style={{ fontSize: '11px', color: '#9ca3af' }}>{user?.email}</div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '8px 16px', borderRadius: '8px',
                border: '1px solid #fecaca', cursor: 'pointer',
                fontSize: '13px', fontWeight: '600',
                backgroundColor: '#fef2f2', color: '#ef4444'
              }}>
              <LogOut size={14} /> Logout
            </button>
          </div>

        </div>

        {/* Active Indicator */}
        <div style={{ display: 'flex', maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          {userMenus.map((menu, i) => (
            <div key={i} style={{
              height: '3px', flex: 1,
              backgroundColor: location.pathname === menu.path ? '#8b1e2b' : 'transparent',
              borderRadius: '2px', transition: 'background 0.2s'
            }} />
          ))}
        </div>
      </nav>

      {/* CONTENT */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
        {children}
      </div>

    </div>
  );
};

export default UserLayout;