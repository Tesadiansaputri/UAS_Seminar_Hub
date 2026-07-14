import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  BookOpen,
  Boxes,
  BrainCircuit,
  CircleDollarSign,
  Layers3,
  Loader2,
  Sparkles,
  Users,
} from "lucide-react";
import api from "../../services/api";

interface Seminar {
  id: number;
  seminar_name: string;
  harga: string;
  kuota_tersedia: number;
  category: {
    category_name: string;
  };
  level: {
    nama_level: string;
  };
}

const methodCards = [
  {
    title: "SAW",
    text: "Menghasilkan rekomendasi berdasarkan penjumlahan berbobot setiap kriteria.",
    icon: BarChart3,
  },
  {
    title: "Weighted Product",
    text: "Menggunakan perkalian nilai setiap kriteria sesuai bobot preferensi.",
    icon: Boxes,
  },
  {
    title: "TOPSIS",
    text: "Memilih seminar terbaik berdasarkan solusi ideal positif dan negatif.",
    icon: BrainCircuit,
  },
];

const Home = () => {
  const navigate = useNavigate();

  const [seminars, setSeminars] = useState<Seminar[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSeminar();
  }, []);

  const getSeminar = async () => {
    try {
      const res = await api.get("/seminar");

      setSeminars(res.data.slice(0, 3));
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-lg border border-red-100 bg-white shadow-[0_18px_45px_rgba(139,30,43,0.08)]">
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#7f1020] via-[#9f1a2c] to-[#d93456] px-6 py-16 text-white sm:px-10 lg:px-14">
        <div className="absolute -right-24 -top-32 h-80 w-80 rounded-full bg-white/20 blur-3xl" />
        <div className="absolute -bottom-36 left-1/2 h-72 w-[34rem] -translate-x-1/2 rounded-full bg-rose-200/20 blur-3xl" />

        <div className="relative z-10 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold">
              <Sparkles size={15} />
              Platform Rekomendasi Seminar
            </div>

            <h1 className="max-w-3xl text-4xl font-black leading-tight sm:text-5xl">
              Temukan Seminar Terbaik
            </h1>

            <p className="mt-5 max-w-2xl text-base font-medium leading-8 text-white/90 sm:text-lg">
              Sistem Pendukung Keputusan menggunakan metode SAW, WP dan TOPSIS.
            </p>

            <button
              onClick={() => navigate("/recommendation")}
              className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-white px-7 font-extrabold text-[#8b1e2b] shadow-[0_16px_35px_rgba(88,8,22,0.22)] transition hover:bg-rose-50"
            >
              Cari Rekomendasi
              <ArrowRight size={17} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { value: seminars.length, label: "Seminar Ditampilkan", icon: BookOpen },
              { value: 3, label: "Metode SPK", icon: Layers3 },
              { value: "SAW", label: "Metode 1", icon: BadgeCheck },
              { value: "WP & TOPSIS", label: "Metode Lainnya", icon: BrainCircuit },
            ].map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.label}
                  className="min-h-28 rounded-lg border border-white/20 bg-white/10 p-5 shadow-inner backdrop-blur"
                >
                  <Icon size={22} className="mb-4 text-white/85" />
                  <h2 className="text-2xl font-black text-white">
                    {stat.value}
                  </h2>
                  <p className="mt-2 text-sm font-semibold text-white/75">
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Seminar */}
      <section className="px-6 py-12 sm:px-10 lg:px-14">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-wide text-[#b51f35]">
              Koleksi Pilihan
            </p>
            <h2 className="mt-2 text-3xl font-black text-gray-950">
              Seminar Terbaru
            </h2>
          </div>

          <button
            onClick={() => navigate("/seminar")}
            className="inline-flex min-h-10 items-center gap-2 rounded-full border border-red-100 bg-red-50 px-5 text-sm font-extrabold text-[#b51f35] transition hover:bg-red-100"
          >
            Lihat Semua Seminar
            <ArrowRight size={15} />
          </button>
        </div>

        {loading ? (
          <div className="flex min-h-40 items-center justify-center gap-3 rounded-lg border border-red-100 bg-red-50 font-bold text-[#8b1e2b]">
            <Loader2 size={22} className="animate-spin" />
            Loading...
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {seminars.map((item) => (
              <article
                key={item.id}
                className="overflow-hidden rounded-lg border border-red-100 bg-white shadow-[0_16px_34px_rgba(139,30,43,0.09)] transition hover:-translate-y-1 hover:shadow-[0_24px_42px_rgba(139,30,43,0.13)]"
              >
                <div className="bg-[#b51f35] px-5 py-4 text-white">
                  <span className="text-xs font-black uppercase text-white/75">
                    {item.category.category_name}
                  </span>
                  <h3 className="mt-2 min-h-14 text-xl font-black leading-snug">
                    {item.seminar_name}
                  </h3>
                </div>

                <div className="p-5">
                  <div className="space-y-3 text-sm text-gray-600">
                    <p className="flex items-center justify-between gap-4 border-b border-gray-100 pb-3">
                      <span className="font-semibold text-gray-500">Kategori :</span>
                      <span className="text-right font-bold text-gray-900">
                        {item.category.category_name}
                      </span>
                    </p>

                    <p className="flex items-center justify-between gap-4 border-b border-gray-100 pb-3">
                      <span className="font-semibold text-gray-500">Level :</span>
                      <span className="text-right font-bold text-gray-900">
                        {item.level.nama_level}
                      </span>
                    </p>

                    <p className="flex items-center justify-between gap-4 border-b border-gray-100 pb-3">
                      <span className="inline-flex items-center gap-1 font-semibold text-gray-500">
                        <CircleDollarSign size={15} />
                        Harga :
                      </span>
                      <span className="text-right font-black text-[#b51f35]">
                        Rp {Number(item.harga).toLocaleString("id-ID")}
                      </span>
                    </p>

                    <p className="flex items-center justify-between gap-4">
                      <span className="inline-flex items-center gap-1 font-semibold text-gray-500">
                        <Users size={15} />
                        Kuota :
                      </span>
                      <span className="rounded-full bg-red-50 px-3 py-1 text-right font-black text-[#8b1e2b]">
                        {item.kuota_tersedia}
                      </span>
                    </p>
                  </div>

                  <button
                    onClick={() => navigate("/seminar")}
                    className="mt-6 flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#8b1e2b] font-extrabold text-white transition hover:bg-[#741622]"
                  >
                    Lihat Detail
                    <ArrowRight size={15} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="bg-gradient-to-b from-white to-red-50 px-6 pb-14 sm:px-10 lg:px-14">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-extrabold uppercase tracking-wide text-[#b51f35]">
            Metode Rekomendasi
          </p>
          <h2 className="mt-2 text-3xl font-black text-gray-950">
            Mengapa Menggunakan Platform Ini?
          </h2>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {methodCards.map((method) => {
            const Icon = method.icon;

            return (
              <article
                key={method.title}
                className="rounded-lg border border-red-100 bg-white p-6 shadow-[0_16px_32px_rgba(139,30,43,0.08)]"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-[#b51f35]">
                  <Icon size={24} />
                </div>
                <h3 className="text-xl font-black text-[#8b1e2b]">
                  {method.title}
                </h3>
                <p className="mt-3 text-sm font-medium leading-6 text-gray-600">
                  {method.text}
                </p>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Home;
