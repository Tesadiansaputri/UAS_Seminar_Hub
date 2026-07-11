import { useEffect, useMemo, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  CalendarDays,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  Mic2,
  TrendingUp,
  User,
  UserCog,
  UsersRound,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

type DashboardStats = {
  totalUser: number;
  totalSeminar: number;
  totalPembicara: number;
};

type StatCard = {
  icon: ReactNode;
  label: string;
  value: number;
  desc: string;
};

const superAdminMenus = [
  {
    icon: <LayoutDashboard size={18} />,
    label: 'Dashboard',
    path: '/super-admin/dashboard',
  },
  {
    icon: <UserCog size={18} />,
    label: 'Kelola Admin',
    path: '/super-admin/admin',
  },
  {
    icon: <UsersRound size={18} />,
    label: 'Kelola User',
    path: '/super-admin/user',
  },
];

const maroon = '#971b2d';
const softPink = '#fff1f3';
const green = '#22c55e';

const styles: Record<string, CSSProperties> = {
  page: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#f9fafb',
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    color: '#0f2238',
  },
  sidebar: {
    width: '240px',
    minHeight: '100vh',
    backgroundColor: maroon,
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    color: '#ffffff',
  },
  brand: {
    padding: '20px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    boxSizing: 'border-box',
  },
  brandTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '16px',
    fontWeight: 800,
  },
  iconButton: {
    border: 'none',
    background: 'transparent',
    color: '#ffffff',
    cursor: 'pointer',
    display: 'grid',
    placeItems: 'center',
    padding: 0,
  },
  profile: {
    padding: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
  },
  avatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255,255,255,0.18)',
    display: 'grid',
    placeItems: 'center',
    flexShrink: 0,
  },
  profileName: {
    fontSize: '13px',
    lineHeight: 1.2,
    fontWeight: 800,
  },
  roleBadge: {
    display: 'inline-flex',
    marginTop: '2px',
    padding: '2px 8px',
    borderRadius: '999px',
    backgroundColor: 'rgba(255,255,255,0.18)',
    color: 'rgba(255,255,255,0.86)',
    fontSize: '11px',
    fontWeight: 700,
  },
  nav: {
    flex: 1,
    padding: '12px 8px',
  },
  navItem: {
    width: '100%',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: 'transparent',
    color: '#ffffff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 12px',
    marginBottom: '4px',
    fontSize: '13px',
    fontWeight: 500,
    textAlign: 'left',
  },
  navItemActive: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    fontWeight: 700,
  },
  navLabel: {
    flex: 1,
  },
  sidebarFooter: {
    padding: '12px 8px',
    borderTop: '1px solid rgba(255,255,255,0.1)',
  },
  logoutButton: {
    width: '100%',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: 'rgba(255,255,255,0.14)',
    color: '#ffffff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 12px',
    fontSize: '13px',
    fontWeight: 500,
  },
  main: {
    flex: 1,
    minWidth: 0,
    padding: '32px',
    boxSizing: 'border-box',
  },
  header: {
    marginBottom: '32px',
  },
  title: {
    margin: '0 0 4px',
    fontSize: '24px',
    lineHeight: 1.15,
    fontWeight: 800,
    color: '#0f2238',
    letterSpacing: 0,
  },
  subtitle: {
    margin: 0,
    fontSize: '14px',
    color: '#667085',
  },
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, minmax(220px, 1fr))',
    gap: '20px',
  },
  card: {
    minHeight: '188px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    borderLeft: `4px solid ${maroon}`,
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    padding: '24px',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  cardTop: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '18px',
  },
  cardIcon: {
    width: '44px',
    height: '44px',
    borderRadius: '10px',
    backgroundColor: softPink,
    color: maroon,
    display: 'grid',
    placeItems: 'center',
    flexShrink: 0,
  },
  value: {
    margin: '22px 0 8px',
    fontSize: '28px',
    lineHeight: 1,
    fontWeight: 800,
    color: '#0f2238',
    letterSpacing: 0,
  },
  label: {
    margin: '0 0 4px',
    fontSize: '13px',
    lineHeight: 1.2,
    fontWeight: 800,
    color: '#192638',
  },
  desc: {
    margin: 0,
    fontSize: '12px',
    color: '#98a2b3',
  },
  loading: {
    height: '360px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: maroon,
    fontSize: '18px',
    fontWeight: 700,
  },
};

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalUser: 0,
    totalSeminar: 0,
    totalPembicara: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [userRes, seminarRes, speakerRes] = await Promise.all([
          api.get('/users'),
          api.get('/seminars'),
          api.get('/speakers'),
        ]);

        setStats({
          totalUser: Array.isArray(userRes.data) ? userRes.data.length : 0,
          totalSeminar: Array.isArray(seminarRes.data) ? seminarRes.data.length : 0,
          totalPembicara: Array.isArray(speakerRes.data) ? speakerRes.data.length : 0,
        });
      } catch (err) {
        console.error('Gagal fetch dashboard super admin:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const statCards = useMemo<StatCard[]>(
    () => [
      {
        icon: <UsersRound size={24} strokeWidth={2.3} />,
        label: 'Total User',
        value: stats.totalUser,
        desc: 'Total semua user',
      },
      {
        icon: <CalendarDays size={24} strokeWidth={2.3} />,
        label: 'Total Seminar',
        value: stats.totalSeminar,
        desc: 'Total semua seminar',
      },
      {
        icon: <Mic2 size={24} strokeWidth={2.3} />,
        label: 'Total Pembicara',
        value: stats.totalPembicara,
        desc: 'Total narasumber',
      },
    ],
    [stats],
  );

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={styles.page}>
      <aside style={styles.sidebar}>
        <div style={styles.brand}>
          <div style={styles.brandTitle}>
            <CalendarDays size={22} />
            <span>SeminarKu</span>
          </div>
          <button type="button" aria-label="Tutup sidebar" style={styles.iconButton}>
            <X size={20} />
          </button>
        </div>

        <div style={styles.profile}>
          <div style={styles.avatar}>
            <User size={18} />
          </div>
          <div>
            <div style={styles.profileName}>{user?.name || 'Super Admin'}</div>
            <div style={styles.roleBadge}>SUPER ADMIN</div>
          </div>
        </div>

        <nav style={styles.nav} aria-label="Menu super admin">
          {superAdminMenus.map((menu) => {
            const isActive = location.pathname === menu.path;

            return (
              <button
                key={menu.path}
                type="button"
                onClick={() => navigate(menu.path)}
                style={{
                  ...styles.navItem,
                  ...(isActive ? styles.navItemActive : {}),
                }}
              >
                {menu.icon}
                <span style={styles.navLabel}>{menu.label}</span>
                {isActive && <ChevronRight size={14} />}
              </button>
            );
          })}
        </nav>

        <div style={styles.sidebarFooter}>
          <button type="button" onClick={handleLogout} style={styles.logoutButton}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main style={styles.main}>
        <header style={styles.header}>
          <h1 style={styles.title}>Selamat Datang, Admin!</h1>
          <p style={styles.subtitle}>Berikut ringkasan data SeminarKu hari ini.</p>
        </header>

        {loading ? (
          <div style={styles.loading}>Loading...</div>
        ) : (
          <section style={styles.cardGrid}>
            {statCards.map((card) => (
              <article key={card.label} style={styles.card}>
                <div style={styles.cardTop}>
                  <div style={styles.cardIcon}>{card.icon}</div>
                  <TrendingUp size={24} color={green} strokeWidth={2.4} />
                </div>

                <div>
                  <p style={styles.value}>{card.value}</p>
                  <h2 style={styles.label}>{card.label}</h2>
                  <p style={styles.desc}>{card.desc}</p>
                </div>
              </article>
            ))}
          </section>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
