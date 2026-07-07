import { useEffect, useState } from 'react';
import { BarChart2, Trophy, Star, Pencil, Check, X } from 'lucide-react';
import api from '../../services/api';

const bobot = {
  pengalaman: 0.30,
  rating: 0.25,
  relevansi: 0.25,
  honor: 0.20,
};

const hitungSAW = (speakers: any[]) => {
  const maxPengalaman = Math.max(...speakers.map(s => s.pengalaman));
  const maxRating = Math.max(...speakers.map(s => s.rating));
  const maxRelevansi = Math.max(...speakers.map(s => s.relevansi));
  const minHonor = Math.min(...speakers.map(s => Number(s.honor)));

  return speakers.map(s => {
    const normPengalaman = s.pengalaman / maxPengalaman;
    const normRating = s.rating / maxRating;
    const normRelevansi = s.relevansi / maxRelevansi;
    const normHonor = minHonor / Number(s.honor);

    const nilaiSAW =
      normPengalaman * bobot.pengalaman +
      normRating * bobot.rating +
      normRelevansi * bobot.relevansi +
      normHonor * bobot.honor;

    return {
      ...s,
      normPengalaman: normPengalaman.toFixed(4),
      normRating: normRating.toFixed(4),
      normRelevansi: normRelevansi.toFixed(4),
      normHonor: normHonor.toFixed(4),
      nilaiSAW: nilaiSAW.toFixed(4),
    };
  }).sort((a, b) => parseFloat(b.nilaiSAW) - parseFloat(a.nilaiSAW))
    .map((s, i) => ({ ...s, ranking: i + 1 }));
};

const SpkSaw = () => {
  const [speakers, setSpeakers] = useState<any[]>([]);
  const [hasil, setHasil] = useState<any[]>([]);
  const [sudahHitung, setSudahHitung] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);

  const fetchSpeakers = async () => {
    try {
      const res = await api.get('/speakers');
      // Tambah field relevansi dari spkNilai kalau ada
      const data = res.data.map((sp: any) => ({
        ...sp,
        relevansi: sp.spkNilai?.relevansi ?? 5,
      }));
      setSpeakers(data);
    } catch (err) {
      console.error('Gagal fetch speaker:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpeakers();
  }, []);

  const handleHitung = () => {
    if (speakers.length === 0) return;
    const result = hitungSAW(speakers);
    setHasil(result);
    setSudahHitung(true);
  };

  const openEdit = (sp: any) => {
    setEditId(sp.id);
    setEditForm({
      pengalaman: sp.pengalaman,
      rating: sp.rating,
      relevansi: sp.relevansi,
      honor: Number(sp.honor),
    });
  };

  const handleSaveEdit = async () => {
    setSaveLoading(true);
    try {
      // Update speaker
      await api.put(`/speakers/${editId}`, {
        nama: speakers.find(s => s.id === editId)?.nama,
        keahlian: speakers.find(s => s.id === editId)?.keahlian,
        bio: speakers.find(s => s.id === editId)?.bio,
        pengalaman: Number(editForm.pengalaman),
        rating: Number(editForm.rating),
        honor: Number(editForm.honor),
      });

      // Simpan relevansi ke spkNilai
      await api.post('/spk', {
        speakerId: editId,
        pengalaman: Number(editForm.pengalaman),
        rating: Number(editForm.rating),
        relevansi: Number(editForm.relevansi),
        honor: Number(editForm.honor),
      });

      await fetchSpeakers();
      setEditId(null);
      setSudahHitung(false);
      setHasil([]);
    } catch (err) {
      console.error('Gagal simpan:', err);
    } finally {
      setSaveLoading(false);
    }
  };

  const medalColor = (rank: number) => {
    if (rank === 1) return '#f59e0b';
    if (rank === 2) return '#9ca3af';
    if (rank === 3) return '#b45309';
    return '#d1d5db';
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
            SPK - Metode SAW
          </h1>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>
            Sistem Pendukung Keputusan Pemilihan Speaker Terbaik
          </p>
        </div>
        <button
          onClick={handleHitung}
          disabled={speakers.length === 0}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            backgroundColor: '#8b1e2b', color: 'white',
            border: 'none', cursor: 'pointer', borderRadius: '8px',
            padding: '10px 24px', fontWeight: 'bold', fontSize: '13px'
          }}>
          <BarChart2 size={16} /> Hitung SAW
        </button>
      </div>

      {/* Info Bobot */}
      <div style={{
        backgroundColor: 'white', borderRadius: '10px',
        padding: '20px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        marginBottom: '24px'
      }}>
        <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#1f2937', marginBottom: '16px' }}>
          Bobot Kriteria
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          {[
            { label: 'Pengalaman', bobot: '30%', jenis: 'Benefit' },
            { label: 'Rating', bobot: '25%', jenis: 'Benefit' },
            { label: 'Relevansi Topik', bobot: '25%', jenis: 'Benefit' },
            { label: 'Honor', bobot: '20%', jenis: 'Cost' },
          ].map((k, i) => (
            <div key={i} style={{
              backgroundColor: '#fdf2f3', borderRadius: '8px',
              padding: '14px', textAlign: 'center'
            }}>
              <div style={{ fontWeight: 'bold', fontSize: '18px', color: '#8b1e2b' }}>{k.bobot}</div>
              <div style={{ fontSize: '13px', fontWeight: '600', color: '#374151', marginTop: '4px' }}>{k.label}</div>
              <div style={{
                fontSize: '11px', marginTop: '4px',
                color: k.jenis === 'Benefit' ? '#16a34a' : '#ef4444',
                fontWeight: '600'
              }}>{k.jenis}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabel Input Nilai */}
      <div style={{
        backgroundColor: 'white', borderRadius: '10px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        overflow: 'hidden', marginBottom: '24px'
      }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #f3f4f6', fontWeight: 'bold', fontSize: '14px', color: '#1f2937' }}>
          Input Nilai Kriteria Speaker
        </div>
        {speakers.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#9ca3af', fontSize: '14px' }}>
            Belum ada data speaker
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#fdf2f3' }}>
                {['Speaker', 'Keahlian', 'Pengalaman (thn)', 'Rating (1-10)', 'Relevansi (1-10)', 'Honor (Rp)', 'Aksi'].map((h, i) => (
                  <th key={i} style={{
                    padding: '12px 16px', textAlign: 'left',
                    fontSize: '12px', color: '#6b7280', fontWeight: '600'
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {speakers.map((sp) => (
                <tr key={sp.id} style={{ borderBottom: '1px solid #f9fafb' }}>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '32px', height: '32px', borderRadius: '50%',
                        backgroundColor: '#fdf2f3',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 'bold', fontSize: '13px', color: '#8b1e2b'
                      }}>
                        {sp.nama?.charAt(0)}
                      </div>
                      <span style={{ fontSize: '13px', fontWeight: '600', color: '#1f2937' }}>{sp.nama}</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      fontSize: '11px', backgroundColor: '#fdf2f3',
                      color: '#8b1e2b', padding: '2px 8px', borderRadius: '10px', fontWeight: '600'
                    }}>{sp.keahlian}</span>
                  </td>

                  {editId === sp.id ? (
                    <>
                      {['pengalaman', 'rating', 'relevansi', 'honor'].map(key => (
                        <td key={key} style={{ padding: '8px 16px' }}>
                          <input
                            type="number"
                            value={editForm[key]}
                            onChange={e => setEditForm({ ...editForm, [key]: e.target.value })}
                            style={{
                              width: '80px', padding: '6px 10px', borderRadius: '6px',
                              border: '1px solid #8b1e2b', fontSize: '13px', outline: 'none'
                            }}
                          />
                        </td>
                      ))}
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            onClick={handleSaveEdit}
                            disabled={saveLoading}
                            style={{
                              width: '32px', height: '32px', borderRadius: '8px',
                              backgroundColor: '#dcfce7', border: 'none', cursor: 'pointer',
                              display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                            <Check size={14} color="#16a34a" />
                          </button>
                          <button
                            onClick={() => setEditId(null)}
                            style={{
                              width: '32px', height: '32px', borderRadius: '8px',
                              backgroundColor: '#fef2f2', border: 'none', cursor: 'pointer',
                              display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                            <X size={14} color="#ef4444" />
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td style={{ padding: '14px 16px', fontSize: '13px', color: '#374151' }}>{sp.pengalaman}</td>
                      <td style={{ padding: '14px 16px', fontSize: '13px', color: '#374151' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Star size={12} color="#f59e0b" fill="#f59e0b" /> {sp.rating}
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: '13px', color: '#374151' }}>{sp.relevansi}</td>
                      <td style={{ padding: '14px 16px', fontSize: '13px', color: '#374151' }}>
                        Rp {Number(sp.honor).toLocaleString('id-ID')}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <button
                          onClick={() => openEdit(sp)}
                          style={{
                            width: '32px', height: '32px', borderRadius: '8px',
                            backgroundColor: '#eff6ff', border: 'none', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                          }}>
                          <Pencil size={14} color="#3b82f6" />
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Hasil Ranking */}
      {sudahHitung && (
        <div style={{
          backgroundColor: 'white', borderRadius: '10px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflow: 'hidden'
        }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Trophy size={18} color="#f59e0b" />
            <span style={{ fontWeight: 'bold', fontSize: '14px', color: '#1f2937' }}>Hasil Ranking SAW</span>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#fdf2f3' }}>
                {['Ranking', 'Speaker', 'Norm. Pengalaman', 'Norm. Rating', 'Norm. Relevansi', 'Norm. Honor', 'Nilai SAW'].map((h, i) => (
                  <th key={i} style={{
                    padding: '12px 16px', textAlign: 'left',
                    fontSize: '12px', color: '#6b7280', fontWeight: '600'
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {hasil.map((h) => (
                <tr key={h.id} style={{
                  borderBottom: '1px solid #f9fafb',
                  backgroundColor: h.ranking === 1 ? '#fffbeb' : 'white'
                }}>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{
                      width: '32px', height: '32px', borderRadius: '50%',
                      backgroundColor: medalColor(h.ranking),
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 'bold', fontSize: '14px', color: 'white'
                    }}>
                      {h.ranking}
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#1f2937' }}>{h.nama}</div>
                    <div style={{ fontSize: '11px', color: '#9ca3af' }}>{h.keahlian}</div>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: '#374151' }}>{h.normPengalaman}</td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: '#374151' }}>{h.normRating}</td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: '#374151' }}>{h.normRelevansi}</td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: '#374151' }}>{h.normHonor}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      fontWeight: 'bold', fontSize: '15px',
                      color: h.ranking === 1 ? '#f59e0b' : '#8b1e2b'
                    }}>{h.nilaiSAW}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {hasil.length > 0 && (
            <div style={{
              margin: '0 24px 24px', padding: '16px 20px',
              backgroundColor: '#fffbeb', borderRadius: '10px',
              border: '1px solid #fde68a', display: 'flex', alignItems: 'center', gap: '12px'
            }}>
              <Trophy size={24} color="#f59e0b" />
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#1f2937' }}>
                  Rekomendasi Speaker Terbaik
                </div>
                <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '2px' }}>
                  <span style={{ fontWeight: 'bold', color: '#8b1e2b' }}>{hasil[0].nama}</span> dengan nilai SAW tertinggi <span style={{ fontWeight: 'bold', color: '#8b1e2b' }}>{hasil[0].nilaiSAW}</span> direkomendasikan sebagai speaker terbaik!
                </div>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default SpkSaw;