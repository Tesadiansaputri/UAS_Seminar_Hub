import { useEffect, useState } from "react";
import {
  Calculator,
  ClipboardList,
  Scale,
  Award,
} from "lucide-react";
import api from "../../services/api";


const metode = [
  {
    nama: "SAW",
    deskripsi: "Simple Additive Weighting",
  },
  {
    nama: "TOPSIS",
    deskripsi:
      "Technique for Order Preference by Similarity to Ideal Solution",
  },
  {
    nama: "WP",
    deskripsi: "Weighted Product",
  },
];

const cardStyle = {
  background: "linear-gradient(135deg, #ffffff 0%, #fffafa 100%)",
  borderRadius: "8px",
  padding: "24px",
  border: "1px solid rgba(139,30,43,.09)",
  boxShadow: "0 18px 42px rgba(139,30,43,.08)",
};
const thStyle = {
  padding: "14px 16px",
  borderBottom: "1px solid rgba(181,31,53,.12)",
  textAlign: "left" as const,
  background: "#fff1f3",
  color: "#8b1e2b",
  fontWeight: 900,
  fontSize: "12px",
  textTransform: "uppercase" as const,
};

const tdStyle = {
  padding: "14px 16px",
  borderBottom: "1px solid rgba(139,30,43,.08)",
  color: "#4b5563",
};

const PerhitunganSPK = () => {

const [kriteria, setKriteria] = useState<any[]>([]);
const [subKriteria, setSubKriteria] = useState<any[]>([]);

useEffect(() => {
  fetchData();
}, []);

const fetchData = async () => {
  try {
    const kriteriaRes = await api.get("/kriteria");
    const subRes = await api.get("/sub-kriteria");

    setKriteria(kriteriaRes.data);
    setSubKriteria(subRes.data);
  } catch (err) {
    console.log(err);
  }
};

  return (
    <div
      style={{
        display: "grid",
        gap: "26px",
      }}
    >

      {/* Header */}

      <div style={{ marginBottom: "30px" }}>
        <h1
          style={{
            fontSize: "28px",
            fontWeight: "bold",
            color: "#1f2937",
            marginBottom: "6px",
          }}
        >
          Kelola Perhitungan SPK
        </h1>

        <p
          style={{
            color: "#6b7280",
            fontSize: "15px",
          }}
        >
          Informasi mengenai kriteria, aturan penilaian, dan metode
          Sistem Pendukung Keputusan (SPK) yang digunakan untuk
          memberikan rekomendasi seminar.
        </p>
      </div>

      {/* Statistik */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))",
          gap: "20px",
          marginBottom: 0,
        }}
      >
        <div style={cardStyle}>
          <Calculator color="#8b1e2b" size={30} />
          <h2>{kriteria.length}</h2>
          <p style={{ color: "#6b7280" }}>
            Total Kriteria
          </p>
        </div>

        <div style={cardStyle}>
          <ClipboardList color="#2563eb" size={30} />
          <h2 style={{ margin: "12px 0 0" }}>3</h2>
          <p style={{ color: "#6b7280" }}>
            Metode SPK
          </p>
        </div>

        <div style={cardStyle}>
          <Scale color="#dc2626" size={30} />
          <h2>
{kriteria.filter((k:any)=>k.jenis==="Cost").length}
</h2>
          <p style={{ color: "#6b7280" }}>
            Cost
          </p>
        </div>

        <div style={cardStyle}>
          <Award color="#16a34a" size={30} />
          <h2>
{kriteria.filter((k:any)=>k.jenis==="Benefit").length}
</h2>
          <p style={{ color: "#6b7280" }}>
            Benefit
          </p>
        </div>
      </div>
            
            {/* ===========================
          TABEL KRITERIA
      =========================== */}

      <div
        style={{
          ...cardStyle,
          marginBottom: 0,
        }}
      >
        <h2
          style={{
            marginTop: 0,
            marginBottom: "20px",
            color: "#8b1e2b",
          }}
        >
          Kriteria Penilaian
        </h2>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr
              style={{
                background: "#f9fafb",
              }}
            >
              <th style={thStyle}>Kode</th>
              <th style={thStyle}>Nama Kriteria</th>
              <th style={thStyle}>Jenis</th>
              <th style={thStyle}>Sumber Data</th>
            </tr>
          </thead>

          <tbody>
            {kriteria.map((item) => (
              <tr key={item.kode}>
                <td style={tdStyle}>{item.kode}</td>

                <td style={tdStyle}>
                  {item.nama}
                </td>

                <td style={tdStyle}>
                  <span
                    style={{
                      background:
                        item.jenis === "Cost"
                          ? "#fee2e2"
                          : "#dcfce7",

                      color:
                        item.jenis === "Cost"
                          ? "#dc2626"
                          : "#15803d",

                      padding: "4px 10px",
                      borderRadius: "20px",
                      fontSize: "13px",
                      fontWeight: 600,
                    }}
                  >
                    {item.jenis}
                  </span>
                </td>

                <td style={tdStyle}>
                  {item.sumber}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

            <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
          gap: "24px",
          marginBottom: 0,
        }}
      >

  {/* Harga */}

  <div style={cardStyle}>
    <h3
      style={{
        marginTop: 0,
        color: "#1f2937",
      }}
    >
      Harga Seminar
    </h3>

    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
      }}
    >
      <thead>
        <tr>
          <th style={thStyle}>Rentang Harga</th>
          <th style={thStyle}>Nilai</th>
        </tr>
      </thead>

      <tbody>
        {subKriteria
          .filter((item: any) => item.jenis === "Harga")
          .map((item: any) => (
            <tr key={item.id}>
              <td style={tdStyle}>{item.nama}</td>

              <td
                style={{
                  ...tdStyle,
                  color: "#8b1e2b",
                  fontWeight: "bold",
                }}
              >
                {item.nilai}
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  </div>

  {/* Kuota */}

  <div style={cardStyle}>
    <h3
      style={{
        marginTop: 0,
        color: "#1f2937",
      }}
    >
       Kuota Seminar
    </h3>

    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
      }}
    >
      <thead>
        <tr>
          <th style={thStyle}>Kuota</th>
          <th style={thStyle}>Nilai</th>
        </tr>
      </thead>

      <tbody>
        {subKriteria
          .filter((item: any) => item.jenis === "Kuota")
          .map((item: any) => (
            <tr key={item.id}>
              <td style={tdStyle}>{item.nama}</td>

              <td
                style={{
                  ...tdStyle,
                  color: "#8b1e2b",
                  fontWeight: "bold",
                }}
              >
                {item.nilai}
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  </div>

        {/* Rating */}

        <div style={cardStyle}>
          <h3
            style={{
              marginTop: 0,
              color: "#1f2937",
            }}
          >
            Rating Speaker
          </h3>

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr>
                <th style={thStyle}>Rating</th>
                <th style={thStyle}>Nilai</th>
              </tr>
            </thead>

            <tbody>
              {subKriteria
          .filter((item:any)=>item.jenis==="Rating")
          .map((item:any)=>(
                <tr key={item.nama}>
                  <td style={tdStyle}>{item.nama}</td>

                  <td
                    style={{
                      ...tdStyle,
                      fontWeight: "bold",
                      color: "#8b1e2b",
                    }}
                  >
                    {item.nilai}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Level */}

        <div style={cardStyle}>
          <h3
            style={{
              marginTop: 0,
              color: "#1f2937",
            }}
          >
            Level Seminar
          </h3>

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr>
                <th style={thStyle}>Level</th>
                <th style={thStyle}>Nilai</th>
              </tr>
            </thead>

            <tbody>
              {subKriteria
.filter((item:any)=>item.jenis==="Level")
.map((item:any)=>(
                <tr key={item.nama}>
                  <td style={tdStyle}>{item.nama}</td>

                  <td
                    style={{
                      ...tdStyle,
                      fontWeight: "bold",
                      color: "#8b1e2b",
                    }}
                  >
                    {item.nilai}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Fasilitas */}

        <div style={cardStyle}>
          <h3
            style={{
              marginTop: 0,
              color: "#1f2937",
            }}
          >
            Fasilitas
          </h3>

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr>
                <th style={thStyle}>Jumlah</th>
                <th style={thStyle}>Nilai</th>
              </tr>
            </thead>

            <tbody>
              {subKriteria
.filter((item:any)=>item.jenis==="Fasilitas")
.map((item:any)=>(
                <tr key={item.nama}>
                  <td style={tdStyle}>{item.nama}</td>

                  <td
                    style={{
                      ...tdStyle,
                      fontWeight: "bold",
                      color: "#8b1e2b",
                    }}
                  >
                    {item.nilai}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      

            {/* ===========================
          METODE SPK
      =========================== */}

      <div
        style={{
          ...cardStyle,
          marginBottom: 0,
        }}
      >
        <h2
          style={{
            marginTop: 0,
            marginBottom: "20px",
            color: "#8b1e2b",
          }}
        >
          Metode Perhitungan SPK
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: "20px",
          }}
        >
          {metode.map((item) => (
            <div
              key={item.nama}
            style={{
                border: "1px solid rgba(139,30,43,.1)",
                borderRadius: "8px",
                padding: "20px",
                background: "#fff7f8",
              }}
            >
              <h3
                style={{
                  color: "#8b1e2b",
                  marginTop: 0,
                }}
              >
                {item.nama}
              </h3>

              <p
                style={{
                  color: "#6b7280",
                  lineHeight: "24px",
                  marginBottom: 0,
                }}
              >
                {item.deskripsi}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ===========================
          ALUR PERHITUNGAN
      =========================== */}

      <div style={cardStyle}>
        <h2
          style={{
            marginTop: 0,
            color: "#8b1e2b",
          }}
        >
          Alur Perhitungan Sistem
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: "20px",
            marginTop: "25px",
          }}
        >
          <div
            style={{
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                background: "#8b1e2b",
                color: "white",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                margin: "auto",
                fontWeight: "bold",
                fontSize: "20px",
              }}
            >
              1
            </div>

            <p
              style={{
                marginTop: "15px",
                color: "#374151",
              }}
            >
              User memilih bobot setiap kriteria.
            </p>
          </div>

          <div
            style={{
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                background: "#8b1e2b",
                color: "white",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                margin: "auto",
                fontWeight: "bold",
                fontSize: "20px",
              }}
            >
              2
            </div>

            <p
              style={{
                marginTop: "15px",
                color: "#374151",
              }}
            >
              User memilih metode SAW, TOPSIS atau WP.
            </p>
          </div>

          <div
            style={{
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                background: "#8b1e2b",
                color: "white",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                margin: "auto",
                fontWeight: "bold",
                fontSize: "20px",
              }}
            >
              3
            </div>

            <p
              style={{
                marginTop: "15px",
                color: "#374151",
              }}
            >
              Sistem melakukan normalisasi dan perhitungan otomatis.
            </p>
          </div>

          <div
            style={{
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                background: "#8b1e2b",
                color: "white",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                margin: "auto",
                fontWeight: "bold",
                fontSize: "20px",
              }}
            >
              4
            </div>

            <p
              style={{
                marginTop: "15px",
                color: "#374151",
              }}
            >
              Sistem menampilkan ranking rekomendasi seminar terbaik.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default PerhitunganSPK;
