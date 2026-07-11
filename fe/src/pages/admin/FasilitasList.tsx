import { useEffect, useState } from "react";
import api from '../../services/api';

interface Fasilitas {
  id: number;
  nama_fasilitas: string;
  nilai_fasilitas: number;
}

interface Seminar {
  id: number;
  seminar_name: string;
}

interface Relation {
  seminarId: number;
  fasilitasId: number;
  seminar: Seminar;
  fasilitas: Fasilitas;
}

const emptyForm = {
  nama_fasilitas: "",
  nilai_fasilitas: "",
};

const emptyRelation = {
  seminarId: "",
  fasilitasId: "",
};

const FasilitasList = () => {
  
  // MASTER FASILITAS
  const [fasilitas, setFasilitas] = useState<Fasilitas[]>([]);
  const [filteredFasilitas, setFilteredFasilitas] = useState<Fasilitas[]>([]);

  // SEMINAR
  const [seminars, setSeminars] = useState<Seminar[]>([]);

  // RELASi
  const [relations, setRelations] = useState<Relation[]>([]);

  // SEARCH
  const [search, setSearch] = useState("");

  // MODAL
  const [showModal, setShowModal] = useState(false);
  const [showRelationModal, setShowRelationModal] = useState(false);

  // EDIT & DELETE
  const [editData, setEditData] = useState<Fasilitas | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // FORm
  const [form, setForm] = useState(emptyForm);

  const [relationForm, setRelationForm] =
    useState(emptyRelation);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFasilitas();
    getSeminars();
    getRelations();
  }, []);

  useEffect(() => {
    const result = fasilitas.filter((item) =>
      item.nama_fasilitas
        .toLowerCase()
        .includes(search.toLowerCase())
    );

    setFilteredFasilitas(result);
  }, [search, fasilitas]);

  // ==========================
  // GET FASILITAS
  // ==========================
  const getFasilitas = async () => {
    try {
      const res = await api.get("/fasilitas");

      setFasilitas(res.data);
      setFilteredFasilitas(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // GET SEMINAR
  // ==========================
  const getSeminars = async () => {
    try {
      const res = await api.get("/seminar");
      setSeminars(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // ==========================
  // GET RELASI
  // ==========================
  const getRelations = async () => {
    try {
      const res = await api.get(
        "/kelengkapan-fasilitas"
      );

      setRelations(res.data);
    } catch (err) {
      console.log(err);
    }
  };
    // CRUD

  const openAdd = () => {
    setEditData(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (item: Fasilitas) => {
    setEditData(item);

    setForm({
      nama_fasilitas: item.nama_fasilitas,
      nilai_fasilitas: String(item.nilai_fasilitas),
    });

    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      const payload = {
        nama_fasilitas: form.nama_fasilitas,
        nilai_fasilitas: Number(form.nilai_fasilitas),
      };

      if (editData) {
        await api.put(`/fasilitas/${editData.id}`, payload);
      } else {
        await api.post("/fasilitas", payload);
      }

      setShowModal(false);
      setEditData(null);
      setForm(emptyForm);
      getFasilitas();
    } catch (err: any) {
      console.log(err.response?.data);
      console.log(err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/fasilitas/${id}`);

      setDeleteId(null);
      getFasilitas();
    } catch (err) {
      console.log(err);
    }
  };

  const handleSaveRelation = async () => {
    try {
      await api.post("/kelengkapan-fasilitas", {
        seminarId: Number(relationForm.seminarId),
        fasilitasId: Number(relationForm.fasilitasId),
      });

      setRelationForm(emptyRelation);
      setShowRelationModal(false);

      getRelations();
    } catch (err: any) {
      console.log(err.response?.data);
      console.log(err);
    }
  };

  const handleDeleteRelation = async (
    seminarId: number,
    fasilitasId: number
  ) => {
    try {
      await api.delete(
        `/kelengkapan-fasilitas/${seminarId}/${fasilitasId}`
      );

      getRelations();
    } catch (err) {
      console.log(err);
    }
  };
    return (
    <div
      style={{
        padding: "30px",
        background: "#f9fafb",
        minHeight: "100vh",
      }}
    >
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
            Manajemen Fasilitas
          </h2>

          <p style={{ color: "#666" }}>
            Kelola fasilitas seminar dan kelengkapannya
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: "10px",
          }}
        >
          <button
            onClick={openAdd}
            style={{
              background: "#8b1e2b",
              color: "white",
              border: "none",
              padding: "10px 18px",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Tambah Fasilitas
          </button>

          <button
            onClick={() => setShowRelationModal(true)}
            style={{
              background: "#2563eb",
              color: "white",
              border: "none",
              padding: "10px 18px",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Tambah Kelengkapan
          </button>
        </div>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Cari fasilitas..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          border: "1px solid #ddd",
          borderRadius: "8px",
          marginBottom: "20px",
        }}
      />

      {/* Tabel Fasilitas */}
      <div
        style={{
          background: "white",
          borderRadius: "10px",
          overflow: "hidden",
          boxShadow: "0 2px 8px rgba(0,0,0,.08)",
          marginBottom: "35px",
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
              <th style={thStyle}>Nama Fasilitas</th>
              <th style={thStyle}>Nilai</th>
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
            ) : filteredFasilitas.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  style={{
                    textAlign: "center",
                    padding: "20px",
                  }}
                >
                  Data fasilitas tidak ditemukan
                </td>
              </tr>
            ) : (
              filteredFasilitas.map((item, index) => (
                <tr key={item.id}>
                  <td style={tdStyle}>{index + 1}</td>

                  <td style={tdStyle}>
                    {item.nama_fasilitas}
                  </td>

                  <td style={tdStyle}>
                    {item.nilai_fasilitas}
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
      </div>
            {/* Tabel Kelengkapan Fasilitas */}
      <div
        style={{
          background: "white",
          borderRadius: "10px",
          overflow: "hidden",
          boxShadow: "0 2px 8px rgba(0,0,0,.08)",
        }}
      >
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid #eee",
          }}
        >
          <h3
            style={{
              margin: 0,
            }}
          >
            Kelengkapan Fasilitas Seminar
          </h3>
        </div>

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
              <th style={thStyle}>Seminar</th>
              <th style={thStyle}>Fasilitas</th>
              <th style={thStyle}>Nilai</th>
              <th style={thStyle}>Aksi</th>
            </tr>
          </thead>

          <tbody>
            {relations.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  style={{
                    textAlign: "center",
                    padding: "20px",
                  }}
                >
                  Belum ada data kelengkapan fasilitas
                </td>
              </tr>
            ) : (
              relations.map((item, index) => (
                <tr
                  key={`${item.seminarId}-${item.fasilitasId}`}
                >
                  <td style={tdStyle}>
                    {index + 1}
                  </td>

                  <td style={tdStyle}>
                    {item.seminar.seminar_name}
                  </td>

                  <td style={tdStyle}>
                    {item.fasilitas.nama_fasilitas}
                  </td>

                  <td style={tdStyle}>
                    {item.fasilitas.nilai_fasilitas}
                  </td>

                  <td style={tdStyle}>
                    <button
                      onClick={() =>
                        handleDeleteRelation(
                          item.seminarId,
                          item.fasilitasId
                        )
                      }
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
      </div>
            {/* Modal Tambah/Edit Fasilitas */}
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
              width: "420px",
              background: "#fff",
              borderRadius: "10px",
              padding: "24px",
            }}
          >
            <h2>
              {editData ? "Edit Fasilitas" : "Tambah Fasilitas"}
            </h2>

            <div style={{ marginBottom: "15px" }}>
              <label>Nama Fasilitas</label>

              <input
                type="text"
                value={form.nama_fasilitas}
                onChange={(e) =>
                  setForm({
                    ...form,
                    nama_fasilitas: e.target.value,
                  })
                }
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  marginTop: "5px",
                }}
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label>Nilai Fasilitas</label>

              <input
                type="number"
                value={form.nilai_fasilitas}
                onChange={(e) =>
                  setForm({
                    ...form,
                    nilai_fasilitas: e.target.value,
                  })
                }
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  marginTop: "5px",
                }}
              />
            </div>

            <div
              style={{
                display: "flex",
                gap: "10px",
              }}
            >
              <button
                onClick={() => setShowModal(false)}
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
                onClick={handleSave}
                style={{
                  flex: 1,
                  padding: "10px",
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

      {/* Modal Tambah Kelengkapan */}
      {showRelationModal && (
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
              background: "#fff",
              borderRadius: "10px",
              padding: "24px",
            }}
          >
            <h2>Tambah Kelengkapan Fasilitas</h2>

            <div style={{ marginBottom: "15px" }}>
              <label>Seminar</label>

              <select
                value={relationForm.seminarId}
                onChange={(e) =>
                  setRelationForm({
                    ...relationForm,
                    seminarId: e.target.value,
                  })
                }
                style={{
                  width: "100%",
                  padding: "10px",
                  marginTop: "5px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                }}
              >
                <option value="">Pilih Seminar</option>

                {seminars.map((item) => (
                  <option
                    key={item.id}
                    value={item.id}
                  >
                    {item.seminar_name}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label>Fasilitas</label>

              <select
                value={relationForm.fasilitasId}
                onChange={(e) =>
                  setRelationForm({
                    ...relationForm,
                    fasilitasId: e.target.value,
                  })
                }
                style={{
                  width: "100%",
                  padding: "10px",
                  marginTop: "5px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                }}
              >
                <option value="">Pilih Fasilitas</option>

                {fasilitas.map((item) => (
                  <option
                    key={item.id}
                    value={item.id}
                  >
                    {item.nama_fasilitas}
                  </option>
                ))}
              </select>
            </div>

            <div
              style={{
                display: "flex",
                gap: "10px",
              }}
            >
              <button
                onClick={() => setShowRelationModal(false)}
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
                onClick={handleSaveRelation}
                style={{
                  flex: 1,
                  padding: "10px",
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
            <h2>Hapus Fasilitas?</h2>

            <p>
              Apakah Anda yakin ingin menghapus data ini?
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

const thStyle = {
  padding: "14px",
  textAlign: "left" as const,
  background: "#f3f4f6",
  fontWeight: "bold",
};

const tdStyle = {
  padding: "14px",
  borderBottom: "1px solid #eee",
};

const editButton = {
  background: "#2563eb",
  color: "white",
  border: "none",
  padding: "8px 14px",
  borderRadius: "6px",
  cursor: "pointer",
  marginRight: "8px",
};

const deleteButton = {
  background: "#dc2626",
  color: "white",
  border: "none",
  padding: "8px 14px",
  borderRadius: "6px",
  cursor: "pointer",
};

export default FasilitasList;