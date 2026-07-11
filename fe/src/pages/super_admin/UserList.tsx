import { useEffect, useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Ban,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  Search,
  Trash2,
  User,
  UserCog,
  UsersRound,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { normalizeRole } from '../../utils/role';
import api from '../../services/api';

type AppUser = {
  id: number;
  name: string;
  email: string;
  status: 'active' | 'inactive';
  joinedAt: string;
};

type ApiUser = {
  id: number;
  name?: string;
  email?: string;
  role?: string;
  status?: string;
  isActive?: boolean;
  isBlocked?: boolean;
  blocked?: boolean;
  createdAt?: string;
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
    marginBottom: '24px',
  },
  title: {
    margin: '0 0 4px',
    fontSize: '24px',
    lineHeight: 1.15,
    fontWeight: 800,
    color: '#0f2238',
  },
  subtitle: {
    margin: 0,
    fontSize: '14px',
    color: '#667085',
  },
  toolbar: {
    marginBottom: '20px',
  },
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#ffffff',
    border: '1px solid #e4e7ec',
    borderRadius: '8px',
    padding: '10px 14px',
    maxWidth: '360px',
    color: '#667085',
  },
  searchInput: {
    border: 'none',
    outline: 'none',
    fontSize: '13px',
    flex: 1,
    color: '#0f2238',
  },
  tableWrap: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    overflow: 'hidden',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '13px',
  },
  th: {
    textAlign: 'left',
    padding: '14px 20px',
    backgroundColor: softPink,
    color: maroon,
    fontWeight: 800,
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.02em',
  },
  td: {
    padding: '14px 20px',
    borderBottom: '1px solid #f0f2f5',
    color: '#344054',
  },
  statusBadge: {
    display: 'inline-flex',
    padding: '4px 10px',
    borderRadius: '999px',
    fontSize: '11px',
    fontWeight: 700,
    color: '#ffffff',
    minWidth: '72px',
    justifyContent: 'center',
  },
  rowActions: {
    display: 'flex',
    gap: '8px',
  },
  rowIconButton: {
    border: '1px solid #e4e7ec',
    borderRadius: '6px',
    backgroundColor: '#ffffff',
    color: '#475467',
    cursor: 'pointer',
    display: 'grid',
    placeItems: 'center',
    width: '30px',
    height: '30px',
  },
  loading: {
    height: '240px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: maroon,
    fontSize: '18px',
    fontWeight: 700,
  },
  emptyRow: {
    padding: '32px',
    textAlign: 'center',
    color: '#98a2b3',
  },
};

const formatDate = (value?: string) => {
  if (!value) return '-';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';

  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};

const getUserStatus = (raw: ApiUser): AppUser['status'] => {
  const status = raw.status?.toLowerCase();

  if (status === 'inactive' || status === 'nonaktif' || status === 'banned' || status === 'diblokir') {
    return 'inactive';
  }

  if (raw.isActive === false || raw.isBlocked || raw.blocked) {
    return 'inactive';
  }

  return 'active';
};

const mapUser = (raw: ApiUser): AppUser => ({
  id: raw.id,
  name: raw.name || '-',
  email: raw.email || '-',
  status: getUserStatus(raw),
  joinedAt: formatDate(raw.createdAt),
});

const UserList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const [users, setUsers] = useState<AppUser[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/users');
      const data: ApiUser[] = Array.isArray(res.data) ? res.data : [];

      setUsers(
        data
          .filter((item) => normalizeRole(item.role) === 'USER')
          .map(mapUser),
      );
    } catch (err) {
      console.error('Gagal fetch data user:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = (id: number, current: AppUser['status']) => {
    const nextStatus = current === 'active' ? 'inactive' : 'active';
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: nextStatus } : u)),
    );
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus user ini?')) return;
    try {
      await api.delete(`/users/${id}`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      console.error('Gagal menghapus user:', err);
    }
  };

  const filteredUsers = useMemo(
    () =>
      users.filter(
        (u) =>
          u.name.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase()),
      ),
    [users, search],
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
          <h1 style={styles.title}>Kelola User</h1>
          <p style={styles.subtitle}>Kelola akun user yang terdaftar di SeminarKu.</p>
        </header>

        <div style={styles.toolbar}>
          <div style={styles.searchBox}>
            <Search size={16} />
            <input
              type="text"
              placeholder="Cari nama atau email user..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={styles.searchInput}
            />
          </div>
        </div>

        {loading ? (
          <div style={styles.loading}>Loading...</div>
        ) : (
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Nama</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Bergabung</th>
                  <th style={styles.th}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={styles.emptyRow}>
                      Tidak ada data user.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr key={u.id}>
                      <td style={styles.td}>{u.name}</td>
                      <td style={styles.td}>{u.email}</td>
                      <td style={styles.td}>
                        <span
                          style={{
                            ...styles.statusBadge,  
                            backgroundColor:
                              u.status === 'active' ? '#22c55e' : '#9ca3af',
                          }}
                        >
                          {u.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                        </span>
                      </td>
                      <td style={styles.td}>{u.joinedAt}</td>
                      <td style={styles.td}>
                        <div style={styles.rowActions}>
                          <button
                            type="button"
                            aria-label={
                              u.status === 'active' ? 'Nonaktifkan user' : 'Aktifkan user'
                            }
                            style={styles.rowIconButton}
                            onClick={() => handleToggleStatus(u.id, u.status)}
                          >
                            {u.status === 'active' ? (
                              <Ban size={14} />
                            ) : (
                              <CheckCircle2 size={14} />
                            )}
                          </button>
                          <button
                            type="button"
                            aria-label="Hapus user"
                            style={styles.rowIconButton}
                            onClick={() => handleDelete(u.id)}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default UserList;
