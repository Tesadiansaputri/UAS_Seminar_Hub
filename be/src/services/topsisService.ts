import { prisma } from "../lib/db.js";

export async function hitungTOPSIS(userId: number) {

  const bobot = await prisma.bobot.findFirst({
    where: {
      userId,
    },
  });

  if (!bobot) {
    throw new Error("Bobot belum diinput.");
  }

  const seminar = await prisma.seminar.findMany({
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

  if (seminar.length === 0) {
    throw new Error("Data seminar kosong.");
  }

  // ===========================
  // Matriks Keputusan
  // ===========================

  const data = seminar.map((s) => {

    const rating =
      s.speakers.length > 0
        ? s.speakers.reduce(
            (a, b) => a + b.speaker.rating,
            0
          ) / s.speakers.length
        : 0;

    return {

      seminarId: s.id,

      nama: s.seminar_name,

      harga: Number(s.harga),

      kuota: s.kuota_tersedia,

      rating,

      level: s.level.nilai_level,

      fasilitas: s.fasilitas.length,

    };

  });
    // ===========================
  // Pembagi Normalisasi
  // ===========================

  const pembagiHarga = Math.sqrt(
    data.reduce((sum, x) => sum + Math.pow(x.harga, 2), 0)
  );

  const pembagiKuota = Math.sqrt(
    data.reduce((sum, x) => sum + Math.pow(x.kuota, 2), 0)
  );

  const pembagiRating = Math.sqrt(
    data.reduce((sum, x) => sum + Math.pow(x.rating, 2), 0)
  );

  const pembagiLevel = Math.sqrt(
    data.reduce((sum, x) => sum + Math.pow(x.level, 2), 0)
  );

  const pembagiFasilitas = Math.sqrt(
    data.reduce((sum, x) => sum + Math.pow(x.fasilitas, 2), 0)
  );

  // ===========================
  // Matriks Normalisasi (R)
  // ===========================

  const normalisasi = data.map((x) => ({

    seminarId: x.seminarId,

    nama: x.nama,

    harga: x.harga / pembagiHarga,

    kuota: x.kuota / pembagiKuota,

    rating: x.rating / pembagiRating,

    level: x.level / pembagiLevel,

    fasilitas: x.fasilitas / pembagiFasilitas,

  }));
    // ===========================
  // Bobot
  // ===========================

  const totalBobot =
    bobot.bobot_harga +
    bobot.bobot_kuota +
    bobot.bobot_rating +
    bobot.bobot_level +
    bobot.bobot_fasilitas;

  const wHarga = bobot.bobot_harga / totalBobot;
  const wKuota = bobot.bobot_kuota / totalBobot;
  const wRating = bobot.bobot_rating / totalBobot;
  const wLevel = bobot.bobot_level / totalBobot;
  const wFasilitas = bobot.bobot_fasilitas / totalBobot;

  // ===========================
  // Matriks Normalisasi Berbobot (Y)
  // ===========================

  const terbobot = normalisasi.map((x) => ({

    seminarId: x.seminarId,

    nama: x.nama,

    harga: x.harga * wHarga,

    kuota: x.kuota * wKuota,

    rating: x.rating * wRating,

    level: x.level * wLevel,

    fasilitas: x.fasilitas * wFasilitas,

  }));
    // ===========================
  // Solusi Ideal Positif (A+)
  // ===========================

  const idealPositif = {

    // COST
    harga: Math.min(...terbobot.map((x) => x.harga)),

    // BENEFIT
    kuota: Math.max(...terbobot.map((x) => x.kuota)),

    rating: Math.max(...terbobot.map((x) => x.rating)),

    level: Math.max(...terbobot.map((x) => x.level)),

    fasilitas: Math.max(...terbobot.map((x) => x.fasilitas)),

  };

  // ===========================
  // Solusi Ideal Negatif (A-)
  // ===========================

  const idealNegatif = {

    // COST
    harga: Math.max(...terbobot.map((x) => x.harga)),

    // BENEFIT
    kuota: Math.min(...terbobot.map((x) => x.kuota)),

    rating: Math.min(...terbobot.map((x) => x.rating)),

    level: Math.min(...terbobot.map((x) => x.level)),

    fasilitas: Math.min(...terbobot.map((x) => x.fasilitas)),

  };
    // ===========================
  // Hitung Jarak ke A+ dan A-
  // ===========================

  const hasil = terbobot.map((x) => {

    const dPlus = Math.sqrt(

      Math.pow(x.harga - idealPositif.harga, 2) +
      Math.pow(x.kuota - idealPositif.kuota, 2) +
      Math.pow(x.rating - idealPositif.rating, 2) +
      Math.pow(x.level - idealPositif.level, 2) +
      Math.pow(x.fasilitas - idealPositif.fasilitas, 2)

    );

    const dMinus = Math.sqrt(

      Math.pow(x.harga - idealNegatif.harga, 2) +
      Math.pow(x.kuota - idealNegatif.kuota, 2) +
      Math.pow(x.rating - idealNegatif.rating, 2) +
      Math.pow(x.level - idealNegatif.level, 2) +
      Math.pow(x.fasilitas - idealNegatif.fasilitas, 2)

    );

    const nilai = dMinus / (dPlus + dMinus);

    return {

      seminarId: x.seminarId,

      nama: x.nama,

      nilai,

    };

  });

  // ===========================
  // Ranking
  // ===========================

  hasil.sort((a, b) => b.nilai - a.nilai);

  return hasil.map((item, index) => ({

    seminarId: item.seminarId,

    nilai: Number(item.nilai.toFixed(6)),

    ranking: index + 1,

  }));

}