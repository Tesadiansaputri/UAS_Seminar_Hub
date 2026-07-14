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

const buttonStyle: CSSProperties = {
  background: "linear-gradient(135deg, #8b1e2b 0%, #b51f35 100%)",
  color: "white",
  border: "none",
  padding: "11px 18px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: 800,
  boxShadow: "0 12px 24px rgba(139,30,43,.18)",
};

interface CardProps {
  title: string;
  value: number;
  icon: ReactNode;
}

const Card = ({ title, value, icon }: CardProps) => (
  <div
    style={{
      position: "relative",
      overflow: "hidden",
      background:
        "linear-gradient(135deg, #ffffff 0%, #fff7f8 100%)",
      padding: "22px",
      borderRadius: "8px",
      border: "1px solid rgba(139,30,43,.1)",
      boxShadow: "0 18px 42px rgba(139,30,43,.1)",
    }}
  >
    <div
      style={{
        position: "absolute",
        right: "-28px",
        top: "-34px",
        width: "110px",
        height: "110px",
        borderRadius: "50%",
        background: "rgba(181,31,53,.09)",
      }}
    />
    <div
      style={{
        position: "relative",
        zIndex: 1,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: "16px",
      }}
    >
      <div>
        <p
          style={{
            margin: 0,
            color: "#6b7280",
            fontSize: "13px",
            fontWeight: 800,
          }}
        >
          {title}
        </p>

        <h2
          style={{
            margin: "12px 0 0",
            color: "#171923",
            fontSize: "32px",
            lineHeight: 1,
            fontWeight: 900,
          }}
        >
          {value}
        </h2>
      </div>

      <div
        style={{
          width: "48px",
          height: "48px",
          display: "grid",
          placeItems: "center",
          borderRadius: "8px",
          background: "#fff1f3",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,.7)",
        }}
      >
        {icon}
      </div>
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
        padding: "26px",
        borderRadius: "8px",
        background: "linear-gradient(135deg, #7f1020 0%, #b51f35 100%)",
        boxShadow: "0 18px 42px rgba(139,30,43,.16)",
      }}
    >
      <div>
        <h1
          style={{
            margin: 0,
            fontSize: "30px",
            fontWeight: "bold",
            color: "white",
          }}
        >
          Dashboard Admin
        </h1>

        <p
          style={{
            color: "rgba(255,255,255,.84)",
            marginTop: "8px",
          }}
        >
          Selamat datang kembali 👋
        </p>
      </div>

      <button
        onClick={() => navigate("/admin/seminar")}
        style={{
          background: "white",
          color: "#8b1e2b",
          border: "1px solid rgba(255,255,255,.3)",
          padding: "12px 22px",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: 900,
          boxShadow: "0 14px 30px rgba(42,17,24,.18)",
        }}
      >
        Kelola Seminar
      </button>
    </div>

    {/* Statistik */}
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))",
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
        borderRadius: "8px",
        padding: "22px",
        marginBottom: "30px",
        border: "1px solid rgba(139,30,43,.08)",
        boxShadow: "0 18px 42px rgba(139,30,43,.08)",
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
        borderRadius: "8px",
        padding: "22px",
        marginBottom: "30px",
        border: "1px solid rgba(139,30,43,.08)",
        boxShadow: "0 18px 42px rgba(139,30,43,.08)",
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
        borderRadius: "8px",
        padding: "22px",
        border: "1px solid rgba(139,30,43,.08)",
        boxShadow: "0 18px 42px rgba(139,30,43,.08)",
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
