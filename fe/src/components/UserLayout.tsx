import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BrandLogo from './BrandLogo';
import {
  LogOut,
  LayoutDashboard,
  LayoutGrid,
  User,
} from 'lucide-react';

const COLOR = {
  bg: '#FAF8F5',
  surface: '#FFFFFF',
  primary: '#8B1E2B',
  text: '#241F1E',
  textMuted: '#8A8380',
  border: '#ECE6E1',
};

const FONT_BODY = "'Inter', sans-serif";

const userMenus = [
  {
    icon: <LayoutDashboard size={18} />,
    label: 'Dashboard',
    path: '/home',
  },
  {
    icon: <LayoutGrid size={18} />,
    label: 'Seminar',
    path: '/seminars',
  },
  {
    icon: <User size={18} />,
    label: 'Profil',
    path: '/profile',
  },
];

const FONT_LINK_ID = 'seminarhub-google-fonts';

function useGoogleFonts() {
  useEffect(() => {
    if (document.getElementById(FONT_LINK_ID)) return;

    const link = document.createElement('link');
    link.id = FONT_LINK_ID;
    link.rel = 'stylesheet';
    link.href =
      'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';

    document.head.appendChild(link);
  }, []);
}

const UserLayout = ({ children }: { children: React.ReactNode }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useGoogleFonts();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: COLOR.bg,
        fontFamily: FONT_BODY,
      }}
    >
      {/* ================= NAVBAR ================= */}
      <nav
        style={{
          background: COLOR.surface,
          borderBottom: `1px solid ${COLOR.border}`,
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '0 32px',
            minHeight: '88px',

            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr',
            alignItems: 'center',
          }}
        >
          {/* ================= LOGO ================= */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifySelf: 'start',
            }}
          >
            <div
              onClick={() => navigate('/home')}
              style={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
              }}
            >
              <BrandLogo width={116} style={{ borderRadius: 8 }} />
            </div>
          </div>

          {/* ================= MENU ================= */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '52px',
              height: '100%',
            }}
          >
            {userMenus.map((menu, index) => {
              const isActive = location.pathname === menu.path;

              return (
                <button
                  key={index}
                  onClick={() => navigate(menu.path)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '0 10px',
                    height: '100%',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',

                    borderBottom: isActive
                      ? `3px solid ${COLOR.primary}`
                      : '3px solid transparent',

                    color: isActive
                      ? COLOR.primary
                      : COLOR.textMuted,

                    fontWeight: isActive ? 600 : 500,
                    fontSize: '14px',
                    fontFamily: FONT_BODY,
                    transition: '.2s',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive)
                      e.currentTarget.style.color = COLOR.text;
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive)
                      e.currentTarget.style.color =
                        COLOR.textMuted;
                  }}
                >
                  {menu.icon}
                  {menu.label}
                </button>
              );
            })}
          </div>

          {/* ================= LOGOUT ================= */}
          <div
            style={{
              justifySelf: 'end',
            }}
          >
            <button
              onClick={handleLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 14px',
                border: 'none',
                borderRadius: '8px',
                background: 'transparent',
                cursor: 'pointer',
                color: '#B3261E',
                fontWeight: 600,
                fontSize: '13px',
                fontFamily: FONT_BODY,
                transition: '.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#FEF2F2';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* ================= CONTENT ================= */}
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '36px 32px',
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default UserLayout;
