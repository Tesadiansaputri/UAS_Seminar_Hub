import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import BrandLogo from '../../components/BrandLogo';
import {
  Monitor, Briefcase, Palette, GraduationCap,
  Target, FileText, ScrollText,
  CalendarDays, Users, Mic, LayoutGrid,
  ArrowRight, Star, Sparkles, UserRound,
  LogIn, UserPlus, Award, MapPin, Loader2
} from 'lucide-react';

interface Seminar {
  id: number;
  seminar_name: string;
  tanggal?: string;
  harga: string;
  kuota_tersedia: number;
  category?: {
    category_name: string;
  };
  level?: {
    nama_level: string;
  };
}

interface Category {
  id: number;
  category_name: string;
  _count?: {
    seminars: number;
  };
}

interface Speaker {
  id: number;
}

const fallbackCategories = [
  { icon: Monitor, name: 'Teknologi' },
  { icon: Briefcase, name: 'Bisnis & Wirausaha' },
  { icon: Palette, name: 'Kreatif & Desain' },
  { icon: GraduationCap, name: 'Pendidikan' },
];

const featureItems = [
  { icon: Target, title: 'Pilih Kategori', desc: 'Temukan seminar & workshop sesuai minatmu dari berbagai kategori.' },
  { icon: FileText, title: 'Daftar Mudah', desc: 'Proses pendaftaran cepat dan mudah hanya dalam beberapa klik.' },
  { icon: Mic, title: 'Speaker Terbaik', desc: 'Narasumber ahli dan berpengalaman untuk rekomendasi SAW terbaik.' },
  { icon: ScrollText, title: 'Dapat Sertifikat', desc: 'Dapatkan sertifikat resmi setelah mengikuti event.' },
];

const formatDate = (date?: string) => {
  if (!date) return '-';

  return new Date(date).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const formatPrice = (price: string) => {
  const numericPrice = Number(price);

  if (!numericPrice) return 'Gratis';

  return `Rp ${numericPrice.toLocaleString('id-ID')}`;
};

const LandingPage = () => {
  const navigate = useNavigate();

  const [seminars, setSeminars] = useState<Seminar[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLandingData = async () => {
      try {
        const [seminarRes, categoryRes, speakerRes] = await Promise.all([
          api.get('/seminar').catch(() => api.get('/seminars')),
          api.get('/categories'),
          api.get('/speaker'),
        ]);

        setSeminars(Array.isArray(seminarRes.data) ? seminarRes.data : []);
        setCategories(Array.isArray(categoryRes.data) ? categoryRes.data : []);
        setSpeakers(Array.isArray(speakerRes.data) ? speakerRes.data : []);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLandingData();
  }, []);

  const visibleSeminars = useMemo(() => seminars.slice(0, 3), [seminars]);
  const visibleCategories = useMemo(() => {
    if (!categories.length) return fallbackCategories;

    return categories.slice(0, 4).map((category, index) => ({
      icon: fallbackCategories[index % fallbackCategories.length].icon,
      name: category.category_name,
    }));
  }, [categories]);

  const totalKuota = useMemo(
    () => seminars.reduce((total, item) => total + Number(item.kuota_tersedia || 0), 0),
    [seminars]
  );

  const stats = [
    { icon: LayoutGrid, num: seminars.length, label: 'Event' },
    { icon: Mic, num: speakers.length, label: 'Speaker' },
    { icon: Users, num: totalKuota, label: 'Kuota' },
    { icon: Star, num: categories.length || visibleCategories.length, label: 'Kategori' },
  ];

  return (
    <div style={styles.page}>
      <nav style={styles.navbar}>
        <div style={styles.brand}>
          <BrandLogo width={118} style={{ borderRadius: 8 }} />
        </div>

        <div style={styles.navActions}>
          <button onClick={() => navigate('/login')} style={styles.loginButton}>
            <LogIn size={15} />
            Login
          </button>
          <button onClick={() => navigate('/register')} style={styles.registerButton}>
            <UserPlus size={15} />
            Registrasi
          </button>
        </div>
      </nav>

      <section style={styles.hero}>
        <div style={styles.heroGlowOne} />
        <div style={styles.heroGlowTwo} />
        <div style={styles.heroCurve} />

        <div style={styles.heroContent}>
          <div style={styles.badge}>
            <Sparkles size={14} />
            Platform Seminar & Workshop
            <Sparkles size={14} />
          </div>

          <h1 style={styles.heroTitle}>
            Tingkatkan Skillmu
            <br />
            Bersama Para Ahli
          </h1>

          <p style={styles.heroText}>
            Temukan ribuan seminar & workshop berkualitas dengan narasumber
            berpengalaman untuk masa depanmu.
          </p>

          <div style={styles.heroActions}>
            <button onClick={() => navigate('/register')} style={styles.primaryButton}>
              Mulai Sekarang
              <ArrowRight size={16} />
            </button>
            <button onClick={() => navigate('/login')} style={styles.secondaryButton}>
              Lihat Event
            </button>
          </div>

          <div style={styles.statsGrid}>
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div key={stat.label} style={styles.statCard}>
                  <Icon size={27} />
                  <div>
                    <strong style={styles.statNumber}>
                      {loading ? '-' : stat.num}
                      {stat.label !== 'Kategori' && Number(stat.num) > 0 ? '+' : ''}
                    </strong>
                    <span style={styles.statLabel}>{stat.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section style={styles.featureSection}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>
            Kenapa <span style={styles.redText}>platform ini?</span>
          </h2>
          <p style={styles.sectionSubtitle}>
            Platform terbaik untuk mengembangkan diri bersama para profesional
          </p>
        </div>

        <div style={styles.featureGrid}>
          {featureItems.map((feature) => {
            const Icon = feature.icon;

            return (
              <article key={feature.title} style={styles.featureCard}>
                <div style={styles.featureIcon}>
                  <Icon size={25} />
                </div>
                <h3 style={styles.featureTitle}>{feature.title}</h3>
                <p style={styles.featureDesc}>{feature.desc}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section style={styles.categorySection}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>
            Jelajahi <span style={styles.redText}>Kategori</span>
          </h2>
          <p style={styles.sectionSubtitle}>
            Pilih topik yang paling sesuai dengan minat dan kebutuhanmu
          </p>
        </div>

        <div style={styles.categoryGrid}>
          {visibleCategories.map((category) => {
            const Icon = category.icon;

            return (
              <button key={category.name} style={styles.categoryCard} onClick={() => navigate('/login')}>
                <Icon size={21} />
                {category.name}
              </button>
            );
          })}
        </div>
      </section>

      <section style={styles.eventSection}>
        <div style={styles.eventHeader}>
          <div style={styles.sectionHeaderCompact}>
            <h2 style={styles.sectionTitle}>
              Event <span style={styles.redText}>Terbaru</span>
            </h2>
            <p style={styles.sectionSubtitle}>
              Jangan sampai ketinggalan event menarik berikut ini
            </p>
          </div>

          <button onClick={() => navigate('/login')} style={styles.viewAllButton}>
            Lihat Semua
            <ArrowRight size={15} />
          </button>
        </div>

        {loading ? (
          <div style={styles.loadingState}>
            <Loader2 size={24} />
            Memuat data seminar...
          </div>
        ) : visibleSeminars.length ? (
          <div style={styles.eventGrid}>
            {visibleSeminars.map((event) => (
              <article key={event.id} style={styles.eventCard}>
                <div style={styles.eventRibbon}>
                  {event.category?.category_name || 'Seminar'}
                </div>

                <div style={styles.eventBody}>
                  <h3 style={styles.eventTitle}>{event.seminar_name}</h3>

                  <div style={styles.eventMeta}>
                    <span style={styles.metaItem}>
                      <CalendarDays size={14} />
                      {formatDate(event.tanggal)}
                    </span>
                    <span style={styles.metaItem}>
                      <MapPin size={14} />
                      {event.level?.nama_level || '-'}
                    </span>
                  </div>

                  <div style={styles.eventFooter}>
                    <div>
                      <span style={styles.priceLabel}>Harga</span>
                      <strong style={styles.priceText}>{formatPrice(event.harga)}</strong>
                    </div>
                    <span style={styles.quotaPill}>
                      <UserRound size={14} />
                      {event.kuota_tersedia} kuota
                    </span>
                  </div>

                  <button onClick={() => navigate('/login')} style={styles.cardButton}>
                    Daftar Sekarang
                    <ArrowRight size={14} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div style={styles.emptyState}>
            <Award size={28} />
            Belum ada data seminar dari database.
          </div>
        )}
      </section>

      <footer style={styles.footer}>
        <div style={styles.footerBrand}>
          <BrandLogo width={154} style={{ borderRadius: 8 }} />
        </div>
        <p style={styles.footerText}>
          Platform seminar & workshop terbaik untuk pengembangan diri
        </p>
        <span style={styles.copyright}>
          © 2026. All rights reserved.
        </span>
      </footer>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#fff',
    color: '#1f2937',
    fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  navbar: {
    position: 'sticky',
    top: 0,
    zIndex: 20,
    minHeight: 90,
    padding: '0 32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: 'rgba(255, 246, 248, 0.95)',
    borderBottom: '1px solid rgba(139, 30, 43, 0.12)',
    boxShadow: '0 12px 35px rgba(139, 30, 43, 0.12)',
    backdropFilter: 'blur(18px)',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
  },
  navActions: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
  loginButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    minHeight: 40,
    padding: '0 18px',
    color: '#8b1e2b',
    backgroundColor: '#fff',
    border: '1px solid rgba(139, 30, 43, 0.18)',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
  },
  registerButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    minHeight: 40,
    padding: '0 18px',
    color: '#fff',
    backgroundColor: '#8b1e2b',
    border: '1px solid #8b1e2b',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0 10px 20px rgba(139, 30, 43, 0.22)',
  },
  hero: {
    position: 'relative',
    overflow: 'hidden',
    minHeight: 450,
    padding: '72px 7vw 34px',
    color: '#fff',
    background: 'linear-gradient(135deg, #7f1020 0%, #9f1a2c 44%, #d93456 100%)',
  },
  heroGlowOne: {
    position: 'absolute',
    top: -160,
    right: -110,
    width: 520,
    height: 520,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(255, 212, 219, 0.48) 0%, rgba(214, 49, 81, 0.24) 38%, rgba(139, 30, 43, 0) 70%)',
  },
  heroGlowTwo: {
    position: 'absolute',
    bottom: -230,
    left: '42%',
    width: 680,
    height: 420,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, rgba(179, 35, 55, 0.22) 46%, rgba(139, 30, 43, 0) 72%)',
    transform: 'rotate(-12deg)',
  },
  heroCurve: {
    position: 'absolute',
    right: '-9%',
    top: 78,
    width: '55%',
    height: 250,
    border: '1px solid rgba(255, 255, 255, 0.34)',
    borderLeft: 0,
    borderBottom: 0,
    borderRadius: '0 260px 0 0',
    transform: 'rotate(-14deg)',
    boxShadow: '24px -20px 60px rgba(255, 255, 255, 0.2)',
  },
  heroContent: {
    position: 'relative',
    zIndex: 2,
    maxWidth: 1180,
    margin: '0 auto',
  },
  badge: {
    width: 'fit-content',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 7,
    marginBottom: 22,
    padding: '8px 13px',
    color: '#fff',
    backgroundColor: 'rgba(139, 30, 43, 0.42)',
    border: '1px solid rgba(255, 255, 255, 0.18)',
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 800,
  },
  heroTitle: {
    maxWidth: 720,
    margin: '0 0 14px',
    color: '#fff',
    fontSize: 48,
    lineHeight: 1.04,
    fontWeight: 900,
    letterSpacing: 0,
  },
  heroText: {
    maxWidth: 575,
    margin: '0 0 24px',
    color: 'rgba(255, 255, 255, 0.94)',
    fontSize: 16,
    lineHeight: 1.7,
    fontWeight: 500,
  },
  heroActions: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    flexWrap: 'wrap',
  },
  primaryButton: {
    minHeight: 48,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: '0 27px',
    color: '#8b1e2b',
    backgroundColor: '#fff',
    border: 0,
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 800,
    cursor: 'pointer',
    boxShadow: '0 16px 35px rgba(88, 8, 22, 0.22)',
  },
  secondaryButton: {
    minHeight: 48,
    padding: '0 27px',
    color: '#fff',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.82)',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 800,
    cursor: 'pointer',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(145px, 1fr))',
    gap: 24,
    marginTop: 36,
  },
  statCard: {
    minHeight: 84,
    padding: '18px 22px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 15,
    color: '#fff',
    backgroundColor: 'rgba(255, 255, 255, 0.11)',
    border: '1px solid rgba(255, 255, 255, 0.26)',
    borderRadius: 8,
    boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.16)',
  },
  statNumber: {
    display: 'block',
    color: '#fff',
    fontSize: 26,
    lineHeight: 1,
    fontWeight: 900,
  },
  statLabel: {
    display: 'block',
    marginTop: 6,
    color: 'rgba(255, 255, 255, 0.84)',
    fontSize: 12,
    fontWeight: 700,
  },
  featureSection: {
    padding: '28px 7vw 24px',
    background: 'linear-gradient(180deg, #fff 0%, #fff7f8 100%)',
  },
  sectionHeader: {
    textAlign: 'center',
    marginBottom: 22,
  },
  sectionHeaderCompact: {
    textAlign: 'center',
    flex: 1,
  },
  sectionTitle: {
    margin: 0,
    color: '#171923',
    fontSize: 25,
    lineHeight: 1.2,
    fontWeight: 900,
    letterSpacing: 0,
  },
  redText: {
    color: '#b51f35',
  },
  sectionSubtitle: {
    margin: '8px 0 0',
    color: '#6b7280',
    fontSize: 13,
    fontWeight: 500,
  },
  featureGrid: {
    maxWidth: 1040,
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
    gap: 26,
  },
  featureCard: {
    minHeight: 148,
    padding: '25px 18px 21px',
    textAlign: 'center',
    backgroundColor: '#fff',
    border: '1px solid rgba(139, 30, 43, 0.08)',
    borderRadius: 8,
    boxShadow: '0 16px 32px rgba(139, 30, 43, 0.08)',
  },
  featureIcon: {
    width: 50,
    height: 50,
    margin: '0 auto 14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#b51f35',
    backgroundColor: '#fff0f2',
    borderRadius: '50%',
  },
  featureTitle: {
    margin: '0 0 8px',
    color: '#111827',
    fontSize: 14,
    fontWeight: 900,
  },
  featureDesc: {
    margin: 0,
    color: '#5f6673',
    fontSize: 12,
    lineHeight: 1.45,
    fontWeight: 500,
  },
  categorySection: {
    padding: '28px 7vw',
    background: 'linear-gradient(90deg, #fff4f6 0%, #fff 48%, #fff4f6 100%)',
  },
  categoryGrid: {
    maxWidth: 960,
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: 34,
  },
  categoryCard: {
    minHeight: 49,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 11,
    color: '#222733',
    backgroundColor: '#fff',
    border: '1px solid rgba(139, 30, 43, 0.1)',
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 800,
    cursor: 'pointer',
    boxShadow: '0 12px 25px rgba(139, 30, 43, 0.07)',
  },
  eventSection: {
    padding: '26px 7vw 54px',
    backgroundColor: '#fff',
  },
  eventHeader: {
    position: 'relative',
    maxWidth: 1040,
    margin: '0 auto 22px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 18,
    flexWrap: 'wrap',
  },
  viewAllButton: {
    minHeight: 38,
    padding: '0 16px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    color: '#b51f35',
    backgroundColor: '#fff7f8',
    border: '1px solid rgba(181, 31, 53, 0.1)',
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 800,
    cursor: 'pointer',
  },
  eventGrid: {
    maxWidth: 900,
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: 26,
  },
  eventCard: {
    overflow: 'hidden',
    backgroundColor: '#fff',
    border: '1px solid rgba(139, 30, 43, 0.1)',
    borderRadius: 8,
    boxShadow: '0 16px 34px rgba(139, 30, 43, 0.1)',
  },
  eventRibbon: {
    minHeight: 26,
    padding: '7px 14px',
    color: '#fff',
    backgroundColor: '#b51f35',
    textAlign: 'center',
    fontSize: 10,
    lineHeight: 1.2,
    fontWeight: 900,
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  eventBody: {
    padding: 17,
  },
  eventTitle: {
    minHeight: 42,
    margin: '0 0 13px',
    color: '#111827',
    fontSize: 15,
    lineHeight: 1.35,
    fontWeight: 900,
  },
  eventMeta: {
    display: 'grid',
    gap: 8,
    marginBottom: 12,
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 7,
    color: '#5f6673',
    fontSize: 12,
    fontWeight: 600,
  },
  eventFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 14,
  },
  priceLabel: {
    display: 'block',
    color: '#8b95a5',
    fontSize: 11,
    fontWeight: 700,
  },
  priceText: {
    color: '#b51f35',
    fontSize: 14,
    fontWeight: 900,
  },
  quotaPill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '7px 10px',
    color: '#7b1d2b',
    backgroundColor: '#fff4f6',
    borderRadius: 999,
    fontSize: 11,
    fontWeight: 800,
  },
  cardButton: {
    width: '100%',
    minHeight: 37,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    color: '#fff',
    backgroundColor: '#b51f35',
    border: 0,
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 900,
    cursor: 'pointer',
  },
  loadingState: {
    maxWidth: 900,
    minHeight: 120,
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    color: '#8b1e2b',
    backgroundColor: '#fff7f8',
    border: '1px solid rgba(139, 30, 43, 0.1)',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 800,
  },
  emptyState: {
    maxWidth: 900,
    minHeight: 130,
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    color: '#8b1e2b',
    backgroundColor: '#fff7f8',
    border: '1px dashed rgba(139, 30, 43, 0.25)',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 800,
  },
  footer: {
    padding: '34px 24px',
    color: '#fff',
    textAlign: 'center',
    backgroundColor: '#2a1118',
  },
  footerBrand: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  footerText: {
    margin: '0 0 10px',
    color: '#f4c9d0',
    fontSize: 13,
  },
  copyright: {
    color: '#c9939c',
    fontSize: 12,
  },
};

export default LandingPage;
