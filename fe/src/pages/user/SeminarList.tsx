import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  CircleDollarSign,
  Layers3,
  Loader2,
  Search,
  Sparkles,
  Tags,
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

const SeminarList = () => {
  const navigate = useNavigate();

  const [seminars, setSeminars] = useState<Seminar[]>([]);
  const [filtered, setFiltered] = useState<Seminar[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

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
    } finally {
      setLoading(false);
    }
  };

  const categoryTotal = useMemo(() => {
    return new Set(seminars.map((item) => item.category.category_name)).size;
  }, [seminars]);

  return (
    <div className="overflow-hidden rounded-lg border border-red-100 bg-white shadow-[0_18px_45px_rgba(139,30,43,0.08)]">
      <section className="user-shine relative overflow-hidden bg-gradient-to-br from-[#7f1020] via-[#9f1a2c] to-[#d93456] px-6 py-12 text-white sm:px-10 lg:px-14">
        <div className="absolute -right-24 -top-32 h-80 w-80 rounded-full bg-white/20 blur-3xl" />
        <div className="absolute -bottom-32 left-10 h-72 w-72 rounded-full bg-rose-200/20 blur-3xl" />

        <div className="relative z-10 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div className="user-fade-in">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold">
              <Sparkles size={15} />
              Semua Seminar Tersedia
            </div>

            <h1 className="max-w-3xl text-4xl font-black leading-tight sm:text-5xl">
              Daftar Seminar
            </h1>

            <p className="mt-5 max-w-2xl text-base font-medium leading-8 text-white/90">
              Jelajahi semua seminar yang tersedia dan cari seminar yang paling
              sesuai dengan kebutuhanmu.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[
              { value: seminars.length, label: "Seminar", icon: BookOpen },
              { value: categoryTotal, label: "Kategori", icon: Tags },
              { value: filtered.length, label: "Ditampilkan", icon: Layers3 },
            ].map((stat, index) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.label}
                  className="user-rise-card rounded-lg border border-white/20 bg-white/10 p-4 text-center shadow-inner backdrop-blur"
                  style={{ animationDelay: `${index * 90}ms` }}
                >
                  <Icon size={22} className="mx-auto mb-3 text-white/85" />
                  <p className="text-2xl font-black">{stat.value}</p>
                  <p className="mt-1 text-xs font-bold text-white/75">
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-6 py-10 sm:px-10 lg:px-14">
        <div className="user-fade-in relative mb-9">
          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#b51f35]"
          />
          <input
            type="text"
            placeholder="Cari seminar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="min-h-14 w-full rounded-lg border border-red-100 bg-red-50/60 pl-12 pr-4 font-semibold text-gray-800 outline-none transition focus:border-[#b51f35] focus:bg-white focus:ring-4 focus:ring-red-100"
          />
        </div>

        {loading ? (
          <div className="flex min-h-44 items-center justify-center gap-3 rounded-lg border border-red-100 bg-red-50 font-bold text-[#8b1e2b]">
            <Loader2 size={22} className="animate-spin" />
            Loading...
          </div>
        ) : filtered.length ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((item, index) => (
              <article
                key={item.id}
                className="user-rise-card group overflow-hidden rounded-lg border border-red-100 bg-white shadow-[0_16px_34px_rgba(139,30,43,0.09)] transition duration-300 hover:-translate-y-2 hover:shadow-[0_24px_48px_rgba(139,30,43,0.16)]"
                style={{ animationDelay: `${index * 70}ms` }}
              >
                <div className="relative bg-[#b51f35] px-5 py-5 text-white">
                  <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 transition group-hover:scale-110">
                    <BookOpen size={20} />
                  </div>

                  <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-black uppercase text-white/85">
                    {item.category.category_name}
                  </span>
                  <h2 className="mt-4 min-h-16 pr-12 text-xl font-black leading-snug">
                    {item.seminar_name}
                  </h2>
                </div>

                <div className="p-5">
                  <div className="space-y-3 text-sm">
                    <p className="flex items-center justify-between gap-4 border-b border-gray-100 pb-3">
                      <b className="text-gray-500">Kategori :</b>
                      <span className="text-right font-bold text-gray-900">
                        {item.category.category_name}
                      </span>
                    </p>

                    <p className="flex items-center justify-between gap-4 border-b border-gray-100 pb-3">
                      <b className="text-gray-500">Level :</b>
                      <span className="text-right font-bold text-gray-900">
                        {item.level.nama_level}
                      </span>
                    </p>

                    <p className="flex items-center justify-between gap-4 border-b border-gray-100 pb-3">
                      <b className="inline-flex items-center gap-1 text-gray-500">
                        <CircleDollarSign size={15} />
                        Harga :
                      </b>
                      <span className="text-right font-black text-[#b51f35]">
                        Rp {Number(item.harga).toLocaleString("id-ID")}
                      </span>
                    </p>

                    <p className="flex items-center justify-between gap-4">
                      <b className="inline-flex items-center gap-1 text-gray-500">
                        <Users size={15} />
                        Kuota :
                      </b>
                      <span className="rounded-full bg-red-50 px-3 py-1 text-right font-black text-[#8b1e2b]">
                        {item.kuota_tersedia}
                      </span>
                    </p>
                  </div>

                  <button
                    onClick={() => navigate(`/seminar/${item.id}`)}
                    className="mt-6 flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#8b1e2b] font-extrabold text-white transition hover:bg-[#741622]"
                  >
                    Lihat Detail
                    <ArrowRight size={15} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-red-200 bg-red-50 p-10 text-center font-bold text-[#8b1e2b]">
            Seminar tidak ditemukan.
          </div>
        )}
      </section>
    </div>
  );
};

export default SeminarList;
