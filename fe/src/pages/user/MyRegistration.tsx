import { ScrollText } from 'lucide-react';

const MyRegistration = () => {
  const registrations: any[] = [];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1f2937', marginBottom: '4px' }}>
            Pendaftaran Saya
          </h1>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>
            Daftar event yang telah kamu ikuti
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'Total Pendaftaran', value: registrations.length, color: '#8b1e2b', bg: '#fdf2f3', icon: <ScrollText size={20} color="#8b1e2b" /> },
          { label: 'Aktif', value: 0, color: '#16a34a', bg: '#dcfce7', icon: <ScrollText size={20} color="#16a34a" /> },
          { label: 'Batal', value: 0, color: '#ef4444', bg: '#fef2f2', icon: <ScrollText size={20} color="#ef4444" /> },
        ].map((s, i) => (
          <div key={i} style={{
            backgroundColor: 'white', borderRadius: '10px',
            padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            display: 'flex', alignItems: 'center', gap: '16px',
            borderLeft: `4px solid ${s.color}`
          }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '10px',
              backgroundColor: s.bg,
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              {s.icon}
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>{s.value}</div>
              <div style={{ fontSize: '13px', color: '#6b7280' }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{
        textAlign: 'center', padding: '60px', color: '#9ca3af',
        fontSize: '14px', backgroundColor: 'white', borderRadius: '10px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
      }}>
        Belum ada pendaftaran pada backend saat ini.
      </div>
    </div>
  );
};

export default MyRegistration;
