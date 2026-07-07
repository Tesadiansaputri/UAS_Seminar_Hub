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

const SeminarList = () => {
  const navigate = useNavigate();

  const [seminars, setSeminars] = useState<Seminar[]>([]);
  const [filtered, setFiltered] = useState<Seminar[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getSeminars();
  }, []);

  useEffect(() => {
    const data = seminars.filter((item) =>
      item.seminar_name.toLowerCase().includes(search.toLowerCase())
    );

    setFiltered(data);
  }, [search, seminars]);

  const getSeminars = async () => {
    try {
      const res = await api.get("/seminars");
      setSeminars(res.data);
      setFiltered(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">

      <div className="max-w-7xl mx-auto py-10 px-6">

        <h1 className="text-4xl font-bold mb-8">
          Daftar Seminar
        </h1>

        <input
          type="text"
          placeholder="Cari seminar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded-lg p-3 mb-8"
        />

        <div className="grid md:grid-cols-3 gap-6">

          {filtered.map((item) => (

            <div
              key={item.id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition"
            >

              <div className="bg-red-900 text-white p-4">

                <h2 className="text-xl font-bold">

                  {item.seminar_name}

                </h2>

              </div>

              <div className="p-5">

                <p className="mb-2">

                  <b>Kategori :</b>

                  {" "}

                  {item.category.category_name}

                </p>

                <p className="mb-2">

                  <b>Level :</b>

                  {" "}

                  {item.level.nama_level}

                </p>

                <p className="mb-2">

                  <b>Harga :</b>

                  Rp {Number(item.harga).toLocaleString("id-ID")}

                </p>

                <p className="mb-5">

                  <b>Kuota :</b>

                  {item.kuota_tersedia}

                </p>

                <button
                  onClick={() => navigate(`/seminar/${item.id}`)}
                  className="w-full bg-red-900 text-white py-2 rounded-lg"
                >
                  Lihat Detail
                </button>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
};

export default SeminarList;