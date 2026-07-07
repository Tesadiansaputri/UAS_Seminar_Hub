import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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

const Home = () => {
  const navigate = useNavigate();

  const [seminars, setSeminars] = useState<Seminar[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSeminar();
  }, []);

  const getSeminar = async () => {
    try {
      const res = await api.get("/seminars");

      setSeminars(res.data.slice(0, 3));
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {/* HERO */}

      <div className="bg-red-900 text-white py-20">

        <div className="max-w-6xl mx-auto px-6">

          <h1 className="text-5xl font-bold mb-5">

            Temukan Seminar Terbaik

          </h1>

          <p className="text-xl mb-8">

            Sistem Pendukung Keputusan menggunakan metode
            SAW, WP dan TOPSIS.

          </p>

          <button
            onClick={() => navigate("/bobot")}
            className="bg-white text-red-900 px-8 py-3 rounded-lg font-bold hover:bg-gray-200"
          >
            Cari Rekomendasi
          </button>

        </div>

      </div>

      {/* Statistik */}

      <div className="max-w-6xl mx-auto px-6 -mt-10 mb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <h2 className="text-3xl font-bold text-red-900">
              {seminars.length}
            </h2>
            <p className="text-gray-600 mt-2">
              Seminar Ditampilkan
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <h2 className="text-3xl font-bold text-red-900">
              3
            </h2>
            <p className="text-gray-600 mt-2">
              Metode SPK
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <h2 className="text-3xl font-bold text-red-900">
              SAW
            </h2>
            <p className="text-gray-600 mt-2">
              Metode 1
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <h2 className="text-3xl font-bold text-red-900">
              WP & TOPSIS
            </h2>
            <p className="text-gray-600 mt-2">
              Metode Lainnya
            </p>
          </div>

        </div>
      </div>

      {/* Seminar */}

      <div className="max-w-6xl mx-auto py-12 px-6">

        <h2 className="text-3xl font-bold mb-8">

          Seminar Terbaru

        </h2>

        {
          loading ?

            <p>Loading...</p>

            :

            <div className="grid md:grid-cols-3 gap-6">

              {

                seminars.map((item) => (

                  <div
                    key={item.id}
                    className="bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden"
                  >

                    <div className="bg-red-900 text-white p-4">

                      <h3 className="text-xl font-bold">
                        {item.seminar_name}
                      </h3>

                    </div>

                    <div className="p-5">

                      <p className="mb-2">
                        <span className="font-semibold">
                          Kategori :
                        </span>{" "}
                        {item.category.category_name}
                      </p>

                      <p className="mb-2">
                        <span className="font-semibold">
                          Level :
                        </span>{" "}
                        {item.level.nama_level}
                      </p>

                      <p className="mb-2">
                        <span className="font-semibold">
                          Harga :
                        </span>{" "}
                        Rp {Number(item.harga).toLocaleString("id-ID")}
                      </p>

                      <p className="mb-5">
                        <span className="font-semibold">
                          Kuota :
                        </span>{" "}
                        {item.kuota_tersedia}
                      </p>

                      <button
                        onClick={() => navigate("/seminars")}
                        className="w-full bg-red-900 text-white py-2 rounded-lg hover:bg-red-800"
                      >
                        Lihat Detail
                      </button>

                    </div>

                  </div>

                ))

              }

            </div>

        }

        <div className="text-center mt-10">

          <button
            onClick={() => navigate("/seminars")}
            className="bg-red-900 text-white px-8 py-3 rounded-lg"
          >
            Lihat Semua Seminar
          </button>

        </div>

      </div>
      <div className="mt-20">

        <h2 className="text-3xl font-bold text-center mb-10">
          Mengapa Menggunakan SeminarHub?
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="font-bold text-xl mb-3 text-red-900">
              SAW
            </h3>
            <p className="text-gray-600">
              Menghasilkan rekomendasi berdasarkan penjumlahan berbobot setiap kriteria.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="font-bold text-xl mb-3 text-red-900">
              Weighted Product
            </h3>
            <p className="text-gray-600">
              Menggunakan perkalian nilai setiap kriteria sesuai bobot preferensi.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="font-bold text-xl mb-3 text-red-900">
              TOPSIS
            </h3>
            <p className="text-gray-600">
              Memilih seminar terbaik berdasarkan solusi ideal positif dan negatif.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Home;