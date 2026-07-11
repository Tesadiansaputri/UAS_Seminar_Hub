import { prisma } from "../lib/db.js";

export const hitungSAW = async (userId: number) => {

  // ===============================
  // Ambil Bobot User
  // ===============================
  const bobot = await prisma.bobot.findFirst({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!bobot) {
    throw new Error("Bobot belum diinput.");
  }

  // ===============================
  // Ambil Semua Seminar
  // ===============================
  const seminars = await prisma.seminar.findMany({
    include: {
      level: true,

      fasilitas: {
        include: {
          fasilitas: true,
        },
      },

      speakers: {
        include: {
          speaker: true,
        },
      },
    },
  });

  if (seminars.length === 0) {
    throw new Error("Data seminar kosong.");
  }

  // ===============================
  // Bentuk Matriks Keputusan
  // ===============================

  const data = seminars.map((s) => {

    const rating =
      s.speakers.length > 0
        ? s.speakers[0]?.speaker?.rating ?? 0
        : 0;

    const fasilitas =
      s.fasilitas.reduce(
        (total, f) => total + f.fasilitas.nilai_fasilitas,
        0
      );

    return {

      seminarId: s.id,

      nama: s.seminar_name,

      harga: Number(s.harga),

      kuota: s.kuota_tersedia,

      rating,

      level: s.level.nilai_level,

      fasilitas,

    };
  });

  // ===============================
  // Cari Nilai Max & Min
  // ===============================

  const minHarga = Math.min(...data.map((d) => d.harga));

  const maxKuota = Math.max(...data.map((d) => d.kuota));

  const maxRating = Math.max(...data.map((d) => d.rating));

  const maxLevel = Math.max(...data.map((d) => d.level));

  const maxFasilitas = Math.max(...data.map((d) => d.fasilitas));

  // ===============================
  // Normalisasi SAW
  // ===============================

  const hasil = data.map((d) => {

    const c1 = minHarga / d.harga;

    const c2 = d.kuota / maxKuota;

    const c3 = d.rating / maxRating;

    const c4 = d.level / maxLevel;

    const c5 = d.fasilitas / maxFasilitas;

    const nilai =

      c1 * bobot.bobot_harga +

      c2 * bobot.bobot_kuota +

      c3 * bobot.bobot_rating +

      c4 * bobot.bobot_level +

      c5 * bobot.bobot_fasilitas;

    return {

      seminarId: d.seminarId,

      nama: d.nama,

      nilai,

    };
  });

  // ===============================
  // Ranking
  // ===============================

  hasil.sort((a, b) => b.nilai - a.nilai);

  const ranking = hasil.map((h, index) => ({

    ...h,

    ranking: index + 1,

  }));

  // ===============================
  // Hapus Hasil Lama
  // ===============================

  await prisma.hasil.deleteMany({

    where: {

      userId,

      metode: "SAW",

    },

  });

  // ===============================
  // Simpan ke Database
  // ===============================

  for (const h of ranking) {

    await prisma.hasil.create({

      data: {

        userId,

        seminarId: h.seminarId,

        metode: "SAW",

        nilai: h.nilai,

        ranking: h.ranking,

      },

    });

  }

  return ranking;

};