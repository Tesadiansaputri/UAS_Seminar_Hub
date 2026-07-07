import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

interface BobotForm {
  bobot_harga: string;
  bobot_kuota: string;
  bobot_rating: string;
  bobot_level: string;
  bobot_fasilitas: string;
}

type Metode = "SAW" | "WP" | "TOPSIS";

const KRITERIA: { key: keyof BobotForm; label: string; desc: string }[] = [
  {
    key: "bobot_harga",
    label: "Harga",
    desc: "Seberapa penting harga seminar bagi kamu",
  },
  {
    key: "bobot_kuota",
    label: "Kuota Tersedia",
    desc: "Seberapa penting ketersediaan kuota/slot",
  },
  {
    key: "bobot_rating",
    label: "Rating Pembicara",
    desc: "Seberapa penting rating pembicara seminar",
  },
  {
    key: "bobot_level",
    label: "Level",
    desc: "Seberapa penting level/tingkat kesulitan seminar (misal: Pemula, Menengah, Lanjutan)",
  },
  {
    key: "bobot_fasilitas",
    label: "Fasilitas",
    desc: "Seberapa penting kelengkapan fasilitas seminar",
  },
];

const METODE_OPTIONS: { value: Metode; label: string; desc: string }[] = [
  {
    value: "SAW",
    label: "SAW (Simple Additive Weighting)",
    desc: "Menjumlahkan nilai kriteria yang sudah dinormalisasi dan diberi bobot",
  },
  {
    value: "WP",
    label: "WP (Weighted Product)",
    desc: "Mengalikan nilai kriteria yang dipangkatkan sesuai bobot",
  },
  {
    value: "TOPSIS",
    label: "TOPSIS",
    desc: "Memilih alternatif terdekat dari solusi ideal positif dan terjauh dari solusi ideal negatif",
  },
];

const initialForm: BobotForm = {
  bobot_harga: "20",
  bobot_kuota: "20",
  bobot_rating: "20",
  bobot_level: "20",
  bobot_fasilitas: "20",
};

const Bobot = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [form, setForm] = useState<BobotForm>(initialForm);
  const [metode, setMetode] = useState<Metode>("SAW");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const total = KRITERIA.reduce(
    (sum, k) => sum + (parseFloat(form[k.key]) || 0),
    0
  );

  const handleChange = (key: keyof BobotForm, value: string) => {
    setError("");
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setForm((prev) => ({ ...prev, [key]: value }));
    }
  };

  const getNormalizedWeights = (): BobotForm => {
    if (total <= 0) return form;

    const normalized: any = {};
    KRITERIA.forEach((k) => {
      const raw = parseFloat(form[k.key]) || 0;
      normalized[k.key] = (raw / total).toFixed(4);
    });
    return normalized;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (total <= 0) {
      setError("Isi minimal satu nilai bobot dulu ya sebelum submit.");
      return;
    }

    if (!user?.id) {
      setError("Sesi kamu tidak valid, silakan login ulang.");
      return;
    }

    setSubmitting(true);
    setError("");

    const normalized = getNormalizedWeights();

    try {
      await api.post("/bobot", {
        userId: user.id,
        bobot_harga: Number(normalized.bobot_harga),
        bobot_kuota: Number(normalized.bobot_kuota),
        bobot_rating: Number(normalized.bobot_rating),
        bobot_level: Number(normalized.bobot_level),
        bobot_fasilitas: Number(normalized.bobot_fasilitas),
      });

      navigate(`/hasil?metode=${metode}`);
    } catch (err: any) {
      setError(
        err?.response?.data?.error ||
          "Gagal menyimpan bobot, silakan coba lagi."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const metodeAktif = METODE_OPTIONS.find((m) => m.value === metode);

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-red-900 mb-2">
            Atur Bobot Preferensi
          </h1>
          <p className="text-gray-600">
            Isi angka seberapa penting tiap kriteria buat kamu (bebas
            berapa aja, gak perlu pas 100 — nanti otomatis disesuaikan).
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-lg p-8"
        >
          <div className="mb-8">
            <label className="font-semibold text-gray-800 block mb-1">
              Metode Perhitungan
            </label>
            <select
              value={metode}
              onChange={(e) => setMetode(e.target.value as Metode)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-900"
            >
              {METODE_OPTIONS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
            {metodeAktif && (
              <p className="text-sm text-gray-500 mt-2">{metodeAktif.desc}</p>
            )}
          </div>

          <div className="space-y-5">
            {KRITERIA.map((k) => {
              const rawValue = parseFloat(form[k.key]) || 0;
              const persen = total > 0 ? (rawValue / total) * 100 : 0;

              return (
                <div key={k.key}>
                  <div className="flex justify-between items-center mb-1">
                    <label className="font-semibold text-gray-800">
                      {k.label}
                    </label>
                    <span className="text-sm text-gray-500">
                      ≈ {persen.toFixed(0)}%
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">{k.desc}</p>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={form[k.key]}
                    onChange={(e) => handleChange(k.key, e.target.value)}
                    placeholder="0"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-900"
                  />
                </div>
              );
            })}
          </div>

          <div className="mt-6 p-4 rounded-lg bg-red-50 text-red-900">
            <p className="text-sm">
              Persentase di samping tiap kolom dihitung otomatis dari
              perbandingan angka yang kamu isi, jadi gak perlu total pas
              100.
            </p>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-6 bg-red-900 text-white py-3 rounded-lg font-bold hover:bg-red-800 disabled:opacity-50"
          >
            {submitting ? "Menyimpan..." : "Cari Rekomendasi"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Bobot;