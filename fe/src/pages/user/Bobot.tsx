import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

type Metode = "SAW" | "WP" | "TOPSIS";

interface Kriteria {
  id: number;
  nama: string;
  icon: string;
  subKriteria: string[];
}

interface Preference {
  kriteriaId: number;
  subKriteria: string;
  bobot: number;
}

const kriteriaData: Kriteria[] = [
  {
    id: 1,
    nama: "Harga",
    icon: "",
    subKriteria: [
      "≤ Rp75.000",
      "Rp100.000 - Rp150.000",
      "Rp175.000 - Rp200.000",
      "≥ Rp250.000",
    ],
  },
  {
    id: 2,
    nama: "Kuota",
    icon: "",
    subKriteria: [
      "< 50 Peserta",
      "50 - 79 Peserta",
      "80 - 119 Peserta",
      "120 - 149 Peserta",
      "> 150 Peserta",
    ],
  },
  {
    id: 3,
    nama: "Rating Pembicara",
    icon: "",
    subKriteria: [
      "< 4.0",
      "4.1 - 4.3",
      "4.4 - 4.6",
      "4.7 - 4.9",
      "5.0",
    ],
  },
  {
    id: 4,
    nama: "Level Seminar",
    icon: "",
    subKriteria: [
      "Lokal",
      "Regional",
      "Nasional",
      "Internasional",
    ],
  },
  {
    id: 5,
    nama: "Fasilitas",
    icon: "",
    subKriteria: [
      "Tidak Lengkap",
      "Kurang Lengkap",
      "Cukup Lengkap",
      "Lengkap",
      "Sangat Lengkap",
    ],
  },
];

const metodeList: Metode[] = ["SAW", "WP", "TOPSIS"];

const bobotList = [
  0,
  5,
  10,
  15,
  20,
  25,
  30,
  35,
  40,
  45,
  50,
  55,
  60,
  65,
  70,
  75,
  80,
  85,
  90,
  95,
  100,
];

export default function Recommendation() {
  const navigate = useNavigate();

  const [metode, setMetode] = useState<Metode>("SAW");

  const [preferences, setPreferences] = useState<Preference[]>(
  kriteriaData.map((item) => ({
    kriteriaId: item.id,
    subKriteria: "",
    bobot: 0,
  }))
);
  const handleSubKriteria = (
    index: number,
    value: string
  ) => {
    const data = [...preferences];
    data[index].subKriteria = value;
    setPreferences(data);
  };

  const handleBobot = (
    index: number,
    value: number
  ) => {
    const data = [...preferences];
    data[index].bobot = value;
    setPreferences(data);
  };

  const totalBobot = useMemo(() => {
    return preferences.reduce(
      (total, item) => total + item.bobot,
      0
    );
  }, [preferences]);

  const semuaSubTerpilih = preferences.every(
    (item) => item.subKriteria !== ""
  );

  const handleSubmit = () => {
    if (!semuaSubTerpilih) {
      alert("Silakan pilih semua sub kriteria.");
      return;
    }

    if (totalBobot !== 100) {
      alert("Total bobot harus tepat 100%");
      return;
    }

    console.log({
      metode,
      preferences,
    });

    navigate("/hasil");
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-5xl mx-auto px-6">

  {/* Header */}
  <div className="bg-white rounded-2xl shadow-md p-8 mb-8 border border-gray-200">
    <h1 className="text-3xl font-bold text-red-900">
      Preferensi Rekomendasi Seminar
    </h1>

    <p className="text-gray-600 mt-2">
      Tentukan metode, pilih sub kriteria, kemudian atur bobot agar total
      keseluruhannya menjadi <b>100%</b>.
    </p>
  </div>

  {/* Metode */}
  <div className="bg-white rounded-2xl shadow-md p-6 mb-8">

    <label className="block font-semibold text-gray-700 mb-2">
      Metode Perhitungan
    </label>

    <select
      value={metode}
      onChange={(e) => setMetode(e.target.value as Metode)}
      className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-red-800"
    >
      {metodeList.map((item) => (
        <option key={item} value={item}>
          {item}
        </option>
      ))}
    </select>

  </div>

  {/* Kriteria */}
  <div className="space-y-6">

    {kriteriaData.map((item, index) => (

      <div
        key={item.id}
        className="bg-white rounded-2xl shadow-md p-6"
      >

        <div className="flex items-center gap-3 mb-5">

          <span className="text-3xl">
            {item.icon}
          </span>

          <div>

            <h2 className="font-bold text-xl text-red-900">
              {item.nama}
            </h2>

            <p className="text-gray-500 text-sm">
              Tentukan preferensi untuk kriteria ini.
            </p>

          </div>

        </div>

        {/* Dropdown Sub Kriteria */}

        <div className="mb-5">

          <label className="font-medium text-gray-700">
            Sub Kriteria
          </label>

          <select
            value={preferences[index].subKriteria}
            onChange={(e) =>
              handleSubKriteria(index, e.target.value)
            }
            className="w-full mt-2 border rounded-lg p-3"
          >

            <option value="">
              -- Pilih Sub Kriteria --
            </option>

            {item.subKriteria.map((sub) => (

              <option
                key={sub}
                value={sub}
              >
                {sub}
              </option>

            ))}

          </select>

        </div>

        {/* Dropdown Bobot */}

        <div>

          <label className="font-medium text-gray-700">
            Bobot Kepentingan
          </label>

          <select
            value={preferences[index].bobot}
            onChange={(e) =>
              handleBobot(index, Number(e.target.value))
            }
            className="w-full mt-2 border rounded-lg p-3"
          >

            {bobotList.map((item) => (

              <option
                key={item}
                value={item}
              >
                {item}%
              </option>

            ))}

          </select>

        </div>

      </div>

    ))}

  </div>
        {/* Total Bobot */}
      <div className="mt-8 bg-white rounded-2xl shadow-md p-6">

        <div className="flex justify-between items-center mb-3">

          <h2 className="text-xl font-bold text-red-900">
            Total Bobot
          </h2>

          <span
            className={`text-lg font-bold ${
              totalBobot === 100
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {totalBobot}%
          </span>

        </div>

        {/* Progress Bar */}

        <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">

          <div
            className={`h-4 transition-all duration-500 ${
              totalBobot === 100
                ? "bg-green-500"
                : "bg-red-700"
            }`}
            style={{
              width: `${Math.min(totalBobot,100)}%`,
            }}
          />

        </div>

        {totalBobot === 100 ? (

          <p className="text-green-600 mt-3 font-medium">
            ✓ Total bobot sudah sesuai.
          </p>

        ) : (

          <p className="text-red-600 mt-3 font-medium">
            Total bobot harus tepat 100%.
          </p>

        )}

      </div>

      {/* Ringkasan */}
      <div className="bg-white rounded-2xl shadow-md p-6 mt-8">

        <h2 className="text-xl font-bold text-red-900 mb-4">
          Ringkasan Preferensi
        </h2>

        <div className="space-y-3">

          {preferences.map((item,index)=>{

            const namaKriteria = kriteriaData[index].nama;

            return(

              <div
                key={item.kriteriaId}
                className="flex justify-between border-b pb-2"
              >

                <div>

                  <p className="font-semibold">
                    {namaKriteria}
                  </p>

                  <p className="text-gray-500 text-sm">

                    {item.subKriteria || "-"}

                  </p>

                </div>

                <div className="font-bold text-red-900">

                  {item.bobot}%

                </div>

              </div>

            )

          })}

        </div>

      </div>

      {/* Tombol */}

      <div className="mt-10">

        <button

          onClick={handleSubmit}

          disabled={totalBobot !== 100 || !semuaSubTerpilih}

          className={`w-full py-4 rounded-xl text-lg font-bold transition

          ${
            totalBobot===100 && semuaSubTerpilih

            ? "bg-red-900 hover:bg-red-800 text-white"

            : "bg-gray-300 text-gray-500 cursor-not-allowed"

          }`}

        >

          Cari Rekomendasi

        </button>

      </div>

    </div>
        </div>
  );
}