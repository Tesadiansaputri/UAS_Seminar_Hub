import { prisma } from "../lib/db.js";

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

  const nilaiS = seminar.map((s) => {

    const rating =
      s.speakers.length > 0
        ? s.speakers.reduce(
            (a, b) => a + b.speaker.rating,
            0
          ) / s.speakers.length
        : 0;

    const fasilitas = s.fasilitas.length;

    const S =
      Math.pow(Number(s.harga), wHarga) *
      Math.pow(s.kuota_tersedia, wKuota) *
      Math.pow(rating, wRating) *
      Math.pow(s.level.nilai_level, wLevel) *
      Math.pow(fasilitas, wFasilitas);

    return {
      seminarId: s.id,
      nama: s.seminar_name,
      S,
    };
  });

  // =====================
  // Hitung Vektor V
  // =====================

  const totalS = nilaiS.reduce((a, b) => a + b.S, 0);

  const hasil = nilaiS
    .map((x) => ({
      seminarId: x.seminarId,
      nama: x.nama,
      nilai: x.S / totalS,
    }))
    .sort((a, b) => b.nilai - a.nilai)
    .map((x, index) => ({
      ...x,
      ranking: index + 1,
    }));

  return hasil;
}