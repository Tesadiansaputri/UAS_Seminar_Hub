import { prisma } from "../lib/db.js";
import { getSkor } from "./sawService.js";

export async function hitungWP(userId: number) {

  // =====================
  // Pastikan user sudah mengisi bobot
  // =====================

  const bobotUser = await prisma.bobot.findFirst({
    where: { userId },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!bobotUser) {
    throw new Error("Bobot belum diinput.");
  }

  // =====================
  // Ambil Kepentingan dari tabel kriteria
  // =====================

  const kriteria = await prisma.kriteria.findMany({
    orderBy: {
      kode: "asc",
    },
  });

  const getKriteriaWeight = (kode: string) => {
    const item = kriteria.find((k) => k.kode === kode);
    return item?.kepentingan ?? item?.bobot ?? 1;
  };

  const totalKepentingan = kriteria.reduce<number>(
    (a, b) => a + (b.kepentingan ?? b.bobot ?? 1),
    0
  );

  const totalWeight = totalKepentingan > 0 ? totalKepentingan : 5;
  const kHarga = getKriteriaWeight("K1");
  const kKuota = getKriteriaWeight("K2");
  const kRating = getKriteriaWeight("K3");
  const kLevel = getKriteriaWeight("K4");
  const kFasilitas = getKriteriaWeight("K5");

  // =====================
  // Ambil Data Seminar
  // =====================

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
  // Hitung Vektor S
  // =====================

  const nilaiS = [];

  for (const s of seminar) {

    const rating =
  s.speakers.length > 0
    ? (s.speakers[0]?.speaker?.rating ?? 0)
    : 0;

    const totalFasilitas = s.fasilitas.reduce(
      (total, f) =>
        total + (f.fasilitas?.nilai_fasilitas ?? 0),
      0
    );

    let kategoriFasilitas = 1;

    if (totalFasilitas >= 9) kategoriFasilitas = 5;
    else if (totalFasilitas >= 7) kategoriFasilitas = 4;
    else if (totalFasilitas >= 5) kategoriFasilitas = 3;
    else if (totalFasilitas >= 3) kategoriFasilitas = 2;

    const hargaSkor = await getSkor(
      "Harga",
      Number(s.harga)
    );

    const kuotaSkor = await getSkor(
      "Kuota",
      s.kuota_tersedia
    );

    const ratingSkor = await getSkor(
      "Rating",
      rating
    );

    const levelSkor = await getSkor(
      "Level",
      s.level.nama_level
    );

    const fasilitasSkor = await getSkor(
      "Fasilitas",
      kategoriFasilitas
    );
    console.table({
  Seminar: s.seminar_name,
  Harga: hargaSkor,
  Kuota: kuotaSkor,
  Rating: ratingSkor,
  Level: levelSkor,
  Fasilitas: fasilitasSkor,
});

console.table({
  wHarga: -(kHarga / totalWeight),
  wKuota: kKuota / totalWeight,
  wRating: kRating / totalWeight,
  wLevel: kLevel / totalWeight,
  wFasilitas: kFasilitas / totalWeight,
});

    const S =
  Math.pow(hargaSkor, -(kHarga / totalWeight)) *
  Math.pow(kuotaSkor, kKuota / totalWeight) *
  Math.pow(ratingSkor, kRating / totalWeight) *
  Math.pow(levelSkor, kLevel / totalWeight) *
  Math.pow(fasilitasSkor, kFasilitas / totalWeight);

    nilaiS.push({
      seminarId: s.id,
      nama: s.seminar_name,
      S,
    });
  }

  // =====================
  // Hitung Vektor V
  // =====================

  const totalS = nilaiS.reduce(
    (a, b) => a + b.S,
    0
  );

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