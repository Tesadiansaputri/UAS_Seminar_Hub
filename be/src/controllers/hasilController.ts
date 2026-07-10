import { Request, Response } from "express";
import { prisma } from "../lib/db.js";
import { hitungSPK, MetodeSPK } from "../services/spkServices.js";

// ==============================
// GET ALL HASIL
// ==============================
export const getAllHasil = async (req: Request, res: Response) => {
  // ... (kode lama, gak diubah)
};

// ==============================
// GET HASIL BY ID
// ==============================
export const getHasilById = async (req: Request, res: Response) => {
  // ... (kode lama, gak diubah)
};

// ==============================
// CREATE HASIL
// ==============================
export const createHasil = async (req: Request, res: Response) => {
  // ... (kode lama, gak diubah)
};

// ==============================
// UPDATE HASIL
// ==============================
export const updateHasilById = async (req: Request, res: Response) => {
  // ... (kode lama, gak diubah)
};

// ==============================
// DELETE HASIL
// ==============================
export const deleteHasilById = async (req: Request, res: Response) => {
  // ... (kode lama, gak diubah)
};

// ==============================
// CALCULATE HASIL SPK (SAW/WP/TOPSIS)   
// ==============================
export const calculateHasil = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const metode = (req.query.metode as string)?.toUpperCase() as MetodeSPK;

    if (!["SAW", "WP", "TOPSIS"].includes(metode)) {
      return res.status(400).json({
        error: "Metode harus SAW, WP, atau TOPSIS",
      });
    }

    const ranking = await hitungSPK(Number(userId), metode);

    await prisma.hasil.deleteMany({
      where: { userId: Number(userId), metode },
    });

    await prisma.hasil.createMany({
      data: ranking.map((r) => ({
        userId: Number(userId),
        seminarId: r.seminarId,
        metode,
        nilai: r.nilai,
        ranking: r.ranking,
      })),
    });

    const hasilLengkap = await prisma.hasil.findMany({
      where: { userId: Number(userId), metode },
      include: { seminar: { include: { category: true, level: true } } },
      orderBy: { ranking: "asc" },
    });

    res.json(hasilLengkap);
  } catch (error: any) {
    res.status(500).json({
      error: error?.message || "Gagal menghitung hasil rekomendasi",
    });
  }
};