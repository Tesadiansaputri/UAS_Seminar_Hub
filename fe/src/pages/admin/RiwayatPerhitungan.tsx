import { useEffect, useState } from "react";
import api from "../../services/api";

const HasilList = () => {
  const [hasil, setHasil] = useState<any[]>([]);

  useEffect(() => {
    fetchHasil();
  }, []);

  const fetchHasil = async () => {
    try {
      const res = await api.get("/hasil");
      setHasil(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <h1
        style={{
          fontSize: 28,
          fontWeight: "bold",
          marginBottom: 8,
        }}
      >
        Riwayat Perhitungan
      </h1>

      <p
        style={{
          color: "#666",
          marginBottom: 30,
        }}
      >
        Riwayat hasil perhitungan seluruh user
      </p>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          background: "white",
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        <thead
          style={{
            background: "#8b1e2b",
            color: "white",
          }}
        >
          <tr>
            <th>No</th>
            <th>User</th>
            <th>Metode</th>
            <th>Seminar</th>
            <th>Kategori</th>
            <th>Nilai</th>
            <th>Ranking</th>
            <th>Tanggal</th>
          </tr>
        </thead>

        <tbody>
          {hasil.map((h, i) => (
            <tr key={h.id}>
              <td>{i + 1}</td>

              <td>{h.user.name}</td>

              <td>{h.metode}</td>

              <td>{h.seminar.seminar_name}</td>

              <td>{h.seminar.category.category_name}</td>

              <td>{Number(h.nilai).toFixed(6)}</td>

              <td>{h.ranking}</td>

              <td>
                {new Date(h.createdAt).toLocaleDateString("id-ID")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HasilList;