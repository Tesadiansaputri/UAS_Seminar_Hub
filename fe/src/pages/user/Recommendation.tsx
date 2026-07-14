import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ClipboardList,
  Layers3,
  PieChart,
  SlidersHorizontal,
} from "lucide-react";
import api from "../../services/api";

type Metode = "SAW" | "WP" | "TOPSIS";

interface Kriteria {
  id: number;
  kode: string;
  nama: string;
  jenis: string;
  sumber: string;
}

interface Preference {
  kriteriaId: number;
  bobot: number;
}

const metodeList: Metode[] = ["SAW", "WP", "TOPSIS"];

const bobotList = [
  0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90,
  95, 100,
];

export default function Recommendation() {
  const navigate = useNavigate();

  const [metode, setMetode] = useState<Metode>("SAW");
  const [kriteria, setKriteria] = useState<Kriteria[]>([]);
  const [preferences, setPreferences] = useState<Preference[]>([]);

  useEffect(() => {
    getKriteria();
  }, []);

  const getKriteria = async () => {
    try {
      const res = await api.get("/kriteria");

      setKriteria(res.data);

      setPreferences(
        res.data.map((item: Kriteria) => ({
          kriteriaId: item.id,
          bobot: 0,
        }))
      );
    } catch (err) {
      console.log(err);
    }
  };

  const handleBobot = (index: number, value: number) => {
    const data = [...preferences];

    data[index].bobot = value;

    setPreferences(data);
  };

  const totalBobot = useMemo(() => {
    return preferences.reduce((total, item) => total + item.bobot, 0);
  }, [preferences]);

  const handleSubmit = async () => {
    if (totalBobot !== 100) {
      alert("Total bobot harus tepat 100%");
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      await api.post("/bobot", {
        userId: user.id,

        bobot_harga:
          preferences.find(
            (p) =>
              kriteria.find((k) => k.id === p.kriteriaId)?.nama === "Harga"
          )?.bobot || 0,

        bobot_kuota:
          preferences.find(
            (p) =>
              kriteria.find((k) => k.id === p.kriteriaId)?.nama === "Kuota"
          )?.bobot || 0,

        bobot_rating:
          preferences.find(
            (p) =>
              kriteria.find((k) => k.id === p.kriteriaId)?.nama ===
              "Rating Pembicara"
          )?.bobot || 0,

        bobot_level:
          preferences.find(
            (p) =>
              kriteria.find((k) => k.id === p.kriteriaId)?.nama ===
              "Level Seminar"
          )?.bobot || 0,

        bobot_fasilitas:
          preferences.find(
            (p) =>
              kriteria.find((k) => k.id === p.kriteriaId)?.nama === "Fasilitas"
          )?.bobot || 0,
      });

      navigate(`/hasil?metode=${metode}`);
    } catch (err) {
      console.log(err);

      alert("Gagal menyimpan bobot.");
    }
  };

  return (
    <div className="overflow-hidden rounded-lg border border-red-100 bg-white shadow-[0_18px_45px_rgba(139,30,43,0.08)]">
      <section className="relative overflow-hidden bg-gradient-to-br from-[#7f1020] via-[#9f1a2c] to-[#d93456] px-6 py-12 text-white sm:px-10 lg:px-14">
        <div className="absolute -right-24 -top-36 h-80 w-80 rounded-full bg-white/20 blur-3xl" />
        <div className="absolute -bottom-36 left-12 h-72 w-72 rounded-full bg-rose-200/20 blur-3xl" />

        <div className="relative z-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold">
              <SlidersHorizontal size={15} />
              Preferensi Rekomendasi Seminar
            </div>

            <h1 className="max-w-3xl text-4xl font-black leading-tight sm:text-5xl">
              Preferensi Rekomendasi Seminar
            </h1>

            <p className="mt-5 max-w-2xl text-base font-medium leading-8 text-white/90">
              Silakan pilih metode perhitungan kemudian tentukan bobot
              kepentingan untuk setiap kriteria.
            </p>
          </div>

          <div className="rounded-lg border border-white/20 bg-white/10 p-5 shadow-inner backdrop-blur">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-white/75">Total Bobot</p>
                <p className="mt-1 text-4xl font-black">{totalBobot}%</p>
              </div>
              <PieChart size={42} className="text-white/85" />
            </div>

            <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/20">
              <div
                className={`h-3 rounded-full transition-all duration-500 ${
                  totalBobot === 100 ? "bg-emerald-300" : "bg-white"
                }`}
                style={{
                  width: `${Math.min(totalBobot, 100)}%`,
                }}
              />
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-8 px-6 py-10 sm:px-10 lg:grid-cols-[0.86fr_1.14fr] lg:px-14">
        <aside className="space-y-6">
          <div className="rounded-lg border border-red-100 bg-red-50 p-6">
            <label className="flex items-center gap-2 text-sm font-black text-[#8b1e2b]">
              <Layers3 size={18} />
              Metode Perhitungan
            </label>

            <select
              value={metode}
              onChange={(e) => setMetode(e.target.value as Metode)}
              className="mt-4 min-h-12 w-full rounded-lg border border-red-100 bg-white px-4 font-bold text-gray-800 outline-none transition focus:border-[#b51f35] focus:ring-4 focus:ring-red-100"
            >
              {metodeList.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-lg border border-red-100 bg-white p-6 shadow-[0_14px_28px_rgba(139,30,43,0.07)]">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-[#b51f35]">
                <ClipboardList size={22} />
              </div>
              <h2 className="text-xl font-black text-[#8b1e2b]">
                Ringkasan Bobot
              </h2>
            </div>

            <div className="space-y-3">
              {preferences.map((item, index) => (
                <div
                  key={item.kriteriaId}
                  className="flex items-center justify-between gap-4 border-b border-gray-100 pb-3 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="font-bold text-gray-900">
                      {kriteria[index]?.nama}
                    </p>
                    <p className="text-sm font-medium text-gray-500">
                      {kriteria[index]?.jenis}
                    </p>
                  </div>

                  <div className="rounded-full bg-red-50 px-3 py-1 font-black text-[#8b1e2b]">
                    {item.bobot}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-red-100 bg-white p-6 shadow-[0_14px_28px_rgba(139,30,43,0.07)]">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-xl font-black text-[#8b1e2b]">
                Total Bobot
              </h2>

              <span
                className={`text-lg font-black ${
                  totalBobot === 100 ? "text-green-600" : "text-red-600"
                }`}
              >
                {totalBobot}%
              </span>
            </div>

            <div className="h-4 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                className={`h-4 rounded-full transition-all duration-500 ${
                  totalBobot === 100 ? "bg-green-500" : "bg-red-700"
                }`}
                style={{
                  width: `${Math.min(totalBobot, 100)}%`,
                }}
              />
            </div>

            {totalBobot === 100 ? (
              <p className="mt-3 flex items-center gap-2 font-bold text-green-600">
                <CheckCircle2 size={18} />
                Total bobot sudah sesuai.
              </p>
            ) : (
              <p className="mt-3 font-bold text-red-600">
                Total bobot harus tepat 100%.
              </p>
            )}
          </div>
        </aside>

        <main>
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-[#b51f35]">
              <BarChart3 size={22} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-950">
                Bobot Kepentingan
              </h2>
              <p className="text-sm font-medium text-gray-500">
                Atur nilai setiap kriteria agar totalnya tepat 100%.
              </p>
            </div>
          </div>

          <div className="grid gap-5">
            {kriteria.map((item, index) => (
              <article
                key={item.id}
                className="rounded-lg border border-red-100 bg-white p-6 shadow-[0_14px_28px_rgba(139,30,43,0.07)]"
              >
                <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-black text-[#8b1e2b]">
                      {item.kode} - {item.nama}
                    </h2>

                    <p className="mt-2 text-gray-500">
                      Jenis :<b> {item.jenis}</b>
                    </p>

                    <p className="text-gray-500">Sumber : {item.sumber}</p>
                  </div>

                  <span className="rounded-full bg-red-50 px-4 py-2 text-sm font-black text-[#8b1e2b]">
                    {preferences[index]?.bobot ?? 0}%
                  </span>
                </div>

                <label className="font-bold text-gray-800">
                  Bobot Kepentingan
                </label>

                <select
                  value={preferences[index]?.bobot}
                  onChange={(e) => handleBobot(index, Number(e.target.value))}
                  className="mt-2 min-h-12 w-full rounded-lg border border-gray-200 bg-white px-4 font-bold text-gray-800 outline-none transition focus:border-[#b51f35] focus:ring-4 focus:ring-red-100"
                >
                  {bobotList.map((b) => (
                    <option key={b} value={b}>
                      {b}%
                    </option>
                  ))}
                </select>
              </article>
            ))}
          </div>

          <button
            onClick={handleSubmit}
            disabled={totalBobot !== 100}
            className={`mt-8 flex min-h-14 w-full items-center justify-center gap-2 rounded-lg text-lg font-black transition ${
              totalBobot === 100
                ? "bg-[#8b1e2b] text-white shadow-[0_16px_34px_rgba(139,30,43,0.22)] hover:bg-[#741622]"
                : "cursor-not-allowed bg-gray-300 text-gray-500"
            }`}
          >
            Cari Rekomendasi
            <ArrowRight size={19} />
          </button>
        </main>
      </div>
    </div>
  );
}
