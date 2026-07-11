import { useEffect, useState } from "react";
import { Plus, Star } from "lucide-react";
import api from "../../services/api";

interface Speaker {
  id: number;
  nama: string;
  email: string;
  bidang_keahlian: string;
  rating: number;
}

const emptyForm = {
  nama: "",
  email: "",
  bidang_keahlian: "",
  rating: "",
};

const SpeakerList = () => {
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Speaker | null>(null);

  const [form, setForm] = useState(emptyForm);

  const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    marginTop: "6px",
    fontSize: "14px",
    boxSizing: "border-box" as const,
  };

  const fetchSpeakers = async () => {
    try {
      const res = await api.get("/speaker");
      setSpeakers(res.data);
    } catch (err) {
      console.log(err);
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

  const openEdit = (speaker: Speaker) => {
    setEditData(speaker);

    setForm({
      nama: speaker.nama,
      email: speaker.email,
      bidang_keahlian: speaker.bidang_keahlian,
      rating: String(speaker.rating),
    });

    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      const payload = {
        nama: form.nama,
        email: form.email,
        bidang_keahlian: form.bidang_keahlian,
        rating: Number(form.rating),
      };

      if (editData) {
        await api.put(`/speaker/${editData.id}`, payload);
      } else {
        await api.post("/speaker", payload);
      }

      await fetchSpeakers();

      setShowModal(false);
      setEditData(null);
      setForm(emptyForm);

    } catch (err: any) {
      console.log(err.response?.data);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/speaker/${id}`);

      await fetchSpeakers();

      setDeleteId(null);

    } catch (err) {
      console.log(err);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "300px",
          color: "#8b1e2b",
          fontWeight: "bold",
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <div>
            {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "32px",
              fontWeight: "bold",
              color: "#1f2937",
              marginBottom: "8px",
            }}
          >
            Manajemen Speaker
          </h1>

          <p
            style={{
              color: "#6b7280",
              fontSize: "16px",
            }}
          >
            Kelola data narasumber seminar & workshop
          </p>
        </div>

        <button
          onClick={openAdd}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "#8b1e2b",
            color: "white",
            border: "none",
            padding: "12px 20px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          <Plus size={18} />
          Tambah Speaker
        </button>
      </div>

      {/* List Speaker */}

      {speakers.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "60px",
            color: "#9ca3af",
          }}
        >
          Belum ada data speaker.
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(450px,1fr))",
            gap: "20px",
          }}
        >
          {speakers.map((sp) => (
            <div
              key={sp.id}
              style={{
                background: "#fff",
                borderRadius: "12px",
                padding: "22px",
                boxShadow: "0 2px 8px rgba(0,0,0,.08)",
                borderLeft: "5px solid #8b1e2b",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: "24px",
                      color: "#1f2937",
                    }}
                  >
                    {sp.nama}
                  </h3>

                  <p
                    style={{
                      margin: "8px 0",
                      color: "#8b1e2b",
                      fontWeight: "600",
                    }}
                  >
                    {sp.bidang_keahlian}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      marginBottom: "10px",
                    }}
                  >
                    <Star
                      size={18}
                      color="#f59e0b"
                      fill="#f59e0b"
                    />

                    <span
                      style={{
                        fontWeight: "bold",
                        color: "#374151",
                      }}
                    >
                      {sp.rating}
                    </span>
                  </div>

                  <p
                    style={{
                      color: "#6b7280",
                      margin: 0,
                    }}
                  >
                    {sp.email}
                  </p>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    gap: "10px",
                  }}
                >
                  <button
                    onClick={() => openEdit(sp)}
                    style={{
                      background: "#2563eb",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      width: "75px",
                      height: "34px",
                      cursor: "pointer",
                      fontSize: "13px",
                    }}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => setDeleteId(sp.id)}
                    style={{
                      background: "#dc2626",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      width: "75px",
                      height: "34px",
                      cursor: "pointer",
                      fontSize: "13px",
                    }}
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
            {/* Modal Tambah/Edit */}
      {showModal && (
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
              width: "450px",
              background: "white",
              borderRadius: "12px",
              padding: "30px",
            }}
          >
            <h2
              style={{
                marginTop: 0,
                marginBottom: "24px",
                color: "#1f2937",
              }}
            >
              {editData ? "Edit Speaker" : "Tambah Speaker"}
            </h2>

            <div style={{ marginBottom: "16px" }}>
              <label>Nama Speaker</label>

              <input
                type="text"
                value={form.nama}
                onChange={(e) =>
                  setForm({
                    ...form,
                    nama: e.target.value,
                  })
                }
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label>Email</label>

              <input
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value,
                  })
                }
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label>Bidang Keahlian</label>

              <input
                type="text"
                value={form.bidang_keahlian}
                onChange={(e) =>
                  setForm({
                    ...form,
                    bidang_keahlian: e.target.value,
                  })
                }
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label>Rating</label>

              <select
                value={form.rating}
                onChange={(e) =>
                  setForm({
                    ...form,
                    rating: e.target.value,
                  })
                }
                style={inputStyle}
              >
                <option value="">Pilih Rating</option>
                <option value="5">5,0 (Skor 5)</option>
                <option value="4">4,7 - 4,9 (Skor 4)</option>
                <option value="3">4,4 - 4,6 (Skor 3)</option>
                <option value="2">4,1 - 4,3 (Skor 2)</option>
                <option value="1">&lt; 4,0 (Skor 1)</option>
              </select>

              <small
                style={{
                  color: "#6b7280",
                  display: "block",
                  marginTop: "8px",
                }}
              >
                Rating digunakan sebagai nilai kriteria pada proses SPK.
              </small>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
              }}
            >
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditData(null);
                  setForm(emptyForm);
                }}
                style={{
                  padding: "10px 18px",
                  border: "1px solid #d1d5db",
                  background: "white",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                Batal
              </button>

              <button
                onClick={handleSave}
                style={{
                  padding: "10px 18px",
                  background: "#8b1e2b",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                {editData ? "Update" : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}
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
              background: "white",
              width: "380px",
              borderRadius: "12px",
              padding: "28px",
              textAlign: "center",
            }}
          >
            <h3
              style={{
                marginTop: 0,
                color: "#1f2937",
              }}
            >
              Hapus Speaker
            </h3>

            <p
              style={{
                color: "#6b7280",
                marginBottom: "24px",
              }}
            >
              Apakah Anda yakin ingin menghapus speaker ini?
            </p>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "12px",
              }}
            >
              <button
                onClick={() => setDeleteId(null)}
                style={{
                  padding: "10px 18px",
                  background: "white",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                Batal
              </button>

              <button
                onClick={() => handleDelete(deleteId)}
                style={{
                  padding: "10px 18px",
                  background: "#dc2626",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "bold",
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

export default SpeakerList;