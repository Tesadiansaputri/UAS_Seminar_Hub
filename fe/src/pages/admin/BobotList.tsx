import { useEffect, useState } from "react";
import api from "../../services/api";

const BobotList = () => {
  const [bobot, setBobot] = useState<any[]>([]);

  useEffect(() => {
    fetchBobot();
  }, []);

  const fetchBobot = async () => {
    try {
      const res = await api.get("/bobot");
      setBobot(res.data);
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
        Kelola Bobot User
      </h1>

      <p
        style={{
          color: "#666",
          marginBottom: 30,
        }}
      >
        Bobot preferensi yang dipilih oleh setiap user
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
            <th>Harga</th>
            <th>Kuota</th>
            <th>Rating</th>
            <th>Level</th>
            <th>Fasilitas</th>
          </tr>
        </thead>

        <tbody>

          {bobot.map((b, i) => (
            <tr key={b.id}>

              <td>{i + 1}</td>

              <td>{b.user.name}</td>

              <td>{b.bobot_harga}</td>

              <td>{b.bobot_kuota}</td>

              <td>{b.bobot_rating}</td>

              <td>{b.bobot_level}</td>

              <td>{b.bobot_fasilitas}</td>

            </tr>
          ))}

        </tbody>

      </table>

    </div>
  );
};

export default BobotList;