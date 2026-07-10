import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { CalendarDays, LayoutGrid, Mic, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

interface Seminar {
  id: number;
  seminar_name: string;
  tanggal: string;
  harga: string;
  kuota_tersedia: number;
  category?: {
    category_name: string;
  };
  level?: {
    nama_level: string;
  };
}

interface Stats {
  totalSeminar: number;
  totalSpeaker: number;
  totalKategori: number;
  totalPeserta: number;
}

const buttonStyle: CSSProperties = {
  background: "#8b1e2b",
  color: "white",
  border: "none",
  padding: "10px 18px",
  borderRadius: "8px",
  cursor: "pointer",
};

interface CardProps {
  title: string;
  value: number;
  icon: ReactNode;
}

const Card = ({ title, value, icon }: CardProps) => (
  <div
    style={{
      background: "white",
      padding: "20px",
      borderRadius: "12px",
      boxShadow: "0 2px 10px rgba(0,0,0,.05)",
    }}
  >
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <div>
        <p
          style={{
            margin: 0,
            color: "#666",
          }}
        >
          {title}
        </p>

        <h2>{value}</h2>
      </div>

      {icon}
    </div>
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  useAuth();

  const [loading, setLoading] = useState(true);
  const [seminars, setSeminars] = useState<Seminar[]>([]);
  const [recentSeminars, setRecentSeminars] = useState<Seminar[]>([]);
  const [speakerCount, setSpeakerCount] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);
 

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [seminarRes, speakerRes, categoryRes] = await Promise.all([
        api.get("/seminar"),
        api.get("/speaker"),
        api.get("/categories"),
      ]);

      const seminarsData: Seminar[] = seminarRes.data;
      setSeminars(seminarsData);
      setRecentSeminars(seminarsData.slice(0, 5));
      setSpeakerCount(speakerRes.data.length);
      setCategoryCount(categoryRes.data.length);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <h2 style={{ textAlign: "center", marginTop: 60 }}>
        Loading...
      </h2>
    );
  }

  const cards = [
    {
      title: "Total Seminar",
      value: seminars.length,
      icon: <CalendarDays size={26} color="#991B1B" />,
    },
    {
      title: "Total Speaker",
      value: speakerCount,
      icon: <Mic size={26} color="#991B1B" />,
    },
    {
      title: "Total Kategori",
      value: categoryCount,
      icon: <LayoutGrid size={26} color="#991B1B" />,
    },
    {
      title: "Total Peserta",
      value: 0,
      icon: <Users size={26} color="#991B1B" />,
    },
  ];
  return (
  <div style={{ padding: "30px" }}>

    {/* Header */}
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "30px",
      }}
    >
      <div>
        <h1
          style={{
            margin: 0,
            fontSize: "30px",
            fontWeight: "bold",
          }}
        >
          Dashboard Admin
        </h1>

        <p
          style={{
            color: "#666",
            marginTop: "8px",
          }}
        >
          Selamat datang kembali 👋
        </p>
      </div>

      <button
        onClick={() => navigate("/admin/seminar")}
        style={{
          background: "#8b1e2b",
          color: "white",
          border: "none",
          padding: "12px 22px",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        Kelola Seminar
      </button>
    </div>

    {/* Statistik */}
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4,1fr)",
        gap: "20px",
        marginBottom: "35px",
      }}
    >
      {cards.map((card) => (
        <Card
          key={card.title}
          title={card.title}
          value={card.value}
          icon={card.icon}
        />
      ))}
    </div>

    {/* Quick Action */}
    <div
      style={{
        background: "white",
        borderRadius: "12px",
        padding: "20px",
        marginBottom: "30px",
        boxShadow: "0 2px 10px rgba(0,0,0,.05)",
      }}
    >
      <h3>Quick Action</h3>

      <div
        style={{
          display: "flex",
          gap: "15px",
          marginTop: "15px",
        }}
      >
        <button
          onClick={() => navigate("/admin/seminar")}
          style={buttonStyle}
        >
          Seminar
        </button>

        <button
          onClick={() => navigate("/admin/speaker")}
          style={buttonStyle}
        >
          Speaker
        </button>

        <button
          onClick={() => navigate("/admin/category")}
          style={buttonStyle}
        >
          Kategori
        </button>

        <button
          onClick={() => navigate("/admin/spk")}
          style={buttonStyle}
        >
          SPK SAW
        </button>
      </div>
    </div>

    {/* Seminar Terbaru */}
    <div
      style={{
        background: "white",
        borderRadius: "12px",
        padding: "20px",
        marginBottom: "30px",
        boxShadow: "0 2px 10px rgba(0,0,0,.05)",
      }}
    >
      <h3>Seminar Terbaru</h3>

      <table
        style={{
          width: "100%",
          marginTop: "20px",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            <th>Nama Seminar</th>
            <th>Kategori</th>
            <th>Level</th>
            <th>Harga</th>
          </tr>
        </thead>

        <tbody>
          {recentSeminars.map((item) => (
            <tr key={item.id}>
              <td>{item.seminar_name}</td>
              <td>{item.category?.category_name}</td>
              <td>{item.level?.nama_level}</td>
              <td>
                Rp {Number(item.harga).toLocaleString("id-ID")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

        {/* Ringkasan SPK */}
    <div
      style={{
        background: "white",
        borderRadius: "12px",
        padding: "20px",
        boxShadow: "0 2px 10px rgba(0,0,0,.05)",
      }}
    >
      <h3>Statistik SPK</h3>

      <p style={{ color: "#777" }}>
        Hasil rekomendasi seminar menggunakan metode SAW
        akan ditampilkan pada halaman SPK.
      </p>

      <button
        style={buttonStyle}
        onClick={() => navigate("/admin/spk")}
      >
        Buka SPK
      </button>
    </div>

  </div>
  );
};

export default Dashboard;