import { useEffect, useState } from 'react';
import { LayoutGrid, Plus, Pencil, Trash2, X, Check } from 'lucide-react';
import api from '../../services/api';

const CategoryList = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [form, setForm] = useState({
  category_name: "",
});
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch semua kategori
  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch (err) {
      console.error('Gagal fetch kategori:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openAdd = () => {
    setEditData(null);
    setForm({ category_name: '' });
    setShowModal(true);
  };

  const openEdit = (cat: any) => {
    setEditData(cat);
    setForm({ category_name: cat.category_name });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.category_name.trim()) return;
    try {
      if (editData) {
        await api.put(`/categories/${editData.id}`, form);
      } else {
        await api.post('/categories', form);
      }
      await fetchCategories();
      setShowModal(false);
    } catch (err) {
      console.error('Gagal simpan kategori:', err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/categories/${id}`);
      await fetchCategories();
      setDeleteId(null);
    } catch (err) {
      console.error('Gagal hapus kategori:', err);
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
            Manajemen Kategori
          </h1>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>
            Kelola kategori seminar & workshop
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
          <Plus size={16} /> Tambah Kategori
        </button>
      </div>

      {/* Cards */}
      {categories.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#9ca3af', fontSize: '14px' }}>
          Belum ada kategori. Tambah kategori baru!
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
          {categories.map((cat) => (
  <div
    key={cat.id}
    style={{
      backgroundColor: "white",
      borderRadius: "10px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      padding: "24px",
      borderLeft: "4px solid #8b1e2b",
    }}
  >
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "14px",
        }}
      >
        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "10px",
            backgroundColor: "#fdf2f3",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <LayoutGrid size={22} color="#8b1e2b" />
        </div>

        <div>
          <div
            style={{
              fontSize: "17px",
              fontWeight: "bold",
              color: "#1f2937",
            }}
          >
            {cat.category_name}
          </div>

          <div
            style={{
              marginTop: "6px",
              display: "inline-block",
              background: "#fdf2f3",
              color: "#8b1e2b",
              padding: "4px 10px",
              borderRadius: "20px",
              fontSize: "12px",
              fontWeight: 600,
            }}
          >
            {cat._count?.seminars || 0} Seminar
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: "8px" }}>
        <button
          onClick={() => openEdit(cat)}
          style={{
            width: "34px",
            height: "34px",
            border: "none",
            borderRadius: "8px",
            background: "#eef5ff",
            cursor: "pointer",
          }}
        >
          <Pencil size={16} color="#2563eb" />
        </button>

        <button
          onClick={() => setDeleteId(cat.id)}
          style={{
            width: "34px",
            height: "34px",
            border: "none",
            borderRadius: "8px",
            background: "#fff1f2",
            cursor: "pointer",
          }}
        >
          <Trash2 size={16} color="#ef4444" />
        </button>
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
            padding: '32px', width: '100%', maxWidth: '440px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937' }}>
                {editData ? 'Edit Kategori' : 'Tambah Kategori'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} color="#6b7280" />
              </button>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>
                Nama Kategori
              </label>
              <input
                value={form.category_name}
                onChange={e => setForm({ ...form, category_name: e.target.value })}
                placeholder="contoh: Teknologi"
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: '8px',
                  border: '1px solid #d1d5db', fontSize: '14px', outline: 'none',
                  boxSizing: 'border-box'
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
              Hapus Kategori?
            </h2>
            <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '24px' }}>
              Data kategori ini akan dihapus permanen dan tidak bisa dikembalikan.
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

export default CategoryList;