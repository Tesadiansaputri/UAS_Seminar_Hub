import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  CircleDollarSign,
  Crown,
  Loader2,
  Medal,
  SlidersHorizontal,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";
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
      const res = await api.get(`/hasil/hitung/${user.id}?metode=${metode}`);

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
      <div className="flex min-h-[60vh] items-center justify-center rounded-lg border border-red-100 bg-white shadow-[0_18px_45px_rgba(139,30,43,0.08)]">
        <div className="text-center">
          <div className="user-ring-pulse mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-[#8b1e2b]">
            <Loader2 size={30} className="animate-spin" />
          </div>
          <p className="font-black text-[#8b1e2b]">
            Menghitung rekomendasi...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-red-100 bg-white shadow-[0_18px_45px_rgba(139,30,43,0.08)]">
      <section className="user-shine relative overflow-hidden bg-gradient-to-br from-[#7f1020] via-[#9f1a2c] to-[#d93456] px-6 py-12 text-white sm:px-10 lg:px-14">
        <div className="absolute -right-24 -top-32 h-80 w-80 rounded-full bg-white/20 blur-3xl" />
        <div className="absolute -bottom-32 left-10 h-72 w-72 rounded-full bg-rose-200/20 blur-3xl" />

        <div className="relative z-10 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div className="user-fade-in">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold">
              <Sparkles size={15} />
              Hasil Rekomendasi
            </div>

            <h1 className="max-w-3xl text-4xl font-black leading-tight sm:text-5xl">
              Hasil Rekomendasi
            </h1>

            <p className="mt-5 max-w-2xl text-base font-medium leading-8 text-white/90">
              Menggunakan metode {METODE_LABEL[metode] || metode}
            </p>

            <button
              onClick={() => navigate("/recommendation")}
              className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-white px-6 font-extrabold text-[#8b1e2b] shadow-[0_16px_35px_rgba(88,8,22,0.22)] transition hover:bg-rose-50"
            >
              <SlidersHorizontal size={17} />
              Ubah Bobot
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { value: hasil.length, label: "Alternatif", icon: BarChart3 },
              { value: metode, label: "Metode", icon: Trophy },
            ].map((stat, index) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.label}
                  className="user-rise-card rounded-lg border border-white/20 bg-white/10 p-5 shadow-inner backdrop-blur"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <Icon size={24} className="mb-4 text-white/85" />
                  <p className="text-2xl font-black">{stat.value}</p>
                  <p className="mt-2 text-sm font-bold text-white/75">
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-6 py-10 sm:px-10 lg:px-14">
        {error && (
          <div className="user-fade-in mb-6 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-5 font-bold text-red-700">
            <AlertTriangle size={22} />
            {error}
          </div>
        )}

        {!error && hasil.length === 0 && (
          <div className="user-fade-in rounded-lg border border-red-100 bg-red-50 p-10 text-center font-bold text-gray-500">
            Belum ada data seminar untuk dihitung.
          </div>
        )}

        {hasil.length > 0 && (
          <div className="space-y-6">
            {hasil[0] && (
              <div className="user-rise-card relative overflow-hidden rounded-lg border border-yellow-200 bg-gradient-to-r from-yellow-50 via-white to-red-50 p-6 shadow-[0_18px_40px_rgba(139,30,43,0.08)]">
                <div className="absolute -right-10 -top-12 h-32 w-32 rounded-full bg-yellow-200/40 blur-2xl" />
                <div className="relative z-10 flex flex-wrap items-center justify-between gap-5">
                  <div className="flex items-center gap-4">
                    <div className="user-float-soft flex h-14 w-14 items-center justify-center rounded-full bg-yellow-100 text-yellow-600">
                      <Crown size={28} />
                    </div>
                    <div>
                      <p className="font-black text-gray-800">
                        Rekomendasi Terbaik:{" "}
                        {hasil[0].seminar.seminar_name}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-gray-600">
                        Nilai {metode} tertinggi: {hasil[0].nilai.toFixed(4)}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate("/seminars")}
                    className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#8b1e2b] px-5 font-extrabold text-white transition hover:bg-[#741622]"
                  >
                    Lihat Seminar
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            <div className="user-rise-card overflow-hidden rounded-lg border border-red-100 bg-white shadow-[0_18px_40px_rgba(139,30,43,0.08)]">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[860px] border-collapse">
                  <thead>
                    <tr className="bg-red-50">
                      <th className="px-5 py-4 text-left text-sm font-black text-gray-600">
                        Ranking
                      </th>
                      <th className="px-5 py-4 text-left text-sm font-black text-gray-600">
                        Seminar
                      </th>
                      <th className="px-5 py-4 text-left text-sm font-black text-gray-600">
                        Kategori
                      </th>
                      <th className="px-5 py-4 text-left text-sm font-black text-gray-600">
                        Level
                      </th>
                      <th className="px-5 py-4 text-left text-sm font-black text-gray-600">
                        Harga
                      </th>
                      <th className="px-5 py-4 text-left text-sm font-black text-gray-600">
                        Kuota
                      </th>
                      <th className="px-5 py-4 text-left text-sm font-black text-gray-600">
                        Nilai
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {hasil.map((h, index) => (
                      <tr
                        key={h.id}
                        className={`user-rise-card border-b border-gray-100 transition hover:bg-red-50/50 ${
                          h.ranking === 1 ? "bg-yellow-50/70" : ""
                        }`}
                        style={{ animationDelay: `${index * 65}ms` }}
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-black text-white shadow-lg"
                              style={{ backgroundColor: medalColor(h.ranking) }}
                            >
                              {h.ranking}
                            </div>
                            {h.ranking <= 3 && (
                              <Medal size={18} className="text-yellow-600" />
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-4 font-black text-gray-800">
                          {h.seminar.seminar_name}
                        </td>
                        <td className="px-5 py-4 text-sm font-semibold text-gray-600">
                          {h.seminar.category.category_name}
                        </td>
                        <td className="px-5 py-4 text-sm font-semibold text-gray-600">
                          {h.seminar.level.nama_level}
                        </td>
                        <td className="px-5 py-4 text-sm font-semibold text-gray-600">
                          <span className="inline-flex items-center gap-1">
                            <CircleDollarSign size={15} />
                            Rp{" "}
                            {Number(h.seminar.harga).toLocaleString("id-ID")}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-sm font-semibold text-gray-600">
                          <span className="inline-flex items-center gap-1">
                            <Users size={15} />
                            {h.seminar.kuota_tersedia}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`rounded-full px-3 py-1 font-black ${
                              h.ranking === 1
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-50 text-[#8b1e2b]"
                            }`}
                          >
                            {h.nilai.toFixed(4)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default Hasil;
