import { useEffect, useState } from "react";
import api from "../../services/api";

const RiwayatPerhitungan = () => {
  const [hasil, setHasil] = useState<any[]>([]);

  useEffect(() => {
    fetchRiwayat();
  }, []);

  const fetchRiwayat = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      const res = await api.get(`/hasil/user/${user.id}`);

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
          marginBottom: 25,
        }}
      >
        Riwayat hasil perhitungan seminar yang pernah Anda lakukan.
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
            <th>Metode</th>
            <th>Seminar</th>
            <th>Nilai</th>
            <th>Ranking</th>
            <th>Tanggal</th>
          </tr>
        </thead>

        <tbody>
          {hasil.map((h, i) => (
            <tr key={h.id}>
              <td>{i + 1}</td>
              <td>{h.metode}</td>
              <td>{h.seminar.seminar_name}</td>
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

export default RiwayatPerhitungan;