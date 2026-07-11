import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

interface HasilItem {
  id: number;
  seminarId: number;
  metode: string;
  nilai: number;
  ranking: number;
  seminar: {
    seminar_name: string;
    harga: string;
    kuota_tersedia: number;
    category: { category_name: string };
    level: { nama_level: string };
  };
}

const METODE_LABEL: Record<string, string> = {
  SAW: "SAW (Simple Additive Weighting)",
  WP: "WP (Weighted Product)",
  TOPSIS: "TOPSIS",
};

const medalColor = (rank: number) => {
  if (rank === 1) return "#f59e0b";
  if (rank === 2) return "#9ca3af";
  if (rank === 3) return "#b45309";
  return "#d1d5db";
};

const Hasil = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const metode = (searchParams.get("metode") || "SAW").toUpperCase();

  const [hasil, setHasil] = useState<HasilItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchHasil();
  }, [metode]);

  const fetchHasil = async () => {
    if (!user?.id) {
      setError("Sesi kamu tidak valid, silakan login ulang.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await api.get(
  `/hasil/hitung/${user.id}?metode=${metode}`
);

setHasil(res.data.data);
    } catch (err: any) {
      setError(
        err?.response?.data?.error ||
          "Gagal mengambil hasil rekomendasi. Pastikan kamu sudah mengisi bobot."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-red-900 font-semibold">Menghitung rekomendasi...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-red-900 mb-1">
              Hasil Rekomendasi
            </h1>
            <p className="text-gray-600">
              Menggunakan metode {METODE_LABEL[metode] || metode}
            </p>
          </div>
          <button
            onClick={() => navigate("/recommendation")}
            className="bg-white border border-red-900 text-red-900 px-5 py-2.5 rounded-lg font-semibold hover:bg-red-50"
          >
            Ubah Bobot
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {!error && hasil.length === 0 && (
          <div className="bg-white rounded-xl shadow p-10 text-center text-gray-500">
            Belum ada data seminar untuk dihitung.
          </div>
        )}

        {hasil.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-red-50">
                  <th className="px-5 py-3 text-left text-sm font-semibold text-gray-600">
                    Ranking
                  </th>
                  <th className="px-5 py-3 text-left text-sm font-semibold text-gray-600">
                    Seminar
                  </th>
                  <th className="px-5 py-3 text-left text-sm font-semibold text-gray-600">
                    Kategori
                  </th>
                  <th className="px-5 py-3 text-left text-sm font-semibold text-gray-600">
                    Level
                  </th>
                  <th className="px-5 py-3 text-left text-sm font-semibold text-gray-600">
                    Harga
                  </th>
                  <th className="px-5 py-3 text-left text-sm font-semibold text-gray-600">
                    Kuota
                  </th>
                  <th className="px-5 py-3 text-left text-sm font-semibold text-gray-600">
                    Nilai
                  </th>
                </tr>
              </thead>
              <tbody>
                {hasil.map((h) => (
                  <tr
                    key={h.id}
                    className={`border-b border-gray-100 ${
                      h.ranking === 1 ? "bg-yellow-50" : ""
                    }`}
                  >
                    <td className="px-5 py-4">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                        style={{ backgroundColor: medalColor(h.ranking) }}
                      >
                        {h.ranking}
                      </div>
                    </td>
                    <td className="px-5 py-4 font-semibold text-gray-800">
                      {h.seminar.seminar_name}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">
                      {h.seminar.category.category_name}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">
                      {h.seminar.level.nama_level}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">
                      Rp {Number(h.seminar.harga).toLocaleString("id-ID")}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">
                      {h.seminar.kuota_tersedia}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`font-bold ${
                          h.ranking === 1 ? "text-yellow-600" : "text-red-900"
                        }`}
                      >
                        {h.nilai.toFixed(4)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {hasil[0] && (
              <div className="m-6 p-5 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="font-bold text-gray-800">
                  Rekomendasi Terbaik: {hasil[0].seminar.seminar_name}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Nilai {metode} tertinggi: {hasil[0].nilai.toFixed(4)}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Hasil;