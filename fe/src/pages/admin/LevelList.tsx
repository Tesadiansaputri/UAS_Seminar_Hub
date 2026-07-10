import {  useEffect, useState, type CSSProperties } from "react";
import api from '../../services/api';

interface Level {
  id: number;
  nama_level: string;
  nilai_level: number;
}

const emptyForm = {
  nama_level: "",
  nilai_level: "",
};

const LevelList = () => {
  const [levels, setLevels] = useState<Level[]>([]);
  const [filteredLevels, setFilteredLevels] = useState<Level[]>([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [editData, setEditData] = useState<Level | null>(null);

  const [form, setForm] = useState({
    nama_level: "",
    nilai_level: "",
  });
    useEffect(() => {
    getLevels();
  }, []);

  useEffect(() => {
    const result = levels.filter((item) =>
      item.nama_level
        .toLowerCase()
        .includes(search.toLowerCase())
    );

    setFilteredLevels(result);
  }, [search, levels]);

  const getLevels = async () => {
    try {
      const res = await api.get("/levels");
      setLevels(res.data);
      setFilteredLevels(res.data);
    } catch (err) {
      console.log("Gagal mengambil level:", err);
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setEditData(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (level: Level) => {
  setEditData(level);

  setForm({
    nama_level: level.nama_level,
    nilai_level: String(level.nilai_level),
  });

  setShowModal(true);
};

  const handleSave = async () => {
  try {
    const payload = {
      nama_level: form.nama_level,
      nilai_level: Number(form.nilai_level),
    };

    if (editData) {
      await api.put(`/levels/${editData.id}`, payload);
    } else {
      await api.post("/levels", payload);
    }

    setShowModal(false);
    setEditData(null);
    setForm(emptyForm);
    getLevels();
  } catch (err: any) {
    console.log(err.response?.data);
    console.log(err);
  }
};

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/levels/${id}`);

      getLevels();
      setDeleteId(null);
    } catch (err) {
      console.log("Gagal menghapus level:", err);
    }
  };

  const thStyle: CSSProperties = {
    padding: "12px",
    textAlign: "left",
    fontWeight: "600",
    color: "#374151",
    borderBottom: "1px solid #e5e7eb",
  };

  const tdStyle: CSSProperties = {
    padding: "12px",
    borderBottom: "1px solid #e5e7eb",
    color: "#1f2937",
  };

  const editButton: CSSProperties = {
    background: "#3b82f6",
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    marginRight: "8px",
    fontSize: "14px",
  };

  const deleteButton: CSSProperties = {
    background: "#ef4444",
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "14px",
  };

  return (
  <div style={{ padding: "30px" }}>

    {/* Header */}
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "25px",
      }}
    >
      <div>
        <h2 style={{ margin: 0 }}>
          Manajemen Level
        </h2>

        <p style={{ color: "#666" }}>
          Kelola data level seminar
        </p>
      </div>

      <button
        onClick={openAdd}
        style={{
          background: "#8b1e2b",
          color: "white",
          border: "none",
          padding: "10px 20px",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        Tambah Level
      </button>
    </div>

    {/* Search */}
    <input
      type="text"
      placeholder="Cari level..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      style={{
        width: "100%",
        padding: "12px",
        marginBottom: "20px",
        borderRadius: "8px",
        border: "1px solid #ccc",
      }}
    />

    {/* Table */}
    <div
      style={{
        background: "white",
        borderRadius: "10px",
        overflow: "hidden",
        boxShadow: "0 2px 8px rgba(0,0,0,.08)",
      }}
    >
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
      >
        <thead
          style={{
            background: "#f3f4f6",
          }}
        >
          <tr>
            <th style={thStyle}>No</th>
            <th style={thStyle}>Nama Level</th>
            <th style={thStyle}>Nilai Level</th>
            <th style={thStyle}>Aksi</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td
                colSpan={4}
                style={{
                  textAlign: "center",
                  padding: "20px",
                }}
              >
                Loading...
              </td>
            </tr>
          ) : filteredLevels.length === 0 ? (
            <tr>
              <td
                colSpan={4}
                style={{
                  textAlign: "center",
                  padding: "20px",
                }}
              >
                Data level tidak ditemukan
              </td>
            </tr>
          ) : (
            filteredLevels.map((item, index) => (
              <tr key={item.id}>
                <td style={tdStyle}>
                  {index + 1}
                </td>

                <td style={tdStyle}>
                  {item.nama_level}
                </td>

                <td style={tdStyle}>
                  {item.nilai_level}
                </td>

                <td style={tdStyle}>
                  <button
                    onClick={() => openEdit(item)}
                    style={editButton}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => setDeleteId(item.id)}
                    style={deleteButton}
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
          {/* Modal Tambah / Edit */}
    {showModal && (
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 999,
        }}
      >
        <div
          style={{
            width: "450px",
            background: "white",
            borderRadius: "12px",
            padding: "25px",
          }}
        >
          <h2 style={{ marginBottom: "20px" }}>
            {editData ? "Edit Level" : "Tambah Level"}
          </h2>

          <div style={{ marginBottom: "15px" }}>
            <label>Nama Level</label>

            <input
              type="text"
              value={form.nama_level}
              onChange={(e) =>
                setForm({
                  ...form,
                  nama_level: e.target.value,
                })
              }
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "5px",
                border: "1px solid #ccc",
                borderRadius: "8px",
              }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label>Nilai Level</label>

            <input
              type="number"
              value={form.nilai_level}
              onChange={(e) =>
                setForm({
                  ...form,
                  nilai_level: e.target.value,
                })
              }
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "5px",
                border: "1px solid #ccc",
                borderRadius: "8px",
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
            }}
          >
            <button
              onClick={() => setShowModal(false)}
              style={{
                padding: "10px 18px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                background: "white",
                cursor: "pointer",
              }}
            >
              Batal
            </button>

            <button
              onClick={handleSave}
              style={{
                padding: "10px 18px",
                borderRadius: "8px",
                border: "none",
                background: "#8b1e2b",
                color: "white",
                cursor: "pointer",
              }}
            >
              Simpan
            </button>
          </div>
        </div>
      </div>
    )}

    {/* Modal Hapus */}
    {deleteId && (
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,.4)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 999,
        }}
      >
        <div
          style={{
            background: "white",
            borderRadius: "12px",
            padding: "25px",
            width: "380px",
            textAlign: "center",
          }}
        >
          <h3>Hapus Level?</h3>

          <p
            style={{
              color: "#666",
              marginTop: "10px",
            }}
          >
            Data level akan dihapus permanen.
          </p>

          <div
            style={{
              display: "flex",
              gap: "10px",
              marginTop: "25px",
            }}
          >
            <button
              onClick={() => setDeleteId(null)}
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                background: "white",
                cursor: "pointer",
              }}
            >
              Batal
            </button>

            <button
              onClick={() => handleDelete(deleteId)}
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: "8px",
                border: "none",
                background: "#dc2626",
                color: "white",
                cursor: "pointer",
              }}
            >
              Hapus
            </button>
          </div>
        </div>
      </div>
    )}

  </div>

    
          {/* Modal Hapus */}
      {deleteId !== null && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,.4)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999,
          }}
        >
          <div
            style={{
              width: "380px",
              background: "#fff",
              borderRadius: "10px",
              padding: "24px",
              textAlign: "center",
            }}
          >
            <h2 style={{ marginTop: 0 }}>
              Hapus Level?
            </h2>

            <p
              style={{
                color: "#666",
                marginBottom: "25px",
              }}
            >
              Apakah Anda yakin ingin menghapus data level ini?
            </p>

            <div
              style={{
                display: "flex",
                gap: "10px",
              }}
            >
              <button
                onClick={() => setDeleteId(null)}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  background: "#fff",
                  cursor: "pointer",
                }}
              >
                Batal
              </button>

              <button
                onClick={() => handleDelete(deleteId)}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "8px",
                  border: "none",
                  background: "#dc2626",
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default LevelList;