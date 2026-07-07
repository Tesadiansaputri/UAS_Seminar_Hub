import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

interface Seminar {
  id: number;
  seminar_name: string;
  tanggal: string;
  harga: string;
  kuota_tersedia: number;

  category: {
    category_name: string;
  };

  level: {
    nama_level: string;
  };

  speakers: {
    speaker: {
      nama: string;
      bidang_keahlian: string;
    };
  }[];

  fasilitas: {
    fasilitas: {
      nama_fasilitas: string;
    };
  }[];
}

const DetailSeminar = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [seminar, setSeminar] = useState<Seminar | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDetail();
  }, []);

  const getDetail = async () => {
    try {
      const res = await api.get(`/seminars/${id}`);
      setSeminar(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-center">
        Loading...
      </div>
    );
  }

  if (!seminar) {
    return (
      <div className="p-10 text-center">
        Seminar tidak ditemukan.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10">

      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-8">

        <h1 className="text-4xl font-bold text-red-900 mb-8">
          {seminar.seminar_name}
        </h1>

        <div className="grid md:grid-cols-2 gap-8">

          <div>

            <h2 className="text-2xl font-semibold mb-4">
              Informasi Seminar
            </h2>

            <p className="mb-3">
              <b>Kategori :</b> {seminar.category.category_name}
            </p>

            <p className="mb-3">
              <b>Level :</b> {seminar.level.nama_level}
            </p>

            <p className="mb-3">
              <b>Harga :</b> Rp{" "}
              {Number(seminar.harga).toLocaleString("id-ID")}
            </p>

            <p className="mb-3">
              <b>Kuota :</b> {seminar.kuota_tersedia}
            </p>

            <p className="mb-3">
              <b>Tanggal :</b>{" "}
              {new Date(seminar.tanggal).toLocaleDateString("id-ID")}
            </p>

          </div>

          <div>

            <h2 className="text-2xl font-semibold mb-4">
              Pembicara
            </h2>

            <ul className="list-disc ml-5 mb-6">
              {seminar.speakers?.length ? (
                seminar.speakers.map((item, index) => (
                  <li key={index}>
                    {item.speaker.nama} ({item.speaker.bidang_keahlian})
                  </li>
                ))
              ) : (
                <li>Belum ada pembicara</li>
              )}
            </ul>

            <h2 className="text-2xl font-semibold mb-4">
              Fasilitas
            </h2>

            <ul className="list-disc ml-5">
              {seminar.fasilitas?.length ? (
                seminar.fasilitas.map((item, index) => (
                  <li key={index}>
                    {item.fasilitas.nama_fasilitas}
                  </li>
                ))
              ) : (
                <li>Belum ada fasilitas</li>
              )}
            </ul>

          </div>

        </div>

        <div className="flex justify-end gap-4 mt-10">

          <button
            onClick={() => navigate("/seminars")}
            className="px-6 py-3 rounded-lg bg-gray-500 text-white hover:bg-gray-600"
          >
            Kembali
          </button>

          <button
            onClick={() => navigate("/bobot")}
            className="px-6 py-3 rounded-lg bg-red-900 text-white hover:bg-red-800"
          >
            Gunakan Seminar Ini
          </button>

        </div>

      </div>

    </div>
  );
};

export default DetailSeminar;