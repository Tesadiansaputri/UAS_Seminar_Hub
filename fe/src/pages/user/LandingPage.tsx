import { useNavigate } from 'react-router-dom';
import {
  Monitor, Briefcase, Palette, GraduationCap,
  Target, FileText, ScrollText,
  CalendarDays, Users, Mic, LayoutGrid,
  ArrowRight, Star
} from 'lucide-react';

const categories = [
  { icon: <Monitor size={24} color="#8b1e2b" />, name: 'Teknologi' },
  { icon: <Briefcase size={24} color="#8b1e2b" />, name: 'Bisnis & Wirausaha' },
  { icon: <Palette size={24} color="#8b1e2b" />, name: 'Kreatif & Desain' },
  { icon: <GraduationCap size={24} color="#8b1e2b" />, name: 'Pendidikan' },
];

const features = [
  { icon: <Target size={36} color="#8b1e2b" />, title: 'Pilih Kategori', desc: 'Temukan seminar & workshop sesuai minatmu dari berbagai kategori.' },
  { icon: <FileText size={36} color="#8b1e2b" />, title: 'Daftar Mudah', desc: 'Proses pendaftaran cepat dan mudah hanya dalam beberapa klik.' },
  { icon: <Mic size={36} color="#8b1e2b" />, title: 'Speaker Terbaik', desc: 'Narasumber dipilih menggunakan sistem rekomendasi SAW terbaik.' },
  { icon: <ScrollText size={36} color="#8b1e2b" />, title: 'Dapat Sertifikat', desc: 'Dapatkan sertifikat resmi setelah mengikuti event.' },
];

const events = [
  { title: 'Workshop Web Development', category: 'Teknologi', date: '20 Juni 2026', price: 'Rp 150.000', slots: 30 },
  { title: 'Seminar Digital Marketing', category: 'Bisnis & Wirausaha', date: '25 Juni 2026', price: 'Gratis', slots: 50 },
  { title: 'Workshop UI/UX Design', category: 'Kreatif & Desain', date: '28 Juni 2026', price: 'Rp 100.000', slots: 20 },
];

const stats = [
  { icon: <LayoutGrid size={20} color="white" />, num: '200+', label: 'Event' },
  { icon: <Mic size={20} color="white" />, num: '50+', label: 'Speaker' },
  { icon: <Users size={20} color="white" />, num: '5000+', label: 'Peserta' },
  { icon: <Star size={20} color="white" />, num: '4', label: 'Kategori' },
];

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily: 'sans-serif', color: '#374151' }}>

      {/* NAVBAR */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        backgroundColor: 'white', boxShadow: '0 2px 10px rgba(139,30,43,0.1)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 48px'
      }}>
        <div style={{ fontWeight: 'bold', fontSize: '20px', color: '#8b1e2b', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CalendarDays size={24} color="#8b1e2b" />
          SeminarKu
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          <button
            onClick={() => navigate('/login')}
            style={{
              padding: '8px 24px', border: '2px solid #8b1e2b',
              backgroundColor: 'white', color: '#8b1e2b',
              fontWeight: 'bold', cursor: 'pointer', borderRadius: '4px',
              fontSize: '13px', letterSpacing: '1px'
            }}>LOGIN</button>
          <button
            onClick={() => navigate('/register')}
            style={{
              padding: '8px 24px', border: '2px solid #8b1e2b',
              backgroundColor: '#8b1e2b', color: 'white',
              fontWeight: 'bold', cursor: 'pointer', borderRadius: '4px',
              fontSize: '13px', letterSpacing: '1px'
            }}>REGISTER</button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{
        marginTop: '64px',
        background: 'linear-gradient(135deg, #8b1e2b 0%, #b5293a 50%, #d4506a 100%)',
        padding: '100px 48px',
        textAlign: 'center',
        color: 'white'
      }}>
        <div style={{
          display: 'inline-block', backgroundColor: 'rgba(255,255,255,0.15)',
          padding: '6px 20px', borderRadius: '20px',
          fontSize: '12px', marginBottom: '24px', letterSpacing: '3px'
        }}>
          PLATFORM SEMINAR & WORKSHOP #1
        </div>
        <h1 style={{ fontSize: '48px', fontWeight: 'bold', margin: '0 0 20px', lineHeight: 1.2 }}>
          Tingkatkan Skillmu<br />Bersama Para Ahli
        </h1>
        <p style={{ fontSize: '17px', opacity: 0.9, maxWidth: '500px', margin: '0 auto 40px', lineHeight: 1.7 }}>
          Temukan ratusan seminar & workshop berkualitas dengan narasumber terpilih melalui sistem rekomendasi cerdas.
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <button
            onClick={() => navigate('/register')}
            style={{
              padding: '14px 36px', backgroundColor: 'white',
              color: '#8b1e2b', fontWeight: 'bold', border: 'none',
              cursor: 'pointer', borderRadius: '4px', fontSize: '14px',
              letterSpacing: '2px', display: 'flex', alignItems: 'center', gap: '8px'
            }}>
            MULAI SEKARANG <ArrowRight size={16} color="#8b1e2b" />
          </button>
          <button
            onClick={() => navigate('/login')}
            style={{
              padding: '14px 36px', backgroundColor: 'transparent',
              color: 'white', fontWeight: 'bold',
              border: '2px solid white', cursor: 'pointer',
              borderRadius: '4px', fontSize: '14px', letterSpacing: '2px'
            }}>LIHAT EVENT</button>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '48px', marginTop: '60px' }}>
          {stats.map((s, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '6px' }}>{s.icon}</div>
              <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{s.num}</div>
              <div style={{ fontSize: '12px', opacity: 0.8, letterSpacing: '1px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FITUR */}
      <section style={{ padding: '80px 48px', backgroundColor: 'white' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '12px' }}>
            Kenapa <span style={{ color: '#8b1e2b' }}>SeminarKu?</span>
          </h2>
          <p style={{ color: '#6b7280', fontSize: '15px' }}>
            Platform terbaik untuk mengembangkan diri bersama para profesional
          </p>
        </div>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '24px', maxWidth: '1000px', margin: '0 auto'
        }}>
          {features.map((f, i) => (
            <div key={i} style={{
              textAlign: 'center', padding: '32px 20px',
              borderRadius: '8px', border: '1px solid #f3f4f6',
              boxShadow: '0 2px 10px rgba(139,30,43,0.07)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>{f.icon}</div>
              <div style={{ fontWeight: 'bold', fontSize: '15px', marginBottom: '8px' }}>{f.title}</div>
              <div style={{ color: '#6b7280', fontSize: '13px', lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* KATEGORI */}
      <section style={{ padding: '80px 48px', backgroundColor: '#fdf2f3' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '12px' }}>
            Jelajahi <span style={{ color: '#8b1e2b' }}>Kategori</span>
          </h2>
          <p style={{ color: '#6b7280', fontSize: '15px' }}>
            Pilih topik yang paling sesuai dengan minat dan kebutuhanmu
          </p>
        </div>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '20px', maxWidth: '600px', margin: '0 auto'
        }}>
          {categories.map((c, i) => (
            <div key={i}
              style={{
                display: 'flex', alignItems: 'center', gap: '16px',
                padding: '20px 24px', backgroundColor: 'white',
                borderRadius: '8px', cursor: 'pointer',
                boxShadow: '0 2px 10px rgba(139,30,43,0.07)',
                border: '2px solid transparent',
                transition: 'border 0.2s'
              }}
              onMouseEnter={e => (e.currentTarget.style.border = '2px solid #8b1e2b')}
              onMouseLeave={e => (e.currentTarget.style.border = '2px solid transparent')}
            >
              {c.icon}
              <span style={{ fontWeight: '600', fontSize: '14px' }}>{c.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* EVENT TERBARU */}
      <section style={{ padding: '80px 48px', backgroundColor: 'white' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '12px' }}>
            Event <span style={{ color: '#8b1e2b' }}>Terbaru</span>
          </h2>
          <p style={{ color: '#6b7280', fontSize: '15px' }}>
            Jangan sampai ketinggalan event menarik berikut ini
          </p>
        </div>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '24px', maxWidth: '1000px', margin: '0 auto'
        }}>
          {events.map((e, i) => (
            <div key={i} style={{
              borderRadius: '8px', overflow: 'hidden',
              boxShadow: '0 4px 15px rgba(139,30,43,0.1)',
              border: '1px solid #f3f4f6'
            }}>
              <div style={{
                backgroundColor: '#8b1e2b', padding: '28px',
                color: 'white', textAlign: 'center'
              }}>
                <div style={{ fontSize: '11px', letterSpacing: '2px', opacity: 0.7, marginBottom: '8px' }}>
                  {e.category.toUpperCase()}
                </div>
                <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{e.title}</div>
              </div>
              <div style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ color: '#6b7280', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CalendarDays size={14} /> {e.date}
                  </span>
                  <span style={{ color: '#6b7280', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Users size={14} /> {e.slots} slot
                  </span>
                </div>
                <div style={{ fontWeight: 'bold', color: '#8b1e2b', fontSize: '18px', margin: '12px 0' }}>
                  {e.price}
                </div>
                <button
                  onClick={() => navigate('/login')}
                  style={{
                    width: '100%', padding: '10px',
                    backgroundColor: '#8b1e2b', color: 'white',
                    border: 'none', cursor: 'pointer', borderRadius: '4px',
                    fontWeight: 'bold', fontSize: '13px', letterSpacing: '1px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                  }}>
                  DAFTAR SEKARANG <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        backgroundColor: '#1f2937', color: 'white',
        padding: '48px', textAlign: 'center'
      }}>
        <div style={{
          fontSize: '22px', fontWeight: 'bold', color: '#d4506a',
          marginBottom: '12px', display: 'flex', alignItems: 'center',
          justifyContent: 'center', gap: '8px'
        }}>
          <CalendarDays size={22} color="#d4506a" /> SeminarKu
        </div>
        <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '16px' }}>
          Platform seminar & workshop terbaik untuk pengembangan diri
        </p>
        <div style={{ color: '#6b7280', fontSize: '13px' }}>
          © 2026 SeminarKu. All rights reserved.
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;