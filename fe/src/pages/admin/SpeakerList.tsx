import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Check, Star } from 'lucide-react';
import api from '../../services/api';

const emptyForm = {
  nama: '', keahlian: '', pengalaman: '', rating: '', honor: '', bio: ''
};

const SpeakerList = () => {
  const [speakers, setSpeakers] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [form, setForm] = useState<any>(emptyForm);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSpeakers = async () => {
    try {
      const res = await api.get('/speakers');
      setSpeakers(res.data);
    } catch (err) {
      console.error('Gagal fetch speaker:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpeakers();
  }, []);

  const openAdd = () => {
    setEditData(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (speaker: any) => {
    setEditData(speaker);
    setForm({
      nama: speaker.nama,
      keahlian: speaker.keahlian,
      pengalaman: speaker.pengalaman,
      rating: speaker.rating,
      honor: speaker.honor,
      bio: speaker.bio,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.nama.trim()) return;
    try {
      if (editData) {
        await api.put(`/speakers/${editData.id}`, {
          ...form,
          pengalaman: Number(form.pengalaman),
          rating: Number(form.rating),
          honor: Number(form.honor),
        });
      } else {
        await api.post('/speakers', {
          ...form,
          pengalaman: Number(form.pengalaman),
          rating: Number(form.rating),
          honor: Number(form.honor),
        });
      }
      await fetchSpeakers();
      setShowModal(false);
    } catch (err) {
      console.error('Gagal simpan speaker:', err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/speakers/${id}`);
      await fetchSpeakers();
      setDeleteId(null);
    } catch (err) {
      console.error('Gagal hapus speaker:', err);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '400px' }}>
        <div style={{ color: '#8b1e2b', fontSize: '16px' }}>Loading...</div>
      </div>
    );
  }

  return (
    <div>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1f2937', marginBottom: '4px' }}>
            Manajemen Speaker
          </h1>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>
            Kelola data narasumber seminar & workshop
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
          <Plus size={16} /> Tambah Speaker
        </button>
      </div>

      {/* Cards */}
      {speakers.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#9ca3af', fontSize: '14px' }}>
          Belum ada speaker. Tambah speaker baru!
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
          {speakers.map((sp) => (
            <div key={sp.id} style={{
              backgroundColor: 'white', borderRadius: '10px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)', padding: '24px',
              borderLeft: '4px solid #8b1e2b'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '50%',
                    backgroundColor: '#fdf2f3', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 'bold', fontSize: '18px', color: '#8b1e2b'
                  }}>
                    {sp.nama?.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '15px', color: '#1f2937' }}>{sp.nama}</div>
                    <div style={{
                      fontSize: '11px', backgroundColor: '#fdf2f3',
                      color: '#8b1e2b', padding: '2px 8px', borderRadius: '10px',
                      fontWeight: '600', display: 'inline-block', marginTop: '4px'
                    }}>
                      {sp.keahlian}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => openEdit(sp)}
                    style={{
                      width: '32px', height: '32px', borderRadius: '8px',
                      backgroundColor: '#eff6ff', border: 'none', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                    <Pencil size={14} color="#3b82f6" />
                  </button>
                  <button
                    onClick={() => setDeleteId(sp.id)}
                    style={{
                      width: '32px', height: '32px', borderRadius: '8px',
                      backgroundColor: '#fef2f2', border: 'none', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                    <Trash2 size={14} color="#ef4444" />
                  </button>
                </div>
              </div>

              <p style={{ color: '#6b7280', fontSize: '13px', marginTop: '12px', lineHeight: 1.6 }}>
                {sp.bio}
              </p>

              {/* Stats */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <div style={{
                  flex: 1, backgroundColor: '#f9fafb', borderRadius: '8px',
                  padding: '10px', textAlign: 'center'
                }}>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937' }}>{sp.pengalaman} thn</div>
                  <div style={{ fontSize: '11px', color: '#9ca3af' }}>Pengalaman</div>
                </div>
                <div style={{
                  flex: 1, backgroundColor: '#f9fafb', borderRadius: '8px',
                  padding: '10px', textAlign: 'center'
                }}>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                    <Star size={14} color="#f59e0b" fill="#f59e0b" /> {sp.rating}
                  </div>
                  <div style={{ fontSize: '11px', color: '#9ca3af' }}>Rating</div>
                </div>
                <div style={{
                  flex: 1, backgroundColor: '#f9fafb', borderRadius: '8px',
                  padding: '10px', textAlign: 'center'
                }}>
                  <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#1f2937' }}>
                    Rp {Number(sp.honor).toLocaleString('id-ID')}
                  </div>
                  <div style={{ fontSize: '11px', color: '#9ca3af' }}>Honor</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Tambah/Edit */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
        }}>
          <div style={{
            backgroundColor: 'white', borderRadius: '12px',
            padding: '32px', width: '100%', maxWidth: '500px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
            maxHeight: '90vh', overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937' }}>
                {editData ? 'Edit Speaker' : 'Tambah Speaker'}
              </h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} color="#6b7280" />
              </button>
            </div>

            {[
              { label: 'Nama Lengkap', key: 'nama', type: 'text', placeholder: 'contoh: Dr. Budi Santoso' },
              { label: 'Keahlian', key: 'keahlian', type: 'text', placeholder: 'contoh: Web Development' },
              { label: 'Pengalaman (tahun)', key: 'pengalaman', type: 'number', placeholder: 'contoh: 10' },
              { label: 'Rating (1-10)', key: 'rating', type: 'number', placeholder: 'contoh: 8.5' },
              { label: 'Honor (Rp)', key: 'honor', type: 'number', placeholder: 'contoh: 2000000' },
            ].map((field) => (
              <div key={field.key} style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>
                  {field.label}
                </label>
                <input
                  type={field.type}
                  value={form[field.key]}
                  onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                  placeholder={field.placeholder}
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: '8px',
                    border: '1px solid #d1d5db', fontSize: '14px', outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            ))}

            <div style={{ marginBottom: '24px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>
                Bio
              </label>
              <textarea
                value={form.bio}
                onChange={e => setForm({ ...form, bio: e.target.value })}
                placeholder="Deskripsi singkat tentang speaker..."
                rows={3}
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: '8px',
                  border: '1px solid #d1d5db', fontSize: '14px', outline: 'none',
                  resize: 'none', boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
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

      {/* Modal Konfirmasi Delete */}
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
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>
              Hapus Speaker?
            </h2>
            <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '24px' }}>
              Data speaker ini akan dihapus permanen dan tidak bisa dikembalikan.
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

export default SpeakerList;