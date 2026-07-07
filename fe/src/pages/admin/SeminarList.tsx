
import { useState, useEffect } from 'react';
import { CalendarDays, Plus, Pencil, Trash2, X, Check, Clock, Users } from 'lucide-react';
import api from '../../services/api';

const emptyForm = {
  title: '',
  category: '',
  speaker: '',
  date: '',
  time: '',
  location: '',
  kuota: '',
  harga: '',
  status: 'Draft'
};


const EventList = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [speakers, setSpeakers] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [form, setForm] = useState<any>(emptyForm);
  const [deleteId, setDeleteId] = useState<number | null>(null);


  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('Semua');
  // 🔥 FETCH DATA DARI DB
  const fetchEvents = async () => {
    try {
      const res = await api.get('/events');
      // Transform backend response ke format yang frontend pakai
      const transformed = res.data.map((e: any) => ({
        id: e.id,
        title: e.nama,
        category: e.category?.nama || 'N/A',
        categoryId: e.categoryId,
        speaker: e.speaker?.nama || 'N/A',
        speakerId: e.speakerId,
        date: new Date(e.tanggal).toLocaleDateString('id-ID'),
        tanggal: e.tanggal,
        time: e.time,
        location: e.location,
        kuota: e.kuota,
        peserta: e._count?.registrations || 0,
        harga: Number(e.harga) || 0,
        status: e.status,
        createdAt: e.createdAt,
        updatedAt: e.updatedAt
      }));
      setEvents(transformed);
    } catch (err) {
      console.error('Gagal fetch events:', err);
    }
  };

  const fetchCategories = async () => {
  try {
    const res = await api.get('/categories');
    setCategories(res.data);
  } catch (err) {
    console.error('Gagal fetch category:', err);
  }
};

const fetchSpeakers = async () => {
  try {
    const res = await api.get('/speakers');
    setSpeakers(res.data);
  } catch (err) {
    console.error('Gagal fetch speaker:', err);
  }
};

  useEffect(() => {
    fetchEvents();
    fetchCategories();
    fetchSpeakers();
  }, []);

  // 🔥 OPEN MODAL TAMBAH
  const openAdd = () => {
    setEditData(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  // 🔥 OPEN MODAL EDIT
  const openEdit = (event: any) => {
  setEditData(event);
  setForm({
    ...event,
    category: event.categoryId,
    speaker: event.speakerId
  });
  setShowModal(true);
};

  // 🔥 SAVE KE DATABASE (NO DUMMY)
  const handleSave = async () => {
  try {
    if (!form.title.trim()) return;

    const payload = {
      nama: form.title, // ✅ FIX
      categoryId: Number(form.category),
      speakerId: Number(form.speaker),
      tanggal: new Date(form.date), // ✅ FIX (DateTime)
      time: form.time,
      location: form.location,
      kuota: Number(form.kuota),
      harga: Number(form.harga),
      status: form.status
    };

    if (editData) {
      await api.put(`/events/${editData.id}`, payload);
    } else {
      await api.post('/events', payload);
    }

    await fetchEvents();
    setShowModal(false);

  } catch (err: any) {
    console.error("ERROR:", err.response?.data || err.message);
  }
};
  // 🔥 DELETE KE DATABASE
  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/events/${id}`);
      await fetchEvents();
      setDeleteId(null);
    } catch (err) {
      console.error('Gagal delete:', err);
    }
  };

  // 🔥 FILTER
  const filtered = events.filter((e) => {
    const matchSearch = e.title?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'Semua' || e.status === filterStatus;
    return matchSearch && matchStatus;
  }).sort((a, b) => {
    // Sort by date descending (newest first)
    return new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime();
  });



  return (
    <div>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1f2937', marginBottom: '4px' }}>
            Manajemen Event
          </h1>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>
            Kelola seminar & workshop
          </p>
        </div>
        <button
          onClick={openAdd}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            backgroundColor: '#8b1e2b', color: 'white',
            border: 'none', cursor: 'pointer', borderRadius: '8px',
            padding: '10px 20px', fontWeight: 'bold', fontSize: '13px'
          }}>
          <Plus size={16} /> Tambah Event
        </button>
      </div>

      {/* Filter & Search */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Cari event..."
          style={{
            flex: 1, padding: '10px 14px', borderRadius: '8px',
            border: '1px solid #d1d5db', fontSize: '14px', outline: 'none'
          }}
        />
        {['Semua', 'Aktif', 'Draft'].map(s => (
          <button key={s}
            onClick={() => setFilterStatus(s)}
            style={{
              padding: '10px 20px', borderRadius: '8px', fontSize: '13px',
              fontWeight: '600', cursor: 'pointer', border: 'none',
              backgroundColor: filterStatus === s ? '#8b1e2b' : '#f3f4f6',
              color: filterStatus === s ? 'white' : '#6b7280'
            }}>{s}</button>
        ))}
      </div>

      {/* Table */}
      <div style={{
        backgroundColor: 'white', borderRadius: '10px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflow: 'hidden'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#fdf2f3' }}>
              {['Event', 'Kategori', 'Speaker', 'Tanggal & Waktu', 'Kuota', 'Harga', 'Status', 'Aksi'].map((h, i) => (
                <th key={i} style={{
                  padding: '12px 16px', textAlign: 'left',
                  fontSize: '12px', color: '#6b7280', fontWeight: '600'
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((e) => (
              <tr key={e.id} style={{ borderBottom: '1px solid #f9fafb' }}>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: '#1f2937' }}>{e.title}</div>
                  <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Users size={10} /> {e.peserta}/{e.kuota} peserta
                  </div>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{
                    fontSize: '11px', backgroundColor: '#fdf2f3',
                    color: '#8b1e2b', padding: '2px 8px', borderRadius: '10px', fontWeight: '600'
                  }}>{e.category}</span>
                </td>
                <td style={{ padding: '14px 16px', fontSize: '13px', color: '#374151' }}>{e.speaker}</td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ fontSize: '13px', color: '#374151', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CalendarDays size={12} color="#8b1e2b" /> {e.date}
                  </div>
                  <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={10} /> {e.time}
                  </div>
                </td>
                <td style={{ padding: '14px 16px', fontSize: '13px', color: '#374151' }}>{e.kuota} orang</td>
                <td style={{ padding: '14px 16px', fontSize: '13px', fontWeight: '600', color: '#8b1e2b' }}>
                  {e.harga === 0 ? 'Gratis' : `Rp ${e.harga.toLocaleString('id-ID')}`}
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{
                    fontSize: '11px', fontWeight: '600',
                    padding: '2px 10px', borderRadius: '10px',
                    backgroundColor: e.status === 'Aktif' ? '#dcfce7' : '#f3f4f6',
                    color: e.status === 'Aktif' ? '#16a34a' : '#9ca3af'
                  }}>{e.status}</span>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => openEdit(e)}
                      style={{
                        width: '32px', height: '32px', borderRadius: '8px',
                        backgroundColor: '#eff6ff', border: 'none', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                      <Pencil size={14} color="#3b82f6" />
                    </button>
                    <button
                      onClick={() => setDeleteId(e.id)}
                      style={{
                        width: '32px', height: '32px', borderRadius: '8px',
                        backgroundColor: '#fef2f2', border: 'none', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                      <Trash2 size={14} color="#ef4444" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} style={{ padding: '40px', textAlign: 'center', color: '#9ca3af', fontSize: '14px' }}>
                  Tidak ada event ditemukan
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Tambah/Edit */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
        }}>
          <div style={{
            backgroundColor: 'white', borderRadius: '12px',
            padding: '32px', width: '100%', maxWidth: '540px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
            maxHeight: '90vh', overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937' }}>
                {editData ? 'Edit Event' : 'Tambah Event'}
              </h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} color="#6b7280" />
              </button>
            </div>

            {/* Form Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>Judul Event</label>
                <input
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  placeholder="contoh: Workshop Web Development"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>Kategori</label>
                <select
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}>
                  <option value="">Pilih Kategori</option>
                  {categories.map(c => (
  <option key={c.id} value={c.id}>
    {c.nama}
  </option>
))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>Speaker</label>
                <select
                  value={form.speaker}
                  onChange={e => setForm({ ...form, speaker: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}>
                  <option value="">Pilih Speaker</option>
                  {speakers.map(s => (
  <option key={s.id} value={s.id}>
    {s.nama}
  </option>
))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>Tanggal</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={e => setForm({ ...form, date: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>Waktu</label>
                <input
                  value={form.time}
                  onChange={e => setForm({ ...form, time: e.target.value })}
                  placeholder="contoh: 09.00 - 12.00"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>Lokasi</label>
                <input
                  value={form.location}
                  onChange={e => setForm({ ...form, location: e.target.value })}
                  placeholder="contoh: Aula Gedung A"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>Kuota</label>
                <input
                  type="number"
                  value={form.kuota}
                  onChange={e => setForm({ ...form, kuota: e.target.value })}
                  placeholder="contoh: 50"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>Harga (Rp)</label>
                <input
                  type="number"
                  value={form.harga}
                  onChange={e => setForm({ ...form, harga: e.target.value })}
                  placeholder="0 = Gratis"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>Status</label>
                <select
                  value={form.status}
                  onChange={e => setForm({ ...form, status: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}>
                  <option value="Draft">Draft</option>
                  <option value="Aktif">Aktif</option>
                </select>
              </div>

            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  flex: 1, padding: '10px', borderRadius: '8px',
                  border: '1px solid #d1d5db', backgroundColor: 'white',
                  cursor: 'pointer', fontWeight: '600', fontSize: '13px', color: '#374151'
                }}>
                Batal
              </button>
              <button
                onClick={handleSave}
                style={{
                  flex: 1, padding: '10px', borderRadius: '8px',
                  border: 'none', backgroundColor: '#8b1e2b',
                  cursor: 'pointer', fontWeight: '600', fontSize: '13px', color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                }}>
                <Check size={16} /> Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Delete */}
      {deleteId && (
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
        }}>
          <div style={{
            backgroundColor: 'white', borderRadius: '12px',
            padding: '32px', width: '100%', maxWidth: '380px',
            textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.15)'
          }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '50%',
              backgroundColor: '#fef2f2', margin: '0 auto 16px',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Trash2 size={24} color="#ef4444" />
            </div>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>Hapus Event?</h2>
            <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '24px' }}>
              Data event ini akan dihapus permanen dan tidak bisa dikembalikan.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setDeleteId(null)}
                style={{
                  flex: 1, padding: '10px', borderRadius: '8px',
                  border: '1px solid #d1d5db', backgroundColor: 'white',
                  cursor: 'pointer', fontWeight: '600', fontSize: '13px', color: '#374151'
                }}>
                Batal
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                style={{
                  flex: 1, padding: '10px', borderRadius: '8px',
                  border: 'none', backgroundColor: '#ef4444',
                  cursor: 'pointer', fontWeight: '600', fontSize: '13px', color: 'white'
                }}>
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default EventList;