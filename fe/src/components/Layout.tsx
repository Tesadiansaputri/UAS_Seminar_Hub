import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, CalendarDays, Users, Mic,
  LayoutGrid, ScrollText, BarChart2,
  LogOut, Menu, X, ChevronRight, User
} from 'lucide-react';

const adminMenus = [
  { icon: <LayoutDashboard size={18} />, label: 'Dashboard', path: '/admin/dashboard' },
  { icon: <LayoutGrid size={18} />, label: 'Kategori', path: '/admin/category' },
  { icon: <Mic size={18} />, label: 'Speaker', path: '/admin/speaker' },
  { icon: <CalendarDays size={18} />, label: 'Event', path: '/admin/event' },
  { icon: <Users size={18} />, label: 'Peserta', path: '/admin/registration' },
  { icon: <BarChart2 size={18} />, label: 'SPK SAW', path: '/admin/spk' },
];

const userMenus = [
  { icon: <LayoutDashboard size={18} />, label: 'Dashboard', path: '/home' },
  { icon: <CalendarDays size={18} />, label: 'Event', path: '/events' },
  { icon: <ScrollText size={18} />, label: 'Pendaftaran Saya', path: '/my-registration' },
  { icon: <User size={18} />, label: 'Profil', path: '/profile' },
];

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const menus = user?.role === 'ADMIN' ? adminMenus : userMenus;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'sans-serif' }}>

      {/* SIDEBAR */}
      <div style={{
        width: collapsed ? '64px' : '240px',
        backgroundColor: '#8b1e2b',
        display: 'flex', flexDirection: 'column',
        transition: 'width 0.3s',
        position: 'fixed', top: 0, left: 0, bottom: 0,
        zIndex: 50, overflow: 'hidden'
      }}>

        {/* Logo */}
        <div style={{
          padding: '20px 16px', display: 'flex',
          alignItems: 'center', justifyContent: collapsed ? 'center' : 'space-between',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}>
          {!collapsed && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CalendarDays size={22} color="white" />
              <span style={{ color: 'white', fontWeight: 'bold', fontSize: '16px' }}>SeminarKu</span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'white', padding: '4px' }}>
            {collapsed ? <Menu size={20} /> : <X size={20} />}
          </button>
        </div>

        {/* User Info */}
        {!collapsed && (
          <div style={{
            padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)',
            display: 'flex', alignItems: 'center', gap: '10px'
          }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0
            }}>
              <User size={18} color="white" />
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ color: 'white', fontSize: '13px', fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.name}
              </div>
              <div style={{
                color: 'rgba(255,255,255,0.6)', fontSize: '11px',
                backgroundColor: 'rgba(255,255,255,0.15)',
                padding: '2px 8px', borderRadius: '10px', display: 'inline-block', marginTop: '2px'
              }}>
                {user?.role}
              </div>
            </div>
          </div>
        )}

        {/* Menu Items */}
        <div style={{ flex: 1, padding: '12px 8px', overflowY: 'auto' }}>
          {menus.map((menu, i) => {
            const isActive = location.pathname === menu.path;
            return (
              <button key={i}
                onClick={() => navigate(menu.path)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center',
                  gap: '12px', padding: '10px 12px', marginBottom: '4px',
                  backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : 'transparent',
                  border: 'none', cursor: 'pointer', borderRadius: '6px',
                  color: 'white', fontSize: '13px', fontWeight: isActive ? 'bold' : 'normal',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)' }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.backgroundColor = 'transparent' }}
              >
                {menu.icon}
                {!collapsed && (
                  <>
                    <span style={{ flex: 1, textAlign: 'left' }}>{menu.label}</span>
                    {isActive && <ChevronRight size={14} />}
                  </>
                )}
              </button>
            );
          })}
        </div>

        {/* Logout */}
        <div style={{ padding: '12px 8px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <button
            onClick={handleLogout}
            style={{
              width: '100%', display: 'flex', alignItems: 'center',
              gap: '12px', padding: '10px 12px',
              backgroundColor: 'rgba(255,255,255,0.1)',
              border: 'none', cursor: 'pointer', borderRadius: '6px',
              color: 'white', fontSize: '13px',
              justifyContent: collapsed ? 'center' : 'flex-start',
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
          >
            <LogOut size={18} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{
        marginLeft: collapsed ? '64px' : '240px',
        flex: 1, transition: 'margin-left 0.3s',
        backgroundColor: '#f9fafb', minHeight: '100vh'
      }}>

        {/* Topbar */}
        <div style={{
          backgroundColor: 'white', padding: '16px 32px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#374151' }}>
            {menus.find(m => m.path === location.pathname)?.label || 'Dashboard'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6b7280', fontSize: '13px' }}>
            <User size={16} />
            {user?.name}
          </div>
        </div>

        {/* Page Content */}
        <div style={{ padding: '32px' }}>
          {children}
        </div>
      </div>

    </div>
  );
};

export default Layout;