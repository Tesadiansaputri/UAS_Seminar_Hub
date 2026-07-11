import { useEffect, useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  CalendarDays,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  Pencil,
  Plus,
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

type Admin = {
  id: number;
  name: string;
  email: string;
  status: 'active' | 'inactive';
  createdAt: string;
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

type AdminForm = {
  name: string;
  email: string;
  password: string;
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

const emptyAdminForm: AdminForm = {
  name: '',
  email: '',
  password: '',
};

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
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  primaryButton: {
    border: 'none',
    borderRadius: '8px',
    backgroundColor: maroon,
    color: '#ffffff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    fontSize: '13px',
    fontWeight: 700,
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
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    zIndex: 100,
  },
  modalCard: {
    width: '100%',
    maxWidth: '460px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 24px 64px rgba(15, 23, 42, 0.22)',
    overflow: 'hidden',
  },
  modalHeader: {
    padding: '20px 24px',
    borderBottom: '1px solid #f0f2f5',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '16px',
  },
  modalTitle: {
    margin: '0 0 4px',
    fontSize: '18px',
    fontWeight: 800,
    color: '#0f2238',
  },
  modalSubtitle: {
    margin: 0,
    fontSize: '13px',
    color: '#667085',
  },
  closeButton: {
    border: 'none',
    borderRadius: '8px',
    backgroundColor: softPink,
    color: maroon,
    cursor: 'pointer',
    display: 'grid',
    placeItems: 'center',
    width: '34px',
    height: '34px',
    flexShrink: 0,
  },
  modalBody: {
    padding: '22px 24px',
  },
  fieldGroup: {
    marginBottom: '16px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '13px',
    fontWeight: 700,
    color: '#344054',
  },
  input: {
    width: '100%',
    border: '1px solid #d0d5dd',
    borderRadius: '8px',
    outline: 'none',
    padding: '11px 12px',
    fontSize: '13px',
    color: '#0f2238',
    boxSizing: 'border-box',
  },
  formError: {
    backgroundColor: '#fef2f2',
    color: '#dc2626',
    borderRadius: '8px',
    padding: '10px 12px',
    fontSize: '13px',
    marginBottom: '16px',
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    padding: '16px 24px',
    backgroundColor: '#f9fafb',
    borderTop: '1px solid #f0f2f5',
  },
  secondaryButton: {
    border: '1px solid #d0d5dd',
    borderRadius: '8px',
    backgroundColor: '#ffffff',
    color: '#344054',
    cursor: 'pointer',
    padding: '10px 16px',
    fontSize: '13px',
    fontWeight: 700,
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

const getAdminStatus = (raw: ApiUser): Admin['status'] => {
  const status = raw.status?.toLowerCase();

  if (status === 'inactive' || status === 'nonaktif' || status === 'banned' || status === 'diblokir') {
    return 'inactive';
  }

  if (raw.isActive === false || raw.isBlocked || raw.blocked) {
    return 'inactive';
  }

  return 'active';
};

const mapAdmin = (raw: ApiUser): Admin => ({
  id: raw.id,
  name: raw.name || '-',
  email: raw.email || '-',
  status: getAdminStatus(raw),
  createdAt: formatDate(raw.createdAt),
});

const AdminList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const [admins, setAdmins] = useState<Admin[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [adminForm, setAdminForm] = useState<AdminForm>(emptyAdminForm);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const res = await api.get('/users');
      const data: ApiUser[] = Array.isArray(res.data) ? res.data : [];

      setAdmins(
        data
          .filter((item) => normalizeRole(item.role) === 'ADMIN')
          .map(mapAdmin),
      );
    } catch (err) {
      console.error('Gagal fetch data admin:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    setAdminForm(emptyAdminForm);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (submitting) return;
    setIsModalOpen(false);
    setFormError('');
  };

  const handleCreateAdmin = async () => {
    const name = adminForm.name.trim();
    const email = adminForm.email.trim();
    const password = adminForm.password.trim();

    if (!name || !email || !password) {
      setFormError('Nama, email, dan password harus diisi.');
      return;
    }

    if (password.length < 6) {
      setFormError('Password minimal 6 karakter.');
      return;
    }

    try {
      setSubmitting(true);
      setFormError('');

      await api.post('/auth/register', {
        name,
        email,
        password,
        role: 'ADMIN',
      });

      await fetchAdmins();
      setIsModalOpen(false);
      setAdminForm(emptyAdminForm);
    } catch (err) {
      console.error('Gagal menambahkan admin:', err);
      setFormError('Gagal menambahkan admin. Pastikan email belum digunakan.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus admin ini?')) return;
    try {
      await api.delete(`/users/${id}`);
      setAdmins((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error('Gagal menghapus admin:', err);
    }
  };

  const filteredAdmins = useMemo(
    () =>
      admins.filter(
        (a) =>
          a.name.toLowerCase().includes(search.toLowerCase()) ||
          a.email.toLowerCase().includes(search.toLowerCase()),
      ),
    [admins, search],
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
          <div>
            <h1 style={styles.title}>Kelola Admin</h1>
            <p style={styles.subtitle}>Kelola akun admin yang mengelola SeminarKu.</p>
          </div>
          <button type="button" style={styles.primaryButton} onClick={handleOpenModal}>
            <Plus size={16} />
            Tambah Admin
          </button>
        </header>

        <div style={styles.toolbar}>
          <div style={styles.searchBox}>
            <Search size={16} />
            <input
              type="text"
              placeholder="Cari nama atau email admin..."
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
                  <th style={styles.th}>Dibuat</th>
                  <th style={styles.th}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredAdmins.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={styles.emptyRow}>
                      Tidak ada data admin.
                    </td>
                  </tr>
                ) : (
                  filteredAdmins.map((admin) => (
                    <tr key={admin.id}>
                      <td style={styles.td}>{admin.name}</td>
                      <td style={styles.td}>{admin.email}</td>
                      <td style={styles.td}>
                        <span
                          style={{
                            ...styles.statusBadge,
                            backgroundColor:
                              admin.status === 'active' ? '#22c55e' : '#9ca3af',
                          }}
                        >
                          {admin.status === 'active' ? 'Aktif' : 'Nonaktif'}
                        </span>
                      </td>
                      <td style={styles.td}>{admin.createdAt}</td>
                      <td style={styles.td}>
                        <div style={styles.rowActions}>
                          <button
                            type="button"
                            aria-label="Edit admin"
                            style={styles.rowIconButton}
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            type="button"
                            aria-label="Hapus admin"
                            style={styles.rowIconButton}
                            onClick={() => handleDelete(admin.id)}
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

      {isModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <div style={styles.modalHeader}>
              <div>
                <h2 style={styles.modalTitle}>Tambah Admin</h2>
                <p style={styles.modalSubtitle}>
                  Buat akun admin baru untuk mengelola data SeminarKu.
                </p>
              </div>
              <button
                type="button"
                aria-label="Tutup modal tambah admin"
                style={styles.closeButton}
                onClick={handleCloseModal}
              >
                <X size={18} />
              </button>
            </div>

            <div style={styles.modalBody}>
              {formError && <div style={styles.formError}>{formError}</div>}

              <div style={styles.fieldGroup}>
                <label style={styles.label} htmlFor="admin-name">
                  Nama Admin
                </label>
                <input
                  id="admin-name"
                  type="text"
                  placeholder="Masukkan nama admin"
                  value={adminForm.name}
                  onChange={(e) =>
                    setAdminForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  style={styles.input}
                />
              </div>

              <div style={styles.fieldGroup}>
                <label style={styles.label} htmlFor="admin-email">
                  Email
                </label>
                <input
                  id="admin-email"
                  type="email"
                  placeholder="admin@email.com"
                  value={adminForm.email}
                  onChange={(e) =>
                    setAdminForm((prev) => ({ ...prev, email: e.target.value }))
                  }
                  style={styles.input}
                />
              </div>

              <div style={styles.fieldGroup}>
                <label style={styles.label} htmlFor="admin-password">
                  Password
                </label>
                <input
                  id="admin-password"
                  type="password"
                  placeholder="Minimal 6 karakter"
                  value={adminForm.password}
                  onChange={(e) =>
                    setAdminForm((prev) => ({ ...prev, password: e.target.value }))
                  }
                  style={styles.input}
                />
              </div>
            </div>

            <div style={styles.modalActions}>
              <button
                type="button"
                style={styles.secondaryButton}
                onClick={handleCloseModal}
                disabled={submitting}
              >
                Batal
              </button>
              <button
                type="button"
                style={{
                  ...styles.primaryButton,
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  opacity: submitting ? 0.75 : 1,
                }}
                onClick={handleCreateAdmin}
                disabled={submitting}
              >
                <Plus size={16} />
                {submitting ? 'Menyimpan...' : 'Simpan Admin'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminList;
