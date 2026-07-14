import { prisma } from "../lib/db.js";
import { getSkor } from "./sawService.js";

export async function hitungWP(userId: number) {
  const bobot = await prisma.bobot.findFirst({
    where: { userId },
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

  // =====================
  // Normalisasi Bobot
  // =====================

  const totalBobot =
    bobot.bobot_harga +
    bobot.bobot_kuota +
    bobot.bobot_rating +
    bobot.bobot_level +
    bobot.bobot_fasilitas;

  const wHarga = -(bobot.bobot_harga / totalBobot); // COST
  const wKuota = bobot.bobot_kuota / totalBobot;
  const wRating = bobot.bobot_rating / totalBobot;
  const wLevel = bobot.bobot_level / totalBobot;
  const wFasilitas = bobot.bobot_fasilitas / totalBobot;

  // =====================
  // Hitung Vektor S
  // =====================

  const nilaiS = [];

for (const s of seminar) {

 const rating =
  s.speakers.length > 0
    ? s.speakers[0]?.speaker?.rating ?? 0
    : 0;

  const totalFasilitas = s.fasilitas.reduce<number>(
    (total, f) => total + (f.fasilitas?.nilai_fasilitas ?? 0),
    0
  );

  let kategoriFasilitas = 1;

  if (totalFasilitas >= 9) kategoriFasilitas = 5;
  else if (totalFasilitas >= 7) kategoriFasilitas = 4;
  else if (totalFasilitas >= 5) kategoriFasilitas = 3;
  else if (totalFasilitas >= 3) kategoriFasilitas = 2;

  const hargaSkor = await getSkor("Harga", Number(s.harga));
  const kuotaSkor = await getSkor("Kuota", s.kuota_tersedia);
  const ratingSkor = await getSkor("Rating", rating);
  const levelSkor = await getSkor("Level", s.level.nama_level);
  const fasilitasSkor = await getSkor(
    "Fasilitas",
    kategoriFasilitas
  );
<<<<<<< HEAD
  console.table({
  Seminar: s.seminar_name,
  Harga: hargaSkor,
  Kuota: kuotaSkor,
  Rating: ratingSkor,
  Level: levelSkor,
  Fasilitas: fasilitasSkor,
});
=======
>>>>>>> 2a804531b307a9c706d0d1e6ef56240b5c9a79a6

  const S =
    Math.pow(hargaSkor, wHarga) *
    Math.pow(kuotaSkor, wKuota) *
    Math.pow(ratingSkor, wRating) *
    Math.pow(levelSkor, wLevel) *
    Math.pow(fasilitasSkor, wFasilitas);
<<<<<<< HEAD
    console.log({
  seminar: s.seminar_name,
  S,
});
=======
>>>>>>> 2a804531b307a9c706d0d1e6ef56240b5c9a79a6

  nilaiS.push({
    seminarId: s.id,
    nama: s.seminar_name,
    S,
  });
}

  // =====================
  // Hitung Vektor V
  // =====================

  const totalS = nilaiS.reduce((a, b) => a + b.S, 0);

  const hasil = nilaiS
  .map((x) => ({
    seminarId: x.seminarId,
    nama: x.nama,
    nilai: Number((x.S / totalS).toFixed(6)),
  }))
  .sort((a, b) => b.nilai - a.nilai)
  .map((x, index) => ({
    ...x,
    ranking: index + 1,
  }));

return hasil;
}