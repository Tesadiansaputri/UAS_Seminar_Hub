import { useEffect, useState } from "react";
import api from '../../services/api';

interface Category {
  id: number;
  category_name: string;
}

interface Level {
  id: number;
  nama_level: string;
}

interface Seminar {
  id: number;
  seminar_name: string;
  tanggal: string;
  harga: number;
  kuota_tersedia: number;

  id_category: number;
  id_level: number;

  category: Category;
  level: Level;
}

const emptyForm = {
  seminar_name: "",
  tanggal: "",
  harga: "",
  kuota_tersedia: "",
  id_category: "",
  id_level: "",
};

const SeminarList = () => {
  const [seminars, setSeminars] = useState<Seminar[]>([]);
  const [filteredSeminars, setFilteredSeminars] = useState<Seminar[]>([]);

  const [categories, setCategories] = useState<Category[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [editData, setEditData] = useState<Seminar | null>(null);

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    getSeminars();
    getCategories();
    getLevels();
  }, []);

  useEffect(() => {
    const result = seminars.filter((item) =>
      item.seminar_name
        .toLowerCase()
        .includes(search.toLowerCase())
    );

    setFilteredSeminars(result);
  }, [search, seminars]);
  const getSeminars = async () => {
  try {
    const res = await api.get("/seminar");

    setSeminars(res.data);
    setFilteredSeminars(res.data);
  } catch (err) {
    console.log("Gagal mengambil seminar:", err);
  } finally {
    setLoading(false);
  }
};

const getCategories = async () => {
  try {
    const res = await api.get("/categories");
    setCategories(res.data);
  } catch (err) {
    console.log("Gagal mengambil kategori:", err);
  }
};

const getLevels = async () => {
  try {
    const res = await api.get("/levels");
    setLevels(res.data);
  } catch (err) {
    console.log("Gagal mengambil level:", err);
  }
};

const openAdd = () => {
  setEditData(null);
  setForm(emptyForm);
  setShowModal(true);
};

const openEdit = (seminar: Seminar) => {
  setEditData(seminar);

  setForm({
    seminar_name: seminar.seminar_name,
    tanggal: seminar.tanggal.split("T")[0],
    harga: seminar.harga.toString(),
    kuota_tersedia: seminar.kuota_tersedia.toString(),
    id_category: seminar.id_category.toString(),
    id_level: seminar.id_level.toString(),
  });

  setShowModal(true);
};

const handleSave = async () => {
  try {
    const payload = {
      seminar_name: form.seminar_name,
      tanggal: form.tanggal,
      harga: Number(form.harga),
      kuota_tersedia: Number(form.kuota_tersedia),
      id_category: Number(form.id_category),
      id_level: Number(form.id_level),
    };

    if (editData) {
      await api.put(`/seminar/${editData.id}`, payload);
    } else {
      await api.post("/seminar", payload);
    }

    setShowModal(false);
    setForm(emptyForm);
    setEditData(null);

    getSeminars();
  } catch (err: any) {
    console.log(err.response?.data);
    console.log(err);
  }
};

const handleDelete = async (id: number) => {
  try {
    await api.delete(`/seminar/${id}`);

    setDeleteId(null);

    getSeminars();
  } catch (err) {
    console.log(err);
  }
};

const thStyle = {
  padding: "14px",
  textAlign: "left" as const,
  background: "#f3f4f6",
  color: "#374151",
  fontWeight: "bold",
  fontSize: "14px",
};

const tdStyle = {
  padding: "14px",
  borderBottom: "1px solid #e5e7eb",
  color: "#374151",
  fontSize: "14px",
};

const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  marginTop: "6px",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
  outline: "none",
  fontSize: "14px",
  boxSizing: "border-box" as const,
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
        <h2 style={{ margin: 0 }}>Manajemen Seminar</h2>

        <p style={{ color: "#666", marginTop: "6px" }}>
          Kelola data seminar
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
          fontWeight: "bold",
        }}
      >
        Tambah Seminar
      </button>
    </div>

    {/* Search */}
    <input
      type="text"
      placeholder="Cari seminar..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      style={{
        width: "100%",
        padding: "12px",
        marginBottom: "20px",
        borderRadius: "8px",
        border: "1px solid #ccc",
        outline: "none",
        boxSizing: "border-box",
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
            <th style={thStyle}>Nama Seminar</th>
            <th style={thStyle}>Kategori</th>
            <th style={thStyle}>Level</th>
            <th style={thStyle}>Tanggal</th>
            <th style={thStyle}>Harga</th>
            <th style={thStyle}>Kuota</th>
            <th style={thStyle}>Aksi</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td
                colSpan={8}
                style={{
                  textAlign: "center",
                  padding: "20px",
                }}
              >
                Loading...
              </td>
            </tr>
          ) : filteredSeminars.length === 0 ? (
            <tr>
              <td
                colSpan={8}
                style={{
                  textAlign: "center",
                  padding: "20px",
                }}
              >
                Belum ada data seminar
              </td>
            </tr>
          ) : (
            filteredSeminars.map((item, index) => (
              <tr key={item.id}>
                <td style={tdStyle}>{index + 1}</td>

                <td style={tdStyle}>
                  {item.seminar_name}
                </td>

                <td style={tdStyle}>
                  {item.category?.category_name}
                </td>

                <td style={tdStyle}>
                  {item.level?.nama_level}
                </td>

                <td style={tdStyle}>
                  {new Date(item.tanggal).toLocaleDateString("id-ID")}
                </td>

                <td style={tdStyle}>
                  Rp {Number(item.harga).toLocaleString("id-ID")}
                </td>

                <td style={tdStyle}>
                  {item.kuota_tersedia}
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
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999,
          }}
        >
          <div
            style={{
              background: "white",
              width: "500px",
              borderRadius: "10px",
              padding: "25px",
            }}
          >
            <h2 style={{ marginTop: 0 }}>
              {editData ? "Edit Seminar" : "Tambah Seminar"}
            </h2>

            {/* Nama Seminar */}
            <div style={{ marginBottom: "15px" }}>
              <label>Nama Seminar</label>

              <input
                type="text"
                value={form.seminar_name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    seminar_name: e.target.value,
                  })
                }
                style={inputStyle}
              />
            </div>

            {/* Tanggal */}
            <div style={{ marginBottom: "15px" }}>
              <label>Tanggal</label>

              <input
                type="date"
                value={form.tanggal}
                onChange={(e) =>
                  setForm({
                    ...form,
                    tanggal: e.target.value,
                  })
                }
                style={inputStyle}
              />
            </div>

            {/* Harga */}
            <div style={{ marginBottom: "15px" }}>
              <label>Harga</label>

              <input
                type="number"
                value={form.harga}
                onChange={(e) =>
                  setForm({
                    ...form,
                    harga: e.target.value,
                  })
                }
                style={inputStyle}
              />
            </div>

            {/* Kuota */}
            <div style={{ marginBottom: "15px" }}>
              <label>Kuota</label>

              <input
                type="number"
                value={form.kuota_tersedia}
                onChange={(e) =>
                  setForm({
                    ...form,
                    kuota_tersedia: e.target.value,
                  })
                }
                style={inputStyle}
              />
            </div>

            {/* Kategori */}
            <div style={{ marginBottom: "15px" }}>
              <label>Kategori</label>

              <select
                value={form.id_category}
                onChange={(e) =>
                  setForm({
                    ...form,
                    id_category: e.target.value,
                  })
                }
                style={inputStyle}
              >
                <option value="">Pilih Kategori</option>

                {categories.map((cat) => (
                  <option
                    key={cat.id}
                    value={cat.id}
                  >
                    {cat.category_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Level */}
            <div style={{ marginBottom: "20px" }}>
              <label>Level</label>

              <select
                value={form.id_level}
                onChange={(e) =>
                  setForm({
                    ...form,
                    id_level: e.target.value,
                  })
                }
                style={inputStyle}
              >
                <option value="">Pilih Level</option>

                {levels.map((lvl) => (
                  <option
                    key={lvl.id}
                    value={lvl.id}
                  >
                    {lvl.nama_level}
                  </option>
                ))}
              </select>
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
                  border: "1px solid #ccc",
                  borderRadius: "6px",
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
                  border: "none",
                  borderRadius: "6px",
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
          }}
        >
          <div
            style={{
              background: "white",
              padding: "30px",
              borderRadius: "10px",
              width: "350px",
              textAlign: "center",
            }}
          >
            <h3>Hapus Seminar?</h3>

            <p>
              Apakah Anda yakin ingin menghapus seminar ini?
            </p>

            <div
              style={{
                display: "flex",
                gap: "10px",
                marginTop: "20px",
              }}
            >
              <button
                onClick={() => setDeleteId(null)}
                style={{
                  flex: 1,
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "6px",
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
                  background: "#dc2626",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
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
    </div>
  );
};

export default SeminarList;