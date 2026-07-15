import { prisma } from "../lib/db.js";
import { getSkor } from "./sawService.js";

export async function hitungTOPSIS(userId: number) {

  const bobot = await prisma.bobot.findFirst({
  where:{
    userId,
  },
  orderBy:{
    createdAt:"desc",
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

  const data = [];

for (const s of seminar) {

  const rating =
    s.speakers.length > 0
      ? s.speakers.reduce(
          (total, sp) => total + (sp.speaker?.rating ?? 0),
          0
        ) / s.speakers.length
      : 0;

  const totalFasilitas = s.fasilitas.reduce(
    (total, f) => total + (f.fasilitas?.nilai_fasilitas ?? 0),
    0
  );

  let kategoriFasilitas = 1;

  if (totalFasilitas >= 9) kategoriFasilitas = 5;
  else if (totalFasilitas >= 7) kategoriFasilitas = 4;
  else if (totalFasilitas >= 5) kategoriFasilitas = 3;
  else if (totalFasilitas >= 3) kategoriFasilitas = 2;

  data.push({
    seminarId: s.id,
    nama: s.seminar_name,
    harga: await getSkor("Harga", Number(s.harga)),
    kuota: await getSkor("Kuota", s.kuota_tersedia),
    rating: await getSkor("Rating", rating),
    level: await getSkor("Level", s.level.nama_level),
    fasilitas: await getSkor("Fasilitas", kategoriFasilitas),
  });
}

console.log("=== DATA TOPSIS ===");
console.table(data);
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

  console.log("=== PEMBAGI ===");
console.log({
  pembagiHarga,
  pembagiKuota,
  pembagiRating,
  pembagiLevel,
  pembagiFasilitas,
});
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

  console.log("=== NORMALISASI ===");
console.table(normalisasi);
    // ===========================
  // Bobot
  // ===========================

  const total =
    bobot.bobot_harga +
    bobot.bobot_kuota +
    bobot.bobot_rating +
    bobot.bobot_level +
    bobot.bobot_fasilitas;

  const safeTotal = total || 1;

  const wHarga = bobot.bobot_harga / safeTotal;
  const wKuota = bobot.bobot_kuota / safeTotal;
  const wRating = bobot.bobot_rating / safeTotal;
  const wLevel = bobot.bobot_level / safeTotal;
  const wFasilitas = bobot.bobot_fasilitas / safeTotal;
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

  console.log("=== TERBOBOT ===");
console.table(terbobot);
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

  console.log("=== A+ ===");
console.table(idealPositif);

console.log("=== A- ===");
console.table(idealNegatif);
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

    console.log({
  seminar: x.nama,
  dPlus,
  dMinus,
  nilai,
});

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