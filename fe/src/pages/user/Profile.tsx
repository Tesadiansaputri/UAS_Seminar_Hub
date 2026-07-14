import { useEffect, useState } from "react";
import {
  Activity,
  Ban,
  CalendarCheck,
  Check,
  Edit3,
  KeyRound,
  Lock,
  Mail,
  Save,
  ShieldCheck,
  Sparkles,
  User,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

const Profile = () => {
  const { user, login } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ nama: "", email: "" });
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [stats, setStats] = useState({ totalEvent: 0, aktif: 0, batal: 0 });

  useEffect(() => {
    if (user) {
      setForm({ nama: user.name, email: user.email });
    }
    fetchStats();
  }, [user]);

  const fetchStats = async () => {
    try {
      const res = await api.get("/registrations/my");
      setStats({
        totalEvent: res.data.length,
        aktif: res.data.filter((r: any) => r.status === "Aktif").length,
        batal: res.data.filter((r: any) => r.status === "Batal").length,
      });
    } catch (err) {
      console.error("Gagal fetch stats:", err);
    }
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");
    try {
      const res = await api.put(`/users/${user?.id}`, {
        nama: form.nama,
        email: form.email,
      });
      login(localStorage.getItem("token") || "", {
        ...user!,
        name: res.data.nama,
        email: res.data.email,
      });
      setSuccessMsg("Profil berhasil diupdate!");
      setEditMode(false);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || "Gagal update profil");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setErrorMsg("Password baru tidak cocok!");
      setLoading(false);
      return;
    }

    try {
      await api.put(`/users/${user?.id}/password`, {
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
      });
      setSuccessMsg("Password berhasil diubah!");
      setPasswordForm({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowPasswordForm(false);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || "Gagal ubah password");
    } finally {
      setLoading(false);
    }
  };

  const statsItems = [
    { label: "Total Event", value: stats.totalEvent, icon: CalendarCheck },
    { label: "Aktif", value: stats.aktif, icon: Activity },
    { label: "Batal", value: stats.batal, icon: Ban },
  ];

  return (
    <div className="mx-auto max-w-5xl">
      <div className="user-fade-in mb-8">
        <p className="inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-xs font-black text-[#b51f35]">
          <Sparkles size={14} />
          Akun Pengguna
        </p>
        <h1 className="mt-4 text-3xl font-black text-gray-950">
          Profil Saya
        </h1>
        <p className="mt-2 font-medium text-gray-500">
          Kelola informasi akun kamu
        </p>
      </div>

      {successMsg && (
        <div className="user-fade-in mb-5 flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-5 py-4 font-bold text-green-700">
          <Check size={18} /> {successMsg}
        </div>
      )}
      {errorMsg && (
        <div className="user-fade-in mb-5 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-5 py-4 font-bold text-red-700">
          <X size={18} /> {errorMsg}
        </div>
      )}

      <div className="grid gap-7 lg:grid-cols-[0.82fr_1.18fr]">
        <aside className="user-rise-card overflow-hidden rounded-lg border border-red-100 bg-white shadow-[0_18px_45px_rgba(139,30,43,0.08)]">
          <div className="user-shine relative overflow-hidden bg-gradient-to-br from-[#7f1020] via-[#9f1a2c] to-[#d93456] p-8 text-center text-white">
            <div className="absolute -right-14 -top-14 h-36 w-36 rounded-full bg-white/20 blur-2xl" />
            <div className="absolute -bottom-12 left-8 h-32 w-32 rounded-full bg-rose-200/20 blur-2xl" />

            <div className="relative z-10">
              <div className="user-float-soft mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full border border-white/25 bg-white/15 text-4xl font-black shadow-inner">
                {user?.name?.charAt(0) || "U"}
              </div>
              <div className="text-xl font-black">{user?.name}</div>
              <div className="mt-1 text-sm font-semibold text-white/75">
                {user?.email}
              </div>
              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-xs font-black uppercase tracking-wide">
                <ShieldCheck size={15} />
                {user?.role}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 border-b border-red-50">
            {statsItems.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="border-r border-red-50 p-5 text-center last:border-r-0"
                >
                  <Icon size={20} className="mx-auto mb-2 text-[#b51f35]" />
                  <div className="text-2xl font-black text-[#8b1e2b]">
                    {item.value}
                  </div>
                  <div className="mt-1 text-xs font-bold text-gray-500">
                    {item.label}
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        <main className="space-y-7">
          <section className="user-rise-card rounded-lg border border-red-100 bg-white p-6 shadow-[0_18px_45px_rgba(139,30,43,0.08)]">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-gray-950">
                  Informasi Akun
                </h2>
                <p className="mt-1 text-sm font-medium text-gray-500">
                  Data utama yang digunakan pada akun kamu.
                </p>
              </div>

              {!editMode && (
                <button
                  onClick={() => setEditMode(true)}
                  className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-red-100 bg-red-50 px-4 text-sm font-black text-[#8b1e2b] transition hover:bg-red-100"
                >
                  <Edit3 size={16} />
                  Edit Profil
                </button>
              )}
            </div>

            <div className="grid gap-5">
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-black text-gray-700">
                  <User size={16} className="text-[#b51f35]" />
                  Nama Lengkap
                </label>
                {editMode ? (
                  <input
                    value={form.nama}
                    onChange={(e) =>
                      setForm({ ...form, nama: e.target.value })
                    }
                    className="min-h-12 w-full rounded-lg border border-red-100 bg-red-50/50 px-4 font-semibold outline-none transition focus:border-[#b51f35] focus:bg-white focus:ring-4 focus:ring-red-100"
                  />
                ) : (
                  <div className="min-h-12 rounded-lg border border-gray-100 bg-gray-50 px-4 py-3 font-semibold text-gray-700">
                    {user?.name}
                  </div>
                )}
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-black text-gray-700">
                  <Mail size={16} className="text-[#b51f35]" />
                  Email
                </label>
                {editMode ? (
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    className="min-h-12 w-full rounded-lg border border-red-100 bg-red-50/50 px-4 font-semibold outline-none transition focus:border-[#b51f35] focus:bg-white focus:ring-4 focus:ring-red-100"
                  />
                ) : (
                  <div className="min-h-12 rounded-lg border border-gray-100 bg-gray-50 px-4 py-3 font-semibold text-gray-700">
                    {user?.email}
                  </div>
                )}
              </div>
            </div>

            {editMode && (
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <button
                  onClick={() => {
                    setEditMode(false);
                    setErrorMsg("");
                  }}
                  className="min-h-11 rounded-lg border border-gray-200 bg-white font-black text-gray-700 transition hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  onClick={handleSaveProfile}
                  disabled={loading}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#8b1e2b] font-black text-white transition hover:bg-[#741622] disabled:cursor-not-allowed disabled:bg-gray-300"
                >
                  <Save size={17} />
                  {loading ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            )}
          </section>

          <section className="user-rise-card rounded-lg border border-red-100 bg-white shadow-[0_18px_45px_rgba(139,30,43,0.08)]">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-red-50 p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-[#b51f35]">
                  <Lock size={20} />
                </div>
                <div>
                  <h2 className="font-black text-gray-950">
                    Ganti Password
                  </h2>
                  <p className="mt-1 text-sm font-medium text-gray-500">
                    Perbarui password akun kamu.
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setShowPasswordForm(!showPasswordForm);
                  setErrorMsg("");
                }}
                className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-red-100 bg-red-50 px-4 text-sm font-black text-[#8b1e2b] transition hover:bg-red-100"
              >
                <KeyRound size={16} />
                {showPasswordForm ? "Batal" : "Ubah Password"}
              </button>
            </div>

            {showPasswordForm && (
              <div className="user-fade-in p-6">
                {[
                  {
                    label: "Password Lama",
                    key: "oldPassword",
                    placeholder: "********",
                  },
                  {
                    label: "Password Baru",
                    key: "newPassword",
                    placeholder: "********",
                  },
                  {
                    label: "Konfirmasi Password Baru",
                    key: "confirmPassword",
                    placeholder: "********",
                  },
                ].map((field) => (
                  <div key={field.key} className="mb-5">
                    <label className="mb-2 block text-sm font-black text-gray-700">
                      {field.label}
                    </label>
                    <input
                      type="password"
                      value={
                        passwordForm[
                          field.key as keyof typeof passwordForm
                        ]
                      }
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          [field.key]: e.target.value,
                        })
                      }
                      placeholder={field.placeholder}
                      className="min-h-12 w-full rounded-lg border border-gray-200 bg-white px-4 font-semibold outline-none transition focus:border-[#b51f35] focus:ring-4 focus:ring-red-100"
                    />
                  </div>
                ))}

                <button
                  onClick={handleChangePassword}
                  disabled={loading}
                  className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#8b1e2b] font-black text-white transition hover:bg-[#741622] disabled:cursor-not-allowed disabled:bg-gray-300"
                >
                  <Save size={17} />
                  {loading ? "Menyimpan..." : "Simpan Password"}
                </button>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default Profile;
