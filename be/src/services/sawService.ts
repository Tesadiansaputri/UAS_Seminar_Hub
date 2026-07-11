import { prisma } from "../lib/db.js";

async function getSkor(
  jenis: string,
  value: number | string
): Promise<number> {
  const data = await prisma.subKriteria.findMany({
    where: {
      jenis,
    },
  });

  if (jenis === "Level") {
    const hasil = data.find(
      (d) =>
        d.nama.toLowerCase() ===
        String(value).toLowerCase()
    );
    return hasil?.nilai ?? 0;
  }

  if (jenis === "Fasilitas") {
    const hasil = data.find(
      (d) => d.nilai === Number(value)
    );
    return hasil?.nilai ?? 0;
  }

  const angka = Number(value);

  for (const item of data) {
    if (
      item.min !== null &&
      item.max !== null &&
      angka >= item.min &&
      angka <= item.max
    ) {
      return item.nilai;
    }
  }

  return 0;
}

export async function hitungSAW(userId: number) {
  const bobot = await prisma.bobot.findFirst({
    where: {
      userId,
    },
  });

  if (!bobot) {
    throw new Error("Bobot belum diinput.");
  }

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

  const data = [];

  for (const s of seminars) {
    const rating =
      s.speakers.length > 0
        ? s.speakers[0]?.speaker?.rating ?? 0
        : 0;

    const totalFasilitas = s.fasilitas.reduce<number>(
      (total, f) => total + f.fasilitas.nilai_fasilitas,
      0
    );

    let kategoriFasilitas = 1;
    if (totalFasilitas >= 9) kategoriFasilitas = 5;
    else if (totalFasilitas >= 7) kategoriFasilitas = 4;
    else if (totalFasilitas >= 5) kategoriFasilitas = 3;
    else if (totalFasilitas >= 3) kategoriFasilitas = 2;

    const fasilitasSkor = await getSkor(
      "Fasilitas",
      kategoriFasilitas
    );

    const hargaSkor = await getSkor("Harga", Number(s.harga));
    const kuotaSkor = await getSkor("Kuota", s.kuota_tersedia);
    const ratingSkor = await getSkor("Rating", rating);
    const levelSkor = await getSkor("Level", s.level.nama_level);

    data.push({
      seminarId: s.id,
      nama: s.seminar_name,
      harga: hargaSkor,
      kuota: kuotaSkor,
      rating: ratingSkor,
      level: levelSkor,
      fasilitas: fasilitasSkor,
    });
    console.table({
  Seminar: s.seminar_name,
  Harga: hargaSkor,
  Kuota: kuotaSkor,
  Rating: ratingSkor,
  Level: levelSkor,
  Fasilitas: fasilitasSkor,
});
  }
  

  const minHarga = Math.min(...data.map((d) => d.harga));
  const maxKuota = Math.max(...data.map((d) => d.kuota));
  const maxRating = Math.max(...data.map((d) => d.rating));
  const maxLevel = Math.max(...data.map((d) => d.level));
  const maxFasilitas = Math.max(...data.map((d) => d.fasilitas));

  const hasil = data.map((d) => {
    const c1 = d.harga ? minHarga / d.harga : 0;
    const c2 = maxKuota ? d.kuota / maxKuota : 0;
    const c3 = maxRating ? d.rating / maxRating : 0;
    const c4 = maxLevel ? d.level / maxLevel : 0;
    const c5 = maxFasilitas ? d.fasilitas / maxFasilitas : 0;

    const w1 = bobot.bobot_harga / 100;
const w2 = bobot.bobot_kuota / 100;
const w3 = bobot.bobot_rating / 100;
const w4 = bobot.bobot_level / 100;
const w5 = bobot.bobot_fasilitas / 100;

const nilai =
  c1 * w1 +
  c2 * w2 +
  c3 * w3 +
  c4 * w4 +
  c5 * w5;

    return {
      seminarId: d.seminarId,
      nama: d.nama,
      nilai,
    };
  });

  
await prisma.hasil.deleteMany({
  where: {
    userId,
    metode: "SAW",
  },
});
return hasil
    .sort((a, b) => b.nilai - a.nilai)
    .map((item, index) => ({
      seminarId: item.seminarId,
      nama: item.nama,
      nilai: Number(item.nilai.toFixed(6)),
      ranking: index + 1,
    }));
}
