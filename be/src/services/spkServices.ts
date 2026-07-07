import { prisma } from "../lib/db.js";

export type MetodeSPK = "SAW" | "WP" | "TOPSIS";

interface SeminarKriteria {
  seminarId: number;
  seminar_name: string;
  harga: number;
  kuota: number;
  rating: number;
  level: number;
  fasilitas: number;
}

interface BobotWeights {
  bobot_harga: number;
  bobot_kuota: number;
  bobot_rating: number;
  bobot_level: number;
  bobot_fasilitas: number;
}

export interface HasilRanking {
  seminarId: number;
  seminar_name: string;
  nilai: number;
  ranking: number;
}

export async function getSeminarKriteria(): Promise<SeminarKriteria[]> {
  const seminars = await prisma.seminar.findMany({
    include: {
      level: true,
      speakers: {
        include: {
          speaker: {
            include: { rating: true },
          },
        },
      },
      fasilitas: true,
    },
  });

  return seminars.map((sem) => {
    const allRatings = sem.speakers.flatMap((ss) =>
      ss.speaker.rating.map((r) => r.rating)
    );

    const avgRating =
      allRatings.length > 0
        ? allRatings.reduce((a, b) => a + b, 0) / allRatings.length
        : 0;

    return {
      seminarId: sem.id,
      seminar_name: sem.seminar_name,
      harga: Number(sem.harga),
      kuota: sem.kuota_tersedia,
      rating: avgRating,
      level: sem.level.nilai_level,
      fasilitas: sem.fasilitas.length,
    };
  });
}

export function hitungSAW(
  data: SeminarKriteria[],
  bobot: BobotWeights
): HasilRanking[] {
  const minHarga = Math.min(...data.map((d) => d.harga)) || 1;
  const maxKuota = Math.max(...data.map((d) => d.kuota)) || 1;
  const maxRating = Math.max(...data.map((d) => d.rating)) || 1;
  const maxLevel = Math.max(...data.map((d) => d.level)) || 1;
  const maxFasilitas = Math.max(...data.map((d) => d.fasilitas)) || 1;

  return data
    .map((d) => {
      const normHarga = d.harga > 0 ? minHarga / d.harga : 0;
      const normKuota = d.kuota / maxKuota;
      const normRating = d.rating / maxRating;
      const normLevel = d.level / maxLevel;
      const normFasilitas = d.fasilitas / maxFasilitas;

      const nilai =
        normHarga * bobot.bobot_harga +
        normKuota * bobot.bobot_kuota +
        normRating * bobot.bobot_rating +
        normLevel * bobot.bobot_level +
        normFasilitas * bobot.bobot_fasilitas;

      return { seminarId: d.seminarId, seminar_name: d.seminar_name, nilai };
    })
    .sort((a, b) => b.nilai - a.nilai)
    .map((d, i) => ({ ...d, ranking: i + 1 }));
}

export function hitungWP(
  data: SeminarKriteria[],
  bobot: BobotWeights
): HasilRanking[] {
  const safe = (v: number) => (v > 0 ? v : 0.0001);

  const scores = data.map((d) => {
    const s =
      Math.pow(safe(d.harga), -bobot.bobot_harga) *
      Math.pow(safe(d.kuota), bobot.bobot_kuota) *
      Math.pow(safe(d.rating), bobot.bobot_rating) *
      Math.pow(safe(d.level), bobot.bobot_level) *
      Math.pow(safe(d.fasilitas), bobot.bobot_fasilitas);

    return { seminarId: d.seminarId, seminar_name: d.seminar_name, s };
  });

  const totalS = scores.reduce((sum, s) => sum + s.s, 0) || 1;

  return scores
    .map((s) => ({
      seminarId: s.seminarId,
      seminar_name: s.seminar_name,
      nilai: s.s / totalS,
    }))
    .sort((a, b) => b.nilai - a.nilai)
    .map((d, i) => ({ ...d, ranking: i + 1 }));
}

export function hitungTOPSIS(
  data: SeminarKriteria[],
  bobot: BobotWeights
): HasilRanking[] {
  const norm = (key: keyof SeminarKriteria) =>
    Math.sqrt(data.reduce((s, d) => s + Number(d[key]) ** 2, 0)) || 1;

  const sqHarga = norm("harga");
  const sqKuota = norm("kuota");
  const sqRating = norm("rating");
  const sqLevel = norm("level");
  const sqFasilitas = norm("fasilitas");

  const weighted = data.map((d) => ({
    seminarId: d.seminarId,
    seminar_name: d.seminar_name,
    harga: (d.harga / sqHarga) * bobot.bobot_harga,
    kuota: (d.kuota / sqKuota) * bobot.bobot_kuota,
    rating: (d.rating / sqRating) * bobot.bobot_rating,
    level: (d.level / sqLevel) * bobot.bobot_level,
    fasilitas: (d.fasilitas / sqFasilitas) * bobot.bobot_fasilitas,
  }));

  const idealPositif = {
    harga: Math.min(...weighted.map((w) => w.harga)),
    kuota: Math.max(...weighted.map((w) => w.kuota)),
    rating: Math.max(...weighted.map((w) => w.rating)),
    level: Math.max(...weighted.map((w) => w.level)),
    fasilitas: Math.max(...weighted.map((w) => w.fasilitas)),
  };

  const idealNegatif = {
    harga: Math.max(...weighted.map((w) => w.harga)),
    kuota: Math.min(...weighted.map((w) => w.kuota)),
    rating: Math.min(...weighted.map((w) => w.rating)),
    level: Math.min(...weighted.map((w) => w.level)),
    fasilitas: Math.min(...weighted.map((w) => w.fasilitas)),
  };

  const dist = (
    w: (typeof weighted)[number],
    ideal: typeof idealPositif
  ) =>
    Math.sqrt(
      (w.harga - ideal.harga) ** 2 +
        (w.kuota - ideal.kuota) ** 2 +
        (w.rating - ideal.rating) ** 2 +
        (w.level - ideal.level) ** 2 +
        (w.fasilitas - ideal.fasilitas) ** 2
    );

  return weighted
    .map((w) => {
      const dPositif = dist(w, idealPositif);
      const dNegatif = dist(w, idealNegatif);
      const nilai =
        dPositif + dNegatif > 0 ? dNegatif / (dPositif + dNegatif) : 0;

      return { seminarId: w.seminarId, seminar_name: w.seminar_name, nilai };
    })
    .sort((a, b) => b.nilai - a.nilai)
    .map((d, i) => ({ ...d, ranking: i + 1 }));
}

export async function hitungSPK(
  userId: number,
  metode: MetodeSPK
): Promise<HasilRanking[]> {
  const bobotUser = await prisma.bobot.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  if (!bobotUser) {
    throw new Error("Bobot belum diisi oleh user ini");
  }

  const bobot: BobotWeights = {
    bobot_harga: bobotUser.bobot_harga,
    bobot_kuota: bobotUser.bobot_kuota,
    bobot_rating: bobotUser.bobot_rating,
    bobot_level: (bobotUser as any).bobot_level,
    bobot_fasilitas: bobotUser.bobot_fasilitas,
  };

  const data = await getSeminarKriteria();

  if (metode === "SAW") return hitungSAW(data, bobot);
  if (metode === "WP") return hitungWP(data, bobot);
  return hitungTOPSIS(data, bobot);
}