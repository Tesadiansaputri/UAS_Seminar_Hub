import React from "react";

const kriteria = [
  {
    kode: "C1",
    nama: "Harga",
    jenis: "Cost",
    sumber: "Seminar",
  },
  {
    kode: "C2",
    nama: "Kuota",
    jenis: "Benefit",
    sumber: "Seminar",
  },
  {
    kode: "C3",
    nama: "Rating Speaker",
    jenis: "Benefit",
    sumber: "Speaker",
  },
  {
    kode: "C4",
    nama: "Level",
    jenis: "Benefit",
    sumber: "Level",
  },
  {
    kode: "C5",
    nama: "Fasilitas",
    jenis: "Benefit",
    sumber: "Fasilitas",
  },
];

const KriteriaList = () => {
  return (
    <div>
      <h1
        style={{
          fontSize: "24px",
          fontWeight: "bold",
          marginBottom: "8px",
        }}
      >
        Kelola Kriteria
      </h1>

      <p
        style={{
          color: "#6b7280",
          marginBottom: "24px",
        }}
      >
        Daftar kriteria yang digunakan dalam perhitungan SPK.
      </p>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          background: "#fff",
          borderRadius: "10px",
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
            <th style={{ padding: "12px" }}>Kode</th>
            <th style={{ padding: "12px" }}>Nama Kriteria</th>
            <th style={{ padding: "12px" }}>Jenis</th>
            <th style={{ padding: "12px" }}>Sumber Data</th>
          </tr>
        </thead>

        <tbody>
          {kriteria.map((item) => (
            <tr
              key={item.kode}
              style={{
                textAlign: "center",
                borderBottom: "1px solid #e5e7eb",
              }}
            >
              <td style={{ padding: "12px" }}>{item.kode}</td>
              <td style={{ padding: "12px" }}>{item.nama}</td>
              <td style={{ padding: "12px" }}>{item.jenis}</td>
              <td style={{ padding: "12px" }}>{item.sumber}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default KriteriaList;