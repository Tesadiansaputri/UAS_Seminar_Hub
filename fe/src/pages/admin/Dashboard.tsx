import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarDays, Users, Mic, LayoutGrid, TrendingUp, Clock } from 'lucide-react';
import api from '../../services/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalSeminar: 0,
    totalSpeaker: 0,
    totalPeserta: 0,
    totalKategori: 0,
  });
  const [recentSeminars, setRecentSeminars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [seminarRes, speakerRes, kategoriRes] = await Promise.all([
          api.get('/seminars'),
          api.get('/speakers'),
          api.get('/categories'),
        ]);

        setStats({
          totalSeminar: seminarRes.data.length,
          totalSpeaker: speakerRes.data.length,
          totalPeserta: 0,
          totalKategori: kategoriRes.data.length,
        });

        setRecentSeminars(seminarRes.data.slice(0, 4));
      } catch (err) {
        console.error('Gagal fetch dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const statCards = [
    { icon: <CalendarDays size={24} color="#8b1e2b" />, label: 'Total Seminar', value: stats.totalSeminar, desc: 'Total semua seminar' },
    { icon: <Mic size={24} color="#8b1e2b" />, label: 'Total Speaker', value: stats.totalSpeaker, desc: 'Total narasumber' },
    { icon: <Users size={24} color="#8b1e2b" />, label: 'Total Peserta', value: stats.totalPeserta, desc: 'Total pendaftaran' },
    { icon: <LayoutGrid size={24} color="#8b1e2b" />, label: 'Total Kategori', value: stats.totalKategori, desc: 'Kategori aktif' },
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '400px' }}>
        <div style={{ color: '#8b1e2b', fontSize: '16px' }}>Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', marginBottom: '4px' }}>
          Selamat Datang, Admin! 👋
        </h1>
        <p style={{ color: '#6b7280', fontSize: '14px' }}>
          Berikut ringkasan data SeminarKu hari ini.
        </p>
      </div>

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '20px', marginBottom: '32px'
      }}>
        {statCards.map((s, i) => (
          <div key={i} style={{
            backgroundColor: 'white', borderRadius: '10px',
            padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            borderLeft: '4px solid #8b1e2b'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '10px',
                backgroundColor: '#fdf2f3',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {s.icon}
              </div>
              <TrendingUp size={16} color="#22c55e" />
            </div>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#1f2937', marginBottom: '4px' }}>
              {s.value}
            </div>
            <div style={{ fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '2px' }}>
              {s.label}
            </div>
            <div style={{ fontSize: '12px', color: '#9ca3af' }}>{s.desc}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '20px' }}>
        <div style={{
          backgroundColor: 'white', borderRadius: '10px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflow: 'hidden'
        }}>
          <div style={{
            padding: '20px 24px', borderBottom: '1px solid #f3f4f6',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between'
          }}>
            <div style={{ fontWeight: 'bold', fontSize: '15px', color: '#1f2937', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CalendarDays size={18} color="#8b1e2b" /> Event Terbaru
            </div>
            <span
              onClick={() => navigate('/admin/event')}
              style={{ fontSize: '12px', color: '#8b1e2b', cursor: 'pointer', fontWeight: '600' }}>
              Lihat Semua →
            </span>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#fdf2f3' }}>
                {['Event', 'Kategori', 'Tanggal', 'Kuota', 'Harga'].map((h, i) => (
                  <th key={i} style={{
                    padding: '10px 16px', textAlign: 'left',
                    fontSize: '12px', color: '#6b7280', fontWeight: '600'
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentSeminars.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: '#9ca3af', fontSize: '14px' }}>
                    Belum ada seminar
                  </td>
                </tr>
              ) : (
                recentSeminars.map((s, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f9fafb' }}>
                    <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: '600', color: '#1f2937' }}>
                      {s.seminar_name}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        fontSize: '11px', backgroundColor: '#fdf2f3',
                        color: '#8b1e2b', padding: '2px 8px', borderRadius: '10px', fontWeight: '600'
                      }}>{s.category?.category_name || '-'}</span>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '12px', color: '#6b7280' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={12} /> {new Date(s.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', color: '#374151' }}>
                      {s.kuota_tersedia} orang
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', color: '#8b1e2b', fontWeight: '600' }}>
                      {Number(s.harga) === 0 ? 'Gratis' : `Rp ${Number(s.harga).toLocaleString('id-ID')}`}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div style={{
          backgroundColor: 'white', borderRadius: '10px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflow: 'hidden'
        }}>
          <div style={{
            padding: '20px 24px', borderBottom: '1px solid #f3f4f6',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between'
          }}>
            <div style={{ fontWeight: 'bold', fontSize: '15px', color: '#1f2937', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={18} color="#8b1e2b" /> Informasi
            </div>
          </div>
          <div style={{ padding: '24px', color: '#6b7280', fontSize: '14px', lineHeight: 1.7 }}>
            Data pendaftaran saat ini belum tersedia pada API backend, sehingga ringkasan peserta ditampilkan kosong.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;